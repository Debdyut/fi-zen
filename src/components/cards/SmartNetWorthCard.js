import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useThemedStyles } from '../../theme/useThemedStyles';

const SmartNetWorthCard = ({ user, onChatRequest, size = 'medium' }) => {
  const [aiInsight, setAiInsight] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const styles = useThemedStyles(createStyles);

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
    const total = netWorth.totalAssets || 0;
    
    return [
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
      </View>

      {/* Asset Breakdown */}
      {size !== 'small' && (
        <View style={styles.breakdownContainer}>
          <View style={styles.breakdownBar}>
            {assetBreakdown.map((asset, index) => (
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
            ))}
          </View>
          
          <View style={styles.breakdownLegend}>
            {assetBreakdown.map((asset, index) => (
              <View key={asset.label} style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: asset.color }]} />
                <Text style={styles.legendText}>
                  {asset.label} {asset.percentage}%
                </Text>
              </View>
            ))}
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

const createStyles = (theme) => StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
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
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
  },
  growthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  growthText: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 4,
  },
  growthLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
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
    marginBottom: 16,
  },
  netWorthValue: {
    fontSize: 36,
    fontWeight: '300',
    color: theme.colors.text,
    marginBottom: 4,
  },
  valueLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  breakdownContainer: {
    marginBottom: 16,
  },
  breakdownBar: {
    flexDirection: 'row',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  breakdownSegment: {
    height: '100%',
  },
  breakdownLegend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  legendText: {
    fontSize: 11,
    color: theme.colors.textSecondary,
  },
  aiInsightContainer: {
    marginBottom: 12,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 11,
    color: theme.colors.textSecondary,
  },
  aiInsightBubble: {
    backgroundColor: '#F0F9FF',
    borderRadius: 10,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#00D4AA',
  },
  aiInsightIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  aiInsightText: {
    flex: 1,
    fontSize: 12,
    color: '#1A1A1A',
    lineHeight: 16,
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
