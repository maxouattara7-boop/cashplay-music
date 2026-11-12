import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import { createApp } from '../../../src/app';
import { prisma } from '../../../src/database/prisma.service';
import { authService } from '../../../src/modules/auth/auth.service';
import { UserRole, PayoutStatus } from '@prisma/client';

describe('Module de Retraits Mobile Money (Seuil 500 FCFA)', () => {
  const app = createApp();
  const artistToken = authService.generateToken('artist-user-1', UserRole.ARTIST);

  it('doit rejeter une demande de retrait inférieure au seuil minimal de 500 FCFA', async () => {
    vi.spyOn(prisma.artistProfile, 'findUnique').mockResolvedValue({
      id: 'artist-profile-1',
      userId: 'artist-user-1',
      withdrawableXOF: 1000,
    } as any);

    const response = await request(app)
      .post('/api/v1/payouts/request')
      .set('Authorization', `Bearer ${artistToken}`)
      .send({
        amountXOF: 300, // < 500 F CFA
        phoneNumber: '+22670123456',
        paymentMethod: 'ORANGE_MONEY',
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toContain('500');
  });

  it('doit accepter une demande de retrait valide de 500 FCFA ou plus', async () => {
    vi.spyOn(prisma.artistProfile, 'findUnique').mockResolvedValue({
      id: 'artist-profile-1',
      userId: 'artist-user-1',
      withdrawableXOF: 5000,
    } as any);

    vi.spyOn(prisma.artistProfile, 'update').mockResolvedValue({
      id: 'artist-profile-1',
      withdrawableXOF: 3000,
    } as any);

    vi.spyOn(prisma.payout, 'create').mockResolvedValue({
      id: 'payout-100',
      amountXOF: 2000,
      artistId: 'artist-profile-1',
      phoneNumber: '+22670123456',
      paymentMethod: 'ORANGE_MONEY',
      status: PayoutStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);

    const response = await request(app)
      .post('/api/v1/payouts/request')
      .set('Authorization', `Bearer ${artistToken}`)
      .send({
        amountXOF: 2000,
        phoneNumber: '+22670123456',
        paymentMethod: 'ORANGE_MONEY',
      });

    expect(response.status).toBe(201);
    expect(response.body.payout.id).toBe('payout-100');
    expect(response.body.payout.amountXOF).toBe(2000);
    expect(response.body.payout.status).toBe(PayoutStatus.PENDING);
  });
});
