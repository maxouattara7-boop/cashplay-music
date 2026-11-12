import './globals.css';
import type { Metadata } from 'next';
import { AuthProvider } from '../context/AuthContext';
import { AudioProvider } from '../context/AudioContext';

export const metadata: Metadata = {
  title: 'CashPlay Music — Distribuer, Vendre, Écouter',
  description: 'La plateforme musicale africaine qui valorise les œuvres. Vente directe et préventes par Mobile Money et carte bancaire.',
  icons: {
    icon: '/logo CashPlay Music vert blanc.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#0c0d0e] text-white font-sans antialiased selection:bg-[#008A3B] selection:text-white">
        <AuthProvider>
          <AudioProvider>
            {children}
          </AudioProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
