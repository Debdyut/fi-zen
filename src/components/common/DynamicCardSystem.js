import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import SmartNetWorthCard from '../cards/SmartNetWorthCard';
import SmartGoalsCard from '../cards/SmartGoalsCard';
import PersonalizedCard from '../cards/PersonalizedCard';
import GoalsOverviewCard from '../cards/GoalsOverviewCard';
import IndividualGoalsCard from '../cards/IndividualGoalsCard';
import MilestonesCard from '../cards/MilestonesCard';
import PrimaryMetricCard from '../cards/PrimaryMetricCard';
import MetricBreakdownCard from '../cards/MetricBreakdownCard';
import CategoryBreakdownCard from '../cards/CategoryBreakdownCard';
import TrendAnalysisCard from '../cards/TrendAnalysisCard';
import BudgetAlertCard from '../cards/BudgetAlertCard';

const { width: screenWidth } = Dimensions.get('window');

// Card Context for managing dynamic card state
const CardContext = createContext();

export const CardProvider = ({ children, screenType, user }) => {
  const [cardState, setCardState] = useState({
    screenType,
    user,
    visibleCards: [],
    aiInsights: {},
    cardPriorities: {}
  });

  const updateCardState = (updates) => {
    setCardState(prev => ({ ...prev, ...updates }));
  };

  return (
    <CardContext.Provider value={{ cardState, updateCardState }}>
      {children}
    </CardContext.Provider>
  );
};

export const useCardContext = () => {
  const context = useContext(CardContext);
  if (!context) {
    throw new Error('useCardContext must be used within CardProvider');
  }
  return context;
};

// Dynamic Card Configuration
const getCardConfiguration = (screenType, user) => {
  const baseConfig = {
    home: {
      netWorth: {
        priority: 1,
        size: 'medium',
        aiInsights: true,
        condition: (user) => user.netWorth?.netWorth > 100000
      },
      goals: {
        priority: 1,
        size: 'medium',
        aiInsights: false,
        condition: (user) => true
      },
      spending: {
        priority: 3,
        size: 'medium',
        aiInsights: true,
        condition: (user) => user.monthlySpending
      },
      recommendations: {
        priority: 4,
        size: 'medium',
        aiInsights: true,
        condition: () => true
      }
    },
    
    insights: {
      smartInsights: {
        priority: 1,
        size: 'large',
        aiInsights: true,
        condition: () => true
      },
      riskAssessment: {
        priority: 2,
        size: 'medium',
        aiInsights: true,
        condition: (user) => user.financialHealth
      },
      opportunity: {
        priority: 3,
        size: 'medium',
        aiInsights: true,
        condition: () => true
      }
    },
    
    goals: {
      goalsOverview: {
        priority: 1,
        size: 'large',
        aiInsights: false,
        condition: (user) => user.goals?.length > 0
      },
      goalProgress: {
        priority: 2,
        size: 'large',
        aiInsights: true,
        condition: (user) => user.goals?.length > 0
      },
      individualGoals: {
        priority: 3,
        size: 'dynamic',
        aiInsights: false,
        condition: (user) => user.goals?.length > 0
      },
      milestones: {
        priority: 4,
        size: 'medium',
        aiInsights: false,
        condition: (user) => user.goals?.some(g => g.milestones?.length > 0)
      },
      strategy: {
        priority: 5,
        size: 'medium',
        aiInsights: true,
        condition: () => true
      },
      motivation: {
        priority: 6,
        size: 'small',
        aiInsights: true,
        condition: (user) => user.goals?.some(g => g.progress > 0)
      },
      nextSteps: {
        priority: 7,
        size: 'small',
        aiInsights: true,
        condition: () => true
      }
    },
    
    breakdown: {
      categoryBreakdown: {
        priority: 1,
        size: 'large',
        aiInsights: true,
        condition: (user) => user.monthlySpending
      },
      trendAnalysis: {
        priority: 2,
        size: 'medium',
        aiInsights: true,
        condition: (user) => user.spendingTrends
      },
      optimization: {
        priority: 3,
        size: 'medium',
        aiInsights: true,
        condition: () => true
      },
      budgetAlert: {
        priority: 4,
        size: 'small',
        aiInsights: false,
        condition: (user) => user.budgetAlerts?.length > 0 || true
      },
      savingsOpportunity: {
        priority: 5,
        size: 'small',
        aiInsights: true,
        condition: () => true
      }
    },
    
    metricDetail: {
      primaryMetric: {
        priority: 1,
        size: 'large',
        aiInsights: false,
        condition: () => true
      },
      comparison: {
        priority: 2,
        size: 'medium',
        aiInsights: true,
        condition: (user) => user.peerComparison
      },
      historical: {
        priority: 3,
        size: 'medium',
        aiInsights: false,
        condition: () => true
      },
      prediction: {
        priority: 4,
        size: 'medium',
        aiInsights: true,
        condition: () => true
      },
      actionItems: {
        priority: 5,
        size: 'medium',
        aiInsights: true,
        condition: () => true
      },
      breakdown: {
        priority: 6,
        size: 'large',
        aiInsights: false,
        condition: (user) => user.currentMetric?.breakdown
      }
    }
  };

  return baseConfig[screenType] || {};
};

