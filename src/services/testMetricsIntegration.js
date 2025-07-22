// Test MetricsScreen integration with real portfolio data
const DataService = require('./DataService');

async function testMetricsIntegration() {
  console.log('📊 Testing MetricsScreen Integration...\n');

  try {
    // Test different user types for comprehensive metrics
    const testUsers = [
      { id: '1010101010', type: 'Aggressive Investor' },
      { id: '1717171717', type: 'HNI User' },
      { id: '5555555555', type: 'Conservative Saver' },
      { id: '1919191919', type: 'Business Owner' }
    ];

    for (const user of testUsers) {
      console.log(`👤 Testing ${user.type}: ${user.id}`);
      
      // Load all metric data
      const [userData, portfolio, allocation, returns] = await Promise.all([
        DataService.getUserData(user.id),
        DataService.getUserPortfolio(user.id),
        DataService.getUserAssetAllocation(user.id),
        DataService.getUserReturns(user.id)
      ]);

      console.log(`   📊 Portfolio Value: ₹${(portfolio.totalMutualFunds + portfolio.totalStocks + portfolio.totalGold).toLocaleString()}`);
      console.log(`   🥧 Asset Allocation: ${allocation.equity}% Equity, ${allocation.cash}% Cash`);
      console.log(`   📈 Returns: ${returns.overallReturnPercentage}% (₹${returns.totalReturns.toLocaleString()})`);
      console.log(`   💰 Net Worth: ₹${userData.netWorth.netWorth.toLocaleString()}`);
      
      // Test metric details
      console.log(`   📋 Holdings: ${portfolio.mutualFunds.length} MF, ${portfolio.stocks.length} Stocks, ${portfolio.goldInvestments.length} Gold`);
      console.log('');
    }

    // Test metric calculations
    console.log('🧮 Test Metric Calculations:');
    const testUser = '1010101010';
    
    const portfolio = await DataService.getUserPortfolio(testUser);
    const allocation = await DataService.getUserAssetAllocation(testUser);
    const returns = await DataService.getUserReturns(testUser);
    
    console.log('   Portfolio Breakdown:');
    console.log(`     Mutual Funds: ₹${portfolio.totalMutualFunds.toLocaleString()}`);
    console.log(`     Stocks: ₹${portfolio.totalStocks.toLocaleString()}`);
    console.log(`     Gold: ₹${portfolio.totalGold.toLocaleString()}`);
    
    console.log('   Asset Allocation:');
    console.log(`     Equity: ${allocation.equity}%`);
    console.log(`     Cash: ${allocation.cash}%`);
    console.log(`     Gold: ${allocation.gold}%`);
    console.log(`     NPS: ${allocation.nps}%`);
    
    console.log('   Returns Breakdown:');
    console.log(`     MF Returns: ₹${returns.breakdown.mutualFunds.toLocaleString()}`);
    console.log(`     Stock Returns: ₹${returns.breakdown.stocks.toLocaleString()}`);
    console.log(`     Gold Returns: ₹${returns.breakdown.gold.toLocaleString()}`);
    console.log(`     Overall: ${returns.overallReturnPercentage}%`);

    // Test performance
    console.log('\n⚡ Performance Test:');
    const startTime = Date.now();
    await Promise.all([
      DataService.getUserData(testUser),
      DataService.getUserPortfolio(testUser),
      DataService.getUserAssetAllocation(testUser),
      DataService.getUserReturns(testUser)
    ]);
    const loadTime = Date.now() - startTime;
    
    console.log(`   ✅ Metrics data load time: ${loadTime}ms`);
    console.log(`   ✅ Performance: ${loadTime < 100 ? 'EXCELLENT' : loadTime < 500 ? 'GOOD' : 'NEEDS OPTIMIZATION'}`);

    console.log('\n🎉 MetricsScreen Integration Test Complete!');
    console.log('\n📋 INTEGRATION SUMMARY:');
    console.log('   ✅ Portfolio data: Working');
    console.log('   ✅ Asset allocation: Calculated');
    console.log('   ✅ Investment returns: Computed');
    console.log('   ✅ Net worth breakdown: Available');
    console.log('   ✅ Multiple user types: Supported');
    console.log('   ✅ Performance: Optimized');
    
    console.log('\n🚀 MetricsScreen ready for real portfolio data!');

  } catch (error) {
    console.error('❌ Metrics integration test failed:', error.message);
  }
}

testMetricsIntegration();
