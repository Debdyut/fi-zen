// Enhanced script to generate comprehensive Indian financial data
const fs = require('fs');
const path = require('path');

// Indian mutual fund schemes
const mutualFunds = [
  { code: "120503", name: "SBI Bluechip Fund - Direct Growth", nav: 89.45 },
  { code: "120716", name: "HDFC Mid-Cap Opportunities Fund - Direct Growth", nav: 145.67 },
  { code: "120717", name: "Axis Small Cap Fund - Direct Growth", nav: 78.90 },
  { code: "120718", name: "Mirae Asset Large Cap Fund - Direct Growth", nav: 98.76 },
  { code: "120719", name: "PPFAS Long Term Equity Fund - Direct Growth", nav: 67.89 }
];

// Indian stock symbols
const stocks = [
  { symbol: "RELIANCE", name: "Reliance Industries Ltd", price: 2678.50 },
  { symbol: "TCS", name: "Tata Consultancy Services", price: 3456.75 },
  { symbol: "INFY", name: "Infosys Limited", price: 1678.50 },
  { symbol: "HDFCBANK", name: "HDFC Bank Limited", price: 1789.25 },
  { symbol: "ICICIBANK", name: "ICICI Bank Limited", price: 1089.75 },
  { symbol: "ITC", name: "ITC Limited", price: 456.80 },
  { symbol: "BHARTIARTL", name: "Bharti Airtel Limited", price: 1234.60 }
];

// Indian banks
const banks = [
  { name: "HDFC Bank", ifsc: "HDFC0001234" },
  { name: "State Bank of India", ifsc: "SBIN0001234" },
  { name: "ICICI Bank", ifsc: "ICIC0001234" },
  { name: "Axis Bank", ifsc: "UTIB0001234" },
  { name: "Kotak Mahindra Bank", ifsc: "KKBK0001234" }
];

// Generate mutual fund portfolio
function generateMutualFunds(income, userId) {
  const numFunds = Math.min(Math.floor(income / 30000) + 1, 4); // 1-4 funds based on income
  const selectedFunds = mutualFunds.slice(0, numFunds);
  const totalSipAmount = Math.floor(income * 0.08); // 8% of income in SIP
  
  return selectedFunds.map((fund, index) => {
    const sipAmount = Math.floor(totalSipAmount / numFunds);
    const investedAmount = sipAmount * (12 + Math.floor(Math.random() * 24)); // 1-3 years
    const units = investedAmount / (fund.nav * 0.85); // Assuming avg NAV was 85% of current
    const currentValue = units * fund.nav;
    const returns = currentValue - investedAmount;
    
    return {
      schemeCode: fund.code,
      schemeName: fund.name,
      folioNumber: `${userId.slice(-3)}${index + 1}`,
      units: parseFloat(units.toFixed(3)),
      nav: fund.nav,
      currentValue: parseFloat(currentValue.toFixed(2)),
      investedAmount: parseFloat(investedAmount.toFixed(2)),
      returns: parseFloat(returns.toFixed(2)),
      returnsPercentage: parseFloat(((returns / investedAmount) * 100).toFixed(2)),
      sipAmount: sipAmount,
      sipDate: (index * 5) + 5, // 5th, 10th, 15th, 20th
      sipStatus: "Active"
    };
  });
}

// Generate stock portfolio
function generateStocks(income, userId) {
  if (income < 80000) return []; // Only higher income users have stocks
  
  const numStocks = Math.min(Math.floor(income / 50000), 4);
  const selectedStocks = stocks.slice(0, numStocks);
  
  return selectedStocks.map(stock => {
    const quantity = Math.floor(Math.random() * 50) + 10;
    const avgPrice = stock.price * (0.8 + Math.random() * 0.3); // Bought at 80-110% of current price
    const investedAmount = quantity * avgPrice;
    const currentValue = quantity * stock.price;
    const returns = currentValue - investedAmount;
    
    return {
      symbol: stock.symbol,
      companyName: stock.name,
      quantity: quantity,
      avgPrice: parseFloat(avgPrice.toFixed(2)),
      currentPrice: stock.price,
      investedAmount: parseFloat(investedAmount.toFixed(2)),
      currentValue: parseFloat(currentValue.toFixed(2)),
      returns: parseFloat(returns.toFixed(2)),
      returnsPercentage: parseFloat(((returns / investedAmount) * 100).toFixed(2))
    };
  });
}

// Generate bank accounts
function generateBankAccounts(userId, totalBalance) {
  const primaryBank = banks[Math.floor(Math.random() * banks.length)];
  const secondaryBank = banks.find(b => b.name !== primaryBank.name);
  
  const primaryBalance = Math.floor(totalBalance * (0.6 + Math.random() * 0.3));
  const secondaryBalance = totalBalance - primaryBalance;
  
  return [
    {
      accountId: `${primaryBank.name.replace(/\s+/g, '_').toUpperCase()}_001`,
      bankName: primaryBank.name,
      accountType: "Salary",
      accountNumber: `${userId}001`,
      balance: primaryBalance,
      branch: "Main Branch",
      ifscCode: primaryBank.ifsc
    },
    {
      accountId: `${secondaryBank.name.replace(/\s+/g, '_').toUpperCase()}_001`,
      bankName: secondaryBank.name,
      accountType: "Savings", 
      accountNumber: `${userId}002`,
      balance: secondaryBalance,
      branch: "Secondary Branch",
      ifscCode: secondaryBank.ifsc
    }
  ];
}

