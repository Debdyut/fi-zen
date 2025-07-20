import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { EnhancedFiColors } from '../../theme/enhancedColors';
import { AnimatedCard, FadeInUp } from '../animations/AnimatedCard';
import { EnhancedButton } from '../common/EnhancedButtons';
import { ProgressIndicator } from '../common/MicroInteractions';
import { AccessibleHeading, TouchableArea } from '../common/AccessibilityHelpers';

const InvestmentRecommendationsScreen = ({ navigation }) => {
  const [selectedStrategy, setSelectedStrategy] = useState(null);

  const inflationData = {
    personal: 11.8,
    requiredReturn: 16.8, // Post-tax return needed
    riskProfile: 'moderate'
  };

  const investmentStrategies = {
    conservative: {
      title: 'Conservative Strategy',
      riskLevel: 'Low',
      expectedReturn: '8-10%',
      allocation: {
        equity: 30,
        debt: 50,
        gold: 15,
        cash: 5
      },
      suitability: 'Risk-averse investors, nearing retirement'
    },
    balanced: {
      title: 'Balanced Strategy',
      riskLevel: 'Moderate',
      expectedReturn: '10-14%',
      allocation: {
        equity: 60,
        debt: 25,
        gold: 10,
        international: 5
      },
      suitability: 'Most urban professionals, 5-15 year goals'
    },
    aggressive: {
      title: 'Aggressive Strategy',
      riskLevel: 'High',
      expectedReturn: '14-18%',
      allocation: {
        equity: 80,
        debt: 10,
        international: 8,
        alternatives: 2
      },
      suitability: 'Young investors, long-term wealth building'
    }
  };

  const StrategyCard = ({ strategyKey, strategy, isRecommended = false }) => (
    <TouchableArea
      style={[
        styles.strategyCard,
        selectedStrategy === strategyKey && styles.selectedStrategy,
        isRecommended && styles.recommendedStrategy
      ]}
      onPress={() => setSelectedStrategy(strategyKey)}
    >
      {isRecommended && (
        <View style={styles.recommendedBadge}>
          <Text style={styles.recommendedText}>Recommended</Text>
        </View>
      )}
      
      <View style={styles.strategyHeader}>
        <Text style={styles.strategyTitle}>{strategy.title}</Text>
        <View style={styles.riskBadge}>
          <Text style={styles.riskText}>{strategy.riskLevel} Risk</Text>
        </View>
      </View>

      <Text style={styles.expectedReturn}>
        Expected Return: {strategy.expectedReturn}
      </Text>

      <View style={styles.allocationSection}>
        <Text style={styles.allocationTitle}>Asset Allocation:</Text>
        {Object.entries(strategy.allocation).map(([asset, percentage]) => (
          <View key={asset} style={styles.allocationItem}>
            <Text style={styles.assetName}>
              {asset.charAt(0).toUpperCase() + asset.slice(1)}
            </Text>
            <View style={styles.allocationBar}>
              <ProgressIndicator
                progress={percentage / 100}
                color={getAssetColor(asset)}
                height={6}
              />
            </View>
            <Text style={styles.assetPercentage}>{percentage}%</Text>
          </View>
        ))}
      </View>

      <Text style={styles.suitability}>
        <Text style={styles.suitabilityLabel}>Best for: </Text>
        {strategy.suitability}
      </Text>
    </TouchableArea>
  );

  const getAssetColor = (asset) => {
    const colors = {
      equity: EnhancedFiColors.primary,
      debt: EnhancedFiColors.success,
      gold: '#FFD700',
      international: EnhancedFiColors.info,
      cash: EnhancedFiColors.secondary,
      alternatives: EnhancedFiColors.warning
    };
    return colors[asset] || EnhancedFiColors.primary;
  };

  return (
    <ScrollView style={styles.container}>
      <FadeInUp delay={0}>
        <View style={styles.header}>
          <AccessibleHeading level={1} style={styles.title}>
            Beat Your Inflation
          </AccessibleHeading>
          <Text style={styles.subtitle}>
            Investment strategies to outpace your {inflationData.personal}% inflation rate
          </Text>
        </View>
      </FadeInUp>

      {/* SEBI Disclaimer */}
      <FadeInUp delay={200}>
        <View style={styles.disclaimerCard}>
          <View style={styles.disclaimerHeader}>
            <Image 
              source={require('../../../assets/logos/sebi-new-logo-445.jpg')} 
              style={styles.sebiLogo} 
              resizeMode="contain" 
            />
            <Text style={styles.disclaimerTitle}>Important Disclaimer</Text>
          </View>
          <Text style={styles.disclaimerText}>
            • This is educational information only, not personalized investment advice
          </Text>
          <Text style={styles.disclaimerText}>
            • Past performance does not guarantee future results
          </Text>
          <Text style={styles.disclaimerText}>
            • Consult SEBI-registered investment advisors for personalized recommendations
          </Text>
          <Text style={styles.disclaimerText}>
            • All investments carry risk of loss
          </Text>
        </View>
      </FadeInUp>

      {/* Target Return */}
      <FadeInUp delay={400}>
        <AnimatedCard style={styles.targetCard}>
          <Text style={styles.targetTitle}>🎯 Your Target</Text>
          <View style={styles.targetRow}>
            <View style={styles.targetItem}>
              <Text style={styles.targetLabel}>Personal Inflation</Text>
              <Text style={styles.targetValue}>{inflationData.personal}%</Text>
            </View>
            <Text style={styles.plusSign}>+</Text>
            <View style={styles.targetItem}>
              <Text style={styles.targetLabel}>Tax Buffer</Text>
              <Text style={styles.targetValue}>5%</Text>
            </View>
            <Text style={styles.equalsSign}>=</Text>
            <View style={styles.targetItem}>
              <Text style={styles.targetLabel}>Required Return</Text>
              <Text style={[styles.targetValue, { color: EnhancedFiColors.primary }]}>
                {inflationData.requiredReturn}%
              </Text>
            </View>
          </View>
        </AnimatedCard>
      </FadeInUp>

      {/* Investment Strategies */}
      <FadeInUp delay={600}>
        <Text style={styles.sectionTitle}>📈 Investment Strategies</Text>
      </FadeInUp>

      {Object.entries(investmentStrategies).map(([key, strategy], index) => (
        <FadeInUp key={key} delay={700 + (index * 100)}>
          <StrategyCard 
            strategyKey={key} 
            strategy={strategy}
            isRecommended={key === 'balanced'}
          />
        </FadeInUp>
      ))}

      {/* Action Buttons */}
      <FadeInUp delay={1000}>
        <View style={styles.actionSection}>
          <Text style={styles.actionTitle}>🚀 Next Steps</Text>
          
          <EnhancedButton
            title="Find SEBI Registered Advisors"
            variant="primary"
            size="large"
            icon="search"
            onPress={() => navigation.navigate('AdvisorDirectory')}
            style={styles.primaryButton}
          />

          <View style={styles.secondaryActions}>
            <EnhancedButton
              title="Learn More"
              variant="secondary"
              size="medium"
              icon="info"
              onPress={() => navigation.navigate('InvestmentEducation')}
              style={styles.secondaryButton}
            />
            <EnhancedButton
              title="Risk Assessment"
              variant="secondary"
              size="medium"
              icon="target"
              onPress={() => navigation.navigate('RiskAssessment')}
              style={styles.secondaryButton}
            />
          </View>
        </View>
      </FadeInUp>

      {/* Regulatory Footer */}
      <FadeInUp delay={1200}>
        <View style={styles.regulatoryFooter}>
          <Text style={styles.footerTitle}>⚖️ Regulatory Information</Text>
          <Text style={styles.footerText}>
            Investment advice should only be taken from SEBI-registered Investment Advisors. 
            This platform provides educational content only.
          </Text>
          <TouchableArea
            style={styles.footerLink}
            onPress={() => navigation.navigate('SEBICompliance')}
          >
            <Text style={styles.footerLinkText}>View SEBI Compliance Details →</Text>
          </TouchableArea>
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
  disclaimerCard: {
    backgroundColor: EnhancedFiColors.warning + '10',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: EnhancedFiColors.warning + '30',
  },
  disclaimerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sebiLogo: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  disclaimerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: EnhancedFiColors.text,
  },
  disclaimerText: {
    fontSize: 12,
    color: EnhancedFiColors.textSecondary,
    lineHeight: 16,
    marginBottom: 4,
  },
  targetCard: {
    backgroundColor: EnhancedFiColors.primary + '08',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: EnhancedFiColors.primary + '20',
  },
  targetTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: EnhancedFiColors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  targetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  targetItem: {
    alignItems: 'center',
    flex: 1,
  },
  targetLabel: {
    fontSize: 12,
    color: EnhancedFiColors.textSecondary,
    marginBottom: 4,
    textAlign: 'center',
  },
  targetValue: {
    fontSize: 20,
    fontWeight: '700',
    color: EnhancedFiColors.text,
  },
  plusSign: {
    fontSize: 18,
    color: EnhancedFiColors.textSecondary,
    marginHorizontal: 8,
  },
  equalsSign: {
    fontSize: 18,
    color: EnhancedFiColors.textSecondary,
    marginHorizontal: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: EnhancedFiColors.text,
    marginBottom: 16,
  },
  strategyCard: {
    backgroundColor: EnhancedFiColors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: EnhancedFiColors.border,
    position: 'relative',
  },
  selectedStrategy: {
    borderColor: EnhancedFiColors.primary,
    backgroundColor: EnhancedFiColors.primary + '05',
  },
  recommendedStrategy: {
    borderColor: EnhancedFiColors.success,
  },
  recommendedBadge: {
    position: 'absolute',
    top: -1,
    right: 16,
    backgroundColor: EnhancedFiColors.success,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    zIndex: 1,
  },
  recommendedText: {
    color: EnhancedFiColors.white,
    fontSize: 10,
    fontWeight: '600',
  },
  strategyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  strategyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: EnhancedFiColors.text,
  },
  riskBadge: {
    backgroundColor: EnhancedFiColors.secondary + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  riskText: {
    fontSize: 10,
    color: EnhancedFiColors.secondary,
    fontWeight: '600',
  },
  expectedReturn: {
    fontSize: 14,
    color: EnhancedFiColors.primary,
    fontWeight: '600',
    marginBottom: 16,
  },
  allocationSection: {
    marginBottom: 16,
  },
  allocationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: EnhancedFiColors.text,
    marginBottom: 12,
  },
  allocationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  assetName: {
    fontSize: 12,
    color: EnhancedFiColors.text,
    width: 80,
  },
  allocationBar: {
    flex: 1,
    marginHorizontal: 12,
  },
  assetPercentage: {
    fontSize: 12,
    color: EnhancedFiColors.textSecondary,
    width: 30,
    textAlign: 'right',
  },
  suitability: {
    fontSize: 12,
    color: EnhancedFiColors.textSecondary,
    lineHeight: 16,
  },
  suitabilityLabel: {
    fontWeight: '600',
    color: EnhancedFiColors.text,
  },
  actionSection: {
    marginTop: 24,
    marginBottom: 20,
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: EnhancedFiColors.text,
    marginBottom: 16,
  },
  primaryButton: {
    height: 56,
    marginBottom: 12,
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: 8,
  },
  secondaryButton: {
    flex: 1,
    height: 48,
  },
  regulatoryFooter: {
    backgroundColor: EnhancedFiColors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: EnhancedFiColors.border,
  },
  footerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: EnhancedFiColors.text,
    marginBottom: 8,
  },
  footerText: {
    fontSize: 12,
    color: EnhancedFiColors.textSecondary,
    lineHeight: 16,
    marginBottom: 8,
  },
  footerLink: {
    alignSelf: 'flex-start',
  },
  footerLinkText: {
    fontSize: 12,
    color: EnhancedFiColors.primary,
    fontWeight: '500',
  },
});

export default InvestmentRecommendationsScreen;
