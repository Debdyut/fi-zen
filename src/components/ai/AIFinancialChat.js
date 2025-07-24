/**
 * AI Financial Chat Component
 * Conversational interface with fallback to static responses
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useLanguage } from '../../localization/LanguageContext';
import { getThemeColors } from '../../theme/consolidatedFiColors';
import EnhancedDataServiceWithAI from '../../services/EnhancedDataServiceWithAI';

const AIFinancialChat = ({ userId, initialQuery = null, onClose }) => {
  const { isDarkMode } = useTheme();
  const { t, currentLanguage } = useLanguage();
  const colors = getThemeColors(isDarkMode);
  
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiStatus, setAiStatus] = useState('unknown');
  const scrollViewRef = useRef(null);

  useEffect(() => {
    initializeChat();
    checkAIStatus();
  }, []);

  useEffect(() => {
    if (initialQuery) {
      handleSendMessage(initialQuery);
    }
  }, [initialQuery]);

  const initializeChat = () => {
    const welcomeMessage = {
      id: Date.now(),
      type: 'ai',
      content: getWelcomeMessage(),
      timestamp: new Date(),
      source: 'static'
    };
    setMessages([welcomeMessage]);
  };

  const getWelcomeMessage = () => {
    const messages = {
      en: "Hi! I'm your AI financial advisor. Ask me anything about your finances, investments, or goals. I can help in English, Hindi, or Kannada!",
      hi: "नमस्ते! मैं आपका AI वित्तीय सलाहकार हूं। अपने वित्त, निवेश या लक्ष्यों के बारे में कुछ भी पूछें।",
      kn: "ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ AI ಹಣಕಾಸು ಸಲಹೆಗಾರ. ನಿಮ್ಮ ಹಣಕಾಸು ಬಗ್ಗೆ ಏನು ಬೇಕಾದರೂ ಕೇಳಿ!"
    };
    return messages[currentLanguage] || messages.en;
  };

  const checkAIStatus = async () => {
    try {
      const health = await EnhancedDataServiceWithAI.getServiceHealth();
      setAiStatus(health.aiService?.status || 'unknown');
    } catch (error) {
      setAiStatus('error');
    }
  };

  const handleSendMessage = async (messageText = inputText) => {
    if (!messageText.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Get AI response with fallback
      const response = await EnhancedDataServiceWithAI.getAIInsights(
        userId, 
        messageText, 
        'chat'
      );

      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: response.response,
        timestamp: new Date(),
        source: response.source,
        confidence: response.confidence,
        fallbackUsed: response.fallbackUsed
      };

      setMessages(prev => [...prev, aiMessage]);

      // Show fallback indicator if needed
      if (response.fallbackUsed) {
        showFallbackNotification();
      }

    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: "I'm having trouble right now. Let me give you some general advice based on your profile.",
        timestamp: new Date(),
        source: 'error_fallback',
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      scrollToBottom();
    }
  };

  const showFallbackNotification = () => {
    // Subtle notification that we're using fallback
    setTimeout(() => {
      Alert.alert(
        "Using Offline Mode",
        "AI is temporarily unavailable. Using our built-in financial knowledge.",
        [{ text: "OK" }]
      );
    }, 1000);
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const renderMessage = (message) => {
    const isUser = message.type === 'user';
    const isAI = message.source === 'ai';
    const isFallback = message.fallbackUsed;

    return (
      <View key={message.id} style={[
        styles.messageContainer,
        isUser ? styles.userMessage : styles.aiMessage
      ]}>
        <View style={[
          styles.messageBubble,
          isUser ? 
            { backgroundColor: colors.primary } : 
            { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 }
        ]}>
          <Text style={[
            styles.messageText,
            { color: isUser ? colors.textInverse : colors.text }
          ]}>
            {message.content}
          </Text>
          
          {!isUser && (
            <View style={styles.messageFooter}>
              <Text style={[styles.sourceIndicator, { color: colors.textSecondary }]}>
                {isAI ? '🤖 AI' : '📋 Knowledge Base'}
                {isFallback && ' (Offline)'}
              </Text>
              {message.confidence && (
                <Text style={[styles.confidenceIndicator, { color: colors.textSecondary }]}>
                  {Math.round(message.confidence * 100)}% confidence
                </Text>
              )}
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderQuickActions = () => {
    const quickQueries = {
      en: [
        "Should I increase my SIP?",
        "How much emergency fund do I need?",
        "Should I buy or rent a house?",
        "How to optimize my taxes?"
      ],
      hi: [
        "क्या मुझे अपना SIP बढ़ाना चाहिए?",
        "मुझे कितना emergency fund चाहिए?",
        "घर खरीदूं या किराए पर लूं?",
        "टैक्स कैसे बचाऊं?"
      ]
    };

    const queries = quickQueries[currentLanguage] || quickQueries.en;

    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickActions}>
        {queries.map((query, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.quickActionButton, { borderColor: colors.primary }]}
            onPress={() => handleSendMessage(query)}
          >
            <Text style={[styles.quickActionText, { color: colors.primary }]}>
              {query}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          AI Financial Advisor
        </Text>
        <View style={styles.statusContainer}>
          <View style={[
            styles.statusDot, 
            { backgroundColor: aiStatus === 'healthy' ? '#00D4AA' : '#FF6B6B' }
          ]} />
          <Text style={[styles.statusText, { color: colors.textSecondary }]}>
            {aiStatus === 'healthy' ? 'AI Online' : 'Offline Mode'}
          </Text>
        </View>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={[styles.closeButtonText, { color: colors.primary }]}>✕</Text>
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <ScrollView 
        ref={scrollViewRef}
        style={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
      >
        {messages.map(renderMessage)}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
              Thinking...
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Quick Actions */}
      {messages.length <= 1 && renderQuickActions()}

      {/* Input */}
      <View style={[styles.inputContainer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        <TextInput
          style={[styles.textInput, { color: colors.text, borderColor: colors.border }]}
          value={inputText}
          onChangeText={setInputText}
          placeholder={currentLanguage === 'hi' ? "अपना सवाल पूछें..." : "Ask your question..."}
          placeholderTextColor={colors.textSecondary}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            { backgroundColor: inputText.trim() ? colors.primary : colors.border }
          ]}
          onPress={() => handleSendMessage()}
          disabled={!inputText.trim() || isLoading}
        >
          <Text style={styles.sendButtonText}>→</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  messageContainer: {
    marginBottom: 16,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  aiMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  messageFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  sourceIndicator: {
    fontSize: 10,
  },
  confidenceIndicator: {
    fontSize: 10,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
  },
  quickActions: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  quickActionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  quickActionText: {
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    borderTopWidth: 1,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 8,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AIFinancialChat;
