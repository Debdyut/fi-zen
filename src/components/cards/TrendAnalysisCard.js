import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

const TrendAnalysisCard = ({ user, onChatRequest, size = 'medium' }) => {
  const trends = user.spendingTrends || {};
  const spending = user.monthlySpending || {};

  const getTrendIcon = (change) => {
    if (change > 5) return '📈';
    if (change < -5) return '📉';
    return '➡️';
  };

  const getTrendColor = (change) => {
    if (change > 10) return '#FF6B6B'; // High increase - concerning
    if (change > 0) return '#FFB800';  // Increase - caution
    if (change < -10) return '#51CF66'; // Big decrease - good
    if (change < 0) return '#00D4AA';   // Decrease - good
    return '#666666'; // Stable
  };

  const getTrendDescription = (category, change) => {
    const absChange = Math.abs(change);
    if (change > 0) {
      if (absChange > 20) return `Significant increase in ${category}`;
      if (absChange > 10) return `Notable increase in ${category}`;
      return `Slight increase in ${category}`;
    } else {
      if (absChange > 20) return `Major reduction in ${category}`;
      if (absChange > 10) return `Good reduction in ${category}`;
      return `Small decrease in ${category}`;
    }
  };

  const sortedTrends = Object.entries(trends)
    .map(([category, trendData]) => ({
      category,
      change: trendData.change || 0,
      trend: trendData.trend || 'stable',
      amount: spending[category] || 0
    }))
    .sort((a, b) => Math.abs(b.change) - Math.abs(a.change));

  const handleChatPress = () => {
    const significantTrend = sortedTrends[0];
    const message = `My ${significantTrend.category} spending has ${significantTrend.change > 0 ? 'increased' : 'decreased'} by ${Math.abs(significantTrend.change)}%. Help me understand this trend and what actions I should take.`;
    onChatRequest?.(message);
  };

  if (sortedTrends.length === 0) {
    return (
      <View style={[styles.card, styles[`${size}Card`]]}>
        <View style={styles.header}>
          <Text style={styles.title}>Trend Analysis</Text>
          <TouchableOpacity style={styles.chatButton} onPress={handleChatPress}>
            <Text style={styles.chatIcon}>💬</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📊</Text>
          <Text style={styles.emptyText}>Building your trends</Text>
          <Text style={styles.emptySubtext}>Keep spending to see patterns</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.card, styles[`${size}Card`]]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Spending Trends</Text>
          <Text style={styles.subtitle}>How your spending changed</Text>
        </View>
        <TouchableOpacity 
          style={styles.chatButton}
          onPress={handleChatPress}
        >
          <Text style={styles.chatIcon}>💬</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.trendsContainer}>
        {sortedTrends.slice(0, 4).map(({ category, change, amount }) => (
          <View key={category} style={styles.trendItem}>
            <View style={styles.trendHeader}>
              <View style={styles.trendInfo}>
                <Text style={styles.trendIcon}>{getTrendIcon(change)}</Text>
                <Text style={styles.categoryName}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Text>
              </View>
              <View style={styles.trendChange}>
                <Text style={[styles.changeValue, { color: getTrendColor(change) }]}>
                  {change > 0 ? '+' : ''}{change.toFixed(1)}%
                </Text>
              </View>
            </View>
            
            <Text style={styles.trendDescription}>
              {getTrendDescription(category, change)}
            </Text>
            
            <Text style={styles.currentAmount}>
              Current: ₹{amount.toLocaleString()}
            </Text>
          </View>
        ))}
      </View>

      {/* Summary */}
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Summary</Text>
        <Text style={styles.summaryText}>
          {getSummaryText(sortedTrends)}
        </Text>
      </View>

      <TouchableOpacity 
        style={styles.actionButton}
        onPress={() => onChatRequest?.('Explain my spending trends and suggest actions to optimize my budget based on these patterns')}
      >
        <Text style={styles.actionText}>Analyze Trends</Text>
      </TouchableOpacity>
    </View>
  );
};

// Helper function to generate summary text
const getSummaryText = (trends) => {
  const increases = trends.filter(t => t.change > 0);
  const decreases = trends.filter(t => t.change < 0);
  
  if (increases.length > decreases.length) {
    return `${increases.length} categories increased, with ${increases[0]?.category} showing the biggest rise. Consider reviewing these areas.`;
  } else if (decreases.length > increases.length) {
    return `Good progress! ${decreases.length} categories decreased, with ${decreases[0]?.category} showing the best improvement.`;
  } else {
    return 'Mixed trends across categories. Some areas improved while others need attention.';
  }
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  mediumCard: {
    minHeight: 280,
  },
  largeCard: {
    minHeight: 350,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: '#666666',
  },
  chatButton: {
    backgroundColor: '#00D4AA',
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatIcon: {
    fontSize: 14,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 12,
    color: '#666666',
  },
  trendsContainer: {
    marginBottom: 16,
  },
  trendItem: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  trendHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  trendInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  trendIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  trendChange: {
    alignItems: 'flex-end',
  },
  changeValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  trendDescription: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
  currentAmount: {
    fontSize: 12,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  summaryContainer: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
  },
  summaryTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 6,
  },
  summaryText: {
    fontSize: 12,
    color: '#666666',
    lineHeight: 16,
  },
  actionButton: {
    backgroundColor: '#00D4AA',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default TrendAnalysisCard;
