// Fi Cross-Sell Prompt Engine
// Intelligent prompts for Fi product cross-selling based on user behavior

class FiCrossSellPromptEngine {
  constructor() {
    this.crossSellTriggers = this.initializeTriggers();
    this.productPriority = this.initializeProductPriority();
  }

  initializeTriggers() {
    return {
      // Spending-based triggers
      highSpending: {
        threshold: 50000, // Monthly spending > 50K
        products: ['Fi Credit Card'],
        prompt: 'I notice you spend ₹{amount}/month. Fi Credit Card offers 5% cashback - you could save ₹{savings}/month!'
      },
      
      lowSavingsRate: {
        threshold: 0.15, // Savings rate < 15%
        products: ['Fi Money', 'Fi Investments'],
        prompt: 'Your savings rate is {rate}%. Fi Money\'s 6% interest + automated savings could boost this significantly!'
      },

      // Goal-based triggers
      emergencyFundGoal: {
        keywords: ['emergency', 'fund', 'safety', 'backup'],
        products: ['Fi Money', 'Fi Insurance'],
        prompt: 'For emergency funds, Fi Money offers 6% interest + instant access. Plus Fi Insurance for complete protection!'
      },

      investmentGoal: {
        keywords: ['invest', 'portfolio', 'returns', 'wealth'],
        products: ['Fi Investments', 'Fi Money'],
        prompt: 'Fi Investments uses AI to optimize your portfolio for 12-15% returns. Start with ₹500/month SIP!'
      },

      // Life stage triggers
      youngProfessional: {
        ageRange: [22, 30],
        products: ['Fi Money', 'Fi Credit Card', 'Fi UPI'],
        prompt: 'Perfect time to build your financial foundation! Fi Money + Fi Credit Card combo gives you complete banking freedom.'
      },

      familyStage: {
        ageRange: [30, 45],
        products: ['Fi Insurance', 'Fi Investments', 'Fi Loans'],
        prompt: 'Protect and grow your family\'s wealth with Fi Insurance + Fi Investments. Get ₹{coverage}Cr coverage!'
      }
    };
  }

  initializeProductPriority() {
    return {
      'Fi Credit Card': { priority: 1, revenue: 6000, conversion: 0.08 },
      'Fi Investments': { priority: 2, revenue: 3600, conversion: 0.12 },
      'Fi Money': { priority: 3, revenue: 2400, conversion: 0.15 },
      'Fi Insurance': { priority: 4, revenue: 4800, conversion: 0.06 },
      'Fi Loans': { priority: 5, revenue: 12000, conversion: 0.03 },
      'Fi UPI': { priority: 6, revenue: 600, conversion: 0.25 }
    };
  }

  // Analyze user and generate cross-sell recommendations
  generateCrossSellPrompts(user, currentScreen, conversationContext = '') {
    const triggers = this.analyzeUserTriggers(user, currentScreen);
    const recommendations = this.prioritizeRecommendations(triggers, user);
    
    return {
      primaryRecommendation: recommendations[0] || null,
      secondaryRecommendations: recommendations.slice(1, 3),
      contextualPrompt: this.buildContextualPrompt(recommendations[0], user, currentScreen),
      allTriggers: triggers
    };
  }

  analyzeUserTriggers(user, currentScreen) {
    const triggers = [];
    const monthlyIncome = user.profile?.monthlyIncome || 0;
    const monthlySpending = Object.values(user.monthlySpending || {}).reduce((a, b) => a + b, 0);
    const savingsRate = monthlyIncome > 0 ? (monthlyIncome - monthlySpending) / monthlyIncome : 0;
    const age = user.profile?.age || 25;

    // Check spending triggers
    if (monthlySpending > this.crossSellTriggers.highSpending.threshold) {
      triggers.push({
        type: 'highSpending',
        products: this.crossSellTriggers.highSpending.products,
        data: { amount: monthlySpending, savings: monthlySpending * 0.05 }
      });
    }

    // Check savings rate triggers
    if (savingsRate < this.crossSellTriggers.lowSavingsRate.threshold) {
      triggers.push({
        type: 'lowSavingsRate',
        products: this.crossSellTriggers.lowSavingsRate.products,
        data: { rate: Math.round(savingsRate * 100) }
      });
    }

    // Check goal-based triggers
    if (user.goals) {
      user.goals.forEach(goal => {
        const goalText = goal.title?.toLowerCase() || '';
        
        if (this.matchesKeywords(goalText, this.crossSellTriggers.emergencyFundGoal.keywords)) {
          triggers.push({
            type: 'emergencyFundGoal',
            products: this.crossSellTriggers.emergencyFundGoal.products,
            data: { goalAmount: goal.targetAmount }
          });
        }

        if (this.matchesKeywords(goalText, this.crossSellTriggers.investmentGoal.keywords)) {
          triggers.push({
            type: 'investmentGoal',
            products: this.crossSellTriggers.investmentGoal.products,
            data: { goalAmount: goal.targetAmount }
          });
        }
      });
    }

    // Check life stage triggers
    if (age >= 22 && age <= 30) {
      triggers.push({
        type: 'youngProfessional',
        products: this.crossSellTriggers.youngProfessional.products,
        data: { age }
      });
    }

    if (age >= 30 && age <= 45) {
      const coverage = monthlyIncome * 120; // 10x annual income
      triggers.push({
        type: 'familyStage',
        products: this.crossSellTriggers.familyStage.products,
        data: { age, coverage: coverage / 10000000 } // In crores
      });
    }

    return triggers;
  }

