import React from 'react';
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
        {/* Main Inflation Card */}
        <FiInflationCard inflationData={inflationData} />
        
        {/* Metrics Cards */}
        <FiMetricsCards 
          inflationData={inflationData}
          onCardPress={(cardId) => navigation.navigate('MetricDetail', { cardId })}
        />
        
        {/* Quick Actions */}
        <FiQuickActions />
        
        {/* Insights Preview */}
        <FiInsightsPreview />
        
        {/* Goals Preview */}
        <FiGoalsPreview />
        
        {/* Trust Badges */}
        <FiTrustBadges />
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
});

export default FiHomeScreen;
