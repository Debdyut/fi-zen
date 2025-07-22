// Machine Learning Recommendation Engine - AI-powered personalized recommendations
class MLRecommendationEngine {
  
  // User behavior tracking for ML
  static trackUserBehavior(userId, action, context) {
    const behaviorData = this.getUserBehaviorData(userId);
    
    const newBehavior = {
      timestamp: new Date().toISOString(),
      action,
      context,
      sessionId: this.getCurrentSessionId()
    };
    
    behaviorData.push(newBehavior);
    this.saveUserBehaviorData(userId, behaviorData);
    
    // Trigger recommendation update if significant behavior
    if (this.isSignificantBehavior(action)) {
      this.updateUserRecommendations(userId);
    }
  }

  // Generate AI-powered recommendations based on user behavior
  static generateAIRecommendations(userProfile, behaviorHistory, currentRecommendations) {
    const behaviorInsights = this.analyzeBehaviorPatterns(behaviorHistory);
    const userSegment = this.identifyUserSegment(userProfile, behaviorInsights);
    const similarUsers = this.findSimilarUsers(userProfile, userSegment);
    
    return {
      personalizedRecommendations: this.generatePersonalizedRecs(userProfile, behaviorInsights),
      collaborativeRecommendations: this.generateCollaborativeRecs(similarUsers),
      adaptiveRecommendations: this.generateAdaptiveRecs(behaviorInsights, currentRecommendations),
      confidenceScores: this.calculateConfidenceScores(behaviorInsights),
      learningInsights: this.generateLearningInsights(behaviorInsights)
    };
  }

  // Analyze user behavior patterns
  static analyzeBehaviorPatterns(behaviorHistory) {
    const patterns = {
      engagementLevel: this.calculateEngagementLevel(behaviorHistory),
      preferredFeatures: this.identifyPreferredFeatures(behaviorHistory),
      actionTiming: this.analyzeActionTiming(behaviorHistory),
      completionRates: this.calculateCompletionRates(behaviorHistory),
      riskTolerance: this.inferRiskTolerance(behaviorHistory),
      goalOrientation: this.identifyGoalOrientation(behaviorHistory)
    };
    
    return patterns;
  }

  // Calculate user engagement level
  static calculateEngagementLevel(behaviorHistory) {
    const recentBehavior = behaviorHistory.filter(b => 
      new Date(b.timestamp) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
    );
    
    const engagementScore = recentBehavior.length;
    const avgSessionTime = this.calculateAverageSessionTime(recentBehavior);
    const featureUsage = this.calculateFeatureUsage(recentBehavior);
    
    let level = 'low';
    if (engagementScore > 20 && avgSessionTime > 300) level = 'high';
    else if (engagementScore > 10 && avgSessionTime > 120) level = 'medium';
    
    return {
      level,
      score: engagementScore,
      avgSessionTime,
      featureUsage,
      trend: this.calculateEngagementTrend(behaviorHistory)
    };
  }

  // Identify preferred features
  static identifyPreferredFeatures(behaviorHistory) {
    const featureUsage = {};
    
    behaviorHistory.forEach(behavior => {
      const feature = behavior.context?.feature || 'unknown';
      featureUsage[feature] = (featureUsage[feature] || 0) + 1;
    });
    
    // Sort by usage frequency
    const sortedFeatures = Object.entries(featureUsage)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);
    
