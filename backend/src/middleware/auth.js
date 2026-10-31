import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { prisma } from '../prisma.js';
import { forbidden, unauthorized } from '../utils/httpError.js';

// Preveri žeton JWT v glavi Authorization in zahtevi pripne prijavljenega uporabnika.
export async function requireAuth(req, _res, next) {
  try {
    const header = req.headers.authorization || '';
    const [type, token] = header.split(' ');
    if (type !== 'Bearer' || !token) throw unauthorized();

    let payload;
    try {
      payload = jwt.verify(token, config.jwtSecret);
    } catch {
      throw unauthorized('Seja je potekla, prijavite se znova');
    }

    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) throw unauthorized();
    if (user.isBlocked) throw forbidden('Vaš račun je blokiran');

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}

export function requireRole(role) {
  return (req, _res, next) => {
    if (req.user?.role !== role) return next(forbidden());
    next();
  };
}
