// Expert-reviewed data generator for realistic Indian fintech personas
const fs = require('fs');
const path = require('path');

// Generate realistic data for Arjun - High-earning tech professional
function generateArjunData() {
  return {
    userId: "1010101010",
    profile: {
      name: "Arjun Sharma",
      location: "Mumbai, Maharashtra", 
      profession: "Software Engineer",
      age: 28,
      avatar: 1,
      monthlyIncome: 125000,
      riskProfile: "aggressive",
      financialLiteracy: "high"
    },
    bankAccounts: [
      {
        accountId: "HDFC_SAL_001",
        bankName: "HDFC Bank",
        accountType: "Salary",
        balance: 85000,
        branch: "Bandra Kurla Complex"
      },
      {
        accountId: "ICICI_SAV_001", 
        bankName: "ICICI Bank",
        accountType: "Savings",
        balance: 45000,
        branch: "Powai"
      }
    ],
    totalBankBalance: 130000,
    
    // Aggressive equity allocation - 70% in stocks/MF
    mutualFunds: [
      {
        schemeName: "Axis Small Cap Fund - Direct Growth",
        sipAmount: 8000,
        currentValue: 95000,
        investedAmount: 80000,
        returns: 15000,
        returnsPercentage: 18.75
      },
      {
        schemeName: "Parag Parikh Flexi Cap Fund - Direct Growth", 
        sipAmount: 7000,
        currentValue: 85000,
        investedAmount: 75000,
        returns: 10000,
        returnsPercentage: 13.33
      }
    ],
    totalMutualFunds: 180000,
    
    stocks: [
      {
        symbol: "INFY",
        companyName: "Infosys Limited",
        quantity: 50,
        currentValue: 84000,
        investedAmount: 70000,
        returns: 14000
      }
    ],
    totalStocks: 84000,
    
    // Mumbai lifestyle - high rent, dining, transport
    monthlySpending: {
      housing: 45000,  // 36% of income (Mumbai rent)
      food: 18000,     // High dining out
      transport: 12000, // Uber heavy
      investments: 15000, // 12% SIP
      entertainment: 8000,
      miscellaneous: 10000
    },
    
    creditCards: [{
      bankName: "HDFC Bank",
      cardType: "Regalia Gold",
      creditLimit: 500000,
      outstandingAmount: 65000, // Lifestyle spending
      minimumDue: 6500
    }],
    
    netWorth: {
      totalAssets: 459000, // Bank + MF + Stocks + some gold
      totalLiabilities: 65000, // CC debt
      netWorth: 394000
    }
  };
}

// Generate realistic data for Priya - Balanced investor
function generatePriyaData() {
  return {
    userId: "1111111111", 
    profile: {
      name: "Priya Patel",
      location: "Ahmedabad, Gujarat",
      profession: "Marketing Manager", 
      age: 26,
      avatar: 2,
      monthlyIncome: 85000,
      riskProfile: "moderate",
      financialLiteracy: "medium"
    },
    bankAccounts: [
      {
        accountId: "SBI_SAL_001",
        bankName: "State Bank of India",
        accountType: "Salary", 
        balance: 65000
      },
      {
        accountId: "HDFC_SAV_001",
        bankName: "HDFC Bank", 
        accountType: "Savings",
        balance: 35000
      }
    ],
    totalBankBalance: 100000,
    
    // Balanced allocation with gold (Gujarat culture)
    mutualFunds: [
      {
        schemeName: "SBI Bluechip Fund - Direct Growth",
        sipAmount: 4000,
        currentValue: 48000,
        investedAmount: 42000,
        returns: 6000
      },
      {
        schemeName: "HDFC Hybrid Equity Fund - Direct Growth",
        sipAmount: 3000, 
        currentValue: 35000,
        investedAmount: 32000,
        returns: 3000
      }
    ],
    totalMutualFunds: 83000,
    
    goldInvestments: [{
      type: "Digital Gold",
      platform: "Paytm Gold", 
      grams: 15,
      currentValue: 82000,
      investedAmount: 75000
    }],
    
    // Wedding planning savings
    goals: [{
      title: "Wedding Fund",
      targetAmount: 1200000,
      currentAmount: 200000,
      monthlyContribution: 10000
    }],
    
    monthlySpending: {
      housing: 20000,  // 23% (lower than Mumbai)
      food: 12000,
      transport: 6000,
      investments: 7000, // 8% SIP
      shopping: 8000,   // Wedding prep
      family: 5000,     // Family support
      miscellaneous: 8000
    },
    
    netWorth: {
      totalAssets: 265000,
      totalLiabilities: 0, // Conservative, no debt
      netWorth: 265000
    }
  };
}

module.exports = { generateArjunData, generatePriyaData };
