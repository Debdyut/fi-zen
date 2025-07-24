/**
 * AI Goal Coach Component
 * Provides intelligent goal recommendations with fallback to static logic
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useLanguage } from '../../localization/LanguageContext';
import { getThemeColors } from '../../theme/consolidatedFiColors';
import EnhancedDataServiceWithAI from '../../services/EnhancedDataServiceWithAI';

const AIGoalCoach = ({ userId, currentGoals, onGoalUpdate }) => {
  const { isDarkMode } = useTheme();
  const { t, currentLanguage } = useLanguage();
  const colors = getThemeColors(isDarkMode);
  
  const [aiRecommendations, setAiRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [coachingMode, setCoachingMode] = useState('overview'); // overview, detailed, action

  useEffect(() => {
    loadAIRecommendations();
  }, [userId, currentGoals]);

  const loadAIRecommendations = async () => {
    setIsLoading(true);
    try {
      const recommendations = await EnhancedDataServiceWithAI.getAIGoalRecommendations(userId);
      
      // Parse AI response into structured recommendations
      const structuredRecs = parseAIRecommendations(recommendations);
      setAiRecommendations(structuredRecs);
      
    } catch (error) {
      console.warn('AI Goal recommendations failed, using fallback:', error);
      setAiRecommendations(getFallbackRecommendations());
    } finally {
      setIsLoading(false);
    }
  };

  const parseAIRecommendations = (aiResponse) => {
    // If AI response is available, parse it
    if (aiResponse.source === 'ai') {
      return parseAIText(aiResponse.response);
    }
    
    // Otherwise use static recommendations
    return getFallbackRecommendations();
  };

  const parseAIText = (aiText) => {
    // Simple parsing logic - can be enhanced
    const recommendations = [];
    
    // Look for goal-related keywords and create structured data
    if (aiText.includes('emergency') || aiText.includes('आपातकाल')) {
      recommendations.push({
        id: 'emergency_fund',
        title: 'Emergency Fund',
        priority: 'high',
        aiGenerated: true,
        description: extractRelevantText(aiText, 'emergency'),
        action: 'Build 6-month expense buffer'
      });
    }
    
    if (aiText.includes('house') || aiText.includes('घर')) {
      recommendations.push({
        id: 'house_purchase',
        title: 'House Purchase',
        priority: 'medium',
        aiGenerated: true,
        description: extractRelevantText(aiText, 'house'),
        action: 'Start saving for down payment'
      });
    }
    
    if (aiText.includes('retirement') || aiText.includes('रिटायरमेंट')) {
      recommendations.push({
        id: 'retirement',
        title: 'Retirement Planning',
        priority: 'high',
        aiGenerated: true,
        description: extractRelevantText(aiText, 'retirement'),
        action: 'Increase retirement corpus'
      });
    }
    
    return recommendations.length > 0 ? recommendations : getFallbackRecommendations();
  };

  const extractRelevantText = (fullText, keyword) => {
    // Extract sentences containing the keyword
    const sentences = fullText.split('.');
    const relevantSentences = sentences.filter(sentence => 
      sentence.toLowerCase().includes(keyword.toLowerCase())
    );
    return relevantSentences.join('. ').trim();
  };

  const getFallbackRecommendations = () => {
    return [
      {
        id: 'emergency_fund',
        title: 'Emergency Fund',
        priority: 'high',
        aiGenerated: false,
        description: 'Build an emergency fund covering 6 months of expenses',
        action: 'Save ₹3-5 lakhs in liquid funds',
        reasoning: 'Essential financial safety net for unexpected situations'
      },
      {
        id: 'retirement',
        title: 'Retirement Planning',
        priority: 'high',
        aiGenerated: false,
        description: 'Start retirement planning early to benefit from compounding',
        action: 'Allocate 20% income to retirement funds',
        reasoning: 'Time is your biggest advantage in retirement planning'
      },
      {
        id: 'house_purchase',
        title: 'House Purchase',
        priority: 'medium',
        aiGenerated: false,
        description: 'Plan for home purchase based on your location and income',
        action: 'Save for 20% down payment',
        reasoning: 'Real estate provides stability and potential appreciation'
      }
    ];
  };

  const handleGoalSelect = (goal) => {
    setSelectedGoal(goal);
    setCoachingMode('detailed');
  };

  const handleGetDetailedAdvice = async (goal) => {
    setIsLoading(true);
    try {
      const query = `Give me detailed advice for ${goal.title} goal. How should I plan and execute this?`;
      const detailedAdvice = await EnhancedDataServiceWithAI.getAIInsights(userId, query, 'goals');
      
      setSelectedGoal({
        ...goal,
        detailedAdvice: detailedAdvice.response,
        aiSource: detailedAdvice.source
      });
      setCoachingMode('action');
      
    } catch (error) {
      console.warn('Detailed advice failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderOverview = () => (
    <View>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        🎯 AI Goal Recommendations
      </Text>
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Analyzing your financial profile...
          </Text>
        </View>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {aiRecommendations.map((rec) => (
            <TouchableOpacity
              key={rec.id}
              style={[styles.recommendationCard, { backgroundColor: colors.surface }]}
              onPress={() => handleGoalSelect(rec)}
            >
              <View style={styles.cardHeader}>
                <Text style={[styles.cardTitle, { color: colors.text }]}>
                  {rec.title}
                </Text>
                <View style={[
                  styles.priorityBadge,
                  { backgroundColor: getPriorityColor(rec.priority) }
                ]}>
                  <Text style={styles.priorityText}>
                    {rec.priority.toUpperCase()}
                  </Text>
                </View>
              </View>
              
              <Text style={[styles.cardDescription, { color: colors.textSecondary }]}>
                {rec.description}
              </Text>
              
              <View style={styles.cardFooter}>
                <Text style={[styles.aiIndicator, { color: colors.primary }]}>
                  {rec.aiGenerated ? '🤖 AI' : '📋 Expert'}
                </Text>
                <Text style={[styles.actionText, { color: colors.primary }]}>
                  Tap for details →
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );

  const renderDetailed = () => (
    <View>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => setCoachingMode('overview')}
      >
        <Text style={[styles.backButtonText, { color: colors.primary }]}>
          ← Back to Overview
        </Text>
      </TouchableOpacity>
      
      <Text style={[styles.detailedTitle, { color: colors.text }]}>
        {selectedGoal.title}
      </Text>
      
      <Text style={[styles.detailedDescription, { color: colors.textSecondary }]}>
        {selectedGoal.description}
      </Text>
      
      <TouchableOpacity
        style={[styles.adviceButton, { backgroundColor: colors.primary }]}
        onPress={() => handleGetDetailedAdvice(selectedGoal)}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.adviceButtonText}>
            Get AI Coaching
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );

  const renderAction = () => (
    <View>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => setCoachingMode('detailed')}
      >
        <Text style={[styles.backButtonText, { color: colors.primary }]}>
          ← Back
        </Text>
      </TouchableOpacity>
      
      <Text style={[styles.actionTitle, { color: colors.text }]}>
        Action Plan: {selectedGoal.title}
      </Text>
      
      <View style={[styles.adviceContainer, { backgroundColor: colors.surface }]}>
        <View style={styles.adviceHeader}>
          <Text style={[styles.adviceLabel, { color: colors.text }]}>
            AI Coach Says:
          </Text>
          <Text style={[styles.aiSourceBadge, { color: colors.primary }]}>
            {selectedGoal.aiSource === 'ai' ? '🤖 AI' : '📋 Knowledge Base'}
          </Text>
        </View>
        
        <Text style={[styles.adviceText, { color: colors.textSecondary }]}>
          {selectedGoal.detailedAdvice}
        </Text>
      </View>
      
      <TouchableOpacity
        style={[styles.implementButton, { backgroundColor: colors.primary }]}
        onPress={() => onGoalUpdate && onGoalUpdate(selectedGoal)}
      >
        <Text style={styles.implementButtonText}>
          Add to My Goals
        </Text>
      </TouchableOpacity>
    </View>
  );

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#FF6B6B';
      case 'medium': return '#FFB366';
      case 'low': return '#4ECDC4';
      default: return '#95A5A6';
    }
  };

  return (
    <View style={styles.container}>
      {coachingMode === 'overview' && renderOverview()}
      {coachingMode === 'detailed' && renderDetailed()}
      {coachingMode === 'action' && renderAction()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  loadingText: {
    marginLeft: 12,
    fontSize: 14,
  },
  recommendationCard: {
    width: 280,
    padding: 16,
    borderRadius: 12,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  cardDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  aiIndicator: {
    fontSize: 12,
    fontWeight: '500',
  },
  actionText: {
    fontSize: 12,
    fontWeight: '500',
  },
  backButton: {
    marginBottom: 16,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  detailedTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  detailedDescription: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  adviceButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    alignItems: 'center',
  },
  adviceButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  actionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  adviceContainer: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  adviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  adviceLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  aiSourceBadge: {
    fontSize: 12,
    fontWeight: '500',
  },
  adviceText: {
    fontSize: 15,
    lineHeight: 22,
  },
  implementButton: {
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
  },
  implementButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AIGoalCoach;
