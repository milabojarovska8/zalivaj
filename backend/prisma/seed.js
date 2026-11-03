import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

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
  await upsertUser({ email: 'luka@zalivaj.test', name: 'Luka Kovač', password: 'test123', location: 'Rožna dolina, blok 5' });
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

  console.log('Testni podatki so naloženi.');
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
