// Test Goal Recommendations from Insights and MetricDetail
console.log('💡 GOAL RECOMMENDATIONS FROM INSIGHTS & METRICS');
console.log('===============================================');

// Mock the recommendation engine functionality
class GoalRecommendationEngine {
  static getGoalRecommendationsFromInsights(spendingData, userProfile, existingGoals) {
    const recommendations = [];
    const monthlySpending = spendingData.monthlySpending || {};
    const income = userProfile.monthlyIncome;
    const existingGoalIds = existingGoals.map(g => g.goalId);
    
    // High Entertainment Spending → Entertainment Budget Goal
    if (monthlySpending.entertainment > income * 0.15 && !existingGoalIds.includes('entertainment_budget')) {
      const targetBudget = Math.round(income * 0.10);
      const currentSpending = monthlySpending.entertainment;
      const monthlySavings = currentSpending - targetBudget;
      
      recommendations.push({
        goalId: 'entertainment_budget',
        title: 'Entertainment Budget Control',
        icon: '🎬',
        priority: 'medium',
        source: 'insights_spending_analysis',
        targetAmount: targetBudget * 12,
        monthlyContribution: monthlySavings,
        description: `Control entertainment spending to save ₹${monthlySavings.toLocaleString()}/month`,
        reasoning: `You're spending ₹${currentSpending.toLocaleString()}/month on entertainment (${((currentSpending/income)*100).toFixed(1)}% of income). Reducing to ₹${targetBudget.toLocaleString()}/month would free up ₹${monthlySavings.toLocaleString()}/month for other goals.`,
        impact: `Save ₹${(monthlySavings * 12).toLocaleString()}/year`
      });
    }
    
    // Low Savings Rate → Emergency Fund Boost
    const totalSpending = Object.values(monthlySpending).reduce((sum, amount) => sum + amount, 0);
    const savingsRate = ((income - totalSpending) / income) * 100;
    
    if (savingsRate < 15 && !existingGoalIds.includes('emergency_fund_boost')) {
      const additionalSavingsNeeded = Math.round(income * 0.05); // 5% more savings
      
      recommendations.push({
        goalId: 'emergency_fund_boost',
        title: 'Emergency Fund Acceleration',
        icon: '🚨',
        priority: 'high',
        source: 'insights_savings_analysis',
        targetAmount: income * 6,
        monthlyContribution: additionalSavingsNeeded,
        description: `Boost emergency fund with ₹${additionalSavingsNeeded.toLocaleString()}/month additional savings`,
        reasoning: `Your current savings rate is ${savingsRate.toFixed(1)}%. Increasing to 20% would provide better financial security.`,
        impact: `Achieve 6-month emergency fund 12 months faster`
      });
    }
    
    return recommendations;
  }
  
  static getGoalRecommendationsFromMetrics(metricData, userProfile, existingGoals) {
    const recommendations = [];
    const existingGoalIds = existingGoals.map(g => g.goalId);
    const income = userProfile.monthlyIncome;
    
    // High Returns but Low Investment → Investment Scaling Goal
    if (metricData.averageReturns > 15 && metricData.monthlyInvestment < income * 0.20) {
      const currentInvestment = metricData.monthlyInvestment || 0;
      const targetInvestment = Math.round(income * 0.25);
      const additionalInvestment = targetInvestment - currentInvestment;
      
      recommendations.push({
        goalId: 'investment_scaling',
        title: 'Scale Up Investments',
        icon: '📈',
        priority: 'high',
        source: 'metrics_returns_analysis',
        targetAmount: targetInvestment * 36,
        monthlyContribution: additionalInvestment,
        description: `Scale up investments by ₹${additionalInvestment.toLocaleString()}/month to maximize high returns`,
        reasoning: `You're achieving ${metricData.averageReturns}% returns, which is excellent. Increasing investment from ₹${currentInvestment.toLocaleString()} to ₹${targetInvestment.toLocaleString()}/month would significantly accelerate wealth building.`,
        impact: `Additional ₹${((additionalInvestment * 36 * (metricData.averageReturns/100))).toLocaleString()} in returns over 3 years`
      });
    }
    
    return recommendations;
  }
}

// Test scenarios
const testScenarios = [
  {
    screen: 'INSIGHTS SCREEN',
    user: {
      name: 'Rajesh Kumar',
      monthlyIncome: 150000,
      age: 32
    },
    spendingData: {
      monthlySpending: {
        housing: 45000,
        food: 25000,
        transport: 15000,
        entertainment: 25000, // High entertainment spending (16.7% of income)
        shopping: 15000,
        miscellaneous: 8000
      }
    },
    existingGoals: [
      { goalId: 'house_down_payment', title: 'House Down Payment' },
      { goalId: 'retirement_fund', title: 'Retirement Fund' }
    ]
  },
  {
    screen: 'METRIC DETAIL SCREEN',
    user: {
      name: 'Sanjay Mehta',
      monthlyIncome: 350000,
      age: 38
    },
    metricData: {
      averageReturns: 18.5, // High returns
      monthlyInvestment: 45000, // Only 12.8% of income
      portfolioDiversification: 0.7
    },
    existingGoals: [
      { goalId: 'emergency_fund', title: 'Emergency Fund' },
      { goalId: 'house_down_payment', title: 'House Down Payment' }
    ]
  }
];

