// Quick fix for incomplete stock data
const fs = require('fs');
const path = require('path');

function fixIncompleteStocks() {
  const inputDir = path.join(__dirname, 'expert_final');
  
  const stockFixes = {
    '1212121212': {
      stocks: [
        {
          symbol: "INFY",
          companyName: "Infosys Limited",
          quantity: 75,
          avgPrice: 1400.00,
          currentPrice: 1678.50,
          investedAmount: 105000,
          currentValue: 125887,
          returns: 20887,
          returnsPercentage: 19.89
        },
        {
          symbol: "HDFCBANK",
          companyName: "HDFC Bank Limited",
          quantity: 50,
          avgPrice: 1600.00,
          currentPrice: 1789.25,
          investedAmount: 80000,
          currentValue: 89462,
          returns: 9462,
          returnsPercentage: 11.83
        },
        {
          symbol: "ICICIBANK",
          companyName: "ICICI Bank Limited",
          quantity: 40,
          avgPrice: 950.00,
          currentPrice: 1089.75,
          investedAmount: 38000,
          currentValue: 43590,
          returns: 5590,
          returnsPercentage: 14.71
        }
      ],
      totalStocks: 258939
    },
    '2121212121': {
      stocks: [
        {
          symbol: "INFY",
          companyName: "Infosys Limited",
          quantity: 100,
          avgPrice: 1450.00,
          currentPrice: 1678.50,
          investedAmount: 145000,
          currentValue: 167850,
          returns: 22850,
          returnsPercentage: 15.76
        },
        {
          symbol: "TCS",
          companyName: "Tata Consultancy Services",
          quantity: 80,
          avgPrice: 3200.00,
          currentPrice: 3456.75,
          investedAmount: 256000,
          currentValue: 276540,
          returns: 20540,
          returnsPercentage: 8.02
        }
      ],
      totalStocks: 444390
    },
    '4444444444': {
      stocks: [
        {
          symbol: "RELIANCE",
          companyName: "Reliance Industries Ltd",
          quantity: 85,
          avgPrice: 2450.00,
          currentPrice: 2678.50,
          investedAmount: 208250,
          currentValue: 227672,
          returns: 19422,
          returnsPercentage: 9.33
        },
        {
          symbol: "TCS",
          companyName: "Tata Consultancy Services",
          quantity: 70,
          avgPrice: 3200.00,
          currentPrice: 3456.75,
          investedAmount: 224000,
          currentValue: 241972,
          returns: 17972,
          returnsPercentage: 8.02
        }
      ],
      totalStocks: 469644
    }
  };

  Object.entries(stockFixes).forEach(([userId, data]) => {
    try {
      const filename = `${userId}.json`;
      const filePath = path.join(inputDir, filename);
      
      if (fs.existsSync(filePath)) {
        const userData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        
        // Replace stocks data
        userData.stocks = data.stocks;
        userData.totalStocks = data.totalStocks;
        
        // Update net worth
        if (userData.netWorth && userData.netWorth.breakdown) {
          userData.netWorth.breakdown.stocks = data.totalStocks;
          
          // Recalculate total assets and net worth
          const totalAssets = userData.totalBankBalance + userData.totalMutualFunds + 
                             userData.totalStocks + (userData.totalGold || 0) + 
                             (userData.npsAccount?.currentValue || 0);
          
          userData.netWorth.totalAssets = totalAssets;
          userData.netWorth.netWorth = totalAssets - userData.netWorth.totalLiabilities;
        }
        
        // Save fixed data
        fs.writeFileSync(filePath, JSON.stringify(userData, null, 2));
        console.log(`✅ Fixed stocks for ${userData.profile.name}`);
      }
    } catch (error) {
      console.log(`❌ Error fixing ${userId}: ${error.message}`);
    }
  });

  console.log('\n🎉 Stock data fixed!');
}

fixIncompleteStocks();
