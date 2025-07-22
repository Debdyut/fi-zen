import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { FadeInUp } from '../animations/AnimatedCard';
import PersonalizationEngine from '../../utils/PersonalizationEngine';

const FiColors = {
  surface: '#FFFFFF',
  primary: '#00D4AA',
  text: '#1A1A1A',
  textSecondary: '#666666',
  success: '#00D4AA',
  warning: '#FFB800',
  error: '#FF6B6B',
  border: '#E0E0E0',
};

const getRecommendationIcon = (id) => {
  const icons = {
    tax_optimization: '💰',
    portfolio_diversification: '📈',
    emergency_fund: '🛡️',
    goal_planning: '🎯',
    micro_savings: '🪙',
    expense_tracking: '📱'
  };
  return icons[id] || '💡';
};

const getRecommendationDescription = (id) => {
  const descriptions = {
    tax_optimization: 'Maximize your tax deductions and save money',
    portfolio_diversification: 'Build wealth beyond traditional savings',
    emergency_fund: 'Secure 6 months of expenses for peace of mind',
    goal_planning: 'Plan and achieve your major life goals',
    micro_savings: 'Build savings habit with small, manageable amounts',
    expense_tracking: 'Understand where your money goes each month'
  };
  return descriptions[id] || 'Improve your financial health';
};

const getTimeframe = (id) => {
  const timeframes = {
    tax_optimization: '1 month',
    portfolio_diversification: '3 months',
    emergency_fund: '12 months',
    goal_planning: '2 months',
    micro_savings: '1 week',
    expense_tracking: '2 weeks'
  };
  return timeframes[id] || '1 month';
};

const getActionSteps = (id, income = 50000) => {
  const steps = {
    tax_optimization: [
      `Invest ₹${Math.round(150000/12).toLocaleString()}/month in ELSS mutual funds`,
      'Consider PPF for long-term wealth building',
      'Explore NPS for additional ₹50K deduction'
    ],
    emergency_fund: [
      `Save ₹${Math.round(income * 0.15).toLocaleString()}/month in liquid fund`,
      'Automate transfer on salary day',
      'Keep in high-yield savings account'
    ],
    micro_savings: [
      `Start with ₹${Math.round(income * 0.05).toLocaleString()}/month automatic transfer`,
      'Use digital savings apps',
      'Increase by ₹100 every 3 months'
    ]
  };
  return steps[id] || ['Take action to improve your finances'];
};

const IsolatedSmartRecommendationsCard = ({ userProfile, spendingInsights }) => {
  const [expandedRecommendation, setExpandedRecommendation] = useState(null);

  if (!userProfile) return null;

  const baseRecommendations = PersonalizationEngine.getRecommendations(userProfile, spendingInsights);
  
  const recommendations = baseRecommendations.map(rec => ({
    id: rec.id,
    icon: getRecommendationIcon(rec.id),
    title: rec.title,
    description: getRecommendationDescription(rec.id),
    impact: rec.impact,
    difficulty: rec.priority === 'high' ? 'Easy' : 'Medium',
    timeframe: getTimeframe(rec.id),
    steps: getActionSteps(rec.id, userProfile.monthlyIncome),
    category: rec.id
  }));

  const RecommendationItem = ({ recommendation }) => {
    const isExpanded = expandedRecommendation === recommendation.id;
    
    return (
      <View style={styles.recommendationCard}>
        <TouchableOpacity
          style={styles.recommendationHeader}
          onPress={() => setExpandedRecommendation(isExpanded ? null : recommendation.id)}
          activeOpacity={0.7}
        >
          <Text style={styles.recommendationIcon}>{recommendation.icon}</Text>
          <View style={styles.recommendationContent}>
            <Text style={styles.recommendationTitle}>{recommendation.title}</Text>
            <Text style={styles.recommendationDescription}>{recommendation.description}</Text>
          </View>
          <Text style={styles.expandIcon}>{isExpanded ? '▲' : '▼'}</Text>
        </TouchableOpacity>
        
        {isExpanded && (
          <View style={styles.expandedContent}>
            <Text style={styles.stepsTitle}>Action Steps:</Text>
            {recommendation.steps.map((step, stepIndex) => (
              <View key={stepIndex} style={styles.stepItem}>
                <Text style={styles.stepNumber}>{stepIndex + 1}</Text>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Add to Goals</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Smart Recommendations</Text>
        <Text style={styles.sectionSubtitle}>
          Personalized for {userProfile.profession}s earning ₹{Math.round(userProfile.monthlyIncome/1000)}K/month
        </Text>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {recommendations.map((recommendation) => (
          <RecommendationItem 
            key={recommendation.id} 
            recommendation={recommendation} 
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  header: {
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
  },
  recommendationCard: {
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
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 4,
  },
  recommendationIcon: {
    fontSize: 24,
    marginRight: 16,
    marginTop: 2,
  },
  recommendationContent: {
    flex: 1,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: FiColors.text,
    marginBottom: 8,
  },
  recommendationDescription: {
    fontSize: 14,
    color: FiColors.textSecondary,
    lineHeight: 20,
  },
  expandIcon: {
    fontSize: 12,
    color: FiColors.textSecondary,
    marginLeft: 8,
  },
  expandedContent: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: FiColors.border + '30',
  },
  stepsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: FiColors.text,
    marginBottom: 12,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  stepNumber: {
    fontSize: 12,
    fontWeight: '600',
    color: FiColors.primary,
    backgroundColor: FiColors.primary + '20',
    width: 20,
    height: 20,
    borderRadius: 10,
    textAlign: 'center',
    lineHeight: 20,
    marginRight: 12,
  },
  stepText: {
    fontSize: 14,
    color: FiColors.text,
    flex: 1,
    lineHeight: 20,
  },
  actionButton: {
    backgroundColor: FiColors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 16,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default IsolatedSmartRecommendationsCard;