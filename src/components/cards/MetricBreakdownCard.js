import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';

const MetricBreakdownCard = ({ user, size = 'large' }) => {
  const metric = user.currentMetric || {};
  const breakdown = getMetricBreakdown(metric.name, user);

  const getImpactColor = (impact) => {
    const colors = {
      'Excellent': '#51CF66',
      'Good': '#51CF66',
      'Positive': '#51CF66',
      'High': '#51CF66',
      'Medium': '#FFB800',
      'Average': '#FFB800',
      'Active': '#FFB800',
      'Low': '#FF6B6B',
      'Negative': '#FF6B6B',
      'Poor': '#FF6B6B',
      'Very Expensive': '#FF6B6B',
      'Expensive': '#FFB800',
      'Moderate': '#00D4AA',
      'Affordable': '#51CF66'
    };
    return colors[impact] || '#666666';
  };

  const getImpactBackground = (impact, isUserCity = false) => {
    if (isUserCity) return '#00D4AA20';
    return 'rgba(0,0,0,0.05)';
  };

  return (
    <View style={[styles.card, styles[`${size}Card`]]}>
      <Text style={styles.title}>Detailed Breakdown</Text>
      <Text style={styles.subtitle}>{breakdown.description}</Text>

      <ScrollView 
        style={styles.breakdownList}
        showsVerticalScrollIndicator={true}
        nestedScrollEnabled={true}
      >
        {breakdown.details.map((detail, index) => (
          <View key={index} style={styles.breakdownItem}>
            <View style={styles.breakdownHeader}>
              <Text style={styles.breakdownLabel}>{detail.label}</Text>
              <Text style={styles.breakdownValue}>{detail.value}</Text>
            </View>
            
            {detail.impact && (
              <View style={[
                styles.impactBadge,
                { 
                  backgroundColor: getImpactBackground(detail.impact, detail.isUserCity),
                }
              ]}>
                <Text style={[
                  styles.impactText,
                  { 
                    color: getImpactColor(detail.impact),
                    fontWeight: detail.isUserCity ? '700' : '600'
                  }
                ]}>
                  {detail.impact}
                </Text>
              </View>
            )}

            {detail.description && (
              <Text style={styles.breakdownDescription}>{detail.description}</Text>
            )}
          </View>
        ))}
      </ScrollView>

      {breakdown.summary && (
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Summary</Text>
          <Text style={styles.summaryText}>{breakdown.summary}</Text>
        </View>
      )}
    </View>
  );
};

// Helper function to get breakdown data based on metric type
const getMetricBreakdown = (metricName, user) => {
  switch (metricName) {
    case 'Net Worth':
      return {
        description: 'Your net worth components and their contribution',
        details: [
          { 
            label: 'Investment Portfolio', 
            value: `₹${(user.portfolio?.totalValue || 300000).toLocaleString()}`,
            impact: 'High',
            description: 'Mutual funds, stocks, and other investments'
          },
          { 
            label: 'Bank Savings', 
            value: `₹${(user.bankSavings || 150000).toLocaleString()}`,
            impact: 'Medium',
            description: 'Savings accounts and fixed deposits'
          },
          { 
            label: 'Real Estate', 
            value: `₹${(user.realEstate || 0).toLocaleString()}`,
            impact: user.realEstate > 0 ? 'High' : 'None',
            description: 'Property investments and home equity'
          },
          { 
            label: 'Liabilities', 
            value: `-₹${(user.netWorth?.totalLiabilities || 8000).toLocaleString()}`,
            impact: 'Low',
            description: 'Credit card debt, loans, and other liabilities'
          }
        ],
        summary: `Your net worth of ₹${(user.netWorth?.netWorth || 0).toLocaleString()} shows ${user.netWorth?.netWorth > 500000 ? 'strong' : 'growing'} financial health.`
      };

    case 'Investment Returns':
      return {
        description: 'Breakdown of returns across your investment portfolio',
        details: [
          { 
            label: 'Mutual Funds', 
            value: `₹${(user.returns?.breakdown?.mutualFunds || 25000).toLocaleString()}`,
            impact: user.returns?.breakdown?.mutualFunds > 0 ? 'Positive' : 'Negative'
          },
          { 
            label: 'Stocks', 
            value: `₹${(user.returns?.breakdown?.stocks || 15000).toLocaleString()}`,
            impact: user.returns?.breakdown?.stocks > 0 ? 'Positive' : 'Negative'
          },
          { 
            label: 'Gold', 
            value: `₹${(user.returns?.breakdown?.gold || 5000).toLocaleString()}`,
            impact: user.returns?.breakdown?.gold > 0 ? 'Positive' : 'Negative'
          },
          { 
            label: 'Overall Return %', 
            value: `${user.returns?.overallReturnPercentage || 12}%`,
            impact: (user.returns?.overallReturnPercentage || 12) > 15 ? 'Excellent' : 
                   (user.returns?.overallReturnPercentage || 12) > 10 ? 'Good' : 'Average'
          }
        ],
        summary: `Your portfolio is generating ${user.returns?.overallReturnPercentage || 12}% returns, ${(user.returns?.overallReturnPercentage || 12) > 12 ? 'above' : 'at'} market average.`
      };

    case 'Monthly Spending':
      const spending = user.monthlySpending || {};
      const totalSpending = Object.values(spending).reduce((a, b) => a + b, 0);
      return {
        description: 'Your monthly spending breakdown by category',
        details: Object.entries(spending).map(([category, amount]) => ({
          label: category.charAt(0).toUpperCase() + category.slice(1),
          value: `₹${amount.toLocaleString()}`,
          impact: amount / totalSpending > 0.3 ? 'High' : 
                 amount / totalSpending > 0.15 ? 'Medium' : 'Low',
          description: `${((amount / totalSpending) * 100).toFixed(1)}% of total spending`
        })),
        summary: `Total monthly spending: ₹${totalSpending.toLocaleString()}. ${totalSpending / (user.profile?.monthlyIncome || 50000) > 0.8 ? 'Consider optimizing' : 'Well managed'}.`
      };

    case 'Inflation Rate':
      const inflationBreakdown = calculatePersonalInflation(user);
      return {
        description: 'Your personal inflation rate based on spending patterns',
        details: inflationBreakdown.details,
        summary: `Your personal inflation rate is ${inflationBreakdown.rate}%, ${inflationBreakdown.rate > 6.5 ? 'above' : 'below'} national average.`
      };

    case 'City Ranking':
      return getCityRankingBreakdown(user);

    default:
      return {
        description: 'Detailed analysis of this metric',
        details: [
          { label: 'Current Value', value: `₹${(user.currentMetric?.value || 0).toLocaleString()}`, impact: 'Good' },
          { label: 'Target Value', value: `₹${(user.currentMetric?.target || 0).toLocaleString()}`, impact: 'Target' },
          { label: 'Progress', value: `${user.currentMetric?.progress || 0}%`, impact: 'Active' }
        ],
        summary: 'Continue tracking this metric for better financial insights.'
      };
  }
};

