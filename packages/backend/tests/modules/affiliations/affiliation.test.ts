import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import { createApp } from '../../../src/app';
import { prisma } from '../../../src/database/prisma.service';
import { authService } from '../../../src/modules/auth/auth.service';
import { UserRole } from '@prisma/client';

describe('Programme d Affiliation (Viralité : 5 filleuls acheteurs = 1 téléchargement gratuit)', () => {
  const app = createApp();
  const auditorToken = authService.generateToken('auditor-user-1', UserRole.AUDITOR);

  it('doit calculer les récompenses : 5 filleuls ayant acheté = 1 titre gratuit', async () => {
    vi.spyOn(prisma.user, 'findUnique').mockResolvedValue({
      id: 'auditor-user-1',
      referralCode: 'CP-AUDITOR-XYZ',
    } as any);

    vi.spyOn(prisma.affiliation, 'count').mockImplementation((args: any) => {
      if (args?.where?.hasPurchased) {
        return Promise.resolve(5); // 5 acheteurs
      }
      return Promise.resolve(8); // 8 inscrits au total
    });

    const response = await request(app)
      .get('/api/v1/affiliations/stats')
      .set('Authorization', `Bearer ${auditorToken}`);

    expect(response.status).toBe(200);
    expect(response.body.referralCode).toBe('CP-AUDITOR-XYZ');
    expect(response.body.totalReferrals).toBe(8);
    expect(response.body.purchasingReferrals).toBe(5);
    expect(response.body.freeDownloadsAvailable).toBe(1); // 5 / 5 = 1 titre offert
  });
});
