import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { AnimatedCard, FadeInUp } from '../animations/AnimatedCard';
import { TouchableArea } from '../common/AccessibilityHelpers';

// Fi App Colors (from screenshots)
const FiColors = {
  background: '#1A1A1A',
  surface: '#FFFFFF',
  surfaceSecondary: '#F8F9FA',
  primary: '#00D4AA',
  text: '#1A1A1A',
  textSecondary: '#666666',
  textLight: '#999999',
  success: '#00D4AA',
  warning: '#FFB800',
  error: '#FF6B6B',
};

const FiMetricsCards = ({ inflationData, onCardPress }) => {
  const metricsData = [
    {
      id: 'inflation_rate',
      title: 'Your Inflation',
      value: `${inflationData.personal}%`,
      subtitle: 'vs Govt 6.5%',
      trend: 'up',
      color: FiColors.error,
      icon: '📈'
    },
    {
      id: 'salary_impact',
      title: 'Salary Impact',
      value: '₹11.8K',
      subtitle: 'extra needed/month',
      trend: 'neutral',
      color: FiColors.warning,
      icon: '💼'
    },
    {
      id: 'investment_target',
      title: 'Target Returns',
      value: '16.8%',
      subtitle: 'to beat inflation',
      trend: 'up',
      color: FiColors.success,
      icon: '🎯'
    },
    {
      id: 'city_rank',
      title: 'City Ranking',
      value: '#2',
      subtitle: 'most expensive',
      trend: 'neutral',
      color: FiColors.primary,
      icon: '🏙️'
    }
  ];

  const MetricCard = ({ metric, index }) => (
    <FadeInUp delay={index * 100}>
      <TouchableArea
        style={styles.metricCard}
        onPress={() => onCardPress(metric.id)}
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
      </TouchableArea>
    </FadeInUp>
  );

  const WeeklyInsightCard = () => (
    <FadeInUp delay={400}>
      <View style={styles.insightCard}>
        <View style={styles.insightHeader}>
          <Text style={styles.insightTitle}>This Week's Insight</Text>
          <Text style={styles.insightBadge}>New</Text>
        </View>
        
        <Text style={styles.insightText}>
          Your food costs increased 2.3% this week, mainly due to vegetable price surge in Mumbai markets.
        </Text>
        
        <View style={styles.insightAction}>
          <Text style={styles.actionText}>View Details →</Text>
        </View>
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
          <Text style={styles.progressTitle}>Your Financial Health</Text>
          
          <View style={styles.progressItem}>
            <Text style={styles.progressLabel}>Inflation Management</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '75%', backgroundColor: FiColors.warning }]} />
            </View>
            <Text style={styles.progressValue}>75%</Text>
          </View>

          <View style={styles.progressItem}>
            <Text style={styles.progressLabel}>Investment Readiness</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '60%', backgroundColor: FiColors.success }]} />
            </View>
            <Text style={styles.progressValue}>60%</Text>
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
    backgroundColor: FiColors.surface,
    borderRadius: 16,
    padding: 16,
    width: '100%',
    minHeight: 130, // Increased minimum height
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    justifyContent: 'space-between', // Better content distribution
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
    backgroundColor: FiColors.surface,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 0, // Remove horizontal margin since container handles it
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
