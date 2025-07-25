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
  ActivityIndicator,
} from 'react-native';
import { FiColors } from '../theme/consolidatedFiColors';
import { useLanguage } from '../localization/LanguageContext';

// Removed missing component imports
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
  const [currentUser, setCurrentUser] = useState(null);
  const [availableUsers] = useState(() => {
    const users = DataService.getAvailableUsers();
    console.log('Available users:', users);
    return users;
  });
  const [userAvatar, setUserAvatar] = useState(1);

  useEffect(() => {
    console.log('🏠 HomeScreen mounted, route.params:', route.params);
    // Check if user was passed via navigation params first
    const paramUser = route.params?.selectedUserId;
    const serviceUser = DataService.getCurrentUser();
    const user = paramUser || serviceUser || '1010101010';
    console.log('HomeScreen: Getting user - param:', paramUser, 'service:', serviceUser, 'final:', user);
    setCurrentUser(user);
    if (paramUser) {
      DataService.setCurrentUser(paramUser);
    }
  }, [route.params?.selectedUserId]);

  // Also listen for focus events to refresh data
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('🎯 HomeScreen focused');
      const user = DataService.getCurrentUser() || '1010101010';
      console.log('HomeScreen focus: current user from service:', user);
      setCurrentUser(user);
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (currentUser) {
      console.log('HomeScreen: useEffect triggered - Loading data for user:', currentUser);
      loadUserData();
    } else {
      console.log('HomeScreen: useEffect triggered but no currentUser');
    }
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
      console.log(`🔄 loadUserData called for user: ${currentUser}`);
      
      // Load comprehensive user data
      console.log('📞 Calling DataService.getUserBalance...');
      const userBalance = await DataService.getUserBalance(currentUser);
      console.log('📞 Calling DataService.getUserNetWorth...');
      const userNetWorth = await DataService.getUserNetWorth(currentUser);
      console.log('📞 Calling DataService.getUserProfile...');
      const profile = await DataService.getUserProfile(currentUser);
      console.log('📞 Calling DataService.getUserAvatar...');
      const avatar = DataService.getUserAvatar(currentUser);
      
      console.log('Raw data loaded:', { userBalance, userNetWorth, profile, avatar });
      
      setBalance(userBalance);
      setNetWorth(userNetWorth?.netWorth || 0);
      setUserName(profile?.name || 'User');
      setUserProfile(profile);
      setUserAvatar(avatar);
      
      console.log('State updated - Balance:', userBalance, 'NetWorth:', userNetWorth?.netWorth, 'Name:', profile?.name);
      
      console.log(`✅ UI Updated for ${profile?.name}: ₹${userBalance.toLocaleString()} balance, ₹${userNetWorth?.netWorth?.toLocaleString()} net worth`);
      
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
    console.log(`Switching to user: ${userId}`);
    setCurrentUser(userId);
    DataService.setCurrentUser(userId);
  };

  if (loading || !currentUser) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={FiColors.primary} />
          <Text style={styles.loadingText}>Loading user data...</Text>
          <Text style={styles.loadingText}>Current user: {currentUser || 'None'}</Text>
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
                const nextUser = availableUsers[nextIndex];
                console.log('Current user:', currentUser, 'Next user:', nextUser);
                switchUser(nextUser.userId);
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
              <Text style={styles.debugText}>User: {currentUser}</Text>
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
            <View style={styles.balanceCard}>
              <Text style={styles.balanceLabel}>Total Balance</Text>
              <Text style={styles.balanceValue}>₹{balance.toLocaleString()}</Text>
            </View>
            <View style={styles.netWorthCard}>
              <Text style={styles.netWorthLabel}>Net Worth</Text>
              <Text style={styles.netWorthValue}>₹{netWorth.toLocaleString()}</Text>
            </View>
          </View>
          
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
    padding: 20,
    borderRadius: 12,
    marginTop: 12,
    alignItems: 'center',
  },
  netWorthLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 6,
    textAlign: 'center',
  },
  netWorthValue: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
  },
  balanceCard: {
    backgroundColor: FiColors.surface,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  balanceLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 6,
    textAlign: 'center',
  },
  balanceValue: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
  },
  debugText: {
    color: FiColors.textSecondary,
    fontSize: 10,
    marginTop: 2,
  },
});

export default HomeScreen;