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
  const { cardId, userId } = route.params;
  const { isDarkMode } = useTheme();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [portfolio, setPortfolio] = useState(null);
  const [assetAllocation, setAssetAllocation] = useState(null);
  const [returns, setReturns] = useState(null);
  const [goalRecommendations, setGoalRecommendations] = useState([]);
  const [existingGoals, setExistingGoals] = useState([]);
  const [insightsActions, setInsightsActions] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Set the current user from params or fallback to DataService
    const user = userId || DataService.getCurrentUser() || '1010101010';
    console.log('MetricDetailScreen: Setting user to', user);
    setCurrentUser(user);
    DataService.setCurrentUser(user);
  }, [userId]);

  useEffect(() => {
    if (currentUser) {
      loadMetricData();
    }
  }, [currentUser]);

  // Reload data when screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('MetricDetailScreen: Screen focused, reloading data');
      if (currentUser) {
        loadMetricData();
      }
    });
    return unsubscribe;
  }, [navigation, currentUser]);

  const loadMetricData = async () => {
    try {
      setLoading(true);
      console.log('MetricDetailScreen: Loading data for user', currentUser);
      
      if (!currentUser) {
        console.error('MetricDetailScreen: No current user set');
        return;
      }
      
      // Load comprehensive data for metrics
      const [userDataResult, portfolioResult, allocationResult, returnsResult, goals, profile] = await Promise.all([
        DataService.getUserData(currentUser),
        DataService.getUserPortfolio(currentUser),
        DataService.getUserAssetAllocation(currentUser),
        DataService.getUserReturns(currentUser),
        DataService.getUserGoals(currentUser),
        DataService.getUserProfile(currentUser)
      ]);
      
      console.log('MetricDetailScreen: Loaded data for', profile?.name, 'Portfolio:', portfolioResult?.totalValue);
      console.log('MetricDetailScreen: Full data loaded:', {
        user: currentUser,
        profile: profile?.name,
        portfolioValue: portfolioResult?.totalValue,
        netWorth: userDataResult?.netWorth?.netWorth,
        returns: returnsResult?.overallReturnPercentage
      });
      
      // Generate goal recommendations from metrics
      const metricData = {
        averageReturns: returnsResult.overallReturnPercentage || 12,
        monthlyInvestment: portfolioResult.monthlyInvestment || 0,
        portfolioDiversification: allocationResult.diversificationScore || 0.6,
        currentPortfolioValue: portfolioResult.totalValue || 0,
        currentRetirementFund: portfolioResult.retirementFund || 0
      };
      
      let recommendations = GoalRecommendationEngine.getGoalRecommendationsFromMetrics(
        metricData,
        profile,
        goals
      );
      
      // Fallback recommendations if none generated
      if (!recommendations || recommendations.length === 0) {
        recommendations = [
          {
            goalId: 'emergency_fund_' + Date.now(),
            title: 'Build Emergency Fund',
            description: 'Create a safety net of 6 months expenses',
            targetAmount: 300000,
            currentAmount: 0,
            monthlyContribution: 25000,
            timeToComplete: 12,
            priority: 'high',
            category: 'emergency',
            confidence: 0.9,
            reasoning: 'Based on your current expenses',
            icon: '🛡️',
            status: 'pending',
            type: 'emergency_fund',
            impact: 'Improved financial security and peace of mind',
            source: 'spending_analysis'
          }
        ];
      }
      
      console.log('Generated recommendations:', recommendations.length);
      
      // Generate insights actions for this metric
      const actions = MetricInsightsIntegration.getInsightsActions(cardId, metricData, profile);
      
      setUserData(userDataResult);
      setPortfolio(portfolioResult);
      setAssetAllocation(allocationResult);
      setReturns(returnsResult);
      setGoalRecommendations(recommendations);
      setExistingGoals(goals);
      setInsightsActions(actions);
      
      console.log('✅ MetricDetailScreen: All data loaded successfully');
      
    } catch (error) {
      console.error('❌ MetricDetailScreen: Error loading metric data:', error);
      // Set fallback data to prevent blank screen
      if (!userData) {
        setUserData({ netWorth: { netWorth: 0 } });
      }
      if (!portfolio) {
        setPortfolio({ totalValue: 0, mutualFunds: [], stocks: [], goldInvestments: [] });
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle adding recommended goal
  const handleAddGoal = async (recommendation) => {
    try {
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
    
    navigation.navigate('MainTabs', {
      screen: 'Insights',
      params: {
        ...action.params,
        metricContext: metricContext,
        fromMetric: cardId,
        actionId: action.id
      }
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
        value: `${(() => {
          if (!userData?.monthlySpending) return '8.5';
          const spending = userData.monthlySpending;
          const totalSpending = Object.values(spending).reduce((a, b) => a + b, 0);
          const categoryInflation = { housing: 6.2, food: 12.8, transport: 9.4, entertainment: 8.1, miscellaneous: 7.3, investments: 0 };
          let weightedInflation = 0;
          Object.entries(spending).forEach(([category, amount]) => {
            const weight = amount / totalSpending;
            const rate = categoryInflation[category] || 8.0;
            weightedInflation += weight * rate;
          });
          return (Math.round(weightedInflation * 10) / 10).toFixed(1);
        })()}%`,
        description: 'Your personal inflation rate based on spending patterns',
        details: [
          { label: 'Food & Beverages', value: '12.8%', impact: 'High' },
          { label: 'Housing', value: '6.2%', impact: 'Medium' },
          { label: 'Transportation', value: '9.4%', impact: 'High' },
          { label: 'Entertainment', value: '8.1%', impact: 'Medium' },
        ],
        color: FiColors.error,
        icon: '📈'
      },
      salary_impact: {
        title: 'Salary Impact',
        value: `₹${Math.round((userData.monthlySpending ? Object.values(userData.monthlySpending).reduce((a,b) => a+b, 0) : 45000) * (userData.personalInflationRate || 8.2) / 100).toLocaleString()}`,
        description: 'Additional monthly income needed to maintain your current lifestyle',
        details: [
          { label: 'Current Monthly Expenses', value: `₹${(userData.monthlySpending ? Object.values(userData.monthlySpending).reduce((a,b) => a+b, 0) : 45000).toLocaleString()}` },
          { label: 'Inflation Adjusted', value: `₹${Math.round((userData.monthlySpending ? Object.values(userData.monthlySpending).reduce((a,b) => a+b, 0) : 45000) * (1 + (userData.personalInflationRate || 8.2)/100)).toLocaleString()}` },
          { label: 'Additional Required', value: `₹${Math.round((userData.monthlySpending ? Object.values(userData.monthlySpending).reduce((a,b) => a+b, 0) : 45000) * (userData.personalInflationRate || 8.2) / 100).toLocaleString()}` },
          { label: 'Annual Impact', value: `₹${Math.round((userData.monthlySpending ? Object.values(userData.monthlySpending).reduce((a,b) => a+b, 0) : 45000) * (userData.personalInflationRate || 8.2) / 100 * 12).toLocaleString()}` },
        ],
        color: FiColors.warning,
        icon: '💼'
      },
      investment_target: {
        title: 'Investment Target',
        value: `${(() => {
          let personalInflation = 8.5;
          if (userData?.monthlySpending) {
            const spending = userData.monthlySpending;
            const totalSpending = Object.values(spending).reduce((a, b) => a + b, 0);
            const categoryInflation = { housing: 6.2, food: 12.8, transport: 9.4, entertainment: 8.1, miscellaneous: 7.3, investments: 0 };
            let weightedInflation = 0;
            Object.entries(spending).forEach(([category, amount]) => {
              const weight = amount / totalSpending;
              const rate = categoryInflation[category] || 8.0;
              weightedInflation += weight * rate;
            });
            personalInflation = Math.round(weightedInflation * 10) / 10;
          }
          return (personalInflation + 4).toFixed(1);
        })()}%`,
        description: 'Minimum returns needed to beat your personal inflation rate',
        details: [
          { label: 'Your Inflation Rate', value: `${(() => {
            let personalInflation = 8.5;
            if (userData?.monthlySpending) {
              const spending = userData.monthlySpending;
              const totalSpending = Object.values(spending).reduce((a, b) => a + b, 0);
              const categoryInflation = { housing: 6.2, food: 12.8, transport: 9.4, entertainment: 8.1, miscellaneous: 7.3, investments: 0 };
              let weightedInflation = 0;
              Object.entries(spending).forEach(([category, amount]) => {
                const weight = amount / totalSpending;
                const rate = categoryInflation[category] || 8.0;
                weightedInflation += weight * rate;
              });
              personalInflation = Math.round(weightedInflation * 10) / 10;
            }
            return personalInflation.toFixed(1);
          })()}%` },
          { label: 'Tax Impact (30%)', value: '2.5%' },
          { label: 'Real Return Buffer', value: '4.0%' },
          { label: 'Target Return', value: `${(() => {
            let personalInflation = 8.5;
            if (userData?.monthlySpending) {
              const spending = userData.monthlySpending;
              const totalSpending = Object.values(spending).reduce((a, b) => a + b, 0);
              const categoryInflation = { housing: 6.2, food: 12.8, transport: 9.4, entertainment: 8.1, miscellaneous: 7.3, investments: 0 };
              let weightedInflation = 0;
              Object.entries(spending).forEach(([category, amount]) => {
                const weight = amount / totalSpending;
                const rate = categoryInflation[category] || 8.0;
                weightedInflation += weight * rate;
              });
              personalInflation = Math.round(weightedInflation * 10) / 10;
            }
            return (personalInflation + 4).toFixed(1);
          })()}%` },
        ],
        color: FiColors.success,
        icon: '🎯'
      },
      city_rank: {
        title: 'City Ranking',
        value: `#${(() => {
          const location = userData.profile?.location || 'Mumbai';
          const city = location.split(',')[0].trim();
          const cityRanks = { 'Mumbai': 1, 'Delhi': 2, 'Bangalore': 3, 'Chennai': 4, 'Pune': 5, 'Hyderabad': 6, 'Kolkata': 7, 'Ahmedabad': 8 };
          return cityRanks[city] || 9;
        })()}`,
        description: `${userData.profile?.location?.split(',')[0] || 'Your city'} ranks among major Indian cities by cost of living`,
        details: (() => {
          const location = userData.profile?.location || 'Mumbai';
          const userCity = location.split(',')[0].trim();
          const cityData = [
            { name: 'Mumbai', rank: 1, impact: 'Most Expensive', cost: '₹65,000/month' },
            { name: 'Delhi', rank: 2, impact: 'Very Expensive', cost: '₹58,000/month' },
            { name: 'Bangalore', rank: 3, impact: 'Expensive', cost: '₹52,000/month' },
            { name: 'Chennai', rank: 4, impact: 'Expensive', cost: '₹48,000/month' },
            { name: 'Pune', rank: 5, impact: 'Moderate', cost: '₹45,000/month' },
            { name: 'Hyderabad', rank: 6, impact: 'Moderate', cost: '₹42,000/month' },
            { name: 'Kolkata', rank: 7, impact: 'Affordable', cost: '₹38,000/month' },
            { name: 'Ahmedabad', rank: 8, impact: 'Affordable', cost: '₹35,000/month' }
          ];
          
          // Sort by rank and highlight user's city
          return cityData.map(city => ({
            label: city.name === userCity ? `🏠 ${city.name} (Your City)` : city.name,
            value: `#${city.rank}`,
            impact: city.name === userCity ? `${city.impact} • ${city.cost}` : city.impact,
            isUserCity: city.name === userCity
          }));
        })(),
        color: FiColors.primary,
        icon: '🏙️'
      },
      weekly_insight: {
        title: 'Weekly Insight',
        value: `+${((userData.monthlySpending?.food || 15000) / 50000 * 2.3).toFixed(1)}%`,
        description: 'Your food costs trend based on recent spending patterns',
        details: [
          { label: 'Vegetables', value: `+${((userData.monthlySpending?.food || 15000) / 15000 * 4.2).toFixed(1)}%`, impact: 'High' },
          { label: 'Fruits', value: `+${((userData.monthlySpending?.food || 15000) / 15000 * 1.8).toFixed(1)}%`, impact: 'Medium' },
          { label: 'Dairy', value: `+${((userData.monthlySpending?.food || 15000) / 15000 * 0.5).toFixed(1)}%`, impact: 'Low' },
          { label: 'Grains', value: `-${((userData.monthlySpending?.food || 15000) / 15000 * 0.2).toFixed(1)}%`, impact: 'Low' },
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
          <TouchableOpacity onPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.navigate('MainTabs')} style={styles.backButton}>
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
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: isDarkMode ? '#FFFFFF' : FiColors.text }]}>{metric.title}</Text>
          <Text style={[styles.headerSubtitle, { color: isDarkMode ? '#CCCCCC' : FiColors.textSecondary }]}>User: {currentUser}</Text>
        </View>
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
          <ScrollView 
            style={styles.detailsScrollView}
            showsVerticalScrollIndicator={true}
            nestedScrollEnabled={true}
          >
            {metric.details.map((detail, index) => (
              <View key={index} style={styles.detailItem}>
                <Text style={styles.detailLabel}>{detail.label}</Text>
                <Text style={styles.detailValue}>{detail.value}</Text>
                {detail.impact && (
                  <Text style={[styles.detailImpact, { 
                    color: detail.impact === 'High' || detail.impact === 'Positive' || detail.impact === 'Excellent' ? FiColors.success :
                          detail.impact === 'Medium' || detail.impact === 'Good' || detail.impact === 'Active' ? FiColors.warning :
                          detail.impact === 'Low' || detail.impact === 'Negative' || detail.impact === 'None' ? FiColors.error : 
                          detail.impact.includes('Most Expensive') || detail.impact.includes('Very Expensive') ? FiColors.error :
                          detail.impact.includes('Expensive') ? FiColors.warning :
                          detail.impact.includes('Moderate') ? FiColors.primary :
                          detail.impact.includes('Affordable') ? FiColors.success : FiColors.textSecondary,
                    backgroundColor: detail.isUserCity ? FiColors.primary + '20' : 'rgba(0,0,0,0.05)',
                    fontWeight: detail.isUserCity ? '700' : '600'
                  }]}>
                    {detail.impact}
                  </Text>
                )}
              </View>
            ))}
          </ScrollView>
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

        {/* Goal Recommendations from Metrics - Updated */}
        <View style={styles.recommendationsSection}>
          <View style={styles.recommendationsTitleContainer}>
            <Text style={styles.recommendationsEmoji}>💡</Text>
            <Text style={[styles.recommendationsTitle, { color: isDarkMode ? '#FFFFFF' : FiColors.text }]}>Recommended Goals</Text>
          </View>
          <Text style={styles.recommendationsSubtitle}>
            Based on your metrics
          </Text>
          {goalRecommendations.length > 0 ? (
            goalRecommendations.map(recommendation => (
              <GoalRecommendationCard
                key={recommendation.goalId}
                recommendation={recommendation}
                onAddGoal={handleAddGoal}
                onDismiss={handleDismissRecommendation}
              />
            ))
          ) : (
            <Text style={styles.noRecommendationsText}>No recommendations available for this metric</Text>
          )}
        </View>
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
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: FiColors.text,
  },
  headerSubtitle: {
    fontSize: 12,
    color: FiColors.textSecondary,
    marginTop: 2,
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
  detailsScrollView: {
    maxHeight: 300,
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
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    minHeight: 56,
  },
  detailLabel: {
    fontSize: 14,
    color: FiColors.textSecondary,
    flex: 1,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: FiColors.text,
    marginRight: 8,
    minWidth: 40,
    textAlign: 'right',
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
    marginBottom: 24,
  },
  recommendationsTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  recommendationsEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  recommendationsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: FiColors.text,
  },
  recommendationsSubtitle: {
    fontSize: 14,
    color: FiColors.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  noRecommendationsText: {
    fontSize: 14,
    color: FiColors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 20,
  },
});

export default MetricDetailScreen;