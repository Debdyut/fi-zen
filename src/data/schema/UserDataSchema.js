// NoSQL JSON Schema Definition for Fi-Zen User Data
// Ensures field consistency across all user profiles

const UserDataSchema = {
  // Primary identifier (indexed)
  userId: {
    type: 'string',
    required: true,
    pattern: /^\d{10}$/,
    description: 'Unique 10-digit user identifier for indexing'
  },

  // User Profile (standardized structure)
  profile: {
    type: 'object',
    required: true,
    properties: {
      name: { type: 'string', required: true },
      location: { type: 'string', required: true },
      profession: { type: 'string', required: true },
      age: { type: 'number', min: 18, max: 65, required: true },
      avatar: { type: 'number', min: 1, max: 20, required: true },
      monthlyIncome: { type: 'number', min: 10000, max: 10000000, required: true },
      riskProfile: { 
        type: 'string', 
        enum: ['conservative', 'moderate', 'moderate_aggressive', 'aggressive', 'very_aggressive', 'sophisticated_aggressive'],
        required: true 
      },
      financialLiteracy: { 
        type: 'string', 
        enum: ['low', 'low_medium', 'medium', 'high', 'expert'],
        required: true 
      }
    }
  },

  // Bank Accounts (normalized structure)
  bankAccounts: {
    type: 'array',
    required: true,
    items: {
      type: 'object',
      properties: {
        accountId: { type: 'string', required: true },
        bankName: { type: 'string', required: true },
        accountType: { type: 'string', enum: ['Savings', 'Salary', 'Current', 'Priority Banking', 'Wealth Account'] },
        balance: { type: 'number', min: 0, required: true },
        branch: { type: 'string' },
        ifscCode: { type: 'string', pattern: /^[A-Z]{4}0[A-Z0-9]{6}$/ }
      }
    }
  },

  // Computed field (auto-calculated)
  totalBankBalance: {
    type: 'number',
    computed: true,
    calculation: 'sum(bankAccounts.balance)'
  },

  // Mutual Funds (standardized structure)
  mutualFunds: {
    type: 'array',
    default: [],
    items: {
      type: 'object',
      properties: {
        schemeCode: { type: 'string' },
        schemeName: { type: 'string', required: true },
        folioNumber: { type: 'string' },
        units: { type: 'number', min: 0 },
        nav: { type: 'number', min: 0 },
        currentValue: { type: 'number', min: 0, required: true },
        investedAmount: { type: 'number', min: 0, required: true },
        returns: { type: 'number', required: true },
        returnsPercentage: { type: 'number', required: true },
        sipAmount: { type: 'number', min: 0 },
        sipDate: { type: 'number', min: 1, max: 31 },
        sipStatus: { type: 'string', enum: ['Active', 'Paused', 'Stopped'] }
      }
    }
  },

  // Computed field
  totalMutualFunds: {
    type: 'number',
    computed: true,
    calculation: 'sum(mutualFunds.currentValue)'
  },

  // Stocks (standardized structure)
  stocks: {
    type: 'array',
    default: [],
    items: {
      type: 'object',
      properties: {
        symbol: { type: 'string', required: true },
        companyName: { type: 'string', required: true },
        quantity: { type: 'number', min: 0, required: true },
        avgPrice: { type: 'number', min: 0 },
        currentPrice: { type: 'number', min: 0 },
        investedAmount: { type: 'number', min: 0, required: true },
        currentValue: { type: 'number', min: 0, required: true },
        returns: { type: 'number', required: true },
        returnsPercentage: { type: 'number', required: true }
      }
    }
  },

  // Computed field
  totalStocks: {
    type: 'number',
    computed: true,
    calculation: 'sum(stocks.currentValue)'
  },

  // Gold Investments (optional)
  goldInvestments: {
    type: 'array',
    default: [],
    items: {
      type: 'object',
      properties: {
        type: { type: 'string', enum: ['Digital Gold', 'Physical Gold', 'Gold ETF'] },
        platform: { type: 'string' },
        grams: { type: 'number', min: 0 },
        avgPricePerGram: { type: 'number', min: 0 },
        currentPricePerGram: { type: 'number', min: 0 },
        investedAmount: { type: 'number', min: 0 },
        currentValue: { type: 'number', min: 0, required: true },
        returns: { type: 'number' },
        returnsPercentage: { type: 'number' }
      }
    }
  },

  // Computed field
  totalGold: {
    type: 'number',
    computed: true,
    calculation: 'sum(goldInvestments.currentValue)'
  },

  // NPS Account (optional)
  npsAccount: {
    type: 'object',
    nullable: true,
    properties: {
      pranNumber: { type: 'string', pattern: /^\d{12}$/ },
      totalContribution: { type: 'number', min: 0 },
      employerContribution: { type: 'number', min: 0 },
      currentValue: { type: 'number', min: 0, required: true },
      returns: { type: 'number' },
      returnsPercentage: { type: 'number' },
      monthlyContribution: { type: 'number', min: 0 }
    }
  },

  // Credit Cards (standardized structure)
  creditCards: {
    type: 'array',
    default: [],
    items: {
      type: 'object',
      properties: {
        cardId: { type: 'string', required: true },
        bankName: { type: 'string', required: true },
        cardType: { type: 'string', required: true },
        cardNumber: { type: 'string', pattern: /^\*{4}\d{4}$/ },
        creditLimit: { type: 'number', min: 0, required: true },
        availableLimit: { type: 'number', min: 0 },
        outstandingAmount: { type: 'number', min: 0, required: true },
        dueDate: { type: 'string', format: 'date' },
        minimumDue: { type: 'number', min: 0 }
      }
    }
  },

  // Net Worth (computed object)
  netWorth: {
    type: 'object',
    computed: true,
    properties: {
      totalAssets: { type: 'number', required: true },
      totalLiabilities: { type: 'number', required: true },
      netWorth: { type: 'number', required: true },
      breakdown: {
        type: 'object',
        properties: {
          bankAccounts: { type: 'number' },
          mutualFunds: { type: 'number' },
          stocks: { type: 'number' },
          gold: { type: 'number' },
          nps: { type: 'number' },
          realEstate: { type: 'number', default: 0 },
          creditCardDebt: { type: 'number', max: 0 },
          loans: { type: 'number', max: 0 }
        }
      }
    }
  },

  // Monthly Spending (standardized categories)
  monthlySpending: {
    type: 'object',
    required: true,
    properties: {
      housing: { type: 'number', min: 0, required: true },
      food: { type: 'number', min: 0, required: true },
      transport: { type: 'number', min: 0, required: true },
      investments: { type: 'number', min: 0, required: true },
      entertainment: { type: 'number', min: 0, required: true },
      healthcare: { type: 'number', min: 0, default: 0 },
      education: { type: 'number', min: 0, default: 0 },
      shopping: { type: 'number', min: 0, default: 0 },
      miscellaneous: { type: 'number', min: 0, required: true }
    }
  },

  // Recent Transactions (optional)
  recentTransactions: {
    type: 'array',
    default: [],
    maxItems: 10,
    items: {
      type: 'object',
      properties: {
        date: { type: 'string', format: 'date', required: true },
        description: { type: 'string', required: true },
        amount: { type: 'number', required: true },
        category: { 
          type: 'string', 
          enum: ['income', 'food', 'transport', 'shopping', 'entertainment', 'healthcare', 'investments'],
          required: true 
        },
        paymentMethod: { 
          type: 'string', 
          enum: ['UPI', 'Credit Card', 'Debit Card', 'Cash', 'NEFT', 'Auto Debit'],
          required: true 
        },
        merchant: { type: 'string', required: true }
      }
    }
  },

  // Goals (optional)
  goals: {
    type: 'array',
    default: [],
    items: {
      type: 'object',
      properties: {
        goalId: { type: 'string', required: true },
        title: { type: 'string', required: true },
        targetAmount: { type: 'number', min: 0, required: true },
        currentAmount: { type: 'number', min: 0, required: true },
        targetDate: { type: 'string', format: 'date', required: true },
        monthlyContribution: { type: 'number', min: 0 },
        priority: { type: 'string', enum: ['low', 'medium', 'high'] },
        status: { type: 'string', enum: ['active', 'paused', 'completed', 'cancelled'] }
      }
    }
  },

  // Metadata (system fields)
  metadata: {
    type: 'object',
    properties: {
      createdAt: { type: 'string', format: 'datetime' },
      updatedAt: { type: 'string', format: 'datetime' },
      version: { type: 'string', default: '1.0' },
      dataSource: { type: 'string', default: 'expert_generated' }
    }
  }
};

// Validation functions
const ValidationRules = {
  validateUserId: (userId) => /^\d{10}$/.test(userId),
  validateRiskProfile: (profile) => ['conservative', 'moderate', 'moderate_aggressive', 'aggressive', 'very_aggressive', 'sophisticated_aggressive'].includes(profile),
  validateMonthlyIncome: (income) => income >= 10000 && income <= 10000000,
  validateAge: (age) => age >= 18 && age <= 65
};

// Index configuration for NoSQL optimization
const IndexConfig = {
  primary: 'userId',
  secondary: ['profile.riskProfile', 'profile.profession', 'profile.location'],
  composite: [
    ['profile.age', 'profile.monthlyIncome'],
    ['profile.riskProfile', 'netWorth.netWorth']
  ],
  computed: ['totalBankBalance', 'totalMutualFunds', 'totalStocks', 'netWorth.netWorth']
};

module.exports = {
  UserDataSchema,
  ValidationRules,
  IndexConfig
};
