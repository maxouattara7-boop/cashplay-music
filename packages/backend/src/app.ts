import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { appConfig } from './config/env';
import { authRouter } from './modules/auth/auth.controller';
import { trackRouter, releaseRouter } from './modules/tracks/track.controller';
import { paymentRouter } from './modules/payments/payment.controller';
import { payoutRouter } from './modules/payouts/payout.controller';

export const createApp = (): Express => {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ extended: true, limit: '15mb' }));

  // Endpoint de statut / healthcheck
  app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({
      status: 'OK',
      app: appConfig.appName,
      timestamp: new Date().toISOString(),
      currency: appConfig.currency,
      version: '1.0.0'
    });
  });

  // Modules API v1
  app.use(`${appConfig.apiPrefix}/auth`, authRouter);
  app.use(`${appConfig.apiPrefix}/tracks`, trackRouter);
  app.use(`${appConfig.apiPrefix}/releases`, releaseRouter);
  app.use(`${appConfig.apiPrefix}/payments`, paymentRouter);
  app.use(`${appConfig.apiPrefix}/payouts`, payoutRouter);

  return app;
};
