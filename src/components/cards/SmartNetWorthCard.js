import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';


const SmartNetWorthCard = ({ user, onChatRequest, size = 'medium' }) => {
  const [aiInsight, setAiInsight] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const styles = createStyles();

  useEffect(() => {
    loadAIInsight();
  }, [user]);

  const loadAIInsight = async () => {
    setIsLoading(true);
    try {
      const prompt = `
User profile:
- Net worth: ₹${user.netWorth?.netWorth || 0}
- Age: ${user.profile?.age || 'N/A'}
- Profession: ${user.profile?.profession}
- Monthly income: ₹${user.profile?.monthlyIncome || user.monthlyIncome}
- Risk profile: ${user.profile?.riskProfile}

Provide ONE growth strategy insight in 30 words.
Suggest specific Fi product if relevant for wealth building.
Focus on actionable advice for their age and profession.
`;

      const response = await fetch('https://deltaverse-api-gewdd6ergq-uc.a.run.app/api/v1/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: prompt,
          conversation_id: `networth-card-${user.userId}`,
          user_id: user.userId
        })
      });

      const data = await response.json();
      setAiInsight(data.message);
    } catch (error) {
      console.error('Failed to load AI insight:', error);
      setAiInsight('Tap to get wealth building advice');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChatPress = () => {
    const message = `My net worth is ₹${user.netWorth?.netWorth || 0} and I'm ${user.profile?.age || 'a'} year old ${user.profile?.profession}. How can I grow my wealth?`;
    onChatRequest?.(message);
  };

  const formatCurrency = (amount) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(0)}K`;
    return `₹${amount}`;
  };

  const getNetWorthGrowth = () => {
    // Mock growth calculation - in real app, this would come from historical data
    const monthlyIncome = user.profile?.monthlyIncome || user.monthlyIncome || 0;
    const netWorth = user.netWorth?.netWorth || 0;
    const ratio = netWorth / (monthlyIncome * 12);
    
    if (ratio > 5) return { growth: '+12.5%', status: 'excellent', color: '#51CF66' };
    if (ratio > 2) return { growth: '+8.2%', status: 'good', color: '#69DB7C' };
    if (ratio > 1) return { growth: '+5.1%', status: 'average', color: '#FFB347' };
    return { growth: '+2.3%', status: 'building', color: '#FF8787' };
  };

  const growthData = getNetWorthGrowth();

  const getAssetBreakdown = () => {
    const netWorth = user.netWorth || {};
    const totalNetWorth = netWorth.netWorth || 0;
    const total = netWorth.totalAssets || totalNetWorth;
    
    // If we have actual breakdown data, use it
    const breakdown = [
      { 
        label: 'Bank', 
        value: netWorth.bankAccounts || 0, 
        percentage: total ? ((netWorth.bankAccounts || 0) / total * 100).toFixed(0) : 0,
        color: '#4DABF7'
      },
      { 
        label: 'Investments', 
        value: (netWorth.mutualFunds || 0) + (netWorth.stocks || 0), 
        percentage: total ? (((netWorth.mutualFunds || 0) + (netWorth.stocks || 0)) / total * 100).toFixed(0) : 0,
        color: '#51CF66'
      },
      { 
        label: 'Other', 
        value: (netWorth.gold || 0) + (netWorth.nps || 0), 
        percentage: total ? (((netWorth.gold || 0) + (netWorth.nps || 0)) / total * 100).toFixed(0) : 0,
        color: '#FFD43B'
      }
    ].filter(item => item.value > 0);
    
    // If no breakdown available but we have net worth, create estimated breakdown
    if (breakdown.length === 0 && totalNetWorth > 0) {
      const monthlyIncome = user.profile?.monthlyIncome || user.monthlyIncome || 50000;
      return [
        { 
          label: 'Bank', 
          value: Math.floor(totalNetWorth * 0.4), 
          percentage: '40',
          color: '#4DABF7'
        },
        { 
          label: 'Investments', 
          value: Math.floor(totalNetWorth * 0.45), 
          percentage: '45',
          color: '#51CF66'
        },
        { 
          label: 'Other', 
          value: Math.floor(totalNetWorth * 0.15), 
          percentage: '15',
          color: '#FFD43B'
        }
      ];
    }
    
    return breakdown;
  };

  const assetBreakdown = getAssetBreakdown();

  return (
    <View style={[styles.card, styles[`${size}Card`]]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Net Worth</Text>
          <View style={styles.growthContainer}>
            <Text style={[styles.growthText, { color: growthData.color }]}>
              {growthData.growth}
            </Text>
            <Text style={styles.growthLabel}>this month</Text>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.chatButton}
          onPress={handleChatPress}
        >
          <Text style={styles.chatIcon}>💬</Text>
        </TouchableOpacity>
      </View>

      {/* Main Value */}
      <View style={styles.valueContainer}>
        <Text style={styles.netWorthValue}>
          {formatCurrency(user.netWorth?.netWorth || 0)}
        </Text>
        <Text style={styles.valueLabel}>Total Net Worth</Text>
        <Text style={styles.valueExplanation}>Assets minus liabilities</Text>
        <View style={styles.contextIndicator}>
          <Text style={styles.contextText}>
            {user.netWorth?.netWorth > (user.profile?.monthlyIncome * 12 * 2) 
              ? '🎯 Great progress!' 
              : '💪 Building wealth'}
          </Text>
        </View>
      </View>

      {/* Asset Breakdown */}
      {size !== 'small' && (
        <View style={styles.breakdownContainer}>
          <Text style={styles.breakdownTitle}>Your Wealth Distribution</Text>
          <View style={styles.breakdownBar}>
            {assetBreakdown.length > 0 ? (
              assetBreakdown.map((asset, index) => (
                <View
                  key={asset.label}
                  style={[
                    styles.breakdownSegment,
                    {
                      backgroundColor: asset.color,
                      flex: parseInt(asset.percentage) || 1
                    }
                  ]}
                />
              ))
            ) : (
              <View style={[styles.breakdownSegment, { backgroundColor: '#E0E0E0', flex: 1 }]} />
            )}
          </View>
          
          <View style={styles.breakdownLegend}>
            {assetBreakdown.length > 0 ? (
              assetBreakdown.map((asset, index) => (
                <View key={asset.label} style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: asset.color }]} />
                  <View style={styles.legendTextContainer}>
                    <Text style={styles.legendText}>
                      {asset.label} {asset.percentage}%
                    </Text>
                    <Text style={styles.legendValue}>
                      {formatCurrency(asset.value)}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#E0E0E0' }]} />
                <View style={styles.legendTextContainer}>
                  <Text style={styles.legendText}>No data available</Text>
                  <Text style={styles.legendValue}>Connect accounts to see breakdown</Text>
                </View>
              </View>
            )}
          </View>
        </View>
      )}

      {/* AI Insight */}
      <View style={styles.aiInsightContainer}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#00D4AA" />
            <Text style={styles.loadingText}>Analyzing wealth...</Text>
          </View>
        ) : (
          <TouchableOpacity 
            style={styles.aiInsightBubble}
            onPress={handleChatPress}
          >
            <Text style={styles.aiInsightIcon}>💡</Text>
            <Text style={styles.aiInsightText} numberOfLines={2}>
              {aiInsight || 'Tap for wealth building advice'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Quick Actions */}
      {size === 'large' && (
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => onChatRequest?.('How can I optimize my asset allocation?')}
          >
            <Text style={styles.actionText}>Optimize</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => onChatRequest?.('What Fi products can help grow my wealth?')}
          >
            <Text style={styles.actionText}>Fi Products</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const createStyles = () => StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  largeCard: {
    minHeight: 280,
  },
  mediumCard: {
    minHeight: 200,
  },
  smallCard: {
    minHeight: 140,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 6,
  },
  growthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  growthText: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 4,
  },
  growthLabel: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  chatButton: {
    backgroundColor: '#00D4AA',
    borderRadius: 18,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatIcon: {
    fontSize: 14,
  },
  valueContainer: {
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 16,
    backgroundColor: '#FAFBFC',
    borderRadius: 16,
    marginHorizontal: -4,
  },
  netWorthValue: {
    fontSize: 36,
    fontWeight: '300',
    color: '#1A1A1A',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  valueLabel: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '600',
    textAlign: 'center',
  },
  valueExplanation: {
    fontSize: 12,
    color: '#999999',
    textAlign: 'center',
    marginTop: 4,
    fontStyle: 'italic',
  },
  contextIndicator: {
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: '#E8F5E8',
    borderRadius: 12,
  },
  contextText: {
    fontSize: 12,
    color: '#2E7D32',
    fontWeight: '600',
    textAlign: 'center',
  },
  breakdownTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 12,
    textAlign: 'center',
  },
  legendTextContainer: {
    flex: 1,
  },
  legendValue: {
    fontSize: 11,
    color: '#999999',
    fontWeight: '500',
    marginTop: 2,
  },
  breakdownContainer: {
    marginBottom: 24,
    backgroundColor: '#FAFBFC',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: -4,
  },
  breakdownBar: {
    flexDirection: 'row',
    height: 10,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    backgroundColor: '#F5F5F5',
  },
  breakdownSegment: {
    height: '100%',
  },
  breakdownLegend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingTop: 4,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingHorizontal: 4,
    flex: 1,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
    marginTop: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 1,
  },
  legendText: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
  },
  aiInsightContainer: {
    marginBottom: 16,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
  },
  aiInsightBubble: {
    backgroundColor: '#F0F9FF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#00D4AA',
    shadowColor: '#00D4AA',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  aiInsightIcon: {
    fontSize: 16,
    marginRight: 10,
    marginTop: 2,
  },
  aiInsightText: {
    flex: 1,
    fontSize: 14,
    color: '#1A1A1A',
    lineHeight: 20,
    fontWeight: '500',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: '#00D4AA',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flex: 1,
    marginHorizontal: 2,
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default SmartNetWorthCard;
