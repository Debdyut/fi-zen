// Test Location Adaptation
const LocationAdapter = require('./src/utils/LocationAdapter.js').default;

const testUsers = [
  { name: 'Mumbai Engineer', location: 'Mumbai, Maharashtra', monthlyIncome: 125000, profession: 'Software Engineer' },
  { name: 'Indore Writer', location: 'Indore, Madhya Pradesh', monthlyIncome: 55000, profession: 'Content Writer' },
  { name: 'Bangalore VP', location: 'Bangalore, Karnataka', monthlyIncome: 350000, profession: 'VP Engineering' }
];

console.log('🧪 Testing Location Adaptation\n');

testUsers.forEach(user => {
  console.log(`${user.name}:`);
  
  const insights = LocationAdapter.getLocationInsights(user.location, user.monthlyIncome);
  const peerContext = LocationAdapter.getLocationPeerContext(user.location, user.profession, user.monthlyIncome);
  const savingsTarget = LocationAdapter.getLocationSavingsTarget(user.location, user.monthlyIncome);
  
  console.log(`  City: ${insights.city} (${insights.tier})`);
  console.log(`  Cost Multiplier: ${insights.costMultiplier}x`);
  console.log(`  Monthly Living Cost: ₹${Math.round(insights.costOfLiving).toLocaleString()}`);
  console.log(`  Affordability Ratio: ${insights.affordabilityRatio.toFixed(1)}x`);
  console.log(`  Savings Target: ${savingsTarget.target}%`);
  console.log(`  Peer Group: ${peerContext.peerGroup}`);
  console.log(`  Recommendations: ${insights.recommendations.length}`);
  console.log('');
});

console.log('✅ Location Adaptation working!');
