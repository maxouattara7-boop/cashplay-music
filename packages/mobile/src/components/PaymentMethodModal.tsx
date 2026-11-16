import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { CashPlayColors } from '../theme/colors';

export interface PaymentTrackData {
  id: string;
  title: string;
  artist: string;
  priceXOF: number;
  coverUrl: string;
}

interface PaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  track: PaymentTrackData | null;
  isVip?: boolean;
  onSuccess: (txId: string) => void;
}

export const PaymentMethodModal: React.FC<PaymentMethodModalProps> = ({
  isOpen,
  onClose,
  track,
  isVip = false,
  onSuccess,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<string>('ORANGE');
  const [vipAmount, setVipAmount] = useState<number>(5000);
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [successStep, setSuccessStep] = useState<boolean>(false);

  if (!isOpen || !track) return null;

  const finalAmount = isVip ? vipAmount : track.priceXOF;

  const paymentOptions = [
    {
      id: 'ORANGE_BURKINA',
      name: 'Orange Money (Burkina Faso)',
      badge: 'Instantané',
      iconText: '🟠 OM',
      color: '#FF6600',
    },
    {
      id: 'MOOV_BURKINA',
      name: 'Moov Money (Burkina Faso)',
      badge: 'Instantané',
      iconText: '🔵 MOOV',
      color: '#006699',
    },
    {
      id: 'WAVE_BF_CI',
      name: 'Wave (Burkina, Côte d\'Ivoire, Sénégal)',
      badge: '0% Frais',
      iconText: '🐧 WAVE',
      color: '#1DA1F2',
    },
    {
      id: 'ORANGE_MALI',
      name: 'Orange Money Mali (WEB)',
      badge: 'Régional',
      iconText: '🟠 OM-ML',
      color: '#FF6600',
    },
    {
      id: 'MTN_BENIN_CI',
      name: 'MTN Mobile Money (Bénin, Côte d\'Ivoire)',
      badge: 'Régional',
      iconText: '🟡 MTN',
      color: '#FFCC00',
    },
    {
      id: 'CARD',
      name: 'Carte Bancaire (Visa / Mastercard)',
      badge: 'International',
      iconText: '💳 CARTE',
      color: '#4F46E5',
    },
  ];

  const handlePay = () => {
    setIsProcessing(true);
    // Simulation appel API SasPay
    setTimeout(() => {
      setIsProcessing(false);
      setSuccessStep(true);
      setTimeout(() => {
        setSuccessStep(false);
        onSuccess(`TX-${Date.now()}`);
        onClose();
      }, 1500);
    }, 1800);
  };

  return (
    <Modal visible={isOpen} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />

        <View style={styles.sheetContainer}>
          {/* Poignée de glissement */}
          <View style={styles.dragHandle} />

          {/* En-tête */}
          <View style={styles.header}>
            <Text style={styles.title}>
              {isVip ? '👑 Soutien VIP Artiste' : 'Choisissez un mode paiement'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          {successStep ? (
            <View style={styles.successContainer}>
              <Text style={styles.successIcon}>🎉</Text>
              <Text style={styles.successTitle}>Paiement validé avec succès !</Text>
              <Text style={styles.successSubtitle}>
                Titre ajouté à votre bibliothèque et coffre-fort chiffré.
              </Text>
            </View>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollBody}>
              {/* Récapitulatif du titre */}
              <View style={styles.trackSummary}>
                <View style={styles.trackTextCol}>
                  <Text style={styles.summaryTitle} numberOfLines={1}>{track.title}</Text>
                  <Text style={styles.summaryArtist}>{track.artist}</Text>
                </View>
                <View style={styles.priceBadge}>
                  <Text style={styles.priceAmount}>
                    {finalAmount.toLocaleString('fr-FR')} XOF
                  </Text>
                </View>
              </View>

              {/* Si Achat VIP : Paliers de soutien */}
              {isVip && (
                <View style={styles.vipPillSection}>
                  <Text style={styles.sectionLabel}>Choisissez votre palier de soutien :</Text>
                  <View style={styles.vipOptionsRow}>
                    {[2000, 5000, 10000, 25000].map((amt) => (
                      <TouchableOpacity
                        key={amt}
                        style={[
                          styles.vipPill,
                          vipAmount === amt && styles.vipPillActive,
                        ]}
                        onPress={() => setVipAmount(amt)}
                      >
                        <Text
                          style={[
                            styles.vipPillText,
                            vipAmount === amt && styles.vipPillTextActive,
                          ]}
                        >
                          {amt >= 1000 ? `${amt / 1000}k` : amt} F
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {/* Liste des Opérateurs */}
              <Text style={styles.sectionLabel}>Opérateurs disponibles (SasPay) :</Text>
              {paymentOptions.map((opt) => (
                <TouchableOpacity
                  key={opt.id}
                  style={[
                    styles.methodCard,
                    selectedMethod === opt.id && styles.methodCardActive,
                  ]}
                  onPress={() => setSelectedMethod(opt.id)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.methodIconBadge, { backgroundColor: opt.color }]}>
                    <Text style={styles.methodIconText}>{opt.iconText}</Text>
                  </View>
                  <View style={styles.methodInfo}>
                    <Text style={styles.methodName}>{opt.name}</Text>
                    <Text style={styles.methodBadgeText}>{opt.badge}</Text>
                  </View>
                  <View style={styles.radioCircle}>
                    {selectedMethod === opt.id && <View style={styles.radioInner} />}
                  </View>
                </TouchableOpacity>
              ))}

              {/* Champ téléphone Mobile Money */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Numéro Mobile Money pour confirmation :</Text>
                <TextInput
                  placeholder="+226 70 XX XX XX"
                  placeholderTextColor="#71717A"
                  keyboardType="phone-pad"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  style={styles.textInput}
                />
              </View>

              {/* Bouton de confirmation */}
              <TouchableOpacity
                style={[styles.confirmButton, isProcessing && styles.confirmButtonDisabled]}
                onPress={handlePay}
                disabled={isProcessing}
                activeOpacity={0.8}
              >
                {isProcessing ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={styles.confirmButtonText}>
                    Payer {finalAmount.toLocaleString('fr-FR')} XOF via SasPay
                  </Text>
                )}
              </TouchableOpacity>
              <Text style={styles.securedNotice}>🔒 Transaction 100% sécurisée par SasPay</Text>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
  },
  sheetContainer: {
    backgroundColor: '#14161a',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 18,
    paddingBottom: 32,
    maxHeight: '85%',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  dragHandle: {
    width: 44,
    height: 5,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 14,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFF',
  },
  closeBtn: {
    padding: 6,
  },
  closeText: {
    color: '#9CA3AF',
    fontSize: 16,
    fontWeight: '700',
  },
  scrollBody: {
    maxHeight: 520,
  },
  trackSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1b1e24',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  trackTextCol: {
    flex: 1,
    marginRight: 10,
  },
  summaryTitle: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800',
  },
  summaryArtist: {
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 2,
  },
  priceBadge: {
    backgroundColor: 'rgba(0,138,59,0.18)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#008A3B',
  },
  priceAmount: {
    color: '#008A3B',
    fontSize: 13,
    fontWeight: '900',
  },
  vipPillSection: {
    marginBottom: 14,
  },
  sectionLabel: {
    color: '#A1A1AA',
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  vipOptionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  vipPill: {
    flex: 1,
    backgroundColor: '#1b1e24',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  vipPillActive: {
    backgroundColor: 'rgba(245,158,11,0.2)',
    borderColor: '#F59E0B',
  },
  vipPillText: {
    color: '#D1D5DB',
    fontSize: 12,
    fontWeight: '700',
  },
  vipPillTextActive: {
    color: '#F59E0B',
    fontWeight: '900',
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1b1e24',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  methodCardActive: {
    borderColor: CashPlayColors.primary,
    backgroundColor: 'rgba(0,138,59,0.08)',
  },
  methodIconBadge: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
    marginRight: 12,
  },
  methodIconText: {
    color: '#FFF',
    fontWeight: '900',
    fontSize: 10,
  },
  methodInfo: {
    flex: 1,
  },
  methodName: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
  methodBadgeText: {
    color: '#9CA3AF',
    fontSize: 10,
    marginTop: 2,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: CashPlayColors.primary,
  },
  inputContainer: {
    marginTop: 10,
    marginBottom: 16,
  },
  inputLabel: {
    color: '#D1D5DB',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: '#1b1e24',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#FFF',
    fontSize: 14,
  },
  confirmButton: {
    backgroundColor: CashPlayColors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#008A3B',
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  confirmButtonDisabled: {
    opacity: 0.6,
  },
  confirmButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '900',
  },
  securedNotice: {
    color: '#71717A',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 10,
  },
  successContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  successIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  successTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 6,
  },
  successSubtitle: {
    color: '#9CA3AF',
    fontSize: 12,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
