// AI Context Manager
// Manages AI conversation context and continuity across screens

import FiCrossSellPromptEngine from './FiCrossSellPromptEngine';

class AIContextManager {
  constructor() {
    this.conversationHistory = [];
    this.userContext = null;
    this.currentScreen = null;
    this.sessionStartTime = new Date();
    this.aiPersonality = {
      name: 'Fi-Zen AI',
      role: 'Personal Financial Assistant',
      tone: 'friendly, knowledgeable, encouraging',
      expertise: 'financial planning, budgeting, investments, goal setting'
    };
  }

  // Set user context for AI conversations
  setUserContext(user) {
    this.userContext = user;
    this.addSystemMessage(`User context updated: ${user.name}, ${user.profile?.profession}, Monthly Income: ₹${user.profile?.monthlyIncome}`);
  }

  // Set current screen context
  setCurrentScreen(screenName) {
    this.currentScreen = screenName;
    this.addSystemMessage(`User navigated to ${screenName} screen`);
  }

  // Add system message to conversation history
  addSystemMessage(message) {
    this.conversationHistory.push({
      type: 'system',
      message,
      timestamp: new Date(),
      screen: this.currentScreen
    });
  }

  // Add user message to conversation history
  addUserMessage(message, screen = null) {
    this.conversationHistory.push({
      type: 'user',
      message,
      timestamp: new Date(),
      screen: screen || this.currentScreen
    });
  }

  // Add AI response to conversation history
  addAIResponse(message, screen = null) {
    this.conversationHistory.push({
      type: 'ai',
      message,
      timestamp: new Date(),
      screen: screen || this.currentScreen
    });
  }

  // Get conversation context for AI prompts
  getConversationContext() {
    const recentMessages = this.conversationHistory
      .filter(msg => msg.type !== 'system')
      .slice(-10) // Last 10 messages
      .map(msg => `${msg.type}: ${msg.message}`)
      .join('\n');

    return {
      conversationHistory: recentMessages,
      currentScreen: this.currentScreen,
      sessionDuration: Math.round((new Date() - this.sessionStartTime) / 1000 / 60), // minutes
      totalMessages: this.conversationHistory.filter(msg => msg.type !== 'system').length
    };
  }

  // Generate contextual AI prompt with conversation history and cross-selling
  generateContextualPrompt(basePrompt, cardType) {
    const context = this.getConversationContext();
    const userSummary = this.getUserSummary();
    
    // Get cross-selling recommendations
    const crossSellData = FiCrossSellPromptEngine.generateCrossSellPrompts(
      this.userContext, 
      this.currentScreen
    );
    
    const contextualPrompt = `
CONVERSATION CONTEXT:
- Current Screen: ${context.currentScreen}
- Session Duration: ${context.sessionDuration} minutes
- Previous Messages: ${context.totalMessages}
- Recent Conversation:
${context.conversationHistory}

USER PROFILE:
${userSummary}

AI PERSONALITY:
- Name: ${this.aiPersonality.name}
- Role: ${this.aiPersonality.role}
- Tone: ${this.aiPersonality.tone}
- Expertise: ${this.aiPersonality.expertise}

CARD CONTEXT:
- Card Type: ${cardType}
- Screen: ${this.currentScreen}

CROSS-SELLING INTELLIGENCE:
${this.buildCrossSellContext(crossSellData)}

INSTRUCTIONS:
1. Maintain conversation continuity by referencing previous messages when relevant
2. Keep consistent AI personality and tone
3. Provide contextual responses based on current screen and user journey
4. Be encouraging and supportive while being factually accurate
5. Reference user's specific financial situation and goals
6. IMPORTANT: When appropriate, naturally suggest relevant Fi products based on cross-selling intelligence
7. Use cross-selling triggers to recommend products that genuinely help the user
8. Present Fi product suggestions as helpful solutions, not pushy sales pitches

BASE PROMPT:
${basePrompt}

Remember to maintain conversation flow and reference previous interactions when helpful.
If cross-selling opportunities exist, weave them naturally into your response.
`;

    return contextualPrompt;
  }

  // Get user summary for AI context
  getUserSummary() {
    if (!this.userContext) return 'No user context available';

    const user = this.userContext;
    const totalSpending = user.monthlySpending ? 
      Object.values(user.monthlySpending).reduce((a, b) => a + b, 0) : 0;
    
    return `
Name: ${user.name}
Profession: ${user.profile?.profession || 'Not specified'}
Age: ${user.profile?.age || 'Not specified'}
Location: ${user.profile?.location || 'Not specified'}
Monthly Income: ₹${(user.profile?.monthlyIncome || 0).toLocaleString()}
Monthly Spending: ₹${totalSpending.toLocaleString()}
Net Worth: ₹${(user.netWorth?.netWorth || 0).toLocaleString()}
Active Goals: ${user.goals?.length || 0}
Risk Profile: ${user.profile?.riskProfile || 'Not specified'}
Financial Health Score: ${user.financialHealth?.score || 'Not available'}
`;
  }

  // Get screen-specific context
  getScreenContext() {
    const screenContexts = {
      home: 'User is viewing their financial dashboard and overview',
      insights: 'User is analyzing their financial insights and patterns',
      goals: 'User is managing their financial goals and tracking progress',
      metricDetail: 'User is examining detailed metrics and performance',
      breakdown: 'User is analyzing spending breakdown and optimization opportunities'
    };

    return screenContexts[this.currentScreen] || 'User is navigating the financial app';
  }

