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
import UserJourneyGuide from '../components/journey/UserJourneyGuide';
import ContextualSuggestions from '../components/journey/ContextualSuggestions';
import ConversationContinuity from '../components/ai/ConversationContinuity';
import FiProductWidget from '../components/fi-products/FiProductWidget';
import FiMonetizationWidget from '../components/fi-products/FiMonetizationWidget';
import FiBrandHeader from '../components/fi-products/FiBrandHeader';
import { useThemedStyles } from '../theme/useThemedStyles';
import { useSharedUser } from '../context/SharedUserContext';

const EnhancedGoalsScreen = ({ navigation, route }) => {
  const [chatVisible, setChatVisible] = useState(false);
  const [chatInitialMessage, setChatInitialMessage] = useState(null);
  const [journeyGuideVisible, setJourneyGuideVisible] = useState(false);
  const styles = useThemedStyles(createStyles);
  
  // Use shared user context instead of local state
  const { 
    user, 
    loading, 
    error, 
    loadUserData, 
    updateUserData, 
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

  // Show journey guide for new users or when explicitly requested
  useEffect(() => {
    if (user && !loading) {
      const hasGoals = user.goals && user.goals.length > 0;
      const showGuide = route.params?.showJourneyGuide || (!hasGoals && !route.params?.skipGuide);
      
      if (showGuide) {
        // Small delay to let the screen render first
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

  const handleFiProductSelect = (product) => {
    // Handle Fi product selection
    console.log('Fi Product selected:', product);
    handleChatRequest(`Tell me more about ${product.name} and how it can help with my financial goals`);
  };

  const handleFiUpgrade = (upgradeInfo) => {
    // Handle Fi Pro upgrade
    console.log('Fi Pro upgrade:', upgradeInfo);
    handleChatRequest('I want to upgrade to Fi Pro. What are the benefits for my financial situation?');
  };

  const handleFiBrandAction = (action) => {
    // Handle Fi brand actions
    console.log('Fi brand action:', action);
    if (action === 'fi-ecosystem') {
      handleChatRequest('Show me how I can integrate more Fi products into my financial planning');
    } else if (action === 'ai-info') {
      handleChatRequest('Tell me more about how Deltaverse AI powers Fi-Zen');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00D4AA" />
        <Text style={styles.loadingText}>Loading your goals...</Text>
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
      <ConversationContinuity
        currentScreen="goals"
        onContinueConversation={handleChatRequest}
        onDismiss={() => {}}
      />
      
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Financial Goals</Text>
          <Text style={styles.subtitle}>{user.name}'s goal tracking</Text>
        </View>
        <TouchableOpacity 
          style={styles.guideButton}
          onPress={showJourneyGuide}
        >
          <Text style={styles.guideIcon}>🧭</Text>
        </TouchableOpacity>
      </View>

      <CardProvider screenType="goals" user={user}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Fi Brand Header */}
          <FiBrandHeader
            user={user}
            screenType="goals"
            onBrandAction={handleFiBrandAction}
          />

          {/* Fi Product Recommendations */}
          <FiProductWidget
            user={user}
            screenType="goals"
            onProductSelect={handleFiProductSelect}
          />

          {/* Contextual Suggestions */}
          <ContextualSuggestions
            currentScreen="goals"
            navigation={navigation}
            onChatRequest={handleChatRequest}
          />

          {/* Contextual Navigation Section */}
          <View style={styles.contextualNavigation}>
            <Text style={styles.navTitle}>Related Actions</Text>
            <View style={styles.navButtons}>
              <TouchableOpacity 
                style={styles.navButton}
                onPress={() => navigation.navigate('Insights', { selectedUserId: user.userId })}
              >
                <Text style={styles.navIcon}>📊</Text>
                <Text style={styles.navLabel}>View Insights</Text>
                <Text style={styles.navSubtext}>See spending analysis</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.navButton}
                onPress={() => navigation.navigate('EnhancedDetailedBreakdown', { userId: user.userId })}
              >
                <Text style={styles.navIcon}>💰</Text>
                <Text style={styles.navLabel}>Spending Breakdown</Text>
                <Text style={styles.navSubtext}>Optimize expenses</Text>
              </TouchableOpacity>
            </View>
          </View>

          <DynamicCardGrid
            screenType="goals"
            user={user}
            onChatRequest={handleChatRequest}
          />

          {/* Fi Pro Monetization */}
          <FiMonetizationWidget
            user={user}
            screenType="goals"
            onUpgrade={handleFiUpgrade}
          />
        </ScrollView>
      </CardProvider>

      <SmartChatInterface
        user={user}
        currentScreen="goals"
        visible={chatVisible}
        onClose={() => setChatVisible(false)}
        initialMessage={chatInitialMessage}
      />

      <UserJourneyGuide
        currentScreen="goals"
        navigation={navigation}
        visible={journeyGuideVisible}
        onClose={handleJourneyGuideClose}
        onChatRequest={handleChatRequest}
      />
    </SafeAreaView>
  );
};

const GoalCard = ({ goal, onPress }) => {
  const styles = useThemedStyles(createStyles);
  
  const formatCurrency = (amount) => {
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(0)}K`;
    return `₹${amount}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'on_track': return '#51CF66';
      case 'behind': return '#FF6B6B';
      case 'ahead': return '#00D4AA';
      default: return '#FFB347';
    }
  };

  return (
    <TouchableOpacity style={styles.goalCard} onPress={onPress}>
      <View style={styles.goalHeader}>
        <Text style={styles.goalTitle}>{goal.title}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(goal.status) }]}>
          <Text style={styles.statusText}>
            {goal.status.replace('_', ' ').toUpperCase()}
          </Text>
        </View>
      </View>
      
      <View style={styles.goalProgress}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${goal.progress}%`,
                backgroundColor: getStatusColor(goal.status)
              }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>{goal.progress}%</Text>
      </View>
      
      <View style={styles.goalDetails}>
        <Text style={styles.goalAmount}>
          {formatCurrency(goal.current)} / {formatCurrency(goal.target)}
        </Text>
        <Text style={styles.goalDeadline}>
          Target: {new Date(goal.deadline).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const MilestoneItem = ({ milestone }) => {
  const styles = useThemedStyles(createStyles);
  
  return (
    <View style={styles.milestoneItem}>
      <View style={[
        styles.milestoneIcon,
        { backgroundColor: milestone.achieved ? '#51CF66' : '#FFB347' }
      ]}>
        <Text style={styles.milestoneIconText}>
          {milestone.achieved ? '✓' : '○'}
        </Text>
      </View>
      <View style={styles.milestoneContent}>
        <Text style={styles.milestoneTitle}>{milestone.milestone}</Text>
        <Text style={styles.milestoneGoal}>{milestone.goal}</Text>
        <Text style={styles.milestoneDate}>
          {milestone.achieved 
            ? `Achieved ${new Date(milestone.date).toLocaleDateString()}`
            : `Est. ${new Date(milestone.estimatedDate).toLocaleDateString()}`
          }
        </Text>
      </View>
    </View>
  );
};

const createStyles = (theme) => StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: theme.colors.textSecondary,
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
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.text,
  },
  headerSubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  addGoalButton: {
    backgroundColor: '#00D4AA',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  addGoalText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  goalsListContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 16,
  },
  goalCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    flex: 1,
  },
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  goalProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.text,
    minWidth: 35,
  },
  goalDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  goalAmount: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text,
  },
  goalDeadline: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  milestonesContainer: {
    padding: 20,
    paddingTop: 0,
  },
  milestoneItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  milestoneIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  milestoneIconText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  milestoneContent: {
    flex: 1,
  },
  milestoneTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
  },
  milestoneGoal: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  milestoneDate: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  floatingChatButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: theme.colors.primary,
    borderRadius: 28,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  chatButtonText: {
    fontSize: 20,
  },
  chatButtonHint: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '500',
    marginTop: 2,
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
  guideButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  guideIcon: {
    fontSize: 20,
  },
});

export default EnhancedGoalsScreen;
