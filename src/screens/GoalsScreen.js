import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, ActivityIndicator } from 'react-native';
import { FadeInUp } from '../components/animations/AnimatedCard';
import { TouchableArea } from '../components/common/AccessibilityHelpers';
import { useLanguage } from '../localization/LanguageContext';
import { useTheme } from '../theme/ThemeContext';
import DataService from '../services/DataService';

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

  useEffect(() => {
    loadGoalsData();
  }, []);

  const loadGoalsData = async () => {
    try {
      setLoading(true);
      const currentUser = DataService.getCurrentUser();
      
      const [goals, profile, portfolioData, netWorthData] = await Promise.all([
        DataService.getUserGoals(currentUser),
        DataService.getUserProfile(currentUser),
        DataService.getUserPortfolio(currentUser),
        DataService.getUserNetWorth(currentUser)
      ]);
      
      // If no goals exist, generate realistic goals based on user profile
      const finalGoals = goals.length > 0 ? goals : generateRealisticGoals(profile, portfolioData, netWorthData);
      
      setUserGoals(finalGoals);
      setUserProfile(profile);
      setPortfolio(portfolioData);
      setNetWorth(netWorthData);
      
    } catch (error) {
      console.error('Error loading goals data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateRealisticGoals = (profile, portfolio, netWorth) => {
    const income = profile.monthlyIncome;
    const age = profile.age;
    const riskProfile = profile.riskProfile;
    
    const goals = [];
    
    // Emergency Fund Goal
    const emergencyTarget = income * 6; // 6 months of expenses
    const currentEmergency = Math.min(netWorth.breakdown.bankAccounts, emergencyTarget);
    goals.push({
      goalId: 'emergency_fund',
      title: 'Emergency Fund',
      targetAmount: emergencyTarget,
      currentAmount: currentEmergency,
      targetDate: new Date(Date.now() + 12 * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 year
      monthlyContribution: Math.max(5000, (emergencyTarget - currentEmergency) / 12),
      priority: 'high',
      status: 'active',
      icon: '🛡️',
      category: 'Safety'
    });

    // House Down Payment (if age < 35 and income > 80k)
    if (age < 35 && income > 80000) {
      const houseTarget = income * 24; // 2 years of income for down payment
      const currentHouse = Math.min(netWorth.breakdown.bankAccounts * 0.3, houseTarget * 0.5);
      goals.push({
        goalId: 'house_down_payment',
        title: 'House Down Payment',
        targetAmount: houseTarget,
        currentAmount: currentHouse,
        targetDate: new Date(Date.now() + 36 * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 years
        monthlyContribution: Math.max(10000, (houseTarget - currentHouse) / 36),
        priority: 'medium',
        status: 'active',
        icon: '🏠',
        category: 'Investment'
      });
    }

    // Retirement Goal (if age > 25)
    if (age > 25) {
      const retirementTarget = income * 12 * (65 - age) * 0.8; // 80% of income for remaining years
      const currentRetirement = portfolio.totalMutualFunds + portfolio.totalStocks;
      goals.push({
        goalId: 'retirement_fund',
        title: 'Retirement Fund',
        targetAmount: retirementTarget,
        currentAmount: currentRetirement,
        targetDate: new Date(Date.now() + (65 - age) * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        monthlyContribution: Math.max(15000, income * 0.15),
        priority: 'high',
        status: 'active',
        icon: '🏖️',
        category: 'Retirement'
      });
    }

    // Vacation Goal (if income > 100k)
    if (income > 100000) {
      const vacationTarget = income * 0.5; // 6 months of income for vacation
      goals.push({
        goalId: 'dream_vacation',
        title: 'Dream Vacation',
        targetAmount: vacationTarget,
        currentAmount: vacationTarget * 0.1,
        targetDate: new Date(Date.now() + 18 * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1.5 years
        monthlyContribution: Math.max(3000, vacationTarget / 18),
        priority: 'low',
        status: 'active',
        icon: '✈️',
        category: 'Lifestyle'
      });
    }

    return goals;
  };

  const GoalCard = ({ goal, bgColor }) => {
    const progress = (goal.currentAmount / goal.targetAmount) * 100;
    const remaining = goal.targetAmount - goal.currentAmount;
    
    return (
      <FadeInUp delay={100}>
        <TouchableArea style={[styles.goalCard, { backgroundColor: bgColor }]}>
          <View style={styles.goalHeader}>
            <View style={styles.goalTitleSection}>
              <Text style={styles.goalIcon}>{goal.icon}</Text>
              <View>
                <Text style={styles.goalTitle}>{goal.title}</Text>
                <Text style={styles.goalCategory}>{goal.category}</Text>
              </View>
            </View>
            <Text style={styles.goalProgress}>{Math.round(progress)}%</Text>
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
        </TouchableArea>
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
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
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
    borderRadius: 16,
    padding: 20,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalTitleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  goalIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: FiColors.text,
    marginBottom: 2,
  },
  goalCategory: {
    fontSize: 14,
    color: FiColors.textSecondary,
  },
  goalProgress: {
    fontSize: 18,
    fontWeight: '700',
    color: FiColors.primary,
  },
  goalAmounts: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  goalCurrent: {
    fontSize: 24,
    fontWeight: '700',
    color: FiColors.text,
    marginRight: 8,
  },
  goalTarget: {
    fontSize: 16,
    color: FiColors.textSecondary,
  },
  progressBarContainer: {
    marginBottom: 12,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: FiColors.border + '40',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: FiColors.primary,
    borderRadius: 4,
  },
  goalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  remainingAmount: {
    fontSize: 14,
    color: FiColors.textSecondary,
  },
  monthlyTarget: {
    fontSize: 14,
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
