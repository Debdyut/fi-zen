import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FiColors } from '../../theme/consolidatedFiColors';
import { AnimatedCard, FadeInUp } from '../animations/AnimatedCard';
import { CategoryIcon } from '../common/Icons';
import { ProgressIndicator } from '../common/MicroInteractions';
import { AccessibleHeading } from '../common/AccessibilityHelpers';

const DetailedBreakdownScreen = () => {
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const scrollViewRef = React.useRef(null);

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
          <TouchableOpacity 
            style={styles.infoButton}
            onPress={() => {
              scrollViewRef.current?.scrollToEnd({ animated: true });
            }}
          >
            <Text style={styles.infoIcon}>i</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.progressSection}>
          <ProgressIndicator 
            progress={data.contribution / 11.8} // Total personal inflation
            color={FiColors.primary}
            height={8}
            showPercentage={false}
          />
        </View>

        <View style={styles.comparisonRow}>
          <View style={styles.comparisonItem}>
            <Text style={styles.comparisonLabel}>Your Rate</Text>
            <View style={styles.rateWithArrow}>
              <Text style={[styles.comparisonValue, { color: data.personalRate > data.mospiRate ? FiColors.error : FiColors.success }]}>
                {data.personalRate}%
              </Text>
              <Text style={styles.arrowIcon}>
                {data.personalRate > data.mospiRate ? '↗️' : '↘️'}
              </Text>
            </View>
          </View>
          <View style={styles.comparisonItem}>
            <Text style={styles.comparisonLabel}>MOSPI Rate</Text>
            <Text style={[styles.comparisonValue, { color: FiColors.textSecondary }]}>
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
                { color: subdata.inflation > 10 ? FiColors.error : FiColors.success }
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
    <ScrollView ref={scrollViewRef} style={styles.container}>
      <FadeInUp delay={0}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <AccessibleHeading level={1} style={styles.title}>
              Detailed Breakdown
            </AccessibleHeading>
            <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.subtitle}>
            How each spending category contributes to your 11.8% annual inflation rate (vs last year)
          </Text>
          <Text style={styles.locationText}>
            📍 Mumbai
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
            <Text style={styles.bold}>2. Weight Calculation:</Text> Each category's weight is based on your actual spending proportion (e.g., if you spend 40% on food, food gets 40% weight)
          </Text>
          <Text style={styles.methodologyText}>
            <Text style={styles.bold}>3. MOSPI Comparison:</Text> Your category inflation vs Mumbai MOSPI CPI data
          </Text>
          <Text style={styles.methodologyText}>
            <Text style={styles.bold}>4. Final Rate:</Text> Weighted average of all category contributions
          </Text>
          <View style={styles.mospiCredit}>
            <Image 
              source={require('../../../assets/logos/Logo-MOSPI-01.58746789e2643aae82fb.png')}
              style={styles.mospiLogo}
              resizeMode="contain"
            />
            <Text style={styles.mospiText}>Data source: Ministry of Statistics & Programme Implementation (MOSPI), Govt. of India</Text>
          </View>
        </View>
      </FadeInUp>
      
      <TouchableOpacity 
        style={styles.backToTopButton}
        onPress={() => scrollViewRef.current?.scrollTo({ y: 0, animated: true })}
      >
        <Text style={styles.backToTopText}>↑ Back to Top</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: FiColors.primary + '10',
    padding: 20,
  },
  header: {
    marginBottom: 24,
    marginTop: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: FiColors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: FiColors.text,
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: FiColors.text,
    flex: 1,
  },
  subtitle: {
    fontSize: 16,
    color: FiColors.text,
    lineHeight: 22,
  },
  locationText: {
    fontSize: 14,
    color: FiColors.text,
    fontWeight: '600',
    marginTop: 4,
  },
  categoryCard: {
    backgroundColor: FiColors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 0,
    shadowColor: FiColors.primary,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
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
    color: FiColors.text,
    marginBottom: 4,
  },
  categorySpend: {
    fontSize: 14,
    color: FiColors.textSecondary,
  },
  categoryImpact: {
    alignItems: 'center',
  },
  impactValue: {
    fontSize: 20,
    fontWeight: '700',
    color: FiColors.primary,
  },
  impactLabel: {
    fontSize: 12,
    color: FiColors.textSecondary,
  },
  progressSection: {
    marginBottom: 16,
  },
  comparisonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    paddingVertical: 12,
    backgroundColor: FiColors.primaryLight + '20',
    borderRadius: 8,
  },
  comparisonItem: {
    alignItems: 'center',
  },
  comparisonLabel: {
    fontSize: 12,
    color: FiColors.textSecondary,
    marginBottom: 4,
  },
  comparisonValue: {
    fontSize: 16,
    fontWeight: '600',
    color: FiColors.text,
  },
  rateWithArrow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  arrowIcon: {
    fontSize: 14,
  },
  infoButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: FiColors.primary + '20',
    borderWidth: 1,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  infoIcon: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  subcategoriesSection: {
    borderTopWidth: 1,
    borderTopColor: FiColors.border,
    paddingTop: 16,
  },
  subcategoriesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: FiColors.text,
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
    color: FiColors.text,
    flex: 1,
  },
  subcategoryAmount: {
    fontSize: 14,
    color: FiColors.textSecondary,
    marginRight: 16,
  },
  subcategoryInflation: {
    fontSize: 14,
    fontWeight: '600',
    minWidth: 40,
    textAlign: 'right',
  },
  methodologyCard: {
    backgroundColor: '#FFF9C4',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 0,
    shadowColor: '#F57F17',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  methodologyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: FiColors.text,
    marginBottom: 12,
  },
  methodologyText: {
    fontSize: 14,
    color: FiColors.text,
    lineHeight: 20,
    marginBottom: 8,
  },
  bold: {
    fontWeight: '600',
    color: '#2E7D32',
  },
  mospiCredit: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F57F17' + '30',
    alignItems: 'center',
  },
  mospiLogo: {
    width: 180,
    height: 90,
    marginBottom: 8,
  },
  mospiText: {
    fontSize: 12,
    color: FiColors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  backToTopButton: {
    marginTop: 0,
    marginBottom: 40,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: FiColors.primary + '20',
    borderRadius: 20,
    alignSelf: 'center',
  },
  backToTopText: {
    fontSize: 14,
    color: FiColors.primary,
    fontWeight: '600',
  },
});

export default DetailedBreakdownScreen;
