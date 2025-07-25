import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import PersonalizedCardService from '../../services/PersonalizedCardService';

const PersonalizedCard = ({ 
  cardType, 
  user, 
  screenType, 
  size = 'medium', 
  onChatRequest,
  config 
}) => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadPersonalizedContent();
  }, [cardType, user.userId, screenType]);

  const loadPersonalizedContent = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(false);
      const personalizedContent = await PersonalizedCardService.getPersonalizedCardContent(
        cardType, 
        user, 
        screenType,
        isRefresh
      );
      setContent(personalizedContent);
    } catch (err) {
      console.error('Error loading personalized content:', err);
      setError(true);
      setContent(PersonalizedCardService.getFallbackContent(cardType, user));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleChatPress = () => {
    const contextMessage = buildChatContext();
    onChatRequest?.(contextMessage);
  };

  const buildChatContext = () => {
    const contexts = {
      spending: `I'm a ${user.profile?.profession} earning ₹${user.profile?.monthlyIncome || user.monthlyIncome}. Help me optimize my spending: ${JSON.stringify(user.monthlySpending)}`,
      recommendations: `What Fi products are best for a ${user.profile?.profession} earning ₹${user.profile?.monthlyIncome || user.monthlyIncome} in ${user.location}?`,
      categoryBreakdown: `Analyze my spending categories and suggest optimizations: ${JSON.stringify(user.monthlySpending)}`,
      optimization: `Give me specific ways to optimize my monthly spending of ₹${Object.values(user.monthlySpending || {}).reduce((a, b) => a + b, 0)}`,
      savingsOpportunity: `Help me identify the easiest savings opportunities in my monthly spending of ₹${Object.values(user.monthlySpending || {}).reduce((a, b) => a + b, 0)}`,
      smartInsights: `Provide financial insights for a ${user.profile?.profession} with ₹${user.profile?.monthlyIncome || user.monthlyIncome} income`,
      goalProgress: `Help me improve my financial goal progress: ${JSON.stringify(user.goals)}`,
      riskAssessment: `Assess my financial risks and suggest protection strategies`,
      opportunity: `What growth opportunities should I focus on as a ${user.profile?.profession}?`
    };
    
    return contexts[cardType] || `Help me with ${cardType} for my financial profile`;
  };

  const renderCardContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color="#00D4AA" />
          <Text style={styles.loadingText}>Loading insights...</Text>
        </View>
      );
    }

    if (error && !content) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Unable to load insights</Text>
          <TouchableOpacity onPress={loadPersonalizedContent} style={styles.retryButton}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    switch (cardType) {
      case 'spending':
        return <SpendingCardContent content={content} onChatRequest={handleChatPress} onRefresh={() => loadPersonalizedContent(true)} refreshing={refreshing} />;
      case 'recommendations':
        return <RecommendationsCardContent content={content} onChatRequest={handleChatPress} onRefresh={() => loadPersonalizedContent(true)} refreshing={refreshing} />;
      case 'categoryBreakdown':
        return <CategoryBreakdownCardContent content={content} onChatRequest={handleChatPress} onRefresh={() => loadPersonalizedContent(true)} refreshing={refreshing} />;
      case 'optimization':
        return <OptimizationCardContent content={content} onChatRequest={handleChatPress} onRefresh={() => loadPersonalizedContent(true)} refreshing={refreshing} />;
      case 'smartInsights':
        return <SmartInsightsCardContent content={content} onChatRequest={handleChatPress} onRefresh={() => loadPersonalizedContent(true)} refreshing={refreshing} />;
      case 'goalProgress':
        return <GoalProgressCardContent content={content} onChatRequest={handleChatPress} onRefresh={() => loadPersonalizedContent(true)} refreshing={refreshing} />;
      case 'riskAssessment':
        return <RiskAssessmentCardContent content={content} onChatRequest={handleChatPress} onRefresh={() => loadPersonalizedContent(true)} refreshing={refreshing} />;
      case 'opportunity':
        return <OpportunityCardContent content={content} onChatRequest={handleChatPress} onRefresh={() => loadPersonalizedContent(true)} refreshing={refreshing} />;
      case 'savingsOpportunity':
        return <SavingsOpportunityCardContent content={content} onChatRequest={handleChatPress} onRefresh={() => loadPersonalizedContent(true)} refreshing={refreshing} />;
      case 'strategy':
        return <StrategyCardContent content={content} onChatRequest={handleChatPress} onRefresh={() => loadPersonalizedContent(true)} refreshing={refreshing} />;
      case 'nextSteps':
        return <NextStepsCardContent content={content} onChatRequest={handleChatPress} onRefresh={() => loadPersonalizedContent(true)} refreshing={refreshing} />;
      default:
        return <DefaultCardContent cardType={cardType} content={content} onChatRequest={handleChatPress} onRefresh={() => loadPersonalizedContent(true)} refreshing={refreshing} />;
    }
  };

  return (
    <View style={[styles.card, styles[`${size}Card`]]}>
      {renderCardContent()}
    </View>
  );
};

