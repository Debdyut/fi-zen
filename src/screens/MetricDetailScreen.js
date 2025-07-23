import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import DataService from '../services/DataService';
import GoalRecommendationEngine from '../utils/GoalRecommendationEngine';
import MetricInsightsIntegration from '../utils/MetricInsightsIntegration';
import { GoalRecommendationCard } from '../components/insights/GoalRecommendationCard';

const FiColors = {
  background: '#1A1A1A',
  surface: '#FFFFFF',
  primary: '#00D4AA',
  text: '#1A1A1A',
  textSecondary: '#666666',
  textInverse: '#FFFFFF',
  success: '#00D4AA',
  warning: '#FFB800',
  error: '#FF6B6B',
};

const MetricDetailScreen = ({ route, navigation }) => {
  const { cardId } = route.params;
  const { isDarkMode } = useTheme();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [portfolio, setPortfolio] = useState(null);
  const [assetAllocation, setAssetAllocation] = useState(null);
  const [returns, setReturns] = useState(null);
  const [goalRecommendations, setGoalRecommendations] = useState([]);
  const [existingGoals, setExistingGoals] = useState([]);
  const [insightsActions, setInsightsActions] = useState([]);

  useEffect(() => {
    loadMetricData();
  }, []);

  const loadMetricData = async () => {
    try {
      setLoading(true);
      const currentUser = DataService.getCurrentUser();
      
      // Load comprehensive data for metrics
      const [userDataResult, portfolioResult, allocationResult, returnsResult, goals, profile] = await Promise.all([
        DataService.getUserData(currentUser),
        DataService.getUserPortfolio(currentUser),
        DataService.getUserAssetAllocation(currentUser),
        DataService.getUserReturns(currentUser),
        DataService.getUserGoals(currentUser),
        DataService.getUserProfile(currentUser)
      ]);
      
      // Generate goal recommendations from metrics
      const metricData = {
        averageReturns: returnsResult.overallReturnPercentage || 12,
        monthlyInvestment: portfolioResult.monthlyInvestment || 0,
        portfolioDiversification: allocationResult.diversificationScore || 0.6,
        currentPortfolioValue: portfolioResult.totalValue || 0,
        currentRetirementFund: portfolioResult.retirementFund || 0
      };
      
      const recommendations = GoalRecommendationEngine.getGoalRecommendationsFromMetrics(
        metricData,
        profile,
        goals
      );
      
      // Generate insights actions for this metric
      const actions = MetricInsightsIntegration.getInsightsActions(cardId, metricData, profile);
      
      setUserData(userDataResult);
      setPortfolio(portfolioResult);
      setAssetAllocation(allocationResult);
      setReturns(returnsResult);
      setGoalRecommendations(recommendations);
      setExistingGoals(goals);
      setInsightsActions(actions);
      
    } catch (error) {
      console.error('Error loading metric data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle adding recommended goal
  const handleAddGoal = async (recommendation) => {
    try {
      const currentUser = DataService.getCurrentUser();
      await DataService.addUserGoal(currentUser, recommendation);
      
      navigation.navigate('Goals', { 
        newGoalAdded: recommendation.goalId,
        source: 'metrics_recommendation' 
      });
      
      setGoalRecommendations(prev => 
        prev.filter(rec => rec.goalId !== recommendation.goalId)
      );
      
    } catch (error) {
      console.error('Error adding goal:', error);
    }
  };

  // Handle dismissing recommendation
  const handleDismissRecommendation = (goalId) => {
    setGoalRecommendations(prev => 
      prev.filter(rec => rec.goalId !== goalId)
    );
  };

  // Handle navigation to Insights with context
  const handleNavigateToInsights = (action) => {
    const metricContext = MetricInsightsIntegration.getMetricContextForInsights(
      cardId, 
      { 
        totalValue: portfolio?.totalValue,
        overallReturnPercentage: returns?.overallReturnPercentage,
        equityPercentage: assetAllocation?.equity,
        cashPercentage: assetAllocation?.cash,
        diversificationScore: assetAllocation?.diversificationScore || 0.6
      }, 
      userData
    );
    
    navigation.navigate('Insights', {
      ...action.params,
      metricContext: metricContext,
      fromMetric: cardId,
      actionId: action.id
    });
  };

  const getMetricDetails = (id) => {
    if (!userData || !portfolio || !assetAllocation || !returns) {
      return { title: 'Loading...', value: '...', description: 'Loading data...', details: [] };
    }

    const metrics = {
      portfolio_value: {
        title: 'Portfolio Value',
        value: `₹${(portfolio.totalMutualFunds + portfolio.totalStocks + portfolio.totalGold).toLocaleString()}`,
        description: `Your total investment portfolio across ${portfolio.mutualFunds.length + portfolio.stocks.length + portfolio.goldInvestments.length} holdings`,
        details: [
          { label: 'Mutual Funds', value: `₹${portfolio.totalMutualFunds.toLocaleString()}`, impact: portfolio.mutualFunds.length > 0 ? 'Active' : 'None' },
          { label: 'Stocks', value: `₹${portfolio.totalStocks.toLocaleString()}`, impact: portfolio.stocks.length > 0 ? 'Active' : 'None' },
          { label: 'Gold', value: `₹${portfolio.totalGold.toLocaleString()}`, impact: portfolio.goldInvestments.length > 0 ? 'Active' : 'None' },
          { label: 'NPS', value: `₹${portfolio.npsAccount?.currentValue?.toLocaleString() || '0'}`, impact: portfolio.npsAccount ? 'Active' : 'None' },
        ],
        color: FiColors.success,
        icon: '💼'
      },
      asset_allocation: {
        title: 'Asset Allocation',
        value: `${assetAllocation.equity}% Equity`,
        description: `Your portfolio allocation across different asset classes`,
        details: [
          { label: 'Equity', value: `${assetAllocation.equity}%`, impact: assetAllocation.equity > 60 ? 'Aggressive' : assetAllocation.equity > 30 ? 'Moderate' : 'Conservative' },
          { label: 'Cash', value: `${assetAllocation.cash}%`, impact: assetAllocation.cash > 20 ? 'High' : 'Normal' },
          { label: 'Gold', value: `${assetAllocation.gold}%`, impact: assetAllocation.gold > 10 ? 'High' : 'Normal' },
          { label: 'NPS', value: `${assetAllocation.nps || 0}%`, impact: assetAllocation.nps > 0 ? 'Active' : 'None' },
        ],
        color: assetAllocation.equity > 60 ? FiColors.warning : FiColors.primary,
        icon: '🥧'
      },
      investment_returns: {
        title: 'Investment Returns',
        value: `${returns.overallReturnPercentage}%`,
        description: `Total returns of ₹${returns.totalReturns.toLocaleString()} across your investments`,
        details: [
          { label: 'Mutual Funds', value: `₹${returns.breakdown.mutualFunds.toLocaleString()}`, impact: returns.breakdown.mutualFunds > 0 ? 'Positive' : 'Negative' },
          { label: 'Stocks', value: `₹${returns.breakdown.stocks.toLocaleString()}`, impact: returns.breakdown.stocks > 0 ? 'Positive' : 'Negative' },
          { label: 'Gold', value: `₹${returns.breakdown.gold.toLocaleString()}`, impact: returns.breakdown.gold > 0 ? 'Positive' : 'Negative' },
          { label: 'Overall %', value: `${returns.overallReturnPercentage}%`, impact: returns.overallReturnPercentage > 12 ? 'Excellent' : returns.overallReturnPercentage > 8 ? 'Good' : 'Average' },
        ],
        color: returns.overallReturnPercentage > 0 ? FiColors.success : FiColors.error,
        icon: '📈'
      },
      net_worth: {
        title: 'Net Worth',
        value: `₹${userData.netWorth.netWorth.toLocaleString()}`,
        description: `Your total assets minus liabilities`,
        details: [
          { label: 'Total Assets', value: `₹${userData.netWorth.totalAssets.toLocaleString()}`, impact: 'Assets' },
          { label: 'Total Liabilities', value: `₹${userData.netWorth.totalLiabilities.toLocaleString()}`, impact: 'Liabilities' },
          { label: 'Bank Accounts', value: `₹${userData.netWorth.breakdown.bankAccounts.toLocaleString()}`, impact: 'Liquid' },
          { label: 'Investments', value: `₹${(userData.netWorth.breakdown.mutualFunds + userData.netWorth.breakdown.stocks).toLocaleString()}`, impact: 'Growth' },
        ],
        color: userData.netWorth.netWorth > 0 ? FiColors.success : FiColors.error,
        icon: '💰'
      },
      inflation_rate: {
        title: 'Your Inflation Rate',
        value: '8.2%',
        description: 'Your personal inflation rate is higher than the government rate of 6.5%',
        details: [
          { label: 'Food & Beverages', value: '9.1%', impact: 'High' },
          { label: 'Housing', value: '7.8%', impact: 'Medium' },
          { label: 'Transportation', value: '8.5%', impact: 'High' },
          { label: 'Healthcare', value: '6.2%', impact: 'Low' },
        ],
        color: FiColors.error,
        icon: '📈'
      },
      salary_impact: {
        title: 'Salary Impact',
        value: '₹11,800',
        description: 'Additional monthly income needed to maintain your current lifestyle',
        details: [
          { label: 'Current Monthly Expenses', value: '₹45,000' },
          { label: 'Inflation Adjusted', value: '₹56,800' },
          { label: 'Additional Required', value: '₹11,800' },
          { label: 'Annual Impact', value: '₹1,41,600' },
        ],
        color: FiColors.warning,
        icon: '💼'
      },
      investment_target: {
        title: 'Investment Target',
        value: '16.8%',
        description: 'Minimum returns needed to beat your personal inflation rate',
        details: [
          { label: 'Your Inflation Rate', value: '8.2%' },
          { label: 'Tax Impact (30%)', value: '2.5%' },
          { label: 'Real Return Buffer', value: '6.1%' },
          { label: 'Target Return', value: '16.8%' },
        ],
        color: FiColors.success,
        icon: '🎯'
      },
      city_rank: {
        title: 'City Ranking',
        value: '#2',
        description: 'Your city ranks as the 2nd most expensive for your lifestyle',
        details: [
          { label: 'Mumbai', value: '#1', impact: 'Most Expensive' },
          { label: 'Your City', value: '#2', impact: 'Very Expensive' },
          { label: 'Bangalore', value: '#3', impact: 'Expensive' },
          { label: 'Delhi', value: '#4', impact: 'Moderate' },
        ],
        color: FiColors.primary,
        icon: '🏙️'
      },
      weekly_insight: {
        title: 'Weekly Insight',
        value: '+2.3%',
        description: 'Your food costs increased this week due to vegetable price surge in Mumbai markets',
        details: [
          { label: 'Vegetables', value: '+4.2%', impact: 'High' },
          { label: 'Fruits', value: '+1.8%', impact: 'Medium' },
          { label: 'Dairy', value: '+0.5%', impact: 'Low' },
          { label: 'Grains', value: '-0.2%', impact: 'Low' },
        ],
        color: FiColors.warning,
        icon: '📊'
      }
    };
    return metrics[id] || metrics.portfolio_value;
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: isDarkMode ? '#1A1A1A' : '#F5F5F5' }]}>
        <View style={[styles.header, { backgroundColor: isDarkMode ? '#1A1A1A' : FiColors.surface }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={[styles.backIcon, { color: isDarkMode ? '#FFFFFF' : FiColors.text }]}>←</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: isDarkMode ? '#FFFFFF' : FiColors.text }]}>Loading...</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={FiColors.primary} />
          <Text style={styles.loadingText}>Loading metric data...</Text>
        </View>
      </View>
    );
  }

  const metric = getMetricDetails(cardId);

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#1A1A1A' : '#F5F5F5' }]}>
      <View style={[styles.header, { backgroundColor: isDarkMode ? '#1A1A1A' : FiColors.surface }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={[styles.backIcon, { color: isDarkMode ? '#FFFFFF' : FiColors.text }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: isDarkMode ? '#FFFFFF' : FiColors.text }]}>{metric.title}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.metricCard}>
          <Text style={styles.metricIcon}>{metric.icon}</Text>
          <Text style={[styles.metricValue, { color: metric.color }]}>{metric.value}</Text>
          <Text style={styles.metricDescription}>{metric.description}</Text>
        </View>

        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>Breakdown</Text>
          {metric.details.map((detail, index) => (
            <View key={index} style={styles.detailItem}>
              <Text style={styles.detailLabel}>{detail.label}</Text>
              <Text style={styles.detailValue}>{detail.value}</Text>
              {detail.impact && (
                <Text style={[styles.detailImpact, { 
                  color: detail.impact === 'High' || detail.impact === 'Positive' || detail.impact === 'Excellent' ? FiColors.success :
                        detail.impact === 'Medium' || detail.impact === 'Good' || detail.impact === 'Active' ? FiColors.warning :
                        detail.impact === 'Low' || detail.impact === 'Negative' || detail.impact === 'None' ? FiColors.error : FiColors.textSecondary
                }]}>
                  {detail.impact}
                </Text>
              )}
            </View>
          ))}
        </View>

        <View style={styles.actionSection}>
          {insightsActions.length > 0 && (
            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={() => handleNavigateToInsights(insightsActions[0])}
            >
              <Text style={styles.primaryButtonText}>{insightsActions[0].title}</Text>
            </TouchableOpacity>
          )}
          
          {insightsActions.length > 1 && (
            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={() => handleNavigateToInsights(insightsActions[1])}
            >
              <Text style={styles.secondaryButtonText}>{insightsActions[1].title}</Text>
            </TouchableOpacity>
          )}
          
          {insightsActions.length === 0 && (
            <>
              <TouchableOpacity style={styles.primaryButton}>
                <Text style={styles.primaryButtonText}>View Recommendations</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonText}>Share Insights</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Goal Recommendations from Metrics */}
        {goalRecommendations.length > 0 && (
          <View style={styles.recommendationsSection}>
            <Text style={styles.recommendationsTitle}>💡 Recommended Goals</Text>
            <Text style={styles.recommendationsSubtitle}>
              Based on your investment performance and metrics
            </Text>
            {goalRecommendations.map(recommendation => (
              <GoalRecommendationCard
                key={recommendation.goalId}
                recommendation={recommendation}
                onAddGoal={handleAddGoal}
                onDismiss={handleDismissRecommendation}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: FiColors.surface,
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: FiColors.text,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: FiColors.text,
  },
  placeholder: {
    width: 40,
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
  content: {
    flex: 1,
    padding: 16,
  },
  metricCard: {
    backgroundColor: FiColors.surface,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  metricIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  metricValue: {
    fontSize: 36,
    fontWeight: '300',
    marginBottom: 12,
  },
  metricDescription: {
    fontSize: 16,
    color: FiColors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  detailsSection: {
    backgroundColor: FiColors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: FiColors.text,
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  detailLabel: {
    fontSize: 14,
    color: FiColors.textSecondary,
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: FiColors.text,
    marginRight: 8,
  },
  detailImpact: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  actionSection: {
    gap: 12,
  },
  primaryButton: {
    backgroundColor: FiColors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: FiColors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: FiColors.primary,
  },
  recommendationsSection: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  recommendationsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: FiColors.text,
    marginBottom: 4,
  },
  recommendationsSubtitle: {
    fontSize: 14,
    color: FiColors.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },
});

export default MetricDetailScreen;