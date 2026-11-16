import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
  Modal,
  TextInput,
  ActivityIndicator,
  Platform,
  StatusBar,
} from 'react-native';
import { CashPlayColors } from '../theme/colors';

interface ProfileScreenProps {
  onNavigateToLibrary?: () => void;
  initialRole?: 'auditor' | 'artist';
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  onNavigateToLibrary,
  initialRole = 'auditor',
}) => {
  const [activeRole, setActiveRole] = useState<'auditor' | 'artist'>(initialRole);

  // Données de l'artiste
  const [artistWallet, setArtistWallet] = useState({
    availableBalance: 72400,
    pendingBalance: 12000,
    minPayout: 500,
  });

  // Modale de retrait SasPay
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('10000');
  const [selectedOperator, setSelectedOperator] = useState('ORANGE');
  const [withdrawPhone, setWithdrawPhone] = useState('+226 70 12 34 56');
  const [isProcessingWithdraw, setIsProcessingWithdraw] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  // Parrainage Mélomane
  const referralCode = 'CASHPLAY-BF-88';
  const referralLink = `https://cashplay.africa/register?ref=${referralCode}`;

  const handleShareReferral = async () => {
    try {
      await Share.share({
        message: `Écoute et télécharge légalement la musique africaine sur CashPlay Music. Inscris-toi via mon lien : ${referralLink}`,
      });
    } catch (e) {
      console.log('Erreur de partage:', e);
    }
  };

  const handleConfirmWithdraw = () => {
    const amt = parseInt(withdrawAmount, 10);
    if (isNaN(amt) || amt < 500) {
      alert('Le montant minimum de retrait est de 500 F CFA.');
      return;
    }
    if (amt > artistWallet.availableBalance) {
      alert('Solde insuffisant pour ce montant.');
      return;
    }

    setIsProcessingWithdraw(true);
    setTimeout(() => {
      setIsProcessingWithdraw(false);
      setWithdrawSuccess(true);
      setArtistWallet((prev) => ({
        ...prev,
        availableBalance: prev.availableBalance - amt,
      }));

      setTimeout(() => {
        setWithdrawSuccess(false);
        setIsWithdrawModalOpen(false);
      }, 1600);
    }, 1500);
  };

  return (
    <View style={styles.outerContainer}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* En-tête avec Sélecteur de Rôle Mélomane / Artiste */}
        <View style={styles.header}>
          <Text style={styles.title}>Mon Compte</Text>
          <Text style={styles.subtitle}>
            {activeRole === 'auditor' ? 'Espace Mélomane & Auditeur' : 'Studio Créateur & Finances Artiste'}
          </Text>

          {/* Switcher interactif Mélomane / Artiste */}
          <View style={styles.roleSwitcher}>
            <TouchableOpacity
              style={[styles.roleSwitchBtn, activeRole === 'auditor' && styles.roleSwitchBtnActive]}
              onPress={() => setActiveRole('auditor')}
              activeOpacity={0.8}
            >
              <Text style={[styles.roleSwitchText, activeRole === 'auditor' && styles.roleSwitchTextActive]}>
                🎧 Mélomane
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.roleSwitchBtn, activeRole === 'artist' && styles.roleSwitchBtnActive]}
              onPress={() => setActiveRole('artist')}
              activeOpacity={0.8}
            >
              <Text style={[styles.roleSwitchText, activeRole === 'artist' && styles.roleSwitchTextActive]}>
                🎤 Espace Artiste
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ======================================================== */}
        {/* VUE 1 : ESPACE MÉLOMANE (AUDITEUR) */}
        {/* ======================================================== */}
        {activeRole === 'auditor' ? (
          <View>
            {/* Profil Mélomane */}
            <View style={styles.profileCard}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>MO</Text>
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>Maxime Ouattara</Text>
                <Text style={styles.profilePhone}>+226 70 XX XX XX</Text>
                <View style={styles.badgeAuditor}>
                  <Text style={styles.badgeAuditorText}>🎧 Mélomane Vérifié</Text>
                </View>
              </View>
            </View>

            {/* Mes Achats & Coffre-Fort Hors-Ligne */}
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionCardTitle}>🎵 Mes Musiques Achetées</Text>
                <TouchableOpacity onPress={onNavigateToLibrary}>
                  <Text style={styles.seeAllText}>Voir tout ›</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.sectionDesc}>
                Vos titres achetés sont chiffrés et stockés dans votre coffre-fort pour une écoute sans connexion.
              </Text>
              <TouchableOpacity style={styles.libraryActionBtn} onPress={onNavigateToLibrary}>
                <Text style={styles.libraryActionText}>Accéder à mon lecteur hors-ligne</Text>
              </TouchableOpacity>
            </View>

            {/* Privilège Commentaires */}
            <View style={styles.privilegeCard}>
              <Text style={styles.privilegeTitle}>💬 Privilège Acheteur</Text>
              <Text style={styles.privilegeText}>
                Vous avez le badge vert certifié <Text style={{ color: CashPlayColors.primary, fontWeight: '800' }}>✓ Acheteur</Text> pour féliciter les artistes dont vous avez acheté les musiques.
              </Text>
            </View>

            {/* Programme Parrainage */}
            <View style={styles.referralCard}>
              <Text style={styles.referralBadge}>🎁 Programme de Parrainage</Text>
              <Text style={styles.referralTitle}>Gagnez des téléchargements gratuits !</Text>
              <Text style={styles.referralDesc}>
                Invitez 5 amis. Dès qu'ils créent leur compte et achètent leur premier morceau, vous recevez 1 titre 100% offert.
              </Text>

              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: '60%' }]} />
                </View>
                <Text style={styles.progressText}>3 / 5 amis ont acheté un morceau</Text>
              </View>

              <TouchableOpacity style={styles.shareButton} onPress={handleShareReferral}>
                <Text style={styles.shareButtonText}>Partager mon lien de parrainage</Text>
              </TouchableOpacity>
            </View>

            {/* Passerelle vers le Compte Artiste */}
            <View style={styles.upgradeCard}>
              <Text style={styles.upgradeTitle}>Vous êtes musicien ou créateur ?</Text>
              <Text style={styles.upgradeSubtitle}>
                Vendez vos œuvres directement aux auditeurs, lancez des préventes exclusives et touchez 80% des revenus par Mobile Money.
              </Text>
              <TouchableOpacity
                style={styles.upgradeBtn}
                onPress={() => setActiveRole('artist')}
              >
                <Text style={styles.upgradeBtnText}>Ouvrir mon profil Artiste 🎤</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          /* ======================================================== */
          /* VUE 2 : ESPACE ARTISTE (CREATOR STUDIO & RETRAITS SASPAY) */
          /* ======================================================== */
          <View>
            {/* Profil Artiste */}
            <View style={[styles.profileCard, styles.artistProfileBorder]}>
              <View style={[styles.avatar, styles.artistAvatar]}>
                <Text style={styles.avatarText}>ML</Text>
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>Moms Loup</Text>
                <Text style={styles.profilePhone}>Artiste Auteur-Compositeur • Burkina Faso</Text>
                <View style={styles.badgeArtist}>
                  <Text style={styles.badgeArtistText}>✓ Artiste Certifié (80% Ventes)</Text>
                </View>
              </View>
            </View>

            {/* 1. PORTEFEUILLE FINANCIER & RETRAITS MOBILES */}
            <View style={styles.walletCard}>
              <View style={styles.walletHeader}>
                <Text style={styles.walletTitle}>💼 Portefeuille des Revenus</Text>
                <View style={styles.walletSplitBadge}>
                  <Text style={styles.walletSplitText}>80% Net Artiste</Text>
                </View>
              </View>

              <View style={styles.balanceRow}>
                <View>
                  <Text style={styles.balanceLabel}>Solde Disponible</Text>
                  <Text style={styles.balanceAmount}>
                    {artistWallet.availableBalance.toLocaleString('fr-FR')} XOF
                  </Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.balanceLabel}>En attente</Text>
                  <Text style={styles.pendingAmount}>
                    +{artistWallet.pendingBalance.toLocaleString('fr-FR')} XOF
                  </Text>
                </View>
              </View>

              <Text style={styles.payoutNotice}>
                ⚡ Retrait immédiat via SasPay dès <Text style={{ color: '#F59E0B', fontWeight: '800' }}>500 F CFA</Text> (Orange, Moov, Wave)
              </Text>

              {/* Bouton de Retrait */}
              <TouchableOpacity
                style={styles.withdrawButton}
                onPress={() => setIsWithdrawModalOpen(true)}
                activeOpacity={0.8}
              >
                <Text style={styles.withdrawButtonText}>💸 Demander un Retrait Mobile Money</Text>
              </TouchableOpacity>
            </View>

            {/* 2. CATALOGUE DE SES ŒUVRES PUBLIÉES & VENTES */}
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionCardTitle}>💿 Mes Œuvres Publiées</Text>
                <TouchableOpacity style={styles.addTrackSmallBtn}>
                  <Text style={styles.addTrackSmallText}>+ Publier</Text>
                </TouchableOpacity>
              </View>

              {/* Œuvre 1 */}
              <View style={styles.trackManagementItem}>
                <View style={styles.trackItemDetails}>
                  <Text style={styles.trackItemTitle}>15.01 (EP Exclusif)</Text>
                  <Text style={styles.trackItemStats}>
                    <Text style={{ color: '#F59E0B', fontWeight: '800' }}>441 ventes</Text> • Revenus : 705 600 XOF
                  </Text>
                </View>
                <View style={styles.statusPillLive}>
                  <Text style={styles.statusPillTextLive}>En Vente</Text>
                </View>
              </View>

              {/* Œuvre 2 */}
              <View style={styles.trackManagementItem}>
                <View style={styles.trackItemDetails}>
                  <Text style={styles.trackItemTitle}>Bass Toub Gomé (Single)</Text>
                  <Text style={styles.trackItemStats}>
                    <Text style={{ color: '#F59E0B', fontWeight: '800' }}>154 ventes</Text> • Revenus : 246 400 XOF
                  </Text>
                </View>
                <View style={styles.statusPillPreorder}>
                  <Text style={styles.statusPillTextPreorder}>Prévente J-6</Text>
                </View>
              </View>

              {/* Œuvre 3 */}
              <View style={[styles.trackManagementItem, { borderBottomWidth: 0 }]}>
                <View style={styles.trackItemDetails}>
                  <Text style={styles.trackItemTitle}>Nouveau Single Démo</Text>
                  <Text style={styles.trackItemStats}>Soumis pour validation</Text>
                </View>
                <View style={styles.statusPillReview}>
                  <Text style={styles.statusPillTextReview}>Modération</Text>
                </View>
              </View>
            </View>

            {/* 3. TABLEAU DES ACHETEURS VIP & MÉCÈNES */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionCardTitle}>👑 Mes Plus Grands Mécènes (VIP)</Text>
              <Text style={styles.sectionDesc}>
                Fans qui vous ont soutenu au-delà du prix de base de vos œuvres.
              </Text>

              <View style={styles.vipFanRow}>
                <Text style={styles.vipFanRank}>🥇</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.vipFanName}>Seydou B.</Text>
                  <Text style={styles.vipFanLoc}>Ouagadougou • Achat VIP</Text>
                </View>
                <Text style={styles.vipFanAmount}>25 000 XOF</Text>
              </View>

              <View style={styles.vipFanRow}>
                <Text style={styles.vipFanRank}>🥈</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.vipFanName}>Mariam S.</Text>
                  <Text style={styles.vipFanLoc}>Abidjan • Achat VIP</Text>
                </View>
                <Text style={styles.vipFanAmount}>10 000 XOF</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* MODALE DE RETRAIT MOBILE MONEY (SASPAY) */}
      <Modal visible={isWithdrawModalOpen} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>💸 Retrait de vos Revenus Artiste</Text>
              <TouchableOpacity onPress={() => setIsWithdrawModalOpen(false)}>
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            {withdrawSuccess ? (
              <View style={styles.successWithdrawBox}>
                <Text style={{ fontSize: 44, marginBottom: 10 }}>✅</Text>
                <Text style={styles.successWithdrawTitle}>Demande de retrait transmise !</Text>
                <Text style={styles.successWithdrawDesc}>
                  Votre virement SasPay de {parseInt(withdrawAmount, 10).toLocaleString('fr-FR')} XOF a été ordonné vers votre compte Mobile Money.
                </Text>
              </View>
            ) : (
              <View>
                <Text style={styles.inputModalLabel}>Montant à retirer (Minimum 500 F CFA) :</Text>
                <TextInput
                  keyboardType="numeric"
                  value={withdrawAmount}
                  onChangeText={setWithdrawAmount}
                  style={styles.modalInput}
                  placeholder="Ex: 5000"
                  placeholderTextColor="#71717A"
                />

                <Text style={[styles.inputModalLabel, { marginTop: 12 }]}>Opérateur Mobile Money :</Text>
                <View style={styles.operatorRow}>
                  {[
                    { id: 'ORANGE', label: '🟠 Orange' },
                    { id: 'MOOV', label: '🔵 Moov' },
                    { id: 'WAVE', label: '🐧 Wave' },
                  ].map((op) => (
                    <TouchableOpacity
                      key={op.id}
                      style={[
                        styles.operatorBtn,
                        selectedOperator === op.id && styles.operatorBtnActive,
                      ]}
                      onPress={() => setSelectedOperator(op.id)}
                    >
                      <Text
                        style={[
                          styles.operatorText,
                          selectedOperator === op.id && styles.operatorTextActive,
                        ]}
                      >
                        {op.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={[styles.inputModalLabel, { marginTop: 12 }]}>Numéro de téléphone récepteur :</Text>
                <TextInput
                  keyboardType="phone-pad"
                  value={withdrawPhone}
                  onChangeText={setWithdrawPhone}
                  style={styles.modalInput}
                  placeholder="+226 70 XX XX XX"
                  placeholderTextColor="#71717A"
                />

                <TouchableOpacity
                  style={[styles.confirmWithdrawBtn, isProcessingWithdraw && { opacity: 0.7 }]}
                  onPress={handleConfirmWithdraw}
                  disabled={isProcessingWithdraw}
                >
                  {isProcessingWithdraw ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <Text style={styles.confirmWithdrawText}>
                      Confirmer le Retrait de {parseInt(withdrawAmount || '0', 10).toLocaleString('fr-FR')} XOF
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: CashPlayColors.background,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 28) : 0,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 130,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: CashPlayColors.textPrimary,
  },
  subtitle: {
    fontSize: 12,
    color: CashPlayColors.textSecondary,
    marginTop: 2,
    marginBottom: 12,
  },
  roleSwitcher: {
    flexDirection: 'row',
    backgroundColor: '#16191f',
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  roleSwitchBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  roleSwitchBtnActive: {
    backgroundColor: CashPlayColors.primary,
  },
  roleSwitchText: {
    color: '#9CA3AF',
    fontSize: 12.5,
    fontWeight: '700',
  },
  roleSwitchTextActive: {
    color: '#FFF',
    fontWeight: '900',
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CashPlayColors.surface,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: CashPlayColors.border,
    marginBottom: 16,
  },
  artistProfileBorder: {
    borderColor: 'rgba(245,158,11,0.4)',
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: CashPlayColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  artistAvatar: {
    backgroundColor: '#F59E0B',
  },
  avatarText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '900',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 17,
    fontWeight: '800',
    color: CashPlayColors.textPrimary,
  },
  profilePhone: {
    fontSize: 11.5,
    color: CashPlayColors.textSecondary,
    marginTop: 2,
  },
  badgeAuditor: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0,138,59,0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 4,
    borderWidth: 1,
    borderColor: CashPlayColors.primary,
  },
  badgeAuditorText: {
    color: CashPlayColors.primary,
    fontSize: 10,
    fontWeight: '800',
  },
  badgeArtist: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(245,158,11,0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  badgeArtistText: {
    color: '#F59E0B',
    fontSize: 10,
    fontWeight: '800',
  },
  sectionCard: {
    backgroundColor: CashPlayColors.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: CashPlayColors.border,
    marginBottom: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionCardTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: CashPlayColors.textPrimary,
  },
  seeAllText: {
    color: CashPlayColors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  sectionDesc: {
    fontSize: 12,
    color: CashPlayColors.textSecondary,
    lineHeight: 17,
    marginBottom: 12,
  },
  libraryActionBtn: {
    backgroundColor: 'rgba(0,138,59,0.15)',
    borderWidth: 1,
    borderColor: CashPlayColors.primary,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  libraryActionText: {
    color: CashPlayColors.primary,
    fontSize: 12,
    fontWeight: '800',
  },
  privilegeCard: {
    backgroundColor: 'rgba(0,138,59,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(0,138,59,0.25)',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  privilegeTitle: {
    color: CashPlayColors.primary,
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 4,
  },
  privilegeText: {
    color: '#D1D5DB',
    fontSize: 11.5,
    lineHeight: 16,
  },
  referralCard: {
    backgroundColor: CashPlayColors.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(245,158,11,0.3)',
    marginBottom: 16,
  },
  referralBadge: {
    color: '#F59E0B',
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 6,
  },
  referralTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: CashPlayColors.textPrimary,
    marginBottom: 4,
  },
  referralDesc: {
    fontSize: 11.5,
    color: CashPlayColors.textSecondary,
    lineHeight: 17,
    marginBottom: 12,
  },
  progressContainer: {
    marginBottom: 14,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    backgroundColor: CashPlayColors.primary,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 11,
    color: CashPlayColors.textMuted,
    fontWeight: '700',
  },
  shareButton: {
    backgroundColor: CashPlayColors.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  shareButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
  },
  upgradeCard: {
    backgroundColor: '#16191f',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  upgradeTitle: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 4,
  },
  upgradeSubtitle: {
    color: '#9CA3AF',
    fontSize: 11.5,
    lineHeight: 16,
    marginBottom: 12,
  },
  upgradeBtn: {
    backgroundColor: 'rgba(245,158,11,0.15)',
    borderWidth: 1,
    borderColor: '#F59E0B',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  upgradeBtnText: {
    color: '#F59E0B',
    fontSize: 12,
    fontWeight: '800',
  },
  walletCard: {
    backgroundColor: '#12171c',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#008A3B',
    marginBottom: 16,
    shadowColor: '#008A3B',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  walletHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  walletTitle: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '800',
  },
  walletSplitBadge: {
    backgroundColor: 'rgba(0,138,59,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#008A3B',
  },
  walletSplitText: {
    color: '#008A3B',
    fontSize: 10,
    fontWeight: '900',
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  balanceLabel: {
    color: '#9CA3AF',
    fontSize: 11,
    fontWeight: '600',
  },
  balanceAmount: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: '900',
    marginTop: 2,
  },
  pendingAmount: {
    color: '#F59E0B',
    fontSize: 16,
    fontWeight: '800',
    marginTop: 2,
  },
  payoutNotice: {
    color: '#A1A1AA',
    fontSize: 11,
    lineHeight: 16,
    marginBottom: 14,
  },
  withdrawButton: {
    backgroundColor: '#008A3B',
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#008A3B',
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  withdrawButtonText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '900',
  },
  addTrackSmallBtn: {
    backgroundColor: 'rgba(0,138,59,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  addTrackSmallText: {
    color: CashPlayColors.primary,
    fontSize: 11,
    fontWeight: '800',
  },
  trackManagementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  trackItemDetails: {
    flex: 1,
    marginRight: 10,
  },
  trackItemTitle: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '800',
  },
  trackItemStats: {
    color: '#9CA3AF',
    fontSize: 11,
    marginTop: 2,
  },
  statusPillLive: {
    backgroundColor: 'rgba(0,138,59,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusPillTextLive: {
    color: '#008A3B',
    fontSize: 10,
    fontWeight: '800',
  },
  statusPillPreorder: {
    backgroundColor: 'rgba(245,158,11,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusPillTextPreorder: {
    color: '#F59E0B',
    fontSize: 10,
    fontWeight: '800',
  },
  statusPillReview: {
    backgroundColor: 'rgba(156,163,175,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusPillTextReview: {
    color: '#9CA3AF',
    fontSize: 10,
    fontWeight: '800',
  },
  vipFanRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1b1e24',
    padding: 10,
    borderRadius: 8,
    marginBottom: 6,
  },
  vipFanRank: {
    fontSize: 16,
    marginRight: 8,
  },
  vipFanName: {
    color: '#FFF',
    fontSize: 12.5,
    fontWeight: '700',
  },
  vipFanLoc: {
    color: '#9CA3AF',
    fontSize: 10,
  },
  vipFanAmount: {
    color: '#F59E0B',
    fontSize: 12,
    fontWeight: '900',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#14161a',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 36,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
  },
  modalCloseText: {
    color: '#9CA3AF',
    fontSize: 16,
    fontWeight: '700',
  },
  inputModalLabel: {
    color: '#D1D5DB',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
  },
  modalInput: {
    backgroundColor: '#1b1e24',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#FFF',
    fontSize: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  operatorRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 6,
  },
  operatorBtn: {
    flex: 1,
    backgroundColor: '#1b1e24',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  operatorBtnActive: {
    borderColor: CashPlayColors.primary,
    backgroundColor: 'rgba(0,138,59,0.15)',
  },
  operatorText: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: '700',
  },
  operatorTextActive: {
    color: '#FFF',
    fontWeight: '900',
  },
  confirmWithdrawBtn: {
    backgroundColor: '#008A3B',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 18,
  },
  confirmWithdrawText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '900',
  },
  successWithdrawBox: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  successWithdrawTitle: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 6,
  },
  successWithdrawDesc: {
    color: '#9CA3AF',
    fontSize: 12,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
});
