import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { appConfig } from '../../config/env';
import { UserRole } from '@prisma/client';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: UserRole;
  };
}

export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Accès non autorisé : Token manquant ou invalide' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, appConfig.jwt.secret) as { userId: string; role: UserRole };
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token expiré ou invalide' });
    return;
  }
};

export const requireRole = (...allowedRoles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      res.status(403).json({ error: 'Permissions insuffisantes pour cette action' });
      return;
    }
    next();
  };
};
