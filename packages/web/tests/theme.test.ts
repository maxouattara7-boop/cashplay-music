import { describe, it, expect } from 'vitest';
import tailwindConfig from '../tailwind.config.js';

describe('Vérification de la Charte Graphique CashPlay Music (Brandboard)', () => {
  it('doit contenir les couleurs officielles CashPlay Music', () => {
    const colors = tailwindConfig.theme.extend.colors.cashplay;
    expect(colors.green).toBe('#008A3B');
    expect(colors.darkgreen).toBe('#006B2E');
    expect(colors.lightgreen).toBe('#E8F5ED');
    expect(colors.dark).toBe('#111111');
  });

  it('doit utiliser la typographie officielle Montserrat', () => {
    const fonts = tailwindConfig.theme.extend.fontFamily.sans;
    expect(fonts[0]).toBe('Montserrat');
  });
});
