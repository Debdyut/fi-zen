// 4 Critical profiles to complete feature coverage
const criticalProfiles = {
  
  // PROFILE 17: HNI Tech Executive - Advanced Investment Features
  '1717171717': {
    name: 'Sanjay Mehta',
    location: 'Bangalore, Karnataka',
    profession: 'VP Engineering',
    age: 38,
    avatar: 17,
    monthlyIncome: 350000,
    riskProfile: 'sophisticated_aggressive',
    financialLiteracy: 'expert',
    
    assetAllocation: { equity: 60, debt: 15, alternatives: 20, cash: 5 },
    debtProfile: { creditCard: 150000, homeLoan: 8500000 },
    spendingPattern: 'hni_lifestyle',
    investmentFocus: 'portfolio_diversification',
    
    // HNI-specific features
    portfolioSize: 5000000,
    investmentTypes: ['PMS', 'AIF', 'International_Funds', 'REITs', 'Direct_Equity'],
    taxBracket: '30%',
    features_enabled: ['Advanced_Analytics', 'Tax_Optimization', 'Estate_Planning']
  },

  // PROFILE 18: Joint Family Breadwinner - Family Planning Features  
  '1818181818': {
    name: 'Ramesh Agarwal',
    location: 'Pune, Maharashtra',
    profession: 'Manufacturing Manager', 
    age: 42,
    avatar: 18,
    monthlyIncome: 180000,
    riskProfile: 'moderate',
    financialLiteracy: 'medium',
    
    assetAllocation: { equity: 45, debt: 35, gold: 15, cash: 5 },
    debtProfile: { creditCard: 80000, homeLoan: 4200000, personalLoan: 200000 },
    spendingPattern: 'family_focused',
    investmentFocus: 'goal_based_planning',
    
    // Family-specific features
    familySize: 6,
    dependents: 4, // Parents + 2 children
    childrenAges: [8, 12],
    features_enabled: ['Family_Planning', 'Education_Goals', 'Healthcare_Planning', 'Insurance_Planning']
  },

  // PROFILE 19: Small Business Owner - Business Financial Features
  '1919191919': {
    name: 'Priya Entrepreneur',
    location: 'Chennai, Tamil Nadu',
    profession: 'Restaurant Owner',
    age: 35,
    avatar: 19,
    monthlyIncome: 'variable', // ₹80K-250K range
    averageIncome: 165000,
    riskProfile: 'moderate_aggressive',
    financialLiteracy: 'medium',
    
    assetAllocation: { equity: 40, debt: 25, business: 30, cash: 5 },
    debtProfile: { creditCard: 120000, businessLoan: 1500000, workingCapital: 500000 },
    spendingPattern: 'business_reinvestment',
    investmentFocus: 'business_growth',
    
    // Business-specific features
    businessType: 'F&B',
    businessAge: 5,
    monthlyRevenue: 800000,
    seasonality: 'high', // Festival seasons affect revenue
    features_enabled: ['Cash_Flow_Management', 'Business_Loans', 'GST_Planning', 'Working_Capital']
  },

  // PROFILE 20: Advanced Trader - Sophisticated Investment Features
  '2020202021': {
    name: 'Akash Trader',
    location: 'Mumbai, Maharashtra', 
    profession: 'Proprietary Trader',
    age: 29,
    avatar: 20,
    monthlyIncome: 'highly_variable', // ₹50K to ₹500K
    averageIncome: 275000,
    riskProfile: 'very_aggressive',
    financialLiteracy: 'expert',
    
    assetAllocation: { equity: 80, derivatives: 15, cash: 5 },
    debtProfile: { creditCard: 200000, marginFunding: 1000000 },
    spendingPattern: 'trader_lifestyle',
    investmentFocus: 'active_trading',
    
    // Trading-specific features  
    tradingCapital: 2000000,
    tradingStyle: 'swing_trading',
    derivativesExperience: 'expert',
    features_enabled: ['Risk_Management', 'Tax_Harvesting', 'Derivatives_Analytics', 'Portfolio_Optimization']
  }
};

module.exports = { criticalProfiles };
