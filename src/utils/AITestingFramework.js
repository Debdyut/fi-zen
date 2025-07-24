/**
 * AI Testing Framework
 * Tests AI integration with fallback scenarios
 */

import GeminiService from '../services/GeminiService';
import EnhancedDataServiceWithAI from '../services/EnhancedDataServiceWithAI';

class AITestingFramework {
  constructor() {
    this.testResults = [];
    this.testUserId = '1010101010'; // Arjun Sharma for testing
  }

  async runAllTests() {
    console.log('🧪 Starting AI Integration Tests...');
    
    const tests = [
      this.testGeminiConnection,
      this.testFallbackMechanism,
      this.testMultiLanguageSupport,
      this.testFinancialContextUnderstanding,
      this.testGoalRecommendations,
      this.testRateLimiting,
      this.testErrorHandling
    ];

    for (const test of tests) {
      try {
        await test.call(this);
      } catch (error) {
        this.logTestResult(test.name, false, error.message);
      }
    }

    this.generateTestReport();
    return this.testResults;
  }

  async testGeminiConnection() {
    const testName = 'Gemini API Connection';
    try {
      const health = await GeminiService.healthCheck();
      const success = health.status === 'healthy';
      this.logTestResult(testName, success, success ? 'Connected' : 'Failed to connect');
    } catch (error) {
      this.logTestResult(testName, false, error.message);
    }
  }

  async testFallbackMechanism() {
    const testName = 'Fallback Mechanism';
    try {
      // Force fallback mode
      const originalMode = GeminiService.fallbackMode;
      GeminiService.fallbackMode = true;

      const response = await GeminiService.getFinancialAdvice(
        "Should I increase my SIP?",
        { profile: { monthlyIncome: 125000 }, financialData: { personalInflation: 11.8 } },
        {}
      );

      const success = response.success && response.source === 'static';
      this.logTestResult(testName, success, success ? 'Fallback working' : 'Fallback failed');

      // Restore original mode
      GeminiService.fallbackMode = originalMode;
    } catch (error) {
      this.logTestResult(testName, false, error.message);
    }
  }

  async testMultiLanguageSupport() {
    const testName = 'Multi-language Support';
    try {
      const hindiQuery = "मुझे कितना emergency fund चाहिए?";
      const response = await GeminiService.getMultiLanguageResponse(
        hindiQuery,
        { profile: { monthlyIncome: 125000 }, financialData: {} },
        'hi'
      );

      const success = response.success && response.response.length > 0;
      this.logTestResult(testName, success, success ? 'Hindi support working' : 'Hindi support failed');
    } catch (error) {
      this.logTestResult(testName, false, error.message);
    }
  }

  async testFinancialContextUnderstanding() {
    const testName = 'Financial Context Understanding';
    try {
      const userContext = {
        profile: {
          name: 'Arjun',
          monthlyIncome: 125000,
          profession: 'Software Engineer',
          location: 'Mumbai'
        },
        financialData: {
          personalInflation: 11.8,
          netWorth: 2659155,
          monthlySpending: 121250
        }
      };

      const response = await GeminiService.getFinancialAdvice(
        "Should I buy a house in Mumbai?",
        userContext,
        {}
      );

      const success = response.success && 
                     response.response.includes('Mumbai') && 
                     response.response.length > 50;
      
      this.logTestResult(testName, success, success ? 'Context understood' : 'Context not understood');
    } catch (error) {
      this.logTestResult(testName, false, error.message);
    }
  }

  async testGoalRecommendations() {
    const testName = 'Goal Recommendations';
    try {
      const recommendations = await EnhancedDataServiceWithAI.getAIGoalRecommendations(this.testUserId);
      const success = recommendations.success && recommendations.response.length > 0;
      
      this.logTestResult(testName, success, success ? 'Recommendations generated' : 'No recommendations');
    } catch (error) {
      this.logTestResult(testName, false, error.message);
    }
  }

  async testRateLimiting() {
    const testName = 'Rate Limiting';
    try {
      // Make multiple rapid requests
      const promises = Array(5).fill().map(() => 
        GeminiService.getFinancialAdvice("Test query", {}, {})
      );

      const results = await Promise.all(promises);
      const success = results.every(r => r.success);
      
      this.logTestResult(testName, success, success ? 'Rate limiting handled' : 'Rate limiting failed');
    } catch (error) {
      this.logTestResult(testName, false, error.message);
    }
  }

  async testErrorHandling() {
    const testName = 'Error Handling';
    try {
      // Test with invalid input
      const response = await GeminiService.getFinancialAdvice(
        "", // Empty query
        null, // Invalid context
        {}
      );

      const success = response.success && response.fallbackUsed;
      this.logTestResult(testName, success, success ? 'Errors handled gracefully' : 'Error handling failed');
    } catch (error) {
      this.logTestResult(testName, false, error.message);
    }
  }

  logTestResult(testName, success, message) {
    const result = {
      test: testName,
      success,
      message,
      timestamp: new Date().toISOString()
    };
    
    this.testResults.push(result);
    console.log(`${success ? '✅' : '❌'} ${testName}: ${message}`);
  }

  generateTestReport() {
    const totalTests = this.testResults.length;
    const passedTests = this.testResults.filter(r => r.success).length;
    const failedTests = totalTests - passedTests;
    const successRate = Math.round((passedTests / totalTests) * 100);

    const report = {
      summary: {
        total: totalTests,
        passed: passedTests,
        failed: failedTests,
        successRate: `${successRate}%`
      },
      details: this.testResults,
      timestamp: new Date().toISOString()
    };

    console.log('\n📊 AI Integration Test Report:');
    console.log(`Total Tests: ${totalTests}`);
    console.log(`Passed: ${passedTests}`);
    console.log(`Failed: ${failedTests}`);
    console.log(`Success Rate: ${successRate}%`);

    return report;
  }

  // Performance testing
  async testPerformance() {
    console.log('⚡ Running Performance Tests...');
    
    const startTime = Date.now();
    
    await GeminiService.getFinancialAdvice(
      "What should be my investment strategy?",
      {
        profile: { monthlyIncome: 125000 },
        financialData: { personalInflation: 11.8 }
      },
      {}
    );
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    console.log(`Response Time: ${responseTime}ms`);
    
    return {
      responseTime,
      acceptable: responseTime < 5000 // 5 second threshold
    };
  }
}

// Export singleton
const aiTestingFramework = new AITestingFramework();
export default aiTestingFramework;
