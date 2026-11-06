import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth.js';
import { checkId } from '../middleware/params.js';
import { validate } from '../middleware/validate.js';
import * as taskService from '../services/task.service.js';

const router = Router();
router.use(requireAuth);
router.param('id', checkId);

const doneSchema = z.object({
  note: z.preprocess((v) => (typeof v === 'string' && v.trim() === '' ? null : v), z.string().trim().max(500).nullable().optional()),
});

router.get('/my', async (req, res) => {
  res.json(await taskService.dashboard(req.user.id));
});

router.patch('/:id/done', validate(doneSchema), async (req, res) => {
  res.json(await taskService.markDone(req.params.id, req.user.id, req.body.note));
});

export default router;
