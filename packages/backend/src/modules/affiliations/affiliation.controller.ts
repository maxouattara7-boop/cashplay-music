import { Router, Response } from 'express';
import { affiliationService } from './affiliation.service';
import { requireAuth, AuthRequest } from '../auth/auth.middleware';

export const affiliationRouter = Router();

affiliationRouter.get('/stats', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const stats = await affiliationService.getAffiliationStats(req.user!.userId);
    res.status(200).json(stats);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});
