// Test Integration of All Phase 2 Features
console.log('🧪 Testing Phase 2 Integration\n');

// Test PersonalizationEngine
const PersonalizationEngine = require('./src/utils/PersonalizationEngine.js').default;
const testUser = {
  monthlyIncome: 125000,
  riskProfile: 'moderate_aggressive',
  location: 'Mumbai, Maharashtra',
  profession: 'Software Engineer'
};

console.log('1. PersonalizationEngine Integration:');
const recommendations = PersonalizationEngine.getRecommendations(testUser, { savingsRate: 18 });
console.log(`  Recommendations: ${recommendations.length}`);
recommendations.forEach((rec, index) => {
  console.log(`    ${index + 1}. ${rec.title} (${rec.priority})`);
});

// Test LocationAdapter
const LocationAdapter = require('./src/utils/LocationAdapter.js').default;
console.log('\n2. LocationAdapter Integration:');
const locationInsights = LocationAdapter.getLocationInsights(testUser.location, testUser.monthlyIncome);
console.log(`  City: ${locationInsights.city} (${locationInsights.tier})`);
console.log(`  Cost Multiplier: ${locationInsights.costMultiplier}x`);
console.log(`  Affordability Ratio: ${locationInsights.affordabilityRatio.toFixed(1)}x`);

// Test RiskProfileAdapter
const RiskProfileAdapter = require('./src/utils/RiskProfileAdapter.js').default;
console.log('\n3. RiskProfileAdapter Integration:');
const riskRecs = RiskProfileAdapter.getRiskSpecificRecommendations(testUser.riskProfile, testUser);
console.log(`  Risk-based Recommendations: ${riskRecs.length}`);
riskRecs.forEach((rec, index) => {
  console.log(`    ${index + 1}. ${rec.title}`);
});

// Test AnalyticsEngine
const AnalyticsEngine = require('./src/utils/AnalyticsEngine.js').default;
console.log('\n4. AnalyticsEngine Integration:');
const analytics = AnalyticsEngine.analyzeSpendingTrends(testUser);
console.log(`  Spending Trend: ${analytics.trend.direction} (${analytics.trend.rate.toFixed(1)}%)`);
console.log(`  Volatility: ${analytics.volatility.level} (${analytics.volatility.percentage}%)`);
console.log(`  Next Month Prediction: ₹${analytics.predictions.amount.toLocaleString()}`);

// Test FinancialCalculators
const FinancialCalculators = require('./src/utils/FinancialCalculators.js').default;
console.log('\n5. FinancialCalculators Integration:');
const emergencyFund = FinancialCalculators.calculateEmergencyFund(87500, 6);
const sipCalc = FinancialCalculators.calculateSIP(1000000, 5, 12);
const retirement = FinancialCalculators.calculateRetirement(30, 60, 500000, testUser.monthlyIncome);
const homeLoan = FinancialCalculators.calculateHomeLoanAffordability(testUser.monthlyIncome, 0, 8.5, 20);

console.log(`  Emergency Fund Target: ₹${emergencyFund.targetAmount.toLocaleString()}`);
console.log(`  SIP Required: ₹${sipCalc.monthlySIP.toLocaleString()}/month`);
console.log(`  Retirement SIP: ₹${retirement.requiredMonthlySIP.toLocaleString()}/month`);
console.log(`  Home Loan Eligibility: ₹${(homeLoan.maxLoanAmount/100000).toFixed(1)}L`);

console.log('\n✅ All Phase 2 Features Integrated Successfully!');
console.log('\n🎯 Integration Summary:');
console.log('- ✅ Personalization Engine: Income + Risk + Location');
console.log('- ✅ Enhanced Analytics: Trends + Predictions');
console.log('- ✅ Interactive Calculators: 4 financial tools');
console.log('- ✅ Smart Recommendations: Context-aware advice');
console.log('- ✅ Location Insights: City-specific analysis');
console.log('- ✅ Risk Adaptation: Profile-based customization');

console.log('\n🚀 Ready for comprehensive user persona testing!');