// Specific card content components
const SpendingCardContent = ({ content, onChatRequest, onRefresh, refreshing }) => (
  <View style={styles.cardContent}>
    <View style={styles.header}>
      <Text style={styles.title}>Spending Analysis</Text>
      <View style={styles.headerActions}>
        <TouchableOpacity 
          style={styles.refreshButton} 
          onPress={onRefresh}
          disabled={refreshing}
        >
          <Text style={styles.refreshIcon}>{refreshing ? '⟳' : '↻'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.chatButton} onPress={onChatRequest}>
          <Text style={styles.chatIcon}>💬</Text>
        </TouchableOpacity>
      </View>
    </View>
    
    <Text style={styles.insight}>💡 {content.insight}</Text>
    <Text style={styles.tip}>🎯 {content.tip}</Text>
    
    <TouchableOpacity style={styles.actionButton} onPress={onChatRequest}>
      <Text style={styles.actionText}>{content.action}</Text>
    </TouchableOpacity>
  </View>
);

const RecommendationsCardContent = ({ content, onChatRequest, onRefresh, refreshing }) => (
  <View style={styles.cardContent}>
    <View style={styles.header}>
      <Text style={styles.title}>Fi Recommendations</Text>
      <View style={styles.headerActions}>
        <TouchableOpacity 
          style={styles.refreshButton} 
          onPress={onRefresh}
          disabled={refreshing}
        >
          <Text style={styles.refreshIcon}>{refreshing ? '⟳' : '↻'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.chatButton} onPress={onChatRequest}>
          <Text style={styles.chatIcon}>🎯</Text>
        </TouchableOpacity>
      </View>
    </View>
    
    <Text style={styles.productName}>{content.product}</Text>
    <Text style={styles.reason}>{content.reason}</Text>
    <Text style={styles.benefit}>✨ {content.benefit}</Text>
    
    <TouchableOpacity style={styles.actionButton} onPress={onChatRequest}>
      <Text style={styles.actionText}>{content.cta}</Text>
    </TouchableOpacity>
  </View>
);

const CategoryBreakdownCardContent = ({ content, onChatRequest, onRefresh, refreshing }) => (
  <View style={styles.cardContent}>
    <View style={styles.header}>
      <Text style={styles.title}>Category Breakdown</Text>
      <View style={styles.headerActions}>
        <TouchableOpacity 
          style={styles.refreshButton} 
          onPress={onRefresh}
          disabled={refreshing}
        >
          <Text style={styles.refreshIcon}>{refreshing ? '⟳' : '↻'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.chatButton} onPress={onChatRequest}>
          <Text style={styles.chatIcon}>📊</Text>
        </TouchableOpacity>
      </View>
    </View>
    
    <Text style={styles.insight}>{content.topInsight}</Text>
    <Text style={styles.attention}>⚠️ Focus: {content.attentionCategory}</Text>
    <Text style={styles.opportunity}>💰 Save: {content.savingsAmount}</Text>
    
    <TouchableOpacity style={styles.actionButton} onPress={onChatRequest}>
      <Text style={styles.actionText}>Optimize Categories</Text>
    </TouchableOpacity>
  </View>
);

