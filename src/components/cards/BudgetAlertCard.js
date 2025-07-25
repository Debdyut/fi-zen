import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

const BudgetAlertCard = ({ user, onChatRequest, size = 'small' }) => {
  const spending = user.monthlySpending || {};
  const income = user.profile?.monthlyIncome || user.monthlyIncome || 50000;
  
  // Generate budget alerts based on spending patterns
  const generateBudgetAlerts = () => {
    const alerts = [];
    const totalSpending = Object.values(spending).reduce((a, b) => a + b, 0);
    
    // Check overall spending vs income
    const spendingRatio = totalSpending / income;
    if (spendingRatio > 0.8) {
      alerts.push({
        type: 'critical',
        category: 'Overall',
        message: `Spending ${(spendingRatio * 100).toFixed(0)}% of income`,
        percentage: spendingRatio * 100,
        recommendation: 'Reduce expenses immediately'
      });
    }
    
    // Check individual categories
    Object.entries(spending).forEach(([category, amount]) => {
      const categoryRatio = amount / income;
      
      if (category === 'housing' && categoryRatio > 0.35) {
        alerts.push({
          type: 'warning',
          category: 'Housing',
          message: `${(categoryRatio * 100).toFixed(0)}% of income on housing`,
          percentage: categoryRatio * 100,
          recommendation: 'Consider cheaper housing options'
        });
      }
      
      if (category === 'food' && categoryRatio > 0.15) {
        alerts.push({
          type: 'warning',
          category: 'Food',
          message: `${(categoryRatio * 100).toFixed(0)}% of income on food`,
          percentage: categoryRatio * 100,
          recommendation: 'Review dining and grocery expenses'
        });
      }
      
      if (category === 'entertainment' && categoryRatio > 0.10) {
        alerts.push({
          type: 'caution',
          category: 'Entertainment',
          message: `${(categoryRatio * 100).toFixed(0)}% of income on entertainment`,
          percentage: categoryRatio * 100,
          recommendation: 'Consider reducing entertainment expenses'
        });
      }
      
      if (category === 'transport' && categoryRatio > 0.15) {
        alerts.push({
          type: 'caution',
          category: 'Transport',
          message: `${(categoryRatio * 100).toFixed(0)}% of income on transport`,
          percentage: categoryRatio * 100,
          recommendation: 'Explore cost-effective transport options'
        });
      }
    });
    
    // Sort by severity
    return alerts.sort((a, b) => {
      const severity = { critical: 3, warning: 2, caution: 1 };
      return severity[b.type] - severity[a.type];
    });
  };

  const alerts = generateBudgetAlerts();
  const hasAlerts = alerts.length > 0;

  const getAlertColor = (type) => {
    switch (type) {
      case 'critical': return '#FF6B6B';
      case 'warning': return '#FFB800';
      case 'caution': return '#FF9500';
      default: return '#666666';
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'critical': return '🚨';
      case 'warning': return '⚠️';
      case 'caution': return '⚡';
      default: return '💡';
    }
  };

  const handleChatPress = () => {
    if (hasAlerts) {
      const topAlert = alerts[0];
      const message = `I have a ${topAlert.type} budget alert: ${topAlert.message}. ${topAlert.recommendation}. Help me create a plan to fix this.`;
      onChatRequest?.(message);
    } else {
      const message = `My budget looks healthy. Help me maintain good spending habits and identify areas for further optimization.`;
      onChatRequest?.(message);
    }
  };

  return (
    <View style={[styles.card, styles[`${size}Card`]]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Budget Check</Text>
          <Text style={styles.subtitle}>
            {hasAlerts ? `${alerts.length} thing${alerts.length > 1 ? 's' : ''} to review` : 'Looking good!'}
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.chatButton}
          onPress={handleChatPress}
        >
          <Text style={styles.chatIcon}>💬</Text>
        </TouchableOpacity>
      </View>

      {hasAlerts ? (
        <View style={styles.alertsContainer}>
          {alerts.slice(0, 2).map((alert, index) => (
            <View key={index} style={styles.alertItem}>
              <View style={styles.alertHeader}>
                <Text style={styles.alertIcon}>{getAlertIcon(alert.type)}</Text>
                <Text style={styles.alertCategory}>{alert.category}</Text>
                <Text style={[styles.alertPercentage, { color: getAlertColor(alert.type) }]}>
                  {alert.percentage.toFixed(0)}%
                </Text>
              </View>
              <Text style={styles.alertMessage}>{alert.message}</Text>
              <Text style={styles.alertRecommendation}>{alert.recommendation}</Text>
            </View>
          ))}
          
          {alerts.length > 2 && (
            <TouchableOpacity 
              style={styles.viewMoreButton}
              onPress={() => onChatRequest?.('Show me all my budget alerts and help me prioritize which ones to fix first')}
            >
              <Text style={styles.viewMoreText}>
                View {alerts.length - 2} more alert{alerts.length - 2 > 1 ? 's' : ''}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <View style={styles.goodStatusContainer}>
          <Text style={styles.goodStatusIcon}>✅</Text>
          <Text style={styles.goodStatusText}>You're doing great!</Text>
          <Text style={styles.goodStatusSubtext}>
            Using {((Object.values(spending).reduce((a, b) => a + b, 0) / income) * 100).toFixed(0)}% of your income
          </Text>
        </View>
      )}

      <TouchableOpacity 
        style={[styles.actionButton, { backgroundColor: hasAlerts ? '#FF6B6B' : '#00D4AA' }]}
        onPress={() => onChatRequest?.(hasAlerts ? 'Help me create a budget recovery plan' : 'Help me optimize my budget further')}
      >
        <Text style={styles.actionText}>
          {hasAlerts ? 'Get Help' : 'Find More Savings'}
        </Text>
      </TouchableOpacity>
    </View>
  );
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
  smallCard: {
    minHeight: 180,
  },
  mediumCard: {
    minHeight: 220,
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
  alertsContainer: {
    marginBottom: 16,
  },
  alertItem: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#FFF5F5',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#FF6B6B',
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  alertIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  alertCategory: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1A1A1A',
    flex: 1,
  },
  alertPercentage: {
    fontSize: 12,
    fontWeight: '600',
  },
  alertMessage: {
    fontSize: 11,
    color: '#1A1A1A',
    marginBottom: 4,
  },
  alertRecommendation: {
    fontSize: 10,
    color: '#666666',
    fontStyle: 'italic',
  },
  viewMoreButton: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  viewMoreText: {
    fontSize: 12,
    color: '#00D4AA',
    fontWeight: '500',
  },
  goodStatusContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 16,
  },
  goodStatusIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  goodStatusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#51CF66',
    marginBottom: 4,
  },
  goodStatusSubtext: {
    fontSize: 12,
    color: '#666666',
  },
  actionButton: {
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

export default BudgetAlertCard;
