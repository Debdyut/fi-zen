import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useSharedUser } from '../../context/SharedUserContext';

const ContextualSuggestions = ({ currentScreen, navigation, onChatRequest }) => {
  const { user } = useSharedUser();

  if (!user) return null;

  const getSuggestions = () => {
    const hasGoals = user.goals && user.goals.length > 0;
    const hasSpending = user.monthlySpending && Object.keys(user.monthlySpending).length > 0;
    const netWorth = user.netWorth?.netWorth || 0;
    const monthlyIncome = user.profile?.monthlyIncome || 0;

    switch (currentScreen) {
      case 'insights':
        const suggestions = [];
        
        if (!hasGoals) {
          suggestions.push({
            icon: '🎯',
            title: 'Set Your First Goal',
            description: 'Turn insights into action with financial goals',
            action: () => navigation.navigate('Goals', { selectedUserId: user.userId, showJourneyGuide: true }),
            priority: 'high'
          });
        }

        if (hasSpending) {
          const totalSpending = Object.values(user.monthlySpending).reduce((a, b) => a + b, 0);
          const spendingRatio = totalSpending / monthlyIncome;
          
          if (spendingRatio > 0.8) {
            suggestions.push({
              icon: '💰',
              title: 'Optimize Your Spending',
              description: `You're spending ${(spendingRatio * 100).toFixed(0)}% of income`,
              action: () => navigation.navigate('EnhancedDetailedBreakdown', { userId: user.userId }),
              priority: 'high'
            });
          }
        }

        if (netWorth < monthlyIncome * 3) {
          suggestions.push({
            icon: '🛡️',
            title: 'Build Emergency Fund',
            description: 'Secure your finances with 3-6 months expenses',
            action: () => onChatRequest?.('Help me create an emergency fund goal based on my current financial situation'),
            priority: 'medium'
          });
        }

        return suggestions;

      case 'goals':
        const goalSuggestions = [];

        if (hasGoals) {
          const activeGoals = user.goals.filter(g => g.status === 'active' || g.status === 'on_track');
          if (activeGoals.length > 0) {
            goalSuggestions.push({
              icon: '📊',
              title: 'Track Progress',
              description: `Monitor your ${activeGoals.length} active goals`,
              action: () => navigation.navigate('EnhancedMetricDetail', { 
                userId: user.userId,
                metric: { name: 'Goal Progress', value: activeGoals.length }
              }),
              priority: 'medium'
            });
          }
        }

        if (hasSpending) {
          goalSuggestions.push({
            icon: '💡',
            title: 'Find More Savings',
            description: 'Analyze spending to fund your goals faster',
            action: () => navigation.navigate('EnhancedDetailedBreakdown', { userId: user.userId }),
            priority: 'medium'
          });
        }

        goalSuggestions.push({
          icon: '🤖',
          title: 'AI Goal Coach',
          description: 'Get personalized advice on achieving your goals',
          action: () => onChatRequest?.('Analyze my goals and provide specific strategies to achieve them faster'),
          priority: 'low'
        });

        return goalSuggestions;

      case 'breakdown':
        return [
          {
            icon: '🎯',
            title: 'Create Savings Goal',
            description: 'Turn spending optimizations into savings goals',
            action: () => navigation.navigate('Goals', { selectedUserId: user.userId }),
            priority: 'high'
          },
          {
            icon: '📈',
            title: 'Investment Opportunities',
            description: 'Invest your savings for better returns',
            action: () => onChatRequest?.('Based on my spending analysis, suggest investment opportunities for my savings'),
            priority: 'medium'
          },
          {
            icon: '📊',
            title: 'Overall Impact',
            description: 'See how optimizations affect your financial health',
            action: () => navigation.navigate('Insights', { selectedUserId: user.userId }),
            priority: 'low'
          }
        ];

      case 'metricDetail':
        return [
          {
            icon: '🎯',
            title: 'Set Related Goal',
            description: 'Create a goal to improve this metric',
            action: () => navigation.navigate('Goals', { selectedUserId: user.userId }),
            priority: 'high'
          },
          {
            icon: '🔍',
            title: 'Deep Analysis',
            description: 'Get detailed breakdown and optimization tips',
            action: () => navigation.navigate('EnhancedDetailedBreakdown', { userId: user.userId }),
            priority: 'medium'
          },
          {
            icon: '🤖',
            title: 'AI Recommendations',
            description: 'Get personalized advice for this metric',
            action: () => onChatRequest?.('Provide specific recommendations to improve this financial metric'),
            priority: 'low'
          }
        ];

      default:
        return [];
    }
  };

  const suggestions = getSuggestions();

  if (suggestions.length === 0) return null;

  // Sort by priority
  const sortedSuggestions = suggestions.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Suggested Next Steps</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.suggestionsScroll}
      >
        {sortedSuggestions.map((suggestion, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.suggestionCard,
              suggestion.priority === 'high' && styles.highPriority
            ]}
            onPress={suggestion.action}
          >
            <Text style={styles.suggestionIcon}>{suggestion.icon}</Text>
            <Text style={styles.suggestionTitle}>{suggestion.title}</Text>
            <Text style={styles.suggestionDescription}>{suggestion.description}</Text>
            
            {suggestion.priority === 'high' && (
              <View style={styles.priorityBadge}>
                <Text style={styles.priorityText}>Recommended</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  suggestionsScroll: {
    flexDirection: 'row',
  },
  suggestionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    width: 200,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    position: 'relative',
  },
  highPriority: {
    borderColor: '#00D4AA',
    borderWidth: 2,
  },
  suggestionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  suggestionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 6,
  },
  suggestionDescription: {
    fontSize: 12,
    color: '#666666',
    lineHeight: 16,
  },
  priorityBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#00D4AA',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default ContextualSuggestions;
