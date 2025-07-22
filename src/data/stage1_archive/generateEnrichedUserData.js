// Script to generate enriched user data for all 16 test users
const fs = require('fs');
const path = require('path');

// Base user profiles from UserProfileService
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

// Generate enriched data for a single user
function generateUserData(userId, profile) {
  const income = profile.income;
  const bankBalance = Math.floor(income * (0.5 + Math.random() * 1.5));
  
  return {
    userId,
    profile: {
      ...profile,
      monthlyIncome: income,
      panCard: `ABCDE${userId.slice(-4)}X`,
      aadharCard: `${userId.slice(0,4)}-${userId.slice(4,8)}-${userId.slice(8,12)}`
    },
    bankAccounts: generateBankAccounts(userId, bankBalance),
    totalBankBalance: bankBalance,
    // Add other financial data...
    netWorth: {
      totalAssets: bankBalance * 1.8,
      totalLiabilities: Math.floor(income * 0.3),
      netWorth: bankBalance * 1.5
    }
  };
}

function generateBankAccounts(userId, totalBalance) {
  const split = Math.random() * 0.6 + 0.2; // 20-80% split
  return [
    {
      accountId: "PRIMARY_001",
      bankName: "HDFC Bank",
      accountType: "Salary",
      balance: Math.floor(totalBalance * split)
    },
    {
      accountId: "SECONDARY_001", 
      bankName: "SBI",
      accountType: "Savings",
      balance: Math.floor(totalBalance * (1 - split))
    }
  ];
}

// Create directory if it doesn't exist
const outputDir = path.join(__dirname, 'enriched_users');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Generate data for all users
Object.entries(userProfiles).forEach(([userId, profile]) => {
  const userData = generateUserData(userId, profile);
  const filePath = path.join(outputDir, `${userId}.json`);
  fs.writeFileSync(filePath, JSON.stringify(userData, null, 2));
  console.log(`Generated data for ${profile.name} (${userId})`);
});

console.log('All user data generated successfully!');
