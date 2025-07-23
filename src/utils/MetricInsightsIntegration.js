// MetricDetail ↔ Insights Integration Engine
// Creates actionable connections between investment metrics and spending patterns

class MetricInsightsIntegration {
  
  // Generate insights-related actions from metric analysis
  static getInsightsActions(cardId, metricData, userProfile) {
    const actions = [];
    
    switch (cardId) {
      case 'portfolio_value':
        actions.push(...this.getPortfolioInsightsActions(metricData, userProfile));
        break;
      case 'asset_allocation':
        actions.push(...this.getAllocationInsightsActions(metricData, userProfile));
        break;
      case 'investment_returns':
        actions.push(...this.getReturnsInsightsActions(metricData, userProfile));
        break;
      default:
        actions.push(...this.getGeneralInsightsActions(metricData, userProfile));
    }
    
    return actions;
  }
  
  // Portfolio value insights actions
  static getPortfolioInsightsActions(metricData, userProfile) {
    const actions = [];
    const income = userProfile.monthlyIncome;
    const portfolioValue = metricData.totalValue || 0;
    const portfolioToIncomeRatio = portfolioValue / (income * 12);
    
    // Low portfolio value → Check spending patterns
    if (portfolioToIncomeRatio < 1.0) { // Less than 1 year income
      actions.push({
        id: 'analyze_spending_for_investment',
        title: 'Analyze Spending for Investment Opportunities',
        description: `Your portfolio is ${portfolioToIncomeRatio.toFixed(1)}x your annual income. Let's find money to invest.`,
        icon: '🔍',
        priority: 'high',
        navigateTo: 'Insights',
        params: {
          focusArea: 'investment_opportunities',
          context: 'low_portfolio_value',
          highlightCategories: ['entertainment', 'shopping', 'miscellaneous']
        },
        reasoning: 'Identify spending categories where you can redirect money to investments'
      });
    }
    
    // High cash, low investment → Savings behavior analysis
    if (metricData.cashPercentage > 40) {
      actions.push({
        id: 'analyze_savings_behavior',
        title: 'Review Savings vs Investment Strategy',
        description: `${metricData.cashPercentage}% of your portfolio is in cash. Analyze your savings patterns.`,
        icon: '💰',
        priority: 'medium',
        navigateTo: 'Insights',
        params: {
          focusArea: 'savings_analysis',
          context: 'high_cash_allocation',
          showSavingsRate: true
        },
        reasoning: 'Understand why you\'re holding too much cash instead of investing'
      });
    }
    
    return actions;
  }
  
  // Asset allocation insights actions
  static getAllocationInsightsActions(metricData, userProfile) {
    const actions = [];
    const age = userProfile.age;
    const riskProfile = userProfile.riskProfile;
    
    // Poor diversification → Investment behavior analysis
    if (metricData.diversificationScore < 0.6) {
      actions.push({
        id: 'analyze_investment_behavior',
        title: 'Analyze Investment Decision Patterns',
        description: `Portfolio diversification is ${(metricData.diversificationScore * 100).toFixed(0)}%. Review your investment approach.`,
        icon: '📊',
        priority: 'high',
        navigateTo: 'Insights',
        params: {
          focusArea: 'investment_behavior',
          context: 'poor_diversification',
          showInvestmentPatterns: true
        },
        reasoning: 'Understand what\'s causing concentration in your portfolio'
      });
    }
    
    // Age-inappropriate allocation → Risk assessment
    const recommendedEquity = Math.max(20, 100 - age);
    const actualEquity = metricData.equityPercentage || 0;
    
    if (Math.abs(actualEquity - recommendedEquity) > 20) {
      const isOverAllocated = actualEquity > recommendedEquity;
      actions.push({
        id: 'review_risk_spending_patterns',
        title: `Review ${isOverAllocated ? 'Risk Tolerance' : 'Conservative'} Spending Patterns`,
        description: `Your ${actualEquity}% equity allocation ${isOverAllocated ? 'exceeds' : 'is below'} age-appropriate ${recommendedEquity}%.`,
        icon: isOverAllocated ? '⚡' : '🛡️',
        priority: 'medium',
        navigateTo: 'Insights',
        params: {
          focusArea: 'risk_analysis',
          context: isOverAllocated ? 'over_risk' : 'under_risk',
          showRiskPatterns: true
        },
        reasoning: `Analyze spending patterns that reflect your ${isOverAllocated ? 'aggressive' : 'conservative'} approach`
      });
    }
    
    return actions;
  }
  
