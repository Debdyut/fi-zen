// Test the PersonalizationEngine
const PersonalizationEngine = require('./src/utils/PersonalizationEngine.js').default;

const testUsers = [
  { name: 'Sanjay', monthlyIncome: 350000, riskProfile: 'aggressive' },
  { name: 'Rajesh', monthlyIncome: 150000, riskProfile: 'moderate' },
  { name: 'Meera', monthlyIncome: 55000, riskProfile: 'conservative' }
];

console.log('🧪 Testing Personalization Engine\n');

testUsers.forEach(user => {
  console.log(`${user.name} (₹${user.monthlyIncome.toLocaleString()}):`);
  
  const category = PersonalizationEngine.getIncomeCategory(user.monthlyIncome);
  const insights = PersonalizationEngine.getPersonalizedInsights(user);
  const recommendations = PersonalizationEngine.getRecommendations(user, { savingsRate: 15 });
  
  console.log(`  Category: ${category}`);
  console.log(`  Savings Target: ${insights.savingsTarget}%`);
  console.log(`  Focus: ${insights.investmentFocus}`);
  console.log(`  Recommendations: ${recommendations.length}`);
  console.log('');
});

console.log('✅ Personalization Engine working!');
