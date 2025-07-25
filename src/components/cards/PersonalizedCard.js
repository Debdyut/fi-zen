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

  useEffect(() => {
    loadPersonalizedContent();
  }, [cardType, user.userId, screenType]);

  const loadPersonalizedContent = async () => {
    try {
      setLoading(true);
      setError(false);
      const personalizedContent = await PersonalizedCardService.getPersonalizedCardContent(
        cardType, 
        user, 
        screenType
      );
      setContent(personalizedContent);
    } catch (err) {
      console.error('Error loading personalized content:', err);
      setError(true);
      // Use fallback content
      setContent(PersonalizedCardService.getFallbackContent(cardType, user));
    } finally {
      setLoading(false);
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
        return <SpendingCardContent content={content} onChatRequest={handleChatPress} />;
      case 'recommendations':
        return <RecommendationsCardContent content={content} onChatRequest={handleChatPress} />;
      case 'categoryBreakdown':
        return <CategoryBreakdownCardContent content={content} onChatRequest={handleChatPress} />;
      case 'optimization':
        return <OptimizationCardContent content={content} onChatRequest={handleChatPress} />;
      case 'smartInsights':
        return <SmartInsightsCardContent content={content} onChatRequest={handleChatPress} />;
      case 'goalProgress':
        return <GoalProgressCardContent content={content} onChatRequest={handleChatPress} />;
      case 'riskAssessment':
        return <RiskAssessmentCardContent content={content} onChatRequest={handleChatPress} />;
      case 'opportunity':
        return <OpportunityCardContent content={content} onChatRequest={handleChatPress} />;
      default:
        return <DefaultCardContent cardType={cardType} content={content} onChatRequest={handleChatPress} />;
    }
  };

  return (
    <View style={[styles.card, styles[`${size}Card`]]}>
      {renderCardContent()}
    </View>
  );
};

// Specific card content components
const SpendingCardContent = ({ content, onChatRequest }) => (
  <View style={styles.cardContent}>
    <View style={styles.header}>
      <Text style={styles.title}>Spending Analysis</Text>
      <TouchableOpacity style={styles.chatButton} onPress={onChatRequest}>
        <Text style={styles.chatIcon}>💬</Text>
      </TouchableOpacity>
    </View>
    
    <Text style={styles.insight}>💡 {content.insight}</Text>
    <Text style={styles.tip}>🎯 {content.tip}</Text>
    
    <TouchableOpacity style={styles.actionButton} onPress={onChatRequest}>
      <Text style={styles.actionText}>{content.action}</Text>
    </TouchableOpacity>
  </View>
);

const RecommendationsCardContent = ({ content, onChatRequest }) => (
  <View style={styles.cardContent}>
    <View style={styles.header}>
      <Text style={styles.title}>Fi Recommendations</Text>
      <TouchableOpacity style={styles.chatButton} onPress={onChatRequest}>
        <Text style={styles.chatIcon}>🎯</Text>
      </TouchableOpacity>
    </View>
    
    <Text style={styles.productName}>{content.product}</Text>
    <Text style={styles.reason}>{content.reason}</Text>
    <Text style={styles.benefit}>✨ {content.benefit}</Text>
    
    <TouchableOpacity style={styles.actionButton} onPress={onChatRequest}>
      <Text style={styles.actionText}>{content.cta}</Text>
    </TouchableOpacity>
  </View>
);

const CategoryBreakdownCardContent = ({ content, onChatRequest }) => (
  <View style={styles.cardContent}>
    <View style={styles.header}>
      <Text style={styles.title}>Category Breakdown</Text>
      <TouchableOpacity style={styles.chatButton} onPress={onChatRequest}>
        <Text style={styles.chatIcon}>📊</Text>
      </TouchableOpacity>
    </View>
    
    <Text style={styles.insight}>{content.topInsight}</Text>
    <Text style={styles.attention}>⚠️ Focus: {content.attentionCategory}</Text>
    <Text style={styles.opportunity}>💰 Save: {content.savingsAmount}</Text>
    
    <TouchableOpacity style={styles.actionButton} onPress={onChatRequest}>
      <Text style={styles.actionText}>Optimize Categories</Text>
    </TouchableOpacity>
  </View>
);

const OptimizationCardContent = ({ content, onChatRequest }) => (
  <View style={styles.cardContent}>
    <View style={styles.header}>
      <Text style={styles.title}>Optimization</Text>
      <TouchableOpacity style={styles.chatButton} onPress={onChatRequest}>
        <Text style={styles.chatIcon}>⚡</Text>
      </TouchableOpacity>
    </View>
    
    <Text style={styles.opportunity}>{content.opportunity}</Text>
    <Text style={styles.action}>📋 {content.action}</Text>
    <Text style={styles.savings}>💰 Save: {content.savings}</Text>
    <Text style={styles.difficulty}>Difficulty: {content.difficulty}</Text>
    
    <TouchableOpacity style={styles.actionButton} onPress={onChatRequest}>
      <Text style={styles.actionText}>Get Strategy</Text>
    </TouchableOpacity>
  </View>
);

const SmartInsightsCardContent = ({ content, onChatRequest }) => (
  <View style={styles.cardContent}>
    <View style={styles.header}>
      <Text style={styles.title}>Smart Insights</Text>
      <TouchableOpacity style={styles.chatButton} onPress={onChatRequest}>
        <Text style={styles.chatIcon}>🧠</Text>
      </TouchableOpacity>
    </View>
    
    <Text style={styles.strength}>💪 {content.strength}</Text>
    <Text style={styles.improvement}>🎯 {content.improvement}</Text>
    <Text style={styles.professionTip}>💼 {content.professionTip}</Text>
    
    <TouchableOpacity style={styles.actionButton} onPress={onChatRequest}>
      <Text style={styles.actionText}>More Insights</Text>
    </TouchableOpacity>
  </View>
);

