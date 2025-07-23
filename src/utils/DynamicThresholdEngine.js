// Dynamic Threshold Engine
// Replaces hard-coded values with personalized, adaptive thresholds

class DynamicThresholdEngine {
  
  // Get personalized spending thresholds based on user profile
  static getSpendingThresholds(userProfile) {
    const income = userProfile.monthlyIncome;
    const age = userProfile.age;
    const location = userProfile.location;
    const riskProfile = userProfile.riskProfile;
    
    // Base thresholds that adapt to user circumstances
    const baseThresholds = {
      entertainment: 0.15, // 15% base
      food: 0.25,          // 25% base
      housing: 0.30,       // 30% base
      savings: 0.20        // 20% base
    };
    
    // Age-based adjustments
    const ageMultiplier = this.getAgeMultiplier(age);
    
    // Location-based adjustments
    const locationMultiplier = this.getLocationMultiplier(location);
    
    // Risk profile adjustments
    const riskMultiplier = this.getRiskMultiplier(riskProfile);
    
    // Income bracket adjustments
    const incomeMultiplier = this.getIncomeMultiplier(income);
    
    return {
      entertainment: {
        warning: baseThresholds.entertainment * ageMultiplier * incomeMultiplier,
        target: baseThresholds.entertainment * 0.7 * incomeMultiplier, // 30% reduction target
        reasoning: this.getSpendingReasoning('entertainment', age, income, location)
      },
      food: {
        warning: baseThresholds.food * locationMultiplier,
        target: baseThresholds.food * 0.85 * locationMultiplier,
        reasoning: this.getSpendingReasoning('food', age, income, location)
      },
      savings: {
        minimum: Math.max(0.10, baseThresholds.savings * riskMultiplier * ageMultiplier),
        target: baseThresholds.savings * riskMultiplier * ageMultiplier,
        optimal: Math.min(0.40, baseThresholds.savings * 1.5 * riskMultiplier * ageMultiplier),
        reasoning: this.getSavingsReasoning(age, income, riskProfile)
      }
    };
  }
  
  // Age-based spending pattern adjustments
  static getAgeMultiplier(age) {
    if (age < 25) return 1.2;      // Young adults spend more on entertainment
    if (age < 35) return 1.0;      // Standard spending
    if (age < 45) return 0.8;      // Family responsibilities reduce discretionary spending
    return 0.6;                    // Older adults spend less on entertainment
  }
  
  // Location-based cost adjustments
  static getLocationMultiplier(location) {
    const city = location.toLowerCase();
    
    if (city.includes('mumbai') || city.includes('delhi') || city.includes('bangalore')) {
      return 1.3; // Metro cities - higher acceptable spending
    }
    if (city.includes('pune') || city.includes('hyderabad') || city.includes('chennai')) {
      return 1.1; // Tier 1.5 cities
    }
    return 0.9; // Tier 2 cities - lower cost expectations
  }
  
  // Risk profile adjustments for savings
  static getRiskMultiplier(riskProfile) {
    switch (riskProfile) {
      case 'conservative': return 1.3;           // Higher savings target
      case 'moderate': return 1.0;              // Standard
      case 'moderate_aggressive': return 0.9;   // Slightly lower (invest more)
      case 'aggressive': return 0.8;            // Lower savings (higher investment)
      case 'sophisticated_aggressive': return 0.7; // Lowest savings (maximum investment)
      default: return 1.0;
    }
  }
  
  // Income bracket adjustments
  static getIncomeMultiplier(income) {
    if (income < 50000) return 0.7;    // Lower income - stricter entertainment limits
    if (income < 100000) return 0.9;   // Mid income
    if (income < 200000) return 1.0;   // Standard
    if (income < 500000) return 1.2;   // High income - more flexibility
    return 1.5;                        // Very high income - maximum flexibility
  }
  
  // Get investment performance thresholds based on market conditions and user profile
  static getInvestmentThresholds(userProfile, marketConditions = {}) {
    const age = userProfile.age;
    const riskProfile = userProfile.riskProfile;
    const income = userProfile.monthlyIncome;
    
    // Base market returns (should be updated from real market data)
    const marketReturns = marketConditions.averageReturns || 12; // 12% base
    const marketVolatility = marketConditions.volatility || 0.15; // 15% volatility
    
    // Age-based return expectations
    const ageAdjustment = age < 35 ? 1.1 : age < 50 ? 1.0 : 0.9;
    
    // Risk profile adjustments
    const riskAdjustment = this.getRiskReturnMultiplier(riskProfile);
    
    return {
      excellent: Math.round(marketReturns * ageAdjustment * riskAdjustment * 1.2),
      good: Math.round(marketReturns * ageAdjustment * riskAdjustment),
      average: Math.round(marketReturns * ageAdjustment * riskAdjustment * 0.8),
      poor: Math.round(marketReturns * ageAdjustment * riskAdjustment * 0.6),
      reasoning: this.getInvestmentReasoning(age, riskProfile, marketReturns)
    };
  }
  
