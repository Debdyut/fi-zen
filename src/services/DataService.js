const UserProfileService = require('./UserProfileService');
const EnhancedDataService = require('./EnhancedDataService');

class DataService {
  constructor() {
    // Use Enhanced DataService for production data, fallback to UserProfileService
    this.enhancedService = EnhancedDataService;
    this.userProfileService = UserProfileService;
    this.currentUser = '1010101010'; // Default user
    this.useAPI = false; // Default to file mode
  }

  // Set data source mode
  setDataSource(useAPI) {
    this.useAPI = useAPI;
    console.log(`🔄 DataService: Switched to ${useAPI ? 'API' : 'FILE'} mode`);
  }

  // Get current data source
  getDataSource() {
    return this.useAPI ? 'API' : 'FILE';
  }

  // ==================== USER MANAGEMENT ====================

  // Get list of available test users
  getAvailableUsers() {
    try {
      const users = this.enhancedService.getAvailableUsers();
      console.log(`✅ DataService: Loaded ${users.length} users from EnhancedDataService`);
      return users;
    } catch (error) {
      console.warn('⚠️ Falling back to UserProfileService:', error.message);
      return this.userProfileService.getAvailableUsers();
    }
  }

  // Set current user
  setCurrentUser(userId) {
    console.log(`DataService: Setting current user to ${userId}`);
    this.currentUser = userId;
    this.enhancedService.currentUser = userId;
    return userId;
  }

  // Get current user ID
  getCurrentUser() {
    console.log(`DataService: Getting current user: ${this.currentUser}`);
    return this.currentUser;
  }

  // ==================== FINANCIAL DATA ====================

  // Get user's total balance
  async getUserBalance(userId) {
    try {
      const balance = await this.enhancedService.getUserBalance(userId);
      console.log(`✅ DataService: Loaded balance ₹${balance.toLocaleString()} for user ${userId}`);
      return balance;
    } catch (error) {
      console.warn('⚠️ Falling back to UserProfileService for balance:', error.message);
      return this.userProfileService.getUserBalance(userId);
    }
  }

  // Get user's net worth
  async getUserNetWorth(userId) {
    try {
      const netWorth = await this.enhancedService.getUserNetWorth(userId);
      console.log(`✅ DataService: Loaded net worth ₹${netWorth?.netWorth?.toLocaleString()} for user ${userId}`);
      return netWorth;
    } catch (error) {
      console.warn('⚠️ Falling back to UserProfileService for net worth:', error.message);
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
      const profile = await this.enhancedService.getUserProfile(userId);
      console.log(`✅ DataService: Loaded profile for ${profile?.name} (${userId}) from ${this.getDataSource()}`);
      return { ...profile, _dataSource: this.getDataSource() };
    } catch (error) {
      console.warn('⚠️ Falling back to UserProfileService for profile:', error.message);
      const profile = this.userProfileService.getUserProfile(userId);
      return { ...profile, _dataSource: 'FILE_FALLBACK' };
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