const OptimizationCardContent = ({ content, onChatRequest, onRefresh, refreshing }) => (
  <View style={styles.cardContent}>
    <View style={styles.header}>
      <Text style={styles.title}>Save Money</Text>
      <View style={styles.headerActions}>
        <TouchableOpacity 
          style={styles.refreshButton} 
          onPress={onRefresh}
          disabled={refreshing}
        >
          <Text style={styles.refreshIcon}>{refreshing ? '⟳' : '↻'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.chatButton} onPress={onChatRequest}>
          <Text style={styles.chatIcon}>⚡</Text>
        </TouchableOpacity>
      </View>
    </View>
    
    <Text style={styles.opportunity}>{content.opportunity}</Text>
    <Text style={styles.action}>📋 {content.action}</Text>
    <Text style={styles.savings}>💰 Save: {content.savings}</Text>
    <Text style={styles.difficulty}>Difficulty: {content.difficulty}</Text>
    
    <TouchableOpacity style={styles.actionButton} onPress={onChatRequest}>
      <Text style={styles.actionText}>Show Me How</Text>
    </TouchableOpacity>
  </View>
);

const SmartInsightsCardContent = ({ content, onChatRequest, onRefresh, refreshing }) => (
  <View style={styles.cardContent}>
    <View style={styles.header}>
      <Text style={styles.title}>Smart Insights</Text>
      <View style={styles.headerActions}>
        <TouchableOpacity 
          style={styles.refreshButton} 
          onPress={onRefresh}
          disabled={refreshing}
        >
          <Text style={styles.refreshIcon}>{refreshing ? '⟳' : '↻'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.chatButton} onPress={onChatRequest}>
          <Text style={styles.chatIcon}>🧠</Text>
        </TouchableOpacity>
      </View>
    </View>
    
    <Text style={styles.strength}>💪 {content.strength}</Text>
    <Text style={styles.improvement}>🎯 {content.improvement}</Text>
    <Text style={styles.professionTip}>💼 {content.professionTip}</Text>
    
    <TouchableOpacity style={styles.actionButton} onPress={onChatRequest}>
      <Text style={styles.actionText}>More Insights</Text>
    </TouchableOpacity>
  </View>
);

const GoalProgressCardContent = ({ content, onChatRequest, onRefresh, refreshing }) => (
  <View style={styles.cardContent}>
    <View style={styles.header}>
      <Text style={styles.title}>Goal Progress</Text>
      <View style={styles.headerActions}>
        <TouchableOpacity 
          style={styles.refreshButton} 
          onPress={onRefresh}
          disabled={refreshing}
        >
          <Text style={styles.refreshIcon}>{refreshing ? '⟳' : '↻'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.chatButton} onPress={onChatRequest}>
          <Text style={styles.chatIcon}>🎯</Text>
        </TouchableOpacity>
      </View>
    </View>
    
    <Text style={styles.assessment}>{content.assessment}</Text>
    <Text style={styles.attention}>⚠️ {content.attentionGoal}</Text>
    <Text style={styles.motivation}>🌟 {content.motivation}</Text>
    
    <TouchableOpacity style={styles.actionButton} onPress={onChatRequest}>
      <Text style={styles.actionText}>{content.nextAction}</Text>
    </TouchableOpacity>
  </View>
);

const RiskAssessmentCardContent = ({ content, onChatRequest, onRefresh, refreshing }) => (
  <View style={styles.cardContent}>
    <View style={styles.header}>
      <Text style={styles.title}>Risk Assessment</Text>
      <View style={styles.headerActions}>
        <TouchableOpacity 
          style={styles.refreshButton} 
          onPress={onRefresh}
          disabled={refreshing}
        >
          <Text style={styles.refreshIcon}>{refreshing ? '⟳' : '↻'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.chatButton} onPress={onChatRequest}>
          <Text style={styles.chatIcon}>🛡️</Text>
        </TouchableOpacity>
      </View>
    </View>
    
    <Text style={styles.riskLevel}>Risk: {content.riskLevel}</Text>
    <Text style={styles.mainRisk}>⚠️ {content.mainRisk}</Text>
    <Text style={styles.strategy}>🛡️ {content.strategy}</Text>
    
    <TouchableOpacity style={styles.actionButton} onPress={onChatRequest}>
      <Text style={styles.actionText}>Improve Security</Text>
    </TouchableOpacity>
  </View>
);

