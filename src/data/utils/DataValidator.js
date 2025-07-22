// NoSQL Data Validator and Standardizer
// Ensures all user data follows consistent schema

const { UserDataSchema, ValidationRules } = require('../schema/UserDataSchema');

class DataValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
  }

  // Validate complete user data object
  validateUserData(userData) {
    this.errors = [];
    this.warnings = [];

    // Validate required fields
    this.validateRequired(userData);
    
    // Validate data types and constraints
    this.validateProfile(userData.profile);
    this.validateBankAccounts(userData.bankAccounts);
    this.validateInvestments(userData);
    this.validateNetWorth(userData.netWorth);
    this.validateSpending(userData.monthlySpending);

    // Validate computed fields
    this.validateComputedFields(userData);

    return {
      isValid: this.errors.length === 0,
      errors: this.errors,
      warnings: this.warnings
    };
  }

  validateRequired(userData) {
    const required = ['userId', 'profile', 'bankAccounts', 'netWorth', 'monthlySpending'];
    
    required.forEach(field => {
      if (!userData[field]) {
        this.errors.push(`Missing required field: ${field}`);
      }
    });

    // Validate userId format
    if (userData.userId && !ValidationRules.validateUserId(userData.userId)) {
      this.errors.push(`Invalid userId format: ${userData.userId}. Must be 10 digits.`);
    }
  }

  validateProfile(profile) {
    if (!profile) return;

    // Required profile fields
    const required = ['name', 'location', 'profession', 'age', 'monthlyIncome', 'riskProfile'];
    required.forEach(field => {
      if (!profile[field]) {
        this.errors.push(`Missing profile field: ${field}`);
      }
    });

    // Validate age
    if (profile.age && !ValidationRules.validateAge(profile.age)) {
      this.errors.push(`Invalid age: ${profile.age}. Must be between 18-65.`);
    }

    // Validate monthly income
    if (profile.monthlyIncome && !ValidationRules.validateMonthlyIncome(profile.monthlyIncome)) {
      this.errors.push(`Invalid monthlyIncome: ${profile.monthlyIncome}. Must be between 10,000-10,000,000.`);
    }

    // Validate risk profile
    if (profile.riskProfile && !ValidationRules.validateRiskProfile(profile.riskProfile)) {
      this.errors.push(`Invalid riskProfile: ${profile.riskProfile}`);
    }
  }

  validateBankAccounts(bankAccounts) {
    if (!Array.isArray(bankAccounts)) {
      this.errors.push('bankAccounts must be an array');
      return;
    }

    if (bankAccounts.length === 0) {
      this.errors.push('At least one bank account is required');
      return;
    }

    bankAccounts.forEach((account, index) => {
      if (!account.accountId) {
        this.errors.push(`Bank account ${index}: Missing accountId`);
      }
      if (!account.bankName) {
        this.errors.push(`Bank account ${index}: Missing bankName`);
      }
      if (typeof account.balance !== 'number' || account.balance < 0) {
        this.errors.push(`Bank account ${index}: Invalid balance`);
      }
    });
  }

  validateInvestments(userData) {
    // Validate mutual funds
    if (userData.mutualFunds && Array.isArray(userData.mutualFunds)) {
      userData.mutualFunds.forEach((mf, index) => {
        if (!mf.schemeName) {
          this.errors.push(`Mutual Fund ${index}: Missing schemeName`);
        }
        if (typeof mf.currentValue !== 'number' || mf.currentValue < 0) {
          this.errors.push(`Mutual Fund ${index}: Invalid currentValue`);
        }
        if (typeof mf.investedAmount !== 'number' || mf.investedAmount < 0) {
          this.errors.push(`Mutual Fund ${index}: Invalid investedAmount`);
        }
      });
    }

    // Validate stocks
    if (userData.stocks && Array.isArray(userData.stocks)) {
      userData.stocks.forEach((stock, index) => {
        if (!stock.symbol || !stock.companyName) {
          this.errors.push(`Stock ${index}: Missing symbol or companyName`);
        }
        if (typeof stock.quantity !== 'number' || stock.quantity < 0) {
          this.errors.push(`Stock ${index}: Invalid quantity`);
        }
      });
    }
  }

  validateNetWorth(netWorth) {
    if (!netWorth) return;

    const required = ['totalAssets', 'totalLiabilities', 'netWorth'];
    required.forEach(field => {
      if (typeof netWorth[field] !== 'number') {
        this.errors.push(`NetWorth: Invalid ${field}`);
      }
    });

    // Validate calculation
    const calculatedNetWorth = netWorth.totalAssets - netWorth.totalLiabilities;
    if (Math.abs(calculatedNetWorth - netWorth.netWorth) > 1) {
      this.warnings.push(`NetWorth calculation mismatch: Expected ${calculatedNetWorth}, got ${netWorth.netWorth}`);
    }
  }

  validateSpending(spending) {
    if (!spending) return;

    const required = ['housing', 'food', 'transport', 'investments', 'entertainment', 'miscellaneous'];
    required.forEach(category => {
      if (typeof spending[category] !== 'number' || spending[category] < 0) {
        this.errors.push(`Spending: Invalid ${category}`);
      }
    });
  }

  validateComputedFields(userData) {
    // Validate totalBankBalance
    const expectedBankBalance = userData.bankAccounts?.reduce((sum, acc) => sum + acc.balance, 0) || 0;
    if (Math.abs(expectedBankBalance - userData.totalBankBalance) > 1) {
      this.warnings.push(`totalBankBalance mismatch: Expected ${expectedBankBalance}, got ${userData.totalBankBalance}`);
    }

    // Validate totalMutualFunds
    const expectedMFTotal = userData.mutualFunds?.reduce((sum, mf) => sum + mf.currentValue, 0) || 0;
    if (Math.abs(expectedMFTotal - (userData.totalMutualFunds || 0)) > 1) {
      this.warnings.push(`totalMutualFunds mismatch: Expected ${expectedMFTotal}, got ${userData.totalMutualFunds}`);
    }

    // Validate totalStocks
    const expectedStockTotal = userData.stocks?.reduce((sum, stock) => sum + stock.currentValue, 0) || 0;
    if (Math.abs(expectedStockTotal - (userData.totalStocks || 0)) > 1) {
      this.warnings.push(`totalStocks mismatch: Expected ${expectedStockTotal}, got ${userData.totalStocks}`);
    }
  }

  // Standardize user data to match schema
  standardizeUserData(userData) {
    const standardized = { ...userData };

    // Ensure all required arrays exist
    standardized.mutualFunds = standardized.mutualFunds || [];
    standardized.stocks = standardized.stocks || [];
    standardized.goldInvestments = standardized.goldInvestments || [];
    standardized.creditCards = standardized.creditCards || [];
    standardized.recentTransactions = standardized.recentTransactions || [];
    standardized.goals = standardized.goals || [];

    // Ensure computed fields are numbers
    standardized.totalBankBalance = Number(standardized.totalBankBalance) || 0;
    standardized.totalMutualFunds = Number(standardized.totalMutualFunds) || 0;
    standardized.totalStocks = Number(standardized.totalStocks) || 0;
    standardized.totalGold = Number(standardized.totalGold) || 0;

    // Add metadata if missing
    if (!standardized.metadata) {
      standardized.metadata = {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: '1.0',
        dataSource: 'expert_generated'
      };
    }

    // Recalculate computed fields
    this.recalculateComputedFields(standardized);

    return standardized;
  }

  recalculateComputedFields(userData) {
    // Recalculate totalBankBalance
    userData.totalBankBalance = userData.bankAccounts?.reduce((sum, acc) => sum + acc.balance, 0) || 0;

    // Recalculate totalMutualFunds
    userData.totalMutualFunds = userData.mutualFunds?.reduce((sum, mf) => sum + mf.currentValue, 0) || 0;

    // Recalculate totalStocks
    userData.totalStocks = userData.stocks?.reduce((sum, stock) => sum + stock.currentValue, 0) || 0;

    // Recalculate totalGold
    userData.totalGold = userData.goldInvestments?.reduce((sum, gold) => sum + gold.currentValue, 0) || 0;

    // Recalculate net worth
    if (userData.netWorth) {
      const totalAssets = userData.totalBankBalance + userData.totalMutualFunds + 
                         userData.totalStocks + userData.totalGold + 
                         (userData.npsAccount?.currentValue || 0);
      
      const totalLiabilities = userData.creditCards?.reduce((sum, cc) => sum + cc.outstandingAmount, 0) || 0;
      
      userData.netWorth.totalAssets = totalAssets;
      userData.netWorth.totalLiabilities = totalLiabilities;
      userData.netWorth.netWorth = totalAssets - totalLiabilities;

      // Update breakdown
      if (userData.netWorth.breakdown) {
        userData.netWorth.breakdown.bankAccounts = userData.totalBankBalance;
        userData.netWorth.breakdown.mutualFunds = userData.totalMutualFunds;
        userData.netWorth.breakdown.stocks = userData.totalStocks;
        userData.netWorth.breakdown.gold = userData.totalGold;
        userData.netWorth.breakdown.nps = userData.npsAccount?.currentValue || 0;
        userData.netWorth.breakdown.creditCardDebt = -totalLiabilities;
      }
    }
  }
}

module.exports = DataValidator;
