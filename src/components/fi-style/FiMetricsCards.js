import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
// Using View with backgroundColor as fallback for gradients
// import LinearGradient from 'react-native-linear-gradient';
import { AnimatedCard, FadeInUp } from '../animations/AnimatedCard';
import { TouchableArea } from '../common/AccessibilityHelpers';
import { useLanguage } from '../../localization/LanguageContext';

import { FiColors } from '../../theme/consolidatedFiColors';

const FiMetricsCards = ({ inflationData, onCardPress, userData, userProfile }) => {
  const { t } = useLanguage();
  
  // Calculate personal inflation
  const personalInflation = userData?.monthlySpending ? (() => {
    const spending = userData.monthlySpending;
    const totalSpending = Object.values(spending).reduce((a, b) => a + b, 0);
    const categoryInflation = { housing: 6.2, food: 12.8, transport: 9.4, entertainment: 8.1, miscellaneous: 7.3, investments: 0 };
    let weightedInflation = 0;
    Object.entries(spending).forEach(([category, amount]) => {
      const weight = amount / totalSpending;
      const rate = categoryInflation[category] || 8.0;
      weightedInflation += weight * rate;
    });
    return Math.round(weightedInflation * 10) / 10;
  })() : 8.5;
  
  const metricsData = [
    {
      id: 'inflation_rate',
      title: t('metrics.yourInflation'),
      value: `${personalInflation}%`,
      subtitle: t('metrics.vsGovt'),
      trend: 'up',
      color: FiColors.error,
      icon: '📈',
      gradient: ['#FFF5F5', '#FFFFFF']
    },
    {
      id: 'salary_impact',
      title: t('metrics.salaryImpact'),
      value: `₹${((userProfile?.monthlyIncome || 50000) * personalInflation / 100 / 1000).toFixed(1)}K`,
      subtitle: t('metrics.extraNeeded'),
      trend: 'neutral',
      color: FiColors.warning,
      icon: '💼',
      gradient: ['#FFFBF0', '#FFFFFF']
    },
    {
      id: 'investment_target',
      title: t('metrics.targetReturns'),
      value: `${(personalInflation + 4).toFixed(1)}%`,
      subtitle: t('metrics.toBeatInflation'),
      trend: 'up',
      color: FiColors.success,
      icon: '🎯',
      gradient: ['#F0FFF4', '#FFFFFF']
    },
    {
      id: 'city_rank',
      title: t('metrics.cityRanking'),
      value: `#${userProfile?.location ? (() => {
        const cityRanks = { 'Mumbai': 1, 'Delhi': 2, 'Bangalore': 3, 'Chennai': 4, 'Pune': 5, 'Hyderabad': 6 };
        const city = userProfile.location.split(',')[0];
        return cityRanks[city] || 7;
      })() : 2}`,
      subtitle: t('metrics.mostExpensive'),
      trend: 'neutral',
      color: FiColors.primary,
      icon: '🏙️',
      gradient: ['#F0FDFA', '#FFFFFF']
    }
  ];

  const MetricCard = ({ metric, index }) => (
    <FadeInUp delay={index * 100}>
      <TouchableArea
        onPress={() => onCardPress(metric.id)}
      >
        <View
          style={[styles.metricCard, { backgroundColor: metric.gradient[0] }]}
        >
        <View style={styles.cardHeader}>
          <Text style={styles.cardIcon}>{metric.icon}</Text>
          <View style={[styles.trendIndicator, { backgroundColor: metric.color + '20' }]}>
            <Text style={styles.trendText}>
              {metric.trend === 'up' ? '↗' : metric.trend === 'down' ? '↘' : '→'}
            </Text>
          </View>
        </View>

        <Text style={styles.cardTitle}>{metric.title}</Text>
        
        <Text style={[styles.cardValue, { color: metric.color }]}>
          {metric.value}
        </Text>
        
        <Text style={styles.cardSubtitle}>{metric.subtitle}</Text>
        </View>
      </TouchableArea>
    </FadeInUp>
  );

  const WeeklyInsightCard = () => (
    <FadeInUp delay={400}>
      <View
        style={[styles.insightCard, { backgroundColor: '#F0F9FF' }]}
      >
        <View style={styles.insightHeader}>
          <Text style={styles.insightTitle}>{t('metrics.thisWeekInsight')}</Text>
          <Text style={styles.insightBadge}>{t('metrics.newBadge')}</Text>
        </View>
        
        <Text style={styles.insightText}>
          {t('metrics.foodCostIncrease')}
        </Text>
        
        <TouchableArea 
          style={styles.insightAction}
          onPress={() => onCardPress('weekly_insight')}
        >
          <Text style={styles.actionText}>{t('metrics.viewDetails')} →</Text>
        </TouchableArea>
      </View>
    </FadeInUp>
  );

  return (
    <View style={styles.container}>
      {/* Metrics Grid */}
      <View style={styles.metricsGrid}>
        {metricsData.map((metric, index) => (
          <View key={metric.id} style={styles.cardWrapper}>
            <MetricCard metric={metric} index={index} />
          </View>
        ))}
      </View>

      {/* Weekly Insight (Fi-style) */}
      <WeeklyInsightCard />

      {/* Fi-style Progress Section */}
      <FadeInUp delay={500}>
        <View style={styles.progressSection}>
          <Text style={styles.progressTitle}>{t('metrics.financialHealth')}</Text>
          
          <View style={styles.progressItem}>
            <Text style={styles.progressLabel}>Inflation Management</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${Math.min(100, (6.5/personalInflation) * 100)}%`, backgroundColor: FiColors.warning }]} />
            </View>
            <Text style={styles.progressValue}>{Math.min(100, Math.round((6.5/personalInflation) * 100))}%</Text>
          </View>

          <View style={styles.progressItem}>
            <Text style={styles.progressLabel}>Investment Readiness</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${Math.min(100, ((userData?.totalMutualFunds || 0) + (userData?.totalStocks || 0)) / ((userProfile?.monthlyIncome || 50000) * 12) * 100)}%`, backgroundColor: FiColors.success }]} />
            </View>
            <Text style={styles.progressValue}>{Math.min(100, Math.round(((userData?.totalMutualFunds || 0) + (userData?.totalStocks || 0)) / ((userProfile?.monthlyIncome || 50000) * 12) * 100))}%</Text>
          </View>
        </View>
      </FadeInUp>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  cardWrapper: {
    width: '48%',
    marginBottom: 12,
  },
  metricCard: {
    borderRadius: 16,
    padding: 16,
    width: '100%',
    minHeight: 130,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardIcon: {
    fontSize: 20,
  },
  trendIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600',
  },
  cardTitle: {
    fontSize: 14,
    color: FiColors.textSecondary,
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 24,
    fontWeight: '300', // Fi's light weight for numbers
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    color: FiColors.textLight,
  },
  insightCard: {
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 0,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: FiColors.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  insightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: FiColors.text,
  },
  insightBadge: {
    backgroundColor: FiColors.primary,
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  insightText: {
    fontSize: 14,
    color: FiColors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  insightAction: {
    alignSelf: 'flex-start',
  },
  actionText: {
    fontSize: 14,
    color: FiColors.primary,
    fontWeight: '500',
  },
  progressSection: {
    backgroundColor: FiColors.surface,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 0, // Remove horizontal margin since container handles it
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: FiColors.text,
    marginBottom: 16,
  },
  progressItem: {
    marginBottom: 16,
  },
  progressLabel: {
    fontSize: 14,
    color: FiColors.textSecondary,
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#F0F0F0',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressValue: {
    fontSize: 12,
    color: FiColors.textLight,
    textAlign: 'right',
  },
});

export default FiMetricsCards;
