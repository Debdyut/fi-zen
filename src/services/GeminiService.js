/**
 * Gemini AI Service - Financial Intelligence Layer
 * Provides AI-powered financial insights with fallback to static data
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

class GeminiService {
  constructor() {
    this.genAI = null;
    this.model = null;
    this.isInitialized = false;
    this.fallbackMode = false;
    
    // Rate limiting
    this.requestCount = 0;
    this.lastResetTime = Date.now();
    this.maxRequestsPerMinute = 60;
    
    this.initialize();
  }

  async initialize() {
    try {
      // Initialize Gemini API with your key
      const apiKey = 'AIzaSyCcfFgJzU1wixIFk-dwDee9_--jzvGgD58';
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
      this.isInitialized = true;
      console.log('✅ Gemini Service initialized successfully with API key');
    } catch (error) {
      console.warn('⚠️ Gemini initialization failed, using fallback mode:', error);
      this.fallbackMode = true;
    }
  }

  // Rate limiting check
  checkRateLimit() {
    const now = Date.now();
    if (now - this.lastResetTime > 60000) {
      this.requestCount = 0;
      this.lastResetTime = now;
    }
    
    if (this.requestCount >= this.maxRequestsPerMinute) {
      console.warn('⚠️ Rate limit exceeded, using fallback');
      return false;
    }
    
    this.requestCount++;
    return true;
  }

  // Main AI query method with fallback
  async getFinancialAdvice(query, userContext, fallbackData) {
    try {
      // Check if AI is available and rate limit allows
      if (!this.isInitialized || this.fallbackMode || !this.checkRateLimit()) {
        return this.getFallbackResponse(query, userContext, fallbackData);
      }

      const prompt = this.buildFinancialPrompt(query, userContext);
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const aiResponse = response.text();

      return {
        success: true,
        source: 'ai',
        response: aiResponse,
        confidence: 0.85,
        fallbackUsed: false
      };

    } catch (error) {
      console.warn('⚠️ Gemini API call failed, using fallback:', error);
      return this.getFallbackResponse(query, userContext, fallbackData);
    }
  }

  // Build context-aware prompt
  buildFinancialPrompt(query, userContext) {
    const { profile, financialData, currentScreen } = userContext;
    
    return `
You are a financial advisor for Indian urban professionals. Respond in a helpful, personalized manner.

User Profile:
- Name: ${profile.name}
- Age: ${profile.age}
- Profession: ${profile.profession}
- Location: ${profile.location}
- Monthly Income: ₹${profile.monthlyIncome?.toLocaleString()}
- Risk Profile: ${profile.riskProfile}
- Personal Inflation Rate: ${financialData.personalInflation}%

Financial Context:
- Net Worth: ₹${financialData.netWorth?.toLocaleString()}
- Current Investments: ${JSON.stringify(financialData.investments)}
- Monthly Spending: ₹${financialData.monthlySpending?.toLocaleString()}

User Question: ${query}

Guidelines:
1. Respond in the same language as the question (Hindi/English/Kannada)
2. Use Indian financial context (₹, SIP, EPF, etc.)
3. Be specific with numbers and actionable advice
4. Keep response under 200 words
5. Reference their personal inflation rate when relevant

Response:`;
  }

  // Fallback to static responses
  getFallbackResponse(query, userContext, fallbackData) {
    console.log('📋 Using fallback response for:', query);
    
    // Use existing static recommendation engine
    const staticResponse = this.generateStaticResponse(query, userContext, fallbackData);
    
    return {
      success: true,
      source: 'static',
      response: staticResponse,
      confidence: 0.7,
      fallbackUsed: true
    };
  }

  generateStaticResponse(query, userContext, fallbackData) {
    const { profile, financialData } = userContext;
    const queryLower = query.toLowerCase();

    // Pattern matching for common queries
    if (queryLower.includes('sip') || queryLower.includes('investment')) {
      return `Based on your ₹${profile.monthlyIncome?.toLocaleString()} income and ${financialData.personalInflation}% personal inflation rate, consider increasing your SIP by 15-20% to beat inflation. Your current aggressive risk profile supports equity-heavy investments.`;
    }

    if (queryLower.includes('house') || queryLower.includes('property')) {
      const locationMultiplier = this.getLocationMultiplier(profile.location);
      return `For ${profile.location}, property prices are ${locationMultiplier}x higher than national average. With your ₹${profile.monthlyIncome?.toLocaleString()} income, consider a budget of ₹${(profile.monthlyIncome * 60).toLocaleString()} for home purchase.`;
    }

    if (queryLower.includes('emergency') || queryLower.includes('fund')) {
      const emergencyAmount = profile.monthlyIncome * 6;
      return `Your emergency fund should be ₹${emergencyAmount?.toLocaleString()} (6 months of expenses). Keep this in liquid funds or high-yield savings accounts.`;
    }

    // Default response
    return `Based on your profile as a ${profile.profession} in ${profile.location}, I recommend reviewing your financial goals regularly. Your ${financialData.personalInflation}% personal inflation rate suggests focusing on inflation-beating investments.`;
  }

  getLocationMultiplier(location) {
    const multipliers = {
      'Mumbai': 2.2,
      'Delhi': 1.9,
      'Bangalore': 1.7,
      'Chennai': 1.5,
      'Pune': 1.4,
      'Hyderabad': 1.3
    };
    
    for (const city in multipliers) {
      if (location.includes(city)) {
        return multipliers[city];
      }
    }
    return 1.0; // Default for tier-2 cities
  }

  // Multi-language support
  async getMultiLanguageResponse(query, userContext, language = 'en') {
    const response = await this.getFinancialAdvice(query, userContext);
    
    if (language === 'hi' && response.source === 'ai') {
      // Gemini handles Hindi naturally, no translation needed
      return response;
    }
    
    if (language === 'hi' && response.source === 'static') {
      // Translate static responses to Hindi
      response.response = this.translateToHindi(response.response);
    }
    
    return response;
  }

  translateToHindi(text) {
    // Basic translation for common financial terms
    const translations = {
      'investment': 'निवेश',
      'SIP': 'एसआईपी',
      'emergency fund': 'आपातकालीन फंड',
      'property': 'संपत्ति',
      'income': 'आय',
      'inflation': 'महंगाई'
    };
    
    let translatedText = text;
    for (const [english, hindi] of Object.entries(translations)) {
      translatedText = translatedText.replace(new RegExp(english, 'gi'), hindi);
    }
    
    return translatedText;
  }

  // Health check method
  async healthCheck() {
    try {
      if (!this.isInitialized) return { status: 'not_initialized' };
      
      const testPrompt = "Test connection";
      const result = await this.model.generateContent(testPrompt);
      
      return {
        status: 'healthy',
        initialized: this.isInitialized,
        fallbackMode: this.fallbackMode,
        requestCount: this.requestCount
      };
    } catch (error) {
      return {
        status: 'error',
        error: error.message,
        fallbackMode: true
      };
    }
  }
}

// Singleton instance
const geminiService = new GeminiService();
export default geminiService;
