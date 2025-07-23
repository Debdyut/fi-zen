// Goal Recommendation Engine
// Generates goal suggestions from Insights and MetricDetail screens
// Now uses dynamic thresholds instead of hard-coded values

import DynamicThresholdEngine from './DynamicThresholdEngine';

class GoalRecommendationEngine {
  
  // Generate goal recommendations from spending insights
  static getGoalRecommendationsFromInsights(spendingData, userProfile, existingGoals) {
    const recommendations = [];
    
    if (!spendingData || !userProfile) return recommendations;
    
    const monthlySpending = spendingData.monthlySpending || {};
    const income = userProfile.monthlyIncome;
    const existingGoalIds = existingGoals.map(g => g.goalId);
    
    // Get dynamic thresholds for this user
    const thresholds = DynamicThresholdEngine.getSpendingThresholds(userProfile);
    
    // 1. High Entertainment Spending → Entertainment Budget Goal
    const entertainmentSpending = monthlySpending.entertainment || 0;
    const entertainmentThreshold = income * thresholds.entertainment.warning;
    
    if (entertainmentSpending > entertainmentThreshold && !existingGoalIds.includes('entertainment_budget')) {
      const targetBudget = Math.round(income * thresholds.entertainment.target);
      const monthlySavings = entertainmentSpending - targetBudget;
      
      recommendations.push({
        goalId: 'entertainment_budget',
        title: 'Entertainment Budget Control',
        type: 'spending_goal',
        icon: '🎬',
        category: 'Budgeting',
        priority: 'medium',
        source: 'insights_spending_analysis',
        targetAmount: targetBudget * 12,
        currentAmount: 0,
        monthlyContribution: monthlySavings,
        targetDate: new Date(Date.now() + 12 * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        description: `Control entertainment spending to save ₹${monthlySavings.toLocaleString()}/month`,
        reasoning: `You're spending ₹${entertainmentSpending.toLocaleString()}/month on entertainment (${((entertainmentSpending/income)*100).toFixed(1)}% of income). ${thresholds.entertainment.reasoning}. Reducing to ₹${targetBudget.toLocaleString()}/month would free up ₹${monthlySavings.toLocaleString()}/month for other goals.`,
        actionable: true,
        impact: `Save ₹${(monthlySavings * 12).toLocaleString()}/year`
      });
    }
    
    // 2. Low Savings Rate → Emergency Fund Boost
    const totalSpending = Object.values(monthlySpending).reduce((sum, amount) => sum + amount, 0);
    const savingsRate = ((income - totalSpending) / income) * 100;
    const targetSavingsRate = thresholds.savings.target * 100;
    
    if (savingsRate < thresholds.savings.minimum * 100 && !existingGoalIds.includes('emergency_fund_boost')) {
      const additionalSavingsNeeded = Math.round(income * (thresholds.savings.target - (savingsRate/100)));
      
      recommendations.push({
        goalId: 'emergency_fund_boost',
        title: 'Emergency Fund Acceleration',
        type: 'savings_goal',
        icon: '🚨',
        category: 'Safety',
        priority: 'high',
        source: 'insights_savings_analysis',
        targetAmount: income * DynamicThresholdEngine.getEmergencyFundMonths(userProfile.age, income, userProfile.riskProfile),
        currentAmount: (income - totalSpending) * 3,
        monthlyContribution: additionalSavingsNeeded,
        targetDate: new Date(Date.now() + 18 * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        description: `Boost emergency fund with ₹${additionalSavingsNeeded.toLocaleString()}/month additional savings`,
        reasoning: `Your current savings rate is ${savingsRate.toFixed(1)}%. ${thresholds.savings.reasoning}. Increasing to ${targetSavingsRate.toFixed(1)}% would provide better financial security.`,
        actionable: true,
        impact: `Achieve emergency fund ${Math.round((additionalSavingsNeeded * 12) / (income * 6) * 12)} months faster`
      });
    }
    
    // 3. High Income, No Investment Goals → Wealth Building Goal
    if (income > 150000 && !existingGoalIds.some(id => id.includes('investment') || id.includes('wealth'))) {
      const investmentAmount = Math.round(income * 0.20); // 20% for investments
      
      recommendations.push({
        goalId: 'wealth_building_fund',
        title: 'Wealth Building Investment',
        type: 'investment_goal',
        icon: '💎',
        category: 'Investment',
        priority: 'high',
        source: 'insights_income_analysis',
        targetAmount: investmentAmount * 60, // 5 years of investment
        currentAmount: 0,
        monthlyContribution: investmentAmount,
        targetDate: new Date(Date.now() + 60 * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        description: `Build long-term wealth with ₹${investmentAmount.toLocaleString()}/month systematic investment`,
        reasoning: `With your income of ₹${income.toLocaleString()}/month, you should be investing at least 20% for wealth creation. This goal will help build substantial long-term wealth.`,
        actionable: true,
        impact: `Potential wealth of ₹${((investmentAmount * 60 * 1.12)).toLocaleString()} in 5 years (assuming 12% returns)`
      });
    }
    
    return recommendations;
  }
  
  // Generate goal recommendations from metric detail analysis
  static getGoalRecommendationsFromMetrics(metricData, userProfile, existingGoals) {
    const recommendations = [];
    
    if (!metricData || !userProfile) return recommendations;
    
    const existingGoalIds = existingGoals.map(g => g.goalId);
    const income = userProfile.monthlyIncome;
    
    // 1. Low Portfolio Diversification → Diversification Goal
    if (metricData.portfolioDiversification < 0.6 && !existingGoalIds.includes('portfolio_diversification')) {
      recommendations.push({
        goalId: 'portfolio_diversification',
        title: 'Portfolio Diversification',
        type: 'investment_goal',
        icon: '📊',
        category: 'Investment',
        priority: 'medium',
        source: 'metrics_portfolio_analysis',
        targetAmount: income * 12, // 1 year income for diversified portfolio
        currentAmount: metricData.currentPortfolioValue || 0,
        monthlyContribution: Math.max(10000, income * 0.15),
        targetDate: new Date(Date.now() + 24 * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        description: 'Diversify portfolio across asset classes to reduce risk',
        reasoning: `Your portfolio diversification score is ${(metricData.portfolioDiversification * 100).toFixed(0)}%. A well-diversified portfolio should have 80%+ diversification to minimize risk.`,
        actionable: true,
        impact: 'Reduce portfolio risk by 40%'
      });
    }
    
    // 2. High Returns but Low Investment Amount → Investment Scaling Goal
    if (metricData.averageReturns > 15 && metricData.monthlyInvestment < income * 0.20) {
      const currentInvestment = metricData.monthlyInvestment || 0;
      const targetInvestment = income * 0.25; // Scale up to 25%
      const additionalInvestment = targetInvestment - currentInvestment;
      
      recommendations.push({
        goalId: 'investment_scaling',
        title: 'Scale Up Investments',
        type: 'investment_goal',
        icon: '📈',
        category: 'Investment',
        priority: 'high',
        source: 'metrics_returns_analysis',
        targetAmount: targetInvestment * 36, // 3 years of scaled investment
        currentAmount: currentInvestment * 12, // 1 year current investment
        monthlyContribution: additionalInvestment,
        targetDate: new Date(Date.now() + 36 * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        description: `Scale up investments by ₹${additionalInvestment.toLocaleString()}/month to maximize high returns`,
        reasoning: `You're achieving ${metricData.averageReturns}% returns, which is excellent. Increasing your investment amount from ₹${currentInvestment.toLocaleString()} to ₹${targetInvestment.toLocaleString()}/month would significantly accelerate wealth building.`,
        actionable: true,
        impact: `Additional ₹${((additionalInvestment * 36 * (metricData.averageReturns/100))).toLocaleString()} in returns over 3 years`
      });
    }
    
    // 3. Approaching Retirement Age → Retirement Acceleration Goal
    if (userProfile.age > 45 && !existingGoalIds.includes('retirement_acceleration')) {
      const yearsToRetirement = 60 - userProfile.age;
      const requiredMonthlyContribution = Math.round(income * 0.30); // 30% for late-stage retirement planning
      
      recommendations.push({
        goalId: 'retirement_acceleration',
        title: 'Retirement Acceleration Plan',
        type: 'retirement_goal',
        icon: '⏰',
        category: 'Retirement',
        priority: 'urgent',
        source: 'metrics_age_analysis',
        targetAmount: income * 12 * yearsToRetirement * 0.8, // 80% income replacement
        currentAmount: metricData.currentRetirementFund || 0,
        monthlyContribution: requiredMonthlyContribution,
        targetDate: new Date(Date.now() + yearsToRetirement * 12 * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        description: `Accelerate retirement savings with ₹${requiredMonthlyContribution.toLocaleString()}/month`,
        reasoning: `With ${yearsToRetirement} years to retirement, you need to significantly increase retirement contributions to maintain your lifestyle post-retirement.`,
        actionable: true,
        impact: `Secure retirement with ₹${((requiredMonthlyContribution * yearsToRetirement * 12)).toLocaleString()} corpus`
      });
    }
    
    return recommendations;
  }
  
  // Create actionable goal recommendation with "Add Goal" functionality
  static createAddGoalAction(recommendation, onAddGoal) {
    return {
      id: `add_${recommendation.goalId}`,
      type: 'add_goal_recommendation',
      title: `Add "${recommendation.title}" Goal`,
      description: recommendation.description,
      icon: recommendation.icon,
      priority: recommendation.priority,
      source: recommendation.source,
      recommendation: recommendation,
      action: () => onAddGoal(recommendation),
      actionText: 'Add This Goal',
      actionStyle: 'primary'
    };
  }
  
  // Format recommendation for display in Insights/MetricDetail screens
  static formatRecommendationCard(recommendation) {
    return {
      id: recommendation.goalId,
      title: recommendation.title,
      subtitle: recommendation.description,
      icon: recommendation.icon,
      priority: recommendation.priority,
      source: recommendation.source,
      impact: recommendation.impact,
      reasoning: recommendation.reasoning,
      actionable: true,
      actionText: 'Add as Goal',
      actionType: 'add_goal'
    };
  }
}

export default GoalRecommendationEngine;
