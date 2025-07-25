import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useThemedStyles } from '../../theme/useThemedStyles';
import aiContextManager from '../../services/AIContextManager';

const SmartChatInterface = ({ 
  user, 
  currentScreen = 'home', 
  visible, 
  onClose,
  initialMessage = null 
}) => {
  const { colors } = useThemedStyles();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef(null);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 20,
      backgroundColor: colors.backgroundHeader,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 1,
      shadowRadius: 8,
      elevation: 4,
    },
    headerActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    refreshButton: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      borderRadius: 18,
      width: 36,
      height: 36,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    refreshButtonText: {
      fontSize: 16,
      color: colors.textInverse,
      fontWeight: '600',
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.textInverse,
    },
    closeButton: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      borderRadius: 18,
      width: 36,
      height: 36,
      justifyContent: 'center',
      alignItems: 'center',
    },
    closeButtonText: {
      fontSize: 16,
      color: colors.textInverse,
      fontWeight: '600',
    },
    messagesContainer: {
      flex: 1,
      padding: 20,
      paddingBottom: 10,
    },
    messageContainer: {
      marginVertical: 6,
      padding: 16,
      borderRadius: 16,
      maxWidth: '85%',
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 1,
      shadowRadius: 4,
      elevation: 2,
    },
    userMessage: {
      alignSelf: 'flex-end',
      backgroundColor: colors.primary,
    },
    userMessageText: {
      color: colors.textInverse,
      fontSize: 16,
      lineHeight: 22,
    },
    aiMessage: {
      alignSelf: 'flex-start',
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    aiMessageText: {
      color: colors.text,
      fontSize: 16,
      lineHeight: 22,
    },
    suggestionsContainer: {
      marginVertical: 16,
    },
    suggestionsTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.textSecondary,
      marginBottom: 8,
    },
    suggestionButton: {
      backgroundColor: colors.backgroundAccent,
      padding: 12,
      borderRadius: 8,
      marginVertical: 4,
      borderWidth: 1,
      borderColor: colors.primary,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 1,
      shadowRadius: 2,
      elevation: 1,
    },
    suggestionText: {
      color: colors.primary,
      fontSize: 14,
      fontWeight: '500',
    },
    actionsContainer: {
      marginVertical: 16,
      paddingBottom: 20,
    },
    actionsTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.textSecondary,
      marginBottom: 8,
    },
    actionButton: {
      backgroundColor: colors.primary,
      padding: 14,
      borderRadius: 12,
      marginVertical: 4,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 1,
      shadowRadius: 4,
      elevation: 2,
    },
    actionText: {
      color: colors.textInverse,
      fontSize: 14,
      fontWeight: '600',
      textAlign: 'center',
    },
    loadingContainer: {
      alignItems: 'center',
      padding: 16,
    },
    loadingText: {
      color: colors.textSecondary,
      fontStyle: 'italic',
      fontSize: 14,
    },
    inputContainer: {
      flexDirection: 'row',
      padding: 20,
      backgroundColor: colors.surface,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      alignItems: 'flex-end',
    },
    textInput: {
      flex: 1,
      borderWidth: 1,
      borderColor: colors.borderLight,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      marginRight: 12,
      maxHeight: 100,
      fontSize: 16,
      backgroundColor: colors.surfaceSecondary,
      color: colors.text,
    },
    sendButton: {
      backgroundColor: colors.primaryDark,
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 12,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 1,
      shadowRadius: 4,
      elevation: 2,
    },
    sendButtonDisabled: {
      backgroundColor: colors.secondary,
    },
    sendButtonText: {
      color: colors.textInverse,
      fontWeight: '600',
    },
  });

  // Initialize AI context when component mounts or user/screen changes
  useEffect(() => {
    if (user) {
      aiContextManager.setUserContext(user);
    }
    if (currentScreen) {
      aiContextManager.setCurrentScreen(currentScreen);
    }
  }, [user, currentScreen]);

  // Auto-scroll when chat opens
  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [visible]);

  // Initialize chat with context-aware greeting
  useEffect(() => {
    if (visible && messages.length === 0) {
      const conversationSummary = aiContextManager.getConversationSummary();
      const greeting = generateContextualGreeting(user, currentScreen, conversationSummary);
      
      const aiMessage = {
        id: 1,
        type: 'ai',
        content: greeting,
        timestamp: new Date()
      };
      
      setMessages([aiMessage]);
      aiContextManager.addAIResponse(greeting, currentScreen);
      
      // Add conversation starters
      const starters = getConversationStarters(user, currentScreen);
      setMessages(prev => [...prev, {
        id: 2,
        type: 'suggestions',
        content: starters,
        timestamp: new Date()
      }]);
    }
  }, [visible, user, currentScreen]);

  // Handle initial message from card interactions
  useEffect(() => {
    if (initialMessage && visible) {
      handleSendMessage(initialMessage);
    }
  }, [initialMessage, visible]);

  const generateContextualGreeting = (user, screen, conversationSummary = null) => {
    // If there's a recent conversation, acknowledge it
    if (conversationSummary && conversationSummary.hasOngoingConversation) {
      return `Hi ${user.name}! I see we were discussing ${conversationSummary.lastTopic} on the ${conversationSummary.lastScreen} screen. ${conversationSummary.suggestedContinuation}. How can I help you now on the ${screen} screen?`;
    }

    // Check if user has had any conversation in this session
    if (aiContextManager.hasRecentConversation(60)) { // Within last hour
      const stats = aiContextManager.getConversationStats();
      return `Welcome back, ${user.name}! We've had ${stats.totalMessages} messages in our ${stats.sessionDuration}-minute session. I'm here to continue helping with your financial planning on the ${screen} screen.`;
    }

    // Default contextual greetings based on screen
    const greetings = {
      home: `Hi ${user.name}! I see you're checking your financial overview. How can I help optimize your ₹${(user.profile?.monthlyIncome || 0).toLocaleString()} monthly income?`,
      goals: `Hello ${user.name}! Ready to work on your financial goals? As a ${user.profile?.profession || 'professional'}, I can suggest strategies tailored to your career.`,
      insights: `Hi there! I notice you're reviewing your financial insights. Want me to explain any metrics or suggest improvements based on your ₹${(user.netWorth?.netWorth || 0).toLocaleString()} net worth?`,
      breakdown: `Hello ${user.name}! I see you're analyzing your spending breakdown. Let's find optimization opportunities in your ₹${Object.values(user.monthlySpending || {}).reduce((a, b) => a + b, 0).toLocaleString()} monthly expenses.`,
      metricDetail: `Hi! I'm here to help you understand this metric in detail and suggest actionable improvements for your financial health.`,
      profile: `Welcome! I can help optimize your financial profile and suggest strategies perfect for a ${user.profile?.profession || 'professional'} in ${user.profile?.location || 'your area'}.`
    };
    
    return greetings[screen] || greetings.home;
  };

  const getConversationStarters = (user, screen) => {
    const starters = {
      home: [
        `How can I optimize my ₹${(user.profile?.monthlyIncome || 0).toLocaleString()} income?`,
        `Best investment strategy for a ${user.profile?.profession || 'professional'}?`,
        `Should I increase my SIP this month?`
      ],
      goals: [
        `Help me plan retirement as a ${user.profile?.profession || 'professional'}`,
        `Emergency fund target for my income level?`,
        `How to balance multiple financial goals?`
      ],
      insights: [
        `Explain my spending patterns`,
        `How do I compare to my peers?`,
        `What are my biggest financial risks?`
      ],
      profile: [
        `Optimize my investment portfolio`,
        `Best Fi products for my profile?`,
        `Tax-saving strategies for ${user.profile?.profession || 'professionals'}`
      ]
    };
    
    return starters[screen] || starters.home;
  };

  const buildContextPrompt = (userMessage) => {
    return `
User Profile:
- Name: ${user.name || 'User'}
- Profession: ${user.profile?.profession || 'Professional'}
- Monthly Income: ₹${(user.profile?.monthlyIncome || 0).toLocaleString()}
- Location: ${user.profile?.location || 'India'}
- Risk Profile: ${user.profile?.riskProfile || 'moderate'}
- Net Worth: ₹${(user.netWorth?.netWorth || 0).toLocaleString()}
- Current Screen: ${currentScreen}

Available Fi Products:
- Fi Federal Bank Account (6% interest)
- Fi Card (cashback credit card)
- Fi Mutual Funds (zero commission)
- Fi Jump Premium (₹199/month advanced features)
- Fi Auto-Sweep (intelligent cash management)
- Fi Deposits (fixed deposits)

User Question: "${userMessage}"

Instructions:
1. Provide helpful, personalized financial advice
2. Consider their profession, income, and risk profile
3. Naturally suggest relevant Fi products when appropriate
4. Keep responses conversational and actionable
5. Use Indian financial context and terminology
6. Be encouraging and professional

Response:`;
  };

  const handleSendMessage = async (message = inputText) => {
    if (!message.trim()) return;

    // Add user message to context manager
    aiContextManager.addUserMessage(message, currentScreen);

    // Check for cross-sell opportunities
    const crossSellRec = aiContextManager.getCrossSellRecommendation(message);
    
    // Add user message to UI
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Build contextual prompt using AIContextManager (now includes cross-selling)
      const contextualPrompt = aiContextManager.generateContextualPrompt(
        buildContextPrompt(message), 
        'chat'
      );

      // Call Deltaverse API with contextual prompt
      const response = await fetch('https://deltaverse-api-gewdd6ergq-uc.a.run.app/api/v1/chat/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: contextualPrompt,
          conversation_id: `fi-zen-${user.userId}-${currentScreen}`,
          user_id: user.userId
        })
      });

      const data = await response.json();
      let aiResponse = data.message || 'I apologize, but I encountered an issue. Please try again.';
      
      // Add cross-sell suggestion if high confidence and appropriate
      if (crossSellRec && crossSellRec.confidence === 'high' && crossSellRec.timing === 'immediate') {
        aiResponse += `\n\n💡 **Quick suggestion:** ${crossSellRec.mainPrompt}\n\n[${crossSellRec.cta}] - ${crossSellRec.urgency}`;
        
        // Track cross-sell impression
        aiContextManager.trackCrossSellEvent('impression', crossSellRec.product, {
          confidence: crossSellRec.confidence,
          trigger: 'chat_response'
        });
      }
      
      // Add AI response to context manager
      aiContextManager.addAIResponse(aiResponse, currentScreen);
      
      // Add AI response to UI
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: aiResponse,
        timestamp: new Date(),
        crossSellData: crossSellRec // Store for potential interaction tracking
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      // Check if response suggests Fi products and add quick actions
      if (containsFiProductSuggestion(data.message)) {
        const quickActions = extractFiProductActions(data.message);
        setMessages(prev => [...prev, {
          id: Date.now() + 2,
          type: 'actions',
          content: quickActions,
          timestamp: new Date()
        }]);
      }
      
    } catch (error) {
      console.error('Chat API Error:', error);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        type: 'ai',
        content: 'Sorry, I encountered a technical issue. Please try again in a moment.',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const containsFiProductSuggestion = (message) => {
    const fiProducts = ['Fi Card', 'Fi Mutual Funds', 'Fi Federal Bank', 'Fi Jump', 'Fi Auto-Sweep', 'Fi Deposits'];
    return fiProducts.some(product => message.includes(product));
  };

  const extractFiProductActions = (message) => {
    const actions = [];
    if (message.includes('Fi Card')) actions.push({ label: 'Apply for Fi Card', action: 'fi-card' });
    if (message.includes('Fi Mutual Funds')) actions.push({ label: 'Explore Mutual Funds', action: 'fi-mf' });
    if (message.includes('Fi Federal Bank')) actions.push({ label: 'Open Fi Account', action: 'fi-bank' });
    if (message.includes('Fi Jump')) actions.push({ label: 'Upgrade to Fi Jump', action: 'fi-jump' });
    return actions;
  };

  const renderMessage = (message) => {
    switch (message.type) {
      case 'user':
        return (
          <View key={message.id} style={[styles.messageContainer, styles.userMessage]}>
            <Text style={styles.userMessageText}>{message.content}</Text>
          </View>
        );
      
      case 'ai':
        return (
          <View key={message.id} style={[styles.messageContainer, styles.aiMessage]}>
            <Text style={styles.aiMessageText}>{message.content}</Text>
          </View>
        );
      
      case 'suggestions':
        return (
          <View key={message.id} style={styles.suggestionsContainer}>
            <Text style={styles.suggestionsTitle}>Quick questions:</Text>
            {message.content.map((suggestion, index) => (
              <TouchableOpacity
                key={index}
                style={styles.suggestionButton}
                onPress={() => handleSendMessage(suggestion)}
              >
                <Text style={styles.suggestionText}>{suggestion}</Text>
              </TouchableOpacity>
            ))}
          </View>
        );
      
      case 'actions':
        return (
          <View key={message.id} style={styles.actionsContainer}>
            <Text style={styles.actionsTitle}>Quick Actions:</Text>
            {message.content.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={styles.actionButton}
                onPress={() => handleProductAction(action.action)}
              >
                <Text style={styles.actionText}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        );
      
      default:
        return null;
    }
  };

  const handleProductAction = (action) => {
    // Handle Fi product actions
    console.log('Product action:', action);
    // This would integrate with Fi product flows
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Fi Financial Assistant</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity 
              onPress={() => {
                setMessages([]);
                const greeting = generateContextualGreeting(user, currentScreen);
                const aiMessage = {
                  id: Date.now(),
                  type: 'ai',
                  content: greeting,
                  timestamp: new Date()
                };
                setMessages([aiMessage]);
                const starters = getConversationStarters(user, currentScreen);
                setMessages(prev => [...prev, {
                  id: Date.now() + 1,
                  type: 'suggestions',
                  content: starters,
                  timestamp: new Date()
                }]);
              }} 
              style={styles.refreshButton}
            >
              <Text style={styles.refreshButtonText}>↻</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Messages */}
        <ScrollView 
          ref={scrollViewRef}
          style={styles.messagesContainer}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map(renderMessage)}
          {isLoading && (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>AI is thinking...</Text>
            </View>
          )}
          <View style={{ height: 20 }} />
        </ScrollView>

        {/* Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Ask about your finances..."
            placeholderTextColor={colors.textTertiary}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
            onPress={() => handleSendMessage()}
            disabled={!inputText.trim() || isLoading}
          >
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};



export default SmartChatInterface;
