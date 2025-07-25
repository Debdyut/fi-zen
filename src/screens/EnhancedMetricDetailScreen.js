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

const EnhancedMetricDetailScreen = ({ route, navigation }) => {
  const [chatVisible, setChatVisible] = useState(false);
  const [chatInitialMessage, setChatInitialMessage] = useState(null);
  const styles = useThemedStyles(createStyles);

  // Get metric and user from route params
  const { cardId, userId, metric: routeMetric } = route.params || {};
  
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

  const formatCurrency = (amount) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(0)}K`;
    return `₹${amount}`;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00D4AA" />
        <Text style={styles.loadingText}>Loading metric details...</Text>
      </View>
    );
  }

  if (error || !user) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          {error || 'Unable to load metric data'}
        </Text>
        <TouchableOpacity onPress={refreshUserData} style={styles.retryButton}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Determine current metric from route or default to net worth
  const metric = routeMetric || user.currentMetric || {
    name: 'Net Worth',
    value: user.netWorth?.netWorth || 0,
    change: 12.5,
    trend: 'increasing'
  };

  // Update user object with current metric for cards
  const userWithMetric = {
    ...user,
    currentMetric: metric
  };

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
          <Text style={styles.headerTitle}>{metric.name}</Text>
          <View style={styles.metricSummary}>
            <Text style={styles.metricValue}>
              {formatCurrency(metric.value)}
            </Text>
            <Text style={[
              styles.metricChange,
              { color: metric.change > 0 ? '#51CF66' : '#FF6B6B' }
            ]}>
              {metric.change > 0 ? '+' : ''}{metric.change}%
            </Text>
          </View>
        </View>
      </View>

      <CardProvider screenType="metricDetail" user={userWithMetric}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Contextual Navigation Section */}
          <View style={styles.contextualNavigation}>
            <Text style={styles.navTitle}>Related Analysis</Text>
            <View style={styles.navButtons}>
              <TouchableOpacity 
                style={styles.navButton}
                onPress={() => navigation.navigate('Insights', { selectedUserId: user.userId })}
              >
                <Text style={styles.navIcon}>📊</Text>
                <Text style={styles.navLabel}>Full Insights</Text>
                <Text style={styles.navSubtext}>Complete analysis</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.navButton}
                onPress={() => navigation.navigate('EnhancedDetailedBreakdown', { userId: user.userId })}
              >
                <Text style={styles.navIcon}>🔍</Text>
                <Text style={styles.navLabel}>Deep Dive</Text>
                <Text style={styles.navSubtext}>Detailed breakdown</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.navButton}
                onPress={() => navigation.navigate('Goals', { selectedUserId: user.userId })}
              >
                <Text style={styles.navIcon}>🎯</Text>
                <Text style={styles.navLabel}>Set Goals</Text>
                <Text style={styles.navSubtext}>Take action</Text>
              </TouchableOpacity>
            </View>
          </View>

          <DynamicCardGrid
            screenType="metricDetail"
            user={userWithMetric}
            onChatRequest={handleChatRequest}
          />
        </ScrollView>
      </CardProvider>

      <SmartChatInterface
        user={userWithMetric}
        currentScreen="metricDetail"
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
    marginBottom: 8,
  },
  metricSummary: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.text,
    marginRight: 12,
  },
  metricChange: {
    fontSize: 16,
    fontWeight: '600',
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
    gap: 8,
  },
  navButton: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  navIcon: {
    fontSize: 20,
    marginBottom: 6,
  },
  navLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 2,
  },
  navSubtext: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});

export default EnhancedMetricDetailScreen;
