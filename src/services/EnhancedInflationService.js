import EnhancedInflationCalculator from '../utils/EnhancedInflationCalculator';
import DataTransformationService from './DataTransformationService';
import userLocations from '../data/locations/user_locations.json';

class EnhancedInflationService {
  constructor() {
    this.calculator = EnhancedInflationCalculator;
    this.transformer = DataTransformationService;
  }

  // Main method to get complete inflation analysis for a user
  async getCompleteInflationAnalysis(userId, bankTransactions) {
    try {
      // Get user location
      const location = this.getUserLocation(userId);
      
      // Transform transaction data to spending categories
      const spendingData = this.transformer.generateEnhancedSpendingData(
        userId, 
        bankTransactions, 
        location
      );

      // Calculate enhanced inflation metrics
      const inflationAnalysis = this.calculator.getDetailedInflationComparison(
        userId,
        this.extractSpendingAmounts(spendingData.spendingData),
        location.city
      );

      // Generate insights and recommendations
      const insights = this.generatePersonalizedInsights(spendingData, inflationAnalysis, location);

      return {
        userId,
        location,
        spendingData,
        inflationAnalysis,
        insights,
        lastCalculated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error in inflation analysis:', error);
      return this.getFallbackAnalysis(userId);
    }
  }

  // Extract spending amounts from enhanced spending data
  extractSpendingAmounts(spendingData) {
    const amounts = {};
    Object.entries(spendingData).forEach(([category, data]) => {
      amounts[category] = data.amount;
    });
    return amounts;
  }

  // Get user location from data
  getUserLocation(userId) {
    const locationData = userLocations.userLocations[userId];
    if (!locationData) {
      return { city: 'Mumbai', tier: 'tier1' }; // Default fallback
    }
    return locationData;
  }

  // Generate personalized insights based on analysis
  generatePersonalizedInsights(spendingData, inflationAnalysis, location) {
    const insights = {
      primaryDrivers: [],
      recommendations: [],
      warnings: [],
      opportunities: []
    };

    // Identify primary inflation drivers
    const sortedContributions = Object.entries(inflationAnalysis.breakdown)
      .sort(([,a], [,b]) => b.contribution - a.contribution)
      .slice(0, 3);

    insights.primaryDrivers = sortedContributions.map(([category, data]) => ({
      category,
      contribution: data.contribution,
      weight: data.weight
    }));

    // Generate recommendations based on spending patterns
    if (spendingData.spendingData.food?.percentage > 25) {
      insights.recommendations.push({
        category: 'food',
        message: 'Food spending is high. Consider meal planning and cooking at home more often.',
        impact: 'Could reduce personal inflation by 0.5-1.0%'
      });
    }

    if (location.tier === 'tier1' && spendingData.spendingData.housing?.percentage > 40) {
      insights.recommendations.push({
        category: 'housing',
        message: 'Housing costs are very high for a tier-1 city. Consider relocating to suburbs or tier-2 cities.',
        impact: 'Could reduce personal inflation by 1.5-3.0%'
      });
    }

    if (spendingData.spendingData.debt_payments?.percentage > 30) {
      insights.warnings.push({
        category: 'debt',
        message: 'High debt burden is significantly increasing your personal inflation rate.',
        severity: 'high',
        action: 'Consider debt consolidation or financial counseling'
      });
    }

    // Investment opportunities
    if (spendingData.savingsRate > 0.2) {
      insights.opportunities.push({
        type: 'investment',
        message: 'Good savings rate! Consider inflation-beating investments.',
        suggestion: `You need ${inflationAnalysis.category.severity >= 3 ? 'aggressive' : 'moderate'} investment strategy`
      });
    }

    return insights;
  }

  // Get inflation forecast for user
  async getInflationForecast(userId, months = 6) {
    try {
      const location = this.getUserLocation(userId);
      const baseInflation = this.calculator.getDefaultInflationForLocation(location.city);
      
      const forecast = [];
      const currentDate = new Date();
      
      for (let i = 1; i <= months; i++) {
        const forecastDate = new Date(currentDate);
        forecastDate.setMonth(forecastDate.getMonth() + i);
        
        // Simple trend-based forecast
        const seasonalAdjustment = this.calculator.getSeasonalMultiplier(forecastDate.getMonth());
        const forecastInflation = baseInflation * seasonalAdjustment;
        
        forecast.push({
          month: forecastDate.toISOString().slice(0, 7),
          personalInflation: Math.round(forecastInflation * 10) / 10,
          confidence: Math.max(0.3, 0.9 - (i * 0.1))
        });
      }
      
      return forecast;
    } catch (error) {
      console.error('Error generating forecast:', error);
      return [];
    }
  }

  // Compare inflation across different cities
  getCityInflationComparison(spendingAmounts, cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai']) {
    const comparisons = {};
    
    cities.forEach(city => {
      const inflation = this.calculator.calculatePersonalInflation(spendingAmounts, city);
      comparisons[city] = {
        personalInflation: inflation,
        category: this.calculator.getInflationCategory(inflation),
        difference: inflation - this.calculator.governmentInflation
      };
    });
    
    return comparisons;
  }

  // Get fallback analysis when main calculation fails
  getFallbackAnalysis(userId) {
    const location = this.getUserLocation(userId);
    const fallbackInflation = this.calculator.getDefaultInflationForLocation(location.city);
    
    return {
      userId,
      location,
      inflationAnalysis: {
        personal: fallbackInflation,
        government: this.calculator.governmentInflation,
        category: this.calculator.getInflationCategory(fallbackInflation),
        isEstimated: true
      },
      insights: {
        recommendations: ['Update your spending data for accurate inflation calculation'],
        warnings: ['Using estimated data - results may not reflect your actual situation']
      },
      lastCalculated: new Date().toISOString()
    };
  }

  // Batch process multiple users (for testing/demo)
  async batchProcessUsers(userIds) {
    const results = {};
    
    for (const userId of userIds) {
      try {
        // In real implementation, fetch actual bank transactions
        const mockTransactions = await this.getMockTransactions(userId);
        results[userId] = await this.getCompleteInflationAnalysis(userId, mockTransactions);
      } catch (error) {
        console.error(`Error processing user ${userId}:`, error);
        results[userId] = this.getFallbackAnalysis(userId);
      }
    }
    
    return results;
  }

  // Mock method to simulate fetching transactions (replace with actual data service)
  async getMockTransactions(userId) {
    // This would be replaced with actual data fetching from your backend
    try {
      const transactionData = await import(`../data/${userId}/fetch_bank_transactions.json`);
      return transactionData.bankTransactions || [];
    } catch (error) {
      return []; // Return empty if no data found
    }
  }
}

export default new EnhancedInflationService();
