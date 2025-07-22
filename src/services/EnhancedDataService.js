// Enhanced DataService - Production ready service layer
// Reads from standardized JSON files with caching and validation

// Import actual data files for React Native
const userIndex = require('../data/standardized/userIndex.json');

// Import user data files
const userData = {
  '1010101010': require('../data/standardized/1010101010.json'),
  '1111111111': require('../data/standardized/1111111111.json'),
  '1212121212': require('../data/standardized/1212121212.json'),
  '1313131313': require('../data/standardized/1313131313.json'),
  '1414141414': require('../data/standardized/1414141414.json'),
  '1717171717': require('../data/standardized/1717171717.json'),
  '1818181818': require('../data/standardized/1818181818.json'),
  '1919191919': require('../data/standardized/1919191919.json'),
  '2020202020': require('../data/standardized/2020202020.json'),
  '2020202021': require('../data/standardized/2020202021.json'),
  '2121212121': require('../data/standardized/2121212121.json'),
  '2222222222': require('../data/standardized/2222222222.json'),
  '2525252525': require('../data/standardized/2525252525.json'),
  '3333333333': require('../data/standardized/3333333333.json'),
  '4444444444': require('../data/standardized/4444444444.json'),
  '5555555555': require('../data/standardized/5555555555.json'),
  '6666666666': require('../data/standardized/6666666666.json'),
  '7777777777': require('../data/standardized/7777777777.json'),
  '8888888888': require('../data/standardized/8888888888.json'),
  '9999999999': require('../data/standardized/9999999999.json')
};

class EnhancedDataService {
  constructor() {
    this.currentUser = '1010101010'; // Default user
    
    // In-memory cache for performance
    this.cache = {
      userIndex: userIndex,
      users: new Map(),
      lastUpdated: new Date()
    };
    
    console.log(`✅ EnhancedDataService initialized with ${Object.keys(userIndex).length} users`);
  }

  // ==================== CORE DATA OPERATIONS ====================

  /**
   * Load and cache user index for fast lookups
   */
  loadUserIndex() {
    // Data is already loaded via require statements
    this.cache.userIndex = userIndex;
    this.cache.lastUpdated = new Date();
  }

  /**
   * Get all available users (from index)
   * @returns {Array} Array of user summary objects
   */
  getAvailableUsers() {
    if (!this.cache.userIndex) {
      this.loadUserIndex();
    }
    
    return Object.entries(this.cache.userIndex).map(([userId, userData]) => ({
      userId,
      name: userData.name,
      profession: userData.profession,
      location: userData.location,
      riskProfile: userData.riskProfile,
      monthlyIncome: userData.monthlyIncome,
      netWorth: userData.netWorth
    }));
  }

  /**
   * Get complete user data by ID
   * @param {string} userId - User ID
   * @returns {Object} Complete user data object
   */
  async getUserById(userId) {
    // Check cache first
    if (this.cache.users.has(userId)) {
      return this.cache.users.get(userId);
    }

    // Basic userId validation (10 digits)
    if (!userId || !/^\d{10}$/.test(userId)) {
      throw new Error(`Invalid userId format: ${userId}. Must be 10 digits.`);
    }

    try {
      // Get user data from imported files
      const userDataObj = userData[userId];
      
      if (!userDataObj) {
        throw new Error(`User not found: ${userId}`);
      }

      // Cache the user data
      this.cache.users.set(userId, userDataObj);
      
      console.log(`✅ Loaded user data for ${userDataObj.profile?.name} (${userId})`);
      return userDataObj;
    } catch (error) {
      console.error(`❌ Error loading user ${userId}:`, error.message);
      throw error;
    }
  }

  /**
   * Get user profile summary
   * @param {string} userId - User ID
   * @returns {Object} User profile data
   */
  async getUserProfile(userId) {
    const userData = await this.getUserById(userId);
    return userData.profile;
  }

  // ==================== FINANCIAL DATA OPERATIONS ====================

  /**
   * Get user's total bank balance
   * @param {string} userId - User ID
   * @returns {number} Total bank balance
   */
  async getUserBalance(userId) {
    const userData = await this.getUserById(userId);
    return userData.totalBankBalance || 0;
  }

  /**
   * Get user's net worth data
   * @param {string} userId - User ID
   * @returns {Object} Net worth breakdown
   */
  async getUserNetWorth(userId) {
    const userData = await this.getUserById(userId);
    return userData.netWorth;
  }

  /**
   * Get user's investment portfolio
   * @param {string} userId - User ID
   * @returns {Object} Complete investment portfolio
   */
  async getUserPortfolio(userId) {
    const userData = await this.getUserById(userId);
    
    return {
      mutualFunds: userData.mutualFunds || [],
      stocks: userData.stocks || [],
      goldInvestments: userData.goldInvestments || [],
      npsAccount: userData.npsAccount || null,
      totalMutualFunds: userData.totalMutualFunds || 0,
      totalStocks: userData.totalStocks || 0,
      totalGold: userData.totalGold || 0
    };
  }

