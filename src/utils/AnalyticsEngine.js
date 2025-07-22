// Analytics Engine - Advanced financial analysis and predictive insights
class AnalyticsEngine {
  
  // Analyze spending trends over time
  static analyzeSpendingTrends(userProfile, spendingData) {
    const monthlySpending = spendingData?.monthlySpending || this.generateSpendingPattern(userProfile);
    
    return {
      trend: this.calculateTrend(monthlySpending),
      volatility: this.calculateVolatility(monthlySpending),
      seasonality: this.detectSeasonality(monthlySpending),
      categories: this.analyzeCategoryTrends(monthlySpending),
      predictions: this.predictNextMonth(monthlySpending)
    };
  }

  // Generate realistic spending pattern based on user profile
  static generateSpendingPattern(userProfile) {
    const income = userProfile.monthlyIncome;
    const baseSpending = income * 0.7; // 70% of income as base spending
    
    // Generate 6 months of data with realistic variations
    const months = [];
    for (let i = 0; i < 6; i++) {
      const seasonalFactor = this.getSeasonalFactor(i);
      const randomVariation = 0.9 + Math.random() * 0.2; // ±10% variation
      
      months.push({
        month: i,
        total: Math.round(baseSpending * seasonalFactor * randomVariation),
        categories: this.generateCategoryBreakdown(baseSpending * seasonalFactor * randomVariation)
      });
    }
    
    return months;
  }

  // Calculate spending trend (increasing/decreasing)
  static calculateTrend(monthlyData) {
    if (monthlyData.length < 3) return { direction: 'stable', rate: 0 };
    
    const recent = monthlyData.slice(-3).map(m => m.total);
    const older = monthlyData.slice(0, 3).map(m => m.total);
    
    const recentAvg = recent.reduce((a, b) => a + b) / recent.length;
    const olderAvg = older.reduce((a, b) => a + b) / older.length;
    
    const changeRate = ((recentAvg - olderAvg) / olderAvg) * 100;
    
    return {
      direction: changeRate > 5 ? 'increasing' : changeRate < -5 ? 'decreasing' : 'stable',
      rate: Math.abs(changeRate),
      insight: this.getTrendInsight(changeRate)
    };
  }

  // Calculate spending volatility
  static calculateVolatility(monthlyData) {
    const amounts = monthlyData.map(m => m.total);
    const avg = amounts.reduce((a, b) => a + b) / amounts.length;
    const variance = amounts.reduce((sum, amount) => sum + Math.pow(amount - avg, 2), 0) / amounts.length;
    const stdDev = Math.sqrt(variance);
    const volatility = (stdDev / avg) * 100;
    
    return {
      level: volatility > 15 ? 'high' : volatility > 8 ? 'moderate' : 'low',
      percentage: Math.round(volatility),
      insight: this.getVolatilityInsight(volatility)
    };
  }

  // Detect seasonal spending patterns
  static detectSeasonality(monthlyData) {
    // Simple seasonality detection based on month patterns
    const seasonalSpikes = [];
    
    monthlyData.forEach((month, index) => {
      const avgOthers = monthlyData
        .filter((_, i) => i !== index)
        .reduce((sum, m) => sum + m.total, 0) / (monthlyData.length - 1);
      
      if (month.total > avgOthers * 1.2) {
        seasonalSpikes.push({
          month: index,
          increase: Math.round(((month.total - avgOthers) / avgOthers) * 100)
        });
      }
    });
    
    return {
      hasSeasonality: seasonalSpikes.length > 0,
      spikes: seasonalSpikes,
      insight: this.getSeasonalityInsight(seasonalSpikes)
    };
  }

  // Analyze category-wise trends
  static analyzeCategoryTrends(monthlyData) {
    const categories = ['housing', 'food', 'transport', 'entertainment', 'shopping'];
    const trends = {};
    
    categories.forEach(category => {
      const categoryData = monthlyData.map(m => m.categories[category] || 0);
      const trend = this.calculateSimpleTrend(categoryData);
      
      trends[category] = {
        trend: trend.direction,
        change: trend.rate,
        current: categoryData[categoryData.length - 1],
        insight: this.getCategoryTrendInsight(category, trend)
      };
    });
    
    return trends;
  }

  // Predict next month's spending
  static predictNextMonth(monthlyData) {
    const recent = monthlyData.slice(-3);
    const avgRecent = recent.reduce((sum, m) => sum + m.total, 0) / recent.length;
    const trend = this.calculateTrend(monthlyData);
    
    let prediction = avgRecent;
    if (trend.direction === 'increasing') {
      prediction *= (1 + trend.rate / 100);
    } else if (trend.direction === 'decreasing') {
      prediction *= (1 - trend.rate / 100);
    }
    
    return {
      amount: Math.round(prediction),
      confidence: this.calculatePredictionConfidence(monthlyData),
      factors: this.getPredictionFactors(trend, monthlyData)
    };
  }

