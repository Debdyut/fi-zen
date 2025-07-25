import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { FadeInUp } from '../animations/AnimatedCard';
import FinancialCalculators from '../../utils/FinancialCalculators';

import { FiColors } from '../../theme/consolidatedFiColors';

const RetirementCalculator = ({ userProfile }) => {
  const [currentAge, setCurrentAge] = useState('30');
  const [retirementAge, setRetirementAge] = useState('60');
  const [currentSavings, setCurrentSavings] = useState('500000');
  const [result, setResult] = useState(null);

  const calculateRetirement = () => {
    const age = parseInt(currentAge) || 30;
    const retAge = parseInt(retirementAge) || 60;
    const savings = parseInt(currentSavings) || 0;
    
    const calculation = FinancialCalculators.calculateRetirement(
      age, retAge, savings, userProfile.monthlyIncome
    );
    setResult(calculation);
  };

  const formatCurrency = (amount) => {
    return `₹${Math.round(amount).toLocaleString()}`;
  };

  const formatCrores = (amount) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)} Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)} L`;
    }
    return formatCurrency(amount);
  };

  return (
    <FadeInUp delay={200}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.icon}>🏖️</Text>
          <View>
            <Text style={styles.title}>Retirement Calculator</Text>
            <Text style={styles.subtitle}>Plan for your golden years</Text>
          </View>
        </View>

        <View style={styles.inputSection}>
          <View style={styles.inputRow}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.inputLabel}>Current Age</Text>
              <TextInput
                style={styles.input}
                value={currentAge}
                onChangeText={setCurrentAge}
                keyboardType="numeric"
                placeholder="30"
              />
            </View>

            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.inputLabel}>Retirement Age</Text>
              <TextInput
                style={styles.input}
                value={retirementAge}
                onChangeText={setRetirementAge}
                keyboardType="numeric"
                placeholder="60"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Current Savings</Text>
            <TextInput
              style={styles.input}
              value={currentSavings}
              onChangeText={setCurrentSavings}
              keyboardType="numeric"
              placeholder="Enter current savings"
            />
          </View>

          <TouchableOpacity style={styles.calculateButton} onPress={calculateRetirement}>
            <Text style={styles.calculateButtonText}>Calculate Retirement</Text>
          </TouchableOpacity>
        </View>

        {result && (
          <View style={styles.resultSection}>
            <View style={styles.resultCard}>
              <Text style={styles.resultTitle}>Monthly SIP Required</Text>
              <Text style={styles.resultAmount}>
                {formatCurrency(result.requiredMonthlySIP)}
              </Text>
              <Text style={styles.resultSubtext}>
                for next {result.yearsToRetirement} years
              </Text>
            </View>

            <View style={styles.detailsSection}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Required Corpus:</Text>
                <Text style={styles.detailValue}>
                  {formatCrores(result.requiredCorpus)}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Current Savings:</Text>
                <Text style={styles.detailValue}>
                  {formatCrores(result.currentSavings)}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Additional Needed:</Text>
                <Text style={[styles.detailValue, { color: FiColors.warning }]}>
                  {formatCrores(result.additionalCorpusNeeded)}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Future Annual Expenses:</Text>
                <Text style={styles.detailValue}>
                  {formatCrores(result.futureAnnualExpenses)}
                </Text>
              </View>
            </View>

            <View style={styles.affordabilitySection}>
              <Text style={styles.affordabilityTitle}>💡 Assessment</Text>
              <Text style={styles.affordabilityText}>
                Required SIP is {((result.requiredMonthlySIP / userProfile.monthlyIncome) * 100).toFixed(1)}% of your income
              </Text>
              {(result.requiredMonthlySIP / userProfile.monthlyIncome) > 0.3 ? (
                <Text style={[styles.affordabilityWarning, { color: FiColors.error }]}>
                  ⚠️ Very high commitment - consider extending retirement age
                </Text>
              ) : (result.requiredMonthlySIP / userProfile.monthlyIncome) > 0.2 ? (
                <Text style={[styles.affordabilityWarning, { color: FiColors.warning }]}>
                  ⚠️ Significant commitment - start gradually
                </Text>
              ) : (
                <Text style={[styles.affordabilitySuccess, { color: FiColors.success }]}>
                  ✅ Achievable target - start immediately
                </Text>
              )}
            </View>

            <View style={styles.recommendationsSection}>
              <Text style={styles.recommendationsTitle}>📋 Recommendations</Text>
              {result.recommendations.map((rec, index) => (
                <Text key={index} style={styles.recommendationItem}>
                  • {rec}
                </Text>
              ))}
            </View>
          </View>
        )}
      </View>
    </FadeInUp>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: FiColors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  icon: {
    fontSize: 24,
    marginRight: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: FiColors.text,
  },
  subtitle: {
    fontSize: 14,
    color: FiColors.textSecondary,
  },
  inputSection: {
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: FiColors.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: FiColors.border,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: FiColors.text,
  },
  calculateButton: {
    backgroundColor: FiColors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  calculateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  resultSection: {
    borderTopWidth: 1,
    borderTopColor: FiColors.border + '30',
    paddingTop: 20,
  },
  resultCard: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 14,
    color: FiColors.textSecondary,
    marginBottom: 8,
  },
  resultAmount: {
    fontSize: 28,
    fontWeight: '700',
    color: '#D97706',
    marginBottom: 4,
  },
  resultSubtext: {
    fontSize: 12,
    color: FiColors.textSecondary,
  },
  detailsSection: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: FiColors.textSecondary,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: FiColors.text,
  },
  affordabilitySection: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  affordabilityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: FiColors.text,
    marginBottom: 8,
  },
  affordabilityText: {
    fontSize: 13,
    color: FiColors.textSecondary,
    marginBottom: 4,
  },
  affordabilityWarning: {
    fontSize: 13,
    fontWeight: '500',
  },
  affordabilitySuccess: {
    fontSize: 13,
    fontWeight: '500',
  },
  recommendationsSection: {
    marginTop: 8,
  },
  recommendationsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: FiColors.text,
    marginBottom: 8,
  },
  recommendationItem: {
    fontSize: 13,
    color: FiColors.textSecondary,
    marginBottom: 4,
    lineHeight: 18,
  },
});

export default RetirementCalculator;