const OpportunityCardContent = ({ content, onChatRequest, onRefresh, refreshing }) => (
  <View style={styles.cardContent}>
    <View style={styles.header}>
      <Text style={styles.title}>Growth Opportunity</Text>
      <View style={styles.headerActions}>
        <TouchableOpacity 
          style={styles.refreshButton} 
          onPress={onRefresh}
          disabled={refreshing}
        >
          <Text style={styles.refreshIcon}>{refreshing ? '⟳' : '↻'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.chatButton} onPress={onChatRequest}>
          <Text style={styles.chatIcon}>🚀</Text>
        </TouchableOpacity>
      </View>
    </View>
    
    <Text style={styles.opportunity}>{content.opportunity}</Text>
    <Text style={styles.steps}>📋 {content.steps}</Text>
    <Text style={styles.timeline}>⏰ {content.timeline}</Text>
    
    <TouchableOpacity style={styles.actionButton} onPress={onChatRequest}>
      <Text style={styles.actionText}>Start Growing</Text>
    </TouchableOpacity>
  </View>
);

const StrategyCardContent = ({ content, onChatRequest, onRefresh, refreshing }) => (
  <View style={styles.cardContent}>
    <View style={styles.header}>
      <Text style={styles.title}>Strategy</Text>
      <View style={styles.headerActions}>
        <TouchableOpacity 
          style={styles.refreshButton} 
          onPress={onRefresh}
          disabled={refreshing}
        >
          <Text style={styles.refreshIcon}>{refreshing ? '⟳' : '↻'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.chatButton} onPress={onChatRequest}>
          <Text style={styles.chatIcon}>📋</Text>
        </TouchableOpacity>
      </View>
    </View>
    
    <Text style={styles.strategy}>🎯 {content.strategy}</Text>
    <Text style={styles.action}>📋 {content.optimization}</Text>
    
    <TouchableOpacity style={styles.actionButton} onPress={onChatRequest}>
      <Text style={styles.actionText}>Get Details</Text>
    </TouchableOpacity>
  </View>
);

const SavingsOpportunityCardContent = ({ content, onChatRequest, onRefresh, refreshing }) => (
  <View style={styles.cardContent}>
    <View style={styles.header}>
      <Text style={styles.title}>Easy Savings</Text>
      <View style={styles.headerActions}>
        <TouchableOpacity 
          style={styles.refreshButton} 
          onPress={onRefresh}
          disabled={refreshing}
        >
          <Text style={styles.refreshIcon}>{refreshing ? '⟳' : '↻'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.chatButton} onPress={onChatRequest}>
          <Text style={styles.chatIcon}>💰</Text>
        </TouchableOpacity>
      </View>
    </View>
    
    <Text style={styles.savings}>💰 {content.potentialSavings}</Text>
    <Text style={styles.action}>📋 Focus: {content.easiestCategory}</Text>
    <Text style={styles.strategy}>{content.strategy}</Text>
    <Text style={styles.timeline}>⏰ {content.timeline}</Text>
    
    <TouchableOpacity style={styles.actionButton} onPress={onChatRequest}>
      <Text style={styles.actionText}>Try This</Text>
    </TouchableOpacity>
  </View>
);

const NextStepsCardContent = ({ content, onChatRequest, onRefresh, refreshing }) => (
  <View style={styles.cardContent}>
    <View style={styles.header}>
      <Text style={styles.title}>Next Steps</Text>
      <View style={styles.headerActions}>
        <TouchableOpacity 
          style={styles.refreshButton} 
          onPress={onRefresh}
          disabled={refreshing}
        >
          <Text style={styles.refreshIcon}>{refreshing ? '⟳' : '↻'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.chatButton} onPress={onChatRequest}>
          <Text style={styles.chatIcon}>⏭️</Text>
        </TouchableOpacity>
      </View>
    </View>
    
    <Text style={styles.action}>📋 {content.weeklyAction}</Text>
    <Text style={styles.tip}>📅 {content.monthlyReview}</Text>
    
    <TouchableOpacity style={styles.actionButton} onPress={onChatRequest}>
      <Text style={styles.actionText}>Start Now</Text>
    </TouchableOpacity>
  </View>
);

