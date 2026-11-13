import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import AdminDashboardPage from '../src/app/admin/page';
import { AuthProvider } from '../src/context/AuthContext';
import { AudioProvider } from '../src/context/AudioContext';

describe('Tableau de Bord Administrateur CashPlay Music', () => {
  it('doit afficher les sections clés de modération et de marge 20%', () => {
    render(
      <AuthProvider>
        <AudioProvider>
          <AdminDashboardPage />
        </AudioProvider>
      </AuthProvider>
    );

    expect(screen.getByText(/Back-Office Administrateur/i)).toBeDefined();
    expect(screen.getByText(/Marge CashPlay \(20%\)/i)).toBeDefined();
    expect(screen.getByText(/Modération & Distribution/i)).toBeDefined();
  });
});
