import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

const PrimaryMetricCard = ({ user, size = 'large' }) => {
  const metric = user.currentMetric || {
    name: 'Net Worth',
    value: user.netWorth?.netWorth || 0,
    change: 0,
    trend: 'stable'
  };

  const formatCurrency = (amount) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(0)}K`;
    return `₹${amount}`;
  };

  const getMetricIcon = (metricName) => {
    const icons = {
      'Net Worth': '💰',
      'Portfolio Value': '📊',
      'Investment Returns': '📈',
      'Monthly Income': '💵',
      'Monthly Spending': '💳',
      'Savings Rate': '🏦',
      'Inflation Rate': '📊',
      'Target Returns': '🎯'
    };
    return icons[metricName] || '📊';
  };

  const getTrendColor = (change) => {
    if (change > 0) return '#51CF66';
    if (change < 0) return '#FF6B6B';
    return '#666666';
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'increasing': return '📈';
      case 'decreasing': return '📉';
      case 'stable': return '➡️';
      default: return '➡️';
    }
  };

  return (
    <View style={[styles.card, styles[`${size}Card`]]}>
      <View style={styles.header}>
        <Text style={styles.metricIcon}>{getMetricIcon(metric.name)}</Text>
        <Text style={styles.metricName}>{metric.name}</Text>
      </View>

      <View style={styles.valueContainer}>
        <Text style={styles.metricValue}>
          {formatCurrency(metric.value)}
        </Text>
        
        {metric.change !== undefined && (
          <View style={styles.changeContainer}>
            <Text style={[styles.changeValue, { color: getTrendColor(metric.change) }]}>
              {metric.change > 0 ? '+' : ''}{metric.change}%
            </Text>
            <Text style={styles.trendIcon}>{getTrendIcon(metric.trend)}</Text>
          </View>
        )}
      </View>

      <Text style={styles.description}>
        {getMetricDescription(metric.name, user)}
      </Text>

      {/* Quick Stats */}
      <View style={styles.quickStats}>
        {getQuickStats(metric.name, user).map((stat, index) => (
          <View key={index} style={styles.statItem}>
            <Text style={styles.statLabel}>{stat.label}</Text>
            <Text style={styles.statValue}>{stat.value}</Text>
          </View>
        ))}
      </View>

      {/* Performance Indicator */}
      <View style={styles.performanceContainer}>
        <Text style={styles.performanceLabel}>Performance</Text>
        <View style={styles.performanceBar}>
          <View 
            style={[
              styles.performanceFill, 
              { 
                width: `${getPerformancePercentage(metric.name, user)}%`,
                backgroundColor: getPerformanceColor(metric.name, user)
              }
            ]} 
          />
        </View>
        <Text style={styles.performanceText}>
          {getPerformanceText(metric.name, user)}
        </Text>
      </View>
    </View>
  );
};

// Helper functions
const getMetricDescription = (metricName, user) => {
  const descriptions = {
    'Net Worth': `Your total assets minus liabilities. As a ${user.profile?.profession}, this shows your overall financial position.`,
    'Portfolio Value': `Total value of your investment portfolio. Current allocation reflects your ${user.profile?.riskProfile} risk profile.`,
    'Investment Returns': `Your investment performance over time. Target: Beat inflation + 4% for real growth.`,
    'Monthly Income': `Your regular monthly earnings. Consistent income is key for financial planning.`,
    'Monthly Spending': `Your monthly expenses across all categories. Track this to optimize savings.`,
    'Savings Rate': `Percentage of income you save monthly. Higher rates accelerate wealth building.`,
    'Inflation Rate': `Your personal inflation rate based on spending patterns. Varies by location and lifestyle.`,
    'Target Returns': `Minimum returns needed to beat inflation and build real wealth over time.`
  };
  return descriptions[metricName] || 'Financial metric tracking your progress.';
};

const getQuickStats = (metricName, user) => {
  switch (metricName) {
    case 'Net Worth':
      return [
        { label: 'Assets', value: formatCurrency(user.netWorth?.totalAssets || 0) },
        { label: 'Liabilities', value: formatCurrency(user.netWorth?.totalLiabilities || 0) },
        { label: 'Growth', value: `${user.currentMetric?.change || 0}%` }
      ];
    case 'Portfolio Value':
      return [
        { label: 'Equity', value: `${user.assetAllocation?.equity || 60}%` },
        { label: 'Debt', value: `${user.assetAllocation?.debt || 30}%` },
        { label: 'Cash', value: `${user.assetAllocation?.cash || 10}%` }
      ];
    case 'Investment Returns':
      return [
        { label: 'YTD', value: `${user.returns?.ytd || 12}%` },
        { label: 'Target', value: `${user.profile?.targetReturn || 15}%` },
        { label: 'Benchmark', value: '12%' }
      ];
    default:
      return [
        { label: 'Current', value: formatCurrency(user.currentMetric?.value || 0) },
        { label: 'Target', value: formatCurrency(user.currentMetric?.target || 0) },
        { label: 'Progress', value: `${user.currentMetric?.progress || 0}%` }
      ];
  }
};

const getPerformancePercentage = (metricName, user) => {
  switch (metricName) {
    case 'Net Worth':
      const netWorthTarget = (user.profile?.monthlyIncome || 50000) * 12 * 5; // 5 years income
      return Math.min((user.netWorth?.netWorth || 0) / netWorthTarget * 100, 100);
    case 'Investment Returns':
      const targetReturn = user.profile?.targetReturn || 15;
      const currentReturn = user.returns?.overall || 12;
      return Math.min(currentReturn / targetReturn * 100, 100);
    case 'Savings Rate':
      const savingsRate = user.financialMetrics?.savingsRate || 20;
      return Math.min(savingsRate / 30 * 100, 100); // 30% is excellent
    default:
      return 70; // Default performance
  }
};

const getPerformanceColor = (metricName, user) => {
  const percentage = getPerformancePercentage(metricName, user);
  if (percentage >= 80) return '#51CF66';
  if (percentage >= 60) return '#FFB800';
  return '#FF6B6B';
};

const getPerformanceText = (metricName, user) => {
  const percentage = getPerformancePercentage(metricName, user);
  if (percentage >= 80) return 'Excellent';
  if (percentage >= 60) return 'Good';
  if (percentage >= 40) return 'Average';
  return 'Needs Improvement';
};

const formatCurrency = (amount) => {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(0)}K`;
  return `₹${amount}`;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 16,
  },
  largeCard: {
    minHeight: 320,
  },
  mediumCard: {
    minHeight: 240,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  metricIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  metricName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  metricValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeValue: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 4,
  },
  trendIcon: {
    fontSize: 14,
  },
  description: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    marginBottom: 20,
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F0F0F0',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  performanceContainer: {
    marginTop: 8,
  },
  performanceLabel: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 8,
  },
  performanceBar: {
    height: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  performanceFill: {
    height: '100%',
    borderRadius: 4,
  },
  performanceText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1A1A1A',
    textAlign: 'center',
  },
});

export default PrimaryMetricCard;
