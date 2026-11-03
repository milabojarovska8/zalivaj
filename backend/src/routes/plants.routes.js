import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth.js';
import { checkId } from '../middleware/params.js';
import { uploadPhoto } from '../middleware/upload.js';
import { validate } from '../middleware/validate.js';
import * as plantService from '../services/plant.service.js';

const router = Router();
router.use(requireAuth);
router.param('id', checkId);

// Obrazec se pošlje kot multipart, zato so vse vrednosti nizi: prazen niz pomeni "ni podatka".
const optionalText = (max) =>
  z.preprocess((v) => (typeof v === 'string' && v.trim() === '' ? null : v), z.string().trim().max(max).nullable().optional());
const optionalInt = z.preprocess(
  (v) => (v === '' || v === undefined || v === null ? null : Number(v)),
  z.number({ invalid_type_error: 'Vnesite število' }).int('Vnesite celo število').min(1, 'Vnesite pozitivno število').nullable(),
);

const plantSchema = z.object({
  name: z.string({ required_error: 'Polje je obvezno' }).trim().min(1, 'Polje je obvezno').max(100),
  species: optionalText(100),
  wateringEveryDays: z.preprocess(
    (v) => (v === '' || v === undefined ? undefined : Number(v)),
    z
      .number({ required_error: 'Polje je obvezno', invalid_type_error: 'Vnesite celo število' })
      .int('Vnesite celo število dni')
      .min(1, 'Pogostost mora biti vsaj 1 dan'),
  ),
  waterAmountMl: optionalInt.optional(),
  light: z.preprocess((v) => (v === '' ? null : v), z.enum(['LOW', 'MEDIUM', 'HIGH']).nullable().optional()),
  notes: optionalText(500),
});

const photoUrl = (req) => (req.file ? `/uploads/${req.file.filename}` : undefined);

router.get('/', async (req, res) => {
  res.json(await plantService.listOwn(req.user.id));
});

router.get('/:id', async (req, res) => {
  res.json(await plantService.getOwn(req.params.id, req.user.id));
});

router.post('/', uploadPhoto, validate(plantSchema), async (req, res) => {
  res.status(201).json(await plantService.create(req.user.id, req.body, photoUrl(req)));
});

router.put('/:id', uploadPhoto, validate(plantSchema), async (req, res) => {
  res.json(await plantService.update(req.params.id, req.user.id, req.body, photoUrl(req)));
});

router.delete('/:id', async (req, res) => {
  await plantService.remove(req.params.id, req.user.id);
  res.status(204).end();
});

export default router;
