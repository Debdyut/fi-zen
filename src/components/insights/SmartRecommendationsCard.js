import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { FadeInUp } from '../animations/AnimatedCard';
import PersonalizationEngine from '../../utils/PersonalizationEngine';
import { useTheme } from '../../theme/ThemeContext';
import { getThemeColors } from '../../theme/consolidatedFiColors';

// Remove hardcoded colors - will use theme colors instead

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
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);


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
      case 'Easy': return colors.success;
      case 'Medium': return colors.warning;
      case 'Hard': return colors.error;
      default: return colors.primary;
    }
  };

  const recommendations = useMemo(() => 
    getPersonalizedRecommendations(userProfile, spendingInsights),
    [userProfile, spendingInsights]
  );

  const RecommendationItem = ({ recommendation, index }) => {
    const isExpanded = expandedRecommendation === recommendation.id;
    const categoryColor = getCategoryColor(recommendation.category);
    const [isBookmarked, setIsBookmarked] = useState(false);
    
    // Progress indicator for recommendation completion
    const ProgressIndicator = ({ difficulty }) => {
      const steps = difficulty === 'Easy' ? 3 : difficulty === 'Medium' ? 5 : 7;
      const completed = Math.floor(Math.random() * steps); // Mock completion
      
      return (
        <View style={styles.progressIndicator}>
          {Array.from({ length: steps }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.progressDot,
                {
                  backgroundColor: i < completed ? categoryColor : '#E0E0E0'
                }
              ]}
            />
          ))}
        </View>
      );
    };
    
    const handlePress = () => {
      setExpandedRecommendation(prev => prev === recommendation.id ? null : recommendation.id);
    };
    
    return (
      <FadeInUp delay={300 + (index * 100)}>
        <View style={[styles.recommendationCard, { backgroundColor: categoryColor + '05' }]}>
          <TouchableOpacity
            style={styles.recommendationHeader}
            onPress={handlePress}
            activeOpacity={0.7}
          >
            <View style={styles.iconContainer}>
              <View style={[styles.iconGradient, { backgroundColor: categoryColor + '15' }]}>
                <Text style={styles.recommendationIcon}>{recommendation.icon}</Text>
              </View>
            </View>
            <View style={styles.recommendationContent}>
              <View style={styles.titleRow}>
                <Text style={styles.recommendationTitle}>{recommendation.title}</Text>
                <View style={styles.headerActions}>
                  <TouchableOpacity 
                    onPress={() => setIsBookmarked(!isBookmarked)}
                    style={styles.bookmarkButton}
                  >
                    <Text style={styles.bookmarkIcon}>
                      {isBookmarked ? '🔖' : '📌'}
                    </Text>
                  </TouchableOpacity>
                  <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(recommendation.difficulty) + '20' }]}>
                    <Text style={[styles.difficultyText, { color: getDifficultyColor(recommendation.difficulty) }]}>
                      {recommendation.difficulty}
                    </Text>
                  </View>
                </View>
              </View>
              <Text style={styles.recommendationDescription}>{recommendation.description}</Text>
              <ProgressIndicator difficulty={recommendation.difficulty} />
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
              <View style={styles.expandedActions}>
                <TouchableOpacity 
                  style={[styles.actionButton, { backgroundColor: categoryColor }]}
                  onPress={() => console.log('Start action')}
                >
                  <Text style={styles.actionButtonText}>▶️ Start This Action</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.secondaryActionButton, { borderColor: categoryColor }]}
                  onPress={() => console.log('Learn more')}
                >
                  <Text style={[styles.secondaryActionText, { color: categoryColor }]}>
                    📚 Learn More
                  </Text>
                </TouchableOpacity>
              </View>
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
      color: colors.text,
      marginBottom: 4,
    },
    sectionSubtitle: {
      fontSize: 14,
      color: colors.textSecondary,
    },
  recommendationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 170, 0.1)',
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    marginRight: 12,
  },
  iconGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recommendationIcon: {
    fontSize: 20,
  },
  recommendationContent: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bookmarkButton: {
    padding: 2,
  },
  bookmarkIcon: {
    fontSize: 14,
  },
    recommendationTitle: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.text,
      flex: 1,
      marginRight: 8,
      lineHeight: 20,
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
      fontSize: 13,
      color: colors.textSecondary,
      lineHeight: 18,
      marginBottom: 8,
    },
  progressIndicator: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 8,
  },
  progressDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  impactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  impactText: {
    fontSize: 12,
    fontWeight: '500',
    flex: 1,
  },
    timeframeText: {
      fontSize: 12,
      color: colors.textSecondary,
      fontWeight: '500',
    },
  expandedContent: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
    stepsTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
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
      color: colors.primary,
      backgroundColor: colors.primary + '20',
      width: 20,
      height: 20,
      borderRadius: 10,
      textAlign: 'center',
      lineHeight: 20,
      marginRight: 12,
    },
    stepText: {
      fontSize: 13,
      color: colors.text,
      flex: 1,
      lineHeight: 18,
    },
  expandedActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
    actionButton: {
      flex: 1,
      backgroundColor: colors.primary,
      borderRadius: 8,
      paddingVertical: 10,
      paddingHorizontal: 16,
      alignItems: 'center',
    },
  secondaryActionButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  secondaryActionText: {
    fontSize: 12,
    fontWeight: '600',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  expandIndicator: {
    marginLeft: 8,
    justifyContent: 'center',
  },
    expandIcon: {
      fontSize: 12,
      color: colors.textSecondary,
    },
  });

export default React.memo(SmartRecommendationsCard, (prevProps, nextProps) => {
  return prevProps.userProfile === nextProps.userProfile && 
         prevProps.spendingInsights === nextProps.spendingInsights;
});
