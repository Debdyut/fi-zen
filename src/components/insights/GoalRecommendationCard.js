// Goal Recommendation Card for Insights Screen
// Shows recommended goals that can be added directly from insights

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TouchableArea } from '../common/AccessibilityHelpers';
import { FadeInUp } from '../animations/AnimatedCard';

const FiColors = {
  primary: '#00D4AA',
  success: '#00D4AA',
  warning: '#FFB800',
  error: '#FF6B6B',
  background: '#FFFFFF',
  surface: '#F8F9FA',
  text: '#1A1A1A',
  textSecondary: '#666666',
  border: '#E0E0E0',
};

const GoalRecommendationCard = ({ recommendation, onAddGoal, onDismiss }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return FiColors.error;
      case 'high': return FiColors.warning;
      case 'medium': return FiColors.primary;
      case 'low': return FiColors.textSecondary;
      default: return FiColors.primary;
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'urgent': return 'URGENT';
      case 'high': return 'HIGH PRIORITY';
      case 'medium': return 'RECOMMENDED';
      case 'low': return 'CONSIDER';
      default: return 'RECOMMENDED';
    }
  };

  return (
    <FadeInUp delay={100}>
      <View style={[styles.card, { borderLeftColor: getPriorityColor(recommendation.priority) }]}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>{recommendation.icon}</Text>
          </View>
          <View style={styles.titleSection}>
            <Text style={styles.title}>{recommendation.title}</Text>
            <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(recommendation.priority) + '20' }]}>
              <Text style={[styles.priorityText, { color: getPriorityColor(recommendation.priority) }]}>
                {getPriorityLabel(recommendation.priority)}
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.description}>{recommendation.description}</Text>

        <View style={styles.reasoningSection}>
          <Text style={styles.reasoningTitle}>Why this goal?</Text>
          <Text style={styles.reasoningText}>{recommendation.reasoning}</Text>
        </View>

        <View style={styles.impactSection}>
          <Text style={styles.impactLabel}>Expected Impact:</Text>
          <Text style={styles.impactValue}>{recommendation.impact}</Text>
        </View>

        <View style={styles.goalDetails}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Target Amount:</Text>
            <Text style={styles.detailValue}>₹{recommendation.targetAmount.toLocaleString()}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Monthly Contribution:</Text>
            <Text style={styles.detailValue}>₹{recommendation.monthlyContribution.toLocaleString()}</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableArea 
            style={[styles.actionButton, styles.addButton]}
            onPress={() => onAddGoal(recommendation)}
          >
            <Text style={styles.addButtonText}>Add This Goal</Text>
          </TouchableArea>
          
          <TouchableArea 
            style={[styles.actionButton, styles.dismissButton]}
            onPress={() => onDismiss(recommendation.goalId)}
          >
            <Text style={styles.dismissButtonText}>Not Now</Text>
          </TouchableArea>
        </View>

        <View style={styles.sourceInfo}>
          <Text style={styles.sourceText}>
            Recommended based on your {recommendation.source.replace('_', ' ')}
          </Text>
        </View>
      </View>
    </FadeInUp>
  );
};

const GoalRecommendationsSection = ({ recommendations, onAddGoal, onDismissRecommendation }) => {
  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>💡 Recommended Goals</Text>
        <Text style={styles.sectionSubtitle}>
          Based on your spending patterns and financial metrics
        </Text>
      </View>

      {recommendations.map(recommendation => (
        <GoalRecommendationCard
          key={recommendation.goalId}
          recommendation={recommendation}
          onAddGoal={onAddGoal}
          onDismiss={onDismissRecommendation}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: FiColors.text,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: FiColors.textSecondary,
    lineHeight: 20,
  },
  
  card: {
    backgroundColor: FiColors.background,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: FiColors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 24,
  },
  titleSection: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: FiColors.text,
    marginBottom: 6,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '600',
  },
  
  description: {
    fontSize: 16,
    color: FiColors.text,
    lineHeight: 22,
    marginBottom: 16,
  },
  
  reasoningSection: {
    backgroundColor: FiColors.surface,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  reasoningTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: FiColors.text,
    marginBottom: 6,
  },
  reasoningText: {
    fontSize: 14,
    color: FiColors.textSecondary,
    lineHeight: 20,
  },
  
  impactSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 12,
    backgroundColor: FiColors.success + '10',
    borderRadius: 8,
  },
  impactLabel: {
    fontSize: 14,
    color: FiColors.textSecondary,
    marginRight: 8,
  },
  impactValue: {
    fontSize: 14,
    fontWeight: '600',
    color: FiColors.success,
    flex: 1,
  },
  
  goalDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: FiColors.textSecondary,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: FiColors.text,
  },
  
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: FiColors.primary,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: FiColors.background,
  },
  dismissButton: {
    backgroundColor: FiColors.surface,
    borderWidth: 1,
    borderColor: FiColors.border,
  },
  dismissButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: FiColors.textSecondary,
  },
  
  sourceInfo: {
    alignItems: 'center',
  },
  sourceText: {
    fontSize: 12,
    color: FiColors.textSecondary,
    fontStyle: 'italic',
  },
});

export { GoalRecommendationCard, GoalRecommendationsSection };
export default GoalRecommendationCard;
