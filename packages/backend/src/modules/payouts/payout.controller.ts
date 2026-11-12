import { Router, Response } from 'express';
import { payoutService } from './payout.service';
import { requireAuth, requireRole, AuthRequest } from '../auth/auth.middleware';
import { UserRole } from '@prisma/client';

export const payoutRouter = Router();

payoutRouter.post(
  '/request',
  requireAuth,
  requireRole(UserRole.ARTIST, UserRole.LABEL),
  async (req: AuthRequest, res: Response) => {
    try {
      const payout = await payoutService.requestPayout(req.user!.userId, req.user!.role, req.body);
      res.status(201).json({ payout });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
);

payoutRouter.get(
  '/my-payouts',
  requireAuth,
  requireRole(UserRole.ARTIST, UserRole.LABEL),
  async (req: AuthRequest, res: Response) => {
    try {
      const payouts = await payoutService.getMyPayouts(req.user!.userId, req.user!.role);
      res.status(200).json({ payouts });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);
