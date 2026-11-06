import { prisma } from '../prisma.js';
import { conflict, forbidden, notFound } from '../utils/httpError.js';
import { generateSchedule } from './schedule.service.js';
import { trustScores } from './trust.service.js';

export async function apply(requestId, sitterId, message) {
  const request = await prisma.sittingRequest.findUnique({ where: { id: requestId } });
  if (!request) throw notFound('Prošnja ne obstaja');
  if (request.ownerId === sitterId) throw forbidden('Na svojo prošnjo se ne morete prijaviti');
  if (request.status !== 'OPEN') throw conflict('Prijava je mogoča le na odprte prošnje');

  const existing = await prisma.application.findUnique({ where: { requestId_sitterId: { requestId, sitterId } } });
  if (existing && existing.status !== 'WITHDRAWN') throw conflict('Na to prošnjo ste se že prijavili');

  // Umaknjeno prijavo lahko varuh ponovno odda.
  if (existing) {
    return prisma.application.update({ where: { id: existing.id }, data: { status: 'PENDING', message } });
  }
  return prisma.application.create({ data: { requestId, sitterId, message } });
}

export async function withdraw(applicationId, sitterId) {
  const application = await prisma.application.findUnique({ where: { id: applicationId } });
  if (!application) throw notFound('Prijava ne obstaja');
  if (application.sitterId !== sitterId) throw forbidden();
  if (application.status !== 'PENDING') throw conflict('Umakniti je mogoče le prijavo, ki še čaka na odgovor');
  return prisma.application.update({ where: { id: applicationId }, data: { status: 'WITHDRAWN' } });
}

// Prijave na prošnjo – vidi jih le lastnik prošnje.
export async function listForRequest(requestId, ownerId) {
  const request = await prisma.sittingRequest.findUnique({ where: { id: requestId } });
  if (!request) throw notFound('Prošnja ne obstaja');
  if (request.ownerId !== ownerId) throw forbidden();

  const applications = await prisma.application.findMany({
    where: { requestId, status: { in: ['PENDING', 'ACCEPTED'] } },
    include: { sitter: { select: { id: true, name: true, location: true } } },
    orderBy: { createdAt: 'asc' },
  });
  const trust = await trustScores(applications.map((a) => a.sitterId));
  return applications.map((a) => ({ ...a, trust: trust[a.sitterId] }));
}

// Sprejem varuha: izbrana prijava ACCEPTED, ostale REJECTED, prošnja ACTIVE in ustvarjen urnik zalivanja –
// vse v eni transakciji (ADR-0006). Če en korak ne uspe, se ne shrani nobena sprememba.
export async function accept(applicationId, ownerId) {
  const application = await prisma.application.findUnique({ where: { id: applicationId }, include: { request: true } });
  if (!application) throw notFound('Prijava ne obstaja');
  const { request } = application;
  if (request.ownerId !== ownerId) throw forbidden();
  if (request.status !== 'OPEN') throw conflict('Za to prošnjo je varuh že izbran');
  if (application.status !== 'PENDING') throw conflict('Sprejeti je mogoče le prijavo, ki čaka na odgovor');

  return prisma.$transaction(async (tx) => {
    // Pogoj status = OPEN prepreči, da bi dve hkratni zahtevi sprejeli dva varuha.
    const updated = await tx.sittingRequest.updateMany({
      where: { id: request.id, status: 'OPEN' },
      data: { status: 'ACTIVE', sitterId: application.sitterId },
    });
    if (updated.count === 0) throw conflict('Za to prošnjo je varuh že izbran');

    await tx.application.update({ where: { id: applicationId }, data: { status: 'ACCEPTED' } });
    await tx.application.updateMany({
      where: { requestId: request.id, id: { not: applicationId }, status: 'PENDING' },
      data: { status: 'REJECTED' },
    });
    const plants = await tx.plant.findMany({ where: { requests: { some: { requestId: request.id } } } });
    const schedule = generateSchedule(request.startDate, request.endDate, plants);
    await tx.wateringTask.createMany({ data: schedule.map((t) => ({ ...t, requestId: request.id })) });

    return { requestId: request.id, status: 'ACTIVE', sitterId: application.sitterId, tasksCreated: schedule.length };
  });
}
