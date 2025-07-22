// Validate and standardize all user data files
const fs = require('fs');
const path = require('path');
const DataValidator = require('./utils/DataValidator');

const validator = new DataValidator();

// Process all user data files
function validateAndStandardizeAllUsers() {
  const inputDir = path.join(__dirname, 'expert_final');
  const outputDir = path.join(__dirname, 'standardized');
  
  // Create output directory
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log('🔍 DBA/Data Engineer: Validating and standardizing user data...\n');

  const files = fs.readdirSync(inputDir).filter(file => file.endsWith('.json'));
  let totalErrors = 0;
  let totalWarnings = 0;
  let processedUsers = 0;

  files.forEach(filename => {
    try {
      // Read user data
      const filePath = path.join(inputDir, filename);
      const userData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      
      // Validate data
      const validation = validator.validateUserData(userData);
      
      if (validation.errors.length > 0) {
        console.log(`❌ ${userData.profile?.name || filename}:`);
        validation.errors.forEach(error => console.log(`   🔴 ${error}`));
        totalErrors += validation.errors.length;
      }
      
      if (validation.warnings.length > 0) {
        console.log(`⚠️  ${userData.profile?.name || filename}:`);
        validation.warnings.forEach(warning => console.log(`   🟡 ${warning}`));
        totalWarnings += validation.warnings.length;
      }

      // Standardize data
      const standardizedData = validator.standardizeUserData(userData);
      
      // Re-validate standardized data
      const revalidation = validator.validateUserData(standardizedData);
      
      if (revalidation.isValid) {
        // Save standardized data
        const outputPath = path.join(outputDir, filename);
        fs.writeFileSync(outputPath, JSON.stringify(standardizedData, null, 2));
        
        if (validation.errors.length === 0 && validation.warnings.length === 0) {
          console.log(`✅ ${userData.profile?.name} - Clean data`);
        } else {
          console.log(`🔧 ${userData.profile?.name} - Fixed and standardized`);
        }
        processedUsers++;
      } else {
        console.log(`💥 ${userData.profile?.name} - Failed to fix errors`);
        revalidation.errors.forEach(error => console.log(`   🔴 ${error}`));
      }
      
    } catch (error) {
      console.log(`💥 Error processing ${filename}: ${error.message}`);
    }
  });

  console.log('\n📊 VALIDATION SUMMARY:');
  console.log(`   Users Processed: ${processedUsers}/${files.length}`);
  console.log(`   Total Errors Fixed: ${totalErrors}`);
  console.log(`   Total Warnings: ${totalWarnings}`);
  console.log(`   Success Rate: ${Math.round((processedUsers/files.length)*100)}%`);

  if (processedUsers === files.length && totalErrors === 0) {
    console.log('\n🎉 ALL DATA VALIDATED AND STANDARDIZED!');
    console.log('📁 Standardized data saved to: src/data/standardized/');
    console.log('🚀 Ready for DataService implementation!');
  } else {
    console.log('\n⚠️  Some issues found. Review errors above.');
  }

  return {
    processedUsers,
    totalUsers: files.length,
    totalErrors,
    totalWarnings,
    successRate: Math.round((processedUsers/files.length)*100)
  };
}

// Create index file for userId-based lookups
function createUserIndex() {
  const standardizedDir = path.join(__dirname, 'standardized');
  const indexPath = path.join(standardizedDir, 'userIndex.json');
  
  const files = fs.readdirSync(standardizedDir).filter(file => file.endsWith('.json') && file !== 'userIndex.json');
  const userIndex = {};
  
  files.forEach(filename => {
    const userData = JSON.parse(fs.readFileSync(path.join(standardizedDir, filename), 'utf8'));
    userIndex[userData.userId] = {
      filename: filename,
      name: userData.profile.name,
      profession: userData.profile.profession,
      location: userData.profile.location,
      riskProfile: userData.profile.riskProfile,
      monthlyIncome: userData.profile.monthlyIncome,
      netWorth: userData.netWorth.netWorth,
      lastUpdated: userData.metadata?.updatedAt || new Date().toISOString()
    };
  });

  fs.writeFileSync(indexPath, JSON.stringify(userIndex, null, 2));
  console.log(`\n📇 User index created with ${Object.keys(userIndex).length} users`);
  console.log('🔍 Index file: src/data/standardized/userIndex.json');
  
  return userIndex;
}

// Run validation and standardization
const results = validateAndStandardizeAllUsers();

// Create index if validation successful
if (results.successRate === 100) {
  createUserIndex();
}

module.exports = { validateAndStandardizeAllUsers, createUserIndex };
