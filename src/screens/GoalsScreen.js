import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { FadeInUp } from '../components/animations/AnimatedCard';
import { TouchableArea } from '../components/common/AccessibilityHelpers';
import { useLanguage } from '../localization/LanguageContext';
import { useTheme } from '../theme/ThemeContext';

const FiColors = {
  background: '#1A1A1A',
  surface: '#FFFFFF',
  primary: '#00D4AA',
  text: '#1A1A1A',
  textSecondary: '#666666',
  textInverse: '#FFFFFF',
  border: '#E0E0E0',
};

const GoalsScreen = ({ navigation }) => {
  const { t } = useLanguage();
  const { isDarkMode } = useTheme();
  const [activeGoals, setActiveGoals] = useState([
    {
      id: 1,
      title: t('goals.emergencyFund'),
      target: 500000,
      current: 125000,
      icon: '🛡️',
      category: t('goals.safety'),
      deadline: `6 ${t('goals.months')}`,
      monthlyTarget: 62500,
    },
    {
      id: 2,
      title: t('goals.houseDownPayment'),
      target: 2000000,
      current: 450000,
      icon: '🏠',
      category: t('goals.investment'),
      deadline: `2 ${t('goals.years')}`,
      monthlyTarget: 64583,
    },
    {
      id: 3,
      title: t('goals.vacationFund'),
      target: 150000,
      current: 35000,
      icon: '✈️',
      category: t('goals.lifestyle'),
      deadline: `8 ${t('goals.months')}`,
      monthlyTarget: 14375,
    },
  ]);

  const GoalCard = ({ goal, bgColor }) => {
    const progress = (goal.current / goal.target) * 100;
    const remaining = goal.target - goal.current;
    
    return (
      <FadeInUp delay={100}>
        <TouchableArea style={[styles.goalCard, { backgroundColor: bgColor }]}>
          <View style={styles.goalHeader}>
            <View style={styles.goalTitleSection}>
              <Text style={styles.goalIcon}>{goal.icon}</Text>
              <View>
                <Text style={styles.goalTitle}>{goal.title}</Text>
                <Text style={styles.goalCategory}>{goal.category} • {goal.deadline}</Text>
              </View>
            </View>
            <Text style={styles.goalProgress}>{progress.toFixed(0)}%</Text>
          </View>
          
          <View style={styles.goalAmounts}>
            <Text style={styles.goalCurrent}>₹{goal.current.toLocaleString()}</Text>
            <Text style={styles.goalTarget}>of ₹{goal.target.toLocaleString()}</Text>
          </View>
          
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarBackground}>
              <View 
                style={[styles.progressBarFill, { width: `${Math.min(progress, 100)}%` }]}
              />
            </View>
          </View>
          
          <View style={styles.goalFooter}>
            <Text style={styles.remainingAmount}>₹{remaining.toLocaleString()} {t('goals.remaining')}</Text>
            <Text style={styles.monthlyTarget}>₹{goal.monthlyTarget.toLocaleString()}/{t('goals.month')}</Text>
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

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#1A1A1A' : '#E6FBF7' }]}>
      <StatusBar barStyle="light-content" backgroundColor={FiColors.background} />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: isDarkMode ? '#1A1A1A' : '#E6FBF7' }]}>
          <Text style={[styles.headerTitle, { color: isDarkMode ? '#FFFFFF' : '#1A1A1A' }]}>{t('goals.title')}</Text>
          <Text style={[styles.headerSubtitle, { color: isDarkMode ? '#FFFFFF' : '#1A1A1A' }]}>{t('goals.subtitle')}</Text>
        </View>
        {/* Goal Summary */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>{t('goals.goalSummary')}</Text>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>{t('goals.vacationFund')}</Text>
            <Text style={styles.infoValue}>₹35,000 of ₹1.5L (23%)</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>{t('goals.totalProgress')}</Text>
            <Text style={styles.infoValue}>30% across all goals</Text>
          </View>
        </View>

        {/* Goals Overview */}
        <View style={styles.overviewCard}>
          <Text style={styles.overviewTitle}>{t('goals.goalsOverview')}</Text>
          <View style={styles.overviewStats}>
            <View style={styles.overviewStat}>
              <Text style={styles.overviewValue}>{activeGoals.length}</Text>
              <Text style={styles.overviewLabel}>{t('goals.activeGoals')}</Text>
            </View>
            <View style={styles.overviewStat}>
              <Text style={styles.overviewValue}>₹6.1L</Text>
              <Text style={styles.overviewLabel}>{t('goals.saved')}</Text>
            </View>
            <View style={styles.overviewStat}>
              <Text style={styles.overviewValue}>₹20.4L</Text>
              <Text style={styles.overviewLabel}>{t('goals.target')}</Text>
            </View>
          </View>
        </View>

        {/* Active Goals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('goals.yourGoals')}</Text>
          {activeGoals.slice(0, 2).map((goal, index) => {
            const colors = ['#F0FFF4', '#FFF5F5'];
            return (
              <GoalCard key={goal.id} goal={goal} bgColor={colors[index % colors.length]} />
            );
          })}
        </View>

        {/* Inflation Impact */}
        <View style={styles.section}>
          <InflationImpactCard />
        </View>

        {/* Quick Actions */}
        <QuickActions />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E6FBF7',
  },
  content: {
    flex: 1,
  },
  header: {
    backgroundColor: '#E6FBF7',
    paddingTop: 50,
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
