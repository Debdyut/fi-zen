class EnhancedInflationCalculator {
  constructor() {
    // Real inflation data by category (India 2024)
    this.categoryInflationRates = {
      food: 8.7,           // Food and beverages
      housing: 4.2,        // Housing (rent, utilities)
      transport: 6.8,      // Transport and fuel
      healthcare: 5.9,     // Medical care
      education: 4.1,      // Education
      entertainment: 7.3,  // Recreation and entertainment
      clothing: 3.8,       // Clothing and footwear
      miscellaneous: 6.1   // Other goods and services
    };

    // Standard CPI weights for urban India
    this.standardWeights = {
      food: 0.459,         // 45.9%
      housing: 0.109,      // 10.9%
      transport: 0.086,    // 8.6%
      healthcare: 0.059,   // 5.9%
      education: 0.047,    // 4.7%
      entertainment: 0.067, // 6.7%
      clothing: 0.065,     // 6.5%
      miscellaneous: 0.108 // 10.8%
    };

    this.governmentInflation = 6.5; // Current RBI target
  }

  // Enhanced personal inflation calculation
  calculatePersonalInflation(spendingData, location = null, timeframe = 12) {
    if (!spendingData || Object.keys(spendingData).length === 0) {
      return this.getDefaultInflationForLocation(location);
    }

    const personalWeights = this.calculatePersonalWeights(spendingData);
    const locationAdjustedRates = this.getLocationAdjustedRates(location);
    
    let weightedInflation = 0;
    
    Object.keys(personalWeights).forEach(category => {
      const weight = personalWeights[category];
      const rate = locationAdjustedRates[category];
      weightedInflation += weight * rate;
    });

    // Apply time-based adjustments
    const timeAdjustedInflation = this.applyTimeAdjustment(weightedInflation, timeframe);
    
    return Math.round(timeAdjustedInflation * 10) / 10;
  }

  // Calculate personal spending weights
  calculatePersonalWeights(spendingData) {
    const totalSpending = Object.values(spendingData).reduce((sum, val) => sum + val, 0);
    
    if (totalSpending === 0) return this.standardWeights;

    const personalWeights = {};
    Object.keys(spendingData).forEach(category => {
      personalWeights[category] = spendingData[category] / totalSpending;
    });

    // Fill missing categories with standard weights (normalized)
    const coveredWeight = Object.values(personalWeights).reduce((sum, val) => sum + val, 0);
    const remainingWeight = 1 - coveredWeight;
    
    Object.keys(this.standardWeights).forEach(category => {
      if (!personalWeights[category]) {
        personalWeights[category] = this.standardWeights[category] * remainingWeight;
      }
    });

    return personalWeights;
  }

  // Get location-adjusted inflation rates
  getLocationAdjustedRates(location) {
    if (!location) return this.categoryInflationRates;

    const locationMultipliers = this.getLocationMultipliers(location);
    const adjustedRates = {};

    Object.keys(this.categoryInflationRates).forEach(category => {
      const baseRate = this.categoryInflationRates[category];
      const multiplier = locationMultipliers[category] || 1.0;
      adjustedRates[category] = baseRate * multiplier;
    });

    return adjustedRates;
  }

  // Location-specific multipliers (Tier 1, 2, 3 cities)
  getLocationMultipliers(location) {
    const cityTiers = {
      tier1: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad'],
      tier2: ['Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam'],
      tier3: [] // All others
    };

    let tier = 'tier3';
    if (cityTiers.tier1.includes(location)) tier = 'tier1';
    else if (cityTiers.tier2.includes(location)) tier = 'tier2';

    const multipliers = {
      tier1: {
        food: 1.15,      // 15% higher food costs
        housing: 1.8,    // 80% higher housing costs
        transport: 1.25, // 25% higher transport
        healthcare: 1.3, // 30% higher healthcare
        education: 1.4,  // 40% higher education
        entertainment: 1.2,
        clothing: 1.1,
        miscellaneous: 1.15
      },
      tier2: {
        food: 1.05,
        housing: 1.3,
        transport: 1.1,
        healthcare: 1.15,
        education: 1.2,
        entertainment: 1.1,
        clothing: 1.05,
        miscellaneous: 1.08
      },
      tier3: {
        food: 0.95,
        housing: 0.7,
        transport: 0.9,
        healthcare: 0.85,
        education: 0.8,
        entertainment: 0.9,
        clothing: 0.95,
        miscellaneous: 0.92
      }
    };

    return multipliers[tier];
  }

  // Apply time-based adjustments (seasonal, trend)
  applyTimeAdjustment(inflation, timeframe) {
    // Seasonal adjustment (higher inflation in certain months)
    const currentMonth = new Date().getMonth();
    const seasonalMultiplier = this.getSeasonalMultiplier(currentMonth);
    
    // Trend adjustment (inflation tends to compound)
    const trendMultiplier = timeframe > 6 ? 1.05 : 1.0;
    
    return inflation * seasonalMultiplier * trendMultiplier;
  }

  // Seasonal inflation patterns in India
  getSeasonalMultiplier(month) {
    const seasonalFactors = {
      0: 1.1,   // Jan - post-holiday price increases
      1: 1.05,  // Feb
      2: 1.0,   // Mar
      3: 1.02,  // Apr
      4: 1.08,  // May - summer demand
      5: 1.12,  // Jun - monsoon prep
      6: 1.15,  // Jul - monsoon impact
      7: 1.1,   // Aug
      8: 1.05,  // Sep
      9: 1.08,  // Oct - festival season
      10: 1.12, // Nov - festival peak
      11: 1.06  // Dec
    };
    
    return seasonalFactors[month] || 1.0;
  }

  // Default inflation for location when no spending data
  getDefaultInflationForLocation(location) {
    const locationMultipliers = this.getLocationMultipliers(location);
    let weightedDefault = 0;

    Object.keys(this.standardWeights).forEach(category => {
      const weight = this.standardWeights[category];
      const rate = this.categoryInflationRates[category];
      const multiplier = locationMultipliers[category] || 1.0;
      weightedDefault += weight * rate * multiplier;
    });

    return Math.round(weightedDefault * 10) / 10;
  }

  // Enhanced comparison with detailed breakdown
  getDetailedInflationComparison(userId, spendingData, location) {
    const personalRate = this.calculatePersonalInflation(spendingData, location);
    const locationAdjustedGovRate = this.getDefaultInflationForLocation(location);
    const nationalGovRate = this.governmentInflation;
    
    const difference = personalRate - locationAdjustedGovRate;
    const nationalDifference = personalRate - nationalGovRate;

    return {
      personal: personalRate,
      locationAdjustedGov: locationAdjustedGovRate,
      nationalGov: nationalGovRate,
      difference: difference,
      nationalDifference: nationalDifference,
      isHigher: difference > 0,
      impactEmoji: this.getImpactEmoji(difference),
      category: this.getInflationCategory(personalRate),
      breakdown: this.getCategoryBreakdown(spendingData, location)
    };
  }

  // Category-wise inflation breakdown
  getCategoryBreakdown(spendingData, location) {
    const personalWeights = this.calculatePersonalWeights(spendingData);
    const locationRates = this.getLocationAdjustedRates(location);
    
    const breakdown = {};
    Object.keys(personalWeights).forEach(category => {
      breakdown[category] = {
        weight: Math.round(personalWeights[category] * 100),
        rate: locationRates[category],
        contribution: Math.round(personalWeights[category] * locationRates[category] * 10) / 10
      };
    });

    return breakdown;
  }

  // Enhanced impact emoji with more granular responses
  getImpactEmoji(difference) {
    if (difference > 8) return '😱';   // Extremely high
    if (difference > 5) return '😰';   // Very high
    if (difference > 3) return '😟';   // High
    if (difference > 1) return '😐';   // Moderate
    if (difference > -1) return '😊';  // Good
    if (difference > -3) return '😄';  // Very good
    return '🤑';                       // Excellent
  }

  // Enhanced category classification
  getInflationCategory(personalRate) {
    if (personalRate > 15) return { category: 'Extremely High', color: '#8B0000', severity: 5 };
    if (personalRate > 12) return { category: 'Very High', color: '#DC143C', severity: 4 };
    if (personalRate > 9) return { category: 'High', color: '#FF6347', severity: 3 };
    if (personalRate > 6) return { category: 'Moderate', color: '#FFA500', severity: 2 };
    if (personalRate > 3) return { category: 'Low', color: '#32CD32', severity: 1 };
    return { category: 'Very Low', color: '#228B22', severity: 0 };
  }

  // Future value calculation with personal inflation
  calculateFutureValue(currentAmount, years, personalInflationRate) {
    return Math.round(currentAmount * Math.pow(1 + (personalInflationRate / 100), years));
  }

  // Required income to maintain purchasing power
  calculateRequiredIncome(currentIncome, years, personalInflationRate) {
    return this.calculateFutureValue(currentIncome, years, personalInflationRate);
  }

  // Investment return needed to beat inflation
  calculateInflationBeatingReturn(personalInflationRate, taxRate = 0.3) {
    // Post-tax return needed to beat inflation
    const requiredPreTaxReturn = personalInflationRate / (1 - taxRate);
    return Math.round(requiredPreTaxReturn * 10) / 10;
  }
}

export default new EnhancedInflationCalculator();
