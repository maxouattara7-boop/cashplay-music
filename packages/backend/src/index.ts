import { createApp } from './app';
import { appConfig } from './config/env';

const app = createApp();

app.listen(appConfig.port, () => {
  console.log(`🚀 [CashPlay Music API] serveur démarré sur le port ${appConfig.port}`);
  console.log(`🌍 Devise configurée : ${appConfig.currency}`);
  console.log(`🎵 Seuil minimal de retrait : ${appConfig.minPayoutAmount} FCFA`);
});
