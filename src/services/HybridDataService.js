// Hybrid DataService - Supports both file-based and API-based data access
// Seamless migration path from JSON files to REST API

const fs = require('fs');
const path = require('path');
const APIAdapter = require('./APIAdapter');
const DataValidator = require('../data/utils/DataValidator');

class HybridDataService {
  constructor() {
    // Configuration
    this.useAPI = process.env.USE_API === 'true';
    this.fallbackToFile = process.env.FALLBACK_TO_FILE !== 'false';
    
    // File-based setup
    this.dataPath = path.join(__dirname, '../data/standardized');
    this.indexPath = path.join(this.dataPath, 'userIndex.json');
    this.validator = new DataValidator();
    
    // API setup
    this.apiAdapter = new APIAdapter({
      baseURL: process.env.API_BASE_URL || 'http://localhost:3001/api',
      timeout: parseInt(process.env.API_TIMEOUT) || 5000,
      retries: parseInt(process.env.API_RETRIES) || 3,
      fallbackToFile: this.fallbackToFile
    });
    
    // Cache (works for both modes)
    this.cache = {
      userIndex: null,
      users: new Map(),
      lastUpdated: null,
      mode: this.useAPI ? 'api' : 'file'
    };
    
    // Initialize
    this.initialize();
  }

  /**
   * Initialize the service based on mode
   */
  async initialize() {
    console.log(`🔧 Initializing HybridDataService in ${this.useAPI ? 'API' : 'FILE'} mode`);
    
    if (this.useAPI) {
      await this.initializeAPIMode();
    } else {
      this.initializeFileMode();
    }
  }

  /**
   * Initialize API mode
   */
  async initializeAPIMode() {
    try {
      // Health check
      const health = await this.apiAdapter.healthCheck();
      if (health.status === 'healthy') {
        console.log('✅ API health check passed');
        await this.loadUserIndexFromAPI();
      } else {
        throw new Error('API health check failed');
      }
    } catch (error) {
      console.warn('⚠️ API initialization failed:', error.message);
      if (this.fallbackToFile) {
        console.log('🔄 Falling back to file mode');
        this.useAPI = false;
        this.cache.mode = 'file';
        this.initializeFileMode();
      } else {
        throw error;
      }
    }
  }

  /**
   * Initialize file mode
   */
  initializeFileMode() {
    this.loadUserIndexFromFile();
  }

  // ==================== USER INDEX OPERATIONS ====================

  /**
   * Load user index from API
   */
  async loadUserIndexFromAPI() {
    try {
      const indexData = await this.apiAdapter.get('/users');
      this.cache.userIndex = this.transformAPIIndexToFileFormat(indexData);
      this.cache.lastUpdated = new Date();
      console.log(`📇 Loaded user index from API: ${Object.keys(this.cache.userIndex).length} users`);
    } catch (error) {
      console.error('❌ Error loading user index from API:', error.message);
      if (this.fallbackToFile) {
        this.loadUserIndexFromFile();
      } else {
        throw error;
      }
    }
  }

  /**
   * Load user index from file
   */
  loadUserIndexFromFile() {
    try {
      if (fs.existsSync(this.indexPath)) {
        const indexData = fs.readFileSync(this.indexPath, 'utf8');
        this.cache.userIndex = JSON.parse(indexData);
        this.cache.lastUpdated = new Date();
        console.log(`📇 Loaded user index from file: ${Object.keys(this.cache.userIndex).length} users`);
      } else {
        throw new Error('User index file not found');
      }
    } catch (error) {
      console.error('❌ Error loading user index from file:', error.message);
      this.cache.userIndex = {};
    }
  }

  /**
   * Transform API index response to file format
   * @private
   */
  transformAPIIndexToFileFormat(apiData) {
    const index = {};
    apiData.forEach(user => {
      index[user.userId] = {
        filename: `${user.userId}.json`,
        name: user.name,
        profession: user.profession,
        location: user.location,
        riskProfile: user.riskProfile,
        monthlyIncome: user.monthlyIncome,
        netWorth: user.netWorth,
        lastUpdated: user.lastUpdated || new Date().toISOString()
      };
    });
    return index;
  }

  // ==================== CORE DATA OPERATIONS ====================

