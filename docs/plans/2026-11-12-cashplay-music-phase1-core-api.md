# Plan d'Implémentation : CashPlay Music - Phase 1 (Socle Monorepo, Backend API, Médias & SasPay)

> **Directives pour l'exécutant :** Chaque étape utilise la syntaxe de case à cocher (`- [ ]`) pour assurer un suivi rigoureux. Suivre strictement le cycle TDD (test rouge -> code minimal -> test vert -> validation).

- **Objectif :** Mettre en place l'architecture monorepo, le schéma de données relationnel PostgreSQL, l'authentification multi-rôles, le service de streaming/stockage audio et le moteur de paiement SasPay avec gestion des commissions et retraits.
- **Architecture :** Monorepo TypeScript avec workspace modulaire, backend API Node.js / NestJS ou Fastify/Express structuré en modules découplés (`auth`, `users`, `tracks`, `releases`, `payments`, `payouts`, `affiliations`), ORM Prisma et files Redis BullMQ.
- **Stack Technique :** Node.js >= 20, TypeScript, Prisma ORM, PostgreSQL, Redis, Vitest / Jest, Supertest, passerelle SasPay SDK/HTTP.
- **Spécification de référence :** [`docs/specs/2026-11-12-cashplay-music-spec.md`](../specs/2026-11-12-cashplay-music-spec.md)

---

## Contraintes Globales & Invariants