const DefaultCardContent = ({ cardType, content, onChatRequest, onRefresh, refreshing }) => (
  <View style={styles.cardContent}>
    <View style={styles.header}>
      <Text style={styles.title}>{cardType.charAt(0).toUpperCase() + cardType.slice(1)}</Text>
      <View style={styles.headerActions}>
        <TouchableOpacity 
          style={styles.refreshButton} 
          onPress={onRefresh}
          disabled={refreshing}
        >
          <Text style={styles.refreshIcon}>{refreshing ? '⟳' : '↻'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.chatButton} onPress={onChatRequest}>
          <Text style={styles.chatIcon}>💬</Text>
        </TouchableOpacity>
      </View>
    </View>
    
    <Text style={styles.content}>{content.content || content.title}</Text>
    
    <TouchableOpacity style={styles.actionButton} onPress={onChatRequest}>
      <Text style={styles.actionText}>{content.action || 'Learn More'}</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F5F5F5',
  },
  smallCard: {
    minHeight: 160,
  },
  mediumCard: {
    minHeight: 220,
  },
  largeCard: {
    minHeight: 300,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  refreshButton: {
    backgroundColor: '#F0F9FF',
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#00D4AA',
  },
  refreshIcon: {
    fontSize: 14,
    color: '#00D4AA',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    flex: 1,
    marginRight: 8,
  },
  chatButton: {
    backgroundColor: '#00D4AA',
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatIcon: {
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#FF6B6B',
    marginBottom: 12,
    fontWeight: '500',
  },
  retryButton: {
    backgroundColor: '#00D4AA',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    shadowColor: '#00D4AA',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  insight: {
    fontSize: 14,
    color: '#1A1A1A',
    marginBottom: 8,
    lineHeight: 20,
    fontWeight: '500',
  },
  tip: {
    fontSize: 13,
    color: '#4A4A4A',
    marginBottom: 10,
    lineHeight: 18,
    fontWeight: '400',
  },
  productName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#00D4AA',
    marginBottom: 4,
  },
  reason: {
    fontSize: 13,
    color: '#4A4A4A',
    marginBottom: 8,
    lineHeight: 18,
  },
  benefit: {
    fontSize: 14,
    color: '#1A1A1A',
    marginBottom: 10,
    fontWeight: '500',
    lineHeight: 20,
  },
  attention: {
    fontSize: 14,
    color: '#FF4757',
    marginBottom: 10,
    fontWeight: '600',
  },
  opportunity: {
    fontSize: 15,
    color: '#2ED573',
    marginBottom: 10,
    fontWeight: '600',
  },
  action: {
    fontSize: 14,
    color: '#1A1A1A',
    marginBottom: 10,
    lineHeight: 20,
    fontWeight: '500',
  },
  savings: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2ED573',
    marginBottom: 6,
  },
  difficulty: {
    fontSize: 13,
    color: '#666666',
    marginBottom: 14,
    fontWeight: '500',
  },
  strength: {
    fontSize: 15,
    color: '#2ED573',
    marginBottom: 10,
    fontWeight: '600',
  },
  improvement: {
    fontSize: 15,
    color: '#FF9500',
    marginBottom: 10,
    fontWeight: '600',
  },
  professionTip: {
    fontSize: 13,
    color: '#1A1A1A',
    marginBottom: 10,
    fontStyle: 'italic',
    lineHeight: 18,
    backgroundColor: '#F8F9FA',
    padding: 10,
    borderRadius: 6,
    borderLeftWidth: 2,
    borderLeftColor: '#00D4AA',
  },
  assessment: {
    fontSize: 15,
    color: '#1A1A1A',
    marginBottom: 10,
    fontWeight: '500',
    lineHeight: 22,
  },
  motivation: {
    fontSize: 15,
    color: '#2ED573',
    marginBottom: 14,
    fontWeight: '600',
  },
  riskLevel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF4757',
    marginBottom: 10,
  },
  mainRisk: {
    fontSize: 14,
    color: '#FF4757',
    marginBottom: 10,
    fontWeight: '500',
  },
  strategy: {
    fontSize: 14,
    color: '#1A1A1A',
    marginBottom: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  steps: {
    fontSize: 14,
    color: '#1A1A1A',
    marginBottom: 10,
    lineHeight: 20,
    fontWeight: '500',
  },
  timeline: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 14,
    fontWeight: '500',
  },
  content: {
    fontSize: 15,
    color: '#1A1A1A',
    marginBottom: 14,
    lineHeight: 22,
    fontWeight: '500',
  },
  actionButton: {
    backgroundColor: '#00D4AA',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default PersonalizedCard;
