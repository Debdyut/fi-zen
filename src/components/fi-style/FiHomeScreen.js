import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, Image, Animated } from 'react-native';
import { FadeInUp } from '../animations/AnimatedCard';
import { TouchableArea } from '../common/AccessibilityHelpers';
import FiInflationCard from './FiInflationCard';
import FiMetricsCards from './FiMetricsCards';

// Fi App Colors (from screenshots)
const FiColors = {
  background: '#1A1A1A',
  surface: '#FFFFFF',
  primary: '#00D4AA',
  text: '#1A1A1A',
  textSecondary: '#666666',
  textInverse: '#FFFFFF',
  border: '#E0E0E0',
};

const FiHomeScreen = ({ navigation, inflationData }) => {
  const [scrollY] = useState(new Animated.Value(0));
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
  const headerPadding = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [15, 20],
    extrapolate: 'clamp',
  });
  // Sticky Header Component
  const StickyHeader = () => (
    <Animated.View style={[styles.stickyHeader, { height: headerHeight }]}>
      <StatusBar barStyle="light-content" backgroundColor={FiColors.background} />
      
      <TouchableArea 
        style={styles.profileButton}
        onPress={() => navigation.navigate('Profile')}
      >
        <Animated.Image 
          source={require('../../../assets/avatars/avatar-1.png')} 
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

  const WelcomeSection = () => (
    <View style={styles.welcomeSection}>
      <View style={styles.greeting}>
        <Text style={styles.greetingText}>{getGreeting()}</Text>
        <Text style={styles.userName}>Arjun</Text>
      </View>

      {/* Fi-style wealth display */}
      <View style={styles.wealthSection}>
        <Text style={styles.wealthLabel}>Your Financial Health</Text>
        <Text style={styles.wealthValue}>₹12,45,000</Text>
        <Text style={styles.wealthSubtext}>+₹15,000 this month</Text>
      </View>
    </View>
  );

  const FiQuickActions = () => (
    <FadeInUp delay={200}>
      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        
        <View style={styles.actionsGrid}>
          <TouchableArea style={styles.actionCard}>
            <Text style={styles.actionIcon}>📊</Text>
            <Text style={styles.actionText}>Check Rate</Text>
          </TouchableArea>
          
          <TouchableArea style={styles.actionCard}>
            <Text style={styles.actionIcon}>💼</Text>
            <Text style={styles.actionText}>Salary Tool</Text>
          </TouchableArea>
          
          <TouchableArea style={styles.actionCard}>
            <Text style={styles.actionIcon}>🏙️</Text>
            <Text style={styles.actionText}>City Compare</Text>
          </TouchableArea>
          
          <TouchableArea style={styles.actionCard}>
            <Text style={styles.actionIcon}>📈</Text>
            <Text style={styles.actionText}>Invest</Text>
          </TouchableArea>
        </View>
      </View>
    </FadeInUp>
  );

  const FiInsightsPreview = () => (
    <FadeInUp delay={300}>
      <View style={styles.insightsPreview}>
        <View style={styles.previewHeader}>
          <Text style={styles.sectionTitle}>Latest Insights</Text>
          <TouchableArea onPress={() => navigation.navigate('Insights')}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableArea>
        </View>
        
        <View style={styles.insightCard}>
          <Text style={styles.insightIcon}>📈</Text>
          <View style={styles.insightContent}>
            <Text style={styles.insightTitle}>Inflation Impact</Text>
            <Text style={styles.insightText}>Your monthly costs increased by ₹2,450</Text>
          </View>
        </View>
        
        <View style={styles.insightCard}>
          <Text style={styles.insightIcon}>💡</Text>
          <View style={styles.insightContent}>
            <Text style={styles.insightTitle}>Smart Tip</Text>
            <Text style={styles.insightText}>Switch to bulk buying to save ₹180/month</Text>
          </View>
        </View>
      </View>
    </FadeInUp>
  );

  const FiGoalsPreview = () => (
    <FadeInUp delay={400}>
      <View style={styles.goalsPreview}>
        <View style={styles.previewHeader}>
          <Text style={styles.sectionTitle}>Your Goals</Text>
          <TouchableArea onPress={() => navigation.navigate('Goals')}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableArea>
        </View>
        
        <View style={styles.goalCard}>
          <View style={styles.goalHeader}>
            <Text style={styles.goalIcon}>🛡️</Text>
            <View style={styles.goalInfo}>
              <Text style={styles.goalTitle}>Emergency Fund</Text>
              <Text style={styles.goalProgress}>25% complete</Text>
            </View>
          </View>
          <View style={styles.goalProgressBar}>
            <View style={[styles.goalProgressFill, { width: '25%' }]} />
          </View>
        </View>
        
        <View style={styles.goalCard}>
          <View style={styles.goalHeader}>
            <Text style={styles.goalIcon}>🏠</Text>
            <View style={styles.goalInfo}>
              <Text style={styles.goalTitle}>House Down Payment</Text>
              <Text style={styles.goalProgress}>23% complete</Text>
            </View>
          </View>
          <View style={styles.goalProgressBar}>
            <View style={[styles.goalProgressFill, { width: '23%' }]} />
          </View>
        </View>
      </View>
    </FadeInUp>
  );

  const FiTrustBadges = () => (
    <FadeInUp delay={500}>
      <View style={styles.trustSection}>
        <Text style={styles.trustTitle}>Trusted & Secure</Text>
        <ScrollView 
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.trustBadges}
          contentContainerStyle={styles.trustBadgesContent}
        >
          <Image 
            source={require('../../../assets/logos/Reserve_Bank_of_India_logo.svg.png')} 
            style={styles.trustLogo}
            resizeMode="contain"
          />
          <Image 
            source={require('../../../assets/logos/Logo-MOSPI-01.58746789e2643aae82fb.png')} 
            style={styles.trustLogo}
            resizeMode="contain"
          />
          <Image 
            source={require('../../../assets/logos/NPCI_logo.svg.png')} 
            style={styles.trustLogo}
            resizeMode="contain"
          />
          <Image 
            source={require('../../../assets/logos/PCI-DSS-1.png')} 
            style={styles.trustLogo}
            resizeMode="contain"
          />
          <Image 
            source={require('../../../assets/logos/sebi-new-logo-445.jpg')} 
            style={styles.trustLogo}
            resizeMode="contain"
          />
          <Image 
            source={require('../../../assets/logos/Ministry-of-ELectronics-Information-Technology-MeiTY-logo.-Image-via-MEitY..png')} 
            style={styles.trustLogo}
            resizeMode="contain"
          />
          <Image 
            source={require('../../../assets/logos/iso-27001-certified.jpg')} 
            style={styles.trustLogo}
            resizeMode="contain"
          />
        </ScrollView>
      </View>
    </FadeInUp>
  );

  return (
    <View style={styles.container}>
      <StickyHeader />
      
      <Animated.ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        <WelcomeSection />
        
        {/* Main Inflation Card */}
        <FiInflationCard inflationData={inflationData} />
        
        {/* Metrics Cards */}
        <FiMetricsCards 
          inflationData={inflationData}
          onCardPress={(cardId) => navigation.navigate('MetricDetail', { cardId })}
        />
        

        
        {/* Insights Preview */}
        <FiInsightsPreview />
        
        {/* Goals Preview */}
        <FiGoalsPreview />
        
        {/* Trust Badges */}
        <FiTrustBadges />
        
        <View style={{ height: 100 }} />
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: FiColors.background,
  },
  stickyHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: FiColors.background,
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
    backgroundColor: FiColors.textInverse + '10',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerActionIcon: {
    fontSize: 18,
  },
  content: {
    flex: 1,
    backgroundColor: FiColors.background,
    paddingTop: 105,
  },
  welcomeSection: {
    backgroundColor: FiColors.background,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  greeting: {
    marginBottom: 24,
  },
  greetingText: {
    fontSize: 16,
    color: FiColors.textInverse + '80',
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: '600',
    color: FiColors.textInverse,
  },
  wealthSection: {
    alignItems: 'center',
  },
  wealthLabel: {
    fontSize: 14,
    color: FiColors.textInverse + '80',
    marginBottom: 8,
  },
  wealthValue: {
    fontSize: 36,
    fontWeight: '300',
    color: FiColors.textInverse,
    marginBottom: 4,
  },
  wealthSubtext: {
    fontSize: 14,
    color: FiColors.primary,
    fontWeight: '500',
  },
  quickActions: {
    margin: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: FiColors.text,
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    backgroundColor: FiColors.surface,
    borderRadius: 12,
    padding: 16,
    width: '48%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    color: FiColors.text,
  },
  insightsPreview: {
    margin: 16,
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: FiColors.primary,
  },
  insightCard: {
    backgroundColor: FiColors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  insightIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: FiColors.text,
    marginBottom: 2,
  },
  insightText: {
    fontSize: 13,
    color: FiColors.textSecondary,
  },
  goalsPreview: {
    margin: 16,
  },
  goalCard: {
    backgroundColor: FiColors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  goalInfo: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: FiColors.text,
    marginBottom: 2,
  },
  goalProgress: {
    fontSize: 13,
    color: FiColors.textSecondary,
  },
  goalProgressBar: {
    height: 6,
    backgroundColor: FiColors.border + '40',
    borderRadius: 3,
    overflow: 'hidden',
  },
  goalProgressFill: {
    height: '100%',
    backgroundColor: FiColors.primary,
    borderRadius: 3,
  },
  trustSection: {
    backgroundColor: FiColors.surface,
    margin: 16,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  trustTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: FiColors.text,
    marginBottom: 12,
  },
  trustBadges: {
    marginTop: 12,
  },
  trustBadgesContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 20,
  },
  trustLogo: {
    width: 120,
    height: 70,
  },

});

export default FiHomeScreen;
