import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth.js';
import { checkId } from '../middleware/params.js';
import { validate } from '../middleware/validate.js';
import * as requestService from '../services/request.service.js';

const router = Router();
router.use(requireAuth);
router.param('id', checkId);

const date = z
  .string({ required_error: 'Polje je obvezno' })
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Vnesite datum')
  .refine((s) => !Number.isNaN(Date.parse(s)), 'Neveljaven datum');

const requestSchema = z.object({
  startDate: date,
  endDate: date,
  location: z.string({ required_error: 'Polje je obvezno' }).trim().min(1, 'Polje je obvezno').max(150),
  note: z.preprocess((v) => (typeof v === 'string' && v.trim() === '' ? null : v), z.string().trim().max(500).nullable().optional()),
  plantIds: z
    .array(z.string().uuid('Neveljavna rastlina'), { required_error: 'Izberite vsaj eno rastlino' })
    .min(1, 'Izberite vsaj eno rastlino'),
});

router.post('/', validate(requestSchema), async (req, res) => {
  res.status(201).json(await requestService.create(req.user.id, req.body));
});

router.get('/mine', async (req, res) => {
  res.json(await requestService.listOwn(req.user.id));
});

router.get('/:id', async (req, res) => {
  const { request, isOwner } = await requestService.getVisible(req.params.id, req.user);
  res.json({ ...request, isOwner });
});

export default router;
