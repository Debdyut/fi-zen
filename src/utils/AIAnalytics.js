/**
 * AI Analytics & Monitoring
 * Tracks AI usage, performance, and fallback scenarios
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

class AIAnalytics {
  constructor() {
    this.sessionId = this.generateSessionId();
    this.metrics = {
      aiRequests: 0,
      fallbackRequests: 0,
      averageResponseTime: 0,
      errorRate: 0,
      userSatisfaction: 0
    };
  }

  generateSessionId() {
    return `ai_session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Track AI request
  async trackAIRequest(query, response, responseTime, userId) {
    const event = {
      type: 'ai_request',
      sessionId: this.sessionId,
      userId,
      query: this.sanitizeQuery(query),
      source: response.source,
      success: response.success,
      fallbackUsed: response.fallbackUsed,
      confidence: response.confidence,
      responseTime,
      timestamp: new Date().toISOString()
    };

    await this.logEvent(event);
    this.updateMetrics(event);
  }

  // Track user interaction
  async trackUserInteraction(action, screen, userId, metadata = {}) {
    const event = {
      type: 'user_interaction',
      sessionId: this.sessionId,
      userId,
      action,
      screen,
      metadata,
      timestamp: new Date().toISOString()
    };

    await this.logEvent(event);
  }

  // Track errors
  async trackError(error, context, userId) {
    const event = {
      type: 'error',
      sessionId: this.sessionId,
      userId,
      error: error.message,
      context,
      timestamp: new Date().toISOString()
    };

    await this.logEvent(event);
  }

  // Track user satisfaction
  async trackSatisfaction(rating, feedback, userId) {
    const event = {
      type: 'satisfaction',
      sessionId: this.sessionId,
      userId,
      rating, // 1-5 scale
      feedback,
      timestamp: new Date().toISOString()
    };

    await this.logEvent(event);
  }

  // Log event to storage
  async logEvent(event) {
    try {
      const key = `ai_analytics_${Date.now()}`;
      await AsyncStorage.setItem(key, JSON.stringify(event));
      
      // Also log to console in development
      if (__DEV__) {
        console.log('📊 AI Analytics:', event);
      }
    } catch (error) {
      console.warn('Failed to log analytics event:', error);
    }
  }

  // Update real-time metrics
  updateMetrics(event) {
    if (event.type === 'ai_request') {
      this.metrics.aiRequests++;
      
      if (event.fallbackUsed) {
        this.metrics.fallbackRequests++;
      }
      
      // Update average response time
      this.metrics.averageResponseTime = 
        (this.metrics.averageResponseTime + event.responseTime) / 2;
      
      // Update error rate
      if (!event.success) {
        this.metrics.errorRate = 
          (this.metrics.errorRate + 1) / this.metrics.aiRequests;
      }
    }
  }

  // Get current metrics
  getMetrics() {
    return {
      ...this.metrics,
      fallbackRate: this.metrics.fallbackRequests / this.metrics.aiRequests,
      sessionId: this.sessionId
    };
  }

  // Get analytics data for reporting
  async getAnalyticsData(days = 7) {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const analyticsKeys = keys.filter(key => key.startsWith('ai_analytics_'));
      
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      
      const events = [];
      for (const key of analyticsKeys) {
        const eventData = await AsyncStorage.getItem(key);
        const event = JSON.parse(eventData);
        
        if (new Date(event.timestamp) > cutoffDate) {
          events.push(event);
        }
      }
      
      return this.processAnalyticsData(events);
    } catch (error) {
      console.error('Failed to get analytics data:', error);
      return null;
    }
  }

  // Process analytics data into insights
  processAnalyticsData(events) {
    const aiRequests = events.filter(e => e.type === 'ai_request');
    const errors = events.filter(e => e.type === 'error');
    const satisfaction = events.filter(e => e.type === 'satisfaction');
    
    return {
      summary: {
        totalRequests: aiRequests.length,
        fallbackRequests: aiRequests.filter(e => e.fallbackUsed).length,
        averageResponseTime: this.calculateAverage(aiRequests, 'responseTime'),
        errorRate: errors.length / aiRequests.length,
        averageSatisfaction: this.calculateAverage(satisfaction, 'rating')
      },
      trends: {
        requestsPerDay: this.groupByDay(aiRequests),
        fallbackTrend: this.groupByDay(aiRequests.filter(e => e.fallbackUsed)),
        errorTrend: this.groupByDay(errors)
      },
      topQueries: this.getTopQueries(aiRequests),
      userEngagement: this.calculateUserEngagement(events)
    };
  }

  calculateAverage(array, field) {
    if (array.length === 0) return 0;
    return array.reduce((sum, item) => sum + (item[field] || 0), 0) / array.length;
  }

  groupByDay(events) {
    const grouped = {};
    events.forEach(event => {
      const date = new Date(event.timestamp).toDateString();
      grouped[date] = (grouped[date] || 0) + 1;
    });
    return grouped;
  }

  getTopQueries(aiRequests) {
    const queryCount = {};
    aiRequests.forEach(request => {
      const query = request.query.toLowerCase();
      queryCount[query] = (queryCount[query] || 0) + 1;
    });
    
    return Object.entries(queryCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([query, count]) => ({ query, count }));
  }

  calculateUserEngagement(events) {
    const users = {};
    events.forEach(event => {
      if (!users[event.userId]) {
        users[event.userId] = {
          requests: 0,
          interactions: 0,
          satisfaction: []
        };
      }
      
      if (event.type === 'ai_request') {
        users[event.userId].requests++;
      } else if (event.type === 'user_interaction') {
        users[event.userId].interactions++;
      } else if (event.type === 'satisfaction') {
        users[event.userId].satisfaction.push(event.rating);
      }
    });
    
    return {
      totalUsers: Object.keys(users).length,
      averageRequestsPerUser: this.calculateAverage(Object.values(users), 'requests'),
      averageInteractionsPerUser: this.calculateAverage(Object.values(users), 'interactions')
    };
  }

  // Sanitize query for privacy
  sanitizeQuery(query) {
    // Remove potential PII
    return query
      .replace(/\d{10,}/g, '[PHONE]') // Phone numbers
      .replace(/\d{4}\s?\d{4}\s?\d{4}\s?\d{4}/g, '[CARD]') // Card numbers
      .replace(/[A-Z]{5}\d{4}[A-Z]/g, '[PAN]') // PAN numbers
      .substring(0, 200); // Limit length
  }

  // Clear old analytics data
  async clearOldData(days = 30) {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const analyticsKeys = keys.filter(key => key.startsWith('ai_analytics_'));
      
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      
      for (const key of analyticsKeys) {
        const eventData = await AsyncStorage.getItem(key);
        const event = JSON.parse(eventData);
        
        if (new Date(event.timestamp) < cutoffDate) {
          await AsyncStorage.removeItem(key);
        }
      }
      
      console.log(`Cleared analytics data older than ${days} days`);
    } catch (error) {
      console.error('Failed to clear old analytics data:', error);
    }
  }
}

// Export singleton
const aiAnalytics = new AIAnalytics();
export default aiAnalytics;
