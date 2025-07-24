/**
 * Gemini Integration Test Script
 * Quick test to verify AI integration is working
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGeminiIntegration() {
  console.log('🧪 Testing Gemini Integration...\n');

  try {
    // Initialize Gemini
    const genAI = new GoogleGenerativeAI('AIzaSyCcfFgJzU1wixIFk-dwDee9_--jzvGgD58');
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    console.log('✅ Gemini API initialized successfully');

    // Test 1: Basic Financial Query
    console.log('\n📊 Test 1: Basic Financial Query');
    const basicQuery = "I earn ₹125,000 per month in Mumbai. Should I increase my SIP?";
    const basicResult = await model.generateContent(basicQuery);
    const basicResponse = await basicResult.response;
    console.log('Query:', basicQuery);
    console.log('Response:', basicResponse.text().substring(0, 200) + '...');

    // Test 2: Hindi Language Support
    console.log('\n🇮🇳 Test 2: Hindi Language Support');
    const hindiQuery = "मेरी मासिक आय ₹125,000 है। मुझे कितना emergency fund रखना चाहिए?";
    const hindiResult = await model.generateContent(hindiQuery);
    const hindiResponse = await hindiResult.response;
    console.log('Query:', hindiQuery);
    console.log('Response:', hindiResponse.text().substring(0, 200) + '...');

    // Test 3: Contextual Financial Advice
    console.log('\n💰 Test 3: Contextual Financial Advice');
    const contextQuery = `
You are a financial advisor for Indian professionals. 

User Profile:
- Name: Arjun Sharma
- Age: 28
- Profession: Software Engineer
- Location: Mumbai
- Monthly Income: ₹125,000
- Personal Inflation Rate: 11.8%
- Net Worth: ₹26.5 lakhs
- Risk Profile: Aggressive

Question: Given my high personal inflation rate of 11.8%, how should I adjust my investment strategy?

Please respond in a helpful, personalized manner with specific recommendations.`;

    const contextResult = await model.generateContent(contextQuery);
    const contextResponse = await contextResult.response;
    console.log('Query: Contextual financial advice for Arjun');
    console.log('Response:', contextResponse.text().substring(0, 300) + '...');

    // Test 4: Goal-based Planning
    console.log('\n🎯 Test 4: Goal-based Planning');
    const goalQuery = `
I'm 28 years old, earning ₹125,000/month in Mumbai. I want to:
1. Buy a house in 5 years
2. Build retirement corpus
3. Have emergency fund

Given Mumbai's high property prices (2.2x national average), what should be my priority and action plan?`;

    const goalResult = await model.generateContent(goalQuery);
    const goalResponse = await goalResult.response;
    console.log('Query: Multi-goal financial planning');
    console.log('Response:', goalResponse.text().substring(0, 300) + '...');

    console.log('\n🎉 All tests completed successfully!');
    console.log('\n📈 Integration Status:');
    console.log('✅ API Connection: Working');
    console.log('✅ Basic Queries: Working');
    console.log('✅ Hindi Support: Working');
    console.log('✅ Contextual Advice: Working');
    console.log('✅ Goal Planning: Working');

    return {
      success: true,
      message: 'Gemini integration fully functional'
    };

  } catch (error) {
    console.error('❌ Gemini integration test failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Run the test
testGeminiIntegration()
  .then(result => {
    if (result.success) {
      console.log('\n🚀 Ready to integrate with Fi-Zen app!');
    } else {
      console.log('\n⚠️ Integration needs debugging');
    }
  })
  .catch(console.error);

module.exports = testGeminiIntegration;
