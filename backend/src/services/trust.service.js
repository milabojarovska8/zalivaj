import { prisma } from '../prisma.js';

// Ocena zaupanja se izračuna ob zahtevi (ADR-0007): povprečna ocena in število zaključenih varstev.
export async function trustScores(sitterIds) {
  const ids = [...new Set(sitterIds)];
  const [ratings, completed] = await Promise.all([
    prisma.review.groupBy({ by: ['sitterId'], where: { sitterId: { in: ids } }, _avg: { rating: true } }),
    prisma.sittingRequest.groupBy({ by: ['sitterId'], where: { sitterId: { in: ids }, status: 'COMPLETED' }, _count: true }),
  ]);
  const result = {};
  for (const id of ids) {
    const avg = ratings.find((r) => r.sitterId === id)?._avg.rating;
    result[id] = {
      averageRating: avg == null ? null : Math.round(avg * 10) / 10,
      completedSittings: completed.find((c) => c.sitterId === id)?._count ?? 0,
    };
  }
  return result;
}
