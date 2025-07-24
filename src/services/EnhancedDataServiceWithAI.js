/**
 * Enhanced Data Service with AI Integration
 * Extends existing DataService with Gemini AI capabilities
 */

import DataService from './DataService';
import GeminiService from './GeminiService';

class EnhancedDataServiceWithAI extends DataService {
  constructor() {
    super();
    this.geminiService = GeminiService;
    this.aiEnabled = true;
  }

  // Enhanced user profile with AI context
  async getUserProfileWithAI(userId) {
    const baseProfile = await super.getUserProfile(userId);
    const financialData = await this.getFinancialContext(userId);
    
    return {
      ...baseProfile,
      aiContext: {
        personalInflation: financialData.personalInflation,
        riskProfile: baseProfile.riskProfile,
        financialGoals: financialData.goals,
        spendingPatterns: financialData.spendingPatterns
      }
    };
  }

  // Get comprehensive financial context for AI
  async getFinancialContext(userId) {
    try {
      const [balance, netWorth, userData] = await Promise.all([
        super.getUserBalance(userId),
        super.getUserNetWorth(userId),
        super.getUserData(userId)
      ]);

      return {
        personalInflation: this.calculatePersonalInflation(userData),
        netWorth: netWorth?.netWorth || 0,
        monthlyIncome: userData?.profile?.monthlyIncome || 0,
        monthlySpending: this.calculateMonthlySpending(userData),
        investments: this.getInvestmentSummary(userData),
        goals: userData?.goals || [],
        spendingPatterns: userData?.monthlySpending || {}
      };
    } catch (error) {
      console.error('Error getting financial context:', error);
      return this.getDefaultFinancialContext();
    }
  }

  calculatePersonalInflation(userData) {
    // Use existing inflation calculation logic
    const spending = userData?.monthlySpending || {};
    const weights = {
      housing: 0.35,
      food: 0.25,
      transport: 0.15,
      entertainment: 0.10,
      miscellaneous: 0.15
    };

    // Mock calculation - replace with actual logic
    return 11.8; // Default personal inflation rate
  }

  calculateMonthlySpending(userData) {
    const spending = userData?.monthlySpending || {};
    return Object.values(spending).reduce((sum, amount) => sum + amount, 0);
  }

  getInvestmentSummary(userData) {
    return {
      mutualFunds: userData?.totalMutualFunds || 0,
      stocks: userData?.totalStocks || 0,
      gold: userData?.totalGold || 0,
      bankBalance: userData?.totalBankBalance || 0
    };
  }

  getDefaultFinancialContext() {
    return {
      personalInflation: 11.8,
      netWorth: 0,
      monthlyIncome: 50000,
      monthlySpending: 40000,
      investments: {},
      goals: [],
      spendingPatterns: {}
    };
  }

  // AI-powered insights with fallback
  async getAIInsights(userId, query, currentScreen = 'home') {
    try {
      const userProfile = await this.getUserProfileWithAI(userId);
      const financialData = await this.getFinancialContext(userId);

      const userContext = {
        profile: userProfile,
        financialData,
        currentScreen
      };

      // Get static fallback data
      const fallbackData = await this.getStaticInsights(userId, query, currentScreen);

      // Call Gemini with fallback
      const aiResponse = await this.geminiService.getFinancialAdvice(
        query, 
        userContext, 
        fallbackData
      );

      return {
        ...aiResponse,
        userId,
        timestamp: new Date().toISOString(),
        context: currentScreen
      };

    } catch (error) {
      console.error('AI Insights error:', error);
      return this.getStaticInsights(userId, query, currentScreen);
    }
  }

  // Static insights as fallback
  async getStaticInsights(userId, query, currentScreen) {
    const userData = await super.getUserData(userId);
    const profile = userData?.profile || {};

    return {
      success: true,
      source: 'static_fallback',
      response: `Based on your profile, here are some general recommendations for ${query}`,
      confidence: 0.6,
      fallbackUsed: true,
      userId,
      timestamp: new Date().toISOString()
    };
  }

  // Enhanced goal recommendations with AI
  async getAIGoalRecommendations(userId) {
    const query = "What financial goals should I prioritize based on my current situation?";
    return this.getAIInsights(userId, query, 'goals');
  }

  // AI-powered spending analysis
  async getAISpendingAnalysis(userId) {
    const query = "Analyze my spending patterns and suggest optimizations";
    return this.getAIInsights(userId, query, 'insights');
  }

  // AI investment recommendations
  async getAIInvestmentAdvice(userId) {
    const query = "What investment strategy should I follow given my risk profile and inflation rate?";
    return this.getAIInsights(userId, query, 'home');
  }

  // Toggle AI features
  setAIEnabled(enabled) {
    this.aiEnabled = enabled;
    console.log(`AI features ${enabled ? 'enabled' : 'disabled'}`);
  }

  isAIEnabled() {
    return this.aiEnabled;
  }

  // Health check for AI services
  async getServiceHealth() {
    const baseHealth = {
      dataService: 'healthy',
      timestamp: new Date().toISOString()
    };

    try {
      const aiHealth = await this.geminiService.healthCheck();
      return {
        ...baseHealth,
        aiService: aiHealth
      };
    } catch (error) {
      return {
        ...baseHealth,
        aiService: {
          status: 'error',
          error: error.message
        }
      };
    }
  }
}

// Export singleton instance
const enhancedDataServiceWithAI = new EnhancedDataServiceWithAI();
export default enhancedDataServiceWithAI;
