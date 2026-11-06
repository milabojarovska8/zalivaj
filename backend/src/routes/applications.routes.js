import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { checkId } from '../middleware/params.js';
import * as applicationService from '../services/application.service.js';

const router = Router();
router.use(requireAuth);
router.param('id', checkId);

router.patch('/:id/withdraw', async (req, res) => {
  res.json(await applicationService.withdraw(req.params.id, req.user.id));
});

router.post('/:id/accept', async (req, res) => {
  res.json(await applicationService.accept(req.params.id, req.user.id));
});

export default router;
