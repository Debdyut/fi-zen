import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Image,
  Animated,
} from 'react-native';
import { CardProvider, DynamicCardGrid } from '../components/common/DynamicCardSystem';
import SmartChatInterface from '../components/ai/SmartChatInterface';
import FiInflationCard from '../components/fi-style/FiInflationCard';
import { TouchableArea } from '../components/common/AccessibilityHelpers';
import { useLanguage } from '../localization/LanguageContext';
import { useTheme } from '../theme/ThemeContext';

import { EnhancedButton } from '../components/common/EnhancedButtons';
import { AnimatedCard, FadeInUp } from '../components/animations/AnimatedCard';
import { EnhancedPullToRefresh } from '../components/common/PullToRefresh';
import { AccessibleHeading } from '../components/common/AccessibilityHelpers';
import DataService from '../services/DataService';
import { getAvatarSource } from '../utils/avatarHelper';

const EnhancedHomeScreen = ({ navigation, route }) => {
  const { t } = useLanguage();
  const { isDarkMode } = useTheme();
  const [scrollY] = useState(new Animated.Value(0));
  const [chatVisible, setChatVisible] = useState(false);
  const [chatInitialMessage, setChatInitialMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [userAvatar, setUserAvatar] = useState(1);
  const styles = createStyles();

  useEffect(() => {
    loadUserData();
  }, [route.params?.selectedUserId]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      
      // Get current user (from route params or DataService)
      const paramUser = route.params?.selectedUserId;
      const serviceUser = DataService.getCurrentUser();
      const currentUserId = paramUser || serviceUser || '1010101010';
      
      if (paramUser) {
        DataService.setCurrentUser(paramUser);
      }

      // Load user data
      const [userProfile, userGoals, userSpending, userNetWorth, avatar] = await Promise.all([
        DataService.getUserProfile(currentUserId),
        DataService.getUserGoals(currentUserId),
        DataService.getUserSpending(currentUserId),
        DataService.getUserNetWorth(currentUserId),
        DataService.getUserAvatar(currentUserId)
      ]);
      
      setUserAvatar(avatar);

      // Construct user object for cards
      const userData = {
        userId: currentUserId,
        name: userProfile?.name || 'User',
        profile: {
          profession: userProfile?.profession || 'Professional',
          monthlyIncome: userProfile?.monthlyIncome || 50000,
          location: userProfile?.location || 'India',
          riskProfile: userProfile?.riskProfile || 'moderate',
          age: userProfile?.age || 30
        },
        goals: userGoals || [],
        monthlySpending: userSpending || {},
        netWorth: userNetWorth || { netWorth: 0 },
        // Add personal inflation if available
        personalInflation: userProfile?.personalInflation || null,
        // Add financial health if available
        financialHealth: userProfile?.financialHealth || {
          score: 70,
          status: 'Good'
        }
      };

      setUser(userData);
    } catch (error) {
      console.error('Error loading user data:', error);
      // Fallback to basic user data
      setUser({
        userId: '1010101010',
        name: 'User',
        profile: {
          profession: 'Professional',
          monthlyIncome: 50000,
          location: 'India',
          riskProfile: 'moderate',
          age: 30
        },
        goals: [
          { title: 'Emergency Fund', targetAmount: 300000, completed: false, progress: 65 },
          { title: 'Home Down Payment', targetAmount: 1000000, completed: false, progress: 30 },
          { title: 'Vacation Fund', targetAmount: 150000, completed: true, progress: 100 }
        ],
        monthlySpending: {},
        netWorth: { netWorth: 0 },
        personalInflation: null
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChatRequest = (message) => {
    setChatInitialMessage(message);
    setChatVisible(true);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00D4AA" />
        <Text style={styles.loadingText}>Loading your dashboard...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Unable to load user data</Text>
        <TouchableOpacity onPress={loadUserData} style={styles.retryButton}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Fi-style header animations
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [105, 70],
    extrapolate: 'clamp',
  });
  const avatarSize = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [40, 30],
    extrapolate: 'clamp',
  });
  const iconSize = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [18, 14],
    extrapolate: 'clamp',
  });
  const buttonSize = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [40, 30],
    extrapolate: 'clamp',
  });

  // Fi-style Sticky Header
  const StickyHeader = () => (
    <Animated.View style={[styles.stickyHeader, { height: headerHeight }]}>
      <StatusBar barStyle="light-content" backgroundColor="#00D4AA" />
      
      <TouchableArea 
        style={styles.profileButton}
        onPress={() => navigation.navigate('Profile')}
      >
        <Animated.Image 
          source={getAvatarSource(userAvatar)} 
          style={[styles.profileAvatar, { width: avatarSize, height: avatarSize, borderRadius: Animated.divide(avatarSize, 2) }]}
        />
      </TouchableArea>
      
      <View style={styles.headerActions}>
        <Animated.View style={[styles.headerActionButton, { width: buttonSize, height: buttonSize, borderRadius: Animated.divide(buttonSize, 2) }]}>
          <TouchableArea style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Animated.Text style={[styles.headerActionIcon, { fontSize: iconSize }]}>🔔</Animated.Text>
          </TouchableArea>
        </Animated.View>
        
        <Animated.View style={[styles.headerActionButton, { width: buttonSize, height: buttonSize, borderRadius: Animated.divide(buttonSize, 2) }]}>
          <TouchableArea style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Animated.Text style={[styles.headerActionIcon, { fontSize: iconSize }]}>📢</Animated.Text>
          </TouchableArea>
        </Animated.View>
      </View>
    </Animated.View>
  );

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Fi-style Welcome Section
  const WelcomeSection = () => (
    <View style={[styles.welcomeSection, { backgroundColor: isDarkMode ? '#1A1A1A' : '#E6FBF7' }]}>
      <View style={styles.greeting}>
        <Text style={[styles.greetingText, { color: isDarkMode ? '#FFFFFF' : '#1A1A1A' }]}>{getGreeting()}</Text>
        <Text style={[styles.userName, { color: isDarkMode ? '#FFFFFF' : '#1A1A1A' }]}>{user.name}</Text>
      </View>

      <View style={styles.wealthSection}>
        <Text style={[styles.wealthLabel, { color: isDarkMode ? '#FFFFFF' : '#1A1A1A' }]}>Total Balance</Text>
        <Text style={[styles.wealthValue, { color: isDarkMode ? '#FFFFFF' : '#1A1A1A' }]}>₹{(user.profile?.monthlyIncome * 2.5 || 125000).toLocaleString()}</Text>
        <Text style={styles.wealthSubtext}>+₹{((user.monthlySpending ? Object.values(user.monthlySpending).reduce((a,b) => a+b, 0) : 15000) * 0.1).toLocaleString()} this month</Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#1A1A1A' : '#E6FBF7' }]}>
      <StickyHeader />
      
      <Animated.ScrollView 
        style={[styles.content, { backgroundColor: isDarkMode ? '#1A1A1A' : '#E6FBF7' }]} 
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        <WelcomeSection />
        {/* Personal Inflation Card */}
        <FadeInUp delay={100}>
          <FiInflationCard 
            inflationData={user.personalInflation}
            userData={user}
            userProfile={user.profile}
          />
        </FadeInUp>

        {/* Dynamic Cards */}
        <FadeInUp delay={200}>
          <CardProvider screenType="home" user={user}>
            <DynamicCardGrid
              screenType="home"
              user={user}
              onChatRequest={handleChatRequest}
            />
          </CardProvider>
        </FadeInUp>
        
        {/* Trust Section */}
        <FadeInUp delay={700}>
          <View style={styles.trustSection}>
            <Text style={styles.trustTitle}>🛡️ Trusted & Secure</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.trustScrollContainer}
            >
              <AnimatedCard style={styles.complianceCard}>
                <View style={styles.complianceHeader}>
                  <Image 
                    source={require('../../assets/logos/Reserve_Bank_of_India_logo.svg.png')} 
                    style={styles.logo} 
                    resizeMode="contain" 
                  />
                  <Text style={styles.complianceTitle}>Reserve Bank of India (RBI)</Text>
                </View>
                <View style={styles.complianceContent}>
                  <Text style={styles.pointTitle}>Digital Lending Guidelines 2022</Text>
                  <Text style={styles.pointDescription}>Transparent calculation methodology and clear disclosure of data usage</Text>
                </View>
              </AnimatedCard>
              
              <AnimatedCard style={styles.complianceCard}>
                <View style={styles.complianceHeader}>
                  <Image 
                    source={require('../../assets/logos/sebi-new-logo-445.jpg')} 
                    style={styles.logo} 
                    resizeMode="contain" 
                  />
                  <Text style={styles.complianceTitle}>Securities and Exchange Board of India (SEBI)</Text>
                </View>
                <View style={styles.complianceContent}>
                  <Text style={styles.pointTitle}>Educational Content Only</Text>
                  <Text style={styles.pointDescription}>All inflation insights are for educational purposes, not investment advice</Text>
                </View>
              </AnimatedCard>
              
              <AnimatedCard style={styles.complianceCard}>
                <View style={styles.complianceHeader}>
                  <Image 
                    source={require('../../assets/logos/Ministry-of-ELectronics-Information-Technology-MeiTY-logo.-Image-via-MEitY..png')} 
                    style={styles.logo} 
                    resizeMode="contain" 
                  />
                  <Text style={styles.complianceTitle}>Ministry of Electronics & IT (MeitY)</Text>
                </View>
                <View style={styles.complianceContent}>
                  <Text style={styles.pointTitle}>Data Protection</Text>
                  <Text style={styles.pointDescription}>Compliance with IT Rules 2021 and upcoming Personal Data Protection Act</Text>
                </View>
              </AnimatedCard>
              
              <AnimatedCard style={styles.complianceCard}>
                <View style={styles.complianceHeader}>
                  <Image 
                    source={require('../../assets/logos/PCI-DSS-1.png')} 
                    style={styles.logo} 
                    resizeMode="contain" 
                  />
                  <Text style={styles.complianceTitle}>Payment Card Industry (PCI DSS)</Text>
                </View>
                <View style={styles.complianceContent}>
                  <Text style={styles.pointTitle}>Secure Data Handling</Text>
                  <Text style={styles.pointDescription}>Bank-grade security for all financial data transmission and processing</Text>
                </View>
              </AnimatedCard>
            </ScrollView>
          </View>
        </FadeInUp>
        
        <View style={{ height: 100 }} />
      </Animated.ScrollView>
      
      <SmartChatInterface
        user={user}
        currentScreen="home"
        visible={chatVisible}
        onClose={() => setChatVisible(false)}
        initialMessage={chatInitialMessage}
      />
    </View>

  );
};

