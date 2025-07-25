import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useThemedStyles } from '../../theme/useThemedStyles';

const SmartInflationCard = ({ user, onChatRequest, size = 'large' }) => {
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
User's personal inflation: ${user.personalInflation || 'N/A'}%
Government inflation: 6.5%
User income: ₹${user.profile?.monthlyIncome || user.monthlyIncome}
Location: ${user.profile?.location}
Profession: ${user.profile?.profession}

Provide ONE actionable insight in 25 words about inflation impact.
Include specific Fi product recommendation if relevant.
Focus on practical advice for their income level.
`;

      const response = await fetch('https://deltaverse-api-gewdd6ergq-uc.a.run.app/api/v1/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: prompt,
          conversation_id: `inflation-card-${user.userId}`,
          user_id: user.userId
        })
      });

      const data = await response.json();
      setAiInsight(data.message);
    } catch (error) {
      console.error('Failed to load AI insight:', error);
      setAiInsight('Tap to get personalized inflation advice');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChatPress = () => {
    const message = `My personal inflation is ${user.personalInflation}% vs government's 6.5%. How does this impact my ₹${user.profile?.monthlyIncome || user.monthlyIncome} monthly income?`;
    onChatRequest?.(message);
  };

  const getInflationStatus = () => {
    const personalRate = user.personalInflation || 0;
    const govRate = 6.5;
    
    if (personalRate > govRate + 2) return { status: 'high', color: '#FF6B6B' };
    if (personalRate > govRate) return { status: 'above', color: '#FFB347' };
    return { status: 'good', color: '#51CF66' };
  };

  const inflationStatus = getInflationStatus();

  return (
    <View style={[styles.card, styles[`${size}Card`]]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Personal Inflation</Text>
          <Text style={styles.subtitle}>vs Government Rate</Text>
        </View>
        <TouchableOpacity 
          style={styles.chatButton}
          onPress={handleChatPress}
        >
          <Text style={styles.chatIcon}>💬</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <View style={styles.inflationComparison}>
          <View style={styles.rateContainer}>
            <Text style={[styles.rateValue, { color: inflationStatus.color }]}>
              {user.personalInflation?.toFixed(1) || 'N/A'}%
            </Text>
            <Text style={styles.rateLabel}>Your Rate</Text>
          </View>
          
          <View style={styles.vsContainer}>
            <Text style={styles.vsText}>vs</Text>
          </View>
          
          <View style={styles.rateContainer}>
            <Text style={styles.govRate}>6.5%</Text>
            <Text style={styles.rateLabel}>Govt Rate</Text>
          </View>
        </View>

        {/* Status Indicator */}
        <View style={[styles.statusBadge, { backgroundColor: inflationStatus.color }]}>
          <Text style={styles.statusText}>
            {inflationStatus.status === 'high' && '⚠️ High Impact'}
            {inflationStatus.status === 'above' && '📈 Above Average'}
            {inflationStatus.status === 'good' && '✅ Under Control'}
          </Text>
        </View>
      </View>

      {/* AI Insight */}
      <View style={styles.aiInsightContainer}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#00D4AA" />
            <Text style={styles.loadingText}>Getting AI insights...</Text>
          </View>
        ) : (
          <TouchableOpacity 
            style={styles.aiInsightBubble}
            onPress={handleChatPress}
          >
            <Text style={styles.aiInsightIcon}>🤖</Text>
            <Text style={styles.aiInsightText} numberOfLines={2}>
              {aiInsight || 'Tap for personalized advice'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => onChatRequest?.('How can I reduce my personal inflation rate?')}
        >
          <Text style={styles.actionText}>Reduce Impact</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => onChatRequest?.('What Fi products can help with inflation protection?')}
        >
          <Text style={styles.actionText}>Fi Solutions</Text>
        </TouchableOpacity>
      </View>
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
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  chatButton: {
    backgroundColor: '#00D4AA',
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatIcon: {
    fontSize: 16,
  },
  content: {
    flex: 1,
  },
  inflationComparison: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  rateContainer: {
    alignItems: 'center',
    flex: 1,
  },
  rateValue: {
    fontSize: 32,
    fontWeight: '300',
    marginBottom: 4,
  },
  govRate: {
    fontSize: 32,
    fontWeight: '300',
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  rateLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  vsContainer: {
    paddingHorizontal: 16,
  },
  vsText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  statusBadge: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'center',
    marginBottom: 16,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  aiInsightContainer: {
    marginBottom: 16,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  aiInsightBubble: {
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#00D4AA',
  },
  aiInsightIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  aiInsightText: {
    flex: 1,
    fontSize: 13,
    color: '#1A1A1A',
    lineHeight: 18,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: '#00D4AA',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default SmartInflationCard;
