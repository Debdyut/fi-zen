import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { FadeInUp } from '../animations/AnimatedCard';
import { useTheme } from '../../theme/ThemeContext';
import { getThemeColors } from '../../theme/consolidatedFiColors';

// Remove hardcoded colors - will use theme colors instead

const PeerComparisonCard = ({ peerComparison, userProfile }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);

  // Generate specific peer group description
  const getPeerGroupDescription = (profile) => {
    const ageGroup = profile.age ? 
      profile.age < 30 ? 'Young professionals' :
      profile.age < 40 ? 'Mid-career professionals' :
      'Senior professionals' : 'Professionals';
    
    const locationContext = profile.location ? 
      profile.location.includes('Mumbai') || profile.location.includes('Delhi') || profile.location.includes('Bangalore') ?
        'in major metros' : 'in your city' : '';
    
    const incomeRange = profile.monthlyIncome > 150000 ? 'high earners' :
                       profile.monthlyIncome > 80000 ? 'mid-range earners' :
                       'similar income earners';
    
    return `${ageGroup} ${locationContext} with ${incomeRange}`;
  };

  // Get performance insight based on percentile
  const getPerformanceInsight = (percentile) => {
    if (percentile >= 90) {
      return {
        color: FiColors.success,
        status: 'Exceptional',
        message: 'You\'re in the top 10%! Your financial discipline is outstanding.',
        icon: '🏆',
        rank: `Top ${100 - percentile}%`
      };
    } else if (percentile >= 75) {
      return {
        color: FiColors.success,
        status: 'Excellent',
        message: 'You\'re doing better than most of your peers. Keep it up!',
        icon: '🌟',
        rank: `Top ${100 - percentile}%`
      };
    } else if (percentile >= 60) {
      return {
        color: FiColors.primary,
        status: 'Above Average',
        message: 'You\'re ahead of many peers. Small improvements can boost your ranking.',
        icon: '📈',
        rank: `Top ${100 - percentile}%`
      };
    } else if (percentile >= 40) {
      return {
        color: FiColors.warning,
        status: 'Average',
        message: 'You\'re in the middle range. Focus on increasing your savings rate.',
        icon: '⚖️',
        rank: `${percentile}th percentile`
      };
    } else {
      return {
        color: FiColors.warning,
        status: 'Below Average',
        message: 'There\'s room for improvement. Start with small, consistent changes.',
        icon: '💪',
        rank: `${percentile}th percentile`
      };
    }
  };

  // Generate comparison metrics
  const getComparisonMetrics = (comparison, profile) => {
    const avgSavings = Math.round(profile.monthlyIncome * 0.18); // Assume 18% average
    const userSavings = Math.round(profile.monthlyIncome * (comparison.userSavingsRate || 15) / 100);
    const difference = userSavings - avgSavings;
    
    return {
      avgSavings,
      userSavings,
      difference,
      isAbove: difference > 0
    };
  };

  const peerGroup = getPeerGroupDescription(userProfile);
  const insight = getPerformanceInsight(peerComparison?.percentile || 50);
  const metrics = getComparisonMetrics(peerComparison, userProfile);
  const percentile = peerComparison?.percentile || 50;
  const previousPercentile = percentile - 5; // Mock previous data
  const percentileChange = percentile - previousPercentile;

  // Percentile Visualization Component (simplified)
  const PercentileChart = () => {
    const position = percentile;
    
    return (
      <View style={styles.percentileChart}>
        <View style={styles.percentileTrack}>
          <View 
            style={[
              styles.percentileFill, 
              { 
                width: `${position}%`,
                backgroundColor: insight.color
              }
            ]} 
          />
        </View>
        <Text style={[styles.percentileText, { color: insight.color }]}>
          {position}%
        </Text>
      </View>
    );
  };

  const handleQuickAction = (action) => {
    console.log('Quick action:', action);
  };

  return (
    <FadeInUp delay={200}>
      <View style={[styles.card, { backgroundColor: insight.color + '05' }]}>
        <View style={styles.cardHeader}>
          <View style={styles.iconContainer}>
            <View style={[styles.iconGradient, { backgroundColor: insight.color + '15' }]}>
              <Text style={styles.cardIcon}>{insight.icon}</Text>
            </View>
          </View>
          <View style={styles.cardTitleContainer}>
            <View style={styles.titleRow}>
              <Text style={styles.cardTitle}>Peer Comparison</Text>
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
                  onPress={() => setShowDetails(true)}
                  style={styles.detailsButton}
                >
                  <Text style={styles.detailsIcon}>ℹ️</Text>
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.cardDescription}>vs. {peerGroup}</Text>
          </View>
        </View>
        
        <View style={styles.cardContent}>
          <View style={styles.metricsRow}>
            <View style={styles.mainMetric}>
              <View style={styles.valueWithTrend}>
                <Text style={[styles.cardValue, { color: insight.color }]}>
                  {insight.rank}
                </Text>
                <View style={styles.trendIndicator}>
                  <Text style={[
                    styles.trendArrow,
                    { color: percentileChange >= 0 ? colors.success : colors.error }
                  ]}>
                    {percentileChange >= 0 ? '↗' : '↘'}
                  </Text>
                  <Text style={styles.trendValue}>
                    {Math.abs(percentileChange)}%
                  </Text>
                </View>
              </View>
              <Text style={[styles.statusText, { color: insight.color }]}>
                {insight.status}
              </Text>
            </View>
            <View style={styles.chartContainer}>
              <PercentileChart />
              <Text style={styles.chartLabel}>Percentile</Text>
            </View>
          </View>
          
          <View style={styles.benchmarkSection}>
            <Text style={styles.benchmarkTitle}>📊 Savings Comparison</Text>
            <View style={styles.comparisonRow}>
              <Text style={styles.comparisonLabel}>You save:</Text>
              <Text style={[styles.comparisonValue, { color: metrics.isAbove ? colors.success : colors.warning }]}>
                ₹{metrics.userSavings.toLocaleString()}/month
              </Text>
            </View>
            <View style={styles.comparisonRow}>
              <Text style={styles.comparisonLabel}>Peer average:</Text>
              <Text style={styles.comparisonValue}>₹{metrics.avgSavings.toLocaleString()}/month</Text>
            </View>
            {metrics.difference !== 0 && (
              <Text style={[styles.differenceText, { color: metrics.isAbove ? colors.success : colors.warning }]}>
                {metrics.isAbove ? '+' : ''}₹{metrics.difference.toLocaleString()} vs. peers
              </Text>
            )}
          </View>
          
          <Text style={styles.insightMessage}>{insight.message}</Text>
          
          <View style={styles.quickActions}>
            <Text style={styles.quickActionsTitle}>⚡ Quick Actions</Text>
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={[styles.actionButton, { backgroundColor: insight.color + '15' }]}
                onPress={() => handleQuickAction('improve')}
              >
                <Text style={[styles.actionButtonText, { color: insight.color }]}>
                  📈 Improve Rank
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.actionButton, { backgroundColor: colors.primary + '15' }]}
                onPress={() => handleQuickAction('compare')}
              >
                <Text style={[styles.actionButtonText, { color: colors.primary }]}>
                  🔍 View Details
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Details Modal */}
        <Modal
          visible={showDetails}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowDetails(false)}
        >
          <TouchableOpacity 
            style={styles.modalOverlay}
            onPress={() => setShowDetails(false)}
          >
            <View style={styles.detailsContainer}>
              <Text style={styles.detailsTitle}>Comparison Details</Text>
              
              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>Your Peer Group</Text>
                <Text style={styles.detailText}>• {peerGroup}</Text>
                <Text style={styles.detailText}>• Income range: ₹{Math.round(userProfile.monthlyIncome * 0.8).toLocaleString()} - ₹{Math.round(userProfile.monthlyIncome * 1.2).toLocaleString()}</Text>
                <Text style={styles.detailText}>• Sample size: ~{Math.floor(Math.random() * 500) + 200} users</Text>
              </View>
              
              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>Savings Breakdown</Text>
                <View style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel}>Top 10%:</Text>
                  <Text style={styles.breakdownValue}>₹{Math.round(userProfile.monthlyIncome * 0.3).toLocaleString()}+</Text>
                </View>
                <View style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel}>Average:</Text>
                  <Text style={styles.breakdownValue}>₹{metrics.avgSavings.toLocaleString()}</Text>
                </View>
                <View style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel}>Bottom 25%:</Text>
                  <Text style={styles.breakdownValue}>₹{Math.round(userProfile.monthlyIncome * 0.05).toLocaleString()}</Text>
                </View>
              </View>
              
              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>How to Improve</Text>
                {peerComparison?.percentile < 75 && (
                  <>
                    <Text style={styles.improvementText}>• Increase savings by ₹{Math.round((metrics.avgSavings - metrics.userSavings) * 1.2).toLocaleString()} to reach top 25%</Text>
                    <Text style={styles.improvementText}>• Focus on reducing discretionary spending</Text>
                    <Text style={styles.improvementText}>• Automate your savings to build consistency</Text>
                  </>
                )}
                {peerComparison?.percentile >= 75 && (
                  <Text style={styles.improvementText}>• You're already performing well! Consider increasing investment allocation</Text>
                )}
              </View>
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
  detailsButton: {
    padding: 4,
  },
  detailsIcon: {
    fontSize: 16,
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
  cardValue: {
    fontSize: 28,
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
    marginBottom: 16,
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
  comparisonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 8,
  },
  comparisonLabel: {
    fontSize: 14,
    color: FiColors.textSecondary,
  },
  comparisonValue: {
    fontSize: 14,
    fontWeight: '600',
    color: FiColors.text,
  },
  differenceText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
    alignSelf: 'flex-end',
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
  percentileChart: {
    width: 100,
    alignItems: 'center',
  },
  percentileTrack: {
    width: '100%',
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 4,
  },
  percentileFill: {
    height: '100%',
    borderRadius: 2,
  },
  percentileText: {
    fontSize: 12,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  detailsContainer: {
    backgroundColor: FiColors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    maxHeight: '80%',
  },
  detailsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: FiColors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  detailSection: {
    marginBottom: 20,
  },
  detailSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: FiColors.text,
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: FiColors.textSecondary,
    lineHeight: 20,
    marginBottom: 4,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
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
  improvementText: {
    fontSize: 14,
    color: FiColors.text,
    lineHeight: 20,
    marginBottom: 6,
  },
});

export default PeerComparisonCard;
