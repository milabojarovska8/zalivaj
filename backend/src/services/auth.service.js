import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { prisma } from '../prisma.js';
import { conflict, forbidden, unauthorized } from '../utils/httpError.js';

// Uporabnik brez gesla – geslo se nikoli ne vrne v odgovoru API.
export function publicUser(user) {
  const { id, name, email, role, location } = user;
  return { id, name, email, role, location };
}

function signToken(user) {
  return jwt.sign({ sub: user.id, role: user.role }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
}

export async function register({ name, email, password, location }) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw conflict('Ta e-pošta je že v uporabi');

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { name, email, passwordHash, location } });
  return { token: signToken(user), user: publicUser(user) };
}

export async function login({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } });
  const ok = user && (await bcrypt.compare(password, user.passwordHash));
  if (!ok) throw unauthorized('Napačna e-pošta ali geslo');
  if (user.isBlocked) throw forbidden('Vaš račun je blokiran');
  return { token: signToken(user), user: publicUser(user) };
}
