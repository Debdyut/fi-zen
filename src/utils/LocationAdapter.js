// Location Adapter - Provides location-specific financial insights
class LocationAdapter {
  
  // Cost of living multipliers for major Indian cities
  static getCostOfLivingData() {
    return {
      'Mumbai': { multiplier: 1.4, tier: 'tier1', region: 'west' },
      'Delhi': { multiplier: 1.3, tier: 'tier1', region: 'north' },
      'Bangalore': { multiplier: 1.25, tier: 'tier1', region: 'south' },
      'Hyderabad': { multiplier: 1.1, tier: 'tier1', region: 'south' },
      'Chennai': { multiplier: 1.15, tier: 'tier1', region: 'south' },
      'Pune': { multiplier: 1.2, tier: 'tier1', region: 'west' },
      'Kolkata': { multiplier: 1.0, tier: 'tier1', region: 'east' },
      'Ahmedabad': { multiplier: 0.9, tier: 'tier2', region: 'west' },
      'Jaipur': { multiplier: 0.85, tier: 'tier2', region: 'north' },
      'Lucknow': { multiplier: 0.8, tier: 'tier2', region: 'north' },
      'Kochi': { multiplier: 0.95, tier: 'tier2', region: 'south' },
      'Indore': { multiplier: 0.75, tier: 'tier2', region: 'central' },
      'Surat': { multiplier: 0.85, tier: 'tier2', region: 'west' },
      'Chandigarh': { multiplier: 0.9, tier: 'tier2', region: 'north' },
      'Thiruvananthapuram': { multiplier: 0.9, tier: 'tier2', region: 'south' },
      'Mangalore': { multiplier: 0.85, tier: 'tier2', region: 'south' },
      'Gurgaon': { multiplier: 1.3, tier: 'tier1', region: 'north' }
    };
  }

  // Get location-specific insights
  static getLocationInsights(location, monthlyIncome) {
    const cityData = this.getCityData(location);
    const baseCost = 50000; // Base monthly living cost
    const adjustedCost = baseCost * cityData.multiplier;
    
    return {
      city: cityData.name,
      tier: cityData.tier,
      region: cityData.region,
      costOfLiving: adjustedCost,
      costMultiplier: cityData.multiplier,
      affordabilityRatio: monthlyIncome / adjustedCost,
      recommendations: this.getLocationRecommendations(cityData, monthlyIncome)
    };
  }

  // Parse city from location string
  static getCityData(location) {
    const costData = this.getCostOfLivingData();
    
    // Extract city name from location string
    for (const city in costData) {
      if (location.includes(city)) {
        return {
          name: city,
          ...costData[city]
        };
      }
    }
    
    // Default for unknown cities
    return {
      name: 'Other',
      multiplier: 1.0,
      tier: 'tier2',
      region: 'other'
    };
  }

