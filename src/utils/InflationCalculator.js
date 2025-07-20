class InflationCalculator {
  constructor() {
    this.governmentInflation = 6.5; // Government baseline
  }

  // Calculate personal inflation based on user spending patterns
  calculatePersonalInflation(userId, userSpendingData = null) {
    if (userSpendingData) {
      return this.calculateFromSpendingData(userSpendingData);
    }
    
    // Fallback to mock data
    const inflationRates = {
      '1010101010': 11.2, '1111111111': 8.7, '1212121212': 9.4,
      '1313131313': 12.1, '1414141414': 7.8, '2020202020': 10.3,
      '2121212121': 6.9, '2222222222': 13.5, '2525252525': 8.1,
      '3333333333': 9.8, '4444444444': 7.2, '5555555555': 14.2,
      '6666666666': 8.9, '7777777777': 10.7, '8888888888': 7.5,
      '9999999999': 11.8
    };
    return inflationRates[userId] || 9.5;
  }

  // Calculate inflation from actual spending data
  calculateFromSpendingData(spendingData) {
    const { food, transport, housing, entertainment } = spendingData;
    const totalSpending = food + transport + housing + entertainment;
    
    // Inflation calculation based on category weights
    const foodInflation = (food / totalSpending) * 12.5; // Food inflation higher
    const transportInflation = (transport / totalSpending) * 8.2;
    const housingInflation = (housing / totalSpending) * 6.8;
    const entertainmentInflation = (entertainment / totalSpending) * 9.1;
    
    const personalInflation = foodInflation + transportInflation + housingInflation + entertainmentInflation;
    return Math.round(personalInflation * 10) / 10;
  }

  // Get inflation comparison data
  getInflationComparison(userId, userSpendingData = null) {
    const personalRate = this.calculatePersonalInflation(userId, userSpendingData);
    const difference = personalRate - this.governmentInflation;
    
    return {
      personal: personalRate,
      government: this.governmentInflation,
      difference: difference,
      isHigher: difference > 0,
      impactEmoji: this.getImpactEmoji(difference)
    };
  }

  // Get contextual emoji based on inflation impact
  getImpactEmoji(difference) {
    if (difference > 5) return '😰';
    if (difference > 2) return '🥲';
    if (difference > 0) return '😐';
    if (difference > -2) return '😊';
    return '🤑';
  }

  // Get inflation category description
  getInflationCategory(personalRate) {
    if (personalRate > 12) return { category: 'High', color: '#dc3545' };
    if (personalRate > 9) return { category: 'Moderate', color: '#ffc107' };
    if (personalRate > 6) return { category: 'Low', color: '#28a745' };
    return { category: 'Very Low', color: '#17a2b8' };
  }
}

export default new InflationCalculator();