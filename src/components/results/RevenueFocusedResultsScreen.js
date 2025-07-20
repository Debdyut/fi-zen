import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { FiBrandColors, FiTypography } from '../../theme/fiBrandColors';
import { AnimatedCard, AnimatedNumber, FadeInUp } from '../animations/AnimatedCard';
import { EnhancedButton } from '../common/EnhancedButtons';
import { TouchableArea } from '../common/AccessibilityHelpers';

const RevenueFocusedResultsScreen = ({ navigation, inflationData }) => {
  const [showCrossSell, setShowCrossSell] = useState(true);

  // Revenue-focused features
  const crossSellData = {
    requiredReturn: Math.round((inflationData.personal + 5) * 10) / 10, // 16.8%
    fiProducts: [
      {
        name: 'Fi Mutual Funds',
        expectedReturn: '15-18%',
        benefit: 'Beat your inflation',
        cta: 'Start SIP',
        revenue: 'High'
      },
      {
        name: 'Fi Savings+',
        expectedReturn: '8-9%',
        benefit: 'Better than banks',
        cta: 'Open Account',
        revenue: 'Medium'
      }
    ],
    premiumFeatures: [
      {
        name: 'Advanced City Analysis',
        price: '₹99/month',
        benefit: 'Compare 50+ cities',
        trial: '7-day free trial'
      },
      {
        name: 'Professional Dashboard',
        price: '₹199/month', 
        benefit: 'Peer benchmarking',
        trial: '14-day free trial'
      }
    ]
  };

  const CrossSellCard = () => (
    <AnimatedCard style={styles.crossSellCard}>
      <View style={styles.crossSellHeader}>
        <Text style={styles.crossSellTitle}>🚀 Beat Your {inflationData.personal}% Inflation</Text>
        <Text style={styles.crossSellSubtitle}>
          You need {crossSellData.requiredReturn}% returns to grow your wealth
        </Text>
      </View>

      <View style={styles.productsGrid}>
        {crossSellData.fiProducts.map((product, index) => (
          <TouchableArea key={index} style={styles.productCard}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productReturn}>{product.expectedReturn}</Text>
            <Text style={styles.productBenefit}>{product.benefit}</Text>
            <EnhancedButton
              title={product.cta}
              variant="primary"
              size="small"
              onPress={() => navigation.navigate(`Fi${product.name.replace(' ', '')}`)}
              style={styles.productButton}
            />
          </TouchableArea>
        ))}
      </View>

      <View style={styles.crossSellFooter}>
        <Text style={styles.footerText}>
          💡 Fi users who invest earn 12%+ more than those who don't
        </Text>
      </View>
    </AnimatedCard>
  );

  const PremiumFeaturesCard = () => (
    <AnimatedCard style={styles.premiumCard}>
      <Text style={styles.premiumTitle}>⭐ Unlock Premium Insights</Text>
      
      {crossSellData.premiumFeatures.map((feature, index) => (
        <View key={index} style={styles.premiumFeature}>
          <View style={styles.featureInfo}>
            <Text style={styles.featureName}>{feature.name}</Text>
            <Text style={styles.featureBenefit}>{feature.benefit}</Text>
            <Text style={styles.featureTrial}>{feature.trial}</Text>
          </View>
          <View style={styles.featurePricing}>
            <Text style={styles.featurePrice}>{feature.price}</Text>
            <EnhancedButton
              title="Try Free"
              variant="secondary"
              size="small"
              onPress={() => navigation.navigate('PremiumTrial', { feature: feature.name })}
              style={styles.trialButton}
            />
          </View>
        </View>
      ))}
    </AnimatedCard>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Main Results */}
      <FadeInUp delay={0}>
        <AnimatedCard style={styles.resultsCard}>
          <Text style={styles.resultsTitle}>Your Personal Inflation Rate</Text>
          
          <View style={styles.rateComparison}>
            <View style={styles.rateBox}>
              <Text style={styles.rateLabel}>Your Rate</Text>
              <AnimatedNumber 
                value={inflationData.personal}
                style={styles.rateValue}
                suffix="%"
              />
            </View>
            <Text style={styles.vsText}>vs</Text>
            <View style={styles.rateBox}>
              <Text style={styles.rateLabel}>Government</Text>
              <AnimatedNumber 
                value={inflationData.government}
                style={[styles.rateValue, { color: FiBrandColors.secondary }]}
                suffix="%"
              />
            </View>
          </View>

          <View style={styles.impactBox}>
            <Text style={styles.impactText}>
              Your ₹1,00,000 today will need ₹1,11,800 next year
            </Text>
          </View>
        </AnimatedCard>
      </FadeInUp>

      {/* Cross-sell Integration */}
      <FadeInUp delay={400}>
        <CrossSellCard />
      </FadeInUp>

      {/* Premium Features */}
      <FadeInUp delay={600}>
        <PremiumFeaturesCard />
      </FadeInUp>

      {/* B2B Teaser */}
      <FadeInUp delay={800}>
        <View style={styles.b2bTeaser}>
          <Text style={styles.b2bTitle}>💼 For Companies</Text>
          <Text style={styles.b2bText}>
            Get inflation analysis for your entire team. Perfect for HR and finance departments.
          </Text>
          <EnhancedButton
            title="Learn More"
            variant="ghost"
            size="small"
            onPress={() => navigation.navigate('B2BSolution')}
            style={styles.b2bButton}
          />
        </View>
      </FadeInUp>

      {/* Streamlined Compliance Footer */}
      <FadeInUp delay={1000}>
        <View style={styles.complianceFooter}>
          <Text style={styles.complianceText}>
            📋 Investment products subject to market risks. This is educational content only - consult SEBI advisors for personalized advice.
          </Text>
          <TouchableArea onPress={() => navigation.navigate('FullCompliance')}>
            <Text style={styles.learnMoreLink}>Learn More →</Text>
          </TouchableArea>
        </View>
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
  resultsCard: {
    backgroundColor: FiBrandColors.surface,
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: FiBrandColors.primaryLight,
  },
  resultsTitle: {
    ...FiTypography.h3,
    color: FiBrandColors.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  rateComparison: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  rateBox: {
    alignItems: 'center',
    flex: 1,
  },
  rateLabel: {
    ...FiTypography.bodySmall,
    color: FiBrandColors.textSecondary,
    marginBottom: 8,
  },
  rateValue: {
    fontSize: 32,
    fontWeight: '800',
    color: FiBrandColors.inflationHigh,
  },
  vsText: {
    ...FiTypography.body,
    color: FiBrandColors.textSecondary,
    marginHorizontal: 20,
  },
  impactBox: {
    backgroundColor: FiBrandColors.warning + '20',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  impactText: {
    ...FiTypography.body,
    color: FiBrandColors.text,
    textAlign: 'center',
    fontWeight: '600',
  },
  crossSellCard: {
    backgroundColor: FiBrandColors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: FiBrandColors.success + '40',
  },
  crossSellHeader: {
    marginBottom: 16,
  },
  crossSellTitle: {
    ...FiTypography.h3,
    color: FiBrandColors.text,
    marginBottom: 4,
  },
  crossSellSubtitle: {
    ...FiTypography.bodySmall,
    color: FiBrandColors.textSecondary,
  },
  productsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  productCard: {
    flex: 1,
    backgroundColor: FiBrandColors.background,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  productName: {
    ...FiTypography.bodySmall,
    color: FiBrandColors.text,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  productReturn: {
    ...FiTypography.body,
    color: FiBrandColors.success,
    fontWeight: '700',
    marginBottom: 4,
  },
  productBenefit: {
    ...FiTypography.caption,
    color: FiBrandColors.textSecondary,
    marginBottom: 12,
    textAlign: 'center',
  },
  productButton: {
    width: '100%',
    height: 36,
  },
  crossSellFooter: {
    backgroundColor: FiBrandColors.success + '10',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  footerText: {
    ...FiTypography.caption,
    color: FiBrandColors.success,
    fontWeight: '600',
  },
  premiumCard: {
    backgroundColor: FiBrandColors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: FiBrandColors.warning + '40',
  },
  premiumTitle: {
    ...FiTypography.body,
    color: FiBrandColors.text,
    fontWeight: '600',
    marginBottom: 16,
  },
  premiumFeature: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: FiBrandColors.border,
  },
  featureInfo: {
    flex: 1,
  },
  featureName: {
    ...FiTypography.bodySmall,
    color: FiBrandColors.text,
    fontWeight: '600',
    marginBottom: 2,
  },
  featureBenefit: {
    ...FiTypography.caption,
    color: FiBrandColors.textSecondary,
    marginBottom: 2,
  },
  featureTrial: {
    ...FiTypography.caption,
    color: FiBrandColors.success,
    fontWeight: '500',
  },
  featurePricing: {
    alignItems: 'flex-end',
  },
  featurePrice: {
    ...FiTypography.bodySmall,
    color: FiBrandColors.text,
    fontWeight: '600',
    marginBottom: 8,
  },
  trialButton: {
    width: 80,
    height: 32,
  },
  b2bTeaser: {
    backgroundColor: FiBrandColors.info + '10',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  b2bTitle: {
    ...FiTypography.body,
    color: FiBrandColors.text,
    fontWeight: '600',
    marginBottom: 8,
  },
  b2bText: {
    ...FiTypography.bodySmall,
    color: FiBrandColors.textSecondary,
    textAlign: 'center',
    marginBottom: 12,
  },
  b2bButton: {
    width: 120,
    height: 36,
  },
  complianceFooter: {
    backgroundColor: FiBrandColors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: FiBrandColors.border,
  },
  complianceText: {
    ...FiTypography.caption,
    color: FiBrandColors.textSecondary,
    lineHeight: 16,
    marginBottom: 8,
  },
  learnMoreLink: {
    ...FiTypography.caption,
    color: FiBrandColors.primary,
    fontWeight: '600',
  },
});

export default RevenueFocusedResultsScreen;
