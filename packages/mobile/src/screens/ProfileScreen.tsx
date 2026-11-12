import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Share } from 'react-native';
import { CashPlayColors } from '../theme/colors';

export const ProfileScreen: React.FC = () => {
  const referralCode = 'CASHPLAY-BF-88';
  const referralLink = `https://cashplay.africa/register?ref=${referralCode}`;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Écoute et télécharge légalement la musique africaine sur CashPlay Music. Inscris-toi via mon lien : ${referralLink}`,
      });
    } catch (e) {
      console.log('Erreur de partage:', e);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Mon Compte</Text>
        <Text style={styles.subtitle}>Auditeur CashPlay Music</Text>
      </View>

      {/* Profil Card */}
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>CP</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>Mélomane Burkinabè</Text>
          <Text style={styles.profilePhone}>+226 70 XX XX XX</Text>
          <Text style={styles.badgeAuditor}>Auditeur Actif</Text>
        </View>
      </View>

      {/* Carte Affiliation */}
      <View style={styles.referralCard}>
        <Text style={styles.referralBadge}>🎁 Programme de Parrainage</Text>
        <Text style={styles.referralTitle}>Gagnez des téléchargements gratuits !</Text>
        <Text style={styles.referralDesc}>
          Invitez 5 amis. Dès qu'ils créent leur compte et achètent leur premier morceau, vous recevez 1 titre gratuit.
        </Text>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '60%' }]} />
          </View>
          <Text style={styles.progressText}>3 / 5 acheteurs enregistrés</Text>
        </View>

        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Text style={styles.shareButtonText}>Partager mon lien de parrainage</Text>
        </TouchableOpacity>
      </View>

      {/* Paramètres & Moyens de Paiement */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Moyens de Paiement Enregistrés</Text>
        <View style={styles.menuItem}>
          <Text style={styles.menuItemLabel}>Orange Money Burkina</Text>
          <Text style={styles.menuItemValue}>Connecté (SasPay)</Text>
        </View>
        <View style={styles.menuItem}>
          <Text style={styles.menuItemLabel}>Wave Mobile Money</Text>
          <Text style={styles.menuItemValue}>Actif</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CashPlayColors.background,
  },
  content: {
    padding: 16,
    paddingTop: 30,
    paddingBottom: 90,
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
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CashPlayColors.surface,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: CashPlayColors.border,
    marginBottom: 20,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: CashPlayColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '900',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '800',
    color: CashPlayColors.textPrimary,
  },
  profilePhone: {
    fontSize: 12,
    color: CashPlayColors.textSecondary,
    marginTop: 2,
  },
  badgeAuditor: {
    alignSelf: 'flex-start',
    backgroundColor: CashPlayColors.primaryDark + '30',
    color: CashPlayColors.primary,
    fontSize: 10,
    fontWeight: '700',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  referralCard: {
    backgroundColor: CashPlayColors.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: CashPlayColors.accentGold + '40',
    marginBottom: 20,
  },
  referralBadge: {
    color: CashPlayColors.accentGold,
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 6,
  },
  referralTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: CashPlayColors.textPrimary,
    marginBottom: 4,
  },
  referralDesc: {
    fontSize: 12,
    color: CashPlayColors.textSecondary,
    lineHeight: 18,
    marginBottom: 12,
  },
  progressContainer: {
    marginBottom: 14,
  },
  progressBar: {
    height: 8,
    backgroundColor: CashPlayColors.surfaceLight,
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
  section: {
    backgroundColor: CashPlayColors.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: CashPlayColors.border,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: CashPlayColors.textPrimary,
    marginBottom: 12,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: CashPlayColors.border,
  },
  menuItemLabel: {
    color: CashPlayColors.textSecondary,
    fontSize: 12,
  },
  menuItemValue: {
    color: CashPlayColors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
});
