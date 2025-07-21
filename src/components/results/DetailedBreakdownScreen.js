import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme/ThemeContext';
import { getThemeColors } from '../../theme/consolidatedFiColors';
import { AnimatedCard, FadeInUp } from '../animations/AnimatedCard';
import { CategoryIcon } from '../common/Icons';
import { ProgressIndicator } from '../common/MicroInteractions';
import { AccessibleHeading } from '../common/AccessibilityHelpers';
import { useLanguage } from '../../localization/LanguageContext';

const DetailedBreakdownScreen = () => {
  const navigation = useNavigation();
  const { isDarkMode } = useTheme();
  const { t } = useLanguage();
  const colors = getThemeColors(isDarkMode);
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
          </View>
          <View style={styles.categoryImpact}>
            <Text style={[styles.impactValue, { color: colors.primary }]}>+{data.contribution}%</Text>
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
            progress={data.contribution / 11.8} // Total personal inflation
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

  return (
    <View style={{ flex: 1, paddingTop: 50 }}>
      <ScrollView ref={scrollViewRef} style={[styles.container, { backgroundColor: colors.primary + '10' }]}>
      <FadeInUp delay={0}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <AccessibleHeading level={1} style={[styles.title, { color: colors.text }]}>
              {t('insights.inflationImpactByCategory')}
            </AccessibleHeading>
            <TouchableOpacity style={[styles.closeButton, { backgroundColor: colors.primary + '20' }]} onPress={() => navigation.goBack()}>
              <Text style={[styles.closeButtonText, { color: colors.text }]}>✕</Text>
            </TouchableOpacity>
          </View>
          <Text style={[styles.subtitle, { color: colors.text }]}>
            {t('breakdown.subtitle')}
          </Text>
          <Text style={[styles.locationText, { color: colors.text }]}>
            📍 {t('location.mumbai')}
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
            <Text style={styles.bold}>{t('breakdown.step1Title')}</Text> {t('breakdown.step1Text')}
          </Text>
          <Text style={[styles.methodologyText, { color: '#1A1A1A' }]}>
            <Text style={styles.bold}>{t('breakdown.step2Title')}</Text> {t('breakdown.step2Text')}
          </Text>
          <Text style={[styles.methodologyText, { color: '#1A1A1A' }]}>
            <Text style={styles.bold}>{t('breakdown.step3Title')}</Text> {t('breakdown.step3Text')}
          </Text>
          <Text style={[styles.methodologyText, { color: '#1A1A1A' }]}>
            <Text style={styles.bold}>{t('breakdown.step4Title')}</Text> {t('breakdown.step4Text')}
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
});

export default DetailedBreakdownScreen;
