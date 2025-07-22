import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { FadeInUp } from '../animations/AnimatedCard';
import FinancialCalculators from '../../utils/FinancialCalculators';

const FiColors = {
  surface: '#FFFFFF',
  primary: '#00D4AA',
  text: '#1A1A1A',
  textSecondary: '#666666',
  success: '#00D4AA',
  warning: '#FFB800',
  error: '#FF6B6B',
  border: '#E0E0E0',
};

const HomeLoanCalculator = ({ userProfile }) => {
  const [existingEMIs, setExistingEMIs] = useState('0');
  const [interestRate, setInterestRate] = useState('8.5');
  const [tenure, setTenure] = useState('20');
  const [result, setResult] = useState(null);

  const calculateHomeLoan = () => {
    const emis = parseInt(existingEMIs) || 0;
    const rate = parseFloat(interestRate) || 8.5;
    const years = parseInt(tenure) || 20;
    
    const calculation = FinancialCalculators.calculateHomeLoanAffordability(
      userProfile.monthlyIncome, emis, rate, years
    );
    setResult(calculation);
  };

  const formatCurrency = (amount) => {
    return `₹${Math.round(amount).toLocaleString()}`;
  };

  const formatLakhs = (amount) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)} Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)} L`;
    }
    return formatCurrency(amount);
  };

  return (
    <FadeInUp delay={250}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.icon}>🏠</Text>
          <View>
            <Text style={styles.title}>Home Loan Calculator</Text>
            <Text style={styles.subtitle}>Check your buying power</Text>
          </View>
        </View>

        <View style={styles.inputSection}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Existing EMIs</Text>
            <TextInput
              style={styles.input}
              value={existingEMIs}
              onChangeText={setExistingEMIs}
              keyboardType="numeric"
              placeholder="Enter existing EMIs"
            />
          </View>

          <View style={styles.inputRow}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.inputLabel}>Interest Rate (%)</Text>
              <TextInput
                style={styles.input}
                value={interestRate}
                onChangeText={setInterestRate}
                keyboardType="numeric"
                placeholder="8.5"
              />
            </View>

            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.inputLabel}>Tenure (Years)</Text>
              <TextInput
                style={styles.input}
                value={tenure}
                onChangeText={setTenure}
                keyboardType="numeric"
                placeholder="20"
              />
            </View>
          </View>

          <TouchableOpacity style={styles.calculateButton} onPress={calculateHomeLoan}>
            <Text style={styles.calculateButtonText}>Check Affordability</Text>
          </TouchableOpacity>
        </View>

        {result && (
          <View style={styles.resultSection}>
            {result.maxLoanAmount > 0 ? (
              <>
                <View style={styles.resultCard}>
                  <Text style={styles.resultTitle}>Affordable Property Price</Text>
                  <Text style={styles.resultAmount}>
                    {formatLakhs(result.affordablePropertyPrice)}
                  </Text>
                  <Text style={styles.resultSubtext}>
                    with 20% down payment
                  </Text>
                </View>

                <View style={styles.detailsSection}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Maximum Loan Amount:</Text>
                    <Text style={styles.detailValue}>
                      {formatLakhs(result.maxLoanAmount)}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Maximum EMI:</Text>
                    <Text style={styles.detailValue}>
                      {formatCurrency(result.maxEMI)}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Down Payment Needed:</Text>
                    <Text style={[styles.detailValue, { color: FiColors.warning }]}>
                      {formatLakhs(result.downPaymentNeeded)}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Monthly Income:</Text>
                    <Text style={styles.detailValue}>
                      {formatCurrency(result.monthlyIncome)}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Existing EMIs:</Text>
                    <Text style={styles.detailValue}>
                      {formatCurrency(result.existingEMIs)}
                    </Text>
                  </View>
                </View>

                <View style={styles.affordabilitySection}>
                  <Text style={styles.affordabilityTitle}>💡 Affordability Analysis</Text>
                  <Text style={styles.affordabilityText}>
                    EMI will be {((result.maxEMI / result.monthlyIncome) * 100).toFixed(1)}% of your income
                  </Text>
                  {result.maxLoanAmount >= 5000000 ? (
                    <Text style={[styles.affordabilitySuccess, { color: FiColors.success }]}>
                      ✅ Excellent affordability for premium properties
                    </Text>
                  ) : result.maxLoanAmount >= 2000000 ? (
                    <Text style={[styles.affordabilitySuccess, { color: FiColors.success }]}>
                      ✅ Good affordability for mid-range properties
                    </Text>
                  ) : (
                    <Text style={[styles.affordabilityWarning, { color: FiColors.warning }]}>
                      ⚠️ Limited affordability - consider increasing income
                    </Text>
                  )}
                </View>
              </>
            ) : (
              <View style={styles.noAffordabilityCard}>
                <Text style={styles.noAffordabilityIcon}>⚠️</Text>
                <Text style={styles.noAffordabilityTitle}>No Home Loan Eligibility</Text>
                <Text style={styles.noAffordabilityText}>
                  Your existing EMIs are too high relative to your income
                </Text>
              </View>
            )}

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
    backgroundColor: '#EFF6FF',
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
    color: '#2563EB',
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
  noAffordabilityCard: {
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  noAffordabilityIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  noAffordabilityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: FiColors.error,
    marginBottom: 8,
  },
  noAffordabilityText: {
    fontSize: 14,
    color: FiColors.textSecondary,
    textAlign: 'center',
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

export default HomeLoanCalculator;
