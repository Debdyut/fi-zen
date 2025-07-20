import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { FiBrandColors, FiTypography } from '../../theme/fiBrandColors';
import { AnimatedCard, FadeInUp } from '../animations/AnimatedCard';
import { EnhancedButton } from '../common/EnhancedButtons';
import { EnhancedPullToRefresh } from '../common/PullToRefresh';
import { AccessibleHeading } from '../common/AccessibilityHelpers';

// Professional Components
import SpendingPatternAnalysis from './SpendingPatternAnalysis';
import SalaryNegotiationCalculator from './SalaryNegotiationCalculator';
import CityRelocationAnalyzer from './CityRelocationAnalyzer';
import PeerBenchmarkingCard from './PeerBenchmarkingCard';

const ProfessionalDashboard = ({ navigation, inflationData, userProfile }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate data refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const TabButton = ({ tabKey, title, icon }) => (
    <TouchableArea
      style={[
        styles.tabButton,
        activeTab === tabKey && styles.activeTab
      ]}
      onPress={() => setActiveTab(tabKey)}
    >
      <Text style={styles.tabIcon}>{icon}</Text>
      <Text style={[
        styles.tabText,
        activeTab === tabKey && styles.activeTabText
      ]}>
        {title}
      </Text>
    </TouchableArea>
  );

  const OverviewTab = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <FadeInUp delay={0}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>📊 Professional Financial Health</Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Inflation Percentile</Text>
              <Text style={styles.summaryValue}>75th</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Salary Efficiency</Text>
              <Text style={styles.summaryValue}>Good</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>City Optimization</Text>
              <Text style={styles.summaryValue}>Medium</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Career Stage</Text>
              <Text style={styles.summaryValue}>Growth</Text>
            </View>
          </View>
        </View>
      </FadeInUp>

      <PeerBenchmarkingCard 
        userProfile={userProfile}
        inflationData={inflationData}
      />

      <FadeInUp delay={400}>
        <View style={styles.quickActions}>
          <Text style={styles.quickActionsTitle}>🚀 Quick Actions</Text>
          <View style={styles.actionGrid}>
            <EnhancedButton
              title="Salary Calculator"
              icon="calculator"
              variant="secondary"
              size="medium"
              onPress={() => setActiveTab('salary')}
              style={styles.actionButton}
            />
            <EnhancedButton
              title="City Analysis"
              icon="map"
              variant="secondary"
              size="medium"
              onPress={() => setActiveTab('relocation')}
              style={styles.actionButton}
            />
          </View>
        </View>
      </FadeInUp>
    </ScrollView>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'patterns':
        return (
          <SpendingPatternAnalysis 
            userSpendingData={userProfile.spendingData}
            inflationData={inflationData}
          />
        );
      case 'salary':
        return (
          <SalaryNegotiationCalculator 
            inflationData={inflationData}
          />
        );
      case 'relocation':
        return (
          <CityRelocationAnalyzer 
            currentInflation={inflationData.personal}
            currentCity={inflationData.location?.city}
          />
        );
      default:
        return <OverviewTab />;
    }
  };

  return (
    <EnhancedPullToRefresh onRefresh={handleRefresh} refreshing={refreshing}>
      <View style={styles.container}>
        <FadeInUp delay={0}>
          <View style={styles.header}>
            <AccessibleHeading level={1} style={styles.title}>
              Professional Dashboard
            </AccessibleHeading>
            <Text style={styles.subtitle}>
              Financial intelligence for career growth
            </Text>
          </View>
        </FadeInUp>

        {/* Tab Navigation */}
        <FadeInUp delay={200}>
          <View style={styles.tabContainer}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tabScrollContainer}
            >
              <TabButton tabKey="overview" title="Overview" icon="📊" />
              <TabButton tabKey="patterns" title="Patterns" icon="🔍" />
              <TabButton tabKey="salary" title="Salary" icon="💼" />
              <TabButton tabKey="relocation" title="Cities" icon="🏙️" />
            </ScrollView>
          </View>
        </FadeInUp>

        {/* Tab Content */}
        <View style={styles.contentContainer}>
          {renderTabContent()}
        </View>
      </View>
    </EnhancedPullToRefresh>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: FiBrandColors.background,
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  title: {
    ...FiTypography.h1,
    color: FiBrandColors.text,
    marginBottom: 4,
  },
  subtitle: {
    ...FiTypography.bodySmall,
    color: FiBrandColors.textSecondary,
  },
  tabContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tabScrollContainer: {
    gap: 8,
  },
  tabButton: {
    backgroundColor: FiBrandColors.surface,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    minWidth: 80,
    borderWidth: 1,
    borderColor: FiBrandColors.border,
  },
  activeTab: {
    backgroundColor: FiBrandColors.primary,
    borderColor: FiBrandColors.primary,
  },
  tabIcon: {
    fontSize: 16,
    marginBottom: 4,
  },
  tabText: {
    ...FiTypography.caption,
    color: FiBrandColors.textSecondary,
    fontWeight: '600',
  },
  activeTabText: {
    color: FiBrandColors.white,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  summaryCard: {
    backgroundColor: FiBrandColors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: FiBrandColors.primaryLight + '40',
  },
  summaryTitle: {
    ...FiTypography.body,
    color: FiBrandColors.text,
    fontWeight: '600',
    marginBottom: 16,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  summaryItem: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
  },
  summaryLabel: {
    ...FiTypography.caption,
    color: FiBrandColors.textSecondary,
    marginBottom: 4,
  },
  summaryValue: {
    ...FiTypography.bodySmall,
    color: FiBrandColors.text,
    fontWeight: '600',
  },
  quickActions: {
    marginBottom: 40,
  },
  quickActionsTitle: {
    ...FiTypography.body,
    color: FiBrandColors.text,
    fontWeight: '600',
    marginBottom: 16,
  },
  actionGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    height: 48,
    backgroundColor: FiBrandColors.primaryLight + '20',
  },
});

export default ProfessionalDashboard;
