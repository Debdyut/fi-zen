import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, ActivityIndicator } from 'react-native';
import { FadeInUp } from '../components/animations/AnimatedCard';
import { TouchableArea } from '../components/common/AccessibilityHelpers';
import { useLanguage } from '../localization/LanguageContext';
import { useTheme } from '../theme/ThemeContext';
import DataService from '../services/DataService';
import PersonalizationEngine from '../utils/PersonalizationEngine';

// Enhanced Insight Components
import SavingsRateCard from '../components/insights/SavingsRateCard';
import PeerComparisonCard from '../components/insights/PeerComparisonCard';
import IsolatedSmartRecommendationsCard from '../components/insights/IsolatedSmartRecommendationsCard';
import LocationInsightsCard from '../components/insights/LocationInsightsCard';
import SpendingTrendsCard from '../components/insights/SpendingTrendsCard';

// AI Components
import AIRecommendationsCard from '../components/ai/AIRecommendationsCard';
import ComingSoonCard from '../components/ai/ComingSoonCard';

// Interactive Calculators
import EmergencyFundCalculator from '../components/calculators/EmergencyFundCalculator';
import SIPCalculator from '../components/calculators/SIPCalculator';
import RetirementCalculator from '../components/calculators/RetirementCalculator';
import HomeLoanCalculator from '../components/calculators/HomeLoanCalculator';

const FiColors = {
  background: '#1A1A1A',
  surface: '#FFFFFF',
  primary: '#00D4AA',
  text: '#1A1A1A',
  textSecondary: '#666666',
  textInverse: '#FFFFFF',
  border: '#E0E0E0',
  success: '#00D4AA',
  warning: '#FFB800',
  error: '#FF6B6B',
};