    return {
      topFeatures: sortedFeatures.map(([feature, count]) => ({ feature, count })),
      preferences: this.inferFeaturePreferences(sortedFeatures),
      recommendations: this.generateFeatureRecommendations(sortedFeatures)
    };
  }

  // Generate personalized recommendations based on behavior
  static generatePersonalizedRecs(userProfile, behaviorInsights) {
    const recommendations = [];
    
    // High engagement users - advanced features
    if (behaviorInsights.engagementLevel.level === 'high') {
      recommendations.push({
        id: 'advanced_analytics',
        type: 'feature',
        title: 'Advanced Portfolio Analytics',
        description: 'Deep dive into your investment performance',
        confidence: 0.85,
        reasoning: 'High engagement suggests readiness for advanced features'
      });
    }
    
    // Calculator-focused users
    if (behaviorInsights.preferredFeatures.topFeatures.some(f => f.feature.includes('calculator'))) {
      recommendations.push({
        id: 'goal_tracking',
        type: 'feature',
        title: 'Automated Goal Tracking',
        description: 'Track progress toward your calculated goals',
        confidence: 0.78,
        reasoning: 'Frequent calculator usage indicates goal-oriented behavior'
      });
    }
    
    // Risk-averse behavior detected
    if (behaviorInsights.riskTolerance === 'conservative') {
      recommendations.push({
        id: 'safe_investments',
        type: 'investment',
        title: 'Conservative Investment Options',
        description: 'Low-risk investments matching your behavior',
        confidence: 0.72,
        reasoning: 'Behavior patterns suggest conservative risk preference'
      });
    }
    
    return recommendations;
  }

  // Generate collaborative filtering recommendations
  static generateCollaborativeRecs(similarUsers) {
    const recommendations = [];
    
    // Analyze what similar users are doing
    const commonActions = this.findCommonActions(similarUsers);
    const successfulStrategies = this.identifySuccessfulStrategies(similarUsers);
    
    commonActions.forEach(action => {
      if (action.successRate > 0.7) {
        recommendations.push({
          id: `collaborative_${action.type}`,
          type: 'behavioral',
          title: action.title,
          description: action.description,
          confidence: action.successRate,
          reasoning: `${Math.round(action.successRate * 100)}% of similar users found this helpful`
        });
      }
    });
    
    return recommendations;
  }

  // Generate adaptive recommendations that evolve
  static generateAdaptiveRecs(behaviorInsights, currentRecommendations) {
    const adaptiveRecs = [];
    
    // Adapt based on completion rates
    currentRecommendations.forEach(rec => {
      const completionRate = this.getRecommendationCompletionRate(rec.id, behaviorInsights);
      
      if (completionRate < 0.3) {
        // Low completion - simplify or break down
        adaptiveRecs.push({
          ...rec,
          id: `simplified_${rec.id}`,
          title: `Simplified: ${rec.title}`,
          description: this.simplifyRecommendation(rec.description),
          confidence: rec.confidence * 0.8,
          reasoning: 'Simplified based on low completion rates'
        });
      } else if (completionRate > 0.8) {
        // High completion - suggest advanced version
        adaptiveRecs.push({
          ...rec,
          id: `advanced_${rec.id}`,
          title: `Advanced: ${rec.title}`,
          description: this.enhanceRecommendation(rec.description),
          confidence: rec.confidence * 1.1,
          reasoning: 'Enhanced based on high completion rates'
        });
      }
    });
    
    return adaptiveRecs;
  }

  // Identify user segment for better targeting
  static identifyUserSegment(userProfile, behaviorInsights) {
    const segments = {
      'power_user': {
        criteria: {
          engagementLevel: 'high',
          featureUsage: 'diverse',
          completionRate: 0.8
        }
      },
      'goal_oriented': {
        criteria: {
          calculatorUsage: 'high',
          goalSetting: 'active',
          planningFocus: 'high'
        }
      },
      'conservative_saver': {
        criteria: {
          riskTolerance: 'low',
          savingsRate: 'high',
          investmentActivity: 'low'
        }
      },
      'learning_beginner': {
        criteria: {
          engagementLevel: 'medium',
          helpUsage: 'high',
          basicFeatureFocus: 'high'
        }
      }
    };
    
    // Score each segment
    const segmentScores = {};
    Object.entries(segments).forEach(([segment, config]) => {
      segmentScores[segment] = this.calculateSegmentScore(userProfile, behaviorInsights, config.criteria);
    });
    
    // Return best matching segment
    const bestSegment = Object.entries(segmentScores)
      .sort(([,a], [,b]) => b - a)[0];
    
    return {
      primary: bestSegment[0],
      score: bestSegment[1],
      allScores: segmentScores
    };
  }

  // Helper functions
  static calculateAverageSessionTime(behaviors) {
    // Simplified calculation - in real implementation would track session start/end
    return behaviors.length * 45; // Assume 45 seconds per action
  }

  static calculateFeatureUsage(behaviors) {
    const features = {};
    behaviors.forEach(b => {
      const feature = b.context?.feature || 'unknown';
      features[feature] = (features[feature] || 0) + 1;
    });
    return features;
  }

  static calculateEngagementTrend(behaviorHistory) {
    const recent = behaviorHistory.slice(-14); // Last 14 actions
    const older = behaviorHistory.slice(-28, -14); // Previous 14 actions
    
    if (recent.length > older.length) return 'increasing';
    if (recent.length < older.length) return 'decreasing';
    return 'stable';
  }

  static inferRiskTolerance(behaviorHistory) {
    const riskIndicators = behaviorHistory.filter(b => 
      b.context?.riskLevel || b.action.includes('conservative') || b.action.includes('aggressive')
    );
    
    const conservativeActions = riskIndicators.filter(b => 
      b.action.includes('conservative') || b.context?.riskLevel === 'low'
    ).length;
    
    const aggressiveActions = riskIndicators.filter(b => 
      b.action.includes('aggressive') || b.context?.riskLevel === 'high'
    ).length;
    
    if (conservativeActions > aggressiveActions * 2) return 'conservative';
    if (aggressiveActions > conservativeActions * 2) return 'aggressive';
    return 'moderate';
  }

  static identifyGoalOrientation(behaviorHistory) {
    const goalActions = behaviorHistory.filter(b => 
      b.action.includes('goal') || b.action.includes('target') || b.context?.feature?.includes('calculator')
    );
    
    return goalActions.length > behaviorHistory.length * 0.3 ? 'high' : 'low';
  }

  // Infer user preferences from feature usage patterns
  static inferFeaturePreferences(sortedFeatures) {
    const preferences = {};
    
    sortedFeatures.forEach(([feature, count], index) => {
      const preference = {
        strength: count > 10 ? 'high' : count > 5 ? 'medium' : 'low',
        rank: index + 1,
        usage: count
      };
      preferences[feature] = preference;
    });
    
    return preferences;
  }

  // Generate feature recommendations based on usage patterns
  static generateFeatureRecommendations(sortedFeatures) {
    const recommendations = [];
    
    sortedFeatures.forEach(([feature, count]) => {
      if (feature.includes('calculator') && count > 5) {
        recommendations.push('goal_tracking');
      }
      if (feature.includes('insights') && count > 3) {
        recommendations.push('advanced_analytics');
      }
    });
    
    return recommendations;
  }

  // Data persistence helpers (simplified for demo)
  static getUserBehaviorData(userId) {
    // In real implementation, this would fetch from database
    return JSON.parse(localStorage.getItem(`behavior_${userId}`) || '[]');
  }

  static saveUserBehaviorData(userId, data) {
    // In real implementation, this would save to database
    localStorage.setItem(`behavior_${userId}`, JSON.stringify(data.slice(-100))); // Keep last 100 actions
  }

  static getCurrentSessionId() {
    return Date.now().toString();
  }

  static isSignificantBehavior(action) {
    const significantActions = ['calculator_completed', 'recommendation_implemented', 'goal_set', 'investment_made'];
    return significantActions.some(sa => action.includes(sa));
  }

  static updateUserRecommendations(userId) {
    // Trigger recommendation recalculation
    console.log(`Updating recommendations for user ${userId} based on behavior`);
  }

  // Additional helper methods for collaborative filtering
  static findSimilarUsers(userProfile, userSegment) {
    // Simplified - in real implementation would query user database
    return [];
  }

  static findCommonActions(similarUsers) {
    // Simplified - would analyze similar user behaviors
    return [];
  }

  static identifySuccessfulStrategies(similarUsers) {
    // Simplified - would identify high-success patterns
    return [];
  }

  static calculateCompletionRates(behaviorHistory) {
    // Calculate how often users complete started actions
    const startedActions = behaviorHistory.filter(b => b.action.includes('started'));
    const completedActions = behaviorHistory.filter(b => b.action.includes('completed'));
    
    return startedActions.length > 0 ? completedActions.length / startedActions.length : 0;
  }

  static analyzeActionTiming(behaviorHistory) {
    // Analyze when users are most active
    const timingData = {};
    behaviorHistory.forEach(b => {
      const hour = new Date(b.timestamp).getHours();
      timingData[hour] = (timingData[hour] || 0) + 1;
    });
    
    return timingData;
  }

  static calculateConfidenceScores(behaviorInsights) {
    // Calculate confidence in recommendations based on data quality
    const dataPoints = behaviorInsights.engagementLevel.score;
    return {
      overall: Math.min(0.9, dataPoints / 50),
      personalized: Math.min(0.85, dataPoints / 30),
      collaborative: 0.6, // Lower without real similar users
      adaptive: Math.min(0.8, dataPoints / 40)
    };
  }

  static generateLearningInsights(behaviorInsights) {
    const insights = [];
    
    if (behaviorInsights.engagementLevel.level === 'high') {
      insights.push('You\'re a highly engaged user who explores many features');
    }
    
    if (behaviorInsights.riskTolerance === 'conservative') {
      insights.push('Your behavior suggests a preference for low-risk options');
    }
    
    return insights.join('. ');
  }

  static getRecommendationCompletionRate(recId, behaviorInsights) {
    // Simplified - would track specific recommendation completion
    return Math.random() * 0.8 + 0.1; // Random for demo
  }

  static simplifyRecommendation(description) {
    return `Start with: ${description.split('.')[0]}`;
  }

  static enhanceRecommendation(description) {
    return `${description} Consider advanced options for better results.`;
  }

  static calculateSegmentScore(userProfile, behaviorInsights, criteria) {
    // Simplified scoring - would be more sophisticated in real implementation
    let score = 0;
    
    if (criteria.engagementLevel && behaviorInsights.engagementLevel.level === criteria.engagementLevel) {
      score += 0.3;
    }
    
    if (criteria.riskTolerance && behaviorInsights.riskTolerance === criteria.riskTolerance) {
      score += 0.3;
    }
    
    return score;
  }
}

export default MLRecommendationEngine;
