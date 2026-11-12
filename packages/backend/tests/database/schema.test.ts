import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('Validation du Schéma de Base de Données Prisma', () => {
  const schemaPath = path.resolve(__dirname, '../../prisma/schema.prisma');

  it('doit posséder le fichier de schéma Prisma complet', () => {
    expect(fs.existsSync(schemaPath)).toBe(true);
  });

  it('doit déclarer les modèles essentiels de CashPlay Music', () => {
    const schemaContent = fs.readFileSync(schemaPath, 'utf-8');

    // Vérification des Enums
    expect(schemaContent).toContain('enum UserRole');
    expect(schemaContent).toContain('AUDITOR');
    expect(schemaContent).toContain('ARTIST');
    expect(schemaContent).toContain('LABEL');
    expect(schemaContent).toContain('ADMIN');

    expect(schemaContent).toContain('enum ReleaseType');
    expect(schemaContent).toContain('SINGLE');
    expect(schemaContent).toContain('EP');
    expect(schemaContent).toContain('ALBUM');

    expect(schemaContent).toContain('enum PaymentStatus');
    expect(schemaContent).toContain('PENDING');
    expect(schemaContent).toContain('COMPLETED');
    expect(schemaContent).toContain('FAILED');

    // Vérification des Modèles
    expect(schemaContent).toContain('model User');
    expect(schemaContent).toContain('model ArtistProfile');
    expect(schemaContent).toContain('model LabelProfile');
    expect(schemaContent).toContain('model LabelArtistRelation');
    expect(schemaContent).toContain('model Release');
    expect(schemaContent).toContain('model Track');
    expect(schemaContent).toContain('model Order');
    expect(schemaContent).toContain('model Payout');
    expect(schemaContent).toContain('model Affiliation');
    expect(schemaContent).toContain('model PurchasedTrack');
  });
});
