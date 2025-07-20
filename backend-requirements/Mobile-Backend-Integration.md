# Mobile-Backend Integration Requirements
## Fi-Zen React Native App - Backend Data Requirements

### 📱 **Mobile App Data Needs**

#### **Phase 1: Personal Inflation Calculator** ✅
```javascript
// What the mobile app needs from backend
const mobileDataRequirements = {
  // User authentication
  userAuth: {
    fiUserToken: "JWT token from Fi SSO",
    userProfile: "Basic profile data",
    permissions: "App-specific permissions"
  },
  
  // Core inflation calculation
  inflationData: {
    personalRate: 11.8,
    governmentRate: 6.5,
    difference: 5.3,
    confidence: 85,
    categoryBreakdown: [
      { category: "housing", rate: 8.5, contribution: 2.4 },
      { category: "food", rate: 12.3, contribution: 4.1 }
    ]
  },
  
  // Professional tools data
  professionalData: {
    salaryNegotiation: { requiredRaise: 11.8, negotiationScript: "..." },
    cityComparison: [{ city: "Bangalore", netBenefit: 12.3 }],
    peerBenchmarking: { userPercentile: 75, insights: [...] }
  }
};
```

#### **Phase 2: Conversational AI** 🚀
```javascript
// What mobile app needs for AI chat
const conversationalRequirements = {
  // Chat interface data
  chatResponse: {
    text: "Aapka personal inflation 11.8% hai...",
    audioUrl: "https://api.fi.money/audio/response.mp3", // Optional
    language: "hindi",
    followUpQuestions: ["Kya aap SIP badhana chahte hain?"],
    suggestedActions: [
      { action: "increase_sip", description: "SIP 25% badhayein" }
    ]
  },
  
  // Voice integration
  voiceSupport: {
    speechToText: "Convert user voice to text",
    textToSpeech: "Convert AI response to audio",
    supportedLanguages: ["hindi", "english", "kannada"]
  },
  
  // Conversation history
  chatHistory: [
    { query: "Retirement planning", response: "...", timestamp: "..." }
  ]
};
```

#### **Phase 3: Predictive Analytics** 📊
```javascript
// What mobile app needs for predictions
const predictiveRequirements = {
  // Proactive alerts
  alerts: [
    {
      type: "cash_flow_stress",
      priority: "high",
      title: "Festival Season Alert",
      message: "Cash flow stress predicted in 45 days",
      recommendations: [
        { action: "Prepay EMI", impact: "Frees up ₹25,000" }
      ]
    }
  ],
  
  // Behavioral insights
  patterns: [
    {
      pattern: "WFH Impact",
      description: "Transport costs down 40%, food delivery up 60%",
      recommendation: "Optimize home office costs"
    }
  ],
  
  // Scenario modeling results
  scenarios: {
    homePurchase: {
      feasibility: 78,
      impact: "Retirement corpus reduces to ₹2.5 crores",
      recommendations: ["Increase SIP by ₹15,000"]
    }
  }
};
```

#### **Phase 4: Advanced Fi Integration** 💳
```javascript
// What mobile app needs for Fi product optimization
const fiIntegrationRequirements = {
  // Smart recommendations
  optimizations: [
    {
      type: "fi_auto_sweep",
      title: "Enable Fi Auto-Sweep",
      description: "Earn 2% extra on idle ₹25K",
      monthlyBenefit: 500,
      implementationSteps: ["Open Fi app", "Enable auto-sweep"]
    }
  ],
  
  // Payment intelligence
  paymentRecommendations: {
    merchant: "Swiggy",
    preferredMethod: "fi_card",
    reason: "Maximize cashback rewards",
    cashbackAmount: 21.25,
    annualSavings: 3060
  },
  
  // Product matching
  productRecommendations: [
    {
      productId: "fi_federal_savings",
      matchScore: 94,
      benefits: ["7% interest", "No minimum balance"],
      monthlyBenefit: 2500
    }
  ]
};
```

### 🔗 **GraphQL Queries Mobile App Will Use**

