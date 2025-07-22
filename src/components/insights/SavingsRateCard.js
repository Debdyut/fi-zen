import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { FadeInUp } from '../animations/AnimatedCard';

const FiColors = {
  background: '#1A1A1A',
  surface: '#FFFFFF',
  primary: '#00D4AA',
  text: '#1A1A1A',
  textSecondary: '#666666',
  success: '#00D4AA',
  warning: '#FFB800',
  error: '#FF6B6B',
  border: '#E0E0E0',
};

const SavingsRateCard = ({ savingsRate, monthlyIncome, userProfile }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  // Determine savings rate quality and messaging
  const getSavingsRateInsight = (rate, income) => {
    if (rate >= 30) {
      return {
        color: FiColors.success,
        status: 'Excellent',
        message: 'You\'re saving exceptionally well! This puts you in the top 10% of savers.',
        icon: '🌟'
      };
    } else if (rate >= 20) {
      return {
        color: FiColors.success,
        status: 'Great',
        message: 'You\'re on track! Financial experts recommend saving 20-30% of income.',
        icon: '✅'
      };
    } else if (rate >= 10) {
      return {
        color: FiColors.warning,
        status: 'Good Start',
        message: 'You\'re building good habits. Try to gradually increase to 20%.',
        icon: '📈'
      };
    } else if (rate >= 5) {
      return {
        color: FiColors.warning,
        status: 'Needs Improvement',
        message: 'Start small - even ₹1000 more per month makes a difference.',
        icon: '💪'
      };
    } else {
      return {
        color: FiColors.error,
        status: 'Action Needed',
        message: 'Let\'s build an emergency fund first - start with ₹500/month.',
        icon: '🎯'
      };
    }
  };

  // Get income-specific context
  const getIncomeContext = (income) => {
    if (income > 150000) {
      return 'High earners like you typically save 25-35%';
    } else if (income > 80000) {
      return 'People in your income range usually save 15-25%';
    } else {
      return 'Building savings gradually is key at your income level';
    }
  };

  const insight = getSavingsRateInsight(savingsRate, monthlyIncome);
  const incomeContext = getIncomeContext(monthlyIncome);

  return (
    <FadeInUp delay={100}>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardIcon}>{insight.icon}</Text>
          <View style={styles.cardTitleContainer}>
            <View style={styles.titleRow}>
              <Text style={styles.cardTitle}>Your Savings Rate</Text>
              <TouchableOpacity 
                onPress={() => setShowTooltip(true)}
                style={styles.helpButton}
              >
                <Text style={styles.helpIcon}>ℹ️</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.cardDescription}>How much you save each month</Text>
          </View>
        </View>
        
        <View style={styles.cardContent}>
          <View style={styles.mainMetric}>
            <Text style={[styles.cardValue, { color: insight.color }]}>
              {savingsRate}%
            </Text>
            <Text style={[styles.statusText, { color: insight.color }]}>
              {insight.status}
            </Text>
          </View>
          
          <Text style={styles.insightMessage}>{insight.message}</Text>
          <Text style={styles.contextText}>{incomeContext}</Text>
        </View>

        {/* Tooltip Modal */}
        <Modal
          visible={showTooltip}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowTooltip(false)}
        >
          <TouchableOpacity 
            style={styles.modalOverlay}
            onPress={() => setShowTooltip(false)}
          >
            <View style={styles.tooltipContainer}>
              <View style={styles.tooltipHeader}>
                <Text style={styles.tooltipTitle}>Savings Rate Explained</Text>
                <TouchableOpacity 
                  onPress={() => setShowTooltip(false)}
                  style={styles.closeButton}
                >
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.tooltipText}>
                Your savings rate is the percentage of your income that you save each month.
              </Text>
              <Text style={styles.tooltipText}>
                <Text style={styles.tooltipBold}>Formula:</Text> (Monthly Savings ÷ Monthly Income) × 100
              </Text>
              <Text style={styles.tooltipText}>
                <Text style={styles.tooltipBold}>Benchmarks:</Text>
              </Text>
              <Text style={styles.benchmarkText}>• 30%+ = Excellent (Top 10%)</Text>
              <Text style={styles.benchmarkText}>• 20-30% = Great (Recommended)</Text>
              <Text style={styles.benchmarkText}>• 10-20% = Good start</Text>
              <Text style={styles.benchmarkText}>• 5-10% = Needs improvement</Text>
              <Text style={styles.benchmarkText}>• &lt;5% = Action needed</Text>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    </FadeInUp>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: FiColors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  cardIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  cardTitleContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: FiColors.text,
    marginBottom: 4,
  },
  helpButton: {
    padding: 4,
  },
  helpIcon: {
    fontSize: 16,
    color: FiColors.primary,
  },
  cardDescription: {
    fontSize: 14,
    color: FiColors.textSecondary,
  },
  cardContent: {
    alignItems: 'flex-start',
  },
  mainMetric: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  cardValue: {
    fontSize: 32,
    fontWeight: '700',
    marginRight: 12,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
  },
  insightMessage: {
    fontSize: 14,
    color: FiColors.text,
    lineHeight: 20,
    marginBottom: 8,
  },
  contextText: {
    fontSize: 12,
    color: FiColors.textSecondary,
    fontStyle: 'italic',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  tooltipContainer: {
    backgroundColor: FiColors.surface,
    borderRadius: 16,
    padding: 20,
    maxWidth: 320,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  tooltipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  tooltipTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: FiColors.text,
    flex: 1,
  },
  closeButton: {
    padding: 4,
    marginLeft: 12,
  },
  closeButtonText: {
    fontSize: 18,
    color: FiColors.textSecondary,
    fontWeight: '600',
  },
  tooltipText: {
    fontSize: 14,
    color: FiColors.text,
    lineHeight: 20,
    marginBottom: 8,
  },
  tooltipBold: {
    fontWeight: '600',
  },
  benchmarkText: {
    fontSize: 13,
    color: FiColors.textSecondary,
    marginLeft: 8,
    marginBottom: 4,
  },
});

export default SavingsRateCard;
