// Simplified Deltaverse Service - Single Endpoint Integration
// Uses only: GET /api/v1/users/{user_id}

class SimplifiedDeltaverseService {
  constructor(config = {}) {
    this.baseURL = config.baseURL || 'https://deltaverse-api-gewdd6ergq-uc.a.run.app';
    this.endpoint = '/api/v1/users';
    this.timeout = config.timeout || 10000;
    this.useAPI = config.useAPI !== false; // Default to true
    this.fallbackToFile = config.fallbackToFile !== false; // Default to true
    
    // File service for fallback
    if (this.fallbackToFile) {
      const HybridDataService = require('./HybridDataService');
      this.fileService = new HybridDataService();
      this.fileService.useAPI = false; // Force file mode
    }
    
    // Simple cache
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    
    console.log(`🔧 SimplifiedDeltaverseService initialized - API: ${this.useAPI}, Fallback: ${this.fallbackToFile}`);
  }

  /**
   * Make API request with fallback
   */
  async makeRequest(userId) {
    const url = `${this.baseURL}${this.endpoint}/${userId}`;
    
    // Check cache first
    const cached = this.getFromCache(userId);
    if (cached) {
      console.log(`📦 Cache hit for user ${userId}`);
      return cached;
    }

    if (!this.useAPI) {
      return await this.loadFromFile(userId);
    }

    try {
      console.log(`🌐 Fetching user ${userId} from API: ${url}`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Cache successful response
      this.setCache(userId, data);
      
      console.log(`✅ Successfully fetched user ${userId} from API`);
      return data;

    } catch (error) {
      console.warn(`⚠️ API failed for user ${userId}: ${error.message}`);
      
      if (this.fallbackToFile) {
        console.log(`🔄 Falling back to file for user ${userId}`);
        return await this.loadFromFile(userId);
      }
      
      throw error;
    }
  }

  /**
   * Load user from file (fallback)
   */
  async loadFromFile(userId) {
    if (!this.fileService) {
      throw new Error('File service not available - fallback disabled');
    }
    
    console.log(`📁 Loading user ${userId} from file`);
    const userData = await this.fileService.getUserById(userId);
    
    // Add source metadata
    userData._source = 'file-fallback';
    userData._timestamp = new Date().toISOString();
    
    return userData;
  }

  // ==================== MAIN USER METHODS ====================

  /**
   * Get user by ID - Primary method
   * Returns complete user profile matching JSON structure
   */
  async getUserById(userId) {
    if (!userId || !/^\d{10}$/.test(userId)) {
      throw new Error(`Invalid userId format: ${userId}. Must be 10 digits.`);
    }

    return await this.makeRequest(userId);
  }

  /**
   * Get all available users
   * Uses file service to get user list, then fetches from API as needed
   */
  async getAvailableUsers() {
    if (this.useAPI) {
      try {
        // Get user list from file service (has the index)
        const fileUsers = this.fileService ? this.fileService.getAvailableUsers() : [];
        
        // Return lightweight summaries
        return fileUsers.map(user => ({
          userId: user.userId,
          name: user.name,
          profession: user.profession,
          location: user.location,
          monthlyIncome: user.monthlyIncome,
          netWorth: user.netWorth,
          avatar: this.generateAvatarId(user.userId)
        }));
        
      } catch (error) {
        console.warn('⚠️ Failed to get users list:', error.message);
        return [];
      }
    } else {
      return this.fileService ? this.fileService.getAvailableUsers() : [];
    }
  }

  // ==================== LEGACY COMPATIBILITY METHODS ====================
  // These maintain compatibility with existing React Native code

  async getUserProfile(userId) {
    const user = await this.getUserById(userId);
    return user.profile || {
      name: user.name,
      profession: user.profession,
      location: user.location,
      age: user.age
    };
  }

  async getUserBalance(userId) {
    const user = await this.getUserById(userId);
    return user.totalBankBalance || user.netWorth?.breakdown?.bankAccounts || 0;
  }

  async getUserNetWorth(userId) {
    const user = await this.getUserById(userId);
    return user.netWorth?.netWorth || user.netWorth || 0;
  }

  async getUserPortfolio(userId) {
    const user = await this.getUserById(userId);
    return {
      mutualFunds: user.mutualFunds || [],
      stocks: user.stocks || [],
      goldInvestments: user.goldInvestments || [],
      npsAccount: user.npsAccount || null,
      totalMutualFunds: user.totalMutualFunds || 0,
      totalStocks: user.totalStocks || 0,
      totalGold: user.totalGold || 0
    };
  }

  async getUserSpending(userId) {
    const user = await this.getUserById(userId);
    return user.monthlySpending || {};
  }

  async getUserTransactions(userId, limit = 10) {
    const user = await this.getUserById(userId);
    const transactions = user.recentTransactions || [];
    return transactions.slice(0, limit);
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Cache management
   */
  getFromCache(userId) {
    const cached = this.cache.get(userId);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    this.cache.delete(userId);
    return null;
  }

  setCache(userId, data) {
    this.cache.set(userId, {
      data,
      timestamp: Date.now()
    });
  }

  clearCache() {
    this.cache.clear();
    console.log('🧹 Cache cleared');
  }

  /**
   * Generate avatar ID from user ID
   */
  generateAvatarId(userId) {
    if (!userId) return 1;
    const hash = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return (hash % 16) + 1;
  }

  /**
   * Health check
   */
  async healthCheck() {
    if (!this.useAPI) {
      return { status: 'file-mode', users: this.fileService?.getAvailableUsers()?.length || 0 };
    }

    try {
      const response = await fetch(`${this.baseURL}/health`, { timeout: 5000 });
      const data = await response.json();
      return { status: 'healthy', ...data };
    } catch (error) {
      return { status: 'unhealthy', error: error.message };
    }
  }

  /**
   * Switch modes
   */
  switchToAPIMode() {
    console.log('🔄 Switching to API mode');
    this.useAPI = true;
    this.clearCache();
  }

  switchToFileMode() {
    console.log('🔄 Switching to file mode');
    this.useAPI = false;
    this.clearCache();
  }

  /**
   * Get service stats
   */
  getStats() {
    return {
      mode: this.useAPI ? 'api' : 'file',
      baseURL: this.baseURL,
      endpoint: this.endpoint,
      cacheSize: this.cache.size,
      fallbackEnabled: this.fallbackToFile
    };
  }

  /**
   * Test the service
   */
  async test(userId = '1010101010') {
    console.log('🧪 Testing SimplifiedDeltaverseService');
    console.log(`Mode: ${this.useAPI ? 'API' : 'File'}`);
    
    try {
      const health = await this.healthCheck();
      console.log('Health:', health);
      
      const user = await this.getUserById(userId);
      console.log(`User ${userId}:`, {
        name: user.name || user.profile?.name,
        netWorth: user.netWorth?.netWorth || user.netWorth,
        source: user._source || 'api'
      });
      
      return { success: true, user, health };
    } catch (error) {
      console.error('Test failed:', error.message);
      return { success: false, error: error.message };
    }
  }
}

module.exports = SimplifiedDeltaverseService;
