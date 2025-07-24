/**
 * AI Features Demo Script
 * Showcases the AI capabilities with real user scenarios
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');

async function demoAIFeatures() {
  console.log('🎭 Fi-Zen AI Financial Advisor Demo\n');
  console.log('=' .repeat(50));

  const genAI = new GoogleGenerativeAI('AIzaSyCcfFgJzU1wixIFk-dwDee9_--jzvGgD58');
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  // Demo scenarios based on real user profiles
  const scenarios = [
    {
      title: "🏠 Arjun (Mumbai Software Engineer) - House Purchase Decision",
      profile: {
        name: "Arjun Sharma",
        age: 28,
        profession: "Software Engineer",
        location: "Mumbai",
        income: 125000,
        netWorth: 2659155,
        inflation: 11.8
      },
      query: "I earn ₹125K/month in Mumbai. Should I buy a house now or wait? Property prices are 2.2x national average here."
    },
    {
      title: "💰 Sanjay (VP Engineering) - Investment Strategy",
      profile: {
        name: "Sanjay Mehta",
        age: 38,
        profession: "VP Engineering",
        location: "Bangalore",
        income: 350000,
        netWorth: 4380600,
        inflation: 9.2
      },
      query: "I'm 38, earning ₹3.5L/month with ₹44L net worth. How should I optimize my portfolio for early retirement?"
    },
    {
      title: "📚 Meera (Content Writer) - Career Growth Planning",
      profile: {
        name: "Meera Joshi",
        age: 25,
        profession: "Content Writer",
        location: "Indore",
        income: 55000,
        netWorth: 547050,
        inflation: 8.5
      },
      query: "मैं ₹55K कमाती हूं। मुझे अपनी income बढ़ाने के लिए कौन से skills सीखने चाहिए और कैसे invest करूं?"
    },
    {
      title: "🏥 Deepika (Doctor) - Professional Practice Setup",
      profile: {
        name: "Deepika Rao",
        age: 32,
        profession: "Doctor",
        location: "Mangalore",
        income: 200000,
        netWorth: 1686268,
        inflation: 10.1
      },
      query: "I want to start my own clinic in 3 years. How much should I save and what's the best investment strategy?"
    }
  ];

  for (const scenario of scenarios) {
    console.log(`\n${scenario.title}`);
    console.log('-'.repeat(scenario.title.length - 2));
    
    const contextualPrompt = `
You are an AI financial advisor for Indian professionals. Provide personalized, actionable advice.

User Profile:
- Name: ${scenario.profile.name}
- Age: ${scenario.profile.age}
- Profession: ${scenario.profile.profession}
- Location: ${scenario.profile.location}
- Monthly Income: ₹${scenario.profile.income.toLocaleString()}
- Net Worth: ₹${scenario.profile.netWorth.toLocaleString()}
- Personal Inflation Rate: ${scenario.profile.inflation}%

User Question: ${scenario.query}

Guidelines:
1. Respond in the same language as the question
2. Use specific numbers and actionable recommendations
3. Consider their location's cost of living
4. Reference their personal inflation rate
5. Keep response under 250 words
6. Be encouraging and supportive

Response:`;

    try {
      const result = await model.generateContent(contextualPrompt);
      const response = await result.response;
      
      console.log(`👤 ${scenario.profile.name}: ${scenario.query}`);
      console.log(`🤖 AI Advisor: ${response.text()}`);
      
      // Add a small delay between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.log(`❌ Error for ${scenario.profile.name}: ${error.message}`);
    }
  }

  // Demo multi-language capabilities
  console.log('\n🌍 Multi-Language Financial Conversations');
  console.log('=' .repeat(45));

  const multiLangQueries = [
    {
      lang: "English",
      query: "What's the best SIP amount for someone earning ₹80K/month?",
      flag: "🇬🇧"
    },
    {
      lang: "Hindi", 
      query: "₹80K महीने कमाने वाले के लिए कितना SIP करना चाहिए?",
      flag: "🇮🇳"
    },
    {
      lang: "Mixed",
      query: "Mera monthly income ₹80K hai, kitna SIP karna chahiye for long term wealth?",
      flag: "🔄"
    }
  ];

  for (const langQuery of multiLangQueries) {
    console.log(`\n${langQuery.flag} ${langQuery.lang} Query:`);
    console.log(`👤 User: ${langQuery.query}`);
    
    try {
      const result = await model.generateContent(`
You are a financial advisor. Answer this query in the same language/style as asked:

${langQuery.query}

Keep response under 150 words and be specific with numbers.`);
      
      const response = await result.response;
      console.log(`🤖 AI: ${response.text()}`);
      
      await new Promise(resolve => setTimeout(resolve, 800));
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
  }

  // Demo goal-based planning
  console.log('\n🎯 AI Goal-Based Financial Planning');
  console.log('=' .repeat(40));

  const goalQuery = `
I'm 28, earning ₹125K/month in Mumbai with ₹26L net worth. I have multiple goals:

1. Buy a 2BHK apartment in Mumbai (₹1.2 crores)
2. Build retirement corpus for age 55
3. Emergency fund for 6 months
4. Child education planning (planning to have kids in 3 years)

Given Mumbai's high costs and my 11.8% personal inflation rate, what should be my priority order and monthly allocation strategy?`;

  console.log('👤 Complex Planning Query:');
  console.log(goalQuery);

  try {
    const result = await model.generateContent(`
You are an expert financial planner for Indian professionals. 

${goalQuery}

Provide:
1. Priority ranking with reasoning
2. Specific monthly allocation amounts
3. Timeline for each goal
4. Investment strategy for each goal
5. Risk mitigation advice

Be specific with numbers and actionable steps.`);

    const response = await result.response;
    console.log('\n🤖 AI Financial Planner:');
    console.log(response.text());
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }

  console.log('\n🎉 Demo Complete!');
  console.log('\n📊 AI Capabilities Demonstrated:');
  console.log('✅ Personalized financial advice');
  console.log('✅ Multi-language support (English/Hindi/Mixed)');
  console.log('✅ Context-aware recommendations');
  console.log('✅ Professional-specific guidance');
  console.log('✅ Location-based cost adjustments');
  console.log('✅ Complex goal-based planning');
  console.log('✅ Inflation-adjusted strategies');

  console.log('\n🚀 Ready for integration with Fi-Zen app!');
}

// Run the demo
demoAIFeatures().catch(console.error);

module.exports = demoAIFeatures;
