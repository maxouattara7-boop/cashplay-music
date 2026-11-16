import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Modal,
  TextInput,
  Share,
  Platform,
  StatusBar,
} from 'react-native';
import { CashPlayColors } from '../theme/colors';
import { PaymentMethodModal, PaymentTrackData } from '../components/PaymentMethodModal';

const { width, height } = Dimensions.get('window');

export interface TrackDetailData {
  id: string;
  title: string;
  artist: string;
  priceXOF: number;
  salesCount: number;
  coverUrl: string;
  videoTeaserUrl?: string;
  description?: string;
  isPreOrder?: boolean;
  daysRemaining?: number;
  commentsCount?: number;
}

interface TrackDetailScreenProps {
  track: TrackDetailData | null;
  onClose: () => void;
  onTrackPurchased?: (trackId: string) => void;
}

export const TrackDetailScreen: React.FC<TrackDetailScreenProps> = ({
  track,
  onClose,
  onTrackPurchased,
}) => {
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);
  const [isFullscreenImage, setIsFullscreenImage] = useState<boolean>(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState<boolean>(false);
  const [isVipPayment, setIsVipPayment] = useState<boolean>(false);
  const [showVipListModal, setShowVipListModal] = useState<boolean>(false);
  const [hasPurchased, setHasPurchased] = useState<boolean>(false);

  // Commentaires
  const [commentText, setCommentText] = useState<string>('');
  const [commentsList, setCommentsList] = useState([
    {
      id: 'c1',
      author: 'Idrissa Traoré',
      avatar: 'IT',
      time: 'Il y a 2h',
      content: 'Le son est tellement lourd ! Fier de soutenir la culture locale 🔥',
      isVerifiedBuyer: true,
      rating: 5,
    },
    {
      id: 'c2',
      author: 'Fatimata Kaboré',
      avatar: 'FK',
      time: 'Il y a 1 jour',
      content: 'Achat VIP validé via Orange Money sans aucun souci, force à Moms Loup !',
      isVerifiedBuyer: true,
      rating: 5,
    },
    {
      id: 'c3',
      author: 'Salif Ouédraogo',
      avatar: 'SO',
      time: 'Il y a 2 jours',
      content: 'Morceau numéro 3 en boucle dans ma voiture, félicitations !',
      isVerifiedBuyer: true,
      rating: 5,
    },
  ]);

  if (!track) return null;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Découvrez "${track.title}" de ${track.artist} sur CashPlay Music ! Soutenez l'artiste directement par Mobile Money.`,
        title: track.title,
      });
    } catch (e) {
      // Ignorer
    }
  };

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    setCommentsList([
      {
        id: `c-${Date.now()}`,
        author: 'Maxime Ouattara',
        avatar: 'MO',
        time: 'À l\'instant',
        content: commentText.trim(),
        isVerifiedBuyer: true,
        rating: 5,
      },
      ...commentsList,
    ]);
    setCommentText('');
  };

  const handlePaymentSuccess = (txId: string) => {
    setHasPurchased(true);
    if (onTrackPurchased) {
      onTrackPurchased(track.id);
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      {/* 1. EN-TÊTE SUPÉRIEUR (Flèche retour + Partage comme sur Empire) */}
      <View style={styles.topHeader}>
        <TouchableOpacity style={styles.headerIconButton} onPress={onClose} activeOpacity={0.7}>
          <Text style={styles.headerIcon}>←</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle} numberOfLines={1}>
          {track.title}
        </Text>

        <TouchableOpacity style={styles.headerIconButton} onPress={handleShare} activeOpacity={0.7}>
          <Text style={styles.headerIcon}>🔗</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollBody} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* 2. POCHETTE IMMERSIVE / VIDÉO TEASER (Au clic : Lance la vidéo ou plein écran) */}
        <View style={styles.mediaContainer}>
          {isVideoPlaying ? (
            /* Mode Lecteur Vidéo Teaser */
            <View style={styles.videoPlayerBox}>
              <Image source={{ uri: track.coverUrl }} style={styles.videoPoster} />
              <View style={styles.videoOverlay}>
                <View style={styles.videoHeaderBadge}>
                  <Text style={styles.videoBadgeText}>🎬 TEASER VIDÉO OFFICIEL</Text>
                </View>
                <Text style={styles.videoPlayingTitle}>Clip Promo • Extrait HD</Text>
                <View style={styles.videoProgressBar}>
                  <View style={styles.videoProgressFill} />
                </View>
                <TouchableOpacity
                  style={styles.closeVideoBtn}
                  onPress={() => setIsVideoPlaying(false)}
                >
                  <Text style={styles.closeVideoText}>✕ Revenir à l'affiche</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            /* Mode Affiche Grand Format */
            <TouchableOpacity
              style={styles.coverWrapper}
              activeOpacity={0.9}
              onPress={() => setIsVideoPlaying(true)}
            >
              <Image source={{ uri: track.coverUrl }} style={styles.coverImage} />

              {/* Tag cliquable pour inciter à lancer la vidéo */}
              <View style={styles.videoBadge}>
                <Text style={styles.videoBadgeIcon}>▶</Text>
                <Text style={styles.videoBadgeLabel}>Toucher pour lancer la vidéo</Text>
              </View>

              {/* Bouton pour agrandir en plein écran */}
              <TouchableOpacity
                style={styles.fullscreenIconBtn}
                onPress={() => setIsFullscreenImage(true)}
              >
                <Text style={styles.fullscreenIconText}>⛶</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        </View>

        {/* 3. INFORMATIONS CLÉS : TITRE & ARTISTE & PRIX */}
        <View style={styles.infoSection}>
          <Text style={styles.mainTitle}>{track.title} - {track.artist}</Text>

          {/* Prix en grand (comme sur la capture) */}
          <Text style={styles.priceXOF}>
            {track.priceXOF.toLocaleString('fr-FR')} XOF
          </Text>

          {/* Bloc Compteur de Ventes & Bouton Achats VIP */}
          <View style={styles.salesAndVipRow}>
            <View style={styles.salesCol}>
              <Text style={styles.salesNumber}>{track.salesCount}</Text>
              <Text style={styles.salesLabel}>Ventes</Text>
            </View>

            <TouchableOpacity
              style={styles.vipButton}
              onPress={() => setShowVipListModal(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.vipButtonIcon}>🪪</Text>
              <Text style={styles.vipButtonText}>Achats VIP</Text>
            </TouchableOpacity>
          </View>

          {/* Slogan d'incitation (exactement comme sur la capture Empire) */}
          <Text style={styles.ctaSubtitle}>
            Acheter ou Faire un achat VIP de soutien.
          </Text>

          {/* Description de l'œuvre */}
          <Text style={styles.descriptionText}>
            {track.description || `${track.artist} vous propose cette œuvre exclusive intitulée "${track.title}". En l'achetant, 80% des revenus sont immédiatement reversés à l'artiste.`}
          </Text>
        </View>

        <View style={styles.divider} />

        {/* 4. ESPACE COMMENTAIRES (Avec restriction pour acheteurs) */}
        <View style={styles.commentsSection}>
          <View style={styles.commentsHeader}>
            <Text style={styles.commentsTitle}>
              💬 Commentaires ({commentsList.length})
            </Text>
            <Text style={styles.commentsFilter}>Récents ▾</Text>
          </View>

          {/* Encart incitatif de restriction acheteur (comme sur la capture) */}
          <View style={styles.buyerNoticeCard}>
            <Text style={styles.buyerNoticeText}>
              🔒 Commentaire réservé aux acheteurs : achetez ce contenu pour donner votre avis et féliciter l'artiste.
            </Text>
          </View>

          {/* Formulaire d'écriture (accessible si acheté ou débloqué) */}
          {hasPurchased ? (
            <View style={styles.commentInputBox}>
              <TextInput
                placeholder="Écrivez votre message d'encouragement..."
                placeholderTextColor="#71717A"
                value={commentText}
                onChangeText={setCommentText}
                style={styles.commentInput}
              />
              <TouchableOpacity
                style={styles.commentSendBtn}
                onPress={handleAddComment}
              >
                <Text style={styles.commentSendText}>Envoyer</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.lockedCommentBtn}
              onPress={() => {
                setIsVipPayment(false);
                setIsPaymentOpen(true);
              }}
            >
              <Text style={styles.lockedCommentText}>
                🛒 Acheter pour débloquer les commentaires
              </Text>
            </TouchableOpacity>
          )}

          {/* Liste des avis et commentaires */}
          <View style={styles.commentsList}>
            {commentsList.map((c) => (
              <View key={c.id} style={styles.commentItem}>
                <View style={styles.commentAvatar}>
                  <Text style={styles.commentAvatarText}>{c.avatar}</Text>
                </View>
                <View style={styles.commentContent}>
                  <View style={styles.commentAuthorRow}>
                    <Text style={styles.commentAuthor}>{c.author}</Text>
                    {c.isVerifiedBuyer && (
                      <View style={styles.verifiedBadge}>
                        <Text style={styles.verifiedText}>✓ Acheteur</Text>
                      </View>
                    )}
                    <Text style={styles.commentTime}>{c.time}</Text>
                  </View>
                  <Text style={styles.commentBody}>{c.content}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* 5. BARRE FIXE INFÉRIEURE : ACHETER & ACHAT VIP (Sticky Footer comme sur Empire) */}
      <View style={styles.stickyFooter}>
        {/* Bouton Acheter Standard */}
        <TouchableOpacity
          style={styles.standardBuyBtn}
          onPress={() => {
            setIsVipPayment(false);
            setIsPaymentOpen(true);
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.standardBuyText}>
            ACHETER ({track.priceXOF.toLocaleString('fr-FR')} F)
          </Text>
        </TouchableOpacity>

        {/* Bouton Achat VIP de Soutien */}
        <TouchableOpacity
          style={styles.vipBuyBtn}
          onPress={() => {
            setIsVipPayment(true);
            setIsPaymentOpen(true);
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.vipBuyText}>ACHAT VIP 👑</Text>
        </TouchableOpacity>
      </View>

      {/* 6. MODALE IMAGE PLEIN ÉCRAN */}
      <Modal visible={isFullscreenImage} transparent animationType="fade">
        <View style={styles.fullscreenModal}>
          <TouchableOpacity
            style={styles.closeFullscreenBtn}
            onPress={() => setIsFullscreenImage(false)}
          >
            <Text style={styles.closeFullscreenText}>✕ Fermer</Text>
          </TouchableOpacity>
          <Image source={{ uri: track.coverUrl }} style={styles.fullscreenImage} />
        </View>
      </Modal>

      {/* 7. MODALE TABLEAU D'HONNEUR DES ACHATS VIP */}
      <Modal visible={showVipListModal} transparent animationType="slide">
        <View style={styles.vipListOverlay}>
          <View style={styles.vipListSheet}>
            <View style={styles.vipListHeader}>
              <Text style={styles.vipListTitle}>👑 Tableau des Acheteurs VIP</Text>
              <TouchableOpacity onPress={() => setShowVipListModal(false)}>
                <Text style={{ color: '#FFF', fontSize: 16 }}>✕</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.vipListSub}>
              Ces mécènes ont acheté ce titre au-delà du prix officiel pour soutenir directement {track.artist}.
            </Text>

            <View style={styles.vipCard}>
              <Text style={styles.vipFanName}>🥇 Seydou B. (Ouagadougou)</Text>
              <Text style={styles.vipFanAmount}>25 000 XOF</Text>
            </View>
            <View style={styles.vipCard}>
              <Text style={styles.vipFanName}>🥈 Mariam S. (Abidjan)</Text>
              <Text style={styles.vipFanAmount}>10 000 XOF</Text>
            </View>
            <View style={styles.vipCard}>
              <Text style={styles.vipFanName}>🥉 Daouda K. (Bamako)</Text>
              <Text style={styles.vipFanAmount}>5 000 XOF</Text>
            </View>

            <TouchableOpacity
              style={styles.becomeVipBtn}
              onPress={() => {
                setShowVipListModal(false);
                setIsVipPayment(true);
                setIsPaymentOpen(true);
              }}
            >
              <Text style={styles.becomeVipText}>Devenir Acheteur VIP 👑</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 8. MODALE DE PAIEMENT SASPAY */}
      <PaymentMethodModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        track={track}
        isVip={isVipPayment}
        onSuccess={handlePaymentSuccess}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#0c0d0e',
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 28) : 0,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
    backgroundColor: '#0c0d0e',
  },
  headerIconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIcon: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: '#FFF',
    fontSize: 15,
    fontWeight: '800',
    paddingHorizontal: 10,
  },
  scrollBody: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  mediaContainer: {
    width: width,
    height: width * 0.95,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverWrapper: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  videoBadge: {
    position: 'absolute',
    bottom: 14,
    left: 14,
    backgroundColor: 'rgba(0,0,0,0.75)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#008A3B',
  },
  videoBadgeIcon: {
    color: '#008A3B',
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 6,
  },
  videoBadgeLabel: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
  },
  fullscreenIconBtn: {
    position: 'absolute',
    top: 14,
    right: 14,
    backgroundColor: 'rgba(0,0,0,0.6)',
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullscreenIconText: {
    color: '#FFF',
    fontSize: 16,
  },
  videoPlayerBox: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  videoPoster: {
    width: '100%',
    height: '100%',
    opacity: 0.4,
  },
  videoOverlay: {
    position: 'absolute',
    inset: 0,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  videoHeaderBadge: {
    backgroundColor: 'rgba(0,138,59,0.3)',
    borderWidth: 1,
    borderColor: '#008A3B',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 8,
  },
  videoBadgeText: {
    color: '#008A3B',
    fontSize: 11,
    fontWeight: '900',
  },
  videoPlayingTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 16,
  },
  videoProgressBar: {
    width: '80%',
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
    marginBottom: 20,
  },
  videoProgressFill: {
    width: '55%',
    height: '100%',
    backgroundColor: '#008A3B',
  },
  closeVideoBtn: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  closeVideoText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  infoSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  mainTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  priceXOF: {
    color: '#F59E0B', // Or élégant comme sur la capture
    fontSize: 18,
    fontWeight: '900',
    marginTop: 6,
  },
  salesAndVipRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    backgroundColor: '#131519',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  salesCol: {
    alignItems: 'flex-start',
  },
  salesNumber: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '900',
  },
  salesLabel: {
    color: '#9CA3AF',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 1,
  },
  vipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245,158,11,0.15)',
    borderWidth: 1,
    borderColor: '#F59E0B',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  vipButtonIcon: {
    fontSize: 13,
    marginRight: 6,
  },
  vipButtonText: {
    color: '#F59E0B',
    fontSize: 13,
    fontWeight: '800',
  },
  ctaSubtitle: {
    color: '#F59E0B',
    fontSize: 13.5,
    fontWeight: '700',
    marginTop: 16,
  },
  descriptionText: {
    color: '#D1D5DB',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 8,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginVertical: 18,
  },
  commentsSection: {
    paddingHorizontal: 16,
  },
  commentsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  commentsTitle: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '800',
  },
  commentsFilter: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: '600',
  },
  buyerNoticeCard: {
    backgroundColor: 'rgba(0,138,59,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0,138,59,0.3)',
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
  },
  buyerNoticeText: {
    color: '#A7F3D0',
    fontSize: 11.5,
    lineHeight: 16,
    fontWeight: '600',
  },
  commentInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1b1e24',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  commentInput: {
    flex: 1,
    color: '#FFF',
    fontSize: 13,
    paddingVertical: 6,
  },
  commentSendBtn: {
    backgroundColor: CashPlayColors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginLeft: 8,
  },
  commentSendText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
  },
  lockedCommentBtn: {
    backgroundColor: '#181b20',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    marginBottom: 14,
  },
  lockedCommentText: {
    color: '#F59E0B',
    fontSize: 12,
    fontWeight: '700',
  },
  commentsList: {
    gap: 12,
  },
  commentItem: {
    flexDirection: 'row',
    backgroundColor: '#121418',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
  },
  commentAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(0,138,59,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  commentAvatarText: {
    color: '#008A3B',
    fontSize: 11,
    fontWeight: '900',
  },
  commentContent: {
    flex: 1,
  },
  commentAuthorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 3,
  },
  commentAuthor: {
    color: '#FFF',
    fontSize: 12.5,
    fontWeight: '800',
  },
  verifiedBadge: {
    backgroundColor: 'rgba(0,138,59,0.2)',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  verifiedText: {
    color: '#008A3B',
    fontSize: 9.5,
    fontWeight: '800',
  },
  commentTime: {
    color: '#71717A',
    fontSize: 10,
  },
  commentBody: {
    color: '#D1D5DB',
    fontSize: 12,
    lineHeight: 17,
  },
  stickyFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 68,
    backgroundColor: '#0c0d0e',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    gap: 10,
  },
  standardBuyBtn: {
    flex: 1,
    backgroundColor: 'rgba(245,158,11,0.1)',
    borderWidth: 1,
    borderColor: '#F59E0B',
    height: 46,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  standardBuyText: {
    color: '#F59E0B',
    fontSize: 12.5,
    fontWeight: '900',
  },
  vipBuyBtn: {
    flex: 1,
    backgroundColor: '#008A3B',
    height: 46,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#008A3B',
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  vipBuyText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '900',
  },
  fullscreenModal: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    width: width,
    height: height * 0.75,
    resizeMode: 'contain',
  },
  closeFullscreenBtn: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    zIndex: 999,
  },
  closeFullscreenText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
  vipListOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
  },
  vipListSheet: {
    backgroundColor: '#14161a',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 36,
  },
  vipListHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  vipListTitle: {
    color: '#F59E0B',
    fontSize: 16,
    fontWeight: '900',
  },
  vipListSub: {
    color: '#9CA3AF',
    fontSize: 12,
    marginBottom: 16,
  },
  vipCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#1b1e24',
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  vipFanName: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
  vipFanAmount: {
    color: '#F59E0B',
    fontSize: 13,
    fontWeight: '900',
  },
  becomeVipBtn: {
    backgroundColor: '#008A3B',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  becomeVipText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '900',
  },
});
