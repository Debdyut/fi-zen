# GraphQL Implementation Guide
## Fi-Zen Personal Inflation Calculator

### 🎯 **GraphQL vs REST Benefits**

#### **Single Endpoint Advantage**
- **REST**: 20+ endpoints across 5 API modules
- **GraphQL**: 1 endpoint (`/graphql`) with flexible queries
- **Reduced Complexity**: Frontend teams manage one URL
- **Better Caching**: Single endpoint caching strategy

#### **Query Flexibility**
```graphql
# Get only needed data in one request
query GetUserDashboard($userId: ID!) {
  user(id: $userId) {
    profile {
      name
      location { city }
    }
    preferences { language }
  }
  calculateInflation(input: {
    userId: $userId
    spendingData: { ... }
    location: { ... }
  }) {
    personalInflationRate
    categoryBreakdown {
      category
      inflationRate
    }
  }
}
```

### 🔧 **Implementation Architecture**

#### **Technology Stack**
```javascript
// Backend Stack
- Node.js + Apollo Server
- GraphQL Schema Definition Language
- DataLoader for N+1 query optimization
- Redis for caching and rate limiting
- PostgreSQL for data persistence

// Frontend Integration
- Apollo Client for React Native
- Automatic query caching
- Optimistic updates
- Real-time subscriptions (future)
```

#### **Resolver Structure**
```javascript
// resolvers/index.js
const resolvers = {
  Query: {
    user: userResolvers.getUser,
    calculateInflation: inflationResolvers.calculate,
    salaryNegotiation: professionalResolvers.salaryNegotiation,
    cityComparison: professionalResolvers.cityComparison,
    peerBenchmarking: professionalResolvers.peerBenchmarking
  },
  
  Mutation: {
    updateUserProfile: userResolvers.updateProfile,
    saveSpendingData: dataResolvers.saveSpending,
    connectBankAccount: integrationResolvers.connectBank
  },
  
  // Nested resolvers for complex types
  User: {
    profile: (parent) => userService.getProfile(parent.id),
    preferences: (parent) => userService.getPreferences(parent.id)
  },
  
  InflationResult: {
    categoryBreakdown: (parent) => 
      inflationService.getCategoryBreakdown(parent.calculationId)
  }
};
```

### 📊 **Query Examples**

#### **Basic Inflation Calculation**
```graphql
mutation CalculateInflation($input: InflationCalculationInput!) {
  calculateInflation(input: $input) {
    personalInflationRate
    governmentInflationRate
    difference
    confidence
    categoryBreakdown {
      category
      inflationRate
      contribution
      weight
    }
  }
}

# Variables
{
  "input": {
    "userId": "fi_user_123456",
    "spendingData": {
      "housing": 45000,
      "food": 28000,
      "transport": 15000,
      "healthcare": 8000,
      "education": 12000,
      "entertainment": 10000,
      "others": 7000,
      "period": { "month": 7, "year": 2024 }
    },
    "location": {
      "city": "Mumbai",
      "state": "Maharashtra"
    }
  }
}
```

#### **Professional Tools Query**
```graphql
query ProfessionalAnalysis($userId: ID!, $salary: Float!) {
  salaryNegotiation(input: {
    userId: $userId
    currentSalary: $salary
    personalInflationRate: 11.8
    location: { city: "Mumbai", state: "Maharashtra" }
    industry: "Software Engineering"
    experience: MID_LEVEL
  }) {
    inflationAdjustedSalary
    requiredRaisePercentage
    negotiationScript
    industryBenchmark {
      averageSalary
      percentile
    }
  }
  
  cityComparison(input: {
    userId: $userId
    currentCity: "Mumbai"
    targetCities: ["Bangalore", "Pune", "Chennai"]
    currentSalary: $salary
    industry: "Software Engineering"
    experience: MID_LEVEL
  }) {
    comparisons {
      cityName
      netBenefit
      expectedSalary
      costSavings
    }
  }
}
```

### 🔒 **Security Implementation**

#### **Authentication Middleware**
```javascript
// middleware/auth.js
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    throw new AuthenticationError('Authentication required');
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    throw new AuthenticationError('Invalid token');
  }
};

// Apply to GraphQL context
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({
    user: req.user,
    dataSources: {
      userAPI: new UserAPI(),
      inflationAPI: new InflationAPI(),
      mospiAPI: new MospiAPI()
    }
  })
});
```

#### **Rate Limiting**
```javascript
// Rate limiting by query complexity
const depthLimit = require('graphql-depth-limit');
const costAnalysis = require('graphql-cost-analysis');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  validationRules: [
    depthLimit(10), // Max query depth
    costAnalysis({
      maximumCost: 1000,
      defaultCost: 1,
      scalarCost: 1,
      objectCost: 2,
      listFactor: 10
    })
  ]
});
```

### 📈 **Performance Optimization**

#### **DataLoader for N+1 Prevention**
```javascript
// dataloaders/userLoader.js
const DataLoader = require('dataloader');

const userLoader = new DataLoader(async (userIds) => {
  const users = await User.findByIds(userIds);
  return userIds.map(id => users.find(user => user.id === id));
});

// Usage in resolver
const resolvers = {
  InflationResult: {
    user: (parent, args, { dataSources }) => 
      dataSources.userLoader.load(parent.userId)
  }
};
```

#### **Query Caching Strategy**
```javascript
// Redis caching for expensive operations
const cacheResolver = (resolver, ttl = 300) => {
  return async (parent, args, context, info) => {
    const cacheKey = `${info.fieldName}:${JSON.stringify(args)}`;
    
    const cached = await redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
    
    const result = await resolver(parent, args, context, info);
    await redis.setex(cacheKey, ttl, JSON.stringify(result));
    
    return result;
  };
};

// Apply to expensive resolvers
const resolvers = {
  Query: {
    calculateInflation: cacheResolver(inflationResolvers.calculate, 600),
    governmentInflationRates: cacheResolver(mospiResolvers.getRates, 3600)
  }
};
```

### 🚀 **Deployment Benefits**

#### **Reduced Infrastructure**
- **REST**: 5 separate services, load balancers, API gateways
- **GraphQL**: Single service, simplified deployment
- **Cost Savings**: ~40% reduction in infrastructure costs
- **Maintenance**: Single codebase, unified monitoring

#### **Frontend Integration**
```javascript
// React Native Apollo Client setup
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: 'https://api.fi.money/graphql'
});

const authLink = setContext((_, { headers }) => {
  const token = getAuthToken();
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});
```

### 📊 **Migration Strategy**

#### **Phase 1: Parallel Implementation**
- Build GraphQL alongside existing REST APIs
- Gradual frontend migration
- A/B testing between implementations

#### **Phase 2: Feature Parity**
- All REST functionality available in GraphQL
- Performance benchmarking
- Security audit completion

#### **Phase 3: Full Migration**
- Frontend completely on GraphQL
- REST API deprecation timeline
- Infrastructure consolidation

---

**GraphQL implementation reduces API complexity from 20+ endpoints to 1, improving developer experience and reducing infrastructure costs by ~40%.**
