import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { FiBrandColors, FiTypography } from '../../theme/fiBrandColors';
import { AnimatedCard, FadeInUp } from '../animations/AnimatedCard';
import { EnhancedButton } from '../common/EnhancedButtons';
import { CountUpNumber } from '../common/MicroInteractions';

const SalaryNegotiationCalculator = ({ inflationData }) => {
  const [currentSalary, setCurrentSalary] = useState('');
  const [lastRaise, setLastRaise] = useState('');
  const [showResults, setShowResults] = useState(false);

  const calculateNegotiationData = () => {
    const salary = parseFloat(currentSalary) || 0;
    const lastRaisePercent = parseFloat(lastRaise) || 0;
    
    const inflationAdjustedSalary = salary * (1 + inflationData.personal / 100);
    const realSalaryLoss = inflationAdjustedSalary - salary;
    const requiredRaise = inflationData.personal;
    const newSalary = salary * (1 + requiredRaise / 100);
    
    return {
      currentSalary: salary,
      inflationAdjustedSalary,
      realSalaryLoss,
      requiredRaise,
      newSalary,
      lastRaiseGap: requiredRaise - lastRaisePercent
    };
  };

  const handleCalculate = () => {
    setShowResults(true);
  };

  const results = showResults ? calculateNegotiationData() : null;

  return (
    <View style={styles.container}>
      <FadeInUp delay={0}>
        <Text style={styles.title}>💼 Salary Negotiation Calculator</Text>
        <Text style={styles.subtitle}>
          Build a data-backed case for your next raise
        </Text>
      </FadeInUp>

      <FadeInUp delay={200}>
        <AnimatedCard style={styles.inputCard}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Current Annual Salary (₹)</Text>
            <TextInput
              style={styles.input}
              value={currentSalary}
              onChangeText={setCurrentSalary}
              placeholder="e.g., 1200000"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Last Raise Percentage (%)</Text>
            <TextInput
              style={styles.input}
              value={lastRaise}
              onChangeText={setLastRaise}
              placeholder="e.g., 8"
              keyboardType="numeric"
            />
          </View>

          <EnhancedButton
            title="Calculate My Case"
            variant="primary"
            size="large"
            onPress={handleCalculate}
            style={styles.calculateButton}
          />
        </AnimatedCard>
      </FadeInUp>

      {showResults && results && (
        <FadeInUp delay={400}>
          <AnimatedCard style={styles.resultsCard}>
            <Text style={styles.resultsTitle}>📊 Your Negotiation Data</Text>
            
            <View style={styles.resultItem}>
              <Text style={styles.resultLabel}>Real salary loss due to inflation:</Text>
              <CountUpNumber
                value={results.realSalaryLoss}
                prefix="₹"
                style={[styles.resultValue, { color: FiBrandColors.error }]}
              />
            </View>

            <View style={styles.resultItem}>
              <Text style={styles.resultLabel}>Required raise to maintain purchasing power:</Text>
              <CountUpNumber
                value={results.requiredRaise}
                suffix="%"
                style={[styles.resultValue, { color: FiBrandColors.primary }]}
              />
            </View>

            <View style={styles.resultItem}>
              <Text style={styles.resultLabel}>Your salary should be:</Text>
              <CountUpNumber
                value={results.newSalary}
                prefix="₹"
                style={[styles.resultValue, { color: FiBrandColors.success }]}
              />
            </View>

            {results.lastRaiseGap > 0 && (
              <View style={styles.gapAlert}>
                <Text style={styles.gapText}>
                  ⚠️ Your last raise was {results.lastRaiseGap.toFixed(1)}% below inflation!
                </Text>
              </View>
            )}
          </AnimatedCard>
        </FadeInUp>
      )}

      {showResults && (
        <FadeInUp delay={600}>
          <AnimatedCard style={styles.scriptCard}>
            <Text style={styles.scriptTitle}>💬 Negotiation Script</Text>
            <Text style={styles.scriptText}>
              "Based on my personal inflation analysis, my purchasing power has decreased by ₹{results?.realSalaryLoss.toLocaleString()} this year. 
              To maintain the same standard of living, I need a {results?.requiredRaise.toFixed(1)}% increase, 
              bringing my salary to ₹{results?.newSalary.toLocaleString()}."
            </Text>
          </AnimatedCard>
        </FadeInUp>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    ...FiTypography.h2,
    color: FiBrandColors.text,
    marginBottom: 4,
  },
  subtitle: {
    ...FiTypography.bodySmall,
    color: FiBrandColors.textSecondary,
    marginBottom: 20,
  },
  inputCard: {
    backgroundColor: FiBrandColors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    ...FiTypography.bodySmall,
    color: FiBrandColors.text,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: FiBrandColors.border,
    borderRadius: 8,
    padding: 12,
    ...FiTypography.body,
    color: FiBrandColors.text,
    backgroundColor: FiBrandColors.background,
  },
  calculateButton: {
    height: 48,
    marginTop: 8,
  },
  resultsCard: {
    backgroundColor: FiBrandColors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: FiBrandColors.primary + '40',
  },
  resultsTitle: {
    ...FiTypography.body,
    color: FiBrandColors.text,
    fontWeight: '600',
    marginBottom: 16,
  },
  resultItem: {
    marginBottom: 12,
  },
  resultLabel: {
    ...FiTypography.bodySmall,
    color: FiBrandColors.textSecondary,
    marginBottom: 4,
  },
  resultValue: {
    ...FiTypography.h3,
    fontWeight: '700',
  },
  gapAlert: {
    backgroundColor: FiBrandColors.warning + '20',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  gapText: {
    ...FiTypography.bodySmall,
    color: FiBrandColors.warning,
    fontWeight: '600',
  },
  scriptCard: {
    backgroundColor: FiBrandColors.successLight + '20',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: FiBrandColors.success + '40',
  },
  scriptTitle: {
    ...FiTypography.body,
    color: FiBrandColors.success,
    fontWeight: '600',
    marginBottom: 12,
  },
  scriptText: {
    ...FiTypography.bodySmall,
    color: FiBrandColors.textSecondary,
    lineHeight: 20,
    fontStyle: 'italic',
  },
});

export default SalaryNegotiationCalculator;
