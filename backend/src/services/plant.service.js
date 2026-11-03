import { prisma } from '../prisma.js';
import { removeUpload } from '../middleware/upload.js';
import { forbidden, notFound } from '../utils/httpError.js';

export function listOwn(ownerId) {
  return prisma.plant.findMany({ where: { ownerId }, orderBy: { createdAt: 'asc' } });
}

// Vrne rastlino, če obstaja in pripada uporabniku, sicer 404 ali 403.
export async function getOwn(id, ownerId) {
  const plant = await prisma.plant.findUnique({ where: { id } });
  if (!plant) throw notFound('Rastlina ne obstaja');
  if (plant.ownerId !== ownerId) throw forbidden();
  return plant;
}

export function create(ownerId, data, photoUrl) {
  return prisma.plant.create({ data: { ...data, ownerId, photoUrl } });
}

export async function update(id, ownerId, data, photoUrl) {
  const plant = await getOwn(id, ownerId);
  if (photoUrl) removeUpload(plant.photoUrl);
  return prisma.plant.update({ where: { id }, data: { ...data, ...(photoUrl && { photoUrl }) } });
}

export async function remove(id, ownerId) {
  const plant = await getOwn(id, ownerId);
  await prisma.plant.delete({ where: { id } });
  removeUpload(plant.photoUrl);
}