1. **Isolation des responsabilités :** Le backend expose une API REST documentée (OpenAPI/Swagger) consommable identiquement par le Web Next.js et l'App Mobile Expo.
2. **Sécurité financière :** Les webhooks SasPay doivent vérifier la signature cryptographique et respecter une idempotence stricte (pas de double crédit d'achat ou de portefeuille).
3. **Gestion des prix et devises :** Tous les montants financiers sont manipulés sous forme d'entiers en Francs CFA (XOF) pour éviter toute approximation à virgule flottante.
4. **Protection des médias :** Les fichiers maîtres MP3 complets ne sont jamais distribués en accès public direct sans signature d'authentification valide. Les extraits de 30 secondes sont générés pour la pré-écoute anonyme.

---

## Tâches d'Implémentation

### Tâche 1 : Initialisation de l'espace de travail Monorepo & Configuration
**Fichiers concernés :**
- Création : `package.json`
- Création : `tsconfig.base.json`
- Création : `.gitignore`
- Création : `packages/backend/package.json`
- Création : `packages/backend/tsconfig.json`
- Tests : `packages/backend/tests/setup.test.ts`

**Contrat d'Interfaces :**
- *Consomme :* Environnement système Node.js >= 20, pnpm/npm.
- *Produit :* Structure de build, linting et scripts de test unifiés (`npm run test`, `npm run dev`).

**Étapes d'exécution :**
- [x] **Étape 1 : Écrire le test unitaire de validation de l'environnement** (`setup.test.ts` vérifie les variables d'environnement requises et la disponibilité de l'application).
- [x] **Étape 2 : Exécuter le test et constater l'échec initial** (`npx vitest run packages/backend/tests/setup.test.ts`).
- [x] **Étape 3 : Créer les fichiers de configuration de base du monorepo et du package backend**.
- [x] **Étape 4 : Confirmer le passage au vert du test d'initialisation**.
- [x] **Étape 5 : Valider la conformité de l'arborescence**.

---

### Tâche 2 : Modélisation Base de Données (Prisma & PostgreSQL)
**Fichiers concernés :**
- Création : `packages/backend/prisma/schema.prisma`
- Création : `packages/backend/src/database/prisma.service.ts`
- Tests : `packages/backend/tests/database/schema.test.ts`

**Contrat d'Interfaces :**
- *Consomme :* `DATABASE_URL` (PostgreSQL).
- *Produit :* Modèles typés Prisma Client : `User`, `ArtistProfile`, `LabelProfile`, `Release`, `Track`, `Transaction`, `Payout`, `Affiliation`.

**Étapes d'exécution :**
- [x] **Étape 1 : Rédiger le test de validation du schéma Prisma** (vérifie l'existence et les types des champs clés : rôles enum, calcul des splits label/artiste, statuts de transaction).
- [x] **Étape 2 : Exécuter le test et constater l'échec** (`npx vitest run packages/backend/tests/database/schema.test.ts`).
- [x] **Étape 3 : Rédiger le fichier `schema.prisma` avec toutes les tables, contraintes relationnelles et indexes d'optimisation**.
- [x] **Étape 4 : Générer le client Prisma (`npx prisma generate`) et valider le test unitaire**.
- [x] **Étape 5 : Refactoriser et valider la cohérence des clés étrangères**.

---

### Tâche 3 : Module d'Authentification Multi-Profils & Droits (RBAC)
**Fichiers concernés :**
- Création : `packages/backend/src/modules/auth/auth.service.ts`
- Création : `packages/backend/src/modules/auth/auth.controller.ts`
- Création : `packages/backend/src/modules/auth/jwt.strategy.ts`
- Création : `packages/backend/src/modules/auth/guards/roles.guard.ts`
- Tests : `packages/backend/tests/modules/auth/auth.test.ts`

**Contrat d'Interfaces :**
- *Consomme :* Prisma `User`, `ArtistProfile`, `LabelProfile`.
- *Produit :* Endpoints REST :
  - `POST /api/v1/auth/register` (Email, Phone, Rôle : AUDITEUR / ARTISTE / LABEL)
  - `POST /api/v1/auth/login` (Génération des Tokens JWT d'accès et Refresh)
  - `POST /api/v1/auth/claim-artist` (Revendication de profil artiste)
  - `GET /api/v1/auth/me` (Profil enrichi avec statut et balance financière)

**Étapes d'exécution :**
- [x] **Étape 1 : Écrire les tests unitaires et d'intégration de l'authentification** (inscription auditeur, inscription label, login invalide, génération JWT).
- [x] **Étape 2 : Vérifier l'échec des tests**.
- [x] **Étape 3 : Implémenter le service d'authentification avec hashage sécurisé (Argon2 / Bcrypt) et signature JWT**.
- [x] **Étape 4 : Confirmer le passage des tests au vert**.
- [x] **Étape 5 : Valider la protection des routes par le guard de rôles**.

---

### Tâche 4 : Module Catalogue & Médias Audio (Upload, Traitement, Extraits 30s)
**Fichiers concernés :**
- Création : `packages/backend/src/modules/media/storage.service.ts`
- Création : `packages/backend/src/modules/tracks/track.service.ts`
- Création : `packages/backend/src/modules/tracks/track.controller.ts`
- Création : `packages/backend/src/modules/releases/release.service.ts`
- Tests : `packages/backend/tests/modules/tracks/track.test.ts`

**Contrat d'Interfaces :**
- *Consomme :* Storage S3-compatible, ffmpeg (pour transcodage et découpe extrait 30s).
- *Produit :*
  - `POST /api/v1/releases` (Création Single / EP / Album avec tarification projet)
  - `POST /api/v1/tracks/upload` (Upload MP3 master + métadonnées)
  - `GET /api/v1/tracks/:id/stream-preview` (URL sécurisée vers l'extrait public de 30s)
  - `GET /api/v1/tracks/:id/stream-full` (Flux complet sécurisé pour utilisateur ayant acheté le titre)

**Étapes d'exécution :**
- [x] **Étape 1 : Écrire les tests du cycle de vie d'un morceau** (calcul de durée, vérification taille max 10 Mo, génération d'extrait audio court, restriction d'accès au son complet).
- [x] **Étape 2 : Vérifier l'échec des tests**.
- [x] **Étape 3 : Implémenter la validation audio, le stockage S3 et le découpage de l'extrait**.
- [x] **Étape 4 : Valider le passage de la suite de tests au vert**.

---

### Tâche 5 : Module de Paiement SasPay (Mobile Money & Cartes)
**Fichiers concernés :**
- Création : `packages/backend/src/modules/payments/saspay.client.ts`
- Création : `packages/backend/src/modules/payments/payment.service.ts`
- Création : `packages/backend/src/modules/payments/payment.controller.ts`
- Tests : `packages/backend/tests/modules/payments/payment.test.ts`

**Contrat d'Interfaces :**
- *Consomme :* API SasPay (Credentials Sandbox & Production : Orange Money, Moov, Wave, CB).
- *Produit :*
  - `POST /api/v1/payments/initiate` (Initiation du paiement d'un son, d'une distribution ou abonnement label)
  - `POST /api/v1/payments/webhook` (Réception et contrôle de la signature SasPay, attribution immédiate de la commande)
  - Calcul et ventilation automatique des commissions (part plateforme, part label, part artiste).

**Étapes d'exécution :**
- [x] **Étape 1 : Écrire le test simulant un webhook SasPay réussi et un webhook rejeté** (fausse signature, paiement déjà traité).
- [x] **Étape 2 : Vérifier l'échec des tests**.
- [x] **Étape 3 : Implémenter le client SasPay, le traitement de la transaction et la mise à jour des portefeuilles virtuels**.
- [x] **Étape 4 : Confirmer le passage des tests au vert**.

---

### Tâche 6 : Module de Retrait (Payouts) & Seuil 500 FCFA
**Fichiers concernés :**
- Création : `packages/backend/src/modules/payouts/payout.service.ts`
- Création : `packages/backend/src/modules/payouts/payout.controller.ts`
- Tests : `packages/backend/tests/modules/payouts/payout.test.ts`

**Contrat d'Interfaces :**
- *Consomme :* Portefeuille artiste / label, SasPay Payout API ou traitement batch admin.
- *Produit :*
  - `POST /api/v1/payouts/request` (Validation : solde disponible >= 500 FCFA, numéro Mobile Money valide)
  - `GET /api/v1/payouts/history` (Historique et statut des versements)
  - `PATCH /api/v1/admin/payouts/:id` (Approbation et exécution du versement par l'admin).

**Étapes d'exécution :**
- [x] **Étape 1 : Écrire le test unitaire du contrôle du seuil de retrait** (rejet si solde < 500 F, acceptation et débit si solde >= 500 F).
- [x] **Étape 2 : Vérifier l'échec du test**.
- [x] **Étape 3 : Implémenter la logique métier de retrait et la mise à jour des soldes**.
- [x] **Étape 4 : Valider le passage au vert**.

---

### Tâche 7 : Programme d'Affiliation & Système de Parrainage
**Fichiers concernés :**
- Création : `packages/backend/src/modules/affiliations/affiliation.service.ts`
- Création : `packages/backend/src/modules/affiliations/affiliation.controller.ts`
- Tests : `packages/backend/tests/modules/affiliations/affiliation.test.ts`

**Contrat d'Interfaces :**
- *Consomme :* Utilisateurs inscrits via code de parrainage et transactions finalisées.
- *Produit :*
  - Attribution automatique d'un crédit de téléchargement gratuit lorsque le seuil de 5 filleuls acheteurs est atteint.
  - Endpoint de consultation des statistiques de parrainage de l'auditeur.

**Étapes d'exécution :**
- [x] **Étape 1 : Écrire le test unitaire vérifiant l'attribution du téléchargement gratuit après 5 achats validés**.
- [x] **Étape 2 : Vérifier l'échec du test**.
- [x] **Étape 3 : Implémenter la détection d'achat premier filleul et l'incrémentation du compteur**.
- [x] **Étape 4 : Confirmer le succès des tests**.

---

## Phases Suivantes (Aperçu)

- **Phase 2 : Application Web Next.js 15 :**
  - Vitrine musicale, player persistant, navigation par genre, popup à 30 secondes, dashboards Auditeur/Artiste/Label et intégration SasPay côté client.
- **Phase 3 : Application Mobile React Native (Expo) :**
  - Lecteur natif d'arrière-plan (`react-native-track-player`), contrôles de lockscreen, module de téléchargement hors-ligne avec chiffrement local anti-piratage.
- **Phase 4 : Espace Back-Office Administrateur & Export Distribution Globale (+150 plateformes) :**
  - Modération des morceaux, contrôle qualité, validation des retraits et exports des métadonnées pour les DSPs mondiaux.
