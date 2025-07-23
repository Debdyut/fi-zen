// Location-based Cost Adjustment Engine
// Addresses regional cost variations for goal planning

class LocationCostEngine {
  
  // City cost multipliers based on real estate and living costs
  static getCityMultipliers() {
    return {
      // Tier 1 Metro Cities (High Cost)
      'mumbai': { property: 2.2, living: 1.8, general: 1.6 },
      'delhi': { property: 1.9, living: 1.6, general: 1.4 },
      'bangalore': { property: 1.7, living: 1.5, general: 1.3 },
      'gurgaon': { property: 1.8, living: 1.5, general: 1.4 },
      'noida': { property: 1.6, living: 1.4, general: 1.3 },
      
      // Tier 1.5 Cities (Medium-High Cost)
      'pune': { property: 1.4, living: 1.3, general: 1.2 },
      'hyderabad': { property: 1.3, living: 1.2, general: 1.1 },
      'chennai': { property: 1.3, living: 1.2, general: 1.1 },
      'kolkata': { property: 1.2, living: 1.1, general: 1.0 },
      'ahmedabad': { property: 1.1, living: 1.0, general: 0.9 },
      
      // Tier 2 Cities (Medium Cost)
      'kochi': { property: 1.0, living: 0.9, general: 0.8 },
      'jaipur': { property: 0.9, living: 0.8, general: 0.7 },
      'chandigarh': { property: 1.1, living: 1.0, general: 0.9 },
      'lucknow': { property: 0.8, living: 0.7, general: 0.6 },
      'indore': { property: 0.7, living: 0.6, general: 0.6 },
      'surat': { property: 0.8, living: 0.7, general: 0.7 },
      'thiruvananthapuram': { property: 0.9, living: 0.8, general: 0.7 },
      'mangalore': { property: 0.8, living: 0.7, general: 0.7 },
      
      // Default for unlisted cities
      'default': { property: 1.0, living: 0.9, general: 0.8 }
    };
  }
  
  // Extract city from location string
  static extractCity(location) {
    if (!location) return 'default';
    
    const locationLower = location.toLowerCase();
    const multipliers = this.getCityMultipliers();
    
    // Find matching city
    for (const city in multipliers) {
      if (locationLower.includes(city)) {
        return city;
      }
    }
    
    return 'default';
  }
  
  // Get cost multipliers for a location
  static getLocationMultipliers(location) {
    const city = this.extractCity(location);
    const multipliers = this.getCityMultipliers();
    return multipliers[city] || multipliers['default'];
  }
  
  // Adjust goal amounts based on location
  static adjustGoalForLocation(goal, location) {
    const multipliers = this.getLocationMultipliers(location);
    const adjustedGoal = { ...goal };
    
    // Apply different multipliers based on goal type
    switch (goal.goalId) {
      case 'house_down_payment':
        // Property goals get property multiplier
        adjustedGoal.targetAmount = Math.round(goal.targetAmount * multipliers.property);
        adjustedGoal.monthlyContribution = Math.round(goal.monthlyContribution * multipliers.property);
        adjustedGoal.description = `${goal.description} (Adjusted for ${location} property prices)`;
        break;
        
      case 'emergency_fund':
        // Emergency fund gets living cost multiplier
        adjustedGoal.targetAmount = Math.round(goal.targetAmount * multipliers.living);
        adjustedGoal.monthlyContribution = Math.round(goal.monthlyContribution * multipliers.living);
        adjustedGoal.description = `${goal.description} (Adjusted for ${location} living costs)`;
        break;
        
      default:
        // Other goals get general multiplier
        if (goal.category === 'Professional' || goal.category === 'Lifestyle') {
          adjustedGoal.targetAmount = Math.round(goal.targetAmount * multipliers.general);
          adjustedGoal.monthlyContribution = Math.round(goal.monthlyContribution * multipliers.general);
          adjustedGoal.description = `${goal.description} (Adjusted for ${location} costs)`;
        }
        break;
    }
    
    return adjustedGoal;
  }
  
  // Adjust all goals for location
  static adjustGoalsForLocation(goals, location) {
    return goals.map(goal => this.adjustGoalForLocation(goal, location));
  }
  
  // Get location insights for user
  static getLocationInsights(location, income) {
    const city = this.extractCity(location);
    const multipliers = this.getLocationMultipliers(location);
    
    let insights = {
      city: city,
      tier: this.getCityTier(city),
      costLevel: this.getCostLevel(multipliers),
      recommendations: [],
      adjustments: {
        property: multipliers.property,
        living: multipliers.living,
        general: multipliers.general
      }
    };
    
    // Generate location-specific recommendations
    if (multipliers.property > 1.5) {
      insights.recommendations.push({
        type: 'property',
        message: `${location} has high property costs. Consider nearby areas or increase your down payment timeline.`,
        action: 'Explore suburbs or extend timeline by 6-12 months'
      });
    }
    
    if (multipliers.living > 1.3) {
      insights.recommendations.push({
        type: 'emergency',
        message: `Higher living costs in ${location} require a larger emergency fund.`,
        action: 'Increase emergency fund target by 20-30%'
      });
    }
    
    if (income < 100000 && multipliers.general > 1.2) {
      insights.recommendations.push({
        type: 'income',
        message: `Consider skill development to increase income in ${location}'s competitive market.`,
        action: 'Focus on professional development goals'
      });
    }
    
    return insights;
  }
  
  // Helper: Get city tier
  static getCityTier(city) {
    const tier1 = ['mumbai', 'delhi', 'bangalore', 'gurgaon', 'noida'];
    const tier1_5 = ['pune', 'hyderabad', 'chennai', 'kolkata', 'ahmedabad'];
    
    if (tier1.includes(city)) return 'Tier 1';
    if (tier1_5.includes(city)) return 'Tier 1.5';
    return 'Tier 2';
  }
  
  // Helper: Get cost level description
  static getCostLevel(multipliers) {
    const avgMultiplier = (multipliers.property + multipliers.living + multipliers.general) / 3;
    
    if (avgMultiplier > 1.5) return 'High Cost';
    if (avgMultiplier > 1.2) return 'Medium-High Cost';
    if (avgMultiplier > 0.9) return 'Medium Cost';
    return 'Low Cost';
  }
}

export default LocationCostEngine;

// CommonJS export for testing
module.exports = LocationCostEngine;
