import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import aiContextManager from '../../services/AIContextManager';

const ConversationContinuity = ({ currentScreen, onContinueConversation, onDismiss }) => {
  const [visible, setVisible] = useState(false);
  const [conversationSummary, setConversationSummary] = useState(null);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    checkForOngoingConversation();
  }, [currentScreen]);

  const checkForOngoingConversation = () => {
    const summary = aiContextManager.getConversationSummary();
    
    if (summary && summary.hasOngoingConversation && summary.lastScreen !== currentScreen) {
      setConversationSummary(summary);
      setVisible(true);
      
      // Animate in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      
      // Auto-dismiss after 10 seconds if not interacted with
      setTimeout(() => {
        if (visible) {
          handleDismiss();
        }
      }, 10000);
    }
  };

  const handleContinue = () => {
    if (conversationSummary && onContinueConversation) {
      const continuationMessage = `I was discussing ${conversationSummary.lastTopic} on the ${conversationSummary.lastScreen} screen. ${conversationSummary.suggestedContinuation}`;
      onContinueConversation(continuationMessage);
    }
    handleDismiss();
  };

  const handleDismiss = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setVisible(false);
      onDismiss?.();
    });
  };

  const getTimeSinceLastInteraction = () => {
    if (!conversationSummary) return '';
    
    const timeDiff = Math.round((new Date() - conversationSummary.lastInteraction) / 1000 / 60);
    if (timeDiff < 1) return 'just now';
    if (timeDiff === 1) return '1 minute ago';
    if (timeDiff < 60) return `${timeDiff} minutes ago`;
    
    const hours = Math.round(timeDiff / 60);
    if (hours === 1) return '1 hour ago';
    return `${hours} hours ago`;
  };

  if (!visible || !conversationSummary) {
    return null;
  }

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>💬</Text>
          </View>
          <View style={styles.headerText}>
            <Text style={styles.title}>Continue Conversation</Text>
            <Text style={styles.subtitle}>
              Last discussed {conversationSummary.lastTopic} {getTimeSinceLastInteraction()}
            </Text>
          </View>
          <TouchableOpacity onPress={handleDismiss} style={styles.closeButton}>
            <Text style={styles.closeIcon}>×</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.suggestion}>
          {conversationSummary.suggestedContinuation}
        </Text>

        <View style={styles.actions}>
          <TouchableOpacity onPress={handleDismiss} style={styles.dismissButton}>
            <Text style={styles.dismissText}>Not now</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleContinue} style={styles.continueButton}>
            <Text style={styles.continueText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
    zIndex: 1000,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#00D4AA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#00D4AA20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 16,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    color: '#666666',
  },
  closeButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    fontSize: 18,
    color: '#666666',
    fontWeight: '300',
  },
  suggestion: {
    fontSize: 13,
    color: '#1A1A1A',
    lineHeight: 18,
    marginBottom: 16,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  dismissButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },
  dismissText: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
  },
  continueButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: '#00D4AA',
    alignItems: 'center',
  },
  continueText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default ConversationContinuity;
