import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, ActivityIndicator } from 'react-native';
import { FadeInUp } from '../components/animations/AnimatedCard';
import { TouchableArea } from '../components/common/AccessibilityHelpers';
import { useLanguage } from '../localization/LanguageContext';
import { useTheme } from '../theme/ThemeContext';
import DataService from '../services/DataService';
import EnhancedPersonalizationEngine from '../utils/EnhancedPersonalizationEngine';
import MilestoneTracker from '../components/goals/MilestoneTracker';
import CrossScreenActions from '../components/goals/CrossScreenActions';
import CrossScreenIntegration from '../utils/CrossScreenIntegration';
import UpcomingFeatures from '../components/goals/UpcomingFeatures';

const FiColors = {
  background: '#1A1A1A',
  surface: '#FFFFFF',
  primary: '#00D4AA',
  text: '#1A1A1A',
  textSecondary: '#666666',
  textInverse: '#FFFFFF',
  border: '#E0E0E0',
  success: '#00D4AA',
  warning: '#FFB800',
  error: '#FF6B6B',
};

const GoalsScreen = ({ navigation }) => {
  const { t } = useLanguage();
  const { isDarkMode } = useTheme();
  const [loading, setLoading] = useState(true);
  const [userGoals, setUserGoals] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [portfolio, setPortfolio] = useState(null);
  const [netWorth, setNetWorth] = useState(null);
  const [selectedGoalForMilestones, setSelectedGoalForMilestones] = useState(null);
  const [selectedGoalForActions, setSelectedGoalForActions] = useState(null);
  const [crossScreenInsights, setCrossScreenInsights] = useState([]);
  const [showUpcomingFeatures, setShowUpcomingFeatures] = useState(false);

  useEffect(() => {
    loadGoalsData();
  }, []);

  const loadGoalsData = async () => {
    try {
      setLoading(true);
      const currentUser = DataService.getCurrentUser();
      
      const [goals, profile, portfolioData, netWorthData, spendingData] = await Promise.all([
        DataService.getUserGoals(currentUser),
        DataService.getUserProfile(currentUser),
        DataService.getUserPortfolio(currentUser),
        DataService.getUserNetWorth(currentUser),
        DataService.getUserSpendingInsights(currentUser)
      ]);
      
      // If no goals exist, generate realistic goals based on user profile
      const finalGoals = goals.length > 0 ? goals : generateRealisticGoals(profile, portfolioData, netWorthData);
      
      // Generate cross-screen insights
      const insights = CrossScreenIntegration.getGoalImpactInsights(finalGoals, spendingData, profile);
      
      setUserGoals(finalGoals);
      setUserProfile(profile);
      setPortfolio(portfolioData);
      setNetWorth(netWorthData);
      setCrossScreenInsights(insights);
      
    } catch (error) {
      console.error('Error loading goals data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateRealisticGoals = (profile, portfolio, netWorth) => {
    // Use enhanced personalization engine
    return EnhancedPersonalizationEngine.generateEnhancedGoals(profile, portfolio, netWorth);
  };

  const GoalCard = ({ goal, bgColor }) => {
    const progress = (goal.currentAmount / goal.targetAmount) * 100;
    const remaining = goal.targetAmount - goal.currentAmount;
    
    return (
      <FadeInUp delay={100}>
        <View style={[styles.goalCard, { backgroundColor: bgColor }]}>
          <View style={styles.goalHeader}>
            <View style={styles.goalTitleSection}>
              <Text style={styles.goalIcon}>{goal.icon}</Text>
              <View style={styles.goalTitleContainer}>
                <Text style={styles.goalTitle} numberOfLines={1}>{goal.title}</Text>
                <Text style={styles.goalCategory} numberOfLines={1}>{goal.category}</Text>
              </View>
            </View>
            <Text style={styles.goalProgressText}>{Math.round(progress)}%</Text>
          </View>
          
          <View style={styles.goalAmounts}>
            <Text style={styles.goalCurrent}>₹{(goal.currentAmount/100000).toFixed(1)}L</Text>
            <Text style={styles.goalTarget}>of ₹{(goal.targetAmount/100000).toFixed(1)}L</Text>
          </View>
          
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBarFill, { width: `${Math.min(progress, 100)}%` }]} />
            </View>
          </View>
          
          <View style={styles.goalFooter}>
            <Text style={styles.remainingAmount}>₹{(remaining/100000).toFixed(1)}L remaining</Text>
            <Text style={styles.monthlyTarget}>₹{(goal.monthlyContribution/1000).toFixed(0)}K/month</Text>
          </View>
          
          <View style={styles.buttonContainer}>
            <TouchableArea 
              style={styles.primaryButton}
              onPress={() => setSelectedGoalForMilestones(goal)}
            >
              <Text style={styles.primaryButtonText}>View Milestones</Text>
            </TouchableArea>
            
            <TouchableArea 
              style={styles.secondaryButton}
              onPress={() => setSelectedGoalForActions(goal)}
            >
              <Text style={styles.secondaryButtonText}>Take Action</Text>
            </TouchableArea>
          </View>
        </View>
      </FadeInUp>
    );
  };

  const InflationImpactCard = () => (
    <FadeInUp delay={200}>
      <View style={styles.impactCard}>
        <View style={styles.impactHeader}>
          <Text style={styles.impactIcon}>⚠️</Text>
          <View>
            <Text style={styles.impactTitle}>{t('goals.inflationImpactTitle')}</Text>
            <Text style={styles.impactSubtitle}>{t('goals.inflationImpactSubtitle')}</Text>
          </View>
        </View>
        
        <View style={styles.impactContent}>
          <View style={styles.impactItem}>
            <Text style={styles.impactLabel}>{t('goals.additionalAmountNeeded')}</Text>
            <Text style={styles.impactValue}>₹1,24,500</Text>
          </View>
          <View style={styles.impactItem}>
            <Text style={styles.impactLabel}>{t('goals.extendedTimeline')}</Text>
            <Text style={styles.impactValue}>+3.2 {t('goals.months')}</Text>
          </View>
        </View>
        
        <TouchableArea style={styles.adjustButton}>
          <Text style={styles.adjustButtonText}>{t('goals.adjustGoalsButton')}</Text>
        </TouchableArea>
      </View>
    </FadeInUp>
  );

  const QuickActions = () => (
    <FadeInUp delay={300}>
      <View style={styles.quickActionsSection}>
        <Text style={styles.sectionTitle}>{t('goals.quickActions')}</Text>
        
        <View style={styles.actionsGrid}>
          <TouchableArea style={styles.actionCard}>
            <Text style={styles.actionIcon}>➕</Text>
            <Text style={styles.actionText}>{t('goals.addGoal')}</Text>
          </TouchableArea>
          
          <TouchableArea style={styles.actionCard}>
            <Text style={styles.actionIcon}>📊</Text>
            <Text style={styles.actionText}>{t('goals.trackProgress')}</Text>
          </TouchableArea>
          
          <TouchableArea style={styles.actionCard}>
            <Text style={styles.actionIcon}>💡</Text>
            <Text style={styles.actionText}>{t('goals.getTips')}</Text>
          </TouchableArea>
          
          <TouchableArea style={styles.actionCard}>
            <Text style={styles.actionIcon}>🔄</Text>
            <Text style={styles.actionText}>{t('goals.autoInvest')}</Text>
          </TouchableArea>
        </View>
      </View>
    </FadeInUp>
  );

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: isDarkMode ? '#1A1A1A' : '#E6FBF7' }]}>
        <StatusBar barStyle="light-content" backgroundColor={FiColors.background} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={FiColors.primary} />
          <Text style={styles.loadingText}>Loading your goals...</Text>
        </View>
      </View>
    );
  }

  const totalTarget = userGoals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const totalCurrent = userGoals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const overallProgress = totalTarget > 0 ? (totalCurrent / totalTarget) * 100 : 0;

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#1A1A1A' : '#E6FBF7' }]}>
      <StatusBar barStyle="light-content" backgroundColor={FiColors.background} />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentInsetAdjustmentBehavior="automatic">
        {/* Header */}
        <View style={[styles.header, { backgroundColor: isDarkMode ? '#1A1A1A' : '#E6FBF7' }]}>
          <Text style={[styles.headerTitle, { color: isDarkMode ? '#FFFFFF' : '#1A1A1A' }]}>Financial Goals</Text>
          <Text style={[styles.headerSubtitle, { color: isDarkMode ? '#FFFFFF' : '#1A1A1A' }]}>
            {userProfile?.name}'s goal tracking
          </Text>
        </View>

        {/* Goals Overview */}
        <View style={styles.overviewCard}>
          <Text style={styles.overviewTitle}>Goals Overview</Text>
          <View style={styles.overviewStats}>
            <View style={styles.overviewStat}>
              <Text style={styles.overviewValue}>{userGoals.length}</Text>
              <Text style={styles.overviewLabel}>Active Goals</Text>
            </View>
            <View style={styles.overviewStat}>
              <Text style={styles.overviewValue}>₹{(totalCurrent / 100000).toFixed(1)}L</Text>
              <Text style={styles.overviewLabel}>Saved</Text>
            </View>
            <View style={styles.overviewStat}>
              <Text style={styles.overviewValue}>₹{(totalTarget / 100000).toFixed(1)}L</Text>
              <Text style={styles.overviewLabel}>Target</Text>
            </View>
            <View style={styles.overviewStat}>
              <Text style={styles.overviewValue}>{Math.round(overallProgress)}%</Text>
              <Text style={styles.overviewLabel}>Progress</Text>
            </View>
          </View>
        </View>

        {/* Individual Goals */}
        <View style={styles.goalsSection}>
          <Text style={styles.sectionTitle}>Your Goals</Text>
          {userGoals.map((goal, index) => (
            <GoalCard 
              key={goal.goalId} 
              goal={goal} 
              bgColor={index % 2 === 0 ? '#FFFBF0' : '#F0F9FF'} 
            />
          ))}
        </View>

        {/* Upcoming Features Preview */}
        <View style={styles.upcomingSection}>
          <TouchableArea 
            style={styles.upcomingPreviewCard}
            onPress={() => setShowUpcomingFeatures(true)}
          >
            <View style={styles.upcomingHeader}>
              <Text style={styles.upcomingIcon}>🚀</Text>
              <View style={styles.upcomingInfo}>
                <Text style={styles.upcomingTitle}>Exciting Features Coming Soon!</Text>
                <Text style={styles.upcomingSubtitle}>
                  AI-powered goal management, voice commands, and more
                </Text>
              </View>
              <Text style={styles.upcomingArrow}>→</Text>
            </View>
            
            <View style={styles.upcomingFeaturesList}>
              <View style={styles.upcomingFeatureItem}>
                <Text>🤖 AI Goal Autopilot</Text>
                <Text style={styles.upcomingFeatureStatus}>Dev</Text>
              </View>
              <View style={styles.upcomingFeatureItem}>
                <Text>🎤 Voice Commands</Text>
                <Text style={styles.upcomingFeatureStatus}>Beta</Text>
              </View>
              <View style={styles.upcomingFeatureItem}>
                <Text>👥 Social Challenges</Text>
                <Text style={styles.upcomingFeatureStatus}>2026</Text>
              </View>
            </View>
          </TouchableArea>
        </View>

        {/* Upcoming Features Full Screen */}
        {showUpcomingFeatures && (
          <View style={styles.fullScreenModal}>
            <UpcomingFeatures navigation={navigation} onClose={() => setShowUpcomingFeatures(false)} />
          </View>
        )}

        {/* Cross-Screen Actions Modal */}
        {selectedGoalForActions && (
          <View style={styles.milestoneModal}>
            <View style={styles.milestoneModalContent}>
              <View style={styles.milestoneModalHeader}>
                <Text style={styles.milestoneModalTitle}>Goal Actions</Text>
                <TouchableArea 
                  style={styles.closeButton}
                  onPress={() => setSelectedGoalForActions(null)}
                >
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableArea>
              </View>
              
              <CrossScreenActions
                goalId={selectedGoalForActions.goalId}
                userGoals={userGoals}
                insights={crossScreenInsights}
                navigation={navigation}
              />
            </View>
          </View>
        )}

        {/* Milestone Tracker Modal */}
        {selectedGoalForMilestones && (
          <View style={styles.milestoneModal}>
            <View style={styles.milestoneModalContent}>
              <View style={styles.milestoneModalHeader}>
                <Text style={styles.milestoneModalTitle}>Goal Milestones</Text>
                <TouchableArea 
                  style={styles.closeButton}
                  onPress={() => setSelectedGoalForMilestones(null)}
                >
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableArea>
              </View>
              
              <MilestoneTracker
                goal={selectedGoalForMilestones}
                userProfile={userProfile}
                onMilestoneAchieved={(milestone) => {
                  console.log('Milestone achieved:', milestone);
                }}
              />
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E6FBF7',
    paddingTop: 50,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: FiColors.textSecondary,
  },
  goalsSection: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: FiColors.text,
    marginBottom: 16,
    marginLeft: 4,
  },
  goalPriority: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  goalProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
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
    backgroundColor: FiColors.primary,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: FiColors.text,
    minWidth: 40,
    textAlign: 'right',
  },
  goalStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 12,
  },
  goalStat: {
    alignItems: 'center',
  },
  goalStatValue: {
    fontSize: 16,
    fontWeight: '600',
    color: FiColors.text,
  },
  goalStatLabel: {
    fontSize: 12,
    color: FiColors.textSecondary,
    marginTop: 2,
  },
  goalFooter: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 12,
    alignItems: 'center',
  },
  monthlyContribution: {
    fontSize: 14,
    fontWeight: '600',
    color: FiColors.primary,
  },
  header: {
    backgroundColor: '#E6FBF7',
    paddingTop: 10,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#1A1A1A',
  },
  content: {
    flex: 1,
  },
  overviewCard: {
    backgroundColor: '#F0F9FF',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  overviewTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: FiColors.text,
    marginBottom: 16,
  },
  overviewStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  overviewStat: {
    alignItems: 'center',
  },
  overviewValue: {
    fontSize: 20,
    fontWeight: '700',
    color: FiColors.primary,
    marginBottom: 4,
  },
  overviewLabel: {
    fontSize: 14,
    color: FiColors.textSecondary,
  },
  section: {
    margin: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: FiColors.text,
    marginBottom: 16,
  },
  goalCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  goalTitleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  goalIcon: {
    fontSize: 20,
    marginRight: 10,
    marginTop: 2,
  },
  goalTitleContainer: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: FiColors.text,
    marginBottom: 2,
  },
  goalCategory: {
    fontSize: 12,
    color: FiColors.textSecondary,
  },
  goalProgressText: {
    fontSize: 16,
    fontWeight: '700',
    color: FiColors.primary,
    minWidth: 40,
    textAlign: 'right',
  },
  goalAmounts: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  goalCurrent: {
    fontSize: 20,
    fontWeight: '700',
    color: FiColors.text,
    marginRight: 6,
  },
  goalTarget: {
    fontSize: 14,
    color: FiColors.textSecondary,
  },
  progressBarContainer: {
    marginBottom: 12,
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: FiColors.border + '60',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: FiColors.primary,
    borderRadius: 3,
  },
  goalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  remainingAmount: {
    fontSize: 12,
    color: FiColors.textSecondary,
  },
  monthlyTarget: {
    fontSize: 12,
    fontWeight: '600',
    color: FiColors.primary,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: FiColors.primary,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: FiColors.primary + '20',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: FiColors.primary,
  },
  milestoneModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  milestoneModalContent: {
    backgroundColor: FiColors.surface,
    borderRadius: 16,
    margin: 20,
    maxHeight: '80%',
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  milestoneModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: FiColors.border,
  },
  milestoneModalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: FiColors.text,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: FiColors.border + '40',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: FiColors.textSecondary,
    fontWeight: '600',
  },
  
  // Upcoming Features Styles
  upcomingSection: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  upcomingPreviewCard: {
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: FiColors.primary + '40',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  upcomingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  upcomingIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  upcomingInfo: {
    flex: 1,
  },
  upcomingTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: FiColors.text,
    marginBottom: 4,
  },
  upcomingSubtitle: {
    fontSize: 14,
    color: FiColors.textSecondary,
    lineHeight: 20,
  },
  upcomingArrow: {
    fontSize: 24,
    color: FiColors.primary,
    fontWeight: '600',
  },
  upcomingFeaturesList: {
    gap: 8,
  },
  upcomingFeatureItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: FiColors.border + '40',
  },
  upcomingFeatureStatus: {
    fontSize: 10,
    fontWeight: '600',
    color: FiColors.primary,
    backgroundColor: FiColors.primary + '20',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    minWidth: 35,
    textAlign: 'center',
  },
  
  // Full Screen Modal Styles
  fullScreenModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: FiColors.background,
    zIndex: 2000,
  },
  fullScreenHeader: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: FiColors.surface,
    borderBottomWidth: 1,
    borderBottomColor: FiColors.border,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: FiColors.primary + '20',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: FiColors.primary,
  },
  impactCard: {
    backgroundColor: '#FFF3E0',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#FFB74D',
  },
  impactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  impactIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  impactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: FiColors.text,
    marginBottom: 2,
  },
  impactSubtitle: {
    fontSize: 14,
    color: FiColors.textSecondary,
  },
  impactContent: {
    marginBottom: 16,
  },
  impactItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  impactLabel: {
    fontSize: 14,
    color: FiColors.textSecondary,
  },
  impactValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F57C00',
  },
  adjustButton: {
    backgroundColor: '#FF9800',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  adjustButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  quickActionsSection: {
    margin: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    backgroundColor: '#FFFBF0',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    color: FiColors.text,
  },
  infoSection: {
    backgroundColor: '#E6FBF7',
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  infoLabel: {
    fontSize: 14,
    color: '#1A1A1A',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
});

export default GoalsScreen;