  // Check if user has been in a conversation recently
  hasRecentConversation(minutes = 30) {
    const recentMessages = this.conversationHistory.filter(msg => {
      const timeDiff = (new Date() - msg.timestamp) / 1000 / 60;
      return timeDiff <= minutes && msg.type !== 'system';
    });

    return recentMessages.length > 0;
  }

  // Get conversation summary for screen transitions
  getConversationSummary() {
    const userMessages = this.conversationHistory.filter(msg => msg.type === 'user');
    const aiMessages = this.conversationHistory.filter(msg => msg.type === 'ai');
    
    if (userMessages.length === 0) return null;

    const lastUserMessage = userMessages[userMessages.length - 1];
    const lastAIMessage = aiMessages[aiMessages.length - 1];
    
    return {
      lastTopic: this.extractTopic(lastUserMessage.message),
      lastScreen: lastUserMessage.screen,
      lastInteraction: lastUserMessage.timestamp,
      hasOngoingConversation: this.hasRecentConversation(10),
      suggestedContinuation: this.generateContinuationSuggestion(lastUserMessage.message, lastAIMessage?.message)
    };
  }

  // Extract topic from message (simple keyword extraction)
  extractTopic(message) {
    const topics = {
      'goal': ['goal', 'target', 'objective', 'achieve'],
      'spending': ['spend', 'expense', 'budget', 'cost'],
      'investment': ['invest', 'portfolio', 'returns', 'stocks'],
      'savings': ['save', 'saving', 'emergency fund'],
      'debt': ['debt', 'loan', 'liability', 'owe'],
      'income': ['income', 'salary', 'earn', 'money']
    };

    const lowerMessage = message.toLowerCase();
    
    for (const [topic, keywords] of Object.entries(topics)) {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        return topic;
      }
    }
    
    return 'general';
  }

  // Generate continuation suggestion for screen transitions
  generateContinuationSuggestion(lastUserMessage, lastAIMessage) {
    const topic = this.extractTopic(lastUserMessage);
    
    const suggestions = {
      goal: 'Continue discussing your financial goals and how to achieve them',
      spending: 'Let\'s further analyze your spending patterns and optimization opportunities',
      investment: 'We can explore more investment strategies based on your profile',
      savings: 'Let\'s discuss ways to increase your savings rate',
      debt: 'We can create a plan to manage and reduce your debt',
      income: 'Let\'s explore ways to optimize your income and financial growth',
      general: 'Continue our conversation about your financial planning'
    };

    return suggestions[topic] || suggestions.general;
  }

  // Clear conversation history (for new sessions)
  clearHistory() {
    this.conversationHistory = [];
    this.sessionStartTime = new Date();
  }

  // Get conversation statistics
  getConversationStats() {
    const userMessages = this.conversationHistory.filter(msg => msg.type === 'user').length;
    const aiMessages = this.conversationHistory.filter(msg => msg.type === 'ai').length;
    const screenTransitions = [...new Set(this.conversationHistory.map(msg => msg.screen))].length;
    
    return {
      totalMessages: userMessages + aiMessages,
      userMessages,
      aiMessages,
      screenTransitions,
      sessionDuration: Math.round((new Date() - this.sessionStartTime) / 1000 / 60),
      averageResponseTime: this.calculateAverageResponseTime()
    };
  }

  // Calculate average response time (mock implementation)
  calculateAverageResponseTime() {
    // In a real implementation, this would track actual response times
    return Math.random() * 3 + 1; // 1-4 seconds
  }

  // Build cross-selling context for AI prompts
  buildCrossSellContext(crossSellData) {
    if (!crossSellData.primaryRecommendation) {
      return 'No specific product recommendations at this time.';
    }

    const primary = crossSellData.contextualPrompt;
    const secondary = crossSellData.secondaryRecommendations
      .slice(0, 2)
      .map(rec => `- ${rec.product}: ${rec.revenue} annual revenue potential`)
      .join('\n');

    return `
PRIMARY RECOMMENDATION:
- Product: ${primary.product}
- Context: ${primary.screenContext}
- Prompt: ${primary.mainPrompt}
- CTA: ${primary.cta}
- Urgency: ${primary.urgency}
- Revenue Potential: ₹${primary.expectedRevenue}/year
- Conversion Probability: ${(primary.conversionProbability * 100).toFixed(1)}%

SECONDARY RECOMMENDATIONS:
${secondary}

CROSS-SELL STRATEGY:
- Present recommendations as helpful solutions to user's financial needs
- Use natural conversation flow, don't be pushy
- Focus on benefits and value proposition
- Timing: ${primary.confidence === 'high' ? 'Immediate opportunity' : 'Contextual suggestion'}
`;
  }

  // Get conversation-aware cross-sell recommendation
  getCrossSellRecommendation(lastUserMessage) {
    if (!this.userContext) return null;
    
    return FiCrossSellPromptEngine.getConversationAwareCrossSell(
      this.userContext,
      this.currentScreen,
      lastUserMessage
    );
  }

  // Track cross-sell conversion events
  trackCrossSellEvent(eventType, productName, additionalData = {}) {
    this.addSystemMessage(`Cross-sell event: ${eventType} for ${productName}`);
    
    // In production, this would send to analytics
    console.log('Cross-sell tracking:', {
      eventType,
      productName,
      userId: this.userContext?.userId,
      screen: this.currentScreen,
      timestamp: new Date(),
      ...additionalData
    });
  }
}

// Create singleton instance
const aiContextManager = new AIContextManager();

export default aiContextManager;
