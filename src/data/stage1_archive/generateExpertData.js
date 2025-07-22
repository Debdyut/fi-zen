// Generate expert-reviewed realistic data
const fs = require('fs');
const path = require('path');
const { generateArjunData, generatePriyaData } = require('./expertDataGenerator');

// Create expert directory
const outputDir = path.join(__dirname, 'expert_reviewed');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Generate expert-reviewed profiles
console.log('🎯 Generating expert-reviewed financial profiles...\n');

// Arjun - Aggressive tech professional
const arjunData = generateArjunData();
fs.writeFileSync(
  path.join(outputDir, '1010101010.json'), 
  JSON.stringify(arjunData, null, 2)
);
console.log('✅ Arjun Sharma - High-earning tech professional');
console.log(`   💰 Net Worth: ₹${arjunData.netWorth.netWorth.toLocaleString()}`);
console.log(`   📊 Risk Profile: ${arjunData.profile.riskProfile}`);

// Priya - Balanced investor  
const priyaData = generatePriyaData();
fs.writeFileSync(
  path.join(outputDir, '1111111111.json'),
  JSON.stringify(priyaData, null, 2)
);
console.log('✅ Priya Patel - Balanced marketing professional');
console.log(`   💰 Net Worth: ₹${priyaData.netWorth.netWorth.toLocaleString()}`);
console.log(`   📊 Risk Profile: ${priyaData.profile.riskProfile}`);

console.log('\n🎉 Expert-reviewed profiles generated!');
console.log('📁 Location: src/data/expert_reviewed/');
