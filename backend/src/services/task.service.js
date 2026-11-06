import { prisma } from '../prisma.js';
import { badRequest, conflict, forbidden, notFound } from '../utils/httpError.js';
import { toDateStr, todayStr } from '../utils/dates.js';

// Opravilo v odgovoru API; "zamujeno" se izračuna ob branju (ADR-0007).
export function serializeTask(t, today = todayStr()) {
  const dueDate = toDateStr(t.dueDate);
  return {
    id: t.id,
    requestId: t.requestId,
    dueDate,
    status: t.status,
    overdue: t.status === 'PENDING' && dueDate < today,
    doneAt: t.doneAt,
    note: t.note,
    plant: t.plant,
  };
}

// Urnik prošnje – vidita ga lastnik in sprejeti varuh.
export async function listForRequest(requestId, userId) {
  const request = await prisma.sittingRequest.findUnique({ where: { id: requestId } });
  if (!request) throw notFound('Prošnja ne obstaja');
  if (request.ownerId !== userId && request.sitterId !== userId) throw forbidden();

  const tasks = await prisma.wateringTask.findMany({
    where: { requestId },
    include: { plant: true },
    orderBy: [{ dueDate: 'asc' }, { plant: { name: 'asc' } }],
  });
  const today = todayStr();
  return tasks.map((t) => serializeTask(t, today));
}

// Nadzorna plošča varuha (US-08): opravila aktivnih varstev, razdeljena na Zamujeno, Danes in Prihajajoče.
export async function dashboard(sitterId) {
  const tasks = await prisma.wateringTask.findMany({
    where: { request: { sitterId, status: 'ACTIVE' } },
    include: {
      plant: true,
      request: { select: { id: true, startDate: true, endDate: true, location: true, owner: { select: { name: true } } } },
    },
    orderBy: [{ dueDate: 'asc' }, { plant: { name: 'asc' } }],
  });

  const today = todayStr();
  const groups = { overdue: [], today: [], upcoming: [], done: [] };
  for (const t of tasks) {
    const task = {
      ...serializeTask(t, today),
      request: { id: t.request.id, ownerName: t.request.owner.name, location: t.request.location },
    };
    if (task.status === 'DONE') groups.done.push(task);
    else if (task.overdue) groups.overdue.push(task);
    else if (task.dueDate === today) groups.today.push(task);
    else groups.upcoming.push(task);
  }
  groups.done.reverse();
  return { date: today, ...groups };
}

// Odkljukanje opravila: le sprejeti varuh, le za danes ali pretekle dni.
export async function markDone(taskId, sitterId, note) {
  const task = await prisma.wateringTask.findUnique({ where: { id: taskId }, include: { request: true } });
  if (!task) throw notFound('Opravilo ne obstaja');
  if (task.request.sitterId !== sitterId) throw forbidden();
  if (task.request.status !== 'ACTIVE') throw conflict('Varstvo ni aktivno');
  if (task.status === 'DONE') throw conflict('Opravilo je že opravljeno');
  if (toDateStr(task.dueDate) > todayStr()) throw badRequest('Opravila ni mogoče označiti pred njegovim datumom');

  const updated = await prisma.wateringTask.update({
    where: { id: taskId },
    data: { status: 'DONE', doneAt: new Date(), note },
    include: { plant: true },
  });
  return serializeTask(updated);
}
