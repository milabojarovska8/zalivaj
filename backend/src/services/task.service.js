import { prisma } from '../prisma.js';
import { forbidden, notFound } from '../utils/httpError.js';
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
