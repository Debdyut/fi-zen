import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FiBrandColors, FiTypography } from '../../theme/fiBrandColors';
import { AnimatedCard, FadeInUp } from '../animations/AnimatedCard';
import { ProgressIndicator } from '../common/MicroInteractions';
import { TouchableArea } from '../common/AccessibilityHelpers';

const PeerBenchmarkingCard = ({ userProfile, inflationData }) => {
  const [selectedBenchmark, setSelectedBenchmark] = useState('industry');

  // Anonymous peer data for benchmarking
  const benchmarkData = {
    industry: {
      title: 'Software Engineers in Mumbai',
      sampleSize: '2,847 professionals',
      avgInflation: 10.2,
      percentiles: {
        25: 8.7,
        50: 10.2,
        75: 11.8,
        90: 13.4
      },
      insights: [
        'You\'re in the 75th percentile for inflation management',
        'Most peers struggle with housing costs (avg 48% of income)',
        'Top performers optimize transport and food delivery costs'
      ]
    },
    experience: {
      title: '5-8 Years Experience',
      sampleSize: '1,234 professionals',
      avgInflation: 10.8,
      percentiles: {
        25: 9.1,
        50: 10.8,
        75: 12.3,
        90: 14.1
      },
      insights: [
        'Your experience bracket has higher lifestyle inflation',
        'Career growth phase leads to increased spending',
        'Investment discipline varies significantly in this group'
      ]
    },
    salary: {
      title: '₹10-15L Annual Salary',
      sampleSize: '3,156 professionals',
      avgInflation: 11.1,
      percentiles: {
        25: 9.4,
        50: 11.1,
        75: 12.6,
        90: 14.8
      },
      insights: [
        'This salary bracket shows highest inflation variance',
        'Lifestyle choices significantly impact personal rates',
        'Geographic arbitrage opportunities exist'
      ]
    }
  };

  const currentBenchmark = benchmarkData[selectedBenchmark];
  const userPercentile = calculatePercentile(inflationData.personal, currentBenchmark.percentiles);

  function calculatePercentile(userValue, percentiles) {
    if (userValue <= percentiles[25]) return 25;
    if (userValue <= percentiles[50]) return 50;
    if (userValue <= percentiles[75]) return 75;
    if (userValue <= percentiles[90]) return 90;
    return 95;
  }

  const getPercentileColor = (percentile) => {
    if (percentile <= 25) return FiBrandColors.success;
    if (percentile <= 50) return FiBrandColors.inflationModerate;
    if (percentile <= 75) return FiBrandColors.warning;
    return FiBrandColors.error;
  };

  const BenchmarkSelector = ({ benchmarkKey, title }) => (
    <TouchableArea
      style={[
        styles.selectorButton,
        selectedBenchmark === benchmarkKey && styles.selectedSelector
      ]}
      onPress={() => setSelectedBenchmark(benchmarkKey)}
    >
      <Text style={[
        styles.selectorText,
        selectedBenchmark === benchmarkKey && styles.selectedSelectorText
      ]}>
        {title}
      </Text>
    </TouchableArea>
  );

  const PercentileBar = () => (
    <View style={styles.percentileContainer}>
      <Text style={styles.percentileTitle}>Your Position</Text>
      <View style={styles.percentileBar}>
        <View style={styles.percentileMarkers}>
          {[25, 50, 75, 90].map((p) => (
            <View key={p} style={[styles.percentileMarker, { left: `${(p/100)*100}%` }]}>
              <Text style={styles.percentileLabel}>{p}th</Text>
            </View>
          ))}
        </View>
        <ProgressIndicator
          progress={userPercentile / 100}
          color={getPercentileColor(userPercentile)}
          height={8}
        />
        <View style={[styles.userMarker, { left: `${userPercentile}%` }]}>
          <Text style={styles.userMarkerText}>You</Text>
        </View>
      </View>
      <Text style={styles.percentileResult}>
        You're in the <Text style={[styles.percentileValue, { color: getPercentileColor(userPercentile) }]}>
          {userPercentile}th percentile
        </Text>
      </Text>
    </View>
  );

  return (
    <AnimatedCard style={styles.container}>
      <FadeInUp delay={0}>
        <Text style={styles.title}>📊 Peer Benchmarking</Text>
        <Text style={styles.subtitle}>
          See how you compare to similar professionals (anonymized data)
        </Text>
      </FadeInUp>

      <FadeInUp delay={200}>
        <View style={styles.selectorContainer}>
          <BenchmarkSelector benchmarkKey="industry" title="Industry" />
          <BenchmarkSelector benchmarkKey="experience" title="Experience" />
          <BenchmarkSelector benchmarkKey="salary" title="Salary" />
        </View>
      </FadeInUp>

      <FadeInUp delay={400}>
        <View style={styles.benchmarkInfo}>
          <Text style={styles.benchmarkTitle}>{currentBenchmark.title}</Text>
          <Text style={styles.sampleSize}>Based on {currentBenchmark.sampleSize}</Text>
        </View>
      </FadeInUp>

      <FadeInUp delay={600}>
        <View style={styles.comparisonSection}>
          <View style={styles.comparisonItem}>
            <Text style={styles.comparisonLabel}>Your Rate</Text>
            <Text style={[styles.comparisonValue, { color: getPercentileColor(userPercentile) }]}>
              {inflationData.personal}%
            </Text>
          </View>
          <Text style={styles.vsText}>vs</Text>
          <View style={styles.comparisonItem}>
            <Text style={styles.comparisonLabel}>Peer Average</Text>
            <Text style={[styles.comparisonValue, { color: FiBrandColors.secondary }]}>
              {currentBenchmark.avgInflation}%
            </Text>
          </View>
        </View>
      </FadeInUp>

      <FadeInUp delay={800}>
        <PercentileBar />
      </FadeInUp>

      <FadeInUp delay={1000}>
        <View style={styles.insightsSection}>
          <Text style={styles.insightsTitle}>💡 Peer Insights</Text>
          {currentBenchmark.insights.map((insight, index) => (
            <Text key={index} style={styles.insightText}>• {insight}</Text>
          ))}
        </View>
      </FadeInUp>

      <FadeInUp delay={1200}>
        <View style={styles.actionSection}>
          <Text style={styles.actionTitle}>🎯 What This Means</Text>
          <Text style={styles.actionText}>
            {userPercentile <= 50 
              ? "You're managing inflation better than most peers in your category. Consider sharing your strategies!"
              : "Your inflation is higher than average. Focus on the top spending categories for optimization."
            }
          </Text>
        </View>
      </FadeInUp>
    </AnimatedCard>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: FiBrandColors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: FiBrandColors.primaryLight + '40',
  },
  title: {
    ...FiTypography.h3,
    color: FiBrandColors.text,
    marginBottom: 4,
  },
  subtitle: {
    ...FiTypography.bodySmall,
    color: FiBrandColors.textSecondary,
    marginBottom: 16,
  },
  selectorContainer: {
    flexDirection: 'row',
    backgroundColor: FiBrandColors.background,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  selectorButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  selectedSelector: {
    backgroundColor: FiBrandColors.primary,
  },
  selectorText: {
    ...FiTypography.bodySmall,
    color: FiBrandColors.textSecondary,
    fontWeight: '600',
  },
  selectedSelectorText: {
    color: FiBrandColors.white,
  },
  benchmarkInfo: {
    alignItems: 'center',
    marginBottom: 16,
  },
  benchmarkTitle: {
    ...FiTypography.body,
    color: FiBrandColors.text,
    fontWeight: '600',
    marginBottom: 4,
  },
  sampleSize: {
    ...FiTypography.caption,
    color: FiBrandColors.textSecondary,
  },
  comparisonSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  comparisonItem: {
    alignItems: 'center',
    flex: 1,
  },
  comparisonLabel: {
    ...FiTypography.caption,
    color: FiBrandColors.textSecondary,
    marginBottom: 4,
  },
  comparisonValue: {
    ...FiTypography.h3,
    fontWeight: '700',
  },
  vsText: {
    ...FiTypography.body,
    color: FiBrandColors.textSecondary,
    marginHorizontal: 16,
  },
  percentileContainer: {
    marginBottom: 16,
  },
  percentileTitle: {
    ...FiTypography.bodySmall,
    color: FiBrandColors.text,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  percentileBar: {
    position: 'relative',
    marginBottom: 8,
  },
  percentileMarkers: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  percentileMarker: {
    position: 'absolute',
    alignItems: 'center',
  },
  percentileLabel: {
    ...FiTypography.caption,
    color: FiBrandColors.textSecondary,
  },
  userMarker: {
    position: 'absolute',
    top: -20,
    alignItems: 'center',
    transform: [{ translateX: -15 }],
  },
  userMarkerText: {
    ...FiTypography.caption,
    color: FiBrandColors.primary,
    fontWeight: '600',
    backgroundColor: FiBrandColors.surface,
    paddingHorizontal: 4,
  },
  percentileResult: {
    ...FiTypography.bodySmall,
    color: FiBrandColors.textSecondary,
    textAlign: 'center',
  },
  percentileValue: {
    fontWeight: '600',
  },
  insightsSection: {
    backgroundColor: FiBrandColors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  insightsTitle: {
    ...FiTypography.bodySmall,
    color: FiBrandColors.text,
    fontWeight: '600',
    marginBottom: 8,
  },
  insightText: {
    ...FiTypography.bodySmall,
    color: FiBrandColors.textSecondary,
    lineHeight: 18,
    marginBottom: 4,
  },
  actionSection: {
    backgroundColor: FiBrandColors.successLight + '20',
    borderRadius: 12,
    padding: 16,
  },
  actionTitle: {
    ...FiTypography.bodySmall,
    color: FiBrandColors.success,
    fontWeight: '600',
    marginBottom: 8,
  },
  actionText: {
    ...FiTypography.bodySmall,
    color: FiBrandColors.textSecondary,
    lineHeight: 18,
  },
});

export default PeerBenchmarkingCard;
