const UserProfileService = require('./UserProfileService');
const EnhancedDataService = require('./EnhancedDataService');

class DataService {
  constructor() {
    // Use Enhanced DataService for production data, fallback to UserProfileService
    this.enhancedService = EnhancedDataService;
    this.userProfileService = UserProfileService;
    this.currentUser = '1010101010'; // Default user
  }

  // ==================== USER MANAGEMENT ====================

  // Get list of available test users
  getAvailableUsers() {
    try {
      return this.enhancedService.getAvailableUsers();
    } catch (error) {
      console.warn('Falling back to UserProfileService:', error.message);
      return this.userProfileService.getAvailableUsers();
    }
  }

  // Set current user
  setCurrentUser(userId) {
    this.currentUser = userId;
    return userId;
  }

  // Get current user ID
  getCurrentUser() {
    return this.currentUser;
  }

  // ==================== FINANCIAL DATA ====================

  // Get user's total balance
  async getUserBalance(userId) {
    try {
      return await this.enhancedService.getUserBalance(userId);
    } catch (error) {
      console.warn('Falling back to UserProfileService for balance:', error.message);
      return this.userProfileService.getUserBalance(userId);
    }
  }

  // Get user's net worth
  async getUserNetWorth(userId) {
    try {
      return await this.enhancedService.getUserNetWorth(userId);
    } catch (error) {
      console.warn('Falling back to UserProfileService for net worth:', error.message);
      return this.userProfileService.getUserNetWorth(userId);
    }
  }

  // Get user's avatar number
  getUserAvatar(userId) {
    try {
      return this.enhancedService.getUserAvatar(userId);
    } catch (error) {
      return this.userProfileService.getUserAvatar(userId);
    }
  }

  // Get user profile
  async getUserProfile(userId) {
    try {
      return await this.enhancedService.getUserProfile(userId);
    } catch (error) {
      console.warn('Falling back to UserProfileService for profile:', error.message);
      return this.userProfileService.getUserProfile(userId);
    }
  }

  // ==================== ENHANCED DATA METHODS ====================

  // Get complete user data
  async getUserData(userId) {
    return await this.enhancedService.getUserById(userId);
  }

  // Get user's investment portfolio
  async getUserPortfolio(userId) {
    return await this.enhancedService.getUserPortfolio(userId);
  }

  // Get user's bank accounts
  async getUserBankAccounts(userId) {
    return await this.enhancedService.getUserBankAccounts(userId);
  }

  // Get user's spending breakdown
  async getUserSpending(userId) {
    return await this.enhancedService.getUserSpending(userId);
  }

  // Get user's recent transactions
  async getUserTransactions(userId, limit = 10) {
    return await this.enhancedService.getUserTransactions(userId, limit);
  }

  // Get user's financial goals
  async getUserGoals(userId) {
    return await this.enhancedService.getUserGoals(userId);
  }

  // Get user's asset allocation
  async getUserAssetAllocation(userId) {
    return await this.enhancedService.getUserAssetAllocation(userId);
  }

  // Get user's investment returns
  async getUserReturns(userId) {
    return await this.enhancedService.getUserReturns(userId);
  }

  // Get spending insights
  async getUserSpendingInsights(userId) {
    return await this.enhancedService.getUserSpendingInsights(userId);
  }

  // Get peer comparison
  async getPeerComparison(userId, filters = {}) {
    return await this.enhancedService.getPeerComparison(userId, filters);
  }

  // ==================== LEGACY COMPATIBILITY ====================

  // Enhanced methods with legacy compatibility
  async loadNetWorth(userId) {
    const netWorth = await this.getUserNetWorth(userId);
    return { 
      totalNetWorth: { 
        amount: netWorth?.netWorth || netWorth || 0,
        breakdown: netWorth?.breakdown || {}
      } 
    };
  }

  async loadMutualFunds(userId) {
    const portfolio = await this.getUserPortfolio(userId);
    return { 
      funds: portfolio.mutualFunds || [],
      totalValue: portfolio.totalMutualFunds || 0
    };
  }

  async loadBankTransactions(userId) {
    const transactions = await this.getUserTransactions(userId);
    return { transactions: transactions || [] };
  }

  async loadCreditReport(userId) {
    // Generate realistic credit score based on user's financial health
    const netWorth = await this.getUserNetWorth(userId);
    const baseScore = 650;
    const netWorthBonus = Math.min(150, (netWorth?.netWorth || 0) / 10000);
    const randomVariation = Math.floor(Math.random() * 50);
    
    return { 
      score: Math.min(850, Math.max(300, baseScore + netWorthBonus + randomVariation))
    };
  }

  // ==================== UTILITY METHODS ====================

  // Get cache statistics
  getCacheStats() {
    return this.enhancedService.getCacheStats();
  }

  // Clear cache
  clearCache() {
    this.enhancedService.clearCache();
  }
}

// Export singleton instance
module.exports = new DataService();