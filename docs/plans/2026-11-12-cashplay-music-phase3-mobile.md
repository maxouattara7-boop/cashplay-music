# Plan d'Implémentation : CashPlay Music - Phase 3 (Application Mobile React Native Expo)

> **Directives pour l'exécutant :** Chaque étape utilise la syntaxe de case à cocher (`- [ ]`) pour assurer un suivi rigoureux. Suivre strictement le cycle TDD et la validation fonctionnelle.

- **Objectif :** Développer l'application mobile native multiplateforme (Android & iOS) CashPlay Music avec React Native Expo, lecteur audio d'arrière-plan avec commandes lockscreen, module de téléchargement hors-ligne chiffré anti-piratage (inspiré d'Empire Afrique / Spotify), section préventes exclusives et flux d'achat SasPay.
- **Architecture :** React Native avec Expo SDK (TypeScript), React Navigation (Bottom Tabs & Native Stack), Service Audio natif en tâche de fond, Chiffrement local des fichiers audio via `expo-file-system` et `expo-crypto`, synchronisation avec l'API `@cashplay/backend`.
- **Stack Technique :** Expo SDK, React Native, TypeScript, React Navigation, Vitest.
- **Spécification de référence :** [`docs/specs/2026-11-12-cashplay-music-spec.md`](../specs/2026-11-12-cashplay-music-spec.md)

---

## Contraintes Globales & Invariants Mobile

1. **Expérience en arrière-plan (Background Playback) :** L'audio doit continuer à jouer de manière ininterrompue lorsque l'utilisateur quitte l'application ou verrouille son téléphone.
2. **Anti-piratage & Chiffrement Hors-Ligne (Inspiré d'Empire Afrique) :**
   - Les fichiers MP3 complets achetés ne doivent **JAMAIS** être enregistrés en clair dans les dossiers partagés du téléphone (`Downloads`, `Music`, `DCIM`).
   - Le flux audio est téléchargé dans le sandbox privé de l'application et chiffré/scellé localement. Seule l'application CashPlay Music peut le déchiffrer en mémoire lors de la lecture hors-ligne.
3. **Trigger 30 secondes :** Pour les utilisateurs anonymes, l'écoute d'extraits audio déclenche le popup d'invitation à créer un compte à 30 secondes cumulées.
4. **Charte Graphique Mobile :** Vert CashPlay `#008A3B`, typographie Montserrat, icônes unifiées.

---

## Tâches d'Implémentation

### Tâche 1 : Initialisation du Projet Mobile Expo & Thème
**Fichiers :**
- Création : `packages/mobile/package.json`
- Création : `packages/mobile/app.json`
- Création : `packages/mobile/tsconfig.json`
- Création : `packages/mobile/src/theme/colors.ts`
- Tests : `packages/mobile/tests/theme.test.ts`

**Contrat d'Interfaces :**
- *Consomme :* Logos CashPlay Music, splash screen et palette officielle.
- *Produit :* Configuration Expo pour Android et iOS, thème de couleurs et typographie de marque.

**Étapes d'exécution :**
- [x] **Étape 1 : Rédiger le test de conformité du thème mobile (Brandboard)**.
- [x] **Étape 2 : Vérifier l'échec initial du test**.
- [x] **Étape 3 : Configurer le package Expo et les constantes de design**.
- [x] **Étape 4 : Confirmer le passage au vert du test**.

---

### Tâche 2 : Module de Chiffrement & Téléchargement Hors-Ligne Anti-Piratage (Offline Vault)
**Fichiers :**
- Création : `packages/mobile/src/services/offlineVault.service.ts`
- Tests : `packages/mobile/tests/offlineVault.test.ts`

**Contrat d'Interfaces :**
- *Consomme :* URL du flux audio sécurisé et identifiant du titre.
- *Produit :*
  - `downloadEncryptedTrack(trackId: string, audioStreamUrl: string) -> Promise<string>` (Sauvegarde locale chiffrée in-app)
  - `isDownloaded(trackId: string) -> boolean`
  - `getOfflinePlayableUri(trackId: string) -> Promise<string>`
  - `removeOfflineTrack(trackId: string) -> Promise<void>`

**Étapes d'exécution :**
- [x] **Étape 1 : Rédiger le test unitaire du coffre-fort audio chiffré (vérifie qu'aucun fichier en clair n'est lisible de l'extérieur)**.
- [x] **Étape 2 : Vérifier l'échec du test**.
- [x] **Étape 3 : Implémenter le service `OfflineVaultService` avec chiffrement de clé locale**.
- [x] **Étape 4 : Valider le passage au vert des tests**.

---

### Tâche 3 : Service Audio & Contrôles d'Arrière-Plan (Background Audio Manager)
**Fichiers :**
- Création : `packages/mobile/src/services/audioManager.service.ts`
- Création : `packages/mobile/src/context/MobileAudioContext.tsx`
- Tests : `packages/mobile/tests/audioManager.test.ts`

**Contrat d'Interfaces :**
- *Consomme :* Pistes en ligne (extraits 30s) ou fichiers chiffrés in-app hors-ligne.
- *Produit :*
  - Gestion de la lecture en tâche de fond, notification multimédia (titre, artiste, pochette, play/pause).
  - Décompte cumulé des 30 secondes d'écoute pour le visiteur anonyme.

**Étapes d'exécution :**
- [x] **Étape 1 : Écrire le test unitaire du gestionnaire audio mobile**.
- [x] **Étape 2 : Vérifier l'échec initial**.
- [x] **Étape 3 : Implémenter le gestionnaire audio mobile et le contexte global**.
- [x] **Étape 4 : Confirmer la réussite des tests**.

---

### Tâche 4 : Écran d'Accueil, Préventes J-14 & Mini-Lecteur Flottant
**Fichiers :**
- Création : `packages/mobile/src/screens/HomeScreen.tsx`
- Création : `packages/mobile/src/components/MiniPlayer.tsx`
- Création : `packages/mobile/src/components/ConversionModal.tsx`
- Tests : `packages/mobile/tests/homeScreen.test.ts`

**Contrat d'Interfaces :**
- *Consomme :* API `/api/v1/tracks`, `/api/v1/releases`.
- *Produit :* Carrousel Préventes (J-14), Grille Nouveautés, Mini-lecteur persistant au-dessus de la barre d'onglets, modal popup à 30 secondes.

**Étapes d'exécution :**
- [x] **Étape 1 : Écrire le test d'affichage et de filtrage de l'écran d'accueil**.
- [x] **Étape 2 : Vérifier l'échec du test**.
- [x] **Étape 3 : Développer l'interface mobile HomeScreen et le MiniPlayer**.
- [x] **Étape 4 : Valider le passage au vert**.

---

### Tâche 5 : Écran Bibliothèque « Mes Sons » (Mode 100% Hors-Ligne)
**Fichiers :**
- Création : `packages/mobile/src/screens/LibraryScreen.tsx`
- Tests : `packages/mobile/tests/libraryScreen.test.ts`

**Contrat d'Interfaces :**
- *Consomme :* `OfflineVaultService`, liste des titres achetés.
- *Produit :* Liste des morceaux sauvegardés localement, badge "Téléchargé / Hors-ligne", lecture sans Internet, indicateur de stockage utilisé.

**Étapes d'exécution :**
- [x] **Étape 1 : Écrire le test de la bibliothèque mobile et du filtre hors-ligne**.
- [x] **Étape 2 : Vérifier l'échec initial**.
- [x] **Étape 3 : Implémenter l'écran LibraryScreen**.
- [x] **Étape 4 : Confirmer le succès des tests**.

---

### Tâche 6 : Écran Profil, Affiliation Viral & Flux Achat SasPay Mobile
**Fichiers :**
- Création : `packages/mobile/src/screens/ProfileScreen.tsx`
- Création : `packages/mobile/src/navigation/AppNavigator.tsx`
- Création : `packages/mobile/App.tsx`
- Tests : `packages/mobile/tests/navigation.test.ts`

**Contrat d'Interfaces :**
- *Consomme :* Contextes Auth & Audio, API SasPay.
- *Produit :*
  - Navigation par onglets (Accueil, Préventes, Mes Sons, Profil).
  - Code de parrainage avec partage natif (WhatsApp / SMS / Copier).
  - Modal d'achat Mobile Money (Orange Money, Moov, Wave).

**Étapes d'exécution :**
- [x] **Étape 1 : Écrire le test d'intégration de la navigation globale de l'app mobile**.
- [x] **Étape 2 : Vérifier l'échec du test**.
- [x] **Étape 3 : Implémenter le navigateur complet et le point d'entrée `App.tsx`**.
- [x] **Étape 4 : Confirmer le passage au vert**.
