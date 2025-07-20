import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar } from 'react-native';
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
  const [selectedTab, setSelectedTab] = useState('inflation');

  const FiHeader = () => (
    <View style={styles.header}>
      <StatusBar barStyle="light-content" backgroundColor={FiColors.background} />
      
      <View style={styles.headerTop}>
        <View style={styles.greeting}>
          <Text style={styles.greetingText}>Good morning</Text>
          <Text style={styles.userName}>Arjun</Text>
        </View>
        
        <TouchableArea style={styles.profileButton}>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileInitial}>A</Text>
          </View>
        </TouchableArea>
      </View>

      {/* Fi-style wealth display */}
      <View style={styles.wealthSection}>
        <Text style={styles.wealthLabel}>Your Financial Health</Text>
        <Text style={styles.wealthValue}>₹12,45,000</Text>
        <Text style={styles.wealthSubtext}>+₹15,000 this month</Text>
      </View>
    </View>
  );

  const FiTabBar = () => (
    <View style={styles.tabBar}>
      <TouchableArea
        style={[styles.tab, selectedTab === 'inflation' && styles.activeTab]}
        onPress={() => setSelectedTab('inflation')}
      >
        <Text style={[styles.tabText, selectedTab === 'inflation' && styles.activeTabText]}>
          Inflation
        </Text>
      </TouchableArea>
      
      <TouchableArea
        style={[styles.tab, selectedTab === 'insights' && styles.activeTab]}
        onPress={() => setSelectedTab('insights')}
      >
        <Text style={[styles.tabText, selectedTab === 'insights' && styles.activeTabText]}>
          Insights
        </Text>
      </TouchableArea>
      
      <TouchableArea
        style={[styles.tab, selectedTab === 'goals' && styles.activeTab]}
        onPress={() => setSelectedTab('goals')}
      >
        <Text style={[styles.tabText, selectedTab === 'goals' && styles.activeTabText]}>
          Goals
        </Text>
      </TouchableArea>
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

  const FiTrustBadges = () => (
    <FadeInUp delay={400}>
      <View style={styles.trustSection}>
        <Text style={styles.trustTitle}>Trusted & Secure</Text>
        <View style={styles.trustBadges}>
          <View style={styles.trustBadge}>
            <Text style={styles.trustText}>🏦 RBI</Text>
          </View>
          <View style={styles.trustBadge}>
            <Text style={styles.trustText}>📊 MOSPI</Text>
          </View>
          <View style={styles.trustBadge}>
            <Text style={styles.trustText}>🔒 Secure</Text>
          </View>
        </View>
      </View>
    </FadeInUp>
  );

  return (
    <View style={styles.container}>
      <FiHeader />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <FiTabBar />
        
        {selectedTab === 'inflation' && (
          <>
            <FiInflationCard inflationData={inflationData} />
            <FiMetricsCards 
              inflationData={inflationData}
              onCardPress={(cardId) => navigation.navigate('MetricDetail', { cardId })}
            />
            <FiQuickActions />
            <FiTrustBadges />
          </>
        )}
        
        {selectedTab === 'insights' && (
          <FadeInUp delay={0}>
            <View style={styles.comingSoon}>
              <Text style={styles.comingSoonText}>📊 Advanced Insights</Text>
              <Text style={styles.comingSoonSubtext}>Coming Soon</Text>
            </View>
          </FadeInUp>
        )}
        
        {selectedTab === 'goals' && (
          <FadeInUp delay={0}>
            <View style={styles.comingSoon}>
              <Text style={styles.comingSoonText}>🎯 Financial Goals</Text>
              <Text style={styles.comingSoonSubtext}>Coming Soon</Text>
            </View>
          </FadeInUp>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: FiColors.background,
  },
  header: {
    backgroundColor: FiColors.background,
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {},
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
  profileButton: {
    padding: 4,
  },
  profileAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: FiColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
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
    fontWeight: '300', // Fi's light weight
    color: FiColors.textInverse,
    marginBottom: 4,
  },
  wealthSubtext: {
    fontSize: 14,
    color: FiColors.primary,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    backgroundColor: '#F5F5F5', // Light background for content
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: FiColors.surface,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: FiColors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: FiColors.textSecondary,
  },
  activeTabText: {
    color: '#FFFFFF',
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
    flexDirection: 'row',
    gap: 12,
  },
  trustBadge: {
    backgroundColor: FiColors.primary + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  trustText: {
    fontSize: 12,
    color: FiColors.primary,
    fontWeight: '600',
  },
  comingSoon: {
    backgroundColor: FiColors.surface,
    margin: 16,
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
  },
  comingSoonText: {
    fontSize: 20,
    fontWeight: '600',
    color: FiColors.text,
    marginBottom: 8,
  },
  comingSoonSubtext: {
    fontSize: 14,
    color: FiColors.textSecondary,
  },
});

export default FiHomeScreen;
