// Test Deltaverse API Integration
// Tests the new user endpoints integration

const EnhancedHybridDataService = require('./src/services/EnhancedHybridDataService');

async function testDeltaverseAPIIntegration() {
  console.log('🚀 Testing Deltaverse API Integration\n');

  // Initialize service in API mode
  process.env.USE_API = 'true';
  process.env.DELTAVERSE_API_URL = 'http://localhost:8000/api/v1';
  
  const dataService = new EnhancedHybridDataService();
  const testUserId = '1010101010';

  try {
    // Test 1: Get User Profile
    console.log('📋 Test 1: Get Complete User Profile');
    console.log('Endpoint: GET /api/v1/users/{user_id}');
    try {
      const userProfile = await dataService.getUserById(testUserId);
      console.log('✅ User Profile:', {
        userId: userProfile.userId,
        name: userProfile.profile?.name,
        profession: userProfile.profile?.profession,
        monthlyIncome: userProfile.monthlyIncome,
        netWorth: userProfile.netWorth,
        source: userProfile._source
      });
    } catch (error) {
      console.log('❌ User Profile Error:', error.message);
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // Test 2: Get User Summary  
    console.log('📊 Test 2: Get User Summary');
    console.log('Endpoint: GET /api/v1/users/{user_id}/summary');
    try {
      const userSummary = await dataService.getUserSummary(testUserId);
      console.log('✅ User Summary:', {
        userId: userSummary.userId,
        name: userSummary.name,
        profession: userSummary.profession,
        location: userSummary.location,
        netWorth: userSummary.netWorth,
        avatar: userSummary.avatar,
        source: userSummary._source
      });
    } catch (error) {
      console.log('❌ User Summary Error:', error.message);
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // Test 3: Get All Users
    console.log('👥 Test 3: Get All Users');
    console.log('Endpoint: GET /api/v1/users/?limit=5');
    try {
      const allUsers = await dataService.getAvailableUsers();
      console.log(`✅ Found ${allUsers.length} users:`);
      allUsers.slice(0, 3).forEach(user => {
        console.log(`  - ${user.name} (${user.userId}) - ${user.profession}`);
      });
    } catch (error) {
      console.log('❌ All Users Error:', error.message);
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // Test 4: Get Financial Health
    console.log('💰 Test 4: Get Financial Health');
    console.log('Endpoint: GET /api/v1/users/{user_id}/financial-health');
    try {
      const financialHealth = await dataService.getFinancialHealth(testUserId);
      console.log('✅ Financial Health:', {
        userId: financialHealth.userId,
        score: financialHealth.score,
        status: financialHealth.status,
        metrics: financialHealth.metrics,
        source: financialHealth._source
      });
    } catch (error) {
      console.log('❌ Financial Health Error:', error.message);
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // Test 5: Fallback Behavior
    console.log('🔄 Test 5: Testing Fallback to File Mode');
    console.log('Simulating API failure...');
    
    // Temporarily break API URL to test fallback
    const originalURL = process.env.DELTAVERSE_API_URL;
    process.env.DELTAVERSE_API_URL = 'http://invalid-url:9999/api/v1';
    
    const fallbackService = new EnhancedHybridDataService();
    
    try {
      const fallbackUser = await fallbackService.getUserSummary(testUserId);
      console.log('✅ Fallback worked:', {
        name: fallbackUser.name,
        source: fallbackUser._source
      });
    } catch (error) {
      console.log('❌ Fallback failed:', error.message);
    }
    
    // Restore original URL
    process.env.DELTAVERSE_API_URL = originalURL;

  } catch (error) {
    console.error('❌ Test suite error:', error.message);
  }

  console.log('\n🏁 Deltaverse API Integration Test Complete');
}

// Run the test
if (require.main === module) {
  testDeltaverseAPIIntegration().catch(console.error);
}

module.exports = { testDeltaverseAPIIntegration };
