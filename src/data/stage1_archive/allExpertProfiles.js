// Complete expert-reviewed profiles for all 16 users
// Covering diverse financial health, risk appetites, and asset allocations

const expertProfiles = {
  
  // PROFILE 1: Aggressive Tech Professional - High Growth Focus
  '1010101010': {
    name: 'Arjun Sharma', location: 'Mumbai, Maharashtra', profession: 'Software Engineer', age: 28,
    monthlyIncome: 125000, riskProfile: 'aggressive', financialLiteracy: 'high',
    assetAllocation: { equity: 70, debt: 15, gold: 5, cash: 10 },
    debtProfile: { creditCard: 65000, personalLoan: 0, homeLoan: 0 },
    spendingPattern: 'lifestyle_inflation', investmentFocus: 'growth_stocks'
  },

  // PROFILE 2: Balanced Professional - Wedding Planning
  '1111111111': {
    name: 'Priya Patel', location: 'Ahmedabad, Gujarat', profession: 'Marketing Manager', age: 26,
    monthlyIncome: 85000, riskProfile: 'moderate', financialLiteracy: 'medium',
    assetAllocation: { equity: 50, debt: 25, gold: 20, cash: 5 },
    debtProfile: { creditCard: 0, personalLoan: 0, homeLoan: 0 },
    spendingPattern: 'goal_oriented', investmentFocus: 'balanced_hybrid'
  },

  // PROFILE 3: Senior Professional - Wealth Accumulator
  '1212121212': {
    name: 'Rajesh Kumar', location: 'Delhi, NCR', profession: 'Business Analyst', age: 32,
    monthlyIncome: 150000, riskProfile: 'moderate_aggressive', financialLiteracy: 'high',
    assetAllocation: { equity: 60, debt: 25, gold: 5, cash: 10 },
    debtProfile: { creditCard: 45000, personalLoan: 0, homeLoan: 2500000 },
    spendingPattern: 'family_focused', investmentFocus: 'diversified_portfolio'
  },

  // PROFILE 4: Young Creative - Conservative Starter
  '1313131313': {
    name: 'Sneha Reddy', location: 'Hyderabad, Telangana', profession: 'Graphic Designer', age: 24,
    monthlyIncome: 65000, riskProfile: 'conservative', financialLiteracy: 'low',
    assetAllocation: { equity: 30, debt: 40, gold: 20, cash: 10 },
    debtProfile: { creditCard: 15000, personalLoan: 0, homeLoan: 0 },
    spendingPattern: 'budget_conscious', investmentFocus: 'safety_first'
  },

  // PROFILE 5: Sales Professional - Irregular Income
  '1414141414': {
    name: 'Vikram Singh', location: 'Jaipur, Rajasthan', profession: 'Sales Executive', age: 30,
    monthlyIncome: 95000, riskProfile: 'moderate', financialLiteracy: 'medium',
    assetAllocation: { equity: 45, debt: 35, gold: 10, cash: 10 },
    debtProfile: { creditCard: 35000, personalLoan: 150000, homeLoan: 0 },
    spendingPattern: 'irregular_spender', investmentFocus: 'liquid_funds'
  },

  // PROFILE 6: HR Professional - Systematic Saver
  '2020202020': {
    name: 'Anita Gupta', location: 'Pune, Maharashtra', profession: 'HR Specialist', age: 27,
    monthlyIncome: 78000, riskProfile: 'moderate', financialLiteracy: 'medium',
    assetAllocation: { equity: 55, debt: 30, gold: 10, cash: 5 },
    debtProfile: { creditCard: 0, personalLoan: 0, homeLoan: 0 },
    spendingPattern: 'systematic_saver', investmentFocus: 'sip_focused'
  },

  // PROFILE 7: Senior Product Manager - High Lifestyle
  '2121212121': {
    name: 'Karthik Nair', location: 'Kochi, Kerala', profession: 'Product Manager', age: 35,
    monthlyIncome: 180000, riskProfile: 'aggressive', financialLiteracy: 'high',
    assetAllocation: { equity: 75, debt: 10, gold: 5, cash: 10 },
    debtProfile: { creditCard: 120000, personalLoan: 0, homeLoan: 3500000 },
    spendingPattern: 'lifestyle_heavy', investmentFocus: 'growth_aggressive'
  },

  // PROFILE 8: Content Writer - Low Income High Discipline
  '2222222222': {
    name: 'Meera Joshi', location: 'Indore, Madhya Pradesh', profession: 'Content Writer', age: 25,
    monthlyIncome: 55000, riskProfile: 'conservative', financialLiteracy: 'medium',
    assetAllocation: { equity: 35, debt: 45, gold: 15, cash: 5 },
    debtProfile: { creditCard: 8000, personalLoan: 0, homeLoan: 0 },
    spendingPattern: 'frugal_saver', investmentFocus: 'debt_funds'
  },

  // PROFILE 9: Financial Advisor - Diversified Expert
  '2525252525': {
    name: 'Rohit Agarwal', location: 'Kolkata, West Bengal', profession: 'Financial Advisor', age: 31,
    monthlyIncome: 120000, riskProfile: 'moderate_aggressive', financialLiteracy: 'expert',
    assetAllocation: { equity: 65, debt: 20, gold: 5, cash: 10 },
    debtProfile: { creditCard: 25000, personalLoan: 0, homeLoan: 1800000 },
    spendingPattern: 'value_conscious', investmentFocus: 'diversified_expert'
  },

  // PROFILE 10: UX Designer - Tech Savvy Investor
  '3333333333': {
    name: 'Kavya Iyer', location: 'Chennai, Tamil Nadu', profession: 'UX Designer', age: 26,
    monthlyIncome: 90000, riskProfile: 'moderate_aggressive', financialLiteracy: 'high',
    assetAllocation: { equity: 65, debt: 20, gold: 5, cash: 10 },
    debtProfile: { creditCard: 30000, personalLoan: 0, homeLoan: 0 },
    spendingPattern: 'tech_savvy', investmentFocus: 'direct_equity'
  },

  // PROFILE 11: Data Scientist - High Earner Optimizer
  '4444444444': {
    name: 'Amit Verma', location: 'Gurgaon, Haryana', profession: 'Data Scientist', age: 33,
    monthlyIncome: 160000, riskProfile: 'aggressive', financialLiteracy: 'expert',
    assetAllocation: { equity: 70, debt: 15, gold: 5, cash: 10 },
    debtProfile: { creditCard: 80000, personalLoan: 0, homeLoan: 4200000 },
    spendingPattern: 'optimizer', investmentFocus: 'quant_driven'
  },

  // PROFILE 12: Teacher - Government Job Security
  '5555555555': {
    name: 'Ritu Malhotra', location: 'Chandigarh, Punjab', profession: 'Teacher', age: 29,
    monthlyIncome: 45000, riskProfile: 'conservative', financialLiteracy: 'low',
    assetAllocation: { equity: 25, debt: 55, gold: 15, cash: 5 },
    debtProfile: { creditCard: 0, personalLoan: 0, homeLoan: 0 },
    spendingPattern: 'security_focused', investmentFocus: 'government_schemes'
  },

  // PROFILE 13: Civil Engineer - Traditional Investor
  '6666666666': {
    name: 'Suresh Pillai', location: 'Thiruvananthapuram, Kerala', profession: 'Civil Engineer', age: 34,
    monthlyIncome: 110000, riskProfile: 'moderate', financialLiteracy: 'medium',
    assetAllocation: { equity: 40, debt: 35, gold: 20, cash: 5 },
    debtProfile: { creditCard: 20000, personalLoan: 0, homeLoan: 2200000 },
    spendingPattern: 'traditional', investmentFocus: 'real_estate_gold'
  },

  // PROFILE 14: Doctor - High Debt High Income
  '7777777777': {
    name: 'Deepika Rao', location: 'Mangalore, Karnataka', profession: 'Doctor', age: 28,
    monthlyIncome: 200000, riskProfile: 'conservative', financialLiteracy: 'medium',
    assetAllocation: { equity: 35, debt: 45, gold: 10, cash: 10 },
    debtProfile: { creditCard: 50000, personalLoan: 0, homeLoan: 0, educationLoan: 1500000 },
    spendingPattern: 'debt_repayment', investmentFocus: 'debt_clearing'
  },

  // PROFILE 15: Architect - Creative Professional
  '8888888888': {
    name: 'Manish Tiwari', location: 'Lucknow, Uttar Pradesh', profession: 'Architect', age: 36,
    monthlyIncome: 140000, riskProfile: 'moderate', financialLiteracy: 'medium',
    assetAllocation: { equity: 50, debt: 30, gold: 10, cash: 10 },
    debtProfile: { creditCard: 60000, personalLoan: 300000, homeLoan: 2800000 },
    spendingPattern: 'project_based', investmentFocus: 'real_estate'
  },

  // PROFILE 16: Pharmacist - Healthcare Professional
  '9999999999': {
    name: 'Pooja Bhatt', location: 'Surat, Gujarat', profession: 'Pharmacist', age: 27,
    monthlyIncome: 75000, riskProfile: 'moderate', financialLiteracy: 'medium',
    assetAllocation: { equity: 50, debt: 30, gold: 15, cash: 5 },
    debtProfile: { creditCard: 18000, personalLoan: 0, homeLoan: 0 },
    spendingPattern: 'healthcare_focused', investmentFocus: 'health_insurance'
  }
};

module.exports = { expertProfiles };
