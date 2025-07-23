// Cross-Screen Integration Engine
// Connects Goals ↔ Insights ↔ MetricDetail for actionable recommendations

class CrossScreenIntegration {
  
  // Generate actionable insights from spending patterns to goals
  static getGoalImpactInsights(userGoals, spendingData, userProfile) {
    const insights = [];
    
    if (!spendingData || !userGoals) return insights;
    
    const monthlySpending = spendingData.monthlySpending || {};
    const totalSpending = Object.values(monthlySpending).reduce((sum, amount) => sum + amount, 0);
    const income = userProfile.monthlyIncome;
    const savingsRate = ((income - totalSpending) / income) * 100;
    
    userGoals.forEach(goal => {
      const monthsToGoal = Math.ceil((goal.targetAmount - goal.currentAmount) / goal.monthlyContribution);
      
      // Analyze spending categories that could accelerate goal achievement
      const spendingOptimizations = this.findSpendingOptimizations(monthlySpending, goal, income);
      
      if (spendingOptimizations.length > 0) {
        insights.push({
          goalId: goal.goalId,
          goalTitle: goal.title,
          type: 'spending_optimization',
          priority: goal.priority,
          currentTimeline: monthsToGoal,
          optimizations: spendingOptimizations,
          potentialSavings: spendingOptimizations.reduce((sum, opt) => sum + opt.monthlySavings, 0),
          acceleratedTimeline: this.calculateAcceleratedTimeline(goal, spendingOptimizations),
          actionable: true,
          navigateTo: 'Insights',
          navigationParams: { 
            highlightCategory: spendingOptimizations[0].category,
            goalContext: goal.goalId 
          }
        });
      }
      
      // Check if goal is at risk due to spending patterns
      const riskFactors = this.identifyGoalRisks(goal, monthlySpending, savingsRate);
      if (riskFactors.length > 0) {
        insights.push({
          goalId: goal.goalId,
          goalTitle: goal.title,
          type: 'goal_risk',
          priority: 'high',
          riskFactors: riskFactors,
          actionable: true,
          navigateTo: 'Insights',
          navigationParams: { 
            focusArea: 'spending_analysis',
            goalContext: goal.goalId 
          }
        });
      }
    });
    
    return insights;
  }
  
  // Find spending categories that can be optimized for goal achievement
  static findSpendingOptimizations(monthlySpending, goal, income) {
    const optimizations = [];
    
    // Define optimization potential by category and user income level
    const optimizationRules = {
      entertainment: { 
        maxReduction: income < 100000 ? 0.3 : 0.2, // 30% for low income, 20% for high
        priority: 'medium',
        message: 'Reduce entertainment expenses'
      },
      food: { 
        maxReduction: 0.15, // Max 15% reduction in food
        priority: 'low',
        message: 'Optimize dining out expenses'
      },
      shopping: { 
        maxReduction: 0.4, // Up to 40% reduction in shopping
        priority: 'high',
        message: 'Cut non-essential shopping'
      },
      travel: { 
        maxReduction: 0.5, // Up to 50% reduction in travel
        priority: 'medium',
        message: 'Reduce travel expenses temporarily'
      },
      miscellaneous: { 
        maxReduction: 0.3,
        priority: 'medium',
        message: 'Optimize miscellaneous expenses'
      }
    };
    
    Object.entries(monthlySpending).forEach(([category, amount]) => {
      const rule = optimizationRules[category];
      if (rule && amount > 0) {
        const potentialSavings = amount * rule.maxReduction;
        
        // Only suggest if savings are meaningful (>₹1000/month)
        if (potentialSavings >= 1000) {
          optimizations.push({
            category: category,
            currentSpending: amount,
            suggestedReduction: potentialSavings,
            monthlySavings: potentialSavings,
            priority: rule.priority,
            message: rule.message,
            impactOnGoal: this.calculateGoalImpact(goal, potentialSavings)
          });
        }
      }
    });
    
    // Sort by potential impact on goal
    return optimizations.sort((a, b) => b.monthlySavings - a.monthlySavings);
  }
  
  // Calculate how spending optimization affects goal timeline
  static calculateGoalImpact(goal, additionalMonthlySavings) {
    const currentTimeline = Math.ceil((goal.targetAmount - goal.currentAmount) / goal.monthlyContribution);
    const newContribution = goal.monthlyContribution + additionalMonthlySavings;
    const newTimeline = Math.ceil((goal.targetAmount - goal.currentAmount) / newContribution);
    
    return {
      timeReduction: currentTimeline - newTimeline,
      newTimeline: newTimeline,
      percentageImprovement: ((currentTimeline - newTimeline) / currentTimeline * 100).toFixed(1)
    };
  }
  
  // Calculate accelerated timeline with all optimizations
  static calculateAcceleratedTimeline(goal, optimizations) {
    const totalAdditionalSavings = optimizations.reduce((sum, opt) => sum + opt.monthlySavings, 0);
    const newContribution = goal.monthlyContribution + totalAdditionalSavings;
    return Math.ceil((goal.targetAmount - goal.currentAmount) / newContribution);
  }
  
