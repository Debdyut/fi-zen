import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { EnhancedFiColors } from '../../theme/enhancedColors';
import { AnimatedCard, FadeInUp } from '../animations/AnimatedCard';
import { CategoryIcon } from '../common/Icons';
import { ProgressIndicator } from '../common/MicroInteractions';
import { AccessibleHeading } from '../common/AccessibilityHelpers';

const DetailedBreakdownScreen = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Mock breakdown data
  const breakdownData = {
    food: {
      personalRate: 12.5,
      mospiRate: 8.7,
      weight: 35,
      contribution: 4.13,
      monthlySpend: 28000,
      subcategories: {
        'Groceries': { amount: 12000, inflation: 11.2 },
        'Restaurants': { amount: 11000, inflation: 14.8 },
        'Food Delivery': { amount: 5000, inflation: 16.5 }
      }
    },
    housing: {
      personalRate: 6.8,
      mospiRate: 4.2,
      weight: 56,
      contribution: 2.36,
      monthlySpend: 45000,
      subcategories: {
        'Rent': { amount: 40000, inflation: 6.5 },
        'Utilities': { amount: 3000, inflation: 8.2 },
        'Maintenance': { amount: 2000, inflation: 7.1 }
      }
    },
    transport: {
      personalRate: 8.5,
      mospiRate: 6.8,
      weight: 19,
      contribution: 1.28,
      monthlySpend: 15000,
      subcategories: {
        'Fuel': { amount: 8000, inflation: 9.2 },
        'Uber/Ola': { amount: 4000, inflation: 7.8 },
        'Public Transport': { amount: 3000, inflation: 6.5 }
      }
    }
  };

  const CategoryCard = ({ categoryKey, data }) => (
    <FadeInUp delay={200}>
      <AnimatedCard style={styles.categoryCard}>
        <View style={styles.categoryHeader}>
          <CategoryIcon category={categoryKey} size={32} />
          <View style={styles.categoryInfo}>
            <Text style={styles.categoryName}>
              {categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1)}
            </Text>
            <Text style={styles.categorySpend}>
              ₹{data.monthlySpend.toLocaleString()}/month
            </Text>
          </View>
          <View style={styles.categoryImpact}>
            <Text style={styles.impactValue}>+{data.contribution}%</Text>
            <Text style={styles.impactLabel}>Impact</Text>
          </View>
        </View>

        <View style={styles.progressSection}>
          <ProgressIndicator 
            progress={data.contribution / 11.8} // Total personal inflation
            color={EnhancedFiColors.chartColors[Object.keys(breakdownData).indexOf(categoryKey)]}
            height={8}
            showPercentage={false}
          />
        </View>

        <View style={styles.comparisonRow}>
          <View style={styles.comparisonItem}>
            <Text style={styles.comparisonLabel}>Your Rate</Text>
            <Text style={[styles.comparisonValue, { color: EnhancedFiColors.primary }]}>
              {data.personalRate}%
            </Text>
          </View>
          <View style={styles.comparisonItem}>
            <Text style={styles.comparisonLabel}>MOSPI Rate</Text>
            <Text style={[styles.comparisonValue, { color: EnhancedFiColors.secondary }]}>
              {data.mospiRate}%
            </Text>
          </View>
          <View style={styles.comparisonItem}>
            <Text style={styles.comparisonLabel}>Weight</Text>
            <Text style={styles.comparisonValue}>{data.weight}%</Text>
          </View>
        </View>

        {/* Subcategories */}
        <View style={styles.subcategoriesSection}>
          <Text style={styles.subcategoriesTitle}>Breakdown:</Text>
          {Object.entries(data.subcategories).map(([subcat, subdata]) => (
            <View key={subcat} style={styles.subcategoryItem}>
              <Text style={styles.subcategoryName}>{subcat}</Text>
              <Text style={styles.subcategoryAmount}>₹{subdata.amount.toLocaleString()}</Text>
              <Text style={[
                styles.subcategoryInflation,
                { color: subdata.inflation > 10 ? EnhancedFiColors.error : EnhancedFiColors.success }
              ]}>
                {subdata.inflation}%
              </Text>
            </View>
          ))}
        </View>
      </AnimatedCard>
    </FadeInUp>
  );

  return (
    <ScrollView style={styles.container}>
      <FadeInUp delay={0}>
        <View style={styles.header}>
          <AccessibleHeading level={1} style={styles.title}>
            Detailed Breakdown
          </AccessibleHeading>
          <Text style={styles.subtitle}>
            How each spending category contributes to your 11.8% inflation rate
          </Text>
        </View>
      </FadeInUp>

      {Object.entries(breakdownData).map(([categoryKey, data]) => (
        <CategoryCard key={categoryKey} categoryKey={categoryKey} data={data} />
      ))}

      <FadeInUp delay={600}>
        <View style={styles.methodologyCard}>
          <Text style={styles.methodologyTitle}>📋 Calculation Methodology</Text>
          <Text style={styles.methodologyText}>
            <Text style={styles.bold}>1. Categorization:</Text> Your transactions are automatically categorized using machine learning
          </Text>
          <Text style={styles.methodologyText}>
            <Text style={styles.bold}>2. Weight Calculation:</Text> Each category's weight is based on your actual spending
          </Text>
          <Text style={styles.methodologyText}>
            <Text style={styles.bold}>3. MOSPI Comparison:</Text> Your category inflation vs Mumbai MOSPI CPI data
          </Text>
          <Text style={styles.methodologyText}>
            <Text style={styles.bold}>4. Final Rate:</Text> Weighted average of all category contributions
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
  categoryCard: {
    backgroundColor: EnhancedFiColors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: EnhancedFiColors.border,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryInfo: {
    flex: 1,
    marginLeft: 12,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: '600',
    color: EnhancedFiColors.text,
    marginBottom: 4,
  },
  categorySpend: {
    fontSize: 14,
    color: EnhancedFiColors.textSecondary,
  },
  categoryImpact: {
    alignItems: 'center',
  },
  impactValue: {
    fontSize: 20,
    fontWeight: '700',
    color: EnhancedFiColors.primary,
  },
  impactLabel: {
    fontSize: 12,
    color: EnhancedFiColors.textSecondary,
  },
  progressSection: {
    marginBottom: 16,
  },
  comparisonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    paddingVertical: 12,
    backgroundColor: EnhancedFiColors.background,
    borderRadius: 8,
  },
  comparisonItem: {
    alignItems: 'center',
  },
  comparisonLabel: {
    fontSize: 12,
    color: EnhancedFiColors.textSecondary,
    marginBottom: 4,
  },
  comparisonValue: {
    fontSize: 16,
    fontWeight: '600',
    color: EnhancedFiColors.text,
  },
  subcategoriesSection: {
    borderTopWidth: 1,
    borderTopColor: EnhancedFiColors.border,
    paddingTop: 16,
  },
  subcategoriesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: EnhancedFiColors.text,
    marginBottom: 12,
  },
  subcategoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  subcategoryName: {
    fontSize: 14,
    color: EnhancedFiColors.text,
    flex: 1,
  },
  subcategoryAmount: {
    fontSize: 14,
    color: EnhancedFiColors.textSecondary,
    marginRight: 16,
  },
  subcategoryInflation: {
    fontSize: 14,
    fontWeight: '600',
    minWidth: 40,
    textAlign: 'right',
  },
  methodologyCard: {
    backgroundColor: EnhancedFiColors.info + '10',
    borderRadius: 12,
    padding: 16,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: EnhancedFiColors.info + '20',
  },
  methodologyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: EnhancedFiColors.text,
    marginBottom: 12,
  },
  methodologyText: {
    fontSize: 14,
    color: EnhancedFiColors.text,
    lineHeight: 20,
    marginBottom: 8,
  },
  bold: {
    fontWeight: '600',
    color: EnhancedFiColors.primary,
  },
});

export default DetailedBreakdownScreen;
