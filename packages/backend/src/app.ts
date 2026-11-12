import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { appConfig } from './config/env';

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

  return app;
};
