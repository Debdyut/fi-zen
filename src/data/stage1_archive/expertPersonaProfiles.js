// Expert-designed persona profiles for Indian Fintech demo
// Based on 20+ years of Indian financial behavior analysis

const expertPersonaProfiles = {
  // PERSONA 1: High-Earning Tech Professional - Aggressive Investor
  '1010101010': {
    name: 'Arjun Sharma',
    location: 'Mumbai, Maharashtra',
    profession: 'Software Engineer',
    age: 28,
    avatar: 1,
    
    // Financial Profile
    monthlyIncome: 125000,
    experienceYears: 5,
    riskProfile: 'aggressive',
    financialLiteracy: 'high',
    
    // Behavioral Traits
    spendingPattern: 'lifestyle_inflation',
    investmentStyle: 'growth_focused',
    debtComfort: 'moderate',
    
    // Asset Allocation (Typical for this persona)
    targetAllocation: {
      equity: 70,      // High equity exposure
      debt: 15,        // Minimal debt funds
      gold: 5,         // Small gold allocation
      cash: 10         // Emergency fund
    },
    
    // Expected Financial Behavior
    expectedBehaviors: [
      'High SIP amounts (15-20% of income)',
      'Direct equity investments in growth stocks',
      'Premium credit cards with high limits',
      'Lifestyle spending on tech, dining, travel',
      'House purchase planning within 3-5 years'
    ],
    
    // Mumbai-specific factors
    locationFactors: {
      rentToIncomeRatio: 0.35,     // 35% on rent (Mumbai premium)
      transportCosts: 'high',       // Uber/Ola heavy usage
      diningOut: 'frequent',        // Mumbai food culture
      realEstateAspiration: 'high'  // Property investment focus
    }
  },

  // PERSONA 2: Mid-Level Marketing Professional - Balanced Investor
  '1111111111': {
    name: 'Priya Patel',
    location: 'Ahmedabad, Gujarat',
    profession: 'Marketing Manager',
    age: 26,
    avatar: 2,
    
    monthlyIncome: 85000,
    experienceYears: 4,
    riskProfile: 'moderate',
    financialLiteracy: 'medium',
    
    spendingPattern: 'conscious_spender',
    investmentStyle: 'balanced_approach',
    debtComfort: 'low',
    
    targetAllocation: {
      equity: 60,
      debt: 25,
      gold: 10,
      cash: 5
    },
    
    expectedBehaviors: [
      'Systematic SIP investments (10-12% of income)',
      'Traditional gold purchases for festivals',
      'Wedding planning and savings',
      'Family financial support obligations',
      'Conservative credit card usage'
    ],
    
    locationFactors: {
      rentToIncomeRatio: 0.25,     // Lower than Mumbai
      goldPurchases: 'cultural',    // Gujarat gold buying culture
      familyObligations: 'high',    // Joint family support
      businessMindset: 'moderate'   // Gujarati business culture
    }
  },

  // PERSONA 3: Senior Business Analyst - Wealth Accumulator
  '1212121212': {
    name: 'Rajesh Kumar',
    location: 'Delhi, NCR',
    profession: 'Business Analyst',
    age: 32,
    avatar: 3,
    
    monthlyIncome: 150000,
    experienceYears: 8,
    riskProfile: 'moderate_aggressive',
    financialLiteracy: 'high',
    
    spendingPattern: 'value_conscious',
    investmentStyle: 'diversified_portfolio',
    debtComfort: 'high',
    
    targetAllocation: {
      equity: 65,
      debt: 20,
      gold: 5,
      cash: 10
    },
    
    expectedBehaviors: [
      'Multiple SIP portfolios across categories',
      'Home loan planning/existing EMI',
      'Tax-saving investments (80C, ELSS)',
      'Insurance planning (term + health)',
      'Child education planning (if married)'
    ],
    
    locationFactors: {
      rentToIncomeRatio: 0.30,     // NCR premium
      homeLoanReadiness: 'high',    // Property investment focus
      taxPlanning: 'active',        // High tax bracket
      corporatePerks: 'maximum'     // ESOP, bonuses, etc.
    }
  },

  // PERSONA 4: Young Creative Professional - Conservative Saver
  '1313131313': {
    name: 'Sneha Reddy',
    location: 'Hyderabad, Telangana',
    profession: 'Graphic Designer',
    age: 24,
    avatar: 4,
    
    monthlyIncome: 65000,
    experienceYears: 2,
    riskProfile: 'conservative',
    financialLiteracy: 'low_medium',
    
    spendingPattern: 'budget_conscious',
    investmentStyle: 'safety_first',
    debtComfort: 'very_low',
    
    targetAllocation: {
      equity: 40,
      debt: 35,
      gold: 15,
      cash: 10
    },
    
    expectedBehaviors: [
      'Small SIP amounts (5-8% of income)',
      'High savings account balance',
      'Minimal credit card usage',
      'Family financial dependency',
      'Skill development investments'
    ],
    
    locationFactors: {
      rentToIncomeRatio: 0.20,     // Shared accommodation
      familySupport: 'receiving',   // Parents still supporting
      careerInvestment: 'high',     // Courses, certifications
      socialSpending: 'moderate'    // Young professional lifestyle
    }
  },

  // PERSONA 5: Sales Professional - Irregular Income Pattern
  '1414141414': {
    name: 'Vikram Singh',
    location: 'Jaipur, Rajasthan',
    profession: 'Sales Executive',
    age: 30,
    avatar: 5,
    
    monthlyIncome: 95000,  // Variable income
    experienceYears: 6,
    riskProfile: 'moderate',
    financialLiteracy: 'medium',
    
    spendingPattern: 'irregular_spender',
    investmentStyle: 'opportunistic',
    debtComfort: 'moderate',
    
    targetAllocation: {
      equity: 50,
      debt: 30,
      gold: 10,
      cash: 10
    },
    
    expectedBehaviors: [
      'Irregular investment patterns',
      'Higher emergency fund needs',
      'Credit card debt during lean months',
      'Bonus-based lump sum investments',
      'Traditional investment preferences'
    ],
    
    locationFactors: {
      rentToIncomeRatio: 0.22,     // Tier-2 city advantage
      traditionalInvestments: 'high', // Gold, FD preference
      familyObligations: 'high',    // Extended family support
      vehicleLoan: 'likely'         // Sales job requirement
    }
  },

  // PERSONA 6: Debt-Heavy Professional - Financial Stress
  '7777777777': {
    name: 'Deepika Rao',
    location: 'Mangalore, Karnataka',
    profession: 'Doctor',
    age: 28,
    avatar: 14,
    
    monthlyIncome: 200000,
    experienceYears: 4,
    riskProfile: 'conservative',
    financialLiteracy: 'medium',
    
    spendingPattern: 'high_fixed_costs',
    investmentStyle: 'debt_focused',
    debtComfort: 'high',  // Due to education loans
    
    targetAllocation: {
      equity: 30,
      debt: 40,
      gold: 10,
      cash: 20
    },
    
    expectedBehaviors: [
      'High education loan EMIs',
      'Medical equipment financing',
      'Professional insurance premiums',
      'Clinic setup investments',
      'Conservative investment approach'
    ],
    
    locationFactors: {
      educationLoanBurden: 'very_high', // Medical education costs
      professionalExpenses: 'high',     // CME, conferences, equipment
      clinicInvestment: 'planning',     // Future business setup
      familyExpectations: 'high'       // Doctor family status
    }
  },

  // PERSONA 7: High-Income Low-Saver - Lifestyle Inflation
  '2121212121': {
    name: 'Karthik Nair',
    location: 'Kochi, Kerala',
    profession: 'Product Manager',
    age: 35,
    avatar: 7,
    
    monthlyIncome: 180000,
    experienceYears: 10,
    riskProfile: 'aggressive',
    financialLiteracy: 'high',
    
    spendingPattern: 'lifestyle_heavy',
    investmentStyle: 'growth_aggressive',
    debtComfort: 'high',
    
    targetAllocation: {
      equity: 75,
      debt: 10,
      gold: 5,
      cash: 10
    },
    
    expectedBehaviors: [
      'High lifestyle expenses',
      'Premium investments (PMS, AIF)',
      'Multiple credit cards',
      'Travel and experience spending',
      'Real estate investments'
    ],
    
    locationFactors: {
      lifestyleInflation: 'very_high',  // Senior position
      realEstateInvestment: 'active',   // Kerala property market
      travelSpending: 'high',           // Frequent business travel
      premiumProducts: 'preference'     // High-end financial products
    }
  },

  // PERSONA 8: Low-Income High-Saver - Financial Discipline
  '5555555555': {
    name: 'Ritu Malhotra',
    location: 'Chandigarh, Punjab',
    profession: 'Teacher',
    age: 29,
    avatar: 12,
    
    monthlyIncome: 45000,
    experienceYears: 6,
    riskProfile: 'conservative',
    financialLiteracy: 'medium',
    
    spendingPattern: 'frugal_saver',
    investmentStyle: 'safety_focused',
    debtComfort: 'very_low',
    
    targetAllocation: {
      equity: 35,
      debt: 45,
      gold: 15,
      cash: 5
    },
    
    expectedBehaviors: [
      'High savings rate (25-30%)',
      'Government scheme investments',
      'Traditional investment products',
      'Minimal lifestyle expenses',
      'Long-term financial planning'
    ],
    
    locationFactors: {
      governmentJob: 'security_focused', // Pension, PF benefits
      traditionalValues: 'high',         // Conservative approach
      familyFirst: 'priority',           // Family over lifestyle
      lowRisk: 'preference'              // FD, PPF, NSC focus
    }
  }
};

module.exports = { expertPersonaProfiles };