  /**
   * Get user's bank accounts
   * @param {string} userId - User ID
   * @returns {Array} Array of bank accounts
   */
  async getUserBankAccounts(userId) {
    const userData = await this.getUserById(userId);
    return userData.bankAccounts || [];
  }

  /**
   * Get user's credit cards
   * @param {string} userId - User ID
   * @returns {Array} Array of credit cards
   */
  async getUserCreditCards(userId) {
    const userData = await this.getUserById(userId);
    return userData.creditCards || [];
  }

  /**
   * Get user's monthly spending breakdown
   * @param {string} userId - User ID
   * @returns {Object} Monthly spending categories
   */
  async getUserSpending(userId) {
    const userData = await this.getUserById(userId);
    return userData.monthlySpending || {};
  }

  /**
   * Get user's recent transactions
   * @param {string} userId - User ID
   * @param {number} limit - Number of transactions to return
   * @returns {Array} Array of recent transactions
   */
  async getUserTransactions(userId, limit = 10) {
    const userData = await this.getUserById(userId);
    const transactions = userData.recentTransactions || [];
    return transactions.slice(0, limit);
  }

  /**
   * Get user's financial goals
   * @param {string} userId - User ID
   * @returns {Array} Array of financial goals
   */
  async getUserGoals(userId) {
    const userData = await this.getUserById(userId);
    return userData.goals || [];
  }

  // ==================== ANALYTICS & INSIGHTS ====================

  /**
   * Calculate user's asset allocation
   * @param {string} userId - User ID
   * @returns {Object} Asset allocation percentages
   */
  async getUserAssetAllocation(userId) {
    const userData = await this.getUserById(userId);
    const netWorth = userData.netWorth;
    
    if (!netWorth || netWorth.totalAssets <= 0) {
      return { equity: 0, debt: 0, gold: 0, cash: 0 };
    }

    const totalAssets = netWorth.totalAssets;
    
    return {
      equity: Math.round(((userData.totalStocks || 0) + (userData.totalMutualFunds || 0)) / totalAssets * 100),
      debt: Math.round((userData.totalMutualFunds || 0) * 0.3 / totalAssets * 100), // Assuming 30% debt in MF
      gold: Math.round((userData.totalGold || 0) / totalAssets * 100),
      cash: Math.round((userData.totalBankBalance || 0) / totalAssets * 100),
      nps: Math.round((userData.npsAccount?.currentValue || 0) / totalAssets * 100)
    };
  }

  /**
   * Get user's investment returns summary
   * @param {string} userId - User ID
   * @returns {Object} Returns summary
   */
  async getUserReturns(userId) {
    const userData = await this.getUserById(userId);
    
    const mfReturns = (userData.mutualFunds || []).reduce((sum, mf) => sum + (mf.returns || 0), 0);
    const stockReturns = (userData.stocks || []).reduce((sum, stock) => sum + (stock.returns || 0), 0);
    const goldReturns = (userData.goldInvestments || []).reduce((sum, gold) => sum + (gold.returns || 0), 0);
    
    const totalInvested = (userData.mutualFunds || []).reduce((sum, mf) => sum + (mf.investedAmount || 0), 0) +
                         (userData.stocks || []).reduce((sum, stock) => sum + (stock.investedAmount || 0), 0) +
                         (userData.goldInvestments || []).reduce((sum, gold) => sum + (gold.investedAmount || 0), 0);
    
    const totalReturns = mfReturns + stockReturns + goldReturns;
    const overallReturnPercentage = totalInvested > 0 ? (totalReturns / totalInvested * 100) : 0;
    
    return {
      totalReturns,
      overallReturnPercentage: Math.round(overallReturnPercentage * 100) / 100,
      breakdown: {
        mutualFunds: mfReturns,
        stocks: stockReturns,
        gold: goldReturns
      }
    };
  }

