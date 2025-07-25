import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { CardProvider, DynamicCardGrid } from '../components/common/DynamicCardSystem';
import SmartChatInterface from '../components/ai/SmartChatInterface';
import { useThemedStyles } from '../theme/useThemedStyles';
import { useSharedUser } from '../context/SharedUserContext';

const EnhancedDetailedBreakdownScreen = ({ route, navigation }) => {
  const [chatVisible, setChatVisible] = useState(false);
  const [chatInitialMessage, setChatInitialMessage] = useState(null);
  const styles = useThemedStyles(createStyles);

  // Get user from route params if available
  const { userId } = route.params || {};
  
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
    if (userId || !user) {
      loadUserData(userId);
    }
  }, [userId]);

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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00D4AA" />
        <Text style={styles.loadingText}>Loading spending breakdown...</Text>
      </View>
    );
  }

  if (error || !user) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          {error || 'Unable to load spending data'}
        </Text>
        <TouchableOpacity onPress={refreshUserData} style={styles.retryButton}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const totalSpending = Object.values(user.monthlySpending).reduce((a, b) => a + b, 0);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Spending Breakdown</Text>
          <Text style={styles.headerSubtitle}>
            ₹{totalSpending.toLocaleString()} total this month
          </Text>
        </View>
      </View>

      <CardProvider screenType="breakdown" user={user}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Contextual Navigation Section */}
          <View style={styles.contextualNavigation}>
            <Text style={styles.navTitle}>Next Steps</Text>
            <View style={styles.navButtons}>
              <TouchableOpacity 
                style={styles.navButton}
                onPress={() => navigation.navigate('Goals', { selectedUserId: user.userId })}
              >
                <Text style={styles.navIcon}>🎯</Text>
                <Text style={styles.navLabel}>Create Savings Goal</Text>
                <Text style={styles.navSubtext}>Based on optimization</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.navButton}
                onPress={() => navigation.navigate('Insights', { selectedUserId: user.userId })}
              >
                <Text style={styles.navIcon}>📊</Text>
                <Text style={styles.navLabel}>View Insights</Text>
                <Text style={styles.navSubtext}>Full financial picture</Text>
              </TouchableOpacity>
            </View>
          </View>

          <DynamicCardGrid
            screenType="breakdown"
            user={user}
            onChatRequest={handleChatRequest}
          />
        </ScrollView>
      </CardProvider>

      <SmartChatInterface
        user={user}
        currentScreen="breakdown"
        visible={chatVisible}
        onClose={() => setChatVisible(false)}
        initialMessage={chatInitialMessage}
      />
    </SafeAreaView>
  );
};

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: theme.colors.text,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: theme.colors.error,
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
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    marginRight: 16,
    padding: 8,
  },
  backButtonText: {
    fontSize: 24,
    color: theme.colors.text,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
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
    color: theme.colors.text,
    marginBottom: 12,
  },
  navButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  navButton: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  navIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  navLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
  },
  navSubtext: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});

export default EnhancedDetailedBreakdownScreen;
