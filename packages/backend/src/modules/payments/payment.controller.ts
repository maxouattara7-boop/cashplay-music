import { Router, Request, Response } from 'express';
import { paymentService } from './payment.service';
import { requireAuth, AuthRequest } from '../auth/auth.middleware';

export const paymentRouter = Router();

// Initiation du paiement SasPay
paymentRouter.post('/initiate', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const result = await paymentService.initiatePayment({
      userId: req.user!.userId,
      ...req.body,
    });
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Réception du Webhook SasPay
paymentRouter.post('/webhook', async (req: Request, res: Response) => {
  try {
    const result = await paymentService.handleWebhook(req.body);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});
