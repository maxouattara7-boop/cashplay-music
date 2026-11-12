import { Router, Response } from 'express';
import { authService } from './auth.service';
import { requireAuth, AuthRequest } from './auth.middleware';

export const authRouter = Router();

authRouter.post('/register', async (req, res: Response) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

authRouter.post('/login', async (req, res: Response) => {
  try {
    const result = await authService.login(req.body);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
});

authRouter.get('/me', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const profile = await authService.getProfile(req.user!.userId);
    res.status(200).json(profile);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});
