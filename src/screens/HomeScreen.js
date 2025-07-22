import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ScrollView,
  Image,
} from 'react-native';
import { FiColors } from '../theme/consolidatedFiColors';
import { useLanguage } from '../localization/LanguageContext';
import BalanceCard from '../components/BalanceCard';
import PlantRewards from '../components/PlantRewards';
import QuickActions from '../components/QuickActions';
import VibeCard from '../components/VibeCard';
import InflationCard from '../components/InflationCard';
import DataService from '../services/DataService';
import { getAvatarSource } from '../utils/avatarHelper';

const HomeScreen = ({ navigation, route }) => {
  const { t } = useLanguage();
  const [balance, setBalance] = useState(0);
  const [netWorth, setNetWorth] = useState(0);
  const [userName, setUserName] = useState('');
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [plantGrowth, setPlantGrowth] = useState(3);
  const [rewardPoints, setRewardPoints] = useState(245);
  const [currentUser, setCurrentUser] = useState('1010101010');
  const [availableUsers] = useState(DataService.getAvailableUsers());
  const [userAvatar, setUserAvatar] = useState(1);

  useEffect(() => {
    loadUserData();
  }, [currentUser]);

  useEffect(() => {
    if (route.params?.spendingData) {
      // Handle inflation data from setup screen
      console.log('Received spending data:', route.params.spendingData);
    }
  }, [route.params]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      
      // Load comprehensive user data
      const userBalance = await DataService.getUserBalance(currentUser);
      const userNetWorth = await DataService.getUserNetWorth(currentUser);
      const profile = await DataService.getUserProfile(currentUser);
      const avatar = DataService.getUserAvatar(currentUser);
      
      setBalance(userBalance);
      setNetWorth(userNetWorth?.netWorth || 0);
      setUserName(profile?.name || 'User');
      setUserProfile(profile);
      setUserAvatar(avatar);
      
      console.log(`✅ Loaded data for ${profile?.name}: ₹${userBalance.toLocaleString()} balance, ₹${userNetWorth?.netWorth?.toLocaleString()} net worth`);
      
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTransaction = (amount) => {
    setBalance(balance + amount);
    if (amount > 0) {
      setPlantGrowth(Math.min(plantGrowth + 1, 6));
      setRewardPoints(rewardPoints + 10);
    }
  };

  const switchUser = (userId) => {
    setCurrentUser(userId);
    DataService.setCurrentUser(userId);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={FiColors.primary} />
          <Text style={styles.loadingText}>Loading user data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={FiColors.background} />
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.profileButton}
              onPress={() => {
                const currentIndex = availableUsers.findIndex(user => user.userId === currentUser);
                const nextIndex = (currentIndex + 1) % availableUsers.length;
                switchUser(availableUsers[nextIndex].userId);
              }}>
              <Image 
                source={getAvatarSource(userAvatar)}
                style={styles.avatarImage}
              />
            </TouchableOpacity>
            
            <View style={styles.centerContent}>
              <Text style={styles.greeting}>Hi {userName}! 👋</Text>
              <Text style={styles.subtitle}>{userProfile?.profession || 'Professional'}</Text>
              <Text style={styles.location}>{userProfile?.location || ''}</Text>
            </View>
            
            <View style={styles.rightIcons}>
              <TouchableOpacity style={styles.iconButton}>
                <Text style={styles.iconEmoji}>📢</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <Text style={styles.iconEmoji}>🔔</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Enhanced Balance Card with Net Worth */}
          <View style={styles.balanceSection}>
            <BalanceCard balance={balance} />
            <View style={styles.netWorthCard}>
              <Text style={styles.netWorthLabel}>Net Worth</Text>
              <Text style={styles.netWorthValue}>₹{netWorth.toLocaleString()}</Text>
            </View>
          </View>
          
          <InflationCard userId={currentUser} navigation={navigation} />
          
          <PlantRewards plantGrowth={plantGrowth} rewardPoints={rewardPoints} />
          
          <View style={styles.actionContainer}>
            <TouchableOpacity
              style={[styles.actionButton, styles.primaryButton]}
              onPress={() => handleTransaction(1000)}>
              <Text style={styles.primaryButtonText}>💰 Add Money</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.secondaryButton]}
              onPress={() => handleTransaction(-500)}>
              <Text style={styles.secondaryButtonText}>📤 Send Money</Text>
            </TouchableOpacity>
          </View>
          
          <QuickActions />
          
          <VibeCard />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: FiColors.background },
  scrollContainer: { flex: 1 },
  content: { padding: 20, paddingTop: 20, paddingBottom: 90 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingHorizontal: 4 },
  profileButton: { width: 44, height: 44, borderRadius: 22, overflow: 'hidden', borderWidth: 2, borderColor: FiColors.primary },
  avatarImage: { width: 40, height: 40, borderRadius: 20 },
  centerContent: { flex: 1, alignItems: 'center' },
  greeting: { fontSize: 20, fontWeight: '600', color: '#00D4AA', marginBottom: 2 },
  subtitle: { fontSize: 12, color: FiColors.secondary, fontStyle: 'italic' },
  rightIcons: { flexDirection: 'row', gap: 8 },
  iconButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: FiColors.surface, alignItems: 'center', justifyContent: 'center' },
  iconEmoji: { fontSize: 18 },
  userInfo: { fontSize: 12, color: FiColors.secondary, marginBottom: 16, textAlign: 'center' },
  actionContainer: { flexDirection: 'row', gap: 12, marginBottom: 32 },
  actionButton: { flex: 1, paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  primaryButton: { backgroundColor: FiColors.primary },
  secondaryButton: { backgroundColor: FiColors.secondary },
  primaryButtonText: { color: FiColors.white, fontSize: 16, fontWeight: '600' },
  secondaryButtonText: { color: FiColors.white, fontSize: 16, fontWeight: '600' },
  
  // New styles for enhanced data
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: FiColors.background,
  },
  loadingText: {
    color: FiColors.textInverse,
    fontSize: 16,
    marginTop: 16,
  },
  location: {
    color: FiColors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  balanceSection: {
    marginBottom: 20,
  },
  netWorthCard: {
    backgroundColor: FiColors.surface,
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
    alignItems: 'center',
  },
  netWorthLabel: {
    color: FiColors.textSecondary,
    fontSize: 14,
    marginBottom: 4,
  },
  netWorthValue: {
    color: FiColors.text,
    fontSize: 24,
    fontWeight: '600',
  },
});

export default HomeScreen;