// PersonalizedCardService.js
// Service to fetch personalized card content using the message endpoint

const DELTAVERSE_API_URL = 'https://deltaverse-api-gewdd6ergq-uc.a.run.app';

import aiContextManager from './AIContextManager';

class PersonalizedCardService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  // Generate personalized content for a specific card type
  async getPersonalizedCardContent(cardType, user, screenType, forceRefresh = false) {
    const cacheKey = `${cardType}-${user.userId}-${screenType}`;
    
    // Clear cache if force refresh
    if (forceRefresh) {
      this.cache.delete(cacheKey);
    }
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
    }

    try {
      // Update AI context manager with user and screen info
      aiContextManager.setUserContext(user);
      aiContextManager.setCurrentScreen(screenType);
      
      const basePrompt = this.buildCardPrompt(cardType, user, screenType);
      
      // Add timestamp to make each request unique
      const uniquePrompt = `${basePrompt}\n\nTimestamp: ${Date.now()}`;
      
      // Use AI context manager to generate contextual prompt
      const contextualPrompt = aiContextManager.generateContextualPrompt(uniquePrompt, cardType);
      
      const response = await this.callMessageEndpoint(contextualPrompt, user);
      
      const personalizedContent = this.parseCardResponse(response, cardType, user);
      
      // Cache the result
      this.cache.set(cacheKey, {
        data: personalizedContent,
        timestamp: Date.now()
      });
      
      return personalizedContent;
    } catch (error) {
      console.error(`Error getting personalized content for ${cardType}:`, error);
      return this.getFallbackContent(cardType, user);
    }
  }

  // Build specific prompts for different card types
  buildCardPrompt(cardType, user, screenType) {
    const baseContext = `
User Profile:
- Name: ${user.name}
- Profession: ${user.profile?.profession || user.profession}
- Monthly Income: ₹${user.profile?.monthlyIncome || user.monthlyIncome}
- Location: ${user.location}
- Age: ${user.profile?.age || user.age}
- Risk Profile: ${user.profile?.riskProfile || user.riskProfile}
- Net Worth: ₹${user.netWorth?.netWorth || 0}
- Current Screen: ${screenType}
`;

    const cardPrompts = {
      spending: `${baseContext}
Monthly Spending: ${JSON.stringify(user.monthlySpending || {})}

Generate a brief spending insight (max 50 words) for their spending pattern:`,

      recommendations: `${baseContext}
Recommend the best Fi product for this user (max 40 words):`,

      categoryBreakdown: `${baseContext}
Monthly Spending: ${JSON.stringify(user.monthlySpending || {})}

Analyze their spending categories and provide:
1. Top spending insight
2. Category that needs attention
3. Optimization opportunity
4. Specific savings amount possible

Format as JSON: {"topInsight": "...", "attentionCategory": "...", "opportunity": "...", "savingsAmount": "..."}`,

      optimization: `${baseContext}
Monthly Spending: ${JSON.stringify(user.monthlySpending || {})}

Provide a brief spending optimization suggestion for this user (max 60 words). Focus on their biggest opportunity to save money based on their spending pattern and income level.`,

      smartInsights: `${baseContext}
Financial Health: ${JSON.stringify(user.financialHealth || {})}

Provide one key financial insight for this user (max 50 words):`,

      goalProgress: `${baseContext}
Goals: ${JSON.stringify(user.goals || [])}

Analyze their goal progress and provide:
1. Overall progress assessment
2. Goal that needs attention
3. Motivation message
4. Next action to take

Format as JSON: {"assessment": "...", "attentionGoal": "...", "motivation": "...", "nextAction": "..."}`,

      strategy: `${baseContext}
Goals: ${JSON.stringify(user.goals || [])}

Provide a goal achievement strategy for this user (max 50 words):`,

      motivation: `${baseContext}
Goals: ${JSON.stringify(user.goals || [])}

Generate motivational content:
1. Encouraging message about their progress
2. Success story or inspiration
3. Reminder of why goals matter
4. Confidence booster

Format as JSON: {"encouragement": "...", "inspiration": "...", "reminder": "...", "booster": "..."}`,

      nextSteps: `${baseContext}
Goals: ${JSON.stringify(user.goals || [])}

Suggest the most important next step this user should take (max 40 words):`,

      comparison: `${baseContext}
Current Metric: ${JSON.stringify(user.currentMetric || {})}
Peer Comparison: ${JSON.stringify(user.peerComparison || {})}

Provide peer comparison analysis:
1. How they compare to similar profiles
2. What percentile they're in
3. Areas where they excel
4. Areas for improvement

Format as JSON: {"comparison": "...", "percentile": "...", "strengths": "...", "improvements": "..."}`,

      historical: `${baseContext}
Current Metric: ${JSON.stringify(user.currentMetric || {})}

Analyze historical performance:
1. Trend analysis over time
2. Key patterns identified
3. Seasonal variations
4. Growth trajectory

Format as JSON: {"trend": "...", "patterns": "...", "seasonal": "...", "trajectory": "..."}`,

      prediction: `${baseContext}
Current Metric: ${JSON.stringify(user.currentMetric || {})}
Financial Profile: ${JSON.stringify(user.profile || {})}

Generate future predictions:
1. 3-month forecast
2. Key factors affecting growth
3. Potential risks
4. Recommended actions

Format as JSON: {"forecast": "...", "factors": "...", "risks": "...", "actions": "..."}`,

      actionItems: `${baseContext}
Current Metric: ${JSON.stringify(user.currentMetric || {})}

Generate actionable recommendations:
1. Immediate action (this week)
2. Short-term goal (1-3 months)
3. Long-term strategy (6+ months)
4. Success metrics to track

Format as JSON: {"immediate": "...", "shortTerm": "...", "longTerm": "...", "metrics": "..."}`,

      categoryBreakdown: `${baseContext}
Monthly Spending: ${JSON.stringify(user.monthlySpending || {})}

Analyze spending categories and provide:
1. Top spending insight
2. Category that needs attention
3. Optimization opportunity
4. Specific savings amount possible

Format as JSON: {"topInsight": "...", "attentionCategory": "...", "opportunity": "...", "savingsAmount": "..."}`,

      trendAnalysis: `${baseContext}
Monthly Spending: ${JSON.stringify(user.monthlySpending || {})}
Spending Trends: ${JSON.stringify(user.spendingTrends || {})}

Analyze spending trends and provide:
1. Most significant trend
2. What's driving the change
3. Whether it's positive or concerning
4. Recommended action

Format as JSON: {"significantTrend": "...", "driver": "...", "assessment": "...", "action": "..."}`,



      savingsOpportunity: `${baseContext}
Monthly Spending: ${JSON.stringify(user.monthlySpending || {})}
Monthly Income: ₹${user.profile?.monthlyIncome || user.monthlyIncome}

Provide a brief savings opportunity suggestion for this user (max 60 words). Focus on the easiest way they can save money based on their spending pattern.`,

      riskAssessment: `${baseContext}
Financial Health Score: ${user.financialHealth?.score || 'Unknown'}

Provide a brief risk assessment for this user (max 40 words):`,

      opportunity: `${baseContext}
Identify the biggest growth opportunity for this user (max 40 words):`
    };

    return cardPrompts[cardType] || cardPrompts.recommendations;
  }

  // Call the message endpoint
  async callMessageEndpoint(prompt, user) {
    const response = await fetch(`${DELTAVERSE_API_URL}/api/v1/chat/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: prompt,
        conversation_id: `fi-zen-card-${user.userId}`,
        user_id: user.userId
      })
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.status}`);
    }

    const data = await response.json();
    return data.message || data.response || '';
  }

  // Parse the AI response into structured card content
  parseCardResponse(response, cardType, user) {
    // Clean and use the response directly
    const cleanResponse = response.trim();
    
    // Try to parse JSON responses first
    try {
      // Clean up common JSON formatting issues
      let jsonString = cleanResponse;
      if (jsonString.includes('```json')) {
        jsonString = jsonString.replace(/```json\s*|```/g, '').trim();
      }
      if (jsonString.includes('```')) {
        jsonString = jsonString.replace(/```/g, '').trim();
      }
      
      const jsonResponse = JSON.parse(jsonString);
      if (typeof jsonResponse === 'object') {
        return jsonResponse;
      }
    } catch (e) {
      // Not JSON, continue with text parsing
    }
    
    switch (cardType) {
      case 'spending':
        return { insight: cleanResponse, tip: 'Track expenses daily', action: 'Review spending' };
      case 'recommendations':
        return { product: 'Fi Federal Bank', reason: cleanResponse, cta: 'Learn More' };
      case 'smartInsights':
        return { 
          strength: cleanResponse, 
          improvement: 'Consider diversifying investments',
          professionTip: `As a ${user.profile?.profession || 'professional'}, focus on skill development investments`
        };
      case 'strategy':
        return { strategy: cleanResponse, optimization: 'Review monthly progress' };
      case 'nextSteps':
        return { weeklyAction: cleanResponse, monthlyReview: 'Track goal progress' };
      case 'riskAssessment':
        return { 
          riskLevel: 'Moderate', 
          mainRisk: cleanResponse || 'Limited emergency fund coverage', 
          strategy: 'Build 6-month emergency fund and diversify investments' 
        };
      case 'optimization':
        return { 
          opportunity: cleanResponse || 'Review your highest spending category for potential savings', 
          action: 'Analyze spending patterns and set category budgets', 
          savings: 'Up to ₹5,000 monthly', 
          difficulty: 'Easy' 
        };
      case 'savingsOpportunity':
        return { 
          potentialSavings: 'Up to ₹3,000 monthly', 
          easiestCategory: 'Food & Dining', 
          strategy: cleanResponse || 'Cook more meals at home and limit dining out to weekends', 
          timeline: '2-4 weeks to see results' 
        };
      case 'opportunity':
        return { 
          opportunity: cleanResponse || 'Increase investment allocation for long-term growth', 
          steps: 'Start with SIP investments and gradually increase allocation', 
          timeline: '3-6 months to see initial results' 
        };
      default:
        return { content: cleanResponse, action: 'Learn More' };
    }
  }

  // Parse plain text response as fallback
  parseTextResponse(response, cardType) {
    const lines = response.split('\n').filter(line => line.trim());
    
    switch (cardType) {
      case 'spending':
        return {
          insight: lines[0] || 'Your spending patterns show room for optimization',
          tip: lines[1] || 'Consider tracking daily expenses for better control',
          comparison: lines[2] || 'Your spending is within reasonable limits',
          action: lines[3] || 'Review your top spending category this week'
        };
      
      case 'recommendations':
        return {
          product: 'Fi Federal Bank Account',
          reason: lines[0] || 'Perfect for your income level and profession',
          benefit: lines[1] || 'Earn 6% interest on your savings',
          cta: 'Open Account'
        };
      
      default:
        return {
          title: `Personalized ${cardType}`,
          content: response.substring(0, 100) + '...',
          action: 'Learn More'
        };
    }
  }

  // Fallback content when API fails
  getFallbackContent(cardType, user) {
    const fallbacks = {
      spending: {
        insight: `Your monthly spending of ₹${Object.values(user.monthlySpending || {}).reduce((a, b) => a + b, 0).toLocaleString()} shows good control`,
        tip: 'Track daily expenses to identify optimization opportunities',
        comparison: 'Your spending-to-income ratio is healthy',
        action: 'Review your largest expense category'
      },
      
      recommendations: {
        product: 'Fi Federal Bank Account',
        reason: `Perfect for ${user.profile?.profession || user.profession} professionals`,
        benefit: 'Earn 6% interest with zero balance requirements',
        cta: 'Open Account'
      },
      
      smartInsights: {
        strength: 'You maintain consistent financial habits',
        improvement: 'Consider increasing your investment allocation',
        professionTip: `As a ${user.profile?.profession || user.profession}, focus on skill development investments`,
        milestone: 'Build a 6-month emergency fund'
      },
      
      riskAssessment: {
        riskLevel: 'Moderate',
        mainRisk: 'Limited emergency fund coverage',
        strategy: 'Build 6-month emergency fund and diversify investments'
      },
      
      optimization: {
        opportunity: 'Review your highest spending category for potential savings',
        action: 'Analyze spending patterns and set category budgets',
        savings: 'Up to ₹5,000 monthly',
        difficulty: 'Easy'
      },
      
      savingsOpportunity: {
        potentialSavings: 'Up to ₹3,000 monthly',
        easiestCategory: 'Food & Dining',
        strategy: 'Cook more meals at home and limit dining out to weekends',
        timeline: '2-4 weeks to see results'
      },
      
      opportunity: {
        opportunity: 'Increase investment allocation for long-term growth',
        steps: 'Start with SIP investments and gradually increase allocation',
        timeline: '3-6 months to see initial results'
      }
    };

    return fallbacks[cardType] || {
      title: 'Personalized Insight',
      content: 'Your financial profile shows positive trends',
      action: 'Get AI Analysis'
    };
  }

  // Clear cache
  clearCache() {
    this.cache.clear();
  }

  // Get cache stats
  getCacheStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

// Export singleton instance
export default new PersonalizedCardService();
