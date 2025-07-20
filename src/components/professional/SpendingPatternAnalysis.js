import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { FiBrandColors, FiTypography } from '../../theme/fiBrandColors';
import { AnimatedCard, FadeInUp } from '../animations/AnimatedCard';
import { ProgressIndicator } from '../common/MicroInteractions';
import { TouchableArea } from '../common/AccessibilityHelpers';

const SpendingPatternAnalysis = ({ userSpendingData, inflationData }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Professional spending analysis
  const spendingInsights = {
    patterns: {
      workFromHome: {
        impact: 'Transport costs down 40%, Food delivery up 60%',
        inflationEffect: '+0.8% to personal rate',
        recommendation: 'Optimize home office setup costs'
      },
      careerGrowth: {
        impact: 'Education spending up 120%, Entertainment down 20%',
        inflationEffect: '-0.3% to personal rate', 
        recommendation: 'Invest in skill development ROI tracking'
      },
      lifestyle: {
        impact: 'Housing 45% of income (ideal: 30%)',
        inflationEffect: '+2.1% to personal rate',
        recommendation: 'Consider location optimization'
      }
    },
    benchmarks: {
      industry: 'Software Engineering',
      experience: '5-8 years',
      location: 'Mumbai',
      percentile: 75 // User is in 75th percentile for inflation management
    }
  };

  const CategoryAnalysis = ({ category, data }) => (
    <TouchableArea
      style={[
        styles.categoryCard,
        selectedCategory === category && styles.selectedCategory
      ]}
      onPress={() => setSelectedCategory(selectedCategory === category ? null : category)}
    >
      <View style={styles.categoryHeader}>
        <Text style={styles.categoryTitle}>{category}</Text>
        <Text style={styles.categoryTrend}>
          {data.trend > 0 ? '📈' : '📉'} {Math.abs(data.trend)}%
        </Text>
      </View>
      
      <View style={styles.categoryMetrics}>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>Monthly Avg</Text>
          <Text style={styles.metricValue}>₹{data.monthlyAvg.toLocaleString()}</Text>
        </View>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>vs Peers</Text>
          <Text style={[
            styles.metricValue,
            { color: data.vsPeers > 0 ? FiBrandColors.error : FiBrandColors.success }
          ]}>
            {data.vsPeers > 0 ? '+' : ''}{data.vsPeers}%
          </Text>
        </View>
      </View>

      <ProgressIndicator
        progress={data.inflationContribution / inflationData.personal}
        color={FiBrandColors.primary}
        height={6}
      />
      <Text style={styles.contributionText}>
        Contributes {data.inflationContribution}% to your inflation
      </Text>

      {selectedCategory === category && (
        <FadeInUp delay={100}>
          <View style={styles.categoryDetails}>
            <Text style={styles.detailsTitle}>Professional Insights:</Text>
            <Text style={styles.detailsText}>• {data.insight}</Text>
            <Text style={styles.detailsText}>• {data.recommendation}</Text>
            <Text style={styles.detailsText}>• {data.benchmark}</Text>
          </View>
        </FadeInUp>
      )}
    </TouchableArea>
  );

  const mockCategoryData = {
    'Housing': {
      monthlyAvg: 45000,
      trend: 8.5,
      vsPeers: 15,
      inflationContribution: 2.4,
      insight: 'Your housing costs are 15% above peer average for your experience level',
      recommendation: 'Consider co-living or suburban areas to optimize cost-to-convenience ratio',
      benchmark: 'Ideal housing cost for your salary bracket: ₹35,000-40,000'
    },
    'Food': {
      monthlyAvg: 28000,
      trend: 12.3,
      vsPeers: -5,
      inflationContribution: 4.1,
      insight: 'Food delivery increased 60% since WFH, but grocery spending optimized well',
      recommendation: 'Meal planning could save ₹8,000/month without lifestyle compromise',
      benchmark: 'You spend 5% less than peers but inflation impact is higher due to delivery'
    },
    'Transport': {
      monthlyAvg: 15000,
      trend: -25,
      vsPeers: -30,
      inflationContribution: 1.3,
      insight: 'Excellent optimization during WFH transition, fuel costs well managed',
      recommendation: 'Consider investing transport savings in skill development',
      benchmark: 'Transport optimization puts you in top 25% of professionals'
    }
  };

  return (
    <ScrollView style={styles.container}>
      <FadeInUp delay={0}>
        <View style={styles.header}>
          <Text style={styles.title}>📊 Your Spending Intelligence</Text>
          <Text style={styles.subtitle}>
            Professional insights into your financial behavior patterns
          </Text>
        </View>
      </FadeInUp>

      {/* Professional Benchmark */}
      <FadeInUp delay={200}>
        <AnimatedCard style={styles.benchmarkCard}>
          <Text style={styles.benchmarkTitle}>🎯 Professional Benchmark</Text>
          <View style={styles.benchmarkGrid}>
            <View style={styles.benchmarkItem}>
              <Text style={styles.benchmarkLabel}>Industry</Text>
              <Text style={styles.benchmarkValue}>{spendingInsights.benchmarks.industry}</Text>
            </View>
            <View style={styles.benchmarkItem}>
              <Text style={styles.benchmarkLabel}>Experience</Text>
              <Text style={styles.benchmarkValue}>{spendingInsights.benchmarks.experience}</Text>
            </View>
            <View style={styles.benchmarkItem}>
              <Text style={styles.benchmarkLabel}>Location</Text>
              <Text style={styles.benchmarkValue}>{spendingInsights.benchmarks.location}</Text>
            </View>
            <View style={styles.benchmarkItem}>
              <Text style={styles.benchmarkLabel}>Percentile</Text>
              <Text style={[styles.benchmarkValue, { color: FiBrandColors.success }]}>
                {spendingInsights.benchmarks.percentile}th
              </Text>
            </View>
          </View>
        </AnimatedCard>
      </FadeInUp>

      {/* Category Analysis */}
      <FadeInUp delay={400}>
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Category Deep Dive</Text>
          {Object.entries(mockCategoryData).map(([category, data]) => (
            <CategoryAnalysis key={category} category={category} data={data} />
          ))}
        </View>
      </FadeInUp>

      {/* Professional Patterns */}
      <FadeInUp delay={600}>
        <AnimatedCard style={styles.patternsCard}>
          <Text style={styles.patternsTitle}>🔍 Behavioral Patterns Detected</Text>
          {Object.entries(spendingInsights.patterns).map(([pattern, data]) => (
            <View key={pattern} style={styles.patternItem}>
              <Text style={styles.patternName}>
                {pattern.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </Text>
              <Text style={styles.patternImpact}>{data.impact}</Text>
              <Text style={styles.patternEffect}>
                Inflation effect: <Text style={styles.effectValue}>{data.inflationEffect}</Text>
              </Text>
              <Text style={styles.patternRecommendation}>💡 {data.recommendation}</Text>
            </View>
          ))}
        </AnimatedCard>
      </FadeInUp>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: FiBrandColors.background,
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    ...FiTypography.h2,
    color: FiBrandColors.text,
    marginBottom: 4,
  },
  subtitle: {
    ...FiTypography.bodySmall,
    color: FiBrandColors.textSecondary,
  },
  benchmarkCard: {
    backgroundColor: FiBrandColors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: FiBrandColors.primaryLight + '40',
  },
  benchmarkTitle: {
    ...FiTypography.body,
    color: FiBrandColors.text,
    fontWeight: '600',
    marginBottom: 16,
  },
  benchmarkGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  benchmarkItem: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
  },
  benchmarkLabel: {
    ...FiTypography.caption,
    color: FiBrandColors.textSecondary,
    marginBottom: 4,
  },
  benchmarkValue: {
    ...FiTypography.bodySmall,
    color: FiBrandColors.text,
    fontWeight: '600',
  },
  categoriesSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    ...FiTypography.body,
    color: FiBrandColors.text,
    fontWeight: '600',
    marginBottom: 16,
  },
  categoryCard: {
    backgroundColor: FiBrandColors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: FiBrandColors.border,
  },
  selectedCategory: {
    borderColor: FiBrandColors.primary,
    backgroundColor: FiBrandColors.primaryLight + '10',
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryTitle: {
    ...FiTypography.body,
    color: FiBrandColors.text,
    fontWeight: '600',
  },
  categoryTrend: {
    ...FiTypography.bodySmall,
    color: FiBrandColors.textSecondary,
    fontWeight: '600',
  },
  categoryMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  metric: {
    alignItems: 'center',
  },
  metricLabel: {
    ...FiTypography.caption,
    color: FiBrandColors.textSecondary,
    marginBottom: 4,
  },
  metricValue: {
    ...FiTypography.bodySmall,
    color: FiBrandColors.text,
    fontWeight: '600',
  },
  contributionText: {
    ...FiTypography.caption,
    color: FiBrandColors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
  categoryDetails: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: FiBrandColors.border,
  },
  detailsTitle: {
    ...FiTypography.bodySmall,
    color: FiBrandColors.text,
    fontWeight: '600',
    marginBottom: 8,
  },
  detailsText: {
    ...FiTypography.bodySmall,
    color: FiBrandColors.textSecondary,
    lineHeight: 18,
    marginBottom: 4,
  },
  patternsCard: {
    backgroundColor: FiBrandColors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: FiBrandColors.successLight + '40',
  },
  patternsTitle: {
    ...FiTypography.body,
    color: FiBrandColors.text,
    fontWeight: '600',
    marginBottom: 16,
  },
  patternItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: FiBrandColors.border,
  },
  patternName: {
    ...FiTypography.bodySmall,
    color: FiBrandColors.text,
    fontWeight: '600',
    marginBottom: 4,
  },
  patternImpact: {
    ...FiTypography.bodySmall,
    color: FiBrandColors.textSecondary,
    marginBottom: 4,
  },
  patternEffect: {
    ...FiTypography.caption,
    color: FiBrandColors.textSecondary,
    marginBottom: 4,
  },
  effectValue: {
    fontWeight: '600',
    color: FiBrandColors.primary,
  },
  patternRecommendation: {
    ...FiTypography.caption,
    color: FiBrandColors.success,
    fontStyle: 'italic',
  },
});

export default SpendingPatternAnalysis;
