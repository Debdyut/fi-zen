// Cross-Screen Action Components
// Provides actionable navigation between Goals, Insights, and MetricDetail

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
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

// Individual action card component
const ActionCard = ({ action, onPress }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return FiColors.error;
      case 'medium': return FiColors.warning;
      case 'low': return FiColors.primary;
      default: return FiColors.primary;
    }
  };

  return (
    <FadeInUp delay={100}>
      <TouchableArea 
        style={[styles.actionCard, { borderLeftColor: getPriorityColor(action.priority) }]}
        onPress={() => onPress(action)}
      >
        <View style={styles.actionHeader}>
          <Text style={styles.actionIcon}>{action.icon}</Text>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>{action.title}</Text>
            <Text style={styles.actionDescription}>{action.description}</Text>
            {action.impact && (
              <Text style={[styles.actionImpact, { color: getPriorityColor(action.priority) }]}>
                Impact: {action.impact}
              </Text>
            )}
          </View>
          <Text style={styles.actionArrow}>→</Text>
        </View>
      </TouchableArea>
    </FadeInUp>
  );
};

// Spending optimization insight card
const OptimizationInsight = ({ insight, onNavigate }) => {
  if (insight.type !== 'spending_optimization') return null;

  return (
    <FadeInUp delay={200}>
      <View style={styles.optimizationCard}>
        <View style={styles.optimizationHeader}>
          <Text style={styles.optimizationIcon}>⚡</Text>
          <View>
            <Text style={styles.optimizationTitle}>Speed Up Your Goal</Text>
            <Text style={styles.optimizationSubtitle}>
              Optimize spending to achieve {insight.goalTitle} faster
            </Text>
          </View>
        </View>

        <View style={styles.optimizationContent}>
          <View style={styles.optimizationStat}>
            <Text style={styles.statValue}>₹{insight.potentialSavings.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Monthly Savings Potential</Text>
          </View>
          <View style={styles.optimizationStat}>
            <Text style={styles.statValue}>
              {insight.currentTimeline - insight.acceleratedTimeline} months
            </Text>
            <Text style={styles.statLabel}>Faster Achievement</Text>
          </View>
        </View>

        <View style={styles.optimizationActions}>
          {insight.optimizations.slice(0, 2).map((opt, index) => (
            <TouchableArea
              key={index}
              style={styles.optimizationAction}
              onPress={() => onNavigate('Insights', {
                highlightCategory: opt.category,
                goalContext: insight.goalId
              })}
            >
              <Text style={styles.optimizationActionText}>
                {opt.message}: Save ₹{opt.monthlySavings.toLocaleString()}
              </Text>
              <Text style={styles.optimizationActionArrow}>→</Text>
            </TouchableArea>
          ))}
        </View>
      </View>
    </FadeInUp>
  );
};

// Goal risk warning card
const RiskWarning = ({ insight, onNavigate }) => {
  if (insight.type !== 'goal_risk') return null;

  return (
    <FadeInUp delay={300}>
      <View style={styles.riskCard}>
        <View style={styles.riskHeader}>
          <Text style={styles.riskIcon}>⚠️</Text>
          <View>
            <Text style={styles.riskTitle}>Goal at Risk</Text>
            <Text style={styles.riskSubtitle}>
              {insight.goalTitle} may be delayed
            </Text>
          </View>
        </View>

        <View style={styles.riskContent}>
          {insight.riskFactors.slice(0, 2).map((risk, index) => (
            <View key={index} style={styles.riskFactor}>
              <Text style={styles.riskMessage}>{risk.message}</Text>
              <Text style={styles.riskRecommendation}>{risk.recommendation}</Text>
            </View>
          ))}
        </View>

        <TouchableArea
          style={styles.riskAction}
          onPress={() => onNavigate('Insights', insight.navigationParams)}
        >
          <Text style={styles.riskActionText}>Analyze Spending Patterns</Text>
          <Text style={styles.riskActionArrow}>→</Text>
        </TouchableArea>
      </View>
    </FadeInUp>
  );
};

// Main cross-screen actions component
const CrossScreenActions = ({ 
  goalId, 
  userGoals, 
  insights, 
  navigation,
  showOptimizations = true,
  showRisks = true 
}) => {
  const goal = userGoals.find(g => g.goalId === goalId);
  if (!goal) return null;

  const goalInsights = insights.filter(i => i.goalId === goalId);
  const optimizationInsight = goalInsights.find(i => i.type === 'spending_optimization');
  const riskInsight = goalInsights.find(i => i.type === 'goal_risk');

  const handleNavigation = (screenName, params = {}) => {
    navigation.navigate(screenName, {
      ...params,
      fromGoals: true,
      goalContext: goalId
    });
  };

  const quickActions = [
    {
      id: 'view_spending_impact',
      title: 'Spending Impact Analysis',
      description: `See how your spending affects ${goal.title}`,
      icon: '📊',
      priority: 'high',
      navigateTo: 'Insights'
    },
    {
      id: 'view_goal_metrics',
      title: 'Goal Performance',
      description: `Detailed metrics and projections for ${goal.title}`,
      icon: '📈',
      priority: 'medium',
      navigateTo: 'MetricDetail'
    }
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Take Action on Your Goal</Text>

      {/* Optimization Insights */}
      {showOptimizations && optimizationInsight && (
        <OptimizationInsight 
          insight={optimizationInsight} 
          onNavigate={handleNavigation}
        />
      )}

      {/* Risk Warnings */}
      {showRisks && riskInsight && (
        <RiskWarning 
          insight={riskInsight} 
          onNavigate={handleNavigation}
        />
      )}

      {/* Quick Actions */}
      <View style={styles.quickActionsSection}>
        <Text style={styles.quickActionsTitle}>Quick Actions</Text>
        {quickActions.map(action => (
          <ActionCard
            key={action.id}
            action={action}
            onPress={() => handleNavigation(action.navigateTo, {
              highlightGoal: goalId,
              focusArea: action.id === 'view_spending_impact' ? 'spending_analysis' : 'goal_performance'
            })}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: FiColors.background,
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: FiColors.text,
    marginBottom: 16,
  },
  
  // Action Card Styles
  actionCard: {
    backgroundColor: FiColors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: FiColors.text,
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 14,
    color: FiColors.textSecondary,
    lineHeight: 20,
  },
  actionImpact: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  actionArrow: {
    fontSize: 18,
    color: FiColors.primary,
    fontWeight: '600',
  },

  // Optimization Card Styles
  optimizationCard: {
    backgroundColor: '#E6FBF7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: FiColors.success + '40',
  },
  optimizationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  optimizationIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  optimizationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: FiColors.text,
  },
  optimizationSubtitle: {
    fontSize: 14,
    color: FiColors.textSecondary,
    marginTop: 2,
  },
  optimizationContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  optimizationStat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: FiColors.success,
  },
  statLabel: {
    fontSize: 12,
    color: FiColors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  optimizationActions: {
    gap: 8,
  },
  optimizationAction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: FiColors.background,
    borderRadius: 8,
    padding: 12,
  },
  optimizationActionText: {
    fontSize: 14,
    color: FiColors.text,
    flex: 1,
  },
  optimizationActionArrow: {
    fontSize: 16,
    color: FiColors.success,
    fontWeight: '600',
  },

  // Risk Card Styles
  riskCard: {
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: FiColors.warning + '40',
  },
  riskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  riskIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  riskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: FiColors.text,
  },
  riskSubtitle: {
    fontSize: 14,
    color: FiColors.textSecondary,
    marginTop: 2,
  },
  riskContent: {
    marginBottom: 12,
  },
  riskFactor: {
    marginBottom: 8,
  },
  riskMessage: {
    fontSize: 14,
    color: FiColors.text,
    fontWeight: '500',
  },
  riskRecommendation: {
    fontSize: 12,
    color: FiColors.textSecondary,
    marginTop: 2,
  },
  riskAction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: FiColors.background,
    borderRadius: 8,
    padding: 12,
  },
  riskActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: FiColors.warning,
  },
  riskActionArrow: {
    fontSize: 16,
    color: FiColors.warning,
    fontWeight: '600',
  },

  // Quick Actions Styles
  quickActionsSection: {
    marginTop: 8,
  },
  quickActionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: FiColors.text,
    marginBottom: 12,
  },
});

export default CrossScreenActions;
