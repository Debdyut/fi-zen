// Personalization Engine - Core logic for adaptive content
import RiskProfileAdapter from './RiskProfileAdapter';
import LocationAdapter from './LocationAdapter';

class PersonalizationEngine {
  
  // Categorize users by income brackets
  static getIncomeCategory(monthlyIncome) {
    if (monthlyIncome >= 150000) return 'high';
    if (monthlyIncome >= 80000) return 'mid';
    return 'low';
  }

  // Get personalized insights based on user profile
  static getPersonalizedInsights(userProfile) {
    const incomeCategory = this.getIncomeCategory(userProfile.monthlyIncome);
    const riskProfile = userProfile.riskProfile;
    
    const insights = {
      high: {
        savingsTarget: 30,
        investmentFocus: 'wealth_building',
        priorities: ['tax_optimization', 'diversification', 'estate_planning'],
        complexity: 'advanced'
      },
      mid: {
        savingsTarget: 20,
        investmentFocus: 'goal_based',
        priorities: ['emergency_fund', 'insurance', 'retirement'],
        complexity: 'moderate'
      },
      low: {
        savingsTarget: 15,
        investmentFocus: 'habit_building',
        priorities: ['budgeting', 'micro_savings', 'education'],
        complexity: 'basic'
      }
    };

    return insights[incomeCategory];
  }

  // Generate comprehensive recommendations combining income, risk, and location
  static getRecommendations(userProfile, spendingInsights) {
    const incomeCategory = this.getIncomeCategory(userProfile.monthlyIncome);
    const savingsRate = spendingInsights?.savingsRate || 10;
    
    // Get income-based recommendations
    let incomeRecommendations = [];
    switch (incomeCategory) {
      case 'high':
        incomeRecommendations = this.getHighIncomeRecommendations(userProfile, savingsRate);
        break;
      case 'mid':
        incomeRecommendations = this.getMidIncomeRecommendations(userProfile, savingsRate);
        break;
      case 'low':
        incomeRecommendations = this.getLowIncomeRecommendations(userProfile, savingsRate);
        break;
    }

    // Get risk-based recommendations
    const riskRecommendations = RiskProfileAdapter.getRiskSpecificRecommendations(
      userProfile.riskProfile, 
      userProfile
    );

    // Get location-based recommendations
    const locationInsights = LocationAdapter.getLocationInsights(
      userProfile.location, 
      userProfile.monthlyIncome
    );
    const locationRecommendations = locationInsights.recommendations || [];

    // Combine and prioritize recommendations
    const allRecommendations = [
      ...incomeRecommendations, 
      ...riskRecommendations, 
      ...locationRecommendations
    ];
    
    // Remove duplicates and prioritize
    const uniqueRecommendations = this.prioritizeRecommendations(allRecommendations);
    
    return uniqueRecommendations.slice(0, 4); // Limit to top 4
  }

  // Get location-enhanced peer comparison
  static getEnhancedPeerComparison(userProfile, basePeerComparison) {
    const locationContext = LocationAdapter.getLocationPeerContext(
      userProfile.location,
      userProfile.profession,
      userProfile.monthlyIncome
    );

    return {
      ...basePeerComparison,
      locationContext,
      peerGroup: locationContext.peerGroup,
      locationAdvantage: locationContext.locationAdvantage,
      expectedIncomeRange: locationContext.expectedIncomeRange
    };
  }

  // Get location-adjusted savings insights
  static getLocationAdjustedSavings(userProfile, spendingInsights) {
    const locationSavings = LocationAdapter.getLocationSavingsTarget(
      userProfile.location,
      userProfile.monthlyIncome
    );

    const locationInsights = LocationAdapter.getLocationInsights(
      userProfile.location,
      userProfile.monthlyIncome
    );

    return {
      ...spendingInsights,
      locationAdjustedTarget: locationSavings.target,
      locationReasoning: locationSavings.reasoning,
      costOfLiving: locationInsights.costOfLiving,
      affordabilityRatio: locationInsights.affordabilityRatio,
      cityTier: locationInsights.tier
    };
  }

  // Prioritize recommendations based on user profile
  static prioritizeRecommendations(recommendations) {
    const seen = new Set();
    const prioritized = [];
    
    // Sort by priority: high -> medium -> low
    const sorted = recommendations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
    });
    
    // Remove duplicates based on ID
    sorted.forEach(rec => {
      if (!seen.has(rec.id)) {
        seen.add(rec.id);
        prioritized.push(rec);
      }
    });
    
    return prioritized;
  }

  static getHighIncomeRecommendations(userProfile, savingsRate) {
    const recommendations = [];
    const income = userProfile.monthlyIncome;

    if (savingsRate < 25) {
      recommendations.push({
        id: 'tax_optimization',
        priority: 'high',
        title: 'Maximize Tax Savings',
        impact: `Save ₹${Math.round(income * 0.3 * 0.3).toLocaleString()}/year`,
        action: `Invest ₹${Math.round(150000/12).toLocaleString()}/month in 80C`
      });
    }

    recommendations.push({
      id: 'portfolio_diversification',
      priority: 'medium',
      title: 'Diversify Investments',
      impact: `Potential ₹${Math.round(income * 0.2 * 12 * 1.12).toLocaleString()}/year growth`,
      action: 'Allocate across equity, debt, and international funds'
    });

    return recommendations;
  }

  static getMidIncomeRecommendations(userProfile, savingsRate) {
    const recommendations = [];
    const income = userProfile.monthlyIncome;

    if (savingsRate < 20) {
      recommendations.push({
        id: 'emergency_fund',
        priority: 'high',
        title: 'Build Emergency Fund',
        impact: `Target: ₹${Math.round(income * 6).toLocaleString()}`,
        action: `Save ₹${Math.round(income * 0.15).toLocaleString()}/month`
      });
    }

    recommendations.push({
      id: 'goal_planning',
      priority: 'medium',
      title: 'Plan Major Goals',
      impact: 'Achieve goals without debt',
      action: 'Start SIPs for house, car, vacation'
    });

    return recommendations;
  }

  static getLowIncomeRecommendations(userProfile, savingsRate) {
    const recommendations = [];
    const income = userProfile.monthlyIncome;

    recommendations.push({
      id: 'micro_savings',
      priority: 'high',
      title: 'Start Small Savings',
      impact: `Build ₹${Math.round(income * 0.1 * 12).toLocaleString()}/year habit`,
      action: `Start with ₹${Math.round(income * 0.05).toLocaleString()}/month`
    });

    if (savingsRate < 10) {
      recommendations.push({
        id: 'expense_tracking',
        priority: 'high',
        title: 'Track Expenses',
        impact: 'Find ₹2,000-3,000 monthly savings',
        action: 'Use expense tracking app daily'
      });
    }

    return recommendations;
  }
}

export default PersonalizationEngine;
