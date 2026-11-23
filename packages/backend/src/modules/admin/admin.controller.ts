import { Router, Response } from 'express';
import { adminService } from './admin.service';
import { distributionExportService } from './distribution-export.service';
import { releaseService } from '../releases/release.service';
import { requireAuth, requireRole, AuthRequest } from '../auth/auth.middleware';
import { UserRole } from '@prisma/client';

export const adminRouter = Router();

// Toutes les routes admin exigent obligatoirement le rôle ADMIN
adminRouter.use(requireAuth, requireRole(UserRole.ADMIN));

adminRouter.get('/stats', async (_req: AuthRequest, res: Response) => {
  try {
    const stats = await adminService.getGlobalStats();
    res.status(200).json(stats);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

adminRouter.get('/releases/pending', async (_req: AuthRequest, res: Response) => {
  try {
    const releases = await adminService.getPendingReleases();
    res.status(200).json({ releases });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

adminRouter.get('/releases/:id/export', async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const release = await releaseService.getReleaseById(id);
    const manifest = distributionExportService.generateDeliveryManifest(release);
    res.status(200).json(manifest);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});

adminRouter.post('/payouts/:id/process', async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const { action, reason } = req.body;
    const result = await adminService.processPayout(id, action, reason);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});
