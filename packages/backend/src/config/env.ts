import dotenv from 'dotenv';
dotenv.config();

export const appConfig = {
  appName: 'CashPlay Music API',
  environment: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 4000,
  apiPrefix: '/api/v1',
  
  // Devise principale : Francs CFA (XOF)
  currency: 'XOF',
  
  // Seuil minimal de retrait pour artistes et labels (en FCFA)
  minPayoutAmount: 500,

  // Modèle économique officiel CashPlay Music
  commission: {
    platformPercent: 20, // 20% commission prélevée par CashPlay Music
    creatorPercent: 80,  // 80% reversés à l'artiste ou partagés avec son label
  },
  
  // Grille tarifaire officielle du cahier des charges CashPlay Music
  pricing: {
    single: 2000,                           // 2 000 F CFA
    ep: 5000,                               // 5 000 F CFA (2 à 6 titres)
    album: 7000,                            // 7 000 F CFA (+ de 6 titres)
    globalDistributionSurplusPercent: 30,   // +30% pour distribution globale (+150 plateformes)
    labelAnnualSubscription: 15000,         // 15 000 F CFA / an
  },

  // Configuration SasPay
  saspay: {
    clientId: process.env.SASPAY_CLIENT_ID || 'sandbox_client_id',
    clientSecret: process.env.SASPAY_CLIENT_SECRET || 'sandbox_client_secret',
    baseUrl: process.env.SASPAY_BASE_URL || 'https://sandbox.saspay.me/api/v1',
    webhookSecret: process.env.SASPAY_WEBHOOK_SECRET || 'sandbox_webhook_secret',
  },

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'cashplay_music_super_secret_jwt_key_2026',
    expiresIn: '7d',
  },

  // Stockage S3 / R2
  storage: {
    bucket: process.env.STORAGE_BUCKET || 'cashplay-music-bucket',
    endpoint: process.env.STORAGE_ENDPOINT || '',
    accessKey: process.env.STORAGE_ACCESS_KEY || '',
    secretKey: process.env.STORAGE_SECRET_KEY || '',
  }
};