// Dynamic Card Grid Component
export const DynamicCardGrid = ({ screenType, user, onChatRequest, children }) => {
  const { cardState, updateCardState } = useCardContext();
  
  const cardConfig = useMemo(() => {
    const config = getCardConfiguration(screenType, user);
    
    const visibleCards = Object.entries(config)
      .filter(([cardType, cardConfig]) => cardConfig.condition(user))
      .sort(([, a], [, b]) => a.priority - b.priority)
      .reduce((acc, [cardType, cardConfig]) => {
        acc[cardType] = cardConfig;
        return acc;
      }, {});
    
    return visibleCards;
  }, [screenType, user]);

  const renderCard = (cardType, config) => {
    const cardStyle = {
      width: '100%',
      marginBottom: 16
    };

    return (
      <View key={cardType} style={cardStyle}>
        <DynamicCard
          type={cardType}
          config={config}
          user={user}
          screenType={screenType}
          onChatRequest={onChatRequest}
        />
      </View>
    );
  };

  return (
    <View style={styles.gridContainer}>
      {Object.entries(cardConfig).map(([cardType, config]) =>
        renderCard(cardType, config)
      )}
      {children}
    </View>
  );
};

// Individual Dynamic Card Component
const DynamicCard = ({ type, config, user, screenType, onChatRequest }) => {
  switch (type) {
    case 'netWorth':
      return <SmartNetWorthCard user={user} size={config.size} onChatRequest={onChatRequest} />;
    case 'goals':
      return <SmartGoalsCard user={user} size={config.size} onChatRequest={onChatRequest} />;
    
    // Specialized goal cards
    case 'goalsOverview':
      return <GoalsOverviewCard user={user} size={config.size} />;
    case 'individualGoals':
      return <IndividualGoalsCard user={user} onChatRequest={onChatRequest} size={config.size} />;
    case 'milestones':
      return <MilestonesCard user={user} onChatRequest={onChatRequest} size={config.size} />;
    
    // Specialized metric detail cards
    case 'primaryMetric':
      return <PrimaryMetricCard user={user} size={config.size} />;
    case 'breakdown':
      return <MetricBreakdownCard user={user} size={config.size} />;
    
    // Specialized breakdown cards
    case 'categoryBreakdown':
      return <CategoryBreakdownCard user={user} onChatRequest={onChatRequest} size={config.size} />;
    case 'trendAnalysis':
      return <TrendAnalysisCard user={user} onChatRequest={onChatRequest} size={config.size} />;
    case 'budgetAlert':
      return <BudgetAlertCard user={user} onChatRequest={onChatRequest} size={config.size} />;
    
    default:
      return (
        <PersonalizedCard
          cardType={type}
          user={user}
          screenType={screenType}
          size={config.size}
          onChatRequest={onChatRequest}
          config={config}
        />
      );
  }
};

const styles = StyleSheet.create({
  gridContainer: {
    flex: 1,
    padding: 16,
  },
});

export default DynamicCardGrid;
