import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

const CategoryBreakdownCard = ({ user, onChatRequest, size = 'large' }) => {
  const spending = user.monthlySpending || {};
  const totalSpending = Object.values(spending).reduce((a, b) => a + b, 0);

  const getCategoryIcon = (category) => {
    const icons = {
      housing: '🏠',
      food: '🍽️',
      transport: '🚗',
      entertainment: '🎬',
      utilities: '⚡',
      healthcare: '🏥',
      investments: '📈',
      miscellaneous: '📦',
      shopping: '🛍️',
      education: '📚'
    };
    return icons[category] || '💰';
  };

  const getCategoryColor = (percentage) => {
    if (percentage > 30) return '#FF6B6B'; // High spending - red
    if (percentage > 20) return '#FFB800'; // Medium spending - orange
    if (percentage > 10) return '#00D4AA'; // Normal spending - green
    return '#51CF66'; // Low spending - light green
  };

  const sortedCategories = Object.entries(spending)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: (amount / totalSpending) * 100
    }))
    .sort((a, b) => b.amount - a.amount);

  const handleChatPress = () => {
    const topCategory = sortedCategories[0];
    const message = `I'm spending ₹${topCategory.amount.toLocaleString()} on ${topCategory.category} (${topCategory.percentage.toFixed(1)}% of my budget). Help me analyze and optimize my spending categories.`;
    onChatRequest?.(message);
  };

  return (
    <View style={[styles.card, styles[`${size}Card`]]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Category Breakdown</Text>
          <Text style={styles.subtitle}>
            ₹{totalSpending.toLocaleString()} total spending this month
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.chatButton}
          onPress={handleChatPress}
        >
          <Text style={styles.chatIcon}>💬</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.categoriesContainer}>
        {sortedCategories.slice(0, 6).map(({ category, amount, percentage }) => (
          <View key={category} style={styles.categoryItem}>
            <View style={styles.categoryHeader}>
              <View style={styles.categoryInfo}>
                <Text style={styles.categoryIcon}>
                  {getCategoryIcon(category)}
                </Text>
                <Text style={styles.categoryName}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Text>
              </View>
              <View style={styles.categoryAmount}>
                <Text style={styles.amountText}>₹{amount.toLocaleString()}</Text>
                <Text style={[styles.percentageText, { color: getCategoryColor(percentage) }]}>
                  {percentage.toFixed(1)}%
                </Text>
              </View>
            </View>
            
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { 
                      width: `${percentage}%`,
                      backgroundColor: getCategoryColor(percentage)
                    }
                  ]} 
                />
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Top Insights */}
      <View style={styles.insightsContainer}>
        <Text style={styles.insightsTitle}>Quick Insights</Text>
        <View style={styles.insightsList}>
          <Text style={styles.insightItem}>
            🏆 Top category: {sortedCategories[0]?.category} ({sortedCategories[0]?.percentage.toFixed(1)}%)
          </Text>
          <Text style={styles.insightItem}>
            💡 {getSpendingInsight(sortedCategories, user)}
          </Text>
          <Text style={styles.insightItem}>
            📊 {sortedCategories.filter(c => c.percentage > 15).length} categories above 15%
          </Text>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.actionButton}
        onPress={() => onChatRequest?.('Analyze my spending patterns and suggest specific optimizations for each category')}
      >
        <Text style={styles.actionText}>Get Optimization Tips</Text>
      </TouchableOpacity>
    </View>
  );
};

// Helper function to generate spending insights
const getSpendingInsight = (categories, user) => {
  const topCategory = categories[0];
  const income = user.profile?.monthlyIncome || user.monthlyIncome || 50000;
  const spendingRatio = (topCategory.amount / income) * 100;

  if (topCategory.category === 'housing' && spendingRatio > 30) {
    return 'Housing costs are high - consider optimization';
  }
  if (topCategory.category === 'food' && spendingRatio > 15) {
    return 'Food spending is above recommended 15%';
  }
  if (topCategory.category === 'entertainment' && spendingRatio > 10) {
    return 'Entertainment spending could be reduced';
  }
  if (topCategory.category === 'transport' && spendingRatio > 15) {
    return 'Transport costs are significant - explore alternatives';
  }
  
  return `${topCategory.category} spending is ${spendingRatio.toFixed(1)}% of income`;
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
    minHeight: 400,
  },
  mediumCard: {
    minHeight: 300,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
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
  categoriesContainer: {
    marginBottom: 20,
  },
  categoryItem: {
    marginBottom: 16,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  categoryAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  percentageText: {
    fontSize: 12,
    fontWeight: '500',
  },
  progressBarContainer: {
    marginTop: 4,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#F0F0F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  insightsContainer: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
  },
  insightsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  insightsList: {
    gap: 8,
  },
  insightItem: {
    fontSize: 13,
    color: '#1A1A1A',
    lineHeight: 18,
  },
  actionButton: {
    backgroundColor: '#00D4AA',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default CategoryBreakdownCard;