  // Risk-based return expectations
  static getRiskReturnMultiplier(riskProfile) {
    switch (riskProfile) {
      case 'conservative': return 0.7;           // Lower return expectations
      case 'moderate': return 0.9;              
      case 'moderate_aggressive': return 1.0;   
      case 'aggressive': return 1.2;            // Higher return expectations
      case 'sophisticated_aggressive': return 1.4;
      default: return 1.0;
    }
  }
  
  // Get dynamic goal amounts based on user's financial capacity
  static getGoalAmounts(userProfile, goalType) {
    const income = userProfile.monthlyIncome;
    const age = userProfile.age;
    const location = userProfile.location;
    const netWorth = userProfile.netWorth || 0;
    
    const locationMultiplier = this.getLocationMultiplier(location);
    const incomeCapacity = this.getIncomeCapacity(income, age);
    
    switch (goalType) {
      case 'tech_setup':
        return {
          target: Math.round(income * 0.6 * locationMultiplier), // 0.6 months income
          monthly: Math.round(income * 0.05), // 5% of income
          reasoning: `Tech setup budget based on ${(0.6 * locationMultiplier).toFixed(1)} months of your income, adjusted for ${location} costs`
        };
        
      case 'medical_education':
        return {
          target: Math.round(income * 1.5 * locationMultiplier), // 1.5 months income
          monthly: Math.round(income * 0.08), // 8% of income
          reasoning: `Medical education budget scaled to your income and ${location} education costs`
        };
        
      case 'emergency_fund':
        const months = this.getEmergencyFundMonths(age, income, userProfile.riskProfile);
        return {
          target: Math.round(income * months),
          monthly: Math.round(income * 0.15), // 15% of income
          reasoning: `${months} months emergency fund recommended for your age (${age}) and risk profile`
        };
        
      case 'house_down_payment':
        const houseMultiplier = this.getHouseDownPaymentMultiplier(income, age, location);
        return {
          target: Math.round(income * houseMultiplier * locationMultiplier),
          monthly: Math.round(income * 0.20), // 20% of income
          reasoning: `House down payment adjusted for ${location} property prices and your income level`
        };
        
      default:
        return {
          target: Math.round(income * 2), // 2 months income default
          monthly: Math.round(income * 0.10),
          reasoning: 'Standard goal amount based on your monthly income'
        };
    }
  }
  
  // Helper methods for reasoning
  static getSpendingReasoning(category, age, income, location) {
    const ageGroup = age < 30 ? 'young professional' : age < 45 ? 'mid-career' : 'senior professional';
    const incomeLevel = income < 100000 ? 'moderate income' : income < 300000 ? 'high income' : 'very high income';
    
    return `Recommended for ${ageGroup}s with ${incomeLevel} in ${location}`;
  }
  
  static getSavingsReasoning(age, income, riskProfile) {
    const timeHorizon = 65 - age;
    return `With ${timeHorizon} years to retirement and ${riskProfile} risk profile, this savings rate balances current needs with future security`;
  }
  
  static getInvestmentReasoning(age, riskProfile, marketReturns) {
    return `Based on current market conditions (${marketReturns}% average), your age (${age}), and ${riskProfile} risk tolerance`;
  }
  
  // Helper: Get emergency fund months based on profile
  static getEmergencyFundMonths(age, income, riskProfile) {
    let baseMonths = 6; // Standard 6 months
    
    // Age adjustments
    if (age > 45) baseMonths += 1; // Older = more conservative
    if (age < 25) baseMonths -= 1; // Younger = less conservative
    
    // Risk profile adjustments
    if (riskProfile === 'conservative') baseMonths += 1;
    if (riskProfile.includes('aggressive')) baseMonths -= 1;
    
    // Income stability adjustments
    if (income > 300000) baseMonths -= 1; // High income = more stability
    if (income < 50000) baseMonths += 1;  // Low income = need more buffer
    
    return Math.max(3, Math.min(9, baseMonths)); // Between 3-9 months
  }
  
  // Helper: Get house down payment multiplier
  static getHouseDownPaymentMultiplier(income, age, location) {
    let baseMultiplier = 24; // 24 months income base
    
    // Age adjustments - older people typically buy more expensive homes
    if (age > 35) baseMultiplier += 6;
    if (age < 28) baseMultiplier -= 6;
    
    // Income adjustments
    if (income > 200000) baseMultiplier += 12; // High earners buy expensive homes
    if (income < 80000) baseMultiplier -= 6;   // Lower earners buy modest homes
    
    return Math.max(12, Math.min(48, baseMultiplier)); // Between 1-4 years income
  }
  
  // Helper: Get income capacity for goals
  static getIncomeCapacity(income, age) {
    // Younger people can allocate more % to goals, older have more fixed expenses
    const ageCapacity = age < 30 ? 1.2 : age < 45 ? 1.0 : 0.8;
    const incomeCapacity = income > 200000 ? 1.3 : income > 100000 ? 1.0 : 0.7;
    
    return ageCapacity * incomeCapacity;
  }
}

export default DynamicThresholdEngine;
