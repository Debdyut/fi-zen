// Generate all 16 expert-reviewed user profiles
const fs = require('fs');
const path = require('path');
const { expertProfiles } = require('./allExpertProfiles');

// Indian mutual funds by risk category
const mutualFunds = {
  conservative: [
    { name: "HDFC Hybrid Equity Fund - Direct Growth", nav: 78.45 },
    { name: "SBI Conservative Hybrid Fund - Direct Growth", nav: 45.67 }
  ],
  moderate: [
    { name: "SBI Bluechip Fund - Direct Growth", nav: 89.45 },
    { name: "HDFC Top 100 Fund - Direct Growth", nav: 156.78 }
  ],
  aggressive: [
    { name: "Axis Small Cap Fund - Direct Growth", nav: 78.90 },
    { name: "Parag Parikh Flexi Cap Fund - Direct Growth", nav: 234.56 }
  ]
};

// Generate realistic financial data based on expert profile
function generateExpertUserData(userId, profile) {
  const income = profile.monthlyIncome;
  const riskLevel = profile.riskProfile;
  
  // Calculate realistic bank balance (1-3 months of income)
  const bankBalance = Math.floor(income * (1 + Math.random() * 2));
  
  // Generate mutual funds based on risk profile and allocation
  const mfAllocation = Math.floor(income * profile.assetAllocation.equity * 0.01 * 12); // Annual allocation
  const selectedFunds = mutualFunds[riskLevel.includes('aggressive') ? 'aggressive' : 
                                   riskLevel.includes('conservative') ? 'conservative' : 'moderate'];
  
  const mutualFundPortfolio = selectedFunds.map((fund, index) => {
    const sipAmount = Math.floor(mfAllocation / selectedFunds.length / 12);
    const investedAmount = sipAmount * (6 + Math.floor(Math.random() * 18)); // 6-24 months
    const currentValue = investedAmount * (1 + (Math.random() * 0.3 - 0.05)); // -5% to +25% returns
    
    return {
      schemeName: fund.name,
      sipAmount: sipAmount,
      currentValue: Math.floor(currentValue),
      investedAmount: investedAmount,
      returns: Math.floor(currentValue - investedAmount),
      returnsPercentage: parseFloat(((currentValue - investedAmount) / investedAmount * 100).toFixed(2))
    };
  });
  
  // Generate stocks for higher risk profiles
  const stockValue = (riskLevel.includes('aggressive') && income > 80000) ? 
    Math.floor(income * profile.assetAllocation.equity * 0.005 * 12) : 0;
  
  // Generate gold based on cultural factors (Gujarat, Rajasthan higher allocation)
  const goldValue = profile.location.includes('Gujarat') || profile.location.includes('Rajasthan') ?
    Math.floor(income * profile.assetAllocation.gold * 0.01 * 6) : 
    Math.floor(income * profile.assetAllocation.gold * 0.01 * 3);
  
  // Calculate total assets and liabilities
  const totalMF = mutualFundPortfolio.reduce((sum, mf) => sum + mf.currentValue, 0);
  const totalAssets = bankBalance + totalMF + stockValue + goldValue;
  const totalLiabilities = profile.debtProfile.creditCard + 
                          (profile.debtProfile.personalLoan || 0) + 
                          (profile.debtProfile.educationLoan || 0);
  
  // Generate spending pattern based on profile
  const spendingMultipliers = {
    'lifestyle_inflation': { housing: 0.35, food: 0.18, entertainment: 0.12 },
    'budget_conscious': { housing: 0.25, food: 0.15, entertainment: 0.05 },
    'family_focused': { housing: 0.30, food: 0.20, family: 0.10 },
    'debt_repayment': { housing: 0.25, food: 0.12, debt: 0.40 },
    'systematic_saver': { housing: 0.28, food: 0.15, investments: 0.20 }
  };
  
  const multiplier = spendingMultipliers[profile.spendingPattern] || 
                    { housing: 0.30, food: 0.15, entertainment: 0.08 };
  
  return {
    userId,
    profile: {
      ...profile,
      avatar: parseInt(userId.slice(-1)) || 1,
      panCard: `ABCDE${userId.slice(-4)}X`,
      aadharCard: `${userId.slice(0,4)}-${userId.slice(4,8)}-${userId.slice(8,12)}`
    },
    
    bankAccounts: [
      {
        accountId: "PRIMARY_001",
        bankName: "HDFC Bank",
        accountType: "Salary",
        balance: Math.floor(bankBalance * 0.7)
      },
      {
        accountId: "SECONDARY_001",
        bankName: "SBI",
        accountType: "Savings", 
        balance: Math.floor(bankBalance * 0.3)
      }
    ],
    totalBankBalance: bankBalance,
    
    mutualFunds: mutualFundPortfolio,
    totalMutualFunds: totalMF,
    
    stocks: stockValue > 0 ? [{
      symbol: "INFY",
      companyName: "Infosys Limited",
      currentValue: stockValue,
      investedAmount: Math.floor(stockValue * 0.9),
      returns: Math.floor(stockValue * 0.1)
    }] : [],
    totalStocks: stockValue,
    
    goldInvestments: goldValue > 0 ? [{
      type: "Digital Gold",
      platform: "Paytm Gold",
      currentValue: goldValue,
      grams: parseFloat((goldValue / 5450).toFixed(2))
    }] : [],
    totalGold: goldValue,
    
    creditCards: profile.debtProfile.creditCard > 0 ? [{
      bankName: "HDFC Bank",
      cardType: "Credit Card",
      creditLimit: profile.debtProfile.creditCard * 4,
      outstandingAmount: profile.debtProfile.creditCard,
      minimumDue: Math.floor(profile.debtProfile.creditCard * 0.05)
    }] : [],
    
    monthlySpending: {
      housing: Math.floor(income * (multiplier.housing || 0.30)),
      food: Math.floor(income * (multiplier.food || 0.15)),
      transport: Math.floor(income * 0.10),
      investments: Math.floor(income * (multiplier.investments || 0.12)),
      entertainment: Math.floor(income * (multiplier.entertainment || 0.08)),
      miscellaneous: Math.floor(income * 0.10)
    },
    
    netWorth: {
      totalAssets: totalAssets,
      totalLiabilities: totalLiabilities,
      netWorth: totalAssets - totalLiabilities,
      breakdown: {
        bankAccounts: bankBalance,
        mutualFunds: totalMF,
        stocks: stockValue,
        gold: goldValue,
        creditCardDebt: -profile.debtProfile.creditCard,
        loans: -(profile.debtProfile.personalLoan || 0) - (profile.debtProfile.educationLoan || 0)
      }
    }
  };
}

// Generate all profiles
const outputDir = path.join(__dirname, 'expert_final');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log('🎯 Generating ALL 16 expert-reviewed financial profiles...\n');

Object.entries(expertProfiles).forEach(([userId, profile]) => {
  try {
    const userData = generateExpertUserData(userId, profile);
    const filePath = path.join(outputDir, `${userId}.json`);
    fs.writeFileSync(filePath, JSON.stringify(userData, null, 2));
    
    console.log(`✅ ${profile.name} - ${profile.profession}`);
    console.log(`   💰 Net Worth: ₹${userData.netWorth.netWorth.toLocaleString()}`);
    console.log(`   📊 Risk: ${profile.riskProfile} | Debt: ₹${userData.netWorth.totalLiabilities.toLocaleString()}`);
    console.log('');
  } catch (error) {
    console.error(`❌ Error generating ${profile.name}:`, error.message);
  }
});

console.log('🎉 All 16 expert-reviewed profiles generated!');
console.log('📁 Location: src/data/expert_final/');
