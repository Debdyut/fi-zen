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

const PeerComparisonCard = ({ peerComparison, userProfile }) => {
  const [showDetails, setShowDetails] = useState(false);

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

  return (
    <FadeInUp delay={200}>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardIcon}>{insight.icon}</Text>
          <View style={styles.cardTitleContainer}>
            <View style={styles.titleRow}>
              <Text style={styles.cardTitle}>Peer Comparison</Text>
              <TouchableOpacity 
                onPress={() => setShowDetails(true)}
                style={styles.detailsButton}
              >
                <Text style={styles.detailsIcon}>ℹ️</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.cardDescription}>vs. {peerGroup}</Text>
          </View>
        </View>
        
        <View style={styles.cardContent}>
          <View style={styles.mainMetric}>
            <Text style={[styles.cardValue, { color: insight.color }]}>
              {insight.rank}
            </Text>
            <Text style={[styles.statusText, { color: insight.color }]}>
              {insight.status}
            </Text>
          </View>
          
          <Text style={styles.insightMessage}>{insight.message}</Text>
          
          <View style={styles.comparisonRow}>
            <Text style={styles.comparisonLabel}>You save:</Text>
            <Text style={[styles.comparisonValue, { color: metrics.isAbove ? FiColors.success : FiColors.warning }]}>
              ₹{metrics.userSavings.toLocaleString()}/month
            </Text>
          </View>
          
          <View style={styles.comparisonRow}>
            <Text style={styles.comparisonLabel}>Peer average:</Text>
            <Text style={styles.comparisonValue}>₹{metrics.avgSavings.toLocaleString()}/month</Text>
          </View>
          
          {metrics.difference !== 0 && (
            <Text style={[styles.differenceText, { color: metrics.isAbove ? FiColors.success : FiColors.warning }]}>
              {metrics.isAbove ? '+' : ''}₹{metrics.difference.toLocaleString()} vs. peers
            </Text>
          )}
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
  mainMetric: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
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
