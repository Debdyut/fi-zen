import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { CardProvider, DynamicCardGrid } from '../components/common/DynamicCardSystem';
import SmartChatInterface from '../components/ai/SmartChatInterface';
import UserJourneyGuide from '../components/journey/UserJourneyGuide';
import ContextualSuggestions from '../components/journey/ContextualSuggestions';
import ConversationContinuity from '../components/ai/ConversationContinuity';
import { useThemedStyles } from '../theme/useThemedStyles';
import { useSharedUser } from '../context/SharedUserContext';

const EnhancedInsightsScreen = ({ navigation, route }) => {
  const [chatVisible, setChatVisible] = useState(false);
  const [chatInitialMessage, setChatInitialMessage] = useState(null);
  const [journeyGuideVisible, setJourneyGuideVisible] = useState(false);
  const { colors, isDarkMode } = useThemedStyles();
  const styles = createStyles(colors, isDarkMode);
  
  // Use shared user context
  const { 
    user, 
    loading, 
    error, 
    loadUserData, 
    refreshUserData,
    lastUpdated 
  } = useSharedUser();

  useEffect(() => {
    // Load user data when component mounts or route params change
    const userId = route.params?.selectedUserId;
    if (userId || !user) {
      loadUserData(userId);
    }
  }, [route.params?.selectedUserId]);

  // Show journey guide for users with limited data or when requested
  useEffect(() => {
    if (user && !loading) {
      const hasSpending = user.monthlySpending && Object.keys(user.monthlySpending).length > 0;
      const showGuide = route.params?.showJourneyGuide || (!hasSpending && !route.params?.skipGuide);
      
      if (showGuide) {
        setTimeout(() => setJourneyGuideVisible(true), 500);
      }
    }
  }, [user, loading, route.params]);

  // Refresh data when screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (user && lastUpdated) {
        const timeSinceUpdate = Date.now() - lastUpdated.getTime();
        // Refresh if data is older than 5 minutes
        if (timeSinceUpdate > 5 * 60 * 1000) {
          refreshUserData();
        }
      }
    });

    return unsubscribe;
  }, [navigation, user, lastUpdated]);

  const handleChatRequest = (message) => {
    setChatInitialMessage(message);
    setChatVisible(true);
  };

  const handleJourneyGuideClose = () => {
    setJourneyGuideVisible(false);
  };

  const showJourneyGuide = () => {
    setJourneyGuideVisible(true);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00D4AA" />
        <Text style={styles.loadingText}>Loading your insights...</Text>
      </View>
    );
  }

  if (error || !user) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          {error || 'Unable to load user data'}
        </Text>
        <TouchableOpacity onPress={refreshUserData} style={styles.retryButton}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ConversationContinuity
        currentScreen="insights"
        onContinueConversation={handleChatRequest}
        onDismiss={() => {}}
      />
      
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Financial Insights</Text>
          <Text style={styles.subtitle}>{user.name}'s personalized analysis</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.refreshButton}
            onPress={refreshUserData}
          >
            <Text style={styles.refreshIcon}>↻</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.guideButton}
            onPress={showJourneyGuide}
          >
            <Text style={styles.guideIcon}>🧭</Text>
          </TouchableOpacity>
        </View>
      </View>

      <CardProvider screenType="insights" user={user}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Contextual Suggestions */}
          <ContextualSuggestions
            currentScreen="insights"
            navigation={navigation}
            onChatRequest={handleChatRequest}
          />

          {/* Contextual Navigation Section */}
          <View style={styles.contextualNavigation}>
            <Text style={styles.navTitle}>Take Action</Text>
            <View style={styles.navButtons}>
              <TouchableOpacity 
                style={styles.navButton}
                onPress={() => navigation.navigate('Goals', { selectedUserId: user.userId })}
              >
                <Text style={styles.navIcon}>🎯</Text>
                <Text style={styles.navLabel}>Set Goals</Text>
                <Text style={styles.navSubtext}>Based on insights</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.navButton}
                onPress={() => navigation.navigate('EnhancedDetailedBreakdown', { userId: user.userId })}
              >
                <Text style={styles.navIcon}>💰</Text>
                <Text style={styles.navLabel}>Optimize Spending</Text>
                <Text style={styles.navSubtext}>Detailed breakdown</Text>
              </TouchableOpacity>
            </View>
          </View>

          <DynamicCardGrid
            screenType="insights"
            user={user}
            onChatRequest={handleChatRequest}
          />
        </ScrollView>
      </CardProvider>

      <SmartChatInterface
        user={user}
        currentScreen="insights"
        visible={chatVisible}
        onClose={() => setChatVisible(false)}
        initialMessage={chatInitialMessage}
      />

      <UserJourneyGuide
        currentScreen="insights"
        navigation={navigation}
        visible={journeyGuideVisible}
        onClose={handleJourneyGuideClose}
        onChatRequest={handleChatRequest}
      />
    </SafeAreaView>
  );
};

const createStyles = (colors, isDarkMode) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.text,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#00D4AA',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: '#00D4AA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 100,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '400',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  refreshButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  refreshIcon: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  guideButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  guideIcon: {
    fontSize: 20,
  },
  content: {
    flex: 1,
  },
  contextualNavigation: {
    padding: 16,
    marginBottom: 8,
  },
  navTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  navButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  navButton: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  navIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  navLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  navSubtext: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default EnhancedInsightsScreen;
