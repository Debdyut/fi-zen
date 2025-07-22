// Risk Profile Adapter - Tailors content based on user's risk tolerance
class RiskProfileAdapter {
  
  // Get risk-specific investment recommendations
  static getInvestmentRecommendations(riskProfile, monthlyIncome) {
    const recommendations = {
      conservative: {
        allocation: { equity: 30, debt: 60, gold: 10 },
        instruments: ['debt_funds', 'ppf', 'fd', 'government_bonds'],
        expectedReturn: '7-9%',
        riskLevel: 'Low',
        timeHorizon: '3-5 years'
      },
      moderate: {
        allocation: { equity: 50, debt: 40, gold: 10 },
        instruments: ['balanced_funds', 'large_cap', 'debt_funds', 'elss'],
        expectedReturn: '9-12%',
        riskLevel: 'Medium',
        timeHorizon: '5-7 years'
      },
      moderate_aggressive: {
        allocation: { equity: 65, debt: 25, gold: 10 },
        instruments: ['large_cap', 'mid_cap', 'elss', 'index_funds'],
        expectedReturn: '11-14%',
        riskLevel: 'Medium-High',
        timeHorizon: '7-10 years'
      },
      aggressive: {
        allocation: { equity: 75, debt: 15, gold: 10 },
        instruments: ['mid_cap', 'small_cap', 'sectoral_funds', 'international'],
        expectedReturn: '12-16%',
        riskLevel: 'High',
        timeHorizon: '10+ years'
      },
      sophisticated_aggressive: {
        allocation: { equity: 80, debt: 10, gold: 5, alternatives: 5 },
        instruments: ['small_cap', 'sectoral', 'international', 'reits', 'commodities'],
        expectedReturn: '14-18%',
        riskLevel: 'Very High',
        timeHorizon: '10+ years'
      },
      very_aggressive: {
        allocation: { equity: 85, debt: 5, gold: 5, alternatives: 5 },
        instruments: ['small_cap', 'momentum_funds', 'crypto', 'derivatives'],
        expectedReturn: '15-20%',
        riskLevel: 'Extreme',
        timeHorizon: '15+ years'
      }
    };

    return recommendations[riskProfile] || recommendations.moderate;
  }

  // Get risk-appropriate messaging
  static getRiskMessaging(riskProfile) {
    const messaging = {
      conservative: {
        tone: 'reassuring',
        emphasis: 'safety and stability',
        warnings: 'minimal risk explanations',
        encouragement: 'steady progress'
      },
      moderate: {
        tone: 'balanced',
        emphasis: 'growth with security',
        warnings: 'moderate risk awareness',
        encouragement: 'balanced approach'
      },
      moderate_aggressive: {
        tone: 'confident',
        emphasis: 'growth opportunities',
        warnings: 'calculated risk taking',
        encouragement: 'strategic growth'
      },
      aggressive: {
        tone: 'dynamic',
        emphasis: 'wealth maximization',
        warnings: 'volatility acceptance',
        encouragement: 'bold moves'
      },
      sophisticated_aggressive: {
        tone: 'analytical',
        emphasis: 'advanced strategies',
        warnings: 'complex risk factors',
        encouragement: 'sophisticated planning'
      },
      very_aggressive: {
        tone: 'bold',
        emphasis: 'maximum returns',
        warnings: 'high volatility',
        encouragement: 'aggressive wealth building'
      }
    };

    return messaging[riskProfile] || messaging.moderate;
  }

  // Generate risk-specific recommendations
  static getRiskSpecificRecommendations(riskProfile, userProfile) {
    const income = userProfile.monthlyIncome;
    const investmentRec = this.getInvestmentRecommendations(riskProfile, income);
    const messaging = this.getRiskMessaging(riskProfile);
    
    const recommendations = [];

    // Conservative users
    if (riskProfile === 'conservative') {
      recommendations.push({
        id: 'safe_investments',
        icon: '🛡️',
        title: 'Safe Investment Strategy',
        description: 'Build wealth with minimal risk',
        impact: `${investmentRec.expectedReturn} returns with safety`,
        priority: 'high',
        allocation: investmentRec.allocation,
        instruments: investmentRec.instruments
      });

      recommendations.push({
        id: 'guaranteed_returns',
        icon: '🏦',
        title: 'Guaranteed Return Options',
        description: 'Fixed returns with government backing',
        impact: 'Predictable 6-8% annual returns',
        priority: 'medium',
        options: ['PPF', 'NSC', 'SCSS', 'Bank FDs']
      });
    }

    // Moderate users
    else if (riskProfile === 'moderate') {
      recommendations.push({
        id: 'balanced_portfolio',
        icon: '⚖️',
        title: 'Balanced Investment Mix',
        description: 'Growth with stability',
        impact: `${investmentRec.expectedReturn} balanced returns`,
        priority: 'high',
        allocation: investmentRec.allocation,
        instruments: investmentRec.instruments
      });
    }

    // Aggressive users
    else if (riskProfile.includes('aggressive')) {
      recommendations.push({
        id: 'growth_focused',
        icon: '🚀',
        title: 'High-Growth Strategy',
        description: 'Maximize long-term wealth',
        impact: `${investmentRec.expectedReturn} potential returns`,
        priority: 'high',
        allocation: investmentRec.allocation,
        instruments: investmentRec.instruments
      });

      if (riskProfile === 'very_aggressive') {
        recommendations.push({
          id: 'alternative_investments',
          icon: '💎',
          title: 'Alternative Investments',
          description: 'Explore high-return opportunities',
          impact: 'Potential for exceptional returns',
          priority: 'medium',
          options: ['REITs', 'Commodities', 'International Markets']
        });
      }
    }

    return recommendations;
  }

  // Adapt UI elements based on risk profile
  static getUIAdaptations(riskProfile) {
    return {
      conservative: {
        primaryColor: '#059669', // Green for safety
        accentColor: '#10B981',
        iconStyle: 'solid',
        chartType: 'stable_line',
        animationSpeed: 'slow'
      },
      moderate: {
        primaryColor: '#2563EB', // Blue for balance
        accentColor: '#3B82F6',
        iconStyle: 'balanced',
        chartType: 'mixed',
        animationSpeed: 'medium'
      },
      aggressive: {
        primaryColor: '#DC2626', // Red for growth
        accentColor: '#EF4444',
        iconStyle: 'dynamic',
        chartType: 'growth_focused',
        animationSpeed: 'fast'
      },
      very_aggressive: {
        primaryColor: '#7C2D12', // Dark red for extreme
        accentColor: '#EA580C',
        iconStyle: 'bold',
        chartType: 'volatile',
        animationSpeed: 'very_fast'
      }
    }[riskProfile] || {
      primaryColor: '#00D4AA',
      accentColor: '#00B894',
      iconStyle: 'standard',
      chartType: 'standard',
      animationSpeed: 'medium'
    };
  }
}

export default RiskProfileAdapter;
