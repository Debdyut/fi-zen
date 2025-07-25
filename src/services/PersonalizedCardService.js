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
  async getPersonalizedCardContent(cardType, user, screenType) {
    const cacheKey = `${cardType}-${user.userId}-${screenType}`;
    
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
      
      // Use AI context manager to generate contextual prompt
      const contextualPrompt = aiContextManager.generateContextualPrompt(basePrompt, cardType);
      
      const response = await this.callMessageEndpoint(contextualPrompt, user);
      
      const personalizedContent = this.parseCardResponse(response, cardType);
      
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

Generate a personalized spending analysis card with:
1. Key insight about their spending pattern
2. One specific optimization tip
3. Comparison to their income level
4. Action they can take this month

Format as JSON: {"insight": "...", "tip": "...", "comparison": "...", "action": "..."}`,

      recommendations: `${baseContext}
Generate personalized Fi product recommendations with:
1. Most relevant Fi product for their profile
2. Why it's perfect for their profession/income
3. Specific benefit they'll get
4. Call-to-action

Format as JSON: {"product": "...", "reason": "...", "benefit": "...", "cta": "..."}`,

      categoryBreakdown: `${baseContext}
Monthly Spending: ${JSON.stringify(user.monthlySpending || {})}

Analyze their spending categories and provide:
1. Top spending insight
2. Category that needs attention
3. Optimization opportunity
4. Specific savings amount possible

Format as JSON: {"topInsight": "...", "attentionCategory": "...", "opportunity": "...", "savingsAmount": "..."}`,

      optimization: `${baseContext}
Generate spending optimization suggestions:
1. Biggest optimization opportunity
2. Specific action to take
3. Expected monthly savings
4. Difficulty level (Easy/Medium/Hard)

Format as JSON: {"opportunity": "...", "action": "...", "savings": "...", "difficulty": "..."}`,

      smartInsights: `${baseContext}
Financial Health: ${JSON.stringify(user.financialHealth || {})}

Generate smart financial insights:
1. Key strength in their financial profile
2. Most important area for improvement
3. Personalized tip for their profession
4. Next milestone to achieve

Format as JSON: {"strength": "...", "improvement": "...", "professionTip": "...", "milestone": "..."}`,

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
Monthly Income: ₹${user.profile?.monthlyIncome || user.monthlyIncome}

Generate goal achievement strategy:
1. Best strategy for their income level
2. Specific optimization tip
3. Timeline adjustment suggestion
4. Risk mitigation advice

Format as JSON: {"strategy": "...", "optimization": "...", "timeline": "...", "riskMitigation": "..."}`,

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

Provide actionable next steps:
1. Most important action this week
2. Monthly review suggestion
3. Long-term planning tip
4. Accountability measure

Format as JSON: {"weeklyAction": "...", "monthlyReview": "...", "longTermTip": "...", "accountability": "..."}`,

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

      optimization: `${baseContext}
Monthly Spending: ${JSON.stringify(user.monthlySpending || {})}

Generate spending optimization suggestions:
1. Biggest optimization opportunity
2. Specific action to take
3. Expected monthly savings
4. Difficulty level (Easy/Medium/Hard)

Format as JSON: {"opportunity": "...", "action": "...", "savings": "...", "difficulty": "..."}`,

      savingsOpportunity: `${baseContext}
Monthly Spending: ${JSON.stringify(user.monthlySpending || {})}
Monthly Income: ₹${user.profile?.monthlyIncome || user.monthlyIncome}

Identify savings opportunities:
1. Potential monthly savings amount
2. Easiest category to optimize
3. Specific strategy to implement
4. Timeline to see results

Format as JSON: {"potentialSavings": "...", "easiestCategory": "...", "strategy": "...", "timeline": "..."}`,

      riskAssessment: `${baseContext}
Financial Health Score: ${user.financialHealth?.score || 'Unknown'}

Provide risk assessment:
1. Current risk level interpretation
2. Main risk factor to address
3. Protection strategy
4. Confidence booster

Format as JSON: {"riskLevel": "...", "mainRisk": "...", "strategy": "...", "booster": "..."}`,

      opportunity: `${baseContext}
Generate growth opportunities:
1. Biggest growth opportunity for their profile
2. Specific steps to capitalize
3. Timeline for results
4. Expected outcome

Format as JSON: {"opportunity": "...", "steps": "...", "timeline": "...", "outcome": "..."}`
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
  parseCardResponse(response, cardType) {
    try {
      // Try to extract JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // Fallback: parse as plain text
      return this.parseTextResponse(response, cardType);
    } catch (error) {
      console.error('Error parsing card response:', error);
      return this.parseTextResponse(response, cardType);
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