  // Generate category breakdown
  static generateCategoryBreakdown(totalSpending) {
    return {
      housing: Math.round(totalSpending * 0.35),
      food: Math.round(totalSpending * 0.25),
      transport: Math.round(totalSpending * 0.15),
      entertainment: Math.round(totalSpending * 0.10),
      shopping: Math.round(totalSpending * 0.10),
      miscellaneous: Math.round(totalSpending * 0.05)
    };
  }

  // Helper functions
  static getSeasonalFactor(monthIndex) {
    // Simulate seasonal variations (festivals, bonuses, etc.)
    const factors = [1.0, 0.9, 1.1, 1.0, 0.95, 1.2]; // Last month higher (bonus/festival)
    return factors[monthIndex] || 1.0;
  }

  static calculateSimpleTrend(data) {
    if (data.length < 2) return { direction: 'stable', rate: 0 };
    
    const first = data[0];
    const last = data[data.length - 1];
    const changeRate = ((last - first) / first) * 100;
    
    return {
      direction: changeRate > 5 ? 'increasing' : changeRate < -5 ? 'decreasing' : 'stable',
      rate: Math.abs(changeRate)
    };
  }

  static getTrendInsight(changeRate) {
    if (changeRate > 10) return 'Spending is increasing significantly';
    if (changeRate > 5) return 'Spending is gradually increasing';
    if (changeRate < -10) return 'Spending is decreasing significantly';
    if (changeRate < -5) return 'Spending is gradually decreasing';
    return 'Spending is relatively stable';
  }

  static getVolatilityInsight(volatility) {
    if (volatility > 15) return 'Your spending varies significantly month to month';
    if (volatility > 8) return 'Your spending has moderate variations';
    return 'Your spending is quite consistent';
  }

  static getSeasonalityInsight(spikes) {
    if (spikes.length === 0) return 'No significant seasonal patterns detected';
    if (spikes.length === 1) return 'One month shows higher spending - likely seasonal';
    return 'Multiple seasonal spending spikes detected';
  }

  static getCategoryTrendInsight(category, trend) {
    const categoryNames = {
      housing: 'Housing',
      food: 'Food',
      transport: 'Transport',
      entertainment: 'Entertainment',
      shopping: 'Shopping'
    };
    
    const name = categoryNames[category] || category;
    
    if (trend.direction === 'increasing') {
      return `${name} expenses are increasing by ${trend.rate.toFixed(1)}%`;
    } else if (trend.direction === 'decreasing') {
      return `${name} expenses are decreasing by ${trend.rate.toFixed(1)}%`;
    }
    return `${name} expenses are stable`;
  }

  static calculatePredictionConfidence(monthlyData) {
    const volatility = this.calculateVolatility(monthlyData);
    
    if (volatility.level === 'low') return 'high';
    if (volatility.level === 'moderate') return 'medium';
    return 'low';
  }

  static getPredictionFactors(trend, monthlyData) {
    const factors = [];
    
    if (trend.direction !== 'stable') {
      factors.push(`${trend.direction} spending trend`);
    }
    
    const seasonality = this.detectSeasonality(monthlyData);
    if (seasonality.hasSeasonality) {
      factors.push('seasonal variations');
    }
    
    if (factors.length === 0) {
      factors.push('historical spending patterns');
    }
    
    return factors;
  }

  // Advanced analytics for goal tracking
  static analyzeGoalProgress(userProfile, currentSavings, goals) {
    if (!goals || goals.length === 0) return null;
    
    const analysis = goals.map(goal => {
      const monthsToGoal = goal.targetDate ? 
        Math.max(1, Math.ceil((new Date(goal.targetDate) - new Date()) / (1000 * 60 * 60 * 24 * 30))) : 
        goal.timeframe || 12;
      
      const requiredMonthlySavings = (goal.amount - (goal.currentAmount || 0)) / monthsToGoal;
      const currentMonthlySavings = (userProfile.monthlyIncome * (currentSavings?.savingsRate || 15)) / 100;
      
      return {
        goalName: goal.name,
        progress: ((goal.currentAmount || 0) / goal.amount) * 100,
        onTrack: currentMonthlySavings >= requiredMonthlySavings,
        requiredMonthlySavings: Math.round(requiredMonthlySavings),
        shortfall: Math.max(0, requiredMonthlySavings - currentMonthlySavings),
        timeToCompletion: currentMonthlySavings > 0 ? 
          Math.ceil((goal.amount - (goal.currentAmount || 0)) / currentMonthlySavings) : null
      };
    });
    
    return analysis;
  }
}

export default AnalyticsEngine;
