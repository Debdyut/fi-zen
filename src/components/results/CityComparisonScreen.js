import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { EnhancedFiColors } from '../../theme/enhancedColors';
import { AnimatedCard, FadeInUp } from '../animations/AnimatedCard';
import { EnhancedButton } from '../common/EnhancedButtons';
import { AccessibleHeading } from '../common/AccessibilityHelpers';

const CityComparisonScreen = ({ navigation }) => {
  const [selectedCity, setSelectedCity] = useState('Mumbai');

  const cityData = {
    Mumbai: {
      personalInflation: 11.8,
      mospiRate: 7.2,
      salaryPremium: 45,
      costDrivers: ['Housing: 80% above national', 'Transport: 25% above'],
      tier: 'Tier 1',
      population: '12.4M'
    },
    Delhi: {
      personalInflation: 10.5,
      mospiRate: 6.8,
      salaryPremium: 40,
      costDrivers: ['Housing: 70% above national', 'Food: 20% above'],
      tier: 'Tier 1',
      population: '11.0M'
    },
    Bangalore: {
      personalInflation: 9.4,
      mospiRate: 6.2,
      salaryPremium: 35,
      costDrivers: ['Housing: 60% above national', 'Transport: 15% above'],
      tier: 'Tier 1',
      population: '8.4M'
    },
    Pune: {
      personalInflation: 8.7,
      mospiRate: 5.8,
      salaryPremium: 25,
      costDrivers: ['Housing: 40% above national', 'Food: 10% above'],
      tier: 'Tier 1',
      population: '3.1M'
    }
  };

  const CityCard = ({ cityName, data, isSelected }) => (
    <AnimatedCard 
      style={[
        styles.cityCard,
        isSelected && styles.selectedCityCard
      ]}
    >
      <View style={styles.cityHeader}>
        <Text style={styles.cityName}>{cityName}</Text>
        <View style={styles.cityMeta}>
          <Text style={styles.tierBadge}>{data.tier}</Text>
          <Text style={styles.population}>{data.population}</Text>
        </View>
      </View>

      <View style={styles.inflationComparison}>
        <View style={styles.rateBox}>
          <Text style={styles.rateLabel}>Your Estimated Rate</Text>
          <Text style={[
            styles.rateValue,
            { color: data.personalInflation > 10 ? EnhancedFiColors.error : EnhancedFiColors.success }
          ]}>
            {data.personalInflation}%
          </Text>
        </View>
        <View style={styles.rateBox}>
          <Text style={styles.rateLabel}>MOSPI Rate</Text>
          <Text style={[styles.rateValue, { color: EnhancedFiColors.secondary }]}>
            {data.mospiRate}%
          </Text>
        </View>
      </View>

      <View style={styles.salarySection}>
        <Text style={styles.salaryLabel}>💼 Salary Premium:</Text>
        <Text style={styles.salaryValue}>+{data.salaryPremium}% above national</Text>
      </View>

      <View style={styles.driversSection}>
        <Text style={styles.driversLabel}>📊 Cost Drivers:</Text>
        {data.costDrivers.map((driver, index) => (
          <Text key={index} style={styles.driverItem}>• {driver}</Text>
        ))}
      </View>
    </AnimatedCard>
  );

  return (
    <ScrollView style={styles.container}>
      <FadeInUp delay={0}>
        <View style={styles.header}>
          <AccessibleHeading level={1} style={styles.title}>
            City Comparison
          </AccessibleHeading>
          <Text style={styles.subtitle}>
            Compare your inflation rate across major Indian cities
          </Text>
        </View>
      </FadeInUp>

      <FadeInUp delay={200}>
        <View style={styles.currentCitySection}>
          <Text style={styles.currentCityLabel}>📍 Your Current City:</Text>
          <Text style={styles.currentCityName}>Mumbai</Text>
          <Text style={styles.currentCityRate}>Personal Inflation: 11.8%</Text>
        </View>
      </FadeInUp>

      {Object.entries(cityData).map(([cityName, data], index) => (
        <FadeInUp key={cityName} delay={300 + (index * 100)}>
          <CityCard 
            cityName={cityName} 
            data={data} 
            isSelected={cityName === selectedCity}
          />
        </FadeInUp>
      ))}

      <FadeInUp delay={800}>
        <View style={styles.disclaimerSection}>
          <Text style={styles.disclaimerTitle}>ℹ️ Important Notes:</Text>
          <Text style={styles.disclaimerText}>
            • Estimates based on your Mumbai spending patterns applied to other cities
          </Text>
          <Text style={styles.disclaimerText}>
            • Actual rates may vary based on lifestyle and specific location within city
          </Text>
          <Text style={styles.disclaimerText}>
            • MOSPI data updated monthly, salary premiums are approximate
          </Text>
        </View>
      </FadeInUp>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: EnhancedFiColors.background,
    padding: 20,
  },
  header: {
    marginBottom: 24,
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: EnhancedFiColors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: EnhancedFiColors.textSecondary,
    lineHeight: 22,
  },
  currentCitySection: {
    backgroundColor: EnhancedFiColors.primary + '10',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: EnhancedFiColors.primary + '20',
  },
  currentCityLabel: {
    fontSize: 14,
    color: EnhancedFiColors.textSecondary,
    marginBottom: 4,
  },
  currentCityName: {
    fontSize: 20,
    fontWeight: '600',
    color: EnhancedFiColors.text,
    marginBottom: 4,
  },
  currentCityRate: {
    fontSize: 14,
    color: EnhancedFiColors.primary,
    fontWeight: '500',
  },
  cityCard: {
    backgroundColor: EnhancedFiColors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: EnhancedFiColors.border,
  },
  selectedCityCard: {
    borderColor: EnhancedFiColors.primary,
    backgroundColor: EnhancedFiColors.primary + '05',
  },
  cityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cityName: {
    fontSize: 20,
    fontWeight: '600',
    color: EnhancedFiColors.text,
  },
  cityMeta: {
    alignItems: 'flex-end',
  },
  tierBadge: {
    backgroundColor: EnhancedFiColors.secondary + '20',
    color: EnhancedFiColors.secondary,
    fontSize: 10,
    fontWeight: '600',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 4,
  },
  population: {
    fontSize: 12,
    color: EnhancedFiColors.textSecondary,
  },
  inflationComparison: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    backgroundColor: EnhancedFiColors.background,
    borderRadius: 8,
    padding: 12,
  },
  rateBox: {
    alignItems: 'center',
  },
  rateLabel: {
    fontSize: 12,
    color: EnhancedFiColors.textSecondary,
    marginBottom: 4,
  },
  rateValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  salarySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: EnhancedFiColors.border,
  },
  salaryLabel: {
    fontSize: 14,
    color: EnhancedFiColors.text,
    fontWeight: '500',
  },
  salaryValue: {
    fontSize: 14,
    color: EnhancedFiColors.success,
    fontWeight: '600',
  },
  driversSection: {
    marginTop: 8,
  },
  driversLabel: {
    fontSize: 14,
    color: EnhancedFiColors.text,
    fontWeight: '500',
    marginBottom: 8,
  },
  driverItem: {
    fontSize: 12,
    color: EnhancedFiColors.textSecondary,
    lineHeight: 16,
    marginBottom: 4,
  },
  disclaimerSection: {
    backgroundColor: EnhancedFiColors.warning + '10',
    borderRadius: 12,
    padding: 16,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: EnhancedFiColors.warning + '20',
  },
  disclaimerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: EnhancedFiColors.text,
    marginBottom: 8,
  },
  disclaimerText: {
    fontSize: 12,
    color: EnhancedFiColors.textSecondary,
    lineHeight: 16,
    marginBottom: 4,
  },
});

export default CityComparisonScreen;
