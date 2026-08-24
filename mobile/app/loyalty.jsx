import React, { useContext, useMemo } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Award, Sparkles, Star, Zap, Check } from 'lucide-react-native';
import { AuthContext } from '../context/AuthContext';

const { width } = Dimensions.get('window');

const TIERS = [
  { name: 'Bronze', min: 0, max: 499, color: '#cd7f32', bg: '#fef3c7', icon: Star, benefits: ['Earn 1 point per $1 spent', 'Birthday surprise'] },
  { name: 'Silver', min: 500, max: 1999, color: '#94a3b8', bg: '#f1f5f9', icon: Zap, benefits: ['1.5x points multiplier', 'Early access to sales', 'Free standard shipping'] },
  { name: 'Gold', min: 2000, max: 4999, color: '#eab308', bg: '#fef9c3', icon: Award, benefits: ['2x points multiplier', 'Free express shipping', 'Priority customer support'] },
  { name: 'Platinum', min: 5000, max: Infinity, color: '#0f172a', bg: '#e2e8f0', icon: Sparkles, benefits: ['3x points multiplier', 'Personal styling session', 'VIP gifts & experiences'] },
];

export default function LoyaltyDashboardScreen() {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  // If user is not logged in, mock data or show auth prompt
  const currentPoints = user?.loyaltyPoints || 0;
  const currentTier = user?.loyaltyTier || 'Bronze';

  const currentTierIndex = TIERS.findIndex(t => t.name === currentTier);
  const activeTierData = TIERS[currentTierIndex] || TIERS[0];
  const nextTier = currentTierIndex < TIERS.length - 1 ? TIERS[currentTierIndex + 1] : null;

  const progress = useMemo(() => {
    if (!nextTier) return 100;
    const range = nextTier.min - activeTierData.min;
    const currentProgress = currentPoints - activeTierData.min;
    return Math.min(Math.max((currentProgress / range) * 100, 0), 100);
  }, [currentPoints, nextTier, activeTierData]);

  const pointsToNext = nextTier ? nextTier.min - currentPoints : 0;
  
  const IconComponent = activeTierData.icon;

  if (!user) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color="#0f172a" />
          </TouchableOpacity>
        </View>
        <View style={styles.unauthContainer}>
          <Sparkles size={64} color="#eab308" style={{marginBottom: 24}} />
          <Text style={styles.unauthTitle}>ShopPilot Rewards</Text>
          <Text style={styles.unauthText}>Log in to view your loyalty points, tier status, and exclusive benefits.</Text>
          <TouchableOpacity style={styles.loginBtn} onPress={() => router.push('/(auth)/login')}>
            <Text style={styles.loginBtnText}>Log In to View Rewards</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>ShopPilot Rewards</Text>
        <View style={{width: 40}}/>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Status Card */}
        <View style={[styles.statusCard, { backgroundColor: activeTierData.bg }]}>
          <View style={styles.statusHeader}>
            <View>
              <Text style={styles.statusLabel}>YOUR STATUS</Text>
              <Text style={[styles.statusTier, { color: activeTierData.color }]}>{currentTier}</Text>
            </View>
            <View style={[styles.iconBox, { backgroundColor: activeTierData.color }]}>
              <IconComponent size={28} color="#fff" />
            </View>
          </View>
          
          <Text style={styles.pointsValue}>
            {currentPoints.toLocaleString()} <Text style={styles.pointsLabel}>pts</Text>
          </Text>

          <View style={styles.progressContainer}>
            {nextTier ? (
              <>
                <View style={styles.progressHeader}>
                  <Text style={styles.progressText}>
                    <Text style={{fontWeight: 'bold'}}>{pointsToNext.toLocaleString()}</Text> pts away from {nextTier.name}
                  </Text>
                  <Text style={styles.progressText}>{nextTier.min.toLocaleString()} pts</Text>
                </View>
                <View style={styles.progressBarBg}>
                  <View style={[styles.progressBarFill, { width: `${progress}%`, backgroundColor: activeTierData.color }]} />
                </View>
              </>
            ) : (
              <Text style={styles.maxTierText}>You've reached the highest tier! Enjoy your Platinum benefits.</Text>
            )}
          </View>
        </View>

        <Text style={styles.benefitsTitle}>Tier Benefits</Text>

        {TIERS.map((tier, idx) => {
          const isCurrent = tier.name === currentTier;
          const isLocked = currentTierIndex < idx;
          const TierIcon = tier.icon;
          
          return (
            <View key={tier.name} style={[styles.tierCard, isCurrent && styles.tierCardCurrent, isLocked && styles.tierCardLocked]}>
              <View style={styles.tierHeader}>
                <View style={[styles.tierIconBox, { backgroundColor: tier.color }]}>
                  <TierIcon size={20} color="#fff" />
                </View>
                <View style={{flex: 1}}>
                  <Text style={styles.tierName}>{tier.name}</Text>
                  <Text style={styles.tierReq}>{idx === 0 ? 'Signup' : `${tier.min.toLocaleString()} pts`}</Text>
                </View>
                {isCurrent && (
                  <View style={styles.currentBadge}>
                    <Text style={styles.currentBadgeText}>Current Tier</Text>
                  </View>
                )}
              </View>
              
              <View style={styles.benefitsList}>
                {tier.benefits.map((benefit, bIdx) => (
                  <View key={bIdx} style={styles.benefitRow}>
                    <Check size={16} color={isLocked ? '#94a3b8' : '#16a34a'} style={{marginRight: 8}} />
                    <Text style={[styles.benefitText, isLocked && styles.benefitTextLocked]}>{benefit}</Text>
                  </View>
                ))}
              </View>
            </View>
          );
        })}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  unauthContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  unauthTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 8,
  },
  unauthText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  loginBtn: {
    backgroundColor: '#6366f1',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  loginBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 24,
        backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  statusCard: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#64748b',
    letterSpacing: 1,
    marginBottom: 4,
  },
  statusTier: {
    fontSize: 32,
    fontWeight: '900',
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pointsValue: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 24,
  },
  pointsLabel: {
    fontSize: 18,
    color: '#64748b',
    fontWeight: 'normal',
  },
  progressContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 12,
    color: '#475569',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  maxTierText: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '500',
    textAlign: 'center',
  },
  benefitsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  tierCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  tierCardCurrent: {
    borderColor: '#6366f1',
  },
  tierCardLocked: {
    opacity: 0.6,
  },
  tierHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  tierIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  tierName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  tierReq: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  currentBadge: {
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  currentBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#4f46e5',
  },
  benefitsList: {
    gap: 8,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  benefitText: {
    fontSize: 14,
    color: '#334155',
    flex: 1,
  },
  benefitTextLocked: {
    color: '#64748b',
  },
});