const GoalProgressCardContent = ({ content, onChatRequest }) => (
  <View style={styles.cardContent}>
    <View style={styles.header}>
      <Text style={styles.title}>Goal Progress</Text>
      <TouchableOpacity style={styles.chatButton} onPress={onChatRequest}>
        <Text style={styles.chatIcon}>🎯</Text>
      </TouchableOpacity>
    </View>
    
    <Text style={styles.assessment}>{content.assessment}</Text>
    <Text style={styles.attention}>⚠️ {content.attentionGoal}</Text>
    <Text style={styles.motivation}>🌟 {content.motivation}</Text>
    
    <TouchableOpacity style={styles.actionButton} onPress={onChatRequest}>
      <Text style={styles.actionText}>{content.nextAction}</Text>
    </TouchableOpacity>
  </View>
);

const RiskAssessmentCardContent = ({ content, onChatRequest }) => (
  <View style={styles.cardContent}>
    <View style={styles.header}>
      <Text style={styles.title}>Risk Assessment</Text>
      <TouchableOpacity style={styles.chatButton} onPress={onChatRequest}>
        <Text style={styles.chatIcon}>🛡️</Text>
      </TouchableOpacity>
    </View>
    
    <Text style={styles.riskLevel}>Risk: {content.riskLevel}</Text>
    <Text style={styles.mainRisk}>⚠️ {content.mainRisk}</Text>
    <Text style={styles.strategy}>🛡️ {content.strategy}</Text>
    
    <TouchableOpacity style={styles.actionButton} onPress={onChatRequest}>
      <Text style={styles.actionText}>Improve Security</Text>
    </TouchableOpacity>
  </View>
);

const OpportunityCardContent = ({ content, onChatRequest }) => (
  <View style={styles.cardContent}>
    <View style={styles.header}>
      <Text style={styles.title}>Growth Opportunity</Text>
      <TouchableOpacity style={styles.chatButton} onPress={onChatRequest}>
        <Text style={styles.chatIcon}>🚀</Text>
      </TouchableOpacity>
    </View>
    
    <Text style={styles.opportunity}>{content.opportunity}</Text>
    <Text style={styles.steps}>📋 {content.steps}</Text>
    <Text style={styles.timeline}>⏰ {content.timeline}</Text>
    
    <TouchableOpacity style={styles.actionButton} onPress={onChatRequest}>
      <Text style={styles.actionText}>Start Growing</Text>
    </TouchableOpacity>
  </View>
);

const DefaultCardContent = ({ cardType, content, onChatRequest }) => (
  <View style={styles.cardContent}>
    <View style={styles.header}>
      <Text style={styles.title}>{cardType.charAt(0).toUpperCase() + cardType.slice(1)}</Text>
      <TouchableOpacity style={styles.chatButton} onPress={onChatRequest}>
        <Text style={styles.chatIcon}>💬</Text>
      </TouchableOpacity>
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
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  smallCard: {
    minHeight: 140,
  },
  mediumCard: {
    minHeight: 200,
  },
  largeCard: {
    minHeight: 280,
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
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
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
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 12,
    color: '#666666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 14,
    color: '#FF6B6B',
    marginBottom: 8,
  },
  retryButton: {
    backgroundColor: '#00D4AA',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  insight: {
    fontSize: 13,
    color: '#1A1A1A',
    marginBottom: 8,
    lineHeight: 18,
  },
  tip: {
    fontSize: 13,
    color: '#666666',
    marginBottom: 12,
    lineHeight: 18,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#00D4AA',
    marginBottom: 4,
  },
  reason: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 8,
  },
  benefit: {
    fontSize: 13,
    color: '#1A1A1A',
    marginBottom: 12,
  },
  attention: {
    fontSize: 12,
    color: '#FF6B6B',
    marginBottom: 8,
  },
  opportunity: {
    fontSize: 13,
    color: '#51CF66',
    marginBottom: 8,
  },
  action: {
    fontSize: 12,
    color: '#1A1A1A',
    marginBottom: 8,
  },
  savings: {
    fontSize: 13,
    fontWeight: '600',
    color: '#51CF66',
    marginBottom: 4,
  },
  difficulty: {
    fontSize: 11,
    color: '#666666',
    marginBottom: 12,
  },
  strength: {
    fontSize: 13,
    color: '#51CF66',
    marginBottom: 8,
  },
  improvement: {
    fontSize: 13,
    color: '#FF9500',
    marginBottom: 8,
  },
  professionTip: {
    fontSize: 12,
    color: '#1A1A1A',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  assessment: {
    fontSize: 13,
    color: '#1A1A1A',
    marginBottom: 8,
  },
  motivation: {
    fontSize: 13,
    color: '#51CF66',
    marginBottom: 12,
  },
  riskLevel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6B6B',
    marginBottom: 8,
  },
  mainRisk: {
    fontSize: 12,
    color: '#FF6B6B',
    marginBottom: 8,
  },
  strategy: {
    fontSize: 12,
    color: '#1A1A1A',
    marginBottom: 12,
  },
  steps: {
    fontSize: 12,
    color: '#1A1A1A',
    marginBottom: 8,
  },
  timeline: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 12,
  },
  content: {
    fontSize: 13,
    color: '#1A1A1A',
    marginBottom: 12,
    lineHeight: 18,
  },
  actionButton: {
    backgroundColor: '#00D4AA',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default PersonalizedCard;
