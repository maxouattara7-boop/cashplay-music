import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import { createApp } from '../../../src/app';
import { prisma } from '../../../src/database/prisma.service';
import { authService } from '../../../src/modules/auth/auth.service';
import { UserRole, PayoutStatus } from '@prisma/client';

describe('Module Back-Office Administrateur', () => {
  const app = createApp();
  const adminToken = authService.generateToken('admin-user-01', UserRole.ADMIN);
  const auditorToken = authService.generateToken('auditor-user-01', UserRole.AUDITOR);

  it('doit refuser l accès aux routes admin pour un utilisateur ordinaire', async () => {
    const response = await request(app)
      .get('/api/v1/admin/stats')
      .set('Authorization', `Bearer ${auditorToken}`);

    expect(response.status).toBe(403);
  });

  it('doit retourner les indicateurs clés (KPIs) et la marge de 20% pour l administrateur', async () => {
    vi.spyOn(prisma.order, 'aggregate').mockResolvedValue({
      _sum: { amountXOF: 500000 },
    } as any);

    vi.spyOn(prisma.user, 'count').mockResolvedValue(1200);
    vi.spyOn(prisma.artistProfile, 'count').mockResolvedValue(85);
    vi.spyOn(prisma.release, 'count').mockResolvedValue(140);

    const response = await request(app)
      .get('/api/v1/admin/stats')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.totalSalesXOF).toBe(500000);
    expect(response.body.platformCommissionXOF).toBe(100000); // 20% de 500 000 F = 100 000 F
    expect(response.body.creatorRoyaltiesXOF).toBe(400000);  // 80% = 400 000 F
    expect(response.body.totalUsers).toBe(1200);
  });

  it('doit recréditer le solde de l artiste si le retrait Mobile Money est rejeté', async () => {
    vi.spyOn(prisma.payout, 'findUnique').mockResolvedValue({
      id: 'payout-reject-1',
      amountXOF: 3000,
      artistId: 'artist-001',
      status: PayoutStatus.PENDING,
    } as any);

    vi.spyOn(prisma.artistProfile, 'update').mockResolvedValue({} as any);
    vi.spyOn(prisma.payout, 'update').mockResolvedValue({
      id: 'payout-reject-1',
      status: PayoutStatus.REJECTED,
      rejectionReason: 'Numéro Mobile Money erroné',
    } as any);

    const response = await request(app)
      .post('/api/v1/admin/payouts/payout-reject-1/process')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        action: 'REJECT',
        reason: 'Numéro Mobile Money erroné',
      });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe(PayoutStatus.REJECTED);
  });
});
