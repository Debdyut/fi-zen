import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useThemedStyles } from '../../theme/useThemedStyles';

const SmartGoalsCard = ({ user, onChatRequest, size = 'medium' }) => {
  const styles = useThemedStyles(createStyles);

  const handleChatPress = () => {
    const message = `I'm a ${user.profile?.profession} earning ₹${user.profile?.monthlyIncome || user.monthlyIncome}. Help me set realistic financial goals.`;
    onChatRequest?.(message);
  };

  const getGoalsStatus = () => {
    const goals = user.goals || [];
    if (goals.length === 0) {
      return {
        title: 'Set Your Goals',
        subtitle: 'Start your financial journey',
        status: 'Get Started',
        color: '#00D4AA'
      };
    }
    
    const completedGoals = goals.filter(g => g.completed).length;
    return {
      title: 'Financial Goals',
      subtitle: `${completedGoals}/${goals.length} completed`,
      status: 'On Track',
      color: '#51CF66'
    };
  };

  const goalsStatus = getGoalsStatus();

  return (
    <View style={[styles.card, styles[`${size}Card`]]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{goalsStatus.title}</Text>
          <Text style={styles.subtitle}>{goalsStatus.subtitle}</Text>
        </View>
        <TouchableOpacity 
          style={styles.chatButton}
          onPress={handleChatPress}
        >
          <Text style={styles.chatIcon}>💬</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.statusContainer}>
          <Text style={styles.statusIcon}>🎯</Text>
          <Text style={[styles.statusText, { color: goalsStatus.color }]}>
            {goalsStatus.status}
          </Text>
        </View>

        {/* Quick suggestions */}
        <View style={styles.suggestionsContainer}>
          <Text style={styles.suggestionsTitle}>Popular Goals:</Text>
          <Text style={styles.suggestionItem}>• Emergency Fund</Text>
          <Text style={styles.suggestionItem}>• Home Purchase</Text>
          <Text style={styles.suggestionItem}>• Retirement Planning</Text>
        </View>
      </View>

      {/* Action Button */}
      <TouchableOpacity 
        style={styles.actionButton}
        onPress={() => onChatRequest?.('Help me create a personalized financial goal plan')}
      >
        <Text style={styles.actionText}>
          {user.goals?.length > 0 ? 'Review Goals' : 'Create Goals'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const createStyles = (theme) => StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  largeCard: {
    minHeight: 280,
  },
  mediumCard: {
    minHeight: 200,
  },
  smallCard: {
    minHeight: 140,
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
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  chatButton: {
    backgroundColor: '#00D4AA',
    borderRadius: 18,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatIcon: {
    fontSize: 14,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
  },
  suggestionsContainer: {
    marginBottom: 16,
  },
  suggestionsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginBottom: 8,
  },
  suggestionItem: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 4,
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

export default SmartGoalsCard;
