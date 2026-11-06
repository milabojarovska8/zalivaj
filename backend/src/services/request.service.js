import { prisma } from '../prisma.js';
import { badRequest, forbidden, notFound } from '../utils/httpError.js';
import { toDate, toDateStr, todayStr } from '../utils/dates.js';

const include = {
  plants: { include: { plant: true } },
  owner: { select: { id: true, name: true } },
  sitter: { select: { id: true, name: true } },
};

// Oblika prošnje v odgovoru API: datumi kot "YYYY-MM-DD", rastline kot navaden seznam.
export function serialize(r) {
  return {
    id: r.id,
    startDate: toDateStr(r.startDate),
    endDate: toDateStr(r.endDate),
    location: r.location,
    note: r.note,
    status: r.status,
    owner: r.owner,
    sitter: r.sitter,
    plants: r.plants.map((rp) => rp.plant),
    createdAt: r.createdAt,
  };
}

export async function create(ownerId, { startDate, endDate, location, note, plantIds }) {
  if (startDate < todayStr()) throw badRequest('Začetni datum ne sme biti v preteklosti', { startDate: 'Datum je v preteklosti' });
  if (endDate < startDate) throw badRequest('Končni datum mora biti po začetnem', { endDate: 'Končni datum je pred začetnim' });

  const ids = [...new Set(plantIds)];
  const ownCount = await prisma.plant.count({ where: { id: { in: ids }, ownerId } });
  if (ownCount !== ids.length) throw badRequest('Izberete lahko le svoje rastline', { plantIds: 'Izberete lahko le svoje rastline' });

  const request = await prisma.sittingRequest.create({
    data: {
      ownerId,
      startDate: toDate(startDate),
      endDate: toDate(endDate),
      location,
      note,
      plants: { create: ids.map((plantId) => ({ plantId })) },
    },
    include,
  });
  return serialize(request);
}

// Odprte prošnje drugih uporabnikov, z mojo morebitno prijavo.
export async function listOpen(userId) {
  const rows = await prisma.sittingRequest.findMany({
    where: { status: 'OPEN', ownerId: { not: userId } },
    include: { ...include, applications: { where: { sitterId: userId } } },
    orderBy: { startDate: 'asc' },
  });
  return rows.map((r) => ({ ...serialize(r), myApplication: r.applications[0] || null }));
}

export async function listOwn(ownerId) {
  const rows = await prisma.sittingRequest.findMany({ where: { ownerId }, include, orderBy: { startDate: 'desc' } });
  return rows.map(serialize);
}

// Prošnjo vidijo lastnik, sprejeti varuh, odprto prošnjo pa tudi drugi uporabniki.
export async function getVisible(id, user) {
  const r = await prisma.sittingRequest.findUnique({
    where: { id },
    include: { ...include, applications: { where: { sitterId: user.id } } },
  });
  if (!r) throw notFound('Prošnja ne obstaja');
  const allowed = r.ownerId === user.id || r.sitterId === user.id || r.status === 'OPEN';
  if (!allowed) throw forbidden();
  return {
    request: { ...serialize(r), myApplication: r.applications[0] || null },
    isOwner: r.ownerId === user.id,
  };
}
