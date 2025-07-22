import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { FadeInUp } from '../animations/AnimatedCard';
import PersonalizationEngine from '../../utils/PersonalizationEngine';

const FiColors = {
  background: '#1A1A1A',
  surface: '#FFFFFF',
  primary: '#00D4AA',
  text: '#1A1A1A',
  textSecondary: '#666666',
  success: '#00D4AA',
  warning: '#FFB800',
  error: '#FF6B6B',
  border: '#E0E0E0',
};

// Move this outside component to prevent recreation
const getPersonalizedRecommendations = (profile, insights) => {
  if (!profile) return [];
  
  // Use PersonalizationEngine for recommendations
  const baseRecommendations = PersonalizationEngine.getRecommendations(profile, insights);
  
  // Convert to detailed format for UI
  return baseRecommendations.map(rec => ({
    id: rec.id,
    icon: getRecommendationIcon(rec.id),
    title: rec.title,
    description: getRecommendationDescription(rec.id, profile),
    impact: rec.impact,
    difficulty: rec.priority === 'high' ? 'Easy' : 'Medium',
    timeframe: getTimeframe(rec.id),
    steps: getActionSteps(rec.id, profile),
    category: rec.id
  }));
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

const getRecommendationDescription = (id, profile) => {
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

const getActionSteps = (id, profile) => {
  const income = profile?.monthlyIncome || 50000;
  
  const steps = {
    tax_optimization: [
      `Invest ₹${Math.round(150000/12).toLocaleString()}/month in ELSS mutual funds`,
      'Consider PPF for long-term wealth building',
      'Explore NPS for additional ₹50K deduction'
    ],
    portfolio_diversification: [
      'Allocate 60% equity, 30% debt, 10% gold',
      'Start SIP in large-cap and mid-cap funds',
      'Consider international diversification'
    ],
    emergency_fund: [
      `Save ₹${Math.round(income * 0.15).toLocaleString()}/month in liquid fund`,
      'Automate transfer on salary day',
      'Keep in high-yield savings account'
    ],
    goal_planning: [
      'Define goals: house, car, vacation',
      'Calculate required monthly SIP',
      'Choose appropriate mutual funds'
    ],
    micro_savings: [
      `Start with ₹${Math.round(income * 0.05).toLocaleString()}/month automatic transfer`,
      'Use digital savings apps',
      'Increase by ₹100 every 3 months'
    ],
    expense_tracking: [
      'Use expense tracking app',
      'Categorize all expenses',
      'Review weekly spending patterns'
    ]
  };
  
  return steps[id] || ['Take action to improve your finances'];
};

const SmartRecommendationsCard = ({ userProfile, spendingInsights }) => {
  const [expandedRecommendation, setExpandedRecommendation] = useState(null);


  const getCategoryColor = (category) => {
    const colors = {
      tax_optimization: '#9333EA',
      investment: '#059669',
      security: '#DC2626',
      planning: '#2563EB',
      habit_building: '#EA580C',
      budgeting: '#7C2D12',
      conservative_investment: '#065F46',
      aggressive_investment: '#B91C1C'
    };
    return colors[category] || FiColors.primary;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return FiColors.success;
      case 'Medium': return FiColors.warning;
      case 'Hard': return FiColors.error;
      default: return FiColors.primary;
    }
  };

  const recommendations = useMemo(() => 
    getPersonalizedRecommendations(userProfile, spendingInsights),
    [userProfile, spendingInsights]
  );

  const RecommendationItem = ({ recommendation, index }) => {
    const isExpanded = expandedRecommendation === recommendation.id;
    const categoryColor = getCategoryColor(recommendation.category);
    
    const handlePress = () => {
      setExpandedRecommendation(prev => prev === recommendation.id ? null : recommendation.id);
    };
    
    return (
      <FadeInUp delay={300 + (index * 100)}>
        <View style={styles.recommendationCard}>
          <TouchableOpacity
            style={styles.recommendationHeader}
            onPress={handlePress}
            activeOpacity={0.7}
          >
            <Text style={styles.recommendationIcon}>{recommendation.icon}</Text>
            <View style={styles.recommendationContent}>
              <View style={styles.titleRow}>
                <Text style={styles.recommendationTitle}>{recommendation.title}</Text>
                <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(recommendation.difficulty) + '20' }]}>
                  <Text style={[styles.difficultyText, { color: getDifficultyColor(recommendation.difficulty) }]}>
                    {recommendation.difficulty}
                  </Text>
                </View>
              </View>
              <Text style={styles.recommendationDescription}>{recommendation.description}</Text>
              <View style={styles.impactRow}>
                <Text style={[styles.impactText, { color: categoryColor }]}>
                  💡 {recommendation.impact}
                </Text>
                <Text style={styles.timeframeText}>⏱️ {recommendation.timeframe}</Text>
              </View>
            </View>
            <View style={styles.expandIndicator}>
              <Text style={styles.expandIcon}>{isExpanded ? '▲' : '▼'}</Text>
            </View>
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
              <TouchableOpacity style={[styles.actionButton, { backgroundColor: categoryColor }]}>
                <Text style={styles.actionButtonText}>Start This Action</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </FadeInUp>
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
        {recommendations.map((recommendation, index) => (
          <RecommendationItem 
            key={recommendation.id} 
            recommendation={recommendation} 
            index={index}
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: FiColors.text,
    flex: 1,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
  },
  recommendationDescription: {
    fontSize: 14,
    color: FiColors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  impactRow: {
    flexDirection: 'column',
    gap: 4,
  },
  impactText: {
    fontSize: 13,
    fontWeight: '600',
  },
  timeframeText: {
    fontSize: 13,
    color: FiColors.textSecondary,
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
  expandIndicator: {
    marginLeft: 8,
    justifyContent: 'center',
  },
  expandIcon: {
    fontSize: 12,
    color: FiColors.textSecondary,
  },
});

export default React.memo(SmartRecommendationsCard, (prevProps, nextProps) => {
  return prevProps.userProfile === nextProps.userProfile && 
         prevProps.spendingInsights === nextProps.spendingInsights;
});