const createStyles = () => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E6FBF7',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E6FBF7',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#1A1A1A',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E6FBF7',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#FF4444',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#00D4AA',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  // Fi-style header styles
  stickyHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#00D4AA',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  profileButton: {
    padding: 2,
  },
  profileAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerActionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerActionIcon: {
    fontSize: 18,
  },
  content: {
    flex: 1,
    backgroundColor: '#E6FBF7',
    paddingTop: 105,
  },
  welcomeSection: {
    backgroundColor: '#E6FBF7',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  greeting: {
    marginBottom: 24,
  },
  greetingText: {
    fontSize: 16,
    color: '#1A1A1A',
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  wealthSection: {
    alignItems: 'center',
  },
  wealthLabel: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '600',
    marginBottom: 8,
  },
  wealthValue: {
    fontSize: 36,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 4,
  },
  wealthSubtext: {
    fontSize: 14,
    color: '#00D4AA',
    fontWeight: '500',
  },
  trustSection: {
    padding: 20,
  },
  trustTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666666',
    marginBottom: 16,
    paddingLeft: 4,
  },
  trustScrollContainer: {
    gap: 16,
    paddingHorizontal: 20,
  },
  complianceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    width: 280,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  complianceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  complianceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    flex: 1,
  },
  complianceContent: {
    gap: 8,
  },
  pointTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  pointDescription: {
    fontSize: 13,
    color: '#666666',
    lineHeight: 18,
  },
});

export default EnhancedHomeScreen;
