import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { FadeInUp } from '../animations/AnimatedCard';
import MLRecommendationEngine from '../../utils/MLRecommendationEngine';
import { FiColors } from '../../theme/consolidatedFiColors';

const AIRecommendationsCard = ({ userProfile, behaviorHistory = [] }) => {
  const [aiRecommendations, setAiRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('personalized');

  useEffect(() => {
    generateAIRecommendations();
  }, [userProfile, behaviorHistory]);

  const generateAIRecommendations = async () => {
    try {
      setLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const currentRecommendations = []; // Would come from existing recommendations
      const aiRecs = MLRecommendationEngine.generateAIRecommendations(
        userProfile,
        behaviorHistory,
        currentRecommendations
      );
      
      setAiRecommendations(aiRecs);
    } catch (error) {
      console.error('Error generating AI recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRecommendationAction = (recommendation, action) => {
    // Track user behavior
    MLRecommendationEngine.trackUserBehavior(
      userProfile.id,
      `recommendation_${action}`,
      {
        recommendationId: recommendation.id,
        recommendationType: recommendation.type,
        confidence: recommendation.confidence,
        feature: 'ai_recommendations'
      }
    );

    // Handle the action (implement, dismiss, etc.)
    console.log(`User ${action} recommendation:`, recommendation.title);
  };

  const getConfidenceColor = (confidence) => {
    if (confidence > 0.8) return FiColors.success;
    if (confidence > 0.6) return FiColors.warning;
    return FiColors.error;
  };

  const getConfidenceText = (confidence) => {
    if (confidence > 0.8) return 'High Confidence';
    if (confidence > 0.6) return 'Medium Confidence';
    return 'Low Confidence';
  };

  const RecommendationItem = ({ recommendation, index }) => (
    <FadeInUp delay={100 + (index * 50)}>
      <View style={styles.recommendationCard}>
        <View style={styles.recommendationHeader}>
          <View style={styles.titleContainer}>
            <Text style={styles.recommendationTitle}>{recommendation.title}</Text>
            <View style={[styles.confidenceBadge, { backgroundColor: getConfidenceColor(recommendation.confidence) + '20' }]}>
              <Text style={[styles.confidenceText, { color: getConfidenceColor(recommendation.confidence) }]}>
                {getConfidenceText(recommendation.confidence)}
              </Text>
            </View>
          </View>
        </View>
        
        <Text style={styles.recommendationDescription}>
          {recommendation.description}
        </Text>
        
        <View style={styles.reasoningContainer}>
          <Text style={styles.reasoningLabel}>🤖 AI Insight:</Text>
          <Text style={styles.reasoningText}>{recommendation.reasoning}</Text>
        </View>
        
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.implementButton}
            onPress={() => handleRecommendationAction(recommendation, 'implement')}
          >
            <Text style={styles.implementButtonText}>Implement</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.learnMoreButton}
            onPress={() => handleRecommendationAction(recommendation, 'learn_more')}
          >
            <Text style={styles.learnMoreButtonText}>Learn More</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.dismissButton}
            onPress={() => handleRecommendationAction(recommendation, 'dismiss')}
          >
            <Text style={styles.dismissButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
      </View>
    </FadeInUp>
  );

  const TabButton = ({ id, title, active, onPress }) => (
    <TouchableOpacity
      style={[styles.tabButton, active && styles.activeTab]}
      onPress={() => onPress(id)}
    >
      <Text style={[styles.tabText, active && styles.activeTabText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <FadeInUp delay={100}>
        <View style={styles.card}>
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingIcon}>🤖</Text>
            <Text style={styles.loadingTitle}>AI is analyzing your behavior...</Text>
            <Text style={styles.loadingSubtitle}>Generating personalized recommendations</Text>
          </View>
        </View>
      </FadeInUp>
    );
  }

  return (
    <FadeInUp delay={100}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.icon}>🤖</Text>
          <View>
            <Text style={styles.title}>AI-Powered Recommendations</Text>
            <Text style={styles.subtitle}>
              Personalized insights based on your behavior
            </Text>
          </View>
        </View>

        <View style={styles.tabContainer}>
          <TabButton 
            id="personalized" 
            title="Personal" 
            active={activeTab === 'personalized'} 
            onPress={setActiveTab} 
          />
          <TabButton 
            id="collaborative" 
            title="Similar Users" 
            active={activeTab === 'collaborative'} 
            onPress={setActiveTab} 
          />
          <TabButton 
            id="adaptive" 
            title="Adaptive" 
            active={activeTab === 'adaptive'} 
            onPress={setActiveTab} 
          />
        </View>

        <ScrollView style={styles.recommendationsContainer} showsVerticalScrollIndicator={false}>
          {activeTab === 'personalized' && 
            aiRecommendations?.personalizedRecommendations?.map((rec, index) => (
              <RecommendationItem key={rec.id} recommendation={rec} index={index} />
            ))
          }
          
          {activeTab === 'collaborative' && 
            aiRecommendations?.collaborativeRecommendations?.map((rec, index) => (
              <RecommendationItem key={rec.id} recommendation={rec} index={index} />
            ))
          }
          
          {activeTab === 'adaptive' && 
            aiRecommendations?.adaptiveRecommendations?.map((rec, index) => (
              <RecommendationItem key={rec.id} recommendation={rec} index={index} />
            ))
          }
          
          {(!aiRecommendations || 
            (activeTab === 'personalized' && !aiRecommendations.personalizedRecommendations?.length) ||
            (activeTab === 'collaborative' && !aiRecommendations.collaborativeRecommendations?.length) ||
            (activeTab === 'adaptive' && !aiRecommendations.adaptiveRecommendations?.length)
          ) && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🔍</Text>
              <Text style={styles.emptyTitle}>Learning About You</Text>
              <Text style={styles.emptyText}>
                Keep using the app to get more personalized AI recommendations
              </Text>
            </View>
          )}
        </ScrollView>

        {aiRecommendations?.learningInsights && (
          <View style={styles.insightsContainer}>
            <Text style={styles.insightsTitle}>🧠 What AI Learned About You</Text>
            <Text style={styles.insightsText}>
              {aiRecommendations.learningInsights}
            </Text>
          </View>
        )}
      </View>
    </FadeInUp>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: FiColors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: FiColors.ai,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  icon: {
    fontSize: 24,
    marginRight: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: FiColors.text,
  },
  subtitle: {
    fontSize: 14,
    color: FiColors.textSecondary,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  loadingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: FiColors.text,
    marginBottom: 8,
  },
  loadingSubtitle: {
    fontSize: 14,
    color: FiColors.textSecondary,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: FiColors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 12,
    color: FiColors.textSecondary,
    fontWeight: '500',
  },
  activeTabText: {
    color: FiColors.text,
    fontWeight: '600',
  },
  recommendationsContainer: {
    maxHeight: 400,
  },
  recommendationCard: {
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: FiColors.ai,
  },
  recommendationHeader: {
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: FiColors.text,
    flex: 1,
    marginRight: 12,
  },
  confidenceBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  confidenceText: {
    fontSize: 10,
    fontWeight: '600',
  },
  recommendationDescription: {
    fontSize: 14,
    color: FiColors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  reasoningContainer: {
    backgroundColor: FiColors.ai + '10',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  reasoningLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: FiColors.ai,
    marginBottom: 4,
  },
  reasoningText: {
    fontSize: 12,
    color: FiColors.text,
    lineHeight: 16,
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  implementButton: {
    backgroundColor: FiColors.primary,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  implementButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  learnMoreButton: {
    borderWidth: 1,
    borderColor: FiColors.primary,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  learnMoreButtonText: {
    color: FiColors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  dismissButton: {
    padding: 8,
    marginLeft: 'auto',
  },
  dismissButtonText: {
    color: FiColors.textSecondary,
    fontSize: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: FiColors.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: FiColors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  insightsContainer: {
    backgroundColor: FiColors.ai + '10',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  insightsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: FiColors.ai,
    marginBottom: 8,
  },
  insightsText: {
    fontSize: 13,
    color: FiColors.text,
    lineHeight: 18,
  },
});

export default AIRecommendationsCard;
