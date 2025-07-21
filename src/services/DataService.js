import UserProfileService from './UserProfileService';

class DataService {
  constructor() {
    // Delegate to UserProfileService for user management
    this.userProfileService = UserProfileService;
  }

  // Get list of available test users
  getAvailableUsers() {
    return this.userProfileService.getAvailableUsers();
  }

  // Set current user
  setCurrentUser(userId) {
    return this.userProfileService.setCurrentUser(userId);
  }

  // Get current user ID
  getCurrentUser() {
    return this.userProfileService.getCurrentUser();
  }

  // Get user's total balance
  async getUserBalance(userId) {
    return this.userProfileService.getUserBalance(userId);
  }

  // Get user's net worth
  async getUserNetWorth(userId) {
    return this.userProfileService.getUserNetWorth(userId);
  }

  // Get user's avatar number
  getUserAvatar(userId) {
    return this.userProfileService.getUserAvatar(userId);
  }

  // Get user profile
  getUserProfile(userId) {
    return this.userProfileService.getUserProfile(userId);
  }

  // Mock methods for future implementation
  async loadNetWorth(userId) {
    const netWorth = await this.getUserNetWorth(userId);
    return { totalNetWorth: { amount: netWorth } };
  }

  async loadMutualFunds(userId) {
    return { funds: [] }; // Mock empty for now
  }

  async loadBankTransactions(userId) {
    return { transactions: [] }; // Mock empty for now
  }

  async loadCreditReport(userId) {
    return { score: 750 + Math.floor(Math.random() * 100) }; // Mock random score
  }
}

export default new DataService();