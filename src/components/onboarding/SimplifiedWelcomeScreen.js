import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { EnhancedFiColors } from '../../theme/enhancedColors';
import { EnhancedButton } from '../common/EnhancedButtons';
import { AnimatedCard, FadeInUp, AnimatedNumber } from '../animations/AnimatedCard';
import { AccessibleHeading, TouchableArea } from '../common/AccessibilityHelpers';

const SimplifiedWelcomeScreen = ({ navigation }) => {
  const [showSample, setShowSample] = useState(true);

  // Sample calculation to show immediate value
  const sampleData = {
    personal: 11.8,
    government: 6.5,
    city: 'Mumbai',
    impact: '₹1,00,000 → ₹1,11,800 next year'
  };

  const ComplianceToggle = () => {
    const [expanded, setExpanded] = useState(false);
    
    return (
      <View style={styles.complianceSection}>
        <TouchableArea
          style={styles.complianceToggle}
          onPress={() => setExpanded(!expanded)}
        >
          <Text style={styles.complianceTitle}>🛡️ Trusted & Secure</Text>
          <Text style={styles.expandIcon}>{expanded ? '▼' : '▶'}</Text>
        </TouchableArea>
        
        {expanded && (
          <FadeInUp delay={100}>
            <View style={styles.complianceDetails}>
              <Text style={styles.complianceItem}>🏦 RBI Guidelines Compliant</Text>
              <Text style={styles.complianceItem}>📊 Official MOSPI Data</Text>
              <Text style={styles.complianceItem}>🔒 Data Secure in India</Text>
              <Text style={styles.complianceItem}>⚖️ SEBI Investment Disclaimers</Text>
            </View>
          </FadeInUp>
        )}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Instant Value Hook */}
      <FadeInUp delay={0}>
        <View style={styles.header}>
          <AccessibleHeading level={1} style={styles.title}>
            Know Your REAL Inflation Rate
          </AccessibleHeading>
          <Text style={styles.subtitle}>
            Government says 6.5%, but yours could be different
          </Text>
        </View>
      </FadeInUp>

      {/* Sample Calculation - Immediate Value */}
      <FadeInUp delay={200}>
        <AnimatedCard style={styles.sampleCard}>
          <View style={styles.sampleHeader}>
            <Text style={styles.sampleTitle}>Sample: Mumbai Professional</Text>
            <Text style={styles.sampleBadge}>Live Example</Text>
          </View>

          <View style={styles.comparisonRow}>
            <View style={styles.rateBox}>
              <Text style={styles.rateLabel}>Personal Rate</Text>
              <AnimatedNumber 
                value={sampleData.personal}
                style={[styles.rateValue, { color: EnhancedFiColors.warning }]}
                suffix="%"
              />
            </View>
            <Text style={styles.vsText}>vs</Text>
            <View style={styles.rateBox}>
              <Text style={styles.rateLabel}>Government</Text>
              <AnimatedNumber 
                value={sampleData.government}
                style={[styles.rateValue, { color: EnhancedFiColors.secondary }]}
                suffix="%"
              />
            </View>
          </View>

          <View style={styles.impactBox}>
            <Text style={styles.impactLabel}>Real Impact:</Text>
            <Text style={styles.impactValue}>{sampleData.impact}</Text>
          </View>
        </AnimatedCard>
      </FadeInUp>

      {/* Value Propositions */}
      <FadeInUp delay={400}>
        <View style={styles.benefitsSection}>
          <Text style={styles.benefitsTitle}>Why This Matters:</Text>
          <View style={styles.benefit}>
            <Text style={styles.benefitEmoji}>💼</Text>
            <Text style={styles.benefitText}>Negotiate salary increases with data</Text>
          </View>
          <View style={styles.benefit}>
            <Text style={styles.benefitEmoji}>📈</Text>
            <Text style={styles.benefitText}>Choose investments that beat YOUR inflation</Text>
          </View>
          <View style={styles.benefit}>
            <Text style={styles.benefitEmoji}>🏙️</Text>
            <Text style={styles.benefitText}>Compare costs before relocating</Text>
          </View>
        </View>
      </FadeInUp>

      {/* Simplified Compliance */}
      <FadeInUp delay={600}>
        <ComplianceToggle />
      </FadeInUp>

      {/* Primary CTA */}
      <FadeInUp delay={800}>
        <View style={styles.ctaSection}>
          <EnhancedButton
            title="Calculate My Rate"
            variant="primary"
            size="large"
            icon="calculator"
            onPress={() => navigation.navigate('QuickSetup')}
            style={styles.primaryCTA}
          />
          
          <Text style={styles.ctaSubtext}>
            Takes 30 seconds • Free forever • No hidden charges
          </Text>
          
          <EnhancedButton
            title="Learn How It Works"
            variant="ghost"
            size="medium"
            onPress={() => navigation.navigate('EducationScreen')}
            style={styles.secondaryCTA}
          />
        </View>
      </FadeInUp>

      {/* Social Proof */}
      <FadeInUp delay={1000}>
        <View style={styles.socialProof}>
          <Text style={styles.socialProofText}>
            Join 50,000+ users who discovered their real inflation rate
          </Text>
          <View style={styles.trustIndicators}>
            <Text style={styles.trustItem}>⭐ 4.8/5 Rating</Text>
            <Text style={styles.trustItem}>🔒 Bank-Grade Security</Text>
            <Text style={styles.trustItem}>🏆 Featured in Economic Times</Text>
          </View>
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
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: EnhancedFiColors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: EnhancedFiColors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  sampleCard: {
    backgroundColor: EnhancedFiColors.surface,
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: EnhancedFiColors.primary + '30',
  },
  sampleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sampleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: EnhancedFiColors.text,
  },
  sampleBadge: {
    backgroundColor: EnhancedFiColors.success,
    color: EnhancedFiColors.white,
    fontSize: 10,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  comparisonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  rateBox: {
    alignItems: 'center',
    flex: 1,
  },
  rateLabel: {
    fontSize: 12,
    color: EnhancedFiColors.textSecondary,
    marginBottom: 8,
  },
  rateValue: {
    fontSize: 32,
    fontWeight: '700',
  },
  vsText: {
    fontSize: 16,
    color: EnhancedFiColors.textSecondary,
    marginHorizontal: 20,
  },
  impactBox: {
    backgroundColor: EnhancedFiColors.warning + '10',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  impactLabel: {
    fontSize: 14,
    color: EnhancedFiColors.textSecondary,
    marginBottom: 4,
  },
  impactValue: {
    fontSize: 16,
    fontWeight: '600',
    color: EnhancedFiColors.warning,
  },
  benefitsSection: {
    marginBottom: 24,
  },
  benefitsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: EnhancedFiColors.text,
    marginBottom: 16,
  },
  benefit: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  benefitEmoji: {
    fontSize: 20,
    marginRight: 12,
  },
  benefitText: {
    fontSize: 16,
    color: EnhancedFiColors.text,
    flex: 1,
  },
  complianceSection: {
    backgroundColor: EnhancedFiColors.surface,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: EnhancedFiColors.border,
  },
  complianceToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  complianceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: EnhancedFiColors.text,
  },
  expandIcon: {
    fontSize: 14,
    color: EnhancedFiColors.primary,
    fontWeight: '600',
  },
  complianceDetails: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: EnhancedFiColors.border,
  },
  complianceItem: {
    fontSize: 14,
    color: EnhancedFiColors.textSecondary,
    marginBottom: 8,
  },
  ctaSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  primaryCTA: {
    width: '100%',
    height: 56,
    marginBottom: 12,
  },
  ctaSubtext: {
    fontSize: 12,
    color: EnhancedFiColors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  secondaryCTA: {
    width: '60%',
    height: 44,
  },
  socialProof: {
    alignItems: 'center',
    marginBottom: 40,
  },
  socialProofText: {
    fontSize: 14,
    color: EnhancedFiColors.textSecondary,
    textAlign: 'center',
    marginBottom: 12,
  },
  trustIndicators: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
  },
  trustItem: {
    fontSize: 12,
    color: EnhancedFiColors.success,
    fontWeight: '500',
  },
});

export default SimplifiedWelcomeScreen;
