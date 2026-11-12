import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app';

describe('Vérification du Serveur HTTP & Healthcheck', () => {
  const app = createApp();

  it('GET /health doit renvoyer 200 OK avec le nom de l application', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('OK');
    expect(response.body.app).toBe('CashPlay Music API');
    expect(response.body.currency).toBe('XOF');
  });
});