  /**
   * Get all available users
   * @returns {Array} Array of user summary objects
   */
  getAvailableUsers() {
    if (!this.cache.userIndex) {
      if (this.useAPI) {
        this.loadUserIndexFromAPI();
      } else {
        this.loadUserIndexFromFile();
      }
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

    // Validate userId format
    if (!userId || !/^\d{10}$/.test(userId)) {
      throw new Error(`Invalid userId format: ${userId}. Must be 10 digits.`);
    }

    let userData;

    if (this.useAPI) {
      userData = await this.loadUserFromAPI(userId);
    } else {
      userData = await this.loadUserFromFile(userId);
    }

    // Cache the user data
    this.cache.users.set(userId, userData);
    return userData;
  }

  /**
   * Load user data from API
   * @private
   */
  async loadUserFromAPI(userId) {
    try {
      console.log(`🌐 Loading user ${userId} from API`);
      const userData = await this.apiAdapter.get(`/users/${userId}`);
      
      // Validate data integrity
      const validation = this.validator.validateUserData(userData);
      if (!validation.isValid) {
        console.warn(`⚠️ API data validation warnings for ${userId}:`, validation.errors);
      }

      return userData;
    } catch (error) {
      console.error(`❌ Error loading user ${userId} from API:`, error.message);
      
      if (this.fallbackToFile) {
        console.log(`🔄 Falling back to file for user ${userId}`);
        return await this.loadUserFromFile(userId);
      } else {
        throw error;
      }
    }
  }

  /**
   * Load user data from file
   * @private
   */
  async loadUserFromFile(userId) {
    try {
      console.log(`📁 Loading user ${userId} from file`);
      const userFilePath = path.join(this.dataPath, `${userId}.json`);
      
      if (!fs.existsSync(userFilePath)) {
        throw new Error(`User not found: ${userId}`);
      }

      const userData = JSON.parse(fs.readFileSync(userFilePath, 'utf8'));
      
      // Validate data integrity
      const validation = this.validator.validateUserData(userData);
      if (!validation.isValid) {
        console.warn(`⚠️ File data validation warnings for ${userId}:`, validation.errors);
      }

      return userData;
    } catch (error) {
      console.error(`❌ Error loading user ${userId} from file:`, error.message);
      throw error;
    }
  }

  // ==================== FINANCIAL DATA OPERATIONS ====================
  // All methods remain the same as EnhancedDataService, just using getUserById()

  async getUserProfile(userId) {
    const userData = await this.getUserById(userId);
    return userData.profile;
  }

  async getUserBalance(userId) {
    const userData = await this.getUserById(userId);
    return userData.totalBankBalance || 0;
  }

  async getUserNetWorth(userId) {
    const userData = await this.getUserById(userId);
    return userData.netWorth;
  }

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

  async getUserSpending(userId) {
    const userData = await this.getUserById(userId);
    return userData.monthlySpending || {};
  }

  async getUserTransactions(userId, limit = 10) {
    const userData = await this.getUserById(userId);
    const transactions = userData.recentTransactions || [];
    return transactions.slice(0, limit);
  }

  // ==================== MODE SWITCHING ====================

  /**
   * Switch to API mode
   */
  async switchToAPIMode() {
    console.log('🔄 Switching to API mode');
    this.useAPI = true;
    this.cache.mode = 'api';
    this.clearCache();
    await this.initializeAPIMode();
  }

  /**
   * Switch to file mode
   */
  switchToFileMode() {
    console.log('🔄 Switching to file mode');
    this.useAPI = false;
    this.cache.mode = 'file';
    this.clearCache();
    this.initializeFileMode();
  }

  /**
   * Get current mode
   */
  getCurrentMode() {
    return {
      mode: this.cache.mode,
      useAPI: this.useAPI,
      fallbackToFile: this.fallbackToFile,
      apiConfig: this.apiAdapter.getConfig()
    };
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Clear cache
   */
  clearCache() {
    this.cache.users.clear();
    this.cache.userIndex = null;
    if (this.useAPI) {
      this.loadUserIndexFromAPI();
    } else {
      this.loadUserIndexFromFile();
    }
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return {
      mode: this.cache.mode,
      indexLoaded: !!this.cache.userIndex,
      cachedUsers: this.cache.users.size,
      totalUsers: this.cache.userIndex ? Object.keys(this.cache.userIndex).length : 0,
      lastUpdated: this.cache.lastUpdated,
      apiConfig: this.useAPI ? this.apiAdapter.getConfig() : null
    };
  }

  /**
   * Test API connectivity
   */
  async testAPIConnection() {
    if (!this.useAPI) {
      return { status: 'not_using_api', mode: 'file' };
    }

    try {
      const health = await this.apiAdapter.healthCheck();
      return { status: 'connected', health };
    } catch (error) {
      return { status: 'failed', error: error.message };
    }
  }
}

module.exports = HybridDataService;
