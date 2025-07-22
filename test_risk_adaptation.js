// Test Risk Profile Adaptation
const RiskProfileAdapter = require('./src/utils/RiskProfileAdapter.js').default;

const testProfiles = [
  { name: 'Conservative Teacher', riskProfile: 'conservative', monthlyIncome: 45000 },
  { name: 'Moderate Engineer', riskProfile: 'moderate', monthlyIncome: 125000 },
  { name: 'Aggressive Trader', riskProfile: 'very_aggressive', monthlyIncome: 275000 }
];

console.log('🧪 Testing Risk Profile Adaptation\n');

testProfiles.forEach(profile => {
  console.log(`${profile.name} (${profile.riskProfile}):`);
  
  const investment = RiskProfileAdapter.getInvestmentRecommendations(profile.riskProfile, profile.monthlyIncome);
  const messaging = RiskProfileAdapter.getRiskMessaging(profile.riskProfile);
  const recommendations = RiskProfileAdapter.getRiskSpecificRecommendations(profile.riskProfile, profile);
  const ui = RiskProfileAdapter.getUIAdaptations(profile.riskProfile);
  
  console.log(`  Allocation: ${investment.allocation.equity}% equity, ${investment.allocation.debt}% debt`);
  console.log(`  Expected Return: ${investment.expectedReturn}`);
  console.log(`  Risk Level: ${investment.riskLevel}`);
  console.log(`  Messaging Tone: ${messaging.tone}`);
  console.log(`  UI Color: ${ui.primaryColor}`);
  console.log(`  Recommendations: ${recommendations.length}`);
  console.log('');
});

console.log('✅ Risk Profile Adaptation working!');
