import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { generateSchedule } from '../src/services/schedule.service.js';
import { toDate, toDateStr, todayStr } from '../src/utils/dates.js';

const prisma = new PrismaClient();

async function upsertUser({ email, name, password, location, role = 'USER' }) {
  const passwordHash = await bcrypt.hash(password, 10);
  return prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, name, passwordHash, location, role },
  });
}

async function main() {
  await upsertUser({ email: 'admin@zalivaj.test', name: 'Administrator', password: 'admin123', location: 'Rožna dolina', role: 'ADMIN' });
  const ana = await upsertUser({ email: 'ana@zalivaj.test', name: 'Ana Novak', password: 'test123', location: 'Rožna dolina, blok 5' });
  const luka = await upsertUser({ email: 'luka@zalivaj.test', name: 'Luka Kovač', password: 'test123', location: 'Rožna dolina, blok 5' });
  await upsertUser({ email: 'marko@zalivaj.test', name: 'Marko Petek', password: 'test123', location: 'Rožna dolina, blok 5' });

  // Anine rastline (le ob prvem zagonu)
  if ((await prisma.plant.count({ where: { ownerId: ana.id } })) === 0) {
    await prisma.plant.createMany({
      data: [
        { ownerId: ana.id, name: 'Bazilika', species: 'Ocimum basilicum', wateringEveryDays: 2, waterAmountMl: 100, light: 'HIGH', notes: 'Ne zalivaj listov' },
        { ownerId: ana.id, name: 'Monstera', species: 'Monstera deliciosa', wateringEveryDays: 7, waterAmountMl: 300, light: 'MEDIUM' },
        { ownerId: ana.id, name: 'Fikus', species: 'Ficus benjamina', wateringEveryDays: 5, waterAmountMl: 200, light: 'MEDIUM' },
      ],
    });
  }

  // Primer odprte prošnje: čez teden dni za 10 dni, z baziliko in monstero
  if ((await prisma.sittingRequest.count({ where: { ownerId: ana.id } })) === 0) {
    const day = (offset) => {
      const d = new Date();
      d.setUTCHours(0, 0, 0, 0);
      d.setUTCDate(d.getUTCDate() + offset);
      return d;
    };
    const plants = await prisma.plant.findMany({ where: { ownerId: ana.id, name: { in: ['Bazilika', 'Monstera'] } } });
    await prisma.sittingRequest.create({
      data: {
        ownerId: ana.id,
        startDate: day(7),
        endDate: day(16),
        location: 'Rožna dolina, blok 5',
        note: 'Ključ je na recepciji',
        plants: { create: plants.map((p) => ({ plantId: p.id })) },
      },
    });
  }

  // Pretekla zaključena prošnja z oceno, da ima Luka oceno zaupanja
  if ((await prisma.review.count({ where: { sitterId: luka.id } })) === 0) {
    const plant = await prisma.plant.findFirst({ where: { ownerId: ana.id, name: 'Fikus' } });
    const past = await prisma.sittingRequest.create({
      data: {
        ownerId: ana.id,
        sitterId: luka.id,
        status: 'COMPLETED',
        startDate: new Date('2026-07-01T00:00:00.000Z'),
        endDate: new Date('2026-07-10T00:00:00.000Z'),
        location: 'Rožna dolina, blok 5',
        plants: { create: [{ plantId: plant.id }] },
      },
    });
    await prisma.review.create({
      data: { requestId: past.id, authorId: ana.id, sitterId: luka.id, rating: 5, comment: 'Odlično je poskrbel za rastline.' },
    });
  }

  // Aktivno varstvo za Luko (od predvčerajšnjim do čez 4 dni), da je nadzorna plošča takoj polna
  if ((await prisma.sittingRequest.count({ where: { sitterId: luka.id, status: 'ACTIVE' } })) === 0) {
    const today = toDate(todayStr());
    const day = (offset) => new Date(today.getTime() + offset * 86400000);
    const plants = await prisma.plant.findMany({ where: { ownerId: ana.id, name: { in: ['Bazilika', 'Fikus'] } } });
    const active = await prisma.sittingRequest.create({
      data: {
        ownerId: ana.id,
        sitterId: luka.id,
        status: 'ACTIVE',
        startDate: day(-2),
        endDate: day(4),
        location: 'Rožna dolina, blok 5',
        plants: { create: plants.map((p) => ({ plantId: p.id })) },
      },
    });
    await prisma.application.create({ data: { requestId: active.id, sitterId: luka.id, status: 'ACCEPTED', message: 'Z veseljem.' } });
    const schedule = generateSchedule(active.startDate, active.endDate, plants);
    await prisma.wateringTask.createMany({ data: schedule.map((t) => ({ ...t, requestId: active.id })) });
    // Prvo zalivanje bazilike je že opravljeno, prvo zalivanje fikusa pa zamujeno.
    const bazilika = plants.find((p) => p.name === 'Bazilika');
    await prisma.wateringTask.updateMany({
      where: { requestId: active.id, plantId: bazilika.id, dueDate: day(-2) },
      data: { status: 'DONE', doneAt: day(-2), note: 'Vse v redu.' },
    });
    console.log(`Aktivno varstvo: ${toDateStr(day(-2))} – ${toDateStr(day(4))}`);
  }

  console.log('Testni podatki so naloženi.');
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
