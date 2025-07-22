// Quick fix for data validation issues
const fs = require('fs');
const path = require('path');

function fixDataIssues() {
  const inputDir = path.join(__dirname, 'expert_final');
  
  console.log('🔧 Fixing data validation issues...\n');

  // Fix specific user data issues
  const fixes = [
    {
      userId: '1010101010',
      fixes: {
        'stocks[0].quantity': 50 // Fix missing quantity
      }
    },
    {
      userId: '1212121212', 
      fixes: {
        'stocks[0].quantity': 75,
        'stocks[1].quantity': 50,
        'stocks[2].quantity': 40
      }
    },
    {
      userId: '1818181818',
      fixes: {
        'monthlySpending.entertainment': 8000 // Fix missing entertainment
      }
    },
    {
      userId: '1919191919',
      fixes: {
        'profile.monthlyIncome': 165000, // Fix variable income
        'monthlySpending.housing': 25000,
        'monthlySpending.food': 15000,
        'monthlySpending.entertainment': 5000
      }
    },
    {
      userId: '2020202021',
      fixes: {
        'profile.monthlyIncome': 275000, // Fix variable income
        'monthlySpending.investments': 10000
      }
    },
    {
      userId: '2121212121',
      fixes: {
        'stocks[0].quantity': 100,
        'stocks[1].quantity': 80
      }
    },
    {
      userId: '2525252525',
      fixes: {
        'stocks[0].quantity': 60
      }
    },
    {
      userId: '3333333333',
      fixes: {
        'stocks[0].quantity': 45
      }
    },
    {
      userId: '4444444444',
      fixes: {
        'stocks[0].quantity': 85,
        'stocks[1].quantity': 70
      }
    }
  ];

  fixes.forEach(fix => {
    try {
      const filename = `${fix.userId}.json`;
      const filePath = path.join(inputDir, filename);
      
      if (fs.existsSync(filePath)) {
        const userData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        
        // Apply fixes
        Object.entries(fix.fixes).forEach(([path, value]) => {
          setNestedProperty(userData, path, value);
        });
        
        // Save fixed data
        fs.writeFileSync(filePath, JSON.stringify(userData, null, 2));
        console.log(`✅ Fixed ${userData.profile.name}`);
      }
    } catch (error) {
      console.log(`❌ Error fixing ${fix.userId}: ${error.message}`);
    }
  });

  console.log('\n🎉 Data issues fixed! Re-run validation...');
}

// Helper function to set nested properties
function setNestedProperty(obj, path, value) {
  const keys = path.split(/[\.\[\]]+/).filter(key => key !== '');
  let current = obj;
  
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!(key in current)) {
      current[key] = {};
    }
    current = current[key];
  }
  
  current[keys[keys.length - 1]] = value;
}

fixDataIssues();
