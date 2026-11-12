import { describe, it, expect } from 'vitest';
import { CashPlayColors, CashPlayFonts } from '../src/theme/colors';

describe('Thème Mobile CashPlay Music (Brandboard)', () => {
  it('doit exposer les couleurs officielles exactes', () => {
    expect(CashPlayColors.primary).toBe('#008A3B');
    expect(CashPlayColors.primaryDark).toBe('#006B2E');
    expect(CashPlayColors.primaryLight).toBe('#E8F5ED');
    expect(CashPlayColors.background).toBe('#0c0d0e');
  });

  it('doit déclarer la police de caractères Montserrat', () => {
    expect(CashPlayFonts.bold).toContain('Montserrat');
  });
});
