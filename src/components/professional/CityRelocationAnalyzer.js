import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { FiBrandColors, FiTypography } from '../../theme/fiBrandColors';
import { AnimatedCard, FadeInUp } from '../animations/AnimatedCard';
import { TouchableArea } from '../common/AccessibilityHelpers';

const CityRelocationAnalyzer = ({ currentInflation, currentCity = 'Mumbai' }) => {
  const [selectedCity, setSelectedCity] = useState(null);

  const cityData = {
    'Bangalore': {
      inflationRate: 9.4,
      salaryMultiplier: 0.85,
      costSavings: 18,
      pros: ['Tech hub', 'Better weather', 'Lower housing costs'],
      cons: ['Traffic issues', 'Water scarcity', 'Language barrier'],
      netBenefit: 12.3
    },
    'Pune': {
      inflationRate: 8.7,
      salaryMultiplier: 0.75,
      costSavings: 25,
      pros: ['Lower costs', 'Good connectivity', 'Educational hub'],
      cons: ['Fewer opportunities', 'Monsoon issues', 'Limited nightlife'],
      netBenefit: 8.9
    },
    'Chennai': {
      inflationRate: 8.2,
      salaryMultiplier: 0.70,
      costSavings: 30,
      pros: ['Very low costs', 'Cultural richness', 'Good infrastructure'],
      cons: ['Language barrier', 'Hot climate', 'Limited tech jobs'],
      netBenefit: 5.2
    }
  };

  const CityCard = ({ cityName, data }) => (
    <TouchableArea
      style={[
        styles.cityCard,
        selectedCity === cityName && styles.selectedCity
      ]}
      onPress={() => setSelectedCity(selectedCity === cityName ? null : cityName)}
    >
      <View style={styles.cityHeader}>
        <Text style={styles.cityName}>{cityName}</Text>
        <View style={styles.benefitBadge}>
          <Text style={styles.benefitText}>
            {data.netBenefit > 0 ? '+' : ''}{data.netBenefit.toFixed(1)}%
          </Text>
        </View>
      </View>

      <View style={styles.cityMetrics}>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>Inflation</Text>
          <Text style={styles.metricValue}>{data.inflationRate}%</Text>
        </View>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>Salary Impact</Text>
          <Text style={styles.metricValue}>{(data.salaryMultiplier * 100).toFixed(0)}%</Text>
        </View>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>Cost Savings</Text>
          <Text style={styles.metricValue}>{data.costSavings}%</Text>
        </View>
      </View>

      {selectedCity === cityName && (
        <FadeInUp delay={100}>
          <View style={styles.cityDetails}>
            <View style={styles.prosConsSection}>
              <View style={styles.prosSection}>
                <Text style={styles.prosTitle}>✅ Pros</Text>
                {data.pros.map((pro, index) => (
                  <Text key={index} style={styles.proText}>• {pro}</Text>
                ))}
              </View>
              <View style={styles.consSection}>
                <Text style={styles.consTitle}>❌ Cons</Text>
                {data.cons.map((con, index) => (
                  <Text key={index} style={styles.conText}>• {con}</Text>
                ))}
              </View>
            </View>
          </View>
        </FadeInUp>
      )}
    </TouchableArea>
  );

  return (
    <ScrollView style={styles.container}>
      <FadeInUp delay={0}>
        <Text style={styles.title}>🏙️ City Relocation Analyzer</Text>
        <Text style={styles.subtitle}>
          Professional analysis of relocation benefits vs your current {currentCity} situation
        </Text>
      </FadeInUp>

      <FadeInUp delay={200}>
        <AnimatedCard style={styles.currentCityCard}>
          <Text style={styles.currentTitle}>📍 Current: {currentCity}</Text>
          <Text style={styles.currentInflation}>
            Your inflation rate: {currentInflation}%
          </Text>
          <Text style={styles.currentNote}>
            Baseline for comparison analysis
          </Text>
        </AnimatedCard>
      </FadeInUp>

      <FadeInUp delay={400}>
        <Text style={styles.sectionTitle}>Alternative Cities</Text>
        {Object.entries(cityData).map(([cityName, data]) => (
          <CityCard key={cityName} cityName={cityName} data={data} />
        ))}
      </FadeInUp>

      <FadeInUp delay={600}>
        <AnimatedCard style={styles.analysisCard}>
          <Text style={styles.analysisTitle}>🎯 Professional Recommendation</Text>
          <Text style={styles.analysisText}>
            Based on your {currentInflation}% inflation rate in {currentCity}:
          </Text>
          <Text style={styles.recommendationText}>
            • <Text style={styles.bold}>Bangalore</Text> offers the best balance of opportunities and cost savings
          </Text>
          <Text style={styles.recommendationText}>
            • <Text style={styles.bold}>Pune</Text> provides significant cost reduction with decent opportunities
          </Text>
          <Text style={styles.recommendationText}>
            • Consider <Text style={styles.bold}>remote work</Text> to access {currentCity} salaries with lower city costs
          </Text>
        </AnimatedCard>
      </FadeInUp>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    ...FiTypography.h2,
    color: FiBrandColors.text,
    marginBottom: 4,
  },
  subtitle: {
    ...FiTypography.bodySmall,
    color: FiBrandColors.textSecondary,
    marginBottom: 20,
  },
  currentCityCard: {
    backgroundColor: FiBrandColors.primary + '10',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: FiBrandColors.primary + '30',
  },
  currentTitle: {
    ...FiTypography.body,
    color: FiBrandColors.text,
    fontWeight: '600',
    marginBottom: 4,
  },
  currentInflation: {
    ...FiTypography.bodySmall,
    color: FiBrandColors.primary,
    fontWeight: '600',
    marginBottom: 4,
  },
  currentNote: {
    ...FiTypography.caption,
    color: FiBrandColors.textSecondary,
  },
  sectionTitle: {
    ...FiTypography.body,
    color: FiBrandColors.text,
    fontWeight: '600',
    marginBottom: 16,
  },
  cityCard: {
    backgroundColor: FiBrandColors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: FiBrandColors.border,
  },
  selectedCity: {
    borderColor: FiBrandColors.primary,
    backgroundColor: FiBrandColors.primaryLight + '10',
  },
  cityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cityName: {
    ...FiTypography.body,
    color: FiBrandColors.text,
    fontWeight: '600',
  },
  benefitBadge: {
    backgroundColor: FiBrandColors.success + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  benefitText: {
    ...FiTypography.caption,
    color: FiBrandColors.success,
    fontWeight: '600',
  },
  cityMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  cityDetails: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: FiBrandColors.border,
  },
  prosConsSection: {
    flexDirection: 'row',
    gap: 16,
  },
  prosSection: {
    flex: 1,
  },
  consSection: {
    flex: 1,
  },
  prosTitle: {
    ...FiTypography.bodySmall,
    color: FiBrandColors.success,
    fontWeight: '600',
    marginBottom: 8,
  },
  consTitle: {
    ...FiTypography.bodySmall,
    color: FiBrandColors.error,
    fontWeight: '600',
    marginBottom: 8,
  },
  proText: {
    ...FiTypography.caption,
    color: FiBrandColors.textSecondary,
    marginBottom: 4,
  },
  conText: {
    ...FiTypography.caption,
    color: FiBrandColors.textSecondary,
    marginBottom: 4,
  },
  analysisCard: {
    backgroundColor: FiBrandColors.surface,
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: FiBrandColors.successLight + '40',
  },
  analysisTitle: {
    ...FiTypography.body,
    color: FiBrandColors.text,
    fontWeight: '600',
    marginBottom: 8,
  },
  analysisText: {
    ...FiTypography.bodySmall,
    color: FiBrandColors.textSecondary,
    marginBottom: 12,
  },
  recommendationText: {
    ...FiTypography.bodySmall,
    color: FiBrandColors.textSecondary,
    lineHeight: 18,
    marginBottom: 4,
  },
  bold: {
    fontWeight: '600',
    color: FiBrandColors.text,
  },
});

export default CityRelocationAnalyzer;
