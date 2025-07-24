import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme/ThemeContext';
import { getThemeColors } from '../../theme/consolidatedFiColors';
import { AnimatedCard, FadeInUp } from '../animations/AnimatedCard';
import { CategoryIcon } from '../common/Icons';
import { ProgressIndicator } from '../common/MicroInteractions';
import { AccessibleHeading } from '../common/AccessibilityHelpers';
import { useLanguage } from '../../localization/LanguageContext';
import DataService from '../../services/DataService';
import DynamicThresholdEngine from '../../utils/DynamicThresholdEngine';

const DetailedBreakdownScreen = () => {
  const navigation = useNavigation();
  const { isDarkMode } = useTheme();
  const { t } = useLanguage();
  const colors = getThemeColors(isDarkMode);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [breakdownData, setBreakdownData] = useState({});
  const [userProfile, setUserProfile] = useState(null);
  const [totalPersonalInflation, setTotalPersonalInflation] = useState(0);
  const scrollViewRef = React.useRef(null);

  useEffect(() => {
    loadUserBreakdownData();
  }, []);

  const loadUserBreakdownData = async () => {
    try {
      setLoading(true);
      const currentUser = DataService.getCurrentUser();
      
      const [spendingInsights, profile, inflationData, userData] = await Promise.all([
        DataService.getUserSpendingInsights(currentUser),
        DataService.getUserProfile(currentUser),
        DataService.getUserInflationData(currentUser),
        DataService.getUserData(currentUser)
      ]);
      
      // Generate real breakdown data from user's actual spending
      const realBreakdownData = generateBreakdownFromUserData(spendingInsights, profile, inflationData, userData);
      
      setBreakdownData(realBreakdownData.categories);
      setUserProfile(profile);
      setTotalPersonalInflation(realBreakdownData.totalInflation);
      
    } catch (error) {
      console.error('Error loading breakdown data:', error);
      // Fallback to basic data if loading fails
      const fallbackData = generateFallbackData();
      setBreakdownData(fallbackData);
      setTotalPersonalInflation(8.2); // Set fallback total inflation
    } finally {
      setLoading(false);
    }
  };

  const generateBreakdownFromUserData = (spendingInsights, profile, inflationData, userData) => {
    const monthlySpending = userData.monthlySpending || {};
    const totalSpending = Object.values(monthlySpending).reduce((sum, amount) => sum + amount, 0);
    
    // Get dynamic thresholds for this user
    const thresholds = DynamicThresholdEngine.getSpendingThresholds(profile);
    
    // Calculate category weights based on actual spending
    const categories = {};
    let totalInflation = 0;
    
    // Process each spending category
    Object.entries(monthlySpending).forEach(([category, amount]) => {
      if (amount > 0) {
        const weight = (amount / totalSpending) * 100;
        const personalRate = calculatePersonalInflationRate(category, amount, profile, inflationData);
        const mospiRate = getMOSPIRate(category);
        const contribution = (weight * personalRate) / 100;
        
        categories[category] = {
          personalRate: personalRate,
          mospiRate: mospiRate,
          weight: weight,
          contribution: contribution,
          monthlySpend: amount,
          subcategories: generateSubcategories(category, amount, personalRate),
          threshold: getThresholdForCategory(category, thresholds, profile),
          status: getSpendingStatus(category, amount, profile, thresholds)
        };
        
        totalInflation += contribution;
      }
    });
    
    return {
      categories: categories,
      totalInflation: totalInflation
    };
  };

  const calculatePersonalInflationRate = (category, amount, profile, inflationData) => {
    // Base inflation rates by category (these could come from real market data)
    const baseRates = {
      food: 8.7,
      housing: 4.2,
      transport: 6.8,
      entertainment: 5.5,
      shopping: 7.2,
      miscellaneous: 6.0
    };
    
    const baseRate = baseRates[category] || 6.0;
    
    // Adjust based on user's spending level and location
    let adjustedRate = baseRate;
    
    // High spending in category = higher personal inflation
    const income = profile.monthlyIncome;
    const spendingRatio = amount / income;
    
    if (spendingRatio > 0.20) adjustedRate *= 1.3; // 30% higher if >20% of income
    else if (spendingRatio > 0.15) adjustedRate *= 1.2; // 20% higher if >15% of income
    else if (spendingRatio < 0.05) adjustedRate *= 0.8; // 20% lower if <5% of income
    
    // Location-based adjustments
    const location = profile.location?.toLowerCase() || '';
    if (location.includes('mumbai') || location.includes('delhi')) {
      adjustedRate *= 1.2; // Metro cities have higher inflation
    } else if (location.includes('bangalore') || location.includes('pune')) {
      adjustedRate *= 1.1; // Tier 1.5 cities
    }
    
    // Age-based adjustments (lifestyle inflation)
    if (profile.age < 30) adjustedRate *= 1.1; // Young people face lifestyle inflation
    
    return Math.round(adjustedRate * 10) / 10; // Round to 1 decimal
  };

  const getMOSPIRate = (category) => {
    // Official MOSPI inflation rates by category
    const mospiRates = {
      food: 8.7,
      housing: 4.2,
      transport: 6.8,
      entertainment: 5.5,
      shopping: 7.2,
      miscellaneous: 6.0
    };
    
    return mospiRates[category] || 6.0;
  };

  const generateSubcategories = (category, totalAmount, inflationRate) => {
    // Generate realistic subcategories based on spending patterns
    const subcategoryTemplates = {
      food: [
        { name: 'Groceries', ratio: 0.45, inflationAdjust: -0.5 },
        { name: 'Restaurants', ratio: 0.35, inflationAdjust: +1.2 },
        { name: 'Food Delivery', ratio: 0.20, inflationAdjust: +2.0 }
      ],
      housing: [
        { name: 'Rent/EMI', ratio: 0.80, inflationAdjust: -1.0 },
        { name: 'Utilities', ratio: 0.12, inflationAdjust: +0.5 },
        { name: 'Maintenance', ratio: 0.08, inflationAdjust: +0.3 }
      ],
      transport: [
        { name: 'Fuel', ratio: 0.50, inflationAdjust: +1.5 },
        { name: 'Cab/Auto', ratio: 0.30, inflationAdjust: +0.8 },
        { name: 'Public Transport', ratio: 0.20, inflationAdjust: -0.5 }
      ],
      entertainment: [
        { name: 'Movies/Events', ratio: 0.40, inflationAdjust: +1.0 },
        { name: 'Subscriptions', ratio: 0.35, inflationAdjust: +2.5 },
        { name: 'Gaming/Hobbies', ratio: 0.25, inflationAdjust: +1.8 }
      ],
      shopping: [
        { name: 'Clothing', ratio: 0.45, inflationAdjust: +1.5 },
        { name: 'Electronics', ratio: 0.30, inflationAdjust: -0.5 },
        { name: 'Personal Care', ratio: 0.25, inflationAdjust: +2.0 }
      ]
    };
    
    const template = subcategoryTemplates[category] || [
      { name: 'Primary', ratio: 0.60, inflationAdjust: 0 },
      { name: 'Secondary', ratio: 0.40, inflationAdjust: +1.0 }
    ];
    
    const subcategories = {};
    template.forEach(sub => {
      subcategories[sub.name] = {
        amount: Math.round(totalAmount * sub.ratio),
        inflation: Math.round((inflationRate + sub.inflationAdjust) * 10) / 10
      };
    });
    
    return subcategories;
  };

  const getThresholdForCategory = (category, thresholds, profile) => {
    const income = profile.monthlyIncome;
    
    switch (category) {
      case 'entertainment':
        return {
          warning: income * thresholds.entertainment.warning,
          target: income * thresholds.entertainment.target,
          reasoning: thresholds.entertainment.reasoning
        };
      case 'food':
        return {
          warning: income * (thresholds.food?.warning || 0.25),
          target: income * (thresholds.food?.target || 0.20),
          reasoning: 'Food spending threshold based on your profile'
        };
      default:
        return {
          warning: income * 0.15,
          target: income * 0.10,
          reasoning: 'Standard spending threshold'
        };
    }
  };

  const getSpendingStatus = (category, amount, profile, thresholds) => {
    const threshold = getThresholdForCategory(category, thresholds, profile);
    
    if (amount > threshold.warning) return 'high';
    if (amount > threshold.target) return 'moderate';
    return 'good';
  };

  const generateFallbackData = () => {
    // Minimal fallback data if real data loading fails
    return {
      food: {
        personalRate: 10.0,
        mospiRate: 8.7,
        weight: 30,
        contribution: 3.0,
        monthlySpend: 20000,
        subcategories: {
          'Groceries': { amount: 12000, inflation: 9.5 },
          'Restaurants': { amount: 8000, inflation: 12.0 }
        },
        status: 'moderate'
      }
    };
  };

  const CategoryCard = ({ categoryKey, data }) => {
    const getStatusColor = (status) => {
      switch (status) {
        case 'high': return '#FF6B6B';
        case 'moderate': return '#FFB800';
        case 'good': return '#00D4AA';
        default: return colors.primary;
      }
    };

    const getStatusText = (status) => {
      switch (status) {
        case 'high': return 'Above Recommended';
        case 'moderate': return 'Moderate Level';
        case 'good': return 'Within Limits';
        default: return 'Normal';
      }
    };

    return (
      <FadeInUp delay={200}>
        <AnimatedCard style={[styles.categoryCard, { backgroundColor: '#FFFFFF', shadowColor: colors.primary }]}>
          <View style={styles.categoryHeader}>
            <CategoryIcon category={categoryKey} size={32} />
            <View style={styles.categoryInfo}>
              <Text style={[styles.categoryName, { color: '#1A1A1A' }]}>
                {t(`insights.${categoryKey === 'food' ? 'foodDining' : categoryKey === 'transport' ? 'transportation' : categoryKey}`)}
              </Text>
              <Text style={[styles.categorySpend, { color: '#666666' }]}>
                ₹{data.monthlySpend.toLocaleString()}/{t('breakdown.month')}
              </Text>
              {data.status && (
                <Text style={[styles.statusText, { color: getStatusColor(data.status) }]}>
                  {getStatusText(data.status)}
                </Text>
              )}
            </View>
            <View style={styles.categoryImpact}>
              <Text style={[styles.impactValue, { color: colors.primary }]}>+{data.contribution.toFixed(2)}%</Text>
              <Text style={[styles.impactLabel, { color: colors.textSecondary }]}>{t('breakdown.impact')}</Text>
            </View>
            <TouchableOpacity 
              style={[styles.infoButton, { backgroundColor: '#00D4AA20', borderColor: '#1A1A1A' }]}
              onPress={() => {
                scrollViewRef.current?.scrollToEnd({ animated: true });
              }}
            >
              <Text style={[styles.infoIcon, { color: '#1A1A1A' }]}>i</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.progressSection}>
            <ProgressIndicator 
              progress={data.contribution / (totalPersonalInflation || 10)} // Use actual total inflation
              color={colors.primary}
              height={8}
              showPercentage={false}
            />
          </View>

          <View style={[styles.comparisonRow, { backgroundColor: colors.primaryLight + '20' }]}>
            <View style={styles.comparisonItem}>
              <Text style={[styles.comparisonLabel, { color: '#666666' }]}>{t('breakdown.yourRate')}</Text>
              <View style={styles.rateWithArrow}>
                <Text style={[styles.comparisonValue, { color: data.personalRate > data.mospiRate ? '#FF6B6B' : '#00D4AA' }]}>
                  {data.personalRate}%
                </Text>
                <Text style={styles.arrowIcon}>
                  {data.personalRate > data.mospiRate ? '↗️' : '↘️'}
                </Text>
              </View>
          </View>
          <View style={styles.comparisonItem}>
            <Text style={[styles.comparisonLabel, { color: '#666666' }]}>{t('breakdown.mospiRate')}</Text>
            <Text style={[styles.comparisonValue, { color: '#666666' }]}>
              {data.mospiRate}%
            </Text>
          </View>
          <View style={styles.comparisonItem}>
            <Text style={[styles.comparisonLabel, { color: '#666666' }]}>{t('breakdown.weight')}</Text>
            <Text style={[styles.comparisonValue, { color: '#1A1A1A' }]}>{data.weight}%</Text>
          </View>
        </View>

        {/* Subcategories */}
        <View style={[styles.subcategoriesSection, { borderTopColor: colors.border }]}>
          <Text style={[styles.subcategoriesTitle, { color: '#1A1A1A' }]}>{t('breakdown.breakdown')}:</Text>
          {Object.entries(data.subcategories).map(([subcat, subdata]) => (
            <View key={subcat} style={styles.subcategoryItem}>
              <Text style={[styles.subcategoryName, { color: '#1A1A1A' }]}>{t(`breakdown.${subcat.toLowerCase().replace(/[^a-z]/g, '')}`)}</Text>
              <Text style={[styles.subcategoryAmount, { color: '#666666' }]}>₹{subdata.amount.toLocaleString()}</Text>
              <Text style={[
                styles.subcategoryInflation,
                { color: subdata.inflation > 10 ? '#FF6B6B' : '#00D4AA' }
              ]}>
                {subdata.inflation}%
              </Text>
            </View>
          ))}
        </View>
      </AnimatedCard>
    </FadeInUp>
  );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer, { backgroundColor: colors.primary + '10' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.text }]}>
          Loading your personalized breakdown...
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, paddingTop: 50 }}>
      <ScrollView ref={scrollViewRef} style={[styles.container, { backgroundColor: colors.primary + '10' }]}>
      <FadeInUp delay={0}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <AccessibleHeading level={1} style={[styles.title, { color: colors.text }]}>
              {t('insights.inflationImpactByCategory')}
            </AccessibleHeading>
            <TouchableOpacity style={[styles.closeButton, { backgroundColor: colors.primary + '20' }]} onPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.navigate('MainTabs')}>
              <Text style={[styles.closeButtonText, { color: colors.text }]}>✕</Text>
            </TouchableOpacity>
          </View>
          <Text style={[styles.subtitle, { color: colors.text }]}>
            {userProfile ? `Based on your spending of ₹${Object.values(breakdownData).reduce((sum, data) => sum + data.monthlySpend, 0).toLocaleString()}/month` : t('breakdown.subtitle')}
          </Text>
          <Text style={[styles.locationText, { color: colors.text }]}>
            📍 {userProfile?.location || t('location.mumbai')}
          </Text>
          <Text style={[styles.totalInflationText, { color: colors.primary }]}>
            Total Personal Inflation: {totalPersonalInflation.toFixed(2)}%
          </Text>
        </View>
      </FadeInUp>

      {Object.entries(breakdownData).map(([categoryKey, data]) => (
        <CategoryCard key={categoryKey} categoryKey={categoryKey} data={data} />
      ))}

      <FadeInUp delay={600}>
        <View style={styles.methodologyCard}>
          <Text style={[styles.methodologyTitle, { color: '#1A1A1A' }]}>📋 {t('breakdown.methodology')}</Text>
          <Text style={[styles.methodologyText, { color: '#1A1A1A' }]}>
            <Text style={styles.bold}>Personal Data:</Text> Your breakdown is calculated from your actual spending patterns, location ({userProfile?.location}), and profile.
          </Text>
          <Text style={[styles.methodologyText, { color: '#1A1A1A' }]}>
            <Text style={styles.bold}>Dynamic Thresholds:</Text> Spending recommendations are personalized based on your income (₹{userProfile?.monthlyIncome?.toLocaleString()}/month) and age ({userProfile?.age}).
          </Text>
          <Text style={[styles.methodologyText, { color: '#1A1A1A' }]}>
            <Text style={styles.bold}>Location Adjustment:</Text> Inflation rates are adjusted for your city's cost of living.
          </Text>
          <Text style={[styles.methodologyText, { color: '#1A1A1A' }]}>
            <Text style={styles.bold}>Real-time Updates:</Text> Data refreshes based on your latest spending patterns.
          </Text>
          <View style={styles.mospiCredit}>
            <Image 
              source={require('../../../assets/logos/Logo-MOSPI-01.58746789e2643aae82fb.png')}
              style={styles.mospiLogo}
              resizeMode="contain"
            />
            <Text style={[styles.mospiText, { color: colors.textSecondary }]}>{t('breakdown.dataSource')}</Text>
          </View>
        </View>
      </FadeInUp>
      
      <TouchableOpacity 
        style={[styles.backToTopButton, { backgroundColor: colors.primary + '20' }]}
        onPress={() => scrollViewRef.current?.scrollTo({ y: 0, animated: true })}
      >
        <Text style={[styles.backToTopText, { color: colors.primary }]}>↑ {t('breakdown.backToTop')}</Text>
      </TouchableOpacity>
    </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 24,
    marginTop: 0,
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    flex: 1,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  locationText: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  categoryCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 0,
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
    marginBottom: 4,
  },
  categorySpend: {
    fontSize: 14,
  },
  categoryImpact: {
    alignItems: 'center',
  },
  impactValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  impactLabel: {
    fontSize: 12,
  },
  progressSection: {
    marginBottom: 16,
  },
  comparisonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  comparisonItem: {
    alignItems: 'center',
  },
  comparisonLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  comparisonValue: {
    fontSize: 16,
    fontWeight: '600',
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
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  infoIcon: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  subcategoriesSection: {
    borderTopWidth: 1,
    paddingTop: 16,
  },
  subcategoriesTitle: {
    fontSize: 14,
    fontWeight: '600',
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
    flex: 1,
  },
  subcategoryAmount: {
    fontSize: 14,
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
    marginBottom: 12,
  },
  methodologyText: {
    fontSize: 14,
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
    fontStyle: 'italic',
    textAlign: 'center',
  },
  backToTopButton: {
    marginTop: 0,
    marginBottom: 40,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'center',
  },
  backToTopText: {
    fontSize: 14,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  totalInflationText: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default DetailedBreakdownScreen;