  // Get location-specific recommendations
  static getLocationRecommendations(cityData, monthlyIncome) {
    const recommendations = [];
    const affordabilityRatio = monthlyIncome / (50000 * cityData.multiplier);

    // High cost cities (Mumbai, Delhi, Bangalore)
    if (cityData.multiplier > 1.2) {
      if (affordabilityRatio < 3) {
        recommendations.push({
          id: 'high_cost_budgeting',
          icon: '🏙️',
          title: 'Metro City Budgeting',
          description: `Living costs in ${cityData.name} are ${Math.round((cityData.multiplier - 1) * 100)}% higher than average`,
          impact: `Save ₹${Math.round(monthlyIncome * 0.1).toLocaleString()}/month with smart budgeting`,
          priority: 'high',
          tips: [
            'Consider shared accommodation to reduce rent',
            'Use public transport over private vehicles',
            'Explore suburban areas for better value'
          ]
        });
      }

      recommendations.push({
        id: 'metro_investment',
        icon: '🏢',
        title: 'Metro Real Estate Strategy',
        description: 'Property investment opportunities in metro cities',
        impact: 'Long-term wealth building through real estate',
        priority: 'medium',
        options: ['REITs for diversified exposure', 'Suburban property investment', 'Commercial real estate funds']
      });
    }

    // Tier 2 cities
    else if (cityData.tier === 'tier2') {
      recommendations.push({
        id: 'tier2_advantage',
        icon: '🌟',
        title: 'Tier-2 City Advantage',
        description: `Lower living costs in ${cityData.name} mean higher savings potential`,
        impact: `Save extra ₹${Math.round((1.3 - cityData.multiplier) * 50000).toLocaleString()}/month vs metros`,
        priority: 'high',
        strategies: [
          'Increase investment allocation due to lower expenses',
          'Consider real estate investment in growing tier-2 cities',
          'Build larger emergency fund with surplus savings'
        ]
      });
    }

    // Regional specific recommendations
    if (cityData.region === 'south') {
      recommendations.push({
        id: 'south_india_benefits',
        icon: '🌴',
        title: 'South India Financial Benefits',
        description: 'Leverage regional advantages for wealth building',
        impact: 'Access to IT sector growth and stable returns',
        priority: 'medium',
        benefits: ['Strong IT sector job market', 'Stable real estate appreciation', 'Good educational infrastructure']
      });
    }

    return recommendations;
  }

  // Get peer comparison context for location
  static getLocationPeerContext(location, profession, monthlyIncome) {
    const cityData = this.getCityData(location);
    
    // Estimate peer income ranges based on city tier and profession
    const baseSalaryMultipliers = {
      tier1: 1.3,
      tier2: 1.0,
      tier3: 0.8
    };

    const professionMultipliers = {
      'Software Engineer': 1.4,
      'Product Manager': 1.6,
      'Data Scientist': 1.5,
      'Doctor': 1.3,
      'Teacher': 0.7,
      'Marketing Manager': 1.2,
      'Business Analyst': 1.3
    };

    const baseIncome = 80000; // Base income for comparison
    const locationMultiplier = baseSalaryMultipliers[cityData.tier] || 1.0;
    const professionMultiplier = professionMultipliers[profession] || 1.0;
    
    const expectedIncome = baseIncome * locationMultiplier * professionMultiplier;
    const incomePercentile = Math.min(95, Math.max(5, (monthlyIncome / expectedIncome) * 50 + 25));

    return {
      peerGroup: `${profession}s in ${cityData.name}`,
      expectedIncomeRange: {
        low: Math.round(expectedIncome * 0.8),
        high: Math.round(expectedIncome * 1.2)
      },
      userPercentile: Math.round(incomePercentile),
      locationAdvantage: cityData.tier === 'tier2' ? 'Lower cost of living advantage' : 'Metro career opportunities'
    };
  }

  // Get location-specific savings targets
  static getLocationSavingsTarget(location, monthlyIncome) {
    const cityData = this.getCityData(location);
    const affordabilityRatio = monthlyIncome / (50000 * cityData.multiplier);
    
    let savingsTarget;
    if (affordabilityRatio > 4) {
      savingsTarget = 30; // High affordability - can save more
    } else if (affordabilityRatio > 2.5) {
      savingsTarget = 25; // Good affordability
    } else if (affordabilityRatio > 1.5) {
      savingsTarget = 20; // Moderate affordability
    } else {
      savingsTarget = 15; // Tight budget in expensive city
    }

    return {
      target: savingsTarget,
      reasoning: this.getSavingsReasoning(cityData, affordabilityRatio),
      adjustedAmount: Math.round(monthlyIncome * savingsTarget / 100)
    };
  }

  static getSavingsReasoning(cityData, affordabilityRatio) {
    if (cityData.multiplier > 1.2 && affordabilityRatio < 2) {
      return `Living in ${cityData.name} is expensive, but even small savings add up`;
    } else if (cityData.tier === 'tier2' && affordabilityRatio > 3) {
      return `Lower costs in ${cityData.name} allow for higher savings rates`;
    } else {
      return `Balanced savings approach suitable for ${cityData.name}`;
    }
  }
}

export default LocationAdapter;