  /**
   * Get spending insights for user
   * @param {string} userId - User ID
   * @returns {Object} Spending insights
   */
  async getUserSpendingInsights(userId) {
    const userData = await this.getUserById(userId);
    const spending = userData.monthlySpending || {};
    const income = userData.profile?.monthlyIncome || 0;
    
    const totalSpending = Object.values(spending).reduce((sum, amount) => sum + amount, 0);
    const savingsRate = income > 0 ? ((income - totalSpending) / income * 100) : 0;
    
    // Find top spending categories
    const categories = Object.entries(spending)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: income > 0 ? (amount / income * 100) : 0
      }))
      .sort((a, b) => b.amount - a.amount);
    
    return {
      totalSpending,
      savingsRate: Math.round(savingsRate * 100) / 100,
      topCategories: categories.slice(0, 5),
      insights: this.generateSpendingInsights(categories, savingsRate, userData.profile?.riskProfile)
    };
  }

  /**
   * Generate spending insights based on patterns
   * @private
   */
  generateSpendingInsights(categories, savingsRate, riskProfile) {
    const insights = [];
    
    if (savingsRate < 10) {
      insights.push({
        type: 'warning',
        message: 'Low savings rate. Consider reducing discretionary spending.',
        priority: 'high'
      });
    } else if (savingsRate > 30) {
      insights.push({
        type: 'positive',
        message: 'Excellent savings rate! Consider increasing investments.',
        priority: 'medium'
      });
    }
    
    // Check housing costs
    const housingCategory = categories.find(cat => cat.category === 'housing');
    if (housingCategory && housingCategory.percentage > 40) {
      insights.push({
        type: 'warning',
        message: 'Housing costs are high (>40% of income). Consider optimization.',
        priority: 'medium'
      });
    }
    
    return insights;
  }

  // ==================== PEER COMPARISON ====================

  /**
   * Get peer comparison data
   * @param {string} userId - User ID
   * @param {Object} filters - Comparison filters
   * @returns {Object} Peer comparison results
   */
  async getPeerComparison(userId, filters = {}) {
    const userData = await this.getUserById(userId);
    const allUsers = this.getAvailableUsers();
    
    // Filter peers based on criteria
    let peers = allUsers.filter(user => user.userId !== userId);
    
    if (filters.profession) {
      peers = peers.filter(user => user.profession === filters.profession);
    }
    
    if (filters.ageRange) {
      const userAge = userData.profile?.age;
      peers = peers.filter(user => {
        // We'd need to load each user's age, simplified for now
        return true;
      });
    }
    
    if (filters.incomeRange) {
      const userIncome = userData.profile?.monthlyIncome;
      const range = userIncome * 0.3; // ±30% income range
      peers = peers.filter(user => 
        Math.abs(user.monthlyIncome - userIncome) <= range
      );
    }
    
    // Calculate percentiles
    const userNetWorth = userData.netWorth?.netWorth || 0;
    const peerNetWorths = peers.map(peer => peer.netWorth).sort((a, b) => a - b);
    
    const percentile = this.calculatePercentile(userNetWorth, peerNetWorths);
    
    return {
      userNetWorth,
      peerCount: peers.length,
      percentile,
      averagePeerNetWorth: peerNetWorths.length > 0 ? 
        Math.round(peerNetWorths.reduce((sum, nw) => sum + nw, 0) / peerNetWorths.length) : 0,
      insights: this.generatePeerInsights(percentile, userData.profile?.riskProfile)
    };
  }

  /**
   * Calculate percentile ranking
   * @private
   */
  calculatePercentile(value, sortedArray) {
    if (sortedArray.length === 0) return 50;
    
    let rank = 0;
    for (let i = 0; i < sortedArray.length; i++) {
      if (sortedArray[i] < value) rank++;
    }
    
    return Math.round((rank / sortedArray.length) * 100);
  }

  /**
   * Generate peer comparison insights
   * @private
   */
  generatePeerInsights(percentile, riskProfile) {
    const insights = [];
    
    if (percentile >= 75) {
      insights.push({
        type: 'positive',
        message: `You're in the top ${100 - percentile}% of your peers!`,
        priority: 'high'
      });
    } else if (percentile <= 25) {
      insights.push({
        type: 'improvement',
        message: 'Consider increasing your investment allocation to catch up with peers.',
        priority: 'medium'
      });
    }
    
    return insights;
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Get user's avatar number
   * @param {string} userId - User ID
   * @returns {number} Avatar number
   */
  getUserAvatar(userId) {
    try {
      const userDataObj = userData[userId];
      return userDataObj?.profile?.avatar || parseInt(userId.slice(-1)) || 1;
    } catch (error) {
      return parseInt(userId.slice(-1)) || 1;
    }
  }

  /**
   * Clear cache (useful for testing or data updates)
   */
  clearCache() {
    this.cache.users.clear();
    this.cache.userIndex = null;
    this.loadUserIndex();
  }

  /**
   * Get cache statistics
   * @returns {Object} Cache statistics
   */
  getCacheStats() {
    return {
      indexLoaded: !!this.cache.userIndex,
      cachedUsers: this.cache.users.size,
      totalUsers: this.cache.userIndex ? Object.keys(this.cache.userIndex).length : 0,
      lastUpdated: this.cache.lastUpdated
    };
  }
}

// Export singleton instance
module.exports = new EnhancedDataService();
