# Plan d'Implémentation : CashPlay Music - Phase 2 (Plateforme Web Next.js 15)

> **Directives pour l'exécutant :** Chaque étape utilise la syntaxe de case à cocher (`- [ ]`) pour assurer un suivi rigoureux. Suivre strictement le cycle TDD et de validation visuelle/fonctionnelle.

- **Objectif :** Développer l'application Web réactive moderne CashPlay Music avec Next.js 15, Tailwind CSS, lecteur audio persistant, sections Préventes exclusives, conversion popup à 30 secondes, intégration de paiement SasPay et tableaux de bord pour Auditeur, Artiste et Label.
- **Architecture :** Next.js 15 (App Router, React 19, Server & Client Components), Tailwind CSS, Lucide Icons, Context API pour l'état global du Player Audio et de la session utilisateur, intégration directe avec l'API Backend `@cashplay/backend`.
- **Stack Technique :** Next.js 15, React 19, Tailwind CSS, TypeScript, Lucide React, Vitest / React Testing Library.
- **Spécification de référence :** [`docs/specs/2026-11-12-cashplay-music-spec.md`](../specs/2026-11-12-cashplay-music-spec.md)

---

## Contraintes Globales & Invariants de Design (Brandboard)

1. **Couleurs Officielles :**
   - Vert CashPlay (Principal) : `#008A3B`
   - Vert Profond (Surfaces sombres & Player) : `#006B2E`
   - Vert Pâle (Badges & accents doux) : `#E8F5ED`
   - Noir (Typographie & contrastes) : `#111111`
   - Blanc (Clarté & fonds clairs) : `#FFFFFF`
2. **Typographie :** Montserrat (ExtraBold pour les titres, SemiBold pour les boutons/menus/prix, Regular pour les textes).
3. **Lecteur Audio Universel :** Le lecteur en bas d'écran ne doit jamais s'interrompre lors de la navigation entre les pages de la plateforme.
4. **Trigger de Conversion :** À 30 secondes d'écoute sans compte connecté, déclencher le popup d'inscription invitant l'utilisateur à créer son compte pour profiter pleinement de la musique.

---

## Tâches d'Implémentation

### Tâche 1 : Initialisation de l'application Next.js 15 & Charte Visuelle
**Fichiers :**
- Création : `packages/web/package.json`
- Création : `packages/web/tsconfig.json`
- Création : `packages/web/tailwind.config.js`
- Création : `packages/web/src/app/layout.tsx`
- Création : `packages/web/src/app/globals.css`
- Tests : `packages/web/tests/theme.test.ts`

**Contrat d'Interfaces :**
- *Consomme :* Logo officiel CashPlay Music (`logo CashPlay Music vert blanc.png` & `logo CashPlay Music noir blanc.png`).
- *Produit :* Layout global avec Navbar, conteneur de page, typographie Montserrat et variables CSS de marque.

**Étapes d'exécution :**
- [x] **Étape 1 : Rédiger le test de validation du thème et des styles de marque**.
- [x] **Étape 2 : Vérifier l'échec initial du test**.
- [x] **Étape 3 : Initialiser l'application Next.js 15 avec Tailwind CSS et intégration des logos**.
- [x] **Étape 4 : Confirmer le passage au vert du test de configuration**.

---

### Tâche 2 : Contexte Audio & Composant Lecteur Persistant (Persistent Audio Player)
**Fichiers :**
- Création : `packages/web/src/context/AudioContext.tsx`
- Création : `packages/web/src/components/player/AudioPlayer.tsx`
- Tests : `packages/web/tests/player.test.tsx`

**Contrat d'Interfaces :**
- *Consomme :* Flux audio MP3 (extraits 30s ou titres complets achetés).
- *Produit :* `useAudio()` hook (play, pause, next, prev, toggle, seek, volume, isPreview, isPlaying, currentTrack).