  // Identify risks to goal achievement
  static identifyGoalRisks(goal, monthlySpending, savingsRate) {
    const risks = [];
    
    // Low savings rate risk
    if (savingsRate < 10) {
      risks.push({
        type: 'low_savings_rate',
        severity: 'high',
        message: `Your ${savingsRate.toFixed(1)}% savings rate may delay goal achievement`,
        recommendation: 'Increase income or reduce expenses to improve savings rate'
      });
    }
    
    // High discretionary spending risk
    const discretionarySpending = (monthlySpending.entertainment || 0) + 
                                 (monthlySpending.shopping || 0) + 
                                 (monthlySpending.travel || 0);
    
    if (discretionarySpending > goal.monthlyContribution * 1.5) {
      risks.push({
        type: 'high_discretionary_spending',
        severity: 'medium',
        message: `Discretionary spending (₹${discretionarySpending.toLocaleString()}) exceeds goal contribution`,
        recommendation: 'Consider redirecting some discretionary spending to goal savings'
      });
    }
    
    // Goal timeline risk (too long)
    const monthsToGoal = Math.ceil((goal.targetAmount - goal.currentAmount) / goal.monthlyContribution);
    if (monthsToGoal > 60) { // More than 5 years
      risks.push({
        type: 'extended_timeline',
        severity: 'medium',
        message: `Goal timeline of ${monthsToGoal} months may be too long`,
        recommendation: 'Consider increasing monthly contribution or adjusting goal amount'
      });
    }
    
    return risks;
  }
  
  // Generate navigation actions for cross-screen flow
  static getNavigationActions(goalId, userGoals, insights) {
    const goal = userGoals.find(g => g.goalId === goalId);
    if (!goal) return [];
    
    const actions = [];
    
    // Action to view detailed spending analysis
    actions.push({
      id: 'view_spending_impact',
      title: 'Analyze Spending Impact',
      description: `See how your spending affects ${goal.title}`,
      icon: '📊',
      navigateTo: 'Insights',
      params: { 
        highlightGoal: goalId,
        focusArea: 'spending_analysis'
      },
      priority: 'high'
    });
    
    // Action to view goal performance metrics
    actions.push({
      id: 'view_goal_metrics',
      title: 'Goal Performance Analysis',
      description: `Deep dive into ${goal.title} metrics and projections`,
      icon: '📈',
      navigateTo: 'MetricDetail',
      params: { 
        cardId: 'goal_performance',
        goalId: goalId
      },
      priority: 'medium'
    });
    
    // Action to optimize spending for goal
    const goalInsights = insights.filter(i => i.goalId === goalId);
    const optimizationInsight = goalInsights.find(i => i.type === 'spending_optimization');
    
    if (optimizationInsight) {
      actions.push({
        id: 'optimize_spending',
        title: 'Optimize Spending for Goal',
        description: `Save ₹${optimizationInsight.potentialSavings.toLocaleString()}/month to achieve goal faster`,
        icon: '⚡',
        navigateTo: 'Insights',
        params: { 
          highlightCategory: optimizationInsight.optimizations[0].category,
          goalContext: goalId,
          showOptimization: true
        },
        priority: 'high',
        impact: `${optimizationInsight.currentTimeline - optimizationInsight.acceleratedTimeline} months faster`
      });
    }
    
    return actions.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }
  
  // Generate insights for MetricDetail screen based on goal context
  static getMetricDetailInsights(cardId, goalContext, userProfile, portfolio) {
    if (!goalContext) return null;
    
    const insights = {
      goalRelated: true,
      goalId: goalContext,
      metrics: [],
      recommendations: [],
      projections: []
    };
    
    // Add goal-specific metrics
    if (cardId === 'portfolio_value') {
      insights.metrics.push({
        label: 'Portfolio Contribution to Goals',
        value: this.calculatePortfolioGoalContribution(portfolio, goalContext),
        trend: 'positive',
        description: 'How much your portfolio growth contributes to goal achievement'
      });
    }
    
    if (cardId === 'investment_returns') {
      insights.projections.push({
        scenario: 'Current Returns',
        timeline: this.calculateGoalTimelineWithReturns(goalContext, portfolio.averageReturns),
        description: 'Goal timeline with current investment performance'
      });
      
      insights.projections.push({
        scenario: 'Optimized Returns',
        timeline: this.calculateGoalTimelineWithReturns(goalContext, portfolio.averageReturns * 1.2),
        description: 'Goal timeline with 20% better returns through optimization'
      });
    }
    
    return insights;
  }
  
  // Helper methods
  static calculatePortfolioGoalContribution(portfolio, goalId) {
    // Simplified calculation - in real app, this would be more sophisticated
    const monthlyGrowth = (portfolio.totalValue * 0.12) / 12; // Assuming 12% annual growth
    return `₹${monthlyGrowth.toLocaleString()}/month`;
  }
  
  static calculateGoalTimelineWithReturns(goalId, returnRate) {
    // Simplified calculation - would use actual goal data in real implementation
    return `${Math.ceil(36 / (returnRate / 12))} months`;
  }
}

export default CrossScreenIntegration;
