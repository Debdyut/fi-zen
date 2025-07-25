import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Dimensions } from 'react-native';
import { FadeInUp } from '../animations/AnimatedCard';
import { useTheme } from '../../theme/ThemeContext';
import { getThemeColors } from '../../theme/consolidatedFiColors';

const { width } = Dimensions.get('window');

// Remove hardcoded colors - will use theme colors instead

const SavingsRateCard = ({ savingsRate, monthlyIncome, userProfile }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);
  const [historicalData] = useState([
    { month: 'Jan', rate: savingsRate - 5 },
    { month: 'Feb', rate: savingsRate - 3 },
    { month: 'Mar', rate: savingsRate - 1 },
    { month: 'Apr', rate: savingsRate + 1 },
    { month: 'May', rate: savingsRate },
  ]);

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
  const previousRate = historicalData[historicalData.length - 2]?.rate || savingsRate - 2;
  const trendChange = savingsRate - previousRate;
  const targetRate = 25; // Target savings rate
  const benchmarks = {
    excellent: 30,
    good: 20,
    average: 15,
    poor: 5
  };

  // Mini Chart Component (simplified)
  const MiniChart = () => {
    return (
      <View style={styles.miniChart}>
        {historicalData.map((data, index) => {
          const height = (data.rate / 35) * 30; // Max height 30
          return (
            <View key={index} style={styles.chartColumn}>
              <View 
                style={[
                  styles.chartBar, 
                  { 
                    height: height,
                    backgroundColor: insight.color
                  }
                ]} 
              />
            </View>
          );
        })}
      </View>
    );
  };

  // Progress Bar Component
  const ProgressBar = ({ current, target, color }) => {
    const progress = Math.min(current / target, 1);
    return (
      <View style={styles.progressContainer}>
        <View style={styles.progressTrack}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${progress * 100}%`, backgroundColor: color }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>{current}% / {target}%</Text>
      </View>
    );
  };

  const handleQuickAction = (action) => {
    // Handle quick actions
    console.log('Quick action:', action);
  };

  return (
    <FadeInUp delay={100}>
      <View style={[styles.card, { backgroundColor: insight.color + '05' }]}>
        <View style={styles.cardHeader}>
          <View style={styles.iconContainer}>
            <View style={[styles.iconGradient, { backgroundColor: insight.color + '15' }]}>
              <Text style={styles.cardIcon}>{insight.icon}</Text>
            </View>
          </View>
          <View style={styles.cardTitleContainer}>
            <View style={styles.titleRow}>
              <Text style={styles.cardTitle}>Your Savings Rate</Text>
              <View style={styles.headerActions}>
                <TouchableOpacity 
                  onPress={() => setIsBookmarked(!isBookmarked)}
                  style={styles.bookmarkButton}
                >
                  <Text style={styles.bookmarkIcon}>
                    {isBookmarked ? '🔖' : '📌'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => setShowTooltip(true)}
                  style={styles.helpButton}
                >
                  <Text style={styles.helpIcon}>ℹ️</Text>
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.cardDescription}>How much you save each month</Text>
          </View>
        </View>
        
        <View style={styles.cardContent}>
          <View style={styles.metricsRow}>
            <View style={styles.mainMetric}>
              <View style={styles.valueWithTrend}>
                <Text style={[styles.cardValue, { color: insight.color }]}>
                  {savingsRate}%
                </Text>
                <View style={styles.trendIndicator}>
                  <Text style={[
                    styles.trendArrow,
                    { color: trendChange >= 0 ? colors.success : colors.error }
                  ]}>
                    {trendChange >= 0 ? '↗' : '↘'}
                  </Text>
                  <Text style={styles.trendValue}>
                    {Math.abs(trendChange).toFixed(1)}%
                  </Text>
                </View>
              </View>
              <Text style={[styles.statusText, { color: insight.color }]}>
                {insight.status}
              </Text>
            </View>
            <View style={styles.chartContainer}>
              <MiniChart />
              <Text style={styles.chartLabel}>6M Trend</Text>
            </View>
          </View>
          
          <ProgressBar current={savingsRate} target={targetRate} color={insight.color} />
          
          <View style={styles.benchmarkSection}>
            <Text style={styles.benchmarkTitle}>📊 Benchmarks</Text>
            <View style={styles.benchmarkRow}>
              <View style={styles.benchmarkItem}>
                <Text style={styles.benchmarkLabel}>You</Text>
                <Text style={[styles.benchmarkValue, { color: insight.color }]}>
                  {savingsRate}%
                </Text>
              </View>
              <View style={styles.benchmarkItem}>
                <Text style={styles.benchmarkLabel}>Peers</Text>
                <Text style={styles.benchmarkValue}>{benchmarks.average}%</Text>
              </View>
              <View style={styles.benchmarkItem}>
                <Text style={styles.benchmarkLabel}>Target</Text>
                <Text style={[styles.benchmarkValue, { color: colors.success }]}>
                  {targetRate}%
                </Text>
              </View>
            </View>
          </View>
          
          <Text style={styles.insightMessage}>{insight.message}</Text>
          
          <View style={styles.quickActions}>
            <Text style={styles.quickActionsTitle}>⚡ Quick Actions</Text>
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={[styles.actionButton, { backgroundColor: insight.color + '15' }]}
                onPress={() => handleQuickAction('automate')}
              >
                <Text style={[styles.actionButtonText, { color: insight.color }]}>
                  🤖 Automate Savings
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.actionButton, { backgroundColor: colors.primary + '15' }]}
                onPress={() => handleQuickAction('optimize')}
              >
                <Text style={[styles.actionButtonText, { color: colors.primary }]}>
                  📈 Optimize Rate
                </Text>
              </TouchableOpacity>
            </View>
          </View>
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
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 170, 0.1)',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  iconContainer: {
    marginRight: 12,
  },
  iconGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardIcon: {
    fontSize: 24,
  },
  cardTitleContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  bookmarkButton: {
    padding: 4,
  },
  bookmarkIcon: {
    fontSize: 16,
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
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
    marginBottom: 16,
  },
  mainMetric: {
    flex: 1,
  },
  valueWithTrend: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  trendIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  trendArrow: {
    fontSize: 16,
    marginRight: 4,
  },
  trendValue: {
    fontSize: 12,
    color: FiColors.textSecondary,
    fontWeight: '600',
  },
  chartContainer: {
    alignItems: 'center',
  },
  chartLabel: {
    fontSize: 10,
    color: FiColors.textSecondary,
    marginTop: 4,
  },
  miniChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 30,
    width: 80,
    gap: 2,
  },
  chartColumn: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  chartBar: {
    borderRadius: 1,
    minHeight: 2,
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
  progressContainer: {
    width: '100%',
    marginBottom: 16,
  },
  progressTrack: {
    height: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: FiColors.textSecondary,
    textAlign: 'center',
  },
  benchmarkSection: {
    width: '100%',
    marginBottom: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 12,
  },
  benchmarkTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: FiColors.text,
    marginBottom: 8,
  },
  benchmarkRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  benchmarkItem: {
    alignItems: 'center',
  },
  benchmarkLabel: {
    fontSize: 12,
    color: FiColors.textSecondary,
    marginBottom: 4,
  },
  benchmarkValue: {
    fontSize: 16,
    fontWeight: '700',
    color: FiColors.text,
  },
  quickActions: {
    width: '100%',
    marginTop: 8,
  },
  quickActionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: FiColors.text,
    marginBottom: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
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