const InsightsScreen = ({ navigation }) => {
  const { t } = useLanguage();
  const { isDarkMode } = useTheme();
  const [loading, setLoading] = useState(true);
  const [spendingInsights, setSpendingInsights] = useState(null);
  const [peerComparison, setPeerComparison] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [activeSection, setActiveSection] = useState('insights'); // 'insights' or 'calculators'

  useEffect(() => {
    loadInsightsData();
  }, []);

  const loadInsightsData = async () => {
    try {
      setLoading(true);
      const currentUser = DataService.getCurrentUser();
      
      const [insights, peer, profile] = await Promise.all([
        DataService.getUserSpendingInsights(currentUser),
        DataService.getPeerComparison(currentUser),
        DataService.getUserProfile(currentUser)
      ]);
      
      // Enhance insights with personalization
      const enhancedInsights = PersonalizationEngine.getLocationAdjustedSavings(profile, insights);
      const enhancedPeerComparison = PersonalizationEngine.getEnhancedPeerComparison(profile, peer);
      
      setSpendingInsights(enhancedInsights);
      setPeerComparison(enhancedPeerComparison);
      setUserProfile(profile);
      
    } catch (error) {
      console.error('Error loading insights:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get category icons
  const getCategoryIcon = (category) => {
    const icons = {
      housing: '🏠',
      food: '🍽️',
      transport: '🚗',
      entertainment: '🎬',
      shopping: '🛍️',
      healthcare: '🏥',
      education: '📚',
      investments: '📈',
      miscellaneous: '📦'
    };
    return icons[category] || '💰';
  };

  const InsightCard = ({ title, value, trend, icon, description, color = FiColors.primary }) => (
    <FadeInUp delay={100}>
      <TouchableArea>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>{icon}</Text>
            <View style={styles.cardTitleContainer}>
              <Text style={styles.cardTitle}>{title}</Text>
              <Text style={styles.cardDescription}>{description}</Text>
            </View>
          </View>
          <View style={styles.cardContent}>
            <Text style={[styles.cardValue, { color }]}>{value}</Text>
            {trend !== undefined && (
              <Text style={[styles.cardTrend, trend > 0 ? styles.trendUp : styles.trendDown]}>
                {trend > 0 ? '↗' : '↘'} {Math.abs(trend)}%
              </Text>
            )}
          </View>
        </View>
      </TouchableArea>
    </FadeInUp>
  );

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: isDarkMode ? FiColors.background : '#F5F5F5' }]}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={FiColors.primary} />
          <Text style={styles.loadingText}>Loading insights...</Text>
        </View>
      </View>
    );
  }

  const SectionToggle = () => (
    <View style={styles.sectionToggle}>
      <TouchableArea
        style={[styles.toggleButton, activeSection === 'insights' && styles.activeToggle]}
        onPress={() => setActiveSection('insights')}
      >
        <Text style={[styles.toggleText, activeSection === 'insights' && styles.activeToggleText]}>
          📊 Insights
        </Text>
      </TouchableArea>
      <TouchableArea
        style={[styles.toggleButton, activeSection === 'calculators' && styles.activeToggle]}
        onPress={() => setActiveSection('calculators')}
      >
        <Text style={[styles.toggleText, activeSection === 'calculators' && styles.activeToggleText]}>
          🧮 Calculators
        </Text>
      </TouchableArea>
      <TouchableArea
        style={[styles.toggleButton, activeSection === 'ai' && styles.activeToggle]}
        onPress={() => setActiveSection('ai')}
      >
        <Text style={[styles.toggleText, activeSection === 'ai' && styles.activeToggleText]}>
          🤖 AI Features
        </Text>
      </TouchableArea>
    </View>
  );


  const InsightsSection = () => (
    <>
      {/* Enhanced Financial Health Cards */}
      <View style={styles.section}>
        <SavingsRateCard 
          savingsRate={spendingInsights?.savingsRate || 15}
          monthlyIncome={userProfile?.monthlyIncome || 100000}
          userProfile={userProfile}
        />
        
        <PeerComparisonCard 
          peerComparison={peerComparison}
          userProfile={userProfile}
        />

        <LocationInsightsCard 
          userProfile={userProfile}
        />
      </View>

      {/* Advanced Analytics */}
      <View style={styles.section}>
        <SpendingTrendsCard 
          userProfile={userProfile}
          spendingData={spendingInsights}
        />
      </View>

      {/* Enhanced Smart Recommendations */}
      <View style={styles.section}>
        <IsolatedSmartRecommendationsCard 
          userProfile={userProfile}
          spendingInsights={spendingInsights}
        />
      </View>


    </>
  );

  const AIFeaturesSection = () => (
    <>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>AI-Powered Insights</Text>
        <Text style={styles.sectionSubtitle}>
          Machine learning recommendations based on your behavior
        </Text>
      </View>

      <View style={styles.section}>
        <AIRecommendationsCard 
          userProfile={userProfile}
          behaviorHistory={[]} // Would be populated with real behavior data
        />
      </View>

      <View style={styles.section}>
        <ComingSoonCard />
      </View>
    </>
  );

  const CalculatorsSection = () => (
    <>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Financial Planning Tools</Text>
        <Text style={styles.sectionSubtitle}>
          Interactive calculators personalized for your financial situation
        </Text>
      </View>

      <View style={styles.section}>
        <EmergencyFundCalculator userProfile={userProfile} />
        <SIPCalculator userProfile={userProfile} />
        <RetirementCalculator userProfile={userProfile} />
        <HomeLoanCalculator userProfile={userProfile} />
      </View>
    </>
  );

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#1A1A1A' : '#E6FBF7' }]}>
      <StatusBar barStyle="light-content" backgroundColor={FiColors.background} />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentInsetAdjustmentBehavior="automatic">
        {/* Header */}
        <View style={[styles.header, { backgroundColor: isDarkMode ? '#1A1A1A' : '#E6FBF7' }]}>
          <Text style={[styles.headerTitle, { color: isDarkMode ? '#FFFFFF' : '#1A1A1A' }]}>Financial Insights</Text>
          <Text style={[styles.headerSubtitle, { color: isDarkMode ? '#FFFFFF' : '#1A1A1A' }]}>
            {userProfile?.name}'s personalized financial analysis
          </Text>
        </View>

        {/* Section Toggle */}
        <SectionToggle />

        {/* Dynamic Content */}
        {activeSection === 'insights' && <InsightsSection />}
        {activeSection === 'calculators' && <CalculatorsSection />}
        {activeSection === 'ai' && <AIFeaturesSection />}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E6FBF7',
    paddingTop: 50,
  },
  content: {
    flex: 1,
  },
  header: {
    backgroundColor: '#E6FBF7',
    paddingTop: 10,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#1A1A1A',
  },
  content: {
    flex: 1,
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: FiColors.text,
    marginBottom: 16,
  },
  insightCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: FiColors.textSecondary,
  },
  insightsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    marginBottom: 20,
  },
  spendingCard: {
    backgroundColor: FiColors.surface,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  recommendationsCard: {
    backgroundColor: FiColors.surface,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  insightIcon: {
    fontSize: 20,
    marginRight: 12,
    marginTop: 2,
  },
  insightText: {
    flex: 1,
    fontSize: 14,
    color: FiColors.text,
    lineHeight: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  cardTitleContainer: {
    flex: 1,
    minWidth: 0,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: FiColors.text,
    marginBottom: 2,
    flexWrap: 'wrap',
  },
  cardDescription: {
    fontSize: 12,
    color: FiColors.textSecondary,
    flexWrap: 'wrap',
  },
  cardContent: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  cardValue: {
    fontSize: 20,
    fontWeight: '700',
    color: FiColors.text,
    marginBottom: 4,
  },
  cardTrend: {
    fontSize: 16,
    fontWeight: '600',
  },
  trendUp: {
    color: '#FF6B6B',
  },
  trendDown: {
    color: FiColors.primary,
  },
  metricsContainer: {
    backgroundColor: FiColors.surface,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: FiColors.border + '30',
  },
  metricLabel: {
    fontSize: 16,
    color: FiColors.text,
    flex: 1,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '600',
    color: FiColors.text,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: FiColors.border + '30',
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '500',
    color: FiColors.text,
  },
  categoryRight: {
    alignItems: 'flex-end',
  },
  categoryAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: FiColors.text,
  },
  categoryPercentage: {
    fontSize: 14,
    color: FiColors.textSecondary,
  },
  recommendationCard: {
    backgroundColor: '#F0FDFA',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  recommendationIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  recommendationContent: {
    flex: 1,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: FiColors.text,
    marginBottom: 4,
  },
  recommendationText: {
    fontSize: 14,
    color: FiColors.textSecondary,
    lineHeight: 20,
  },
  sectionToggle: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 4,
    marginHorizontal: 16,
    marginBottom: 20,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeToggle: {
    backgroundColor: FiColors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleText: {
    fontSize: 14,
    color: FiColors.textSecondary,
    fontWeight: '500',
  },
  activeToggleText: {
    color: FiColors.text,
    fontWeight: '600',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: FiColors.textSecondary,
    marginBottom: 16,
  },
  infoSection: {
    backgroundColor: '#E6FBF7',
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginHorizontal: 16,
    borderRadius: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  infoLabel: {
    fontSize: 14,
    color: '#1A1A1A',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
});

export default InsightsScreen;
