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
  await upsertUser({ email: 'ana@zalivaj.test', name: 'Ana Novak', password: 'test123', location: 'Rožna dolina, blok 5' });
  await upsertUser({ email: 'luka@zalivaj.test', name: 'Luka Kovač', password: 'test123', location: 'Rožna dolina, blok 5' });
  await upsertUser({ email: 'marko@zalivaj.test', name: 'Marko Petek', password: 'test123', location: 'Rožna dolina, blok 5' });
  console.log('Testni podatki so naloženi.');
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
