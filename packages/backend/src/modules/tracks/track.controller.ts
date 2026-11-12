import { Router, Request, Response } from 'express';
import { trackService } from './track.service';
import { releaseService } from '../releases/release.service';
import { requireAuth, requireRole, AuthRequest } from '../auth/auth.middleware';
import { UserRole } from '@prisma/client';

export const trackRouter = Router();
export const releaseRouter = Router();

// Routes publiques Catalogue
trackRouter.get('/', async (req: Request, res: Response) => {
  try {
    const { genre, search, limit } = req.query;
    const tracks = await trackService.getPublicTracks({
      genre: genre as string,
      search: search as string,
      limit: limit ? Number(limit) : undefined,
    });
    res.status(200).json({ tracks });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

trackRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const track = await trackService.getTrackById(req.params.id);
    res.status(200).json(track);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});

// Ajout d'une piste (Artiste ou Label)
trackRouter.post('/', requireAuth, requireRole(UserRole.ARTIST, UserRole.LABEL), async (req: AuthRequest, res: Response) => {
  try {
    const track = await trackService.createTrack(req.user!.userId, req.body);
    res.status(201).json({ track });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Création d'un projet / Release (Single, EP, Album)
releaseRouter.post('/', requireAuth, requireRole(UserRole.ARTIST, UserRole.LABEL), async (req: AuthRequest, res: Response) => {
  try {
    const release = await releaseService.createRelease(req.user!.userId, req.user!.role, req.body);
    res.status(201).json({ release });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

releaseRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const release = await releaseService.getReleaseById(req.params.id);
    res.status(200).json(release);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});
