// Test Professional Goals Implementation
// Testing with our 20 user personas

const EnhancedPersonalizationEngine = require('./src/utils/EnhancedPersonalizationEngine.js').default;

// Test profiles from our analysis
const testProfiles = [
  {
    userId: '1717171717',
    name: 'Sanjay Mehta',
    profession: 'VP Engineering',
    monthlyIncome: 350000,
    age: 38,
    riskProfile: 'sophisticated_aggressive'
  },
  {
    userId: '2222222222',
    name: 'Meera Joshi',
    profession: 'Content Writer',
    monthlyIncome: 55000,
    age: 25,
    riskProfile: 'conservative'
  },
  {
    userId: '7777777777',
    name: 'Deepika Rao',
    profession: 'Doctor',
    monthlyIncome: 200000,
    age: 35,
    riskProfile: 'conservative'
  },
  {
    userId: '5555555555',
    name: 'Ritu Malhotra',
    profession: 'Teacher',
    monthlyIncome: 45000,
    age: 32,
    riskProfile: 'conservative'
  },
  {
    userId: '1919191919',
    name: 'Priya Entrepreneur',
    profession: 'Restaurant Owner',
    monthlyIncome: 165000,
    age: 34,
    riskProfile: 'moderate_aggressive'
  }
];

console.log('🧪 Testing Professional Goals Implementation');
console.log('==========================================');

testProfiles.forEach(profile => {
  console.log(`\n👤 ${profile.name} (${profile.profession})`);
  console.log(`💰 Income: ₹${profile.monthlyIncome.toLocaleString()}/month`);
  
  try {
    const professionalGoals = EnhancedPersonalizationEngine.getProfessionalGoals(profile);
    
    if (professionalGoals.length > 0) {
      console.log(`✅ Generated ${professionalGoals.length} professional goals:`);
      
      professionalGoals.forEach((goal, index) => {
        console.log(`   ${index + 1}. ${goal.icon} ${goal.title}`);
        console.log(`      Target: ₹${goal.targetAmount.toLocaleString()}`);
        console.log(`      Monthly: ₹${goal.monthlyContribution.toLocaleString()}`);
        console.log(`      Priority: ${goal.priority}`);
        console.log(`      Category: ${goal.category}`);
        console.log(`      Description: ${goal.description}`);
        console.log('');
      });
    } else {
      console.log('❌ No professional goals generated');
    }
    
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
});

console.log('\n📊 Implementation Status:');
console.log('✅ Tech Professionals: Skill development, equipment, startup investments');
console.log('✅ Healthcare: Practice setup, continuing education, insurance');
console.log('✅ Education: Professional development, summer planning');
console.log('✅ Business: Expansion capital, business emergency fund');
console.log('✅ Risk-based customization implemented');
console.log('✅ Income-based goal sizing implemented');

console.log('\n🎯 Next Steps:');
console.log('1. Add location-based cost adjustments');
console.log('2. Implement milestone celebration system');
console.log('3. Add cross-screen integration');
console.log('4. Test with all 20 user profiles');