**Étapes d'exécution :**
- [x] **Étape 1 : Rédiger le test unitaire du contexte audio (état de lecture, gestion de la durée d'extrait)**.
- [x] **Étape 2 : Vérifier l'échec initial du test**.
- [x] **Étape 3 : Implémenter le provider `AudioContext` et le composant `AudioPlayer` persistant en bas d'écran**.
- [x] **Étape 4 : Valider le passage au vert des tests**.

---

### Tâche 3 : Vitrine Musicale d'Accueil, Préventes (J-14 à J-7) & Popup 30s
**Fichiers :**
- Création : `packages/web/src/app/page.tsx`
- Création : `packages/web/src/components/home/HeroBanner.tsx`
- Création : `packages/web/src/components/home/PreOrderSection.tsx`
- Création : `packages/web/src/components/home/TrackCard.tsx`
- Création : `packages/web/src/components/auth/ConversionPopup.tsx`
- Tests : `packages/web/tests/home.test.tsx`

**Contrat d'Interfaces :**
- *Consomme :* `GET /api/v1/tracks`, `GET /api/v1/releases`.
- *Produit :*
  - Section Hero avec slogan officiel : *« La musique prend de la valeur »*.
  - Section Préventes (compte à rebours avant sortie officielle).
  - Grille des nouveautés et top écoutes avec bouton Play extrait.
  - Déclencheur automatique du popup de conversion à 30 secondes d'écoute cumulée.

**Étapes d'exécution :**
- [x] **Étape 1 : Rédiger le test de détection du popup à 30 secondes et d'affichage des préventes**.
- [x] **Étape 2 : Vérifier l'échec initial du test**.
- [x] **Étape 3 : Développer la page d'accueil avec Tailwind CSS et le composant `ConversionPopup`**.
- [x] **Étape 4 : Valider le passage au vert**.

---

### Tâche 4 : Modale d'Authentification & Gestion de Session
**Fichiers :**
- Création : `packages/web/src/context/AuthContext.tsx`
- Création : `packages/web/src/components/auth/AuthModal.tsx`
- Tests : `packages/web/tests/auth-flow.test.tsx`

**Contrat d'Interfaces :**
- *Consomme :* API `/api/v1/auth/login`, `/api/v1/auth/register`, `/api/v1/auth/me`.
- *Produit :* Onglet Connexion / Inscription avec sélecteur de rôle (Auditeur, Artiste, Label), stockage token et affichage du profil dans la barre de navigation.

**Étapes d'exécution :**
- [x] **Étape 1 : Écrire le test d'intégration de connexion et d'inscription**.
- [x] **Étape 2 : Vérifier l'échec du test**.
- [x] **Étape 3 : Implémenter le composant `AuthModal` et le provider `AuthContext`**.
- [x] **Étape 4 : Confirmer le succès des tests**.

---

### Tâche 5 : Modal d'Achat & Intégration SasPay (Mobile Money & Wave)
**Fichiers :**
- Création : `packages/web/src/components/payments/PurchaseModal.tsx`
- Tests : `packages/web/tests/purchase.test.tsx`

**Contrat d'Interfaces :**
- *Consomme :* API `/api/v1/payments/initiate`.
- *Produit :* Sélecteur de méthode (Orange Money, Moov Money, Wave, Carte Bancaire), redirection checkout ou confirmation de paiement.

**Étapes d'exécution :**
- [x] **Étape 1 : Écrire le test d'initiation d'achat de titre**.
- [x] **Étape 2 : Vérifier l'échec du test**.
- [x] **Étape 3 : Implémenter le flux d'achat interactif SasPay**.
- [x] **Étape 4 : Valider le passage au vert**.

---

### Tâche 6 : Dashboard Artiste & Label (Distribution, Préventes & Retraits 500 F)
**Fichiers :**
- Création : `packages/web/src/app/dashboard/artist/page.tsx`
- Création : `packages/web/src/app/dashboard/label/page.tsx`
- Création : `packages/web/src/components/dashboard/UploadReleaseModal.tsx`
- Création : `packages/web/src/components/dashboard/PayoutRequestModal.tsx`
- Tests : `packages/web/tests/dashboard.test.tsx`

**Contrat d'Interfaces :**
- *Consomme :* APIs `/api/v1/releases`, `/api/v1/tracks`, `/api/v1/payouts/request`.
- *Produit :*
  - Formulaire de mise en vente : Single (2 000 F), EP (5 000 F), Album (7 000 F), Option globale (+30%), Option Prévente J-14.
  - Statistiques de ventes et solde des 80% ayants droit.
  - Demande de retrait Mobile Money (seuil 500 FCFA).

**Étapes d'exécution :**
- [x] **Étape 1 : Écrire le test de validation du formulaire de distribution**.
- [x] **Étape 2 : Vérifier l'échec du test**.
- [x] **Étape 3 : Implémenter les interfaces de gestion créateurs**.
- [x] **Étape 4 : Confirmer la réussite des tests**.

---

### Tâche 7 : Espace Auditeur (« Mes Sons », Écoute & Parrainage)
**Fichiers :**
- Création : `packages/web/src/app/my-library/page.tsx`
- Création : `packages/web/src/components/library/AffiliationCard.tsx`
- Tests : `packages/web/tests/library.test.tsx`

**Contrat d'Interfaces :**
- *Consomme :* API `/api/v1/affiliations/stats`, liste des titres achetés.
- *Produit :*
  - Bibliothèque "Mes Sons" pour réécouter sans limite les morceaux achetés.
  - Carte de parrainage avec jauge : 5 filleuls acheteurs = 1 titre gratuit offert.
  - Bouton de partage WhatsApp / Facebook / Copier lien.

**Étapes d'exécution :**
- [x] **Étape 1 : Écrire le test unitaire de la bibliothèque et du parrainage**.
- [x] **Étape 2 : Vérifier l'échec initial**.
- [x] **Étape 3 : Implémenter la bibliothèque et le module de parrainage viral**.
- [x] **Étape 4 : Valider le passage au vert**.
