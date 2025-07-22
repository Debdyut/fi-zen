// Test Analytics Engine
const AnalyticsEngine = require('./src/utils/AnalyticsEngine.js').default;

const testUser = {
  name: 'Test User',
  monthlyIncome: 125000,
  profession: 'Software Engineer'
};

console.log('🧪 Testing Analytics Engine\n');

// Test spending trends analysis
console.log('1. Spending Trends Analysis:');
const analytics = AnalyticsEngine.analyzeSpendingTrends(testUser);

console.log(`  Trend Direction: ${analytics.trend.direction}`);
console.log(`  Trend Rate: ${analytics.trend.rate.toFixed(1)}%`);
console.log(`  Volatility: ${analytics.volatility.level} (${analytics.volatility.percentage}%)`);
console.log(`  Seasonality: ${analytics.seasonality.hasSeasonality ? 'Detected' : 'None'}`);
console.log(`  Prediction: ₹${analytics.predictions.amount.toLocaleString()} (${analytics.predictions.confidence} confidence)`);

console.log('\n2. Category Trends:');
Object.entries(analytics.categories).forEach(([category, data]) => {
  console.log(`  ${category}: ${data.trend} (${data.change.toFixed(1)}%) - ₹${data.current.toLocaleString()}`);
});

console.log('\n3. Prediction Factors:');
analytics.predictions.factors.forEach(factor => {
  console.log(`  • ${factor}`);
});

console.log('\n4. Insights:');
console.log(`  • ${analytics.trend.insight}`);
console.log(`  • ${analytics.volatility.insight}`);
if (analytics.seasonality.hasSeasonality) {
  console.log(`  • ${analytics.seasonality.insight}`);
}

// Test goal analysis
console.log('\n5. Goal Analysis:');
const sampleGoals = [
  { name: 'Emergency Fund', amount: 750000, currentAmount: 200000, timeframe: 12 },
  { name: 'House Down Payment', amount: 2000000, currentAmount: 500000, timeframe: 24 }
];

const currentSavings = { savingsRate: 18 };
const goalAnalysis = AnalyticsEngine.analyzeGoalProgress(testUser, currentSavings, sampleGoals);

if (goalAnalysis) {
  goalAnalysis.forEach(goal => {
    console.log(`  ${goal.goalName}:`);
    console.log(`    Progress: ${goal.progress.toFixed(1)}%`);
    console.log(`    On Track: ${goal.onTrack ? 'Yes' : 'No'}`);
    console.log(`    Required Monthly: ₹${goal.requiredMonthlySavings.toLocaleString()}`);
    if (goal.shortfall > 0) {
      console.log(`    Shortfall: ₹${Math.round(goal.shortfall).toLocaleString()}/month`);
    }
  });
}

console.log('\n✅ Analytics Engine working!');
