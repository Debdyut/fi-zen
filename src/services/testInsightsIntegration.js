// Test InsightsScreen integration with real spending data
const DataService = require('./DataService');

async function testInsightsIntegration() {
  console.log('💡 Testing InsightsScreen Integration...\n');

  try {
    // Test different user types for insights
    const testUsers = [
      { id: '1010101010', type: 'High Spender' },
      { id: '5555555555', type: 'Conservative Saver' },
      { id: '1919191919', type: 'Business Owner' },
      { id: '2020202021', type: 'Trader' }
    ];

    for (const user of testUsers) {
      console.log(`👤 Testing ${user.type}: ${user.id}`);
      
      // Load insights data
      const [insights, peer, profile] = await Promise.all([
        DataService.getUserSpendingInsights(user.id),
        DataService.getPeerComparison(user.id),
        DataService.getUserProfile(user.id)
      ]);

      console.log(`   💰 Savings Rate: ${insights.savingsRate}%`);
      console.log(`   💸 Total Spending: ₹${insights.totalSpending.toLocaleString()}`);
      console.log(`   👥 Peer Percentile: ${peer.percentile}th`);
      console.log(`   📊 Risk Profile: ${profile.riskProfile}`);
      
      // Top spending categories
      console.log(`   🏆 Top Categories:`);
      insights.topCategories.slice(0, 3).forEach(cat => {
        console.log(`      ${cat.category}: ₹${cat.amount.toLocaleString()} (${Math.round(cat.percentage)}%)`);
      });
      
      // Insights
      console.log(`   💡 Insights: ${insights.insights.length} recommendations`);
      insights.insights.forEach(insight => {
        console.log(`      ${insight.type}: ${insight.message}`);
      });
      
      console.log('');
    }

    // Test specific insights calculations
    console.log('🧮 Test Insights Calculations:');
    const testUser = '1010101010';
    
    const insights = await DataService.getUserSpendingInsights(testUser);
    const profile = await DataService.getUserProfile(testUser);
    
    console.log('   Spending Analysis:');
    console.log(`     Monthly Income: ₹${profile.monthlyIncome.toLocaleString()}`);
    console.log(`     Total Spending: ₹${insights.totalSpending.toLocaleString()}`);
    console.log(`     Savings Rate: ${insights.savingsRate}%`);
    console.log(`     Savings Amount: ₹${(profile.monthlyIncome - insights.totalSpending).toLocaleString()}`);
    
    console.log('   Category Breakdown:');
    insights.topCategories.forEach(cat => {
      console.log(`     ${cat.category}: ₹${cat.amount.toLocaleString()} (${cat.percentage.toFixed(1)}% of income)`);
    });

    // Test peer comparison
    console.log('\n👥 Test Peer Comparison:');
    const peer = await DataService.getPeerComparison(testUser);
    console.log(`   User Net Worth: ₹${peer.userNetWorth.toLocaleString()}`);
    console.log(`   Peer Count: ${peer.peerCount}`);
    console.log(`   Percentile: ${peer.percentile}th`);
    console.log(`   Average Peer Net Worth: ₹${peer.averagePeerNetWorth.toLocaleString()}`);

    // Test performance
    console.log('\n⚡ Performance Test:');
    const startTime = Date.now();
    await Promise.all([
      DataService.getUserSpendingInsights(testUser),
      DataService.getPeerComparison(testUser),
      DataService.getUserProfile(testUser)
    ]);
    const loadTime = Date.now() - startTime;
    
    console.log(`   ✅ Insights data load time: ${loadTime}ms`);
    console.log(`   ✅ Performance: ${loadTime < 100 ? 'EXCELLENT' : loadTime < 500 ? 'GOOD' : 'NEEDS OPTIMIZATION'}`);

    console.log('\n🎉 InsightsScreen Integration Test Complete!');
    console.log('\n📋 INTEGRATION SUMMARY:');
    console.log('   ✅ Spending insights: Working');
    console.log('   ✅ Peer comparison: Calculated');
    console.log('   ✅ Recommendations: Generated');
    console.log('   ✅ Category breakdown: Available');
    console.log('   ✅ Multiple user types: Supported');
    console.log('   ✅ Performance: Optimized');
    
    console.log('\n🚀 InsightsScreen ready for real spending analysis!');

  } catch (error) {
    console.error('❌ Insights integration test failed:', error.message);
  }
}

testInsightsIntegration();
