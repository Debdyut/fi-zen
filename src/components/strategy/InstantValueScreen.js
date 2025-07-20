import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FiBrandColors, FiTypography } from '../../theme/fiBrandColors';
import { AnimatedCard, AnimatedNumber, FadeInUp } from '../animations/AnimatedCard';
import { EnhancedButton } from '../common/EnhancedButtons';
import { CountUpNumber } from '../common/MicroInteractions';

const InstantValueScreen = ({ navigation }) => {
  const [showValue, setShowValue] = useState(false);

  useEffect(() => {
    // Show instant value within 2 seconds
    const timer = setTimeout(() => {
      setShowValue(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Instant sample calculation - no waiting
  const instantSample = {
    personal: 11.8,
    government: 6.5,
    impact: 11800,
    city: 'Mumbai'
  };

  return (
    <View style={styles.container}>
      <FadeInUp delay={0}>
        <Text style={styles.title}>Your inflation in 30 seconds ⚡</Text>
      </FadeInUp>

      {/* Instant Sample - Shows immediately */}
      <FadeInUp delay={200}>
        <AnimatedCard style={styles.instantCard}>
          <Text style={styles.sampleTitle}>Live Example: Mumbai Professional</Text>
          
          <View style={styles.instantComparison}>
            <View style={styles.rateBox}>
              <Text style={styles.rateLabel}>Personal Rate</Text>
              {showValue ? (
                <CountUpNumber
                  value={instantSample.personal}
                  suffix="%"
                  style={styles.rateValue}
                  duration={1500}
                />
              ) : (
                <Text style={styles.rateValue}>---%</Text>
              )}
            </View>
            
            <Text style={styles.vsText}>vs</Text>
            
            <View style={styles.rateBox}>
              <Text style={styles.rateLabel}>Government</Text>
              {showValue ? (
                <CountUpNumber
                  value={instantSample.government}
                  suffix="%"
                  style={[styles.rateValue, { color: FiBrandColors.secondary }]}
                  duration={1500}
                />
              ) : (
                <Text style={[styles.rateValue, { color: FiBrandColors.secondary }]}>---%</Text>
              )}
            </View>
          </View>

          {showValue && (
            <FadeInUp delay={500}>
              <View style={styles.impactBox}>
                <Text style={styles.impactLabel}>Extra money needed next year:</Text>
                <CountUpNumber
                  value={instantSample.impact}
                  prefix="₹"
                  style={styles.impactValue}
                  duration={2000}
                />
                <Text style={styles.impactNote}>on every ₹1,00,000 today</Text>
              </View>
            </FadeInUp>
          )}
        </AnimatedCard>
      </FadeInUp>

      {/* Instant Value Proposition */}
      {showValue && (
        <FadeInUp delay={700}>
          <View style={styles.valueProps}>
            <Text style={styles.valueTitle}>🎯 Instant Insights</Text>
            <Text style={styles.valueProp}>✅ Know your real rate in 30 seconds</Text>
            <Text style={styles.valueProp}>✅ Get salary negotiation data immediately</Text>
            <Text style={styles.valueProp}>✅ Find inflation-beating investments now</Text>
          </View>
        </FadeInUp>
      )}

      {/* One-Tap Connection */}
      <FadeInUp delay={900}>
        <View style={styles.quickConnect}>
          <Text style={styles.connectTitle}>🚀 Get YOUR rate instantly</Text>
          
          <EnhancedButton
            title="Connect Fi Account (1-tap)"
            variant="primary"
            size="large"
            onPress={() => navigation.navigate('InstantCalculation')}
            style={styles.connectButton}
          />
          
          <Text style={styles.connectNote}>
            15 seconds • No manual entry • Instant results
          </Text>
        </View>
      </FadeInUp>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: FiBrandColors.background,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    ...FiTypography.h1,
    color: FiBrandColors.text,
    textAlign: 'center',
    marginBottom: 32,
  },
  instantCard: {
    backgroundColor: FiBrandColors.surface,
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: FiBrandColors.success + '40',
  },
  sampleTitle: {
    ...FiTypography.body,
    color: FiBrandColors.text,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
  },
  instantComparison: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  impactLabel: {
    ...FiTypography.bodySmall,
    color: FiBrandColors.textSecondary,
    marginBottom: 8,
  },
  impactValue: {
    fontSize: 28,
    fontWeight: '800',
    color: FiBrandColors.error,
    marginBottom: 4,
  },
  impactNote: {
    ...FiTypography.caption,
    color: FiBrandColors.textSecondary,
  },
  valueProps: {
    backgroundColor: FiBrandColors.success + '10',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  valueTitle: {
    ...FiTypography.body,
    color: FiBrandColors.text,
    fontWeight: '600',
    marginBottom: 12,
  },
  valueProp: {
    ...FiTypography.bodySmall,
    color: FiBrandColors.success,
    marginBottom: 4,
    fontWeight: '500',
  },
  quickConnect: {
    alignItems: 'center',
  },
  connectTitle: {
    ...FiTypography.body,
    color: FiBrandColors.text,
    fontWeight: '600',
    marginBottom: 16,
  },
  connectButton: {
    width: '100%',
    height: 56,
    marginBottom: 8,
  },
  connectNote: {
    ...FiTypography.caption,
    color: FiBrandColors.textSecondary,
    textAlign: 'center',
  },
});

export default InstantValueScreen;
