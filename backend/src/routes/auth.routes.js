import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import * as authService from '../services/auth.service.js';

const router = Router();

const required = (msg = 'Polje je obvezno') => z.string({ required_error: msg }).trim().min(1, msg);

const registerSchema = z.object({
  name: required().max(100),
  email: required().email('Vnesite veljaven e-poštni naslov').toLowerCase(),
  password: z.string({ required_error: 'Polje je obvezno' }).min(6, 'Geslo mora imeti vsaj 6 znakov'),
  location: required().max(150),
});

const loginSchema = z.object({
  email: required().toLowerCase(),
  password: required(),
});

router.post('/register', validate(registerSchema), async (req, res) => {
  res.status(201).json(await authService.register(req.body));
});

router.post('/login', validate(loginSchema), async (req, res) => {
  res.json(await authService.login(req.body));
});

router.get('/me', requireAuth, (req, res) => {
  res.json(authService.publicUser(req.user));
});

export default router;
