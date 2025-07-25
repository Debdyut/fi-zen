import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { FadeInUp } from '../animations/AnimatedCard';
import FinancialCalculators from '../../utils/FinancialCalculators';
import { FiColors } from '../../theme/consolidatedFiColors';

const SIPCalculator = ({ userProfile }) => {
  const [targetAmount, setTargetAmount] = useState('1000000');
  const [timeframe, setTimeframe] = useState('5');
  const [expectedReturn, setExpectedReturn] = useState('12');
  const [result, setResult] = useState(null);

  const calculateSIP = () => {
    const target = parseInt(targetAmount) || 0;
    const years = parseInt(timeframe) || 5;
    const returns = parseFloat(expectedReturn) || 12;
    
    const calculation = FinancialCalculators.calculateSIP(target, years, returns);
    setResult(calculation);
  };

  const formatCurrency = (amount) => {
    return `₹${Math.round(amount).toLocaleString()}`;
  };

  return (
    <FadeInUp delay={150}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.icon}>📈</Text>
          <View>
            <Text style={styles.title}>SIP Calculator</Text>
            <Text style={styles.subtitle}>Plan your investment goals</Text>
          </View>
        </View>

        <View style={styles.inputSection}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Target Amount</Text>
            <TextInput
              style={styles.input}
              value={targetAmount}
              onChangeText={setTargetAmount}
              keyboardType="numeric"
              placeholder="Enter target amount"
            />
          </View>

          <View style={styles.inputRow}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.inputLabel}>Years</Text>
              <TextInput
                style={styles.input}
                value={timeframe}
                onChangeText={setTimeframe}
                keyboardType="numeric"
                placeholder="5"
              />
            </View>

            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.inputLabel}>Expected Return (%)</Text>
              <TextInput
                style={styles.input}
                value={expectedReturn}
                onChangeText={setExpectedReturn}
                keyboardType="numeric"
                placeholder="12"
              />
            </View>
          </View>

          <TouchableOpacity style={styles.calculateButton} onPress={calculateSIP}>
            <Text style={styles.calculateButtonText}>Calculate SIP</Text>
          </TouchableOpacity>
        </View>

        {result && (
          <View style={styles.resultSection}>
            <View style={styles.resultCard}>
              <Text style={styles.resultTitle}>Monthly SIP Required</Text>
              <Text style={styles.resultAmount}>
                {formatCurrency(result.monthlySIP)}
              </Text>
              <Text style={styles.resultSubtext}>
                per month for {result.timeframe} years
              </Text>
            </View>

            <View style={styles.breakdownSection}>
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>Total Investment:</Text>
                <Text style={styles.breakdownValue}>
                  {formatCurrency(result.totalInvestment)}
                </Text>
              </View>
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>Expected Returns:</Text>
                <Text style={[styles.breakdownValue, { color: FiColors.success }]}>
                  {formatCurrency(result.totalReturns)}
                </Text>
              </View>
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>Target Amount:</Text>
                <Text style={[styles.breakdownValue, { fontWeight: '700' }]}>
                  {formatCurrency(result.targetAmount)}
                </Text>
              </View>
            </View>

            <View style={styles.affordabilitySection}>
              <Text style={styles.affordabilityTitle}>💰 Affordability Check</Text>
              <Text style={styles.affordabilityText}>
                SIP is {((result.monthlySIP / userProfile.monthlyIncome) * 100).toFixed(1)}% of your monthly income
              </Text>
              {(result.monthlySIP / userProfile.monthlyIncome) > 0.2 ? (
                <Text style={[styles.affordabilityWarning, { color: FiColors.warning }]}>
                  ⚠️ Consider reducing target or extending timeframe
                </Text>
              ) : (
                <Text style={[styles.affordabilitySuccess, { color: FiColors.success }]}>
                  ✅ Affordable based on your income
                </Text>
              )}
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
    backgroundColor: '#F0FDFA',
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
    color: FiColors.primary,
    marginBottom: 4,
  },
  resultSubtext: {
    fontSize: 12,
    color: FiColors.textSecondary,
  },
  breakdownSection: {
    marginBottom: 16,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  breakdownLabel: {
    fontSize: 14,
    color: FiColors.textSecondary,
  },
  breakdownValue: {
    fontSize: 14,
    fontWeight: '600',
    color: FiColors.text,
  },
  affordabilitySection: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
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
});

export default SIPCalculator;