  // Investment returns insights actions
  static getReturnsInsightsActions(metricData, userProfile) {
    const actions = [];
    const returns = metricData.overallReturnPercentage || 0;
    const income = userProfile.monthlyIncome;
    
    // Poor returns → Investment vs spending analysis
    if (returns < 8) {
      actions.push({
        id: 'compare_returns_vs_spending',
        title: 'Compare Investment Returns vs Spending Growth',
        description: `Your ${returns}% returns are below market average. Compare with your spending trends.`,
        icon: '📉',
        priority: 'high',
        navigateTo: 'Insights',
        params: {
          focusArea: 'returns_vs_spending',
          context: 'poor_returns',
          showSpendingTrends: true,
          highlightGrowthCategories: true
        },
        reasoning: 'See if increasing spending is offsetting investment gains'
      });
    }
    
    // Excellent returns but low investment amount → Opportunity analysis
    if (returns > 15 && metricData.monthlyInvestment < income * 0.20) {
      actions.push({
        id: 'find_more_investment_money',
        title: 'Find More Money for High-Performing Investments',
        description: `Your ${returns}% returns are excellent! Find more money to invest from spending analysis.`,
        icon: '🚀',
        priority: 'high',
        navigateTo: 'Insights',
        params: {
          focusArea: 'investment_scaling',
          context: 'high_returns_low_amount',
          highlightOptimizableSpending: true
        },
        reasoning: 'Maximize your excellent returns by investing more'
      });
    }
    
    return actions;
  }
  
  // General insights actions
  static getGeneralInsightsActions(metricData, userProfile) {
    return [
      {
        id: 'comprehensive_financial_analysis',
        title: 'Comprehensive Financial Health Analysis',
        description: 'Get a complete view of how your spending patterns affect your investment performance.',
        icon: '🔬',
        priority: 'medium',
        navigateTo: 'Insights',
        params: {
          focusArea: 'comprehensive_analysis',
          context: 'from_metrics',
          showAllCategories: true
        },
        reasoning: 'Understand the complete picture of your financial behavior'
      }
    ];
  }
  
  // Generate metric-specific insights for Insights screen
  static getMetricContextForInsights(fromMetricId, metricData, userProfile) {
    return {
      sourceMetric: fromMetricId,
      metricData: metricData,
      userProfile: userProfile,
      contextualAnalysis: this.getContextualAnalysis(fromMetricId, metricData, userProfile),
      recommendedActions: this.getRecommendedActions(fromMetricId, metricData, userProfile)
    };
  }
  
  // Contextual analysis based on metric
  static getContextualAnalysis(metricId, metricData, userProfile) {
    switch (metricId) {
      case 'portfolio_value':
        return {
          focus: 'investment_capacity',
          message: 'Analyzing spending patterns to identify investment opportunities',
          categories: ['entertainment', 'shopping', 'miscellaneous'],
          goal: 'Find money to boost your portfolio value'
        };
      case 'investment_returns':
        return {
          focus: 'return_optimization',
          message: 'Comparing investment performance with spending efficiency',
          categories: ['all'],
          goal: 'Optimize the balance between spending and investing'
        };
      default:
        return {
          focus: 'general_analysis',
          message: 'Comprehensive financial behavior analysis',
          categories: ['all'],
          goal: 'Improve overall financial health'
        };
    }
  }
  
  // Recommended actions for insights screen
  static getRecommendedActions(metricId, metricData, userProfile) {
    const actions = [];
    
    // Add specific recommendations based on metric analysis
    if (metricId === 'portfolio_value' && metricData.totalValue < userProfile.monthlyIncome * 12) {
      actions.push({
        type: 'reduce_spending',
        category: 'entertainment',
        amount: userProfile.monthlyIncome * 0.05,
        reason: 'Redirect to investments to boost portfolio value'
      });
    }
    
    return actions;
  }
}

export default MetricInsightsIntegration;
