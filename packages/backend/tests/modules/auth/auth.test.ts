import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import { createApp } from '../../../src/app';
import { prisma } from '../../../src/database/prisma.service';

describe('Module Authentification & Rôles (RBAC)', () => {
  const app = createApp();

  it('doit permettre à un auditeur de créer un compte avec succès', async () => {
    // Mock user creation
    vi.spyOn(prisma.user, 'findFirst').mockResolvedValue(null);
    vi.spyOn(prisma.user, 'create').mockResolvedValue({
      id: 'mock-user-id-1',
      email: 'auditeur@test.com',
      phone: '+22670000001',
      fullName: 'Auditeur Test',
      passwordHash: 'hashed_password',
      role: 'AUDITOR',
      avatarUrl: null,
      googleId: null,
      isVerified: false,
      referralCode: 'REF-AUDITOR-1',
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);

    const response = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: 'auditeur@test.com',
        phone: '+22670000001',
        fullName: 'Auditeur Test',
        password: 'Password123!',
        role: 'AUDITOR',
      });

    expect(response.status).toBe(201);
    expect(response.body.user).toBeDefined();
    expect(response.body.user.role).toBe('AUDITOR');
    expect(response.body.token).toBeDefined();
  });

  it('doit refuser la connexion si le mot de passe est invalide', async () => {
    vi.spyOn(prisma.user, 'findFirst').mockResolvedValue(null);

    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({
        identifier: 'inconnu@test.com',
        password: 'MauvaisPassword',
      });

    expect(response.status).toBe(401);
    expect(response.body.error).toContain('Identifiants invalides');
  });

  it('doit rejeter l accès à /api/v1/auth/me sans token JWT valide', async () => {
    const response = await request(app).get('/api/v1/auth/me');
    expect(response.status).toBe(401);
  });
});
