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
import { useThemedStyles } from '../theme/useThemedStyles';
import { useSharedUser } from '../context/SharedUserContext';

const EnhancedDetailedBreakdownScreen = ({ route, navigation }) => {
  const [chatVisible, setChatVisible] = useState(false);
  const [chatInitialMessage, setChatInitialMessage] = useState(null);
  const { colors } = useThemedStyles();
  const styles = createStyles(colors);

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
      <StatusBar barStyle="light-content" backgroundColor="#00D4AA" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Spending Breakdown</Text>
          <Text style={styles.subtitle}>
            ₹{totalSpending.toLocaleString()} total this month
          </Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.refreshButton}
            onPress={refreshUserData}
          >
            <Text style={styles.refreshIcon}>↻</Text>
          </TouchableOpacity>
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

const createStyles = (colors) => StyleSheet.create({
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
    alignItems: 'center',
    justifyContent: 'space-between',
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
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  backButtonText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  headerContent: {
    flex: 1,
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
  content: {
    flex: 1,
  },
  contextualNavigation: {
    paddingHorizontal: 16,
    paddingVertical: 16,
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

export default EnhancedDetailedBreakdownScreen;
