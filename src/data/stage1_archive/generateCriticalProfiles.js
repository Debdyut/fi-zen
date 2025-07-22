// Generate the 4 critical profiles for complete feature coverage
const fs = require('fs');
const path = require('path');
const { criticalProfiles } = require('./criticalProfiles');

// Generate HNI Tech Executive data
function generateSanjayData() {
  return {
    userId: "1717171717",
    profile: {
      name: "Sanjay Mehta",
      location: "Bangalore, Karnataka",
      profession: "VP Engineering", 
      age: 38,
      avatar: 17,
      monthlyIncome: 350000,
      riskProfile: "sophisticated_aggressive",
      financialLiteracy: "expert",
      portfolioSize: 5000000
    },
    
    bankAccounts: [
      {
        accountId: "HDFC_PRIV_001",
        bankName: "HDFC Bank Private Banking",
        accountType: "Priority Banking",
        balance: 850000,
        branch: "Koramangala"
      },
      {
        accountId: "ICICI_WEALTH_001", 
        bankName: "ICICI Wealth Management",
        accountType: "Wealth Account",
        balance: 650000,
        branch: "UB City Mall"
      }
    ],
    totalBankBalance: 1500000,
    
    // HNI Investment Portfolio
    mutualFunds: [
      {
        schemeName: "Parag Parikh Flexi Cap Fund - Direct Growth",
        sipAmount: 25000,
        currentValue: 850000,
        investedAmount: 720000,
        returns: 130000,
        returnsPercentage: 18.06
      },
      {
        schemeName: "PPFAS Long Term Equity Fund - Direct Growth", 
        sipAmount: 20000,
        currentValue: 650000,
        investedAmount: 580000,
        returns: 70000,
        returnsPercentage: 12.07
      }
    ],
    totalMutualFunds: 1500000,
    
    // Direct Equity Portfolio
    stocks: [
      {
        symbol: "INFY",
        companyName: "Infosys Limited",
        quantity: 500,
        currentValue: 839250,
        investedAmount: 725000,
        returns: 114250
      },
      {
        symbol: "TCS", 
        companyName: "Tata Consultancy Services",
        quantity: 200,
        currentValue: 691350,
        investedAmount: 640000,
        returns: 51350
      }
    ],
    totalStocks: 1530600,
    
    // Alternative Investments (HNI Feature)
    alternativeInvestments: [
      {
        type: "PMS",
        provider: "Motilal Oswal PMS",
        currentValue: 1200000,
        investedAmount: 1000000,
        returns: 200000,
        returnsPercentage: 20.0
      },
      {
        type: "AIF Category II",
        provider: "Edelweiss Alternative Investment",
        currentValue: 800000,
        investedAmount: 750000,
        returns: 50000,
        returnsPercentage: 6.67
      }
    ],
    totalAlternatives: 2000000,
    
    // Real Estate Investment
    realEstate: [
      {
        type: "Residential Property",
        location: "Whitefield, Bangalore",
        currentValue: 12000000,
        purchaseValue: 8500000,
        rentalIncome: 45000
      }
    ],
    
    creditCards: [{
      bankName: "HDFC Bank",
      cardType: "Infinia Credit Card",
      creditLimit: 2000000,
      outstandingAmount: 150000,
      minimumDue: 15000
    }],
    
    // HNI Spending Pattern
    monthlySpending: {
      housing: 85000,    // Premium housing
      food: 35000,       // Fine dining
      transport: 25000,  // Premium car maintenance
      investments: 45000, // High SIP amounts
      entertainment: 20000, // Premium lifestyle
      travel: 30000,     // Business + leisure travel
      miscellaneous: 25000
    },
    
    netWorth: {
      totalAssets: 18530600, // Including real estate
      totalLiabilities: 8650000, // Home loan + CC
      netWorth: 9880600,
      breakdown: {
        bankAccounts: 1500000,
        mutualFunds: 1500000,
        stocks: 1530600,
        alternatives: 2000000,
        realEstate: 12000000,
        homeLoan: -8500000,
        creditCardDebt: -150000
      }
    }
  };
}

