import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import { createApp } from '../../../src/app';
import { prisma } from '../../../src/database/prisma.service';
import { authService } from '../../../src/modules/auth/auth.service';
import { UserRole, PaymentStatus } from '@prisma/client';

describe('Module de Paiement SasPay (Mobile Money & Cartes)', () => {
  const app = createApp();
  const auditorToken = authService.generateToken('user-auditor-1', UserRole.AUDITOR);

  it('doit initier une commande d achat de morceau via SasPay', async () => {
    vi.spyOn(prisma.track, 'findUnique').mockResolvedValue({
      id: 'track-100',
      title: 'Dankan',
      priceXOF: 300,
    } as any);

    vi.spyOn(prisma.order, 'create').mockResolvedValue({
      id: 'order-12345',
      userId: 'user-auditor-1',
      trackId: 'track-100',
      amountXOF: 300,
      status: PaymentStatus.PENDING,
      providerRef: null,
    } as any);

    vi.spyOn(prisma.order, 'update').mockResolvedValue({
      id: 'order-12345',
      providerRef: 'SAS-123',
    } as any);

    const response = await request(app)
      .post('/api/v1/payments/initiate')
      .set('Authorization', `Bearer ${auditorToken}`)
      .send({
        trackId: 'track-100',
        paymentMethod: 'ORANGE_MONEY',
      });

    expect(response.status).toBe(201);
    expect(response.body.orderId).toBe('order-12345');
    expect(response.body.paymentUrl).toBeDefined();
  });

  it('doit traiter avec succès un webhook SasPay et débloquer l accès au son', async () => {
    vi.spyOn(prisma.order, 'findUnique').mockResolvedValue({
      id: 'order-12345',
      userId: 'user-auditor-1',
      trackId: 'track-100',
      amountXOF: 300,
      status: PaymentStatus.PENDING,
      track: {
        id: 'track-100',
        artistId: 'artist-profile-1',
      },
    } as any);

    vi.spyOn(prisma.order, 'update').mockResolvedValue({
      id: 'order-12345',
      status: PaymentStatus.COMPLETED,
    } as any);

    vi.spyOn(prisma.purchasedTrack, 'create').mockResolvedValue({
      id: 'purchased-1',
      userId: 'user-auditor-1',
      trackId: 'track-100',
      pricePaid: 300,
      createdAt: new Date(),
    });

    vi.spyOn(prisma.artistProfile, 'update').mockResolvedValue({} as any);
    vi.spyOn(prisma.track, 'update').mockResolvedValue({} as any);

    const webhookPayload = {
      event: 'payment.success',
      transactionId: 'SAS-REF-999',
      orderId: 'order-12345',
      amount: 300,
      status: 'SUCCESS',
      signature: 'valid_test_signature',
    };

    const response = await request(app)
      .post('/api/v1/payments/webhook')
      .send(webhookPayload);

    expect(response.status).toBe(200);
    expect(response.body.received).toBe(true);
    expect(response.body.status).toBe('COMPLETED');
  });
});
