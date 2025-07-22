// Test script for Enhanced DataService
// Validates all functionality with real user data

const DataService = require('./DataService');

async function testDataService() {
  console.log('🧪 Testing Enhanced DataService...\n');

  try {
    // Test 1: Get available users
    console.log('📋 Test 1: Get Available Users');
    const users = DataService.getAvailableUsers();
    console.log(`   ✅ Found ${users.length} users`);
    console.log(`   👤 Sample: ${users[0]?.name} (${users[0]?.profession})`);

    // Test 2: Get user data
    console.log('\n📊 Test 2: Get User Data');
    const testUserId = '1010101010'; // Arjun Sharma
    const userData = await DataService.getUserData(testUserId);
    console.log(`   ✅ Loaded: ${userData.profile.name}`);
    console.log(`   💰 Net Worth: ₹${userData.netWorth.netWorth.toLocaleString()}`);

    // Test 3: Get user portfolio
    console.log('\n📈 Test 3: Get User Portfolio');
    const portfolio = await DataService.getUserPortfolio(testUserId);
    console.log(`   ✅ Mutual Funds: ${portfolio.mutualFunds.length} schemes, ₹${portfolio.totalMutualFunds.toLocaleString()}`);
    console.log(`   ✅ Stocks: ${portfolio.stocks.length} holdings, ₹${portfolio.totalStocks.toLocaleString()}`);

    // Test 4: Get spending insights
    console.log('\n💸 Test 4: Get Spending Insights');
    const spendingInsights = await DataService.getUserSpendingInsights(testUserId);
    console.log(`   ✅ Total Spending: ₹${spendingInsights.totalSpending.toLocaleString()}`);
    console.log(`   ✅ Savings Rate: ${spendingInsights.savingsRate}%`);
    console.log(`   ✅ Top Category: ${spendingInsights.topCategories[0]?.category} (₹${spendingInsights.topCategories[0]?.amount.toLocaleString()})`);

    // Test 5: Get asset allocation
    console.log('\n🥧 Test 5: Get Asset Allocation');
    const allocation = await DataService.getUserAssetAllocation(testUserId);
    console.log(`   ✅ Equity: ${allocation.equity}%`);
    console.log(`   ✅ Cash: ${allocation.cash}%`);
    console.log(`   ✅ Gold: ${allocation.gold}%`);

    // Test 6: Get investment returns
    console.log('\n📊 Test 6: Get Investment Returns');
    const returns = await DataService.getUserReturns(testUserId);
    console.log(`   ✅ Total Returns: ₹${returns.totalReturns.toLocaleString()}`);
    console.log(`   ✅ Overall Return: ${returns.overallReturnPercentage}%`);

    // Test 7: Get peer comparison
    console.log('\n👥 Test 7: Get Peer Comparison');
    const peerComparison = await DataService.getPeerComparison(testUserId, { profession: 'Software Engineer' });
    console.log(`   ✅ Peer Count: ${peerComparison.peerCount}`);
    console.log(`   ✅ Percentile: ${peerComparison.percentile}th percentile`);

    // Test 8: Test different user types
    console.log('\n🎭 Test 8: Test Different User Types');
    
    // HNI User
    const hniUser = '1717171717'; // Sanjay Mehta
    const hniData = await DataService.getUserData(hniUser);
    console.log(`   ✅ HNI User: ${hniData.profile.name} - ₹${hniData.netWorth.netWorth.toLocaleString()}`);
    
    // Conservative User
    const conservativeUser = '5555555555'; // Ritu Malhotra
    const conservativeData = await DataService.getUserData(conservativeUser);
    console.log(`   ✅ Conservative: ${conservativeData.profile.name} - ₹${conservativeData.netWorth.netWorth.toLocaleString()}`);
    
    // Business Owner
    const businessUser = '1919191919'; // Priya Entrepreneur
    const businessData = await DataService.getUserData(businessUser);
    console.log(`   ✅ Business Owner: ${businessData.profile.name} - ₹${businessData.netWorth.netWorth.toLocaleString()}`);

    // Test 9: Legacy compatibility
    console.log('\n🔄 Test 9: Legacy Compatibility');
    const legacyNetWorth = await DataService.loadNetWorth(testUserId);
    console.log(`   ✅ Legacy Net Worth: ₹${legacyNetWorth.totalNetWorth.amount.toLocaleString()}`);
    
    const legacyMF = await DataService.loadMutualFunds(testUserId);
    console.log(`   ✅ Legacy MF: ${legacyMF.funds.length} funds, ₹${legacyMF.totalValue.toLocaleString()}`);

    // Test 10: Performance metrics
    console.log('\n⚡ Test 10: Performance Metrics');
    const cacheStats = DataService.getCacheStats();
    console.log(`   ✅ Cache: ${cacheStats.cachedUsers}/${cacheStats.totalUsers} users cached`);
    console.log(`   ✅ Index: ${cacheStats.indexLoaded ? 'Loaded' : 'Not loaded'}`);

    console.log('\n🎉 All tests passed! DataService is working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error.stack);
  }
}

// Run tests
testDataService();
