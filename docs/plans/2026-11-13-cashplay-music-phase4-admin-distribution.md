# Plan d'Implémentation : CashPlay Music - Phase 4 (Espace Back-Office Administrateur & Export Distribution Globale)

> **Directives pour l'exécutant :** Chaque étape utilise la syntaxe de case à cocher (`- [ ]`) pour assurer un suivi rigoureux. Suivre strictement le cycle TDD et la validation visuelle et fonctionnelle.

- **Objectif :** Développer le module d'administration globale CashPlay Music : modération du catalogue, validation et export des métadonnées pour la Distribution Globale (+150 plateformes dont Spotify/Apple Music sous 14 jours), approbation des retraits Mobile Money (seuil 500 FCFA) et supervision des KPI financiers (20% plateforme / 80% créateurs).
- **Architecture :**
  - **Backend API :** Module `admin` dédié (`admin.service.ts`, `admin.controller.ts`), gardé par le rôle strict `ADMIN`, endpoints de modération, d'export DDEX/JSON pour distributeurs B2B et de validation des retraits.
  - **Interface Web :** Section `/admin` sécurisée dans Next.js 15, avec tableau de bord analytique, tableau de modération des projets, gestionnaire des exports DSPs mondiaux et console de paiement des retraits.
- **Stack Technique :** Node.js, Express, TypeScript, Prisma ORM, Next.js 15, Tailwind CSS, Lucide Icons, Vitest.
- **Spécification de référence :** [`docs/specs/2026-11-12-cashplay-music-spec.md`](../specs/2026-11-12-cashplay-music-spec.md)

---

## Contraintes Globales & Invariants Admin

1. **Sécurité RBAC Stricte :** Toutes les routes API `/api/v1/admin/*` et les pages `/admin/*` doivent obligatoirement exiger le rôle `ADMIN`.
2. **Standard de Distribution Globale :** L'export de distribution globale doit formater les données selon les standards internationaux de l'industrie musicale : ISRC pour les pistes, UPC/EAN pour les releases, pochette haute résolution et liens audio masters.
3. **Traçabilité Financière :** Lorsqu'un retrait Mobile Money est rejeté par l'admin, le solde déduit doit être immédiatement et atomiquement recrédité sur le compte de l'artiste ou du label.
4. **Calcul de Marge :** Affichage transparent des commissions encaissées (20% sur chaque transaction) et du volume d'affaires total.

---

## Tâches d'Implémentation

### Tâche 1 : Module Backend Admin & Endpoints de Modération
**Fichiers :**
- Création : `packages/backend/src/modules/admin/admin.service.ts`
- Création : `packages/backend/src/modules/admin/admin.controller.ts`
- Tests : `packages/backend/tests/modules/admin/admin.test.ts`

**Contrat d'Interfaces :**
- *Consomme :* Prisma `User`, `Release`, `Track`, `Payout`, `Order`.
- *Produit :* Endpoints protégés par `requireRole(UserRole.ADMIN)` :
  - `GET /api/v1/admin/stats` (KPIs : chiffre d'affaires, marge 20%, total écoutes, total créateurs)
  - `GET /api/v1/admin/releases/pending` (Projets en attente de modération)
  - `PATCH /api/v1/admin/releases/:id/status` (Approuver / Rejeter un projet)
  - `GET /api/v1/admin/payouts/pending` (Retraits Mobile Money en attente)
  - `POST /api/v1/admin/payouts/:id/process` (Approuver ou Rejeter avec recrédit)

**Étapes d'exécution :**
- [x] **Étape 1 : Écrire les tests unitaires et d'intégration de l'administration**.
- [x] **Étape 2 : Vérifier l'échec initial des tests**.
- [x] **Étape 3 : Implémenter le service `AdminService` et ses contrôles métier**.
- [x] **Étape 4 : Confirmer le passage au vert des tests**.

---

### Tâche 2 : Moteur d'Export pour Distribution Globale (+150 DSPs)
**Fichiers :**
- Création : `packages/backend/src/modules/admin/distribution-export.service.ts`
- Tests : `packages/backend/tests/modules/admin/distribution-export.test.ts`

**Contrat d'Interfaces :**
- *Consomme :* Entité `Release` avec `isGlobalDistribution = true` et pistes associées.
- *Produit :*
  - `exportReleasePackage(releaseId: string) -> DistributionPackage` : Package normalisé avec UPC, ISRC, métadonnées bilingues, URLs signées des masters et fichier de livraison prêt pour ingestion DSPs (Spotify, Apple Music, Boomplay, Deezer).

**Étapes d'exécution :**
- [x] **Étape 1 : Rédiger le test de génération du package de distribution internationale**.
- [x] **Étape 2 : Vérifier l'échec initial du test**.
- [x] **Étape 3 : Implémenter le générateur de manifeste de distribution**.
- [x] **Étape 4 : Valider le passage au vert du test**.

---

### Tâche 3 : Dashboard Web Administrateur (KPIs, Modération & Retraits)
**Fichiers :**
- Création : `packages/web/src/app/admin/page.tsx`
- Création : `packages/web/src/components/admin/DistributionExportModal.tsx`
- Création : `packages/web/src/components/admin/PayoutApprovalTable.tsx`
- Tests : `packages/web/tests/admin-dashboard.test.tsx`

**Contrat d'Interfaces :**
- *Consomme :* API `/api/v1/admin/*`.
- *Produit :*
  - Vue d'ensemble financière (Chiffre d'affaires, Marge 20%, Retraits versés).
  - Tableau de validation des projets avec pré-écoute et bouton d'export de distribution globale.
  - Console de validation des retraits Mobile Money en 1 clic.

**Étapes d'exécution :**
- [x] **Étape 1 : Écrire le test d'affichage du panneau d'administration**.
- [x] **Étape 2 : Vérifier l'échec initial**.
- [x] **Étape 3 : Développer l'interface d'administration Next.js 15**.
- [x] **Étape 4 : Confirmer le passage au vert des tests**.