// Generate recent transactions
function generateTransactions(income, profile) {
  const transactions = [];
  const categories = ['food', 'transport', 'shopping', 'entertainment', 'healthcare'];
  
  // Salary transaction
  transactions.push({
    date: "2025-07-19",
    description: "Salary Credit",
    amount: income,
    category: "income",
    paymentMethod: "NEFT",
    merchant: `${profile.profession} Company Ltd`
  });
  
  // Generate 8-10 expense transactions
  for (let i = 0; i < 9; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const amount = -(Math.floor(Math.random() * 3000) + 200);
    const date = new Date();
    date.setDate(date.getDate() - i - 1);
    
    transactions.push({
      date: date.toISOString().split('T')[0],
      description: getTransactionDescription(category),
      amount: amount,
      category: category,
      paymentMethod: Math.random() > 0.5 ? "UPI" : "Credit Card",
      merchant: getMerchantName(category)
    });
  }
  
  return transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
}

function getTransactionDescription(category) {
  const descriptions = {
    food: ["Swiggy Order", "Zomato Delivery", "McDonald's", "Dominos Pizza", "Grocery Store"],
    transport: ["Uber Ride", "Ola Cab", "Metro Card", "Petrol Pump", "Bus Ticket"],
    shopping: ["Amazon Purchase", "Flipkart Order", "Lifestyle Store", "Big Bazaar", "Local Store"],
    entertainment: ["BookMyShow", "Netflix", "Spotify", "Gaming", "Movie Ticket"],
    healthcare: ["Pharmacy", "Doctor Visit", "Lab Test", "Medicine", "Health Checkup"]
  };
  
  const options = descriptions[category] || ["General Purchase"];
  return options[Math.floor(Math.random() * options.length)];
}

function getMerchantName(category) {
  const merchants = {
    food: ["Swiggy", "Zomato", "McDonald's", "Dominos", "BigBasket"],
    transport: ["Uber", "Ola", "DMRC", "Shell", "KSRTC"],
    shopping: ["Amazon", "Flipkart", "Lifestyle", "BigBazaar", "Reliance"],
    entertainment: ["BookMyShow", "Netflix", "Spotify", "Steam", "PVR"],
    healthcare: ["Apollo", "MedPlus", "1mg", "Practo", "HealthCare"]
  };
  
  const options = merchants[category] || ["General Merchant"];
  return options[Math.floor(Math.random() * options.length)];
}

// Generate comprehensive user data
function generateEnhancedUserData(userId, profile) {
  const income = profile.income;
  const bankBalance = Math.floor(income * (0.7 + Math.random() * 1.8));
  const bankAccounts = generateBankAccounts(userId, bankBalance);
  const mutualFunds = generateMutualFunds(income, userId);
  const stocks = generateStocks(income, userId);
  
  const totalMF = mutualFunds.reduce((sum, mf) => sum + mf.currentValue, 0);
  const totalStocks = stocks.reduce((sum, stock) => sum + stock.currentValue, 0);
  
  // Gold investment (10-20% of users)
  const hasGold = Math.random() > 0.8;
  const goldValue = hasGold ? Math.floor(income * (0.3 + Math.random() * 0.5)) : 0;
  
  // NPS (for users above 25)
  const hasNPS = profile.age > 25 && Math.random() > 0.4;
  const npsValue = hasNPS ? Math.floor(income * (0.4 + Math.random() * 0.8)) : 0;
  
  // Credit card debt (30% of users)
  const hasCCDebt = Math.random() > 0.7;
  const ccDebt = hasCCDebt ? Math.floor(income * (0.2 + Math.random() * 0.4)) : 0;
  
  const totalAssets = bankBalance + totalMF + totalStocks + goldValue + npsValue;
  const netWorth = totalAssets - ccDebt;
  
  return {
    userId,
    profile: {
      ...profile,
      monthlyIncome: income,
      panCard: `ABCDE${userId.slice(-4)}X`,
      aadharCard: `${userId.slice(0,4)}-${userId.slice(4,8)}-${userId.slice(8,12)}`
    },
    bankAccounts,
    totalBankBalance: bankBalance,
    mutualFunds,
    totalMutualFunds: parseFloat(totalMF.toFixed(2)),
    stocks,
    totalStocks: parseFloat(totalStocks.toFixed(2)),
    goldInvestments: hasGold ? [{
      type: "Digital Gold",
      platform: "Paytm Gold",
      grams: parseFloat((goldValue / 5450).toFixed(2)),
      currentValue: goldValue,
      returns: Math.floor(goldValue * 0.05)
    }] : [],
    totalGold: goldValue,
    npsAccount: hasNPS ? {
      pranNumber: userId,
      currentValue: npsValue,
      monthlyContribution: Math.floor(income * 0.05)
    } : null,
    creditCards: hasCCDebt ? [{
      cardId: `CC_${userId}`,
      bankName: bankAccounts[0].bankName,
      cardType: "Credit Card",
      creditLimit: ccDebt * 4,
      outstandingAmount: ccDebt,
      minimumDue: Math.floor(ccDebt * 0.05)
    }] : [],
    netWorth: {
      totalAssets: parseFloat(totalAssets.toFixed(2)),
      totalLiabilities: ccDebt,
      netWorth: parseFloat(netWorth.toFixed(2)),
      breakdown: {
        bankAccounts: bankBalance,
        mutualFunds: parseFloat(totalMF.toFixed(2)),
        stocks: parseFloat(totalStocks.toFixed(2)),
        gold: goldValue,
        nps: npsValue,
        creditCardDebt: -ccDebt
      }
    },
    recentTransactions: generateTransactions(income, profile)
  };
}

module.exports = { generateEnhancedUserData };
