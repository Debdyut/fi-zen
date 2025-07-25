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
import DataService from '../services/DataService';
import ProductionInflationCard from '../components/ProductionInflationCard';

const EnhancedHomeScreen = ({ navigation, route }) => {
  const [chatVisible, setChatVisible] = useState(false);
  const [chatInitialMessage, setChatInitialMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const styles = useThemedStyles(createStyles);

  useEffect(() => {
    loadUserData();
  }, [route.params?.selectedUserId]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      
      // Get current user (from route params or DataService)
      const paramUser = route.params?.selectedUserId;
      const serviceUser = DataService.getCurrentUser();
      const currentUserId = paramUser || serviceUser || '1010101010';
      
      if (paramUser) {
        DataService.setCurrentUser(paramUser);
      }

      // Load user data
      const [userProfile, userGoals, userSpending, userNetWorth] = await Promise.all([
        DataService.getUserProfile(currentUserId),
        DataService.getUserGoals(currentUserId),
        DataService.getUserSpending(currentUserId),
        DataService.getUserNetWorth(currentUserId)
      ]);

      // Construct user object for cards
      const userData = {
        userId: currentUserId,
        name: userProfile?.name || 'User',
        profile: {
          profession: userProfile?.profession || 'Professional',
          monthlyIncome: userProfile?.monthlyIncome || 50000,
          location: userProfile?.location || 'India',
          riskProfile: userProfile?.riskProfile || 'moderate',
          age: userProfile?.age || 30
        },
        goals: userGoals || [],
        monthlySpending: userSpending || {},
        netWorth: userNetWorth || { netWorth: 0 },
        // Add personal inflation if available
        personalInflation: userProfile?.personalInflation || null,
        // Add financial health if available
        financialHealth: userProfile?.financialHealth || {
          score: 70,
          status: 'Good'
        }
      };

      setUser(userData);
    } catch (error) {
      console.error('Error loading user data:', error);
      // Fallback to basic user data
      setUser({
        userId: '1010101010',
        name: 'User',
        profile: {
          profession: 'Professional',
          monthlyIncome: 50000,
          location: 'India',
          riskProfile: 'moderate',
          age: 30
        },
        goals: [],
        monthlySpending: {},
        netWorth: { netWorth: 0 },
        personalInflation: null
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChatRequest = (message) => {
    setChatInitialMessage(message);
    setChatVisible(true);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00D4AA" />
        <Text style={styles.loadingText}>Loading your dashboard...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Unable to load user data</Text>
        <TouchableOpacity onPress={loadUserData} style={styles.retryButton}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome back, {user.name}!</Text>
        <Text style={styles.subtitle}>Your financial overview</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Inflation Card - Keep as separate component */}
        <View style={styles.inflationSection}>
          <ProductionInflationCard userId={user.userId} navigation={navigation} />
        </View>

        {/* Dynamic Cards */}
        <CardProvider screenType="home" user={user}>
          <DynamicCardGrid
            screenType="home"
            user={user}
            onChatRequest={handleChatRequest}
          />
        </CardProvider>
      </ScrollView>

      <SmartChatInterface
        user={user}
        currentScreen="home"
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
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  content: {
    flex: 1,
  },
  inflationSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
});

export default EnhancedHomeScreen;