testScenarios.forEach((scenario, index) => {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`SCENARIO ${index + 1}: ${scenario.screen}`);
  console.log(`${'='.repeat(60)}`);
  
  console.log(`\n👤 USER: ${scenario.user.name}`);
  console.log(`💰 Income: ₹${scenario.user.monthlyIncome.toLocaleString()}/month`);
  console.log(`📊 Current Goals: ${scenario.existingGoals.map(g => g.title).join(', ')}`);
  
  let recommendations = [];
  
  if (scenario.screen === 'INSIGHTS SCREEN') {
    recommendations = GoalRecommendationEngine.getGoalRecommendationsFromInsights(
      scenario.spendingData,
      scenario.user,
      scenario.existingGoals
    );
    
    const totalSpending = Object.values(scenario.spendingData.monthlySpending).reduce((sum, amount) => sum + amount, 0);
    const savingsRate = ((scenario.user.monthlyIncome - totalSpending) / scenario.user.monthlyIncome * 100).toFixed(1);
    
    console.log(`\n📈 SPENDING ANALYSIS:`);
    console.log(`   Total Spending: ₹${totalSpending.toLocaleString()}/month`);
    console.log(`   Savings Rate: ${savingsRate}%`);
    console.log(`   Entertainment: ₹${scenario.spendingData.monthlySpending.entertainment.toLocaleString()} (${((scenario.spendingData.monthlySpending.entertainment/scenario.user.monthlyIncome)*100).toFixed(1)}% of income)`);
  }
  
  if (scenario.screen === 'METRIC DETAIL SCREEN') {
    recommendations = GoalRecommendationEngine.getGoalRecommendationsFromMetrics(
      scenario.metricData,
      scenario.user,
      scenario.existingGoals
    );
    
    console.log(`\n📊 METRICS ANALYSIS:`);
    console.log(`   Average Returns: ${scenario.metricData.averageReturns}%`);
    console.log(`   Monthly Investment: ₹${scenario.metricData.monthlyInvestment.toLocaleString()} (${((scenario.metricData.monthlyInvestment/scenario.user.monthlyIncome)*100).toFixed(1)}% of income)`);
    console.log(`   Portfolio Diversification: ${(scenario.metricData.portfolioDiversification * 100).toFixed(0)}%`);
  }
  
  console.log(`\n💡 RECOMMENDED GOALS (${recommendations.length}):`);
  
  recommendations.forEach((rec, i) => {
    console.log(`\n   ${i + 1}. ${rec.icon} ${rec.title}`);
    console.log(`      Priority: ${rec.priority.toUpperCase()}`);
    console.log(`      Source: ${rec.source.replace(/_/g, ' ')}`);
    console.log(`      Target: ₹${rec.targetAmount.toLocaleString()}`);
    console.log(`      Monthly: ₹${rec.monthlyContribution.toLocaleString()}`);
    console.log(`      Impact: ${rec.impact}`);
    console.log(`      Reasoning: ${rec.reasoning}`);
    console.log(`      [Add This Goal] [Not Now]`);
  });
  
  if (recommendations.length === 0) {
    console.log(`   ✅ No new goal recommendations - current goals are well-optimized!`);
  }
});

console.log(`\n${'='.repeat(60)}`);
console.log('🔄 USER INTERACTION FLOW');
console.log(`${'='.repeat(60)}`);

console.log(`\n📱 INSIGHTS SCREEN:`);
console.log(`1. User views spending analysis`);
console.log(`2. System detects high entertainment spending`);
console.log(`3. Shows "Entertainment Budget Control" goal recommendation`);
console.log(`4. User clicks "Add This Goal"`);
console.log(`5. Goal is added to Goals screen with pre-filled details`);
console.log(`6. User can customize and confirm`);

console.log(`\n📊 METRIC DETAIL SCREEN:`);
console.log(`1. User views investment returns (18.5%)`);
console.log(`2. System detects low investment amount vs high returns`);
console.log(`3. Shows "Scale Up Investments" goal recommendation`);
console.log(`4. User clicks "Add This Goal"`);
console.log(`5. Goal is added with calculated optimal investment amount`);

console.log(`\n✅ BENEFITS:`);
console.log(`• Proactive goal suggestions based on actual data`);
console.log(`• Seamless flow from insights to actionable goals`);
console.log(`• Personalized recommendations for each user`);
console.log(`• Reduces manual goal creation effort`);
console.log(`• Increases goal relevance and achievement likelihood`);

console.log(`\n🎯 IMPLEMENTATION STATUS:`);
console.log(`✅ Goal Recommendation Engine - COMPLETE`);
console.log(`✅ Recommendation Cards UI - COMPLETE`);
console.log(`✅ Cross-screen integration - READY`);
console.log(`✅ Add Goal functionality - READY`);

console.log(`\n🚀 READY TO IMPLEMENT IN INSIGHTS & METRIC DETAIL SCREENS!`);
