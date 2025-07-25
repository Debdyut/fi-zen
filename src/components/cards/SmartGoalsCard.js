import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';


const SmartGoalsCard = ({ user, onChatRequest, size = 'medium' }) => {
  const styles = createStyles();

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
        color: '#00D4AA',
        progress: 0
      };
    }
    
    const completedGoals = goals.filter(g => g.completed).length;
    const progress = (completedGoals / goals.length) * 100;
    
    let status, color;
    if (progress === 100) {
      status = 'All Complete!';
      color = '#51CF66';
    } else if (progress >= 50) {
      status = 'Great Progress';
      color = '#69DB7C';
    } else if (progress > 0) {
      status = 'Getting Started';
      color = '#FFB347';
    } else {
      status = 'Just Started';
      color = '#FF8787';
    }
    
    return {
      title: 'Financial Goals',
      subtitle: `${completedGoals}/${goals.length} completed`,
      status,
      color,
      progress
    };
  };

  const getPersonalizedGoals = () => {
    const age = user.profile?.age || 30;
    const income = user.profile?.monthlyIncome || user.monthlyIncome || 50000;
    const profession = user.profile?.profession || 'Professional';
    
    const suggestions = [];
    
    // Age-based suggestions
    if (age < 30) {
      suggestions.push('• Emergency Fund (6 months)');
      suggestions.push('• Career Development Fund');
      suggestions.push('• First Home Down Payment');
    } else if (age < 40) {
      suggestions.push('• Home Purchase/Upgrade');
      suggestions.push('• Children\'s Education Fund');
      suggestions.push('• Retirement Planning Start');
    } else {
      suggestions.push('• Retirement Corpus Building');
      suggestions.push('• Healthcare Emergency Fund');
      suggestions.push('• Wealth Preservation');
    }
    
    return suggestions.slice(0, 3);
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
          <View style={styles.statusTextContainer}>
            <Text style={[styles.statusText, { color: goalsStatus.color }]}>
              {goalsStatus.status}
            </Text>
            {user.goals?.length > 0 && (
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { 
                        width: `${goalsStatus.progress}%`,
                        backgroundColor: goalsStatus.color 
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.progressText}>{Math.round(goalsStatus.progress)}%</Text>
              </View>
            )}
          </View>
        </View>

        {/* Personalized suggestions */}
        <View style={styles.suggestionsContainer}>
          <Text style={styles.suggestionsTitle}>
            {user.goals?.length > 0 ? 'Your Active Goals:' : 'Recommended for You:'}
          </Text>
          {user.goals?.length > 0 ? (
            user.goals.slice(0, 3).map((goal, index) => (
              <View key={index} style={styles.goalItem}>
                <Text style={styles.suggestionItem}>
                  {goal.completed ? '✅' : '⏳'} {goal.title || goal.name || `Goal ${index + 1}`}
                </Text>
                {goal.targetAmount && (
                  <Text style={styles.goalAmount}>
                    ₹{goal.targetAmount.toLocaleString()}
                  </Text>
                )}
              </View>
            ))
          ) : (
            getPersonalizedGoals().map((suggestion, index) => (
              <Text key={index} style={styles.suggestionItem}>{suggestion}</Text>
            ))
          )}
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

const createStyles = () => StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
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
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
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
    paddingVertical: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  statusIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  statusTextContainer: {
    flex: 1,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    marginRight: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '600',
    minWidth: 30,
  },
  suggestionsContainer: {
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  suggestionsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  goalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingLeft: 8,
  },
  suggestionItem: {
    fontSize: 13,
    color: '#666666',
    marginBottom: 6,
    fontWeight: '500',
    paddingLeft: 8,
    flex: 1,
  },
  goalAmount: {
    fontSize: 12,
    color: '#00D4AA',
    fontWeight: '600',
  },
  actionButton: {
    backgroundColor: '#00D4AA',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});

export default SmartGoalsCard;
