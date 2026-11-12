import { describe, it, expect } from 'vitest';
import { appConfig } from '../src/config/env';

describe('Configuration et Environnement du Backend', () => {
  it('doit charger la configuration de base de CashPlay Music', () => {
    expect(appConfig).toBeDefined();
    expect(appConfig.appName).toBe('CashPlay Music API');
    expect(appConfig.port).toBe(4000);
    expect(appConfig.minPayoutAmount).toBe(500); // 500 FCFA minimum requis par le cahier des charges
  });

  it('doit exposer les tarifs officiels de distribution', () => {
    expect(appConfig.pricing.single).toBe(2000);
    expect(appConfig.pricing.ep).toBe(5000);
    expect(appConfig.pricing.album).toBe(7000);
    expect(appConfig.pricing.globalDistributionSurplusPercent).toBe(30);
    expect(appConfig.pricing.labelAnnualSubscription).toBe(15000);
  });
});