  matchesKeywords(text, keywords) {
    return keywords.some(keyword => text.includes(keyword));
  }

  prioritizeRecommendations(triggers, user) {
    const recommendations = [];
    
    triggers.forEach(trigger => {
      trigger.products.forEach(product => {
        if (!recommendations.find(r => r.product === product)) {
          recommendations.push({
            product,
            trigger: trigger.type,
            priority: this.productPriority[product]?.priority || 10,
            revenue: this.productPriority[product]?.revenue || 0,
            conversion: this.productPriority[product]?.conversion || 0,
            data: trigger.data
          });
        }
      });
    });

    // Sort by priority (lower number = higher priority)
    return recommendations.sort((a, b) => a.priority - b.priority);
  }

  buildContextualPrompt(recommendation, user, currentScreen) {
    if (!recommendation) return null;

    const trigger = this.crossSellTriggers[recommendation.trigger];
    if (!trigger) return null;

    let prompt = trigger.prompt;
    
    // Replace placeholders with actual data
    Object.entries(recommendation.data || {}).forEach(([key, value]) => {
      const placeholder = `{${key}}`;
      if (typeof value === 'number') {
        if (key === 'amount' || key === 'savings' || key === 'goalAmount') {
          prompt = prompt.replace(placeholder, value.toLocaleString());
        } else {
          prompt = prompt.replace(placeholder, value.toString());
        }
      } else {
        prompt = prompt.replace(placeholder, value);
      }
    });

    // Add screen-specific context
    const screenContext = this.getScreenContext(currentScreen, recommendation.product);
    
    return {
      mainPrompt: prompt,
      screenContext,
      product: recommendation.product,
      expectedRevenue: recommendation.revenue,
      conversionProbability: recommendation.conversion,
      cta: this.generateCTA(recommendation.product),
      urgency: this.generateUrgency(recommendation.trigger)
    };
  }

  getScreenContext(currentScreen, product) {
    const contexts = {
      goals: {
        'Fi Money': 'Perfect for your savings goals with automated transfers',
        'Fi Investments': 'Accelerate your wealth goals with AI-optimized investing',
        'Fi Insurance': 'Protect your goals with comprehensive coverage'
      },
      insights: {
        'Fi Credit Card': 'Based on your spending patterns, maximize your rewards',
        'Fi Money': 'Your insights show potential for higher savings returns',
        'Fi Investments': 'Transform your savings into wealth with smart investing'
      },
      breakdown: {
        'Fi Credit Card': 'Optimize your spending categories with better rewards',
        'Fi UPI': 'Reduce transaction costs with zero-fee payments',
        'Fi Money': 'Automate your savings from spending insights'
      }
    };

    return contexts[currentScreen]?.[product] || `${product} perfectly complements your current financial journey`;
  }

  generateCTA(product) {
    const ctas = {
      'Fi Money': 'Open Account in 5 Minutes',
      'Fi Credit Card': 'Apply Now - Instant Approval',
      'Fi Investments': 'Start SIP with ₹500',
      'Fi Insurance': 'Get Quote in 30 Seconds',
      'Fi Loans': 'Check Eligibility Now',
      'Fi UPI': 'Setup UPI Instantly'
    };

    return ctas[product] || 'Learn More';
  }

  generateUrgency(triggerType) {
    const urgencies = {
      highSpending: 'You\'re missing ₹{savings}/month in rewards!',
      lowSavingsRate: 'Every month without optimization costs you potential returns',
      emergencyFundGoal: 'Financial security shouldn\'t wait',
      investmentGoal: 'Time in market beats timing the market',
      youngProfessional: 'Build your financial foundation early',
      familyStage: 'Protect your family\'s financial future today'
    };

    return urgencies[triggerType] || 'Limited time offer';
  }

  // Get conversation-aware cross-sell prompt
  getConversationAwareCrossSell(user, currentScreen, lastUserMessage) {
    const crossSellData = this.generateCrossSellPrompts(user, currentScreen);
    
    if (!crossSellData.primaryRecommendation) return null;

    // Check if user message indicates purchase intent
    const purchaseIntentKeywords = ['need', 'want', 'looking for', 'help with', 'recommend', 'suggest'];
    const hasPurchaseIntent = purchaseIntentKeywords.some(keyword => 
      lastUserMessage.toLowerCase().includes(keyword)
    );

    if (hasPurchaseIntent) {
      return {
        ...crossSellData.contextualPrompt,
        confidence: 'high',
        timing: 'immediate'
      };
    }

    return {
      ...crossSellData.contextualPrompt,
      confidence: 'medium',
      timing: 'contextual'
    };
  }
}

export default new FiCrossSellPromptEngine();
