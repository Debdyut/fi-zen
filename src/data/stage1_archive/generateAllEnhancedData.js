// Main script to generate all enhanced user data
const fs = require('fs');
const path = require('path');
const { generateEnhancedUserData } = require('./enhancedUserDataGenerator');

// Base user profiles
const userProfiles = {
  '1010101010': { name: 'Arjun Sharma', location: 'Mumbai, Maharashtra', profession: 'Software Engineer', age: 28, avatar: 1, income: 125000 },
  '1111111111': { name: 'Priya Patel', location: 'Ahmedabad, Gujarat', profession: 'Marketing Manager', age: 26, avatar: 2, income: 85000 },
  '1212121212': { name: 'Rajesh Kumar', location: 'Delhi, NCR', profession: 'Business Analyst', age: 32, avatar: 3, income: 150000 },
  '1313131313': { name: 'Sneha Reddy', location: 'Hyderabad, Telangana', profession: 'Graphic Designer', age: 24, avatar: 4, income: 65000 },
  '1414141414': { name: 'Vikram Singh', location: 'Jaipur, Rajasthan', profession: 'Sales Executive', age: 30, avatar: 5, income: 95000 },
  '2020202020': { name: 'Anita Gupta', location: 'Pune, Maharashtra', profession: 'HR Specialist', age: 27, avatar: 6, income: 78000 },
  '2121212121': { name: 'Karthik Nair', location: 'Kochi, Kerala', profession: 'Product Manager', age: 35, avatar: 7, income: 180000 },
  '2222222222': { name: 'Meera Joshi', location: 'Indore, Madhya Pradesh', profession: 'Content Writer', age: 25, avatar: 8, income: 55000 },
  '2525252525': { name: 'Rohit Agarwal', location: 'Kolkata, West Bengal', profession: 'Financial Advisor', age: 31, avatar: 9, income: 120000 },
  '3333333333': { name: 'Kavya Iyer', location: 'Chennai, Tamil Nadu', profession: 'UX Designer', age: 26, avatar: 10, income: 90000 },
  '4444444444': { name: 'Amit Verma', location: 'Gurgaon, Haryana', profession: 'Data Scientist', age: 33, avatar: 11, income: 160000 },
  '5555555555': { name: 'Ritu Malhotra', location: 'Chandigarh, Punjab', profession: 'Teacher', age: 29, avatar: 12, income: 45000 },
  '6666666666': { name: 'Suresh Pillai', location: 'Thiruvananthapuram, Kerala', profession: 'Civil Engineer', age: 34, avatar: 13, income: 110000 },
  '7777777777': { name: 'Deepika Rao', location: 'Mangalore, Karnataka', profession: 'Doctor', age: 28, avatar: 14, income: 200000 },
  '8888888888': { name: 'Manish Tiwari', location: 'Lucknow, Uttar Pradesh', profession: 'Architect', age: 36, avatar: 15, income: 140000 },
  '9999999999': { name: 'Pooja Bhatt', location: 'Surat, Gujarat', profession: 'Pharmacist', age: 27, avatar: 16, income: 75000 }
};

// Create enhanced directory
const outputDir = path.join(__dirname, 'enhanced_users_v2');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Generate enhanced data for all users
console.log('🚀 Generating enhanced financial data for all users...\n');

Object.entries(userProfiles).forEach(([userId, profile]) => {
  try {
    const userData = generateEnhancedUserData(userId, profile);
    const filePath = path.join(outputDir, `${userId}.json`);
    fs.writeFileSync(filePath, JSON.stringify(userData, null, 2));
    
    console.log(`✅ ${profile.name} (${userId})`);
    console.log(`   💰 Net Worth: ₹${userData.netWorth.netWorth.toLocaleString()}`);
    console.log(`   🏦 Bank Balance: ₹${userData.totalBankBalance.toLocaleString()}`);
    console.log(`   📈 Investments: MF(₹${userData.totalMutualFunds.toLocaleString()}) + Stocks(₹${userData.totalStocks.toLocaleString()})`);
    console.log('');
  } catch (error) {
    console.error(`❌ Error generating data for ${profile.name}:`, error.message);
  }
});

console.log('🎉 All enhanced user data generated successfully!');
console.log(`📁 Files saved in: ${outputDir}`);