const calculatePersonalInflation = (user) => {
  const spending = user.monthlySpending || {};
  const inflationRates = {
    housing: 8.2,
    food: 9.1,
    transport: 7.8,
    entertainment: 6.5,
    utilities: 8.5,
    healthcare: 7.2,
    miscellaneous: 7.0
  };

  const totalSpending = Object.values(spending).reduce((a, b) => a + b, 0);
  let weightedInflation = 0;

  const details = Object.entries(spending).map(([category, amount]) => {
    const weight = amount / totalSpending;
    const rate = inflationRates[category] || 7.0;
    weightedInflation += weight * rate;
    
    return {
      label: category.charAt(0).toUpperCase() + category.slice(1),
      value: `${rate}%`,
      impact: rate > 8 ? 'High' : rate > 7 ? 'Medium' : 'Low',
      description: `Weight: ${(weight * 100).toFixed(1)}% of spending`
    };
  });

  return {
    rate: (Math.round(weightedInflation * 10) / 10).toFixed(1),
    details
  };
};

const getCityRankingBreakdown = (user) => {
  const location = user.profile?.location || 'Mumbai, Maharashtra';
  const userCity = location.split(',')[0].trim();
  
  const cityData = [
    { name: 'Mumbai', rank: 1, cost: 'Very Expensive' },
    { name: 'Delhi', rank: 2, cost: 'Very Expensive' },
    { name: 'Bangalore', rank: 3, cost: 'Expensive' },
    { name: 'Chennai', rank: 4, cost: 'Expensive' },
    { name: 'Pune', rank: 5, cost: 'Moderate' },
    { name: 'Hyderabad', rank: 6, cost: 'Moderate' },
    { name: 'Kolkata', rank: 7, cost: 'Affordable' },
    { name: 'Ahmedabad', rank: 8, cost: 'Affordable' }
  ];

  return {
    description: `Cost of living ranking among major Indian cities`,
    details: cityData.map(city => ({
      label: city.name === userCity ? `🏠 ${city.name} (Your City)` : city.name,
      value: `#${city.rank}`,
      impact: city.cost,
      isUserCity: city.name === userCity
    })),
    summary: `${userCity} ranks #${cityData.find(c => c.name === userCity)?.rank || 9} among major cities for cost of living.`
  };
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 16,
  },
  largeCard: {
    minHeight: 400,
  },
  mediumCard: {
    minHeight: 300,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 20,
  },
  breakdownList: {
    maxHeight: 300,
    marginBottom: 16,
  },
  breakdownItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  breakdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  breakdownLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A',
    flex: 1,
  },
  breakdownValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  impactBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  impactText: {
    fontSize: 12,
    fontWeight: '600',
  },
  breakdownDescription: {
    fontSize: 12,
    color: '#666666',
    fontStyle: 'italic',
  },
  summaryContainer: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 13,
    color: '#666666',
    lineHeight: 18,
  },
});

export default MetricBreakdownCard;
