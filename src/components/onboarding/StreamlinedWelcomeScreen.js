import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { FiBrandColors, FiTypography } from '../../theme/fiBrandColors';
import { EnhancedButton } from '../common/EnhancedButtons';
import { AnimatedCard, FadeInUp, AnimatedNumber } from '../animations/AnimatedCard';
import { AccessibleHeading, TouchableArea } from '../common/AccessibilityHelpers';

const StreamlinedWelcomeScreen = ({ navigation }) => {
  const [showCompliance, setShowCompliance] = useState(false);

  const sampleData = {
    personal: 11.8,
    government: 6.5,
    city: 'Mumbai'
  };

  const ComplianceFooter = () => (
    <View style={styles.complianceFooter}>
      <View style={styles.complianceHeader}>
        <Text style={styles.complianceTitle}>
          🛡️ Safe, Secure & Compliant
        </Text>
        <TouchableArea
          style={styles.learnMoreButton}
          onPress={() => setShowCompliance(!showCompliance)}
        >
          <Text style={styles.learnMoreText}>
            Learn More {showCompliance ? '▼' : '▶'}
          </Text>
        </TouchableArea>
      </View>

      <Text style={styles.complianceSummary}>
        By proceeding, you agree to our privacy policy and legal compliance with RBI, SEBI & MOSPI guidelines.
      </Text>

      {showCompliance && (
        <FadeInUp delay={100}>
          <View style={styles.complianceDetails}>
            <View style={styles.complianceItem}>
              <Text style={styles.complianceIcon}>🏦</Text>
              <Text style={styles.complianceText}>
                <Text style={styles.bold}>RBI Compliant:</Text> Data processed in India, transparent calculations
              </Text>
            </View>
            <View style={styles.complianceItem}>
              <Text style={styles.complianceIcon}>📊</Text>
              <Text style={styles.complianceText}>
                <Text style={styles.bold}>MOSPI Data:</Text> Official government inflation data with proper attribution
              </Text>
            </View>
            <View style={styles.complianceItem}>
              <Text style={styles.complianceIcon}>⚖️</Text>
              <Text style={styles.complianceText}>
                <Text style={styles.bold}>SEBI Compliant:</Text> Educational content only, not investment advice
              </Text>
            </View>
            <View style={styles.complianceItem}>
              <Text style={styles.complianceIcon}>🔒</Text>
              <Text style={styles.complianceText}>
                <Text style={styles.bold}>Privacy:</Text> You control your data, delete anytime
              </Text>
            </View>
            
            <TouchableArea
              style={styles.fullDetailsLink}
              onPress={() => navigation.navigate('FullCompliance')}
            >
              <Text style={styles.fullDetailsText}>
                View Full Legal & Privacy Details →
              </Text>
            </TouchableArea>
          </View>
        </FadeInUp>
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <FadeInUp delay={0}>
        <View style={styles.header}>
          <AccessibleHeading level={1} style={styles.title}>
            What's YOUR real inflation rate? 🤔
          </AccessibleHeading>
          <Text style={styles.subtitle}>
            The government says 6.5%, but let's see what it actually is for you
          </Text>
        </View>
      </FadeInUp>

      {/* Sample Calculation */}
      <FadeInUp delay={200}>
        <AnimatedCard style={styles.sampleCard}>
          <View style={styles.sampleHeader}>
            <Text style={styles.sampleTitle}>Here's what we found for Raj in Mumbai</Text>
            <View style={styles.liveBadge}>
              <Text style={styles.liveBadgeText}>Live example</Text>
            </View>
          </View>

          <View style={styles.comparisonRow}>
            <View style={styles.rateBox}>
              <Text style={styles.rateLabel}>Raj's rate</Text>
              <AnimatedNumber 
                value={sampleData.personal}
                style={[styles.rateValue, { color: FiBrandColors.inflationHigh }]}
                suffix="%"
              />
            </View>
            <Text style={styles.vsText}>vs</Text>
            <View style={styles.rateBox}>
              <Text style={styles.rateLabel}>Government</Text>
              <AnimatedNumber 
                value={sampleData.government}
                style={[styles.rateValue, { color: FiBrandColors.secondary }]}
                suffix="%"
              />
            </View>
          </View>

          <View style={styles.impactBox}>
            <Text style={styles.impactText}>
              His ₹1,00,000 will need ₹11,800 extra next year! 😮
            </Text>
          </View>
        </AnimatedCard>
      </FadeInUp>

      {/* Benefits */}
      <FadeInUp delay={400}>
        <View style={styles.benefitsSection}>
          <Text style={styles.benefitsTitle}>Why should you care? 🤷‍♀️</Text>
          <View style={styles.benefit}>
            <Text style={styles.benefitEmoji}>💼</Text>
            <Text style={styles.benefitText}>Ask for the right salary hike (with data!)</Text>
          </View>
          <View style={styles.benefit}>
            <Text style={styles.benefitEmoji}>📈</Text>
            <Text style={styles.benefitText}>Pick investments that actually beat YOUR inflation</Text>
          </View>
          <View style={styles.benefit}>
            <Text style={styles.benefitEmoji}>🏙️</Text>
            <Text style={styles.benefitText}>Decide if moving cities makes financial sense</Text>
          </View>
        </View>
      </FadeInUp>

      {/* Streamlined Compliance Footer */}
      <FadeInUp delay={600}>
        <ComplianceFooter />
      </FadeInUp>

      {/* CTA */}
      <FadeInUp delay={800}>
        <View style={styles.ctaSection}>
          <EnhancedButton
            title="Show me my rate! 🚀"
            variant="primary"
            size="large"
            onPress={() => navigation.navigate('QuickSetup')}
            style={styles.primaryCTA}
          />
          
          <Text style={styles.ctaSubtext}>
            Takes 30 seconds • Free forever • No spam, promise! 🤝
          </Text>
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
  header: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 40,
  },
  title: {
    ...FiTypography.h1,
    color: FiBrandColors.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    ...FiTypography.body,
    color: FiBrandColors.textSecondary,
    textAlign: 'center',
  },
  sampleCard: {
    backgroundColor: FiBrandColors.surface,
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: FiBrandColors.primaryLight,
  },
  sampleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sampleTitle: {
    ...FiTypography.h3,
    color: FiBrandColors.text,
    flex: 1,
  },
  liveBadge: {
    backgroundColor: FiBrandColors.success,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  liveBadgeText: {
    ...FiTypography.caption,
    color: FiBrandColors.white,
  },
  comparisonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  rateBox: {
    alignItems: 'center',
    flex: 1,
  },
  rateLabel: {
    ...FiTypography.caption,
    color: FiBrandColors.textSecondary,
    marginBottom: 8,
  },
  rateValue: {
    fontSize: 36,
    fontWeight: '800',
  },
  vsText: {
    ...FiTypography.body,
    color: FiBrandColors.textSecondary,
    marginHorizontal: 20,
  },
  impactBox: {
    backgroundColor: FiBrandColors.warningLight + '30',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  impactText: {
    ...FiTypography.body,
    color: FiBrandColors.text,
    fontWeight: '600',
    textAlign: 'center',
  },
  benefitsSection: {
    marginBottom: 24,
  },
  benefitsTitle: {
    ...FiTypography.h3,
    color: FiBrandColors.text,
    marginBottom: 16,
  },
  benefit: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  benefitEmoji: {
    fontSize: 24,
    marginRight: 16,
  },
  benefitText: {
    ...FiTypography.body,
    color: FiBrandColors.text,
    flex: 1,
  },
  complianceFooter: {
    backgroundColor: FiBrandColors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: FiBrandColors.success + '30',
  },
  complianceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  complianceTitle: {
    ...FiTypography.body,
    color: FiBrandColors.text,
    fontWeight: '600',
  },
  learnMoreButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  learnMoreText: {
    ...FiTypography.bodySmall,
    color: FiBrandColors.primary,
    fontWeight: '600',
  },
  complianceSummary: {
    ...FiTypography.bodySmall,
    color: FiBrandColors.textSecondary,
    lineHeight: 18,
  },
  complianceDetails: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: FiBrandColors.border,
  },
  complianceItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  complianceIcon: {
    fontSize: 16,
    marginRight: 8,
    marginTop: 2,
  },
  complianceText: {
    ...FiTypography.bodySmall,
    color: FiBrandColors.textSecondary,
    flex: 1,
    lineHeight: 18,
  },
  bold: {
    fontWeight: '600',
    color: FiBrandColors.text,
  },
  fullDetailsLink: {
    alignSelf: 'flex-start',
    marginTop: 12,
  },
  fullDetailsText: {
    ...FiTypography.bodySmall,
    color: FiBrandColors.primary,
    fontWeight: '600',
  },
  ctaSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  primaryCTA: {
    width: '100%',
    height: 56,
    marginBottom: 12,
  },
  ctaSubtext: {
    ...FiTypography.caption,
    color: FiBrandColors.textSecondary,
    textAlign: 'center',
  },
});

export default StreamlinedWelcomeScreen;
