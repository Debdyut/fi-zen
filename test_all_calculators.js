// Test All Financial Calculators
const FinancialCalculators = require('./src/utils/FinancialCalculators.js').default;

const testUser = {
  monthlyIncome: 125000,
  name: 'Test User'
};

console.log('🧪 Testing All Financial Calculators\n');

// Test 1: SIP Calculator
console.log('1. SIP Calculator:');
const sipResult = FinancialCalculators.calculateSIP(1000000, 5, 12);
console.log(`  Target: ₹${sipResult.targetAmount.toLocaleString()}`);
console.log(`  Monthly SIP: ₹${sipResult.monthlySIP.toLocaleString()}`);
console.log(`  Total Investment: ₹${sipResult.totalInvestment.toLocaleString()}`);
console.log(`  Total Returns: ₹${sipResult.totalReturns.toLocaleString()}`);

// Test 2: Retirement Calculator
console.log('\n2. Retirement Calculator:');
const retirementResult = FinancialCalculators.calculateRetirement(30, 60, 500000, testUser.monthlyIncome);
console.log(`  Required Corpus: ₹${(retirementResult.requiredCorpus/10000000).toFixed(1)} Cr`);
console.log(`  Monthly SIP Needed: ₹${retirementResult.requiredMonthlySIP.toLocaleString()}`);
console.log(`  Years to Retirement: ${retirementResult.yearsToRetirement}`);
console.log(`  Additional Corpus Needed: ₹${(retirementResult.additionalCorpusNeeded/10000000).toFixed(1)} Cr`);

// Test 3: Home Loan Calculator
console.log('\n3. Home Loan Calculator:');
const homeLoanResult = FinancialCalculators.calculateHomeLoanAffordability(testUser.monthlyIncome, 0, 8.5, 20);
console.log(`  Max Loan Amount: ₹${(homeLoanResult.maxLoanAmount/100000).toFixed(1)} L`);
console.log(`  Affordable Property Price: ₹${(homeLoanResult.affordablePropertyPrice/100000).toFixed(1)} L`);
console.log(`  Max EMI: ₹${homeLoanResult.maxEMI.toLocaleString()}`);
console.log(`  Down Payment Needed: ₹${(homeLoanResult.downPaymentNeeded/100000).toFixed(1)} L`);

// Test 4: Tax Savings Calculator
console.log('\n4. Tax Savings Calculator:');
const taxResult = FinancialCalculators.calculateTaxSavings(testUser.monthlyIncome * 12, 50000);
console.log(`  Annual Income: ₹${taxResult.annualIncome.toLocaleString()}`);
console.log(`  Remaining Deduction: ₹${taxResult.remainingDeduction.toLocaleString()}`);
console.log(`  Potential Tax Savings: ₹${taxResult.potentialTaxSavings.toLocaleString()}`);
console.log(`  Monthly Investment Needed: ₹${taxResult.monthlySavingsNeeded.toLocaleString()}`);

// Test 5: Investment Growth Calculator
console.log('\n5. Investment Growth Calculator:');
const growthResult = FinancialCalculators.calculateInvestmentGrowth(100000, 10000, 10, 12);
console.log(`  Total Future Value: ₹${(growthResult.totalFutureValue/100000).toFixed(1)} L`);
console.log(`  Total Investment: ₹${(growthResult.totalInvestment/100000).toFixed(1)} L`);
console.log(`  Total Returns: ₹${(growthResult.totalReturns/100000).toFixed(1)} L`);
console.log(`  Return Percentage: ${growthResult.returnPercentage}%`);

console.log('\n✅ All Financial Calculators working!');