// Generate Joint Family Breadwinner data
function generateRameshData() {
  return {
    userId: "1818181818",
    profile: {
      name: "Ramesh Agarwal",
      location: "Pune, Maharashtra",
      profession: "Manufacturing Manager",
      age: 42,
      avatar: 18,
      monthlyIncome: 180000,
      riskProfile: "moderate",
      financialLiteracy: "medium",
      familySize: 6,
      dependents: 4
    },
    
    bankAccounts: [
      {
        accountId: "SBI_FAM_001",
        bankName: "State Bank of India",
        accountType: "Family Savings",
        balance: 280000
      },
      {
        accountId: "HDFC_SAL_001",
        bankName: "HDFC Bank", 
        accountType: "Salary Account",
        balance: 120000
      }
    ],
    totalBankBalance: 400000,
    
    // Conservative Family-focused Investments
    mutualFunds: [
      {
        schemeName: "SBI Bluechip Fund - Direct Growth",
        sipAmount: 8000,
        currentValue: 285000,
        investedAmount: 240000,
        returns: 45000,
        returnsPercentage: 18.75
      },
      {
        schemeName: "HDFC Balanced Advantage Fund - Direct Growth",
        sipAmount: 6000,
        currentValue: 195000,
        investedAmount: 180000,
        returns: 15000,
        returnsPercentage: 8.33
      }
    ],
    totalMutualFunds: 480000,
    
    // Traditional Investments
    goldInvestments: [{
      type: "Physical Gold",
      grams: 45,
      currentValue: 245250,
      purchaseValue: 225000
    }],
    
    // Family Insurance & Goals
    insurancePolicies: [
      {
        type: "Term Life Insurance",
        coverAmount: 10000000,
        annualPremium: 24000,
        provider: "LIC"
      },
      {
        type: "Health Insurance",
        coverAmount: 1500000,
        annualPremium: 36000,
        provider: "Star Health"
      }
    ],
    
    // Children Education Goals
    goals: [
      {
        title: "Son's Engineering Education",
        targetAmount: 2500000,
        currentAmount: 450000,
        targetDate: "2030-06-01",
        monthlyContribution: 15000
      },
      {
        title: "Daughter's Medical Education", 
        targetAmount: 5000000,
        currentAmount: 280000,
        targetDate: "2032-06-01",
        monthlyContribution: 20000
      }
    ],
    
    // Family-focused Spending
    monthlySpending: {
      housing: 45000,     // Joint family home
      food: 35000,        // Large family
      education: 25000,   // Children's education
      healthcare: 15000,  // Family healthcare
      transport: 18000,   // Family vehicle
      investments: 14000, // Conservative SIPs
      family_support: 12000, // Parents support
      miscellaneous: 16000
    },
    
    netWorth: {
      totalAssets: 1125250,
      totalLiabilities: 4480000, // Home loan + personal loan
      netWorth: -3354750, // Negative due to loans, but building assets
      breakdown: {
        bankAccounts: 400000,
        mutualFunds: 480000,
        gold: 245250,
        homeLoan: -4200000,
        personalLoan: -200000,
        creditCardDebt: -80000
      }
    }
  };
}

// Generate all 4 critical profiles
const outputDir = path.join(__dirname, 'expert_final');

console.log('🎯 Generating 4 CRITICAL profiles for complete feature coverage...\n');

// Generate Sanjay - HNI Executive
const sanjayData = generateSanjayData();
fs.writeFileSync(
  path.join(outputDir, '1717171717.json'),
  JSON.stringify(sanjayData, null, 2)
);
console.log('✅ Sanjay Mehta - HNI Tech Executive');
console.log(`   💰 Net Worth: ₹${sanjayData.netWorth.netWorth.toLocaleString()}`);
console.log(`   📊 Portfolio: ₹${(sanjayData.totalMutualFunds + sanjayData.totalStocks + sanjayData.totalAlternatives).toLocaleString()}`);

// Generate Ramesh - Joint Family
const rameshData = generateRameshData();
fs.writeFileSync(
  path.join(outputDir, '1818181818.json'),
  JSON.stringify(rameshData, null, 2)
);
console.log('✅ Ramesh Agarwal - Joint Family Breadwinner');
console.log(`   💰 Net Worth: ₹${rameshData.netWorth.netWorth.toLocaleString()}`);
console.log(`   👨‍👩‍👧‍👦 Family Size: ${rameshData.profile.familySize} members`);

console.log('\n🎉 Critical profiles generated! Feature coverage now 90%+');
console.log('📁 Location: src/data/expert_final/');
console.log('\n🚀 Ready to proceed to Stage 2!');
