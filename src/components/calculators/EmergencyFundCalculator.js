import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { FadeInUp } from '../animations/AnimatedCard';
import FinancialCalculators from '../../utils/FinancialCalculators';
import { FiColors } from '../../theme/consolidatedFiColors';

const EmergencyFundCalculator = ({ userProfile }) => {
  const [monthlyExpenses, setMonthlyExpenses] = useState(
    Math.round(userProfile.monthlyIncome * 0.7).toString()
  );
  const [targetMonths, setTargetMonths] = useState('6');
  const [result, setResult] = useState(null);

  const calculateEmergencyFund = () => {
    const expenses = parseInt(monthlyExpenses) || 0;
    const months = parseInt(targetMonths) || 6;
    
    const calculation = FinancialCalculators.calculateEmergencyFund(expenses, months);
    setResult(calculation);
  };

  const formatCurrency = (amount) => {
    return `₹${Math.round(amount).toLocaleString()}`;
  };

  return (
    <FadeInUp delay={100}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.icon}>🛡️</Text>
          <View>
            <Text style={styles.title}>Emergency Fund Calculator</Text>
            <Text style={styles.subtitle}>Calculate your safety net</Text>
          </View>
        </View>

        <View style={styles.inputSection}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Monthly Expenses</Text>
            <TextInput
              style={styles.input}
              value={monthlyExpenses}
              onChangeText={setMonthlyExpenses}
              keyboardType="numeric"
              placeholder="Enter monthly expenses"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Target Months</Text>
            <TextInput
              style={styles.input}
              value={targetMonths}
              onChangeText={setTargetMonths}
              keyboardType="numeric"
              placeholder="6"
            />
          </View>

          <TouchableOpacity style={styles.calculateButton} onPress={calculateEmergencyFund}>
            <Text style={styles.calculateButtonText}>Calculate</Text>
          </TouchableOpacity>
        </View>

        {result && (
          <View style={styles.resultSection}>
            <View style={styles.resultCard}>
              <Text style={styles.resultTitle}>Your Emergency Fund Target</Text>
              <Text style={styles.resultAmount}>
                {formatCurrency(result.targetAmount)}
              </Text>
              <Text style={styles.resultSubtext}>
                {result.targetMonths} months of expenses
              </Text>
            </View>

            <View style={styles.recommendationsSection}>
              <Text style={styles.recommendationsTitle}>💡 Recommendations</Text>
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
  recommendationsSection: {
    marginTop: 8,
  },
  recommendationsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: FiColors.text,
    marginBottom: 12,
  },
  recommendationItem: {
    fontSize: 14,
    color: FiColors.textSecondary,
    marginBottom: 6,
    lineHeight: 20,
  },
});

export default EmergencyFundCalculator;
