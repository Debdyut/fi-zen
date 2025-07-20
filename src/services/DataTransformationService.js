class DataTransformationService {
  constructor() {
    // Keywords for categorizing transactions
    this.categoryKeywords = {
      food: [
        'swiggy', 'zomato', 'food', 'restaurant', 'cafe', 'groceries', 'grocery',
        'bigbasket', 'grofers', 'amazon fresh', 'dunzo', 'uber eats', 'dominos',
        'pizza', 'mcdonald', 'kfc', 'subway', 'starbucks', 'ccd', 'dmart'
      ],
      housing: [
        'rent', 'emi', 'home loan', 'housing', 'electricity', 'gas', 'water',
        'maintenance', 'society', 'utility', 'broadband', 'internet', 'wifi'
      ],
      transport: [
        'uber', 'ola', 'fuel', 'petrol', 'diesel', 'metro', 'bus', 'auto',
        'taxi', 'parking', 'toll', 'vehicle', 'car', 'bike', 'rapido'
      ],
      healthcare: [
        'hospital', 'medical', 'pharmacy', 'medicine', 'doctor', 'clinic',
        'health', 'insurance', 'apollo', 'fortis', 'max', 'medplus'
      ],
      education: [
        'school', 'college', 'university', 'course', 'training', 'book',
        'education', 'tuition', 'fees', 'exam', 'certification'
      ],
      entertainment: [
        'movie', 'cinema', 'netflix', 'amazon prime', 'spotify', 'hotstar',
        'shopping', 'mall', 'game', 'sports', 'gym', 'fitness', 'club'
      ],
      clothing: [
        'clothing', 'fashion', 'myntra', 'flipkart fashion', 'ajio', 'nykaa',
        'shoes', 'shirt', 'dress', 'apparel', 'textile'
      ],
      debt_payments: [
        'credit card', 'loan', 'emi', 'cred', 'bajaj', 'hdfc card', 'icici card',
        'axis card', 'sbi card', 'amex', 'personal loan'
      ],
      miscellaneous: [
        'gift', 'donation', 'personal care', 'salon', 'barber', 'spa'
      ]
    };
  }

  // Transform raw transaction data to categorized spending
  transformTransactionData(bankTransactions) {
    const categorizedSpending = {
      food: 0,
      housing: 0,
      transport: 0,
      healthcare: 0,
      education: 0,
      entertainment: 0,
      clothing: 0,
      debt_payments: 0,
      miscellaneous: 0
    };

    let totalSpending = 0;
    let monthlyIncome = 0;

    bankTransactions.forEach(bankData => {
      bankData.txns.forEach(transaction => {
        const [amount, narration, date, type] = transaction;
        const numAmount = parseFloat(amount);
        
        // Skip if invalid amount
        if (isNaN(numAmount)) return;

        // Credit transactions (income)
        if (type === 1) {
          if (narration.toLowerCase().includes('salary')) {
            monthlyIncome += numAmount;
          }
          return;
        }

        // Debit transactions (expenses)
        if (type === 2 || type === 6) {
          const category = this.categorizeTransaction(narration);
          categorizedSpending[category] += numAmount;
          totalSpending += numAmount;
        }
      });
    });

    return {
      categorizedSpending,
      totalSpending,
      monthlyIncome,
      savingsRate: monthlyIncome > 0 ? (monthlyIncome - totalSpending) / monthlyIncome : 0
    };
  }

  // Categorize individual transaction based on narration
  categorizeTransaction(narration) {
    const lowerNarration = narration.toLowerCase();
    
    for (const [category, keywords] of Object.entries(this.categoryKeywords)) {
      if (keywords.some(keyword => lowerNarration.includes(keyword))) {
        return category;
      }
    }
    
    return 'miscellaneous';
  }

  // Generate enhanced spending data for a user
  generateEnhancedSpendingData(userId, bankTransactions, location = null) {
    const transformed = this.transformTransactionData(bankTransactions);
    
    return {
      userId,
      location: location || this.getDefaultLocation(userId),
      monthlyIncome: transformed.monthlyIncome,
      spendingData: this.addSpendingMetadata(transformed.categorizedSpending),
      totalMonthlySpending: transformed.totalSpending,
      savingsRate: transformed.savingsRate,
      lastUpdated: new Date().toISOString()
    };
  }

  // Add metadata to spending categories
  addSpendingMetadata(categorizedSpending) {
    const total = Object.values(categorizedSpending).reduce((sum, val) => sum + val, 0);
    const enhancedData = {};

    Object.entries(categorizedSpending).forEach(([category, amount]) => {
      enhancedData[category] = {
        amount,
        percentage: total > 0 ? (amount / total) * 100 : 0,
        inflationSensitivity: this.getInflationSensitivity(category),
        seasonalVariation: this.getSeasonalVariation(category)
      };
    });

    return enhancedData;
  }

  // Get inflation sensitivity for category
  getInflationSensitivity(category) {
    const sensitivity = {
      food: 'high',
      housing: 'medium',
      transport: 'high',
      healthcare: 'medium',
      education: 'low',
      entertainment: 'medium',
      clothing: 'low',
      debt_payments: 'very_high',
      miscellaneous: 'medium'
    };
    return sensitivity[category] || 'medium';
  }

  // Get seasonal variation for category
  getSeasonalVariation(category) {
    const variation = {
      food: 0.12,
      housing: 0.05,
      transport: 0.15,
      healthcare: 0.10,
      education: 0.05,
      entertainment: 0.25,
      clothing: 0.30,
      debt_payments: 0.02,
      miscellaneous: 0.15
    };
    return variation[category] || 0.10;
  }

  // Get default location based on user ID (for demo)
  getDefaultLocation(userId) {
    const locationMap = {
      '2222222222': { city: 'Mumbai', tier: 'tier1' },
      '7777777777': { city: 'Pune', tier: 'tier1' },
      '8888888888': { city: 'Bangalore', tier: 'tier1' },
      '9999999999': { city: 'Coimbatore', tier: 'tier2' },
      '1313131313': { city: 'Chennai', tier: 'tier1' },
      '1414141414': { city: 'Mumbai', tier: 'tier1' },
      '1111111111': { city: 'Delhi', tier: 'tier1' },
      '3333333333': { city: 'Hyderabad', tier: 'tier1' },
      '4444444444': { city: 'Pune', tier: 'tier1' },
      '5555555555': { city: 'Delhi', tier: 'tier1' },
      '6666666666': { city: 'Kolkata', tier: 'tier1' },
      '1010101010': { city: 'Jaipur', tier: 'tier2' },
      '1212121212': { city: 'Lucknow', tier: 'tier2' },
      '2020202020': { city: 'Indore', tier: 'tier2' },
      '2121212121': { city: 'Bhopal', tier: 'tier2' },
      '2525252525': { city: 'Nagpur', tier: 'tier2' }
    };
    
    return locationMap[userId] || { city: 'Mumbai', tier: 'tier1' };
  }
}

export default new DataTransformationService();