#### **Single Dashboard Query**
```graphql
query GetUserDashboard($userId: ID!) {
  user(id: $userId) {
    profile { name, location { city } }
    
    # Phase 1: Core data
    calculateInflation(input: { ... }) {
      personalInflationRate
      governmentInflationRate
      categoryBreakdown { category, inflationRate }
    }
    
    # Phase 2: AI features
    conversationHistory(limit: 3) {
      id, topics, lastActivity
    }
    
    # Phase 3: Predictions
    proactiveAlerts(alertType: CASH_FLOW_STRESS) {
      title, message, priority, recommendations { action, impact }
    }
    
    # Phase 4: Fi optimization
    optimizationRecommendations(type: CASH_OPTIMIZATION) {
      title, description, impact { monthlyBenefit }
    }
  }
}
```

#### **Chat Interface Query**
```graphql
mutation ProcessUserQuery($input: NaturalQueryInput!) {
  processNaturalQuery(input: $input) {
    response {
      text
      audioUrl
      suggestedActions { action, description }
    }
    followUpQuestions
    confidence
  }
}
```

### 📊 **Data Flow Requirements**

#### **Real-time Data Needs**
```javascript
// What needs to be real-time vs cached
const dataFreshness = {
  realTime: [
    "proactive_alerts",      // Immediate notifications
    "chat_responses",        // AI conversations
    "payment_recommendations" // Transaction-based suggestions
  ],
  
  cached: [
    "inflation_calculations", // Cache for 1 hour
    "peer_benchmarking",     // Cache for 24 hours
    "government_rates",      // Cache for 24 hours
    "city_comparisons"       // Cache for 7 days
  ],
  
  offline: [
    "user_profile",          // Store locally
    "conversation_history",  // Store locally
    "calculation_history"    // Store locally
  ]
};
```

### 🔐 **Authentication & Security**

#### **What Mobile App Handles**
```javascript
const mobileSecurityRequirements = {
  authentication: {
    method: "Fi SSO integration",
    tokenStorage: "Secure keychain/keystore",
    tokenRefresh: "Automatic background refresh"
  },
  
  dataProtection: {
    sensitiveData: "Encrypt locally stored data",
    biometrics: "TouchID/FaceID for app access",
    sessionManagement: "Auto-logout after inactivity"
  }
};
```

### 📱 **Mobile App Responsibilities**

#### **What Mobile App Will Handle**
- **UI/UX**: All user interface and interactions
- **Local Storage**: Cache frequently used data
- **Offline Mode**: Basic functionality when offline
- **Push Notifications**: Display alerts and recommendations
- **Biometric Auth**: Secure app access
- **Voice Recording**: Capture user voice for AI queries
- **Audio Playback**: Play AI response audio

#### **What Backend Will Provide**
- **All Business Logic**: Calculations, predictions, recommendations
- **AI Processing**: Gemini 2.5 Pro integration
- **Data Integration**: Fi MCP server connectivity
- **Real-time Alerts**: Proactive notifications
- **Analytics**: User behavior and performance metrics

### 🎯 **Success Metrics Mobile App Needs**

```javascript
const analyticsRequirements = {
  userEngagement: {
    sessionTime: "Track time spent in app",
    featureUsage: "Which features used most",
    conversionTracking: "Fi product adoption rates"
  },
  
  aiPerformance: {
    chatSatisfaction: "User ratings for AI responses",
    voiceAccuracy: "Speech recognition success rate",
    responseTime: "AI query processing time"
  },
  
  businessMetrics: {
    inflationAccuracy: "User feedback on calculations",
    recommendationSuccess: "Actions taken on suggestions",
    crossSellConversion: "Fi product sign-ups from app"
  }
};
```

### ✅ **Mobile-Backend Contract**

#### **API Response Format**
```javascript
// Standardized response format
const apiResponse = {
  success: true,
  data: { /* actual data */ },
  metadata: {
    timestamp: "2024-07-20T10:00:00Z",
    version: "2.0",
    cached: false,
    processingTime: 1.2
  },
  error: null // Only present if success: false
};
```

#### **Error Handling**
```javascript
const errorHandling = {
  networkErrors: "Mobile app handles offline gracefully",
  authErrors: "Redirect to Fi login",
  dataErrors: "Show user-friendly error messages",
  aiErrors: "Fallback to basic responses"
};
```

---

**This document defines exactly what the mobile app needs from the backend, focusing on data requirements and integration points rather than technical implementation details.**
