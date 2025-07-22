// Test Emergency Fund Calculator
const FinancialCalculators = require('./src/utils/FinancialCalculators.js').default;

console.log('🧪 Testing Emergency Fund Calculator\n');

const testCases = [
  { expenses: 50000, months: 6 },
  { expenses: 75000, months: 3 },
  { expenses: 100000, months: 12 }
];

testCases.forEach((test, index) => {
  console.log(`Test ${index + 1}:`);
  const result = FinancialCalculators.calculateEmergencyFund(test.expenses, test.months);
  
  console.log(`  Monthly Expenses: ₹${test.expenses.toLocaleString()}`);
  console.log(`  Target Months: ${test.months}`);
  console.log(`  Target Amount: ₹${result.targetAmount.toLocaleString()}`);
  console.log(`  Recommendations: ${result.recommendations.length}`);
  console.log('');
});

console.log('✅ Emergency Fund Calculator working!');
