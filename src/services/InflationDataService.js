class InflationDataService {
  constructor() {
    this.apiEndpoints = {
      rbi: 'https://api.rbi.org.in/inflation',
      mospi: 'https://api.mospi.gov.in/cpi',
      worldBank: 'https://api.worldbank.org/v2/country/IND/indicator/FP.CPI.TOTL.ZG'
    };
  }

  // Fetch real-time government inflation data
  async fetchGovernmentInflationData() {
    try {
      // In production, implement actual API calls
      // For now, return mock data with realistic values
      return {
        overall: 6.5,
        food: 8.7,
        housing: 4.2,
        transport: 6.8,
        healthcare: 5.9,
        education: 4.1,
        entertainment: 7.3,
        clothing: 3.8,
        lastUpdated: new Date().toISOString(),
        source: 'MOSPI CPI Data'
      };
    } catch (error) {
      console.error('Failed to fetch government inflation data:', error);
      return this.getFallbackInflationData();
    }
  }

  // Fetch city-specific inflation data
  async fetchCityInflationData(cityName) {
    try {
      // Mock city-specific data - in production, integrate with real APIs
      const cityMultipliers = {
        'Mumbai': { housing: 1.8, food: 1.15, transport: 1.25 },
        'Delhi': { housing: 1.7, food: 1.12, transport: 1.22 },
        'Bangalore': { housing: 1.6, food: 1.08, transport: 1.18 },
        'Chennai': { housing: 1.4, food: 1.05, transport: 1.15 },
        'Kolkata': { housing: 1.2, food: 1.02, transport: 1.08 },
        'Hyderabad': { housing: 1.3, food: 1.04, transport: 1.12 },
        'Pune': { housing: 1.5, food: 1.06, transport: 1.16 },
        'Ahmedabad': { housing: 1.25, food: 1.03, transport: 1.10 }
      };

      const baseData = await this.fetchGovernmentInflationData();
      const multipliers = cityMultipliers[cityName] || { housing: 1.0, food: 1.0, transport: 1.0 };

      return {
        ...baseData,
        city: cityName,
        housing: baseData.housing * multipliers.housing,
        food: baseData.food * multipliers.food,
        transport: baseData.transport * multipliers.transport,
        overall: this.calculateWeightedInflation(baseData, multipliers)
      };
    } catch (error) {
      console.error(`Failed to fetch city data for ${cityName}:`, error);
      return this.getFallbackInflationData();
    }
  }

  // Calculate weighted inflation based on multipliers
  calculateWeightedInflation(baseData, multipliers) {
    const weights = {
      food: 0.459,
      housing: 0.109,
      transport: 0.086,
      healthcare: 0.059,
      education: 0.047,
      entertainment: 0.067,
      clothing: 0.065,
      miscellaneous: 0.108
    };

    let weightedInflation = 0;
    Object.keys(weights).forEach(category => {
      const rate = baseData[category] || baseData.overall;
      const multiplier = multipliers[category] || 1.0;
      weightedInflation += weights[category] * rate * multiplier;
    });

    return Math.round(weightedInflation * 10) / 10;
  }

  // Fallback data when APIs fail
  getFallbackInflationData() {
    return {
      overall: 6.5,
      food: 8.7,
      housing: 4.2,
      transport: 6.8,
      healthcare: 5.9,
      education: 4.1,
      entertainment: 7.3,
      clothing: 3.8,
      lastUpdated: new Date().toISOString(),
      source: 'Fallback Data',
      isOffline: true
    };
  }

  // Historical inflation data for trends
  async fetchHistoricalInflation(months = 12) {
    try {
      // Mock historical data - in production, fetch from APIs
      const historicalData = [];
      const currentDate = new Date();
      
      for (let i = months - 1; i >= 0; i--) {
        const date = new Date(currentDate);
        date.setMonth(date.getMonth() - i);
        
        // Generate realistic historical data with some variation
        const baseInflation = 6.5;
        const variation = (Math.random() - 0.5) * 2; // ±1% variation
        
        historicalData.push({
          date: date.toISOString().slice(0, 7), // YYYY-MM format
          inflation: Math.round((baseInflation + variation) * 10) / 10,
          food: Math.round((8.7 + variation * 1.5) * 10) / 10,
          housing: Math.round((4.2 + variation * 0.8) * 10) / 10,
          transport: Math.round((6.8 + variation * 1.2) * 10) / 10
        });
      }
      
      return historicalData;
    } catch (error) {
      console.error('Failed to fetch historical data:', error);
      return [];
    }
  }

  // Inflation forecast (basic trend analysis)
  async generateInflationForecast(historicalData, months = 6) {
    try {
      if (!historicalData || historicalData.length < 3) {
        return this.getFallbackForecast(months);
      }

      const recentData = historicalData.slice(-6); // Last 6 months
      const trend = this.calculateTrend(recentData);
      
      const forecast = [];
      const currentDate = new Date();
      let lastInflation = recentData[recentData.length - 1].inflation;

      for (let i = 1; i <= months; i++) {
        const date = new Date(currentDate);
        date.setMonth(date.getMonth() + i);
        
        // Apply trend with some dampening
        lastInflation += trend * 0.7; // Dampen the trend
        
        // Add seasonal adjustment
        const seasonalAdjustment = this.getSeasonalAdjustment(date.getMonth());
        const forecastInflation = lastInflation + seasonalAdjustment;
        
        forecast.push({
          date: date.toISOString().slice(0, 7),
          inflation: Math.round(Math.max(0, forecastInflation) * 10) / 10,
          confidence: Math.max(0.3, 0.9 - (i * 0.1)) // Decreasing confidence
        });
      }

      return forecast;
    } catch (error) {
      console.error('Failed to generate forecast:', error);
      return this.getFallbackForecast(months);
    }
  }

  // Calculate trend from historical data
  calculateTrend(data) {
    if (data.length < 2) return 0;
    
    const changes = [];
    for (let i = 1; i < data.length; i++) {
      changes.push(data[i].inflation - data[i-1].inflation);
    }
    
    return changes.reduce((sum, change) => sum + change, 0) / changes.length;
  }

  // Seasonal adjustment factors
  getSeasonalAdjustment(month) {
    const seasonalFactors = {
      0: 0.3,   // Jan
      1: 0.1,   // Feb
      2: -0.1,  // Mar
      3: 0.0,   // Apr
      4: 0.2,   // May
      5: 0.4,   // Jun
      6: 0.5,   // Jul
      7: 0.3,   // Aug
      8: 0.1,   // Sep
      9: 0.2,   // Oct
      10: 0.4,  // Nov
      11: 0.2   // Dec
    };
    
    return seasonalFactors[month] || 0;
  }

  // Fallback forecast when calculation fails
  getFallbackForecast(months) {
    const forecast = [];
    const currentDate = new Date();
    const baseInflation = 6.5;

    for (let i = 1; i <= months; i++) {
      const date = new Date(currentDate);
      date.setMonth(date.getMonth() + i);
      
      forecast.push({
        date: date.toISOString().slice(0, 7),
        inflation: baseInflation,
        confidence: 0.5
      });
    }

    return forecast;
  }

  // Cache management for offline support
  async getCachedData(key) {
    try {
      // In production, implement proper caching with AsyncStorage
      return null;
    } catch (error) {
      return null;
    }
  }

  async setCachedData(key, data, expiryHours = 24) {
    try {
      // In production, implement proper caching with AsyncStorage
      const cacheData = {
        data,
        timestamp: Date.now(),
        expiry: Date.now() + (expiryHours * 60 * 60 * 1000)
      };
      // Store in AsyncStorage
    } catch (error) {
      console.error('Failed to cache data:', error);
    }
  }
}

export default new InflationDataService();
