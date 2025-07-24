/**
 * AI-Enhanced Fi Home Screen
 * Extends existing FiHomeScreen with AI insights while maintaining fallback
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import FiHomeScreen from './FiHomeScreen';
import AIFinancialChat from '../ai/AIFinancialChat';
import EnhancedDataServiceWithAI from '../../services/EnhancedDataServiceWithAI';
import { useTheme } from '../../theme/ThemeContext';
import { useLanguage } from '../../localization/LanguageContext';
import { getThemeColors } from '../../theme/consolidatedFiColors';

const AIEnhancedFiHomeScreen = ({ navigation, inflationData, selectedUserId }) => {
  const { isDarkMode } = useTheme();
  const { t, currentLanguage } = useLanguage();
  const colors = getThemeColors(isDarkMode);
  
  const [showAIChat, setShowAIChat] = useState(false);
  const [aiInsights, setAiInsights] = useState(null);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const [aiEnabled, setAiEnabled] = useState(true);

  useEffect(() => {
    loadAIInsights();
  }, [selectedUserId]);

  const loadAIInsights = async () => {
    if (!aiEnabled) return;
    
    setIsLoadingInsights(true);
    try {
      const insights = await EnhancedDataServiceWithAI.getAIInvestmentAdvice(selectedUserId);
      setAiInsights(insights);
    } catch (error) {
      console.warn('Failed to load AI insights:', error);
      // Gracefully degrade - no error shown to user
    } finally {
      setIsLoadingInsights(false);
    }
  };

  const handleAIButtonPress = () => {
    setShowAIChat(true);
  };

  const handleQuickQuery = (query) => {
    setShowAIChat(true);
    // Pass query to chat component
  };

  const renderAIInsightsCard = () => {
    if (!aiEnabled || !aiInsights) return null;

    return (
      <View style={[styles.aiInsightsCard, { backgroundColor: colors.surface }]}>
        <View style={styles.aiHeader}>
          <Text style={[styles.aiTitle, { color: colors.text }]}>
            🤖 AI Insights
          </Text>
          <View style={[
            styles.aiStatusBadge,
            { backgroundColor: aiInsights.source === 'ai' ? '#00D4AA20' : '#FF6B6B20' }
          ]}>
            <Text style={[
              styles.aiStatusText,
              { color: aiInsights.source === 'ai' ? '#00D4AA' : '#FF6B6B' }
            ]}>
              {aiInsights.source === 'ai' ? 'AI' : 'Offline'}
            </Text>
          </View>
        </View>
        
        <Text style={[styles.aiInsightText, { color: colors.textSecondary }]}>
          {aiInsights.response}
        </Text>
        
        <TouchableOpacity
          style={[styles.aiChatButton, { backgroundColor: colors.primary }]}
          onPress={handleAIButtonPress}
        >
          <Text style={styles.aiChatButtonText}>
            {currentLanguage === 'hi' ? 'और पूछें' : 'Ask More'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderQuickActions = () => {
    const quickActions = {
      en: [
        { text: "Optimize SIP", query: "Should I increase my SIP amount?" },
        { text: "Emergency Fund", query: "Is my emergency fund sufficient?" },
        { text: "Tax Saving", query: "How can I save more tax?" }
      ],
      hi: [
        { text: "SIP बढ़ाएं", query: "क्या मुझे अपना SIP बढ़ाना चाहिए?" },
        { text: "Emergency Fund", query: "क्या मेरा emergency fund काफी है?" },
        { text: "Tax बचाएं", query: "मैं कैसे ज्यादा tax बचा सकता हूं?" }
      ]
    };

    const actions = quickActions[currentLanguage] || quickActions.en;

    return (
      <View style={styles.quickActionsContainer}>
        <Text style={[styles.quickActionsTitle, { color: colors.text }]}>
          Quick AI Help
        </Text>
        <View style={styles.quickActionsRow}>
          {actions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.quickActionButton, { borderColor: colors.primary }]}
              onPress={() => handleQuickQuery(action.query)}
            >
              <Text style={[styles.quickActionText, { color: colors.primary }]}>
                {action.text}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const renderAIFloatingButton = () => {
    return (
      <TouchableOpacity
        style={[styles.aiFloatingButton, { backgroundColor: colors.primary }]}
        onPress={handleAIButtonPress}
      >
        <Text style={styles.aiFloatingButtonText}>🤖</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Original Fi Home Screen */}
      <FiHomeScreen
        navigation={navigation}
        inflationData={inflationData}
        selectedUserId={selectedUserId}
      />

      {/* AI Enhancements Overlay */}
      <View style={styles.aiOverlay}>
        {renderAIInsightsCard()}
        {renderQuickActions()}
      </View>

      {/* Floating AI Button */}
      {renderAIFloatingButton()}

      {/* AI Chat Modal */}
      <Modal
        visible={showAIChat}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <AIFinancialChat
          userId={selectedUserId}
          onClose={() => setShowAIChat(false)}
        />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  aiOverlay: {
    position: 'absolute',
    top: 200, // Position below main metrics
    left: 16,
    right: 16,
    zIndex: 1,
  },
  aiInsightsCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  aiTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  aiStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  aiStatusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  aiInsightText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  aiChatButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  aiChatButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  quickActionsContainer: {
    marginBottom: 16,
  },
  quickActionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  quickActionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  quickActionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '500',
  },
  aiFloatingButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 999,
  },
  aiFloatingButtonText: {
    fontSize: 24,
  },
});

export default AIEnhancedFiHomeScreen;
