import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { FadeInUp } from '../animations/AnimatedCard';
import AnalyticsEngine from '../../utils/AnalyticsEngine';
import { useTheme } from '../../theme/ThemeContext';
import { getThemeColors } from '../../theme/consolidatedFiColors';

const SpendingTrendsCard = ({ userProfile, spendingData }) => {
  const [activeTab, setActiveTab] = useState('categories');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);
  
  const analytics = AnalyticsEngine.analyzeSpendingTrends(userProfile, spendingData);
  
  // Get trend color and icon
  const getTrendDisplay = (trend) => {
    const displays = {
      increasing: { color: colors.error, icon: '📈', text: 'Increasing' },
      decreasing: { color: colors.success, icon: '📉', text: 'Decreasing' },
      stable: { color: colors.primary, icon: '➡️', text: 'Stable' }
    };
    return displays[trend.direction] || displays.stable;
  };

  // Get volatility color
  const getVolatilityColor = (level) => {
    const volatilityColors = {
      high: colors.error,
      moderate: colors.warning,
      low: colors.success
    };
    return volatilityColors[level] || colors.primary;
  };

  const trendDisplay = getTrendDisplay(analytics.trend);

  // Enhanced Mini Trend Chart (simplified)
  const TrendChart = () => {
    const data = [65, 70, 68, 75, 72, 78]; // Mock 6-month data
    const maxValue = Math.max(...data);
    
    return (
      <View style={styles.trendChart}>
        {data.map((value, index) => {
          const height = (value / maxValue) * 40; // Max height 40
          return (
            <View key={index} style={styles.trendColumn}>
              <View 
                style={[
                  styles.trendBar, 
                  { 
                    height: height,
                    backgroundColor: trendDisplay.color
                  }
                ]} 
              />
            </View>
          );
        })}
      </View>
    );
  };

  const handleQuickAction = (action) => {
    console.log('Quick action:', action);
  };

  const TabButton = ({ id, title, active, onPress }) => (
    <TouchableOpacity
      style={[styles.tabButton, active && styles.activeTab]}
      onPress={() => onPress(id)}
    >
      <Text style={[styles.tabText, active && styles.activeTabText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const TrendsTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.metricRow}>
        <Text style={styles.metricLabel}>Spending Trend</Text>
        <View style={styles.trendContainer}>
          <Text style={styles.trendIcon}>{trendDisplay.icon}</Text>
          <Text style={[styles.trendText, { color: trendDisplay.color }]}>
            {trendDisplay.text}
          </Text>
        </View>
      </View>
      
      <View style={styles.metricRow}>
        <Text style={styles.metricLabel}>Volatility</Text>
        <Text style={[styles.metricValue, { color: getVolatilityColor(analytics.volatility.level) }]}>
          {analytics.volatility.level.toUpperCase()} ({analytics.volatility.percentage}%)
        </Text>
      </View>
      
      <Text style={styles.insightText}>{analytics.trend.insight}</Text>
      <Text style={styles.insightText}>{analytics.volatility.insight}</Text>
      
      {analytics.seasonality.hasSeasonality && (
        <View style={styles.seasonalitySection}>
          <Text style={styles.sectionTitle}>🎯 Seasonal Patterns</Text>
          <Text style={styles.insightText}>{analytics.seasonality.insight}</Text>
        </View>
      )}
    </View>
  );

  const CategoriesTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>📊 Category Trends</Text>
      {Object.entries(analytics.categories).map(([category, data]) => (
        <View key={category} style={styles.categoryItem}>
          <View style={styles.categoryHeader}>
            <Text style={styles.categoryName}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Text>
            <Text style={styles.categoryAmount}>
              ₹{data.current.toLocaleString()}
            </Text>
          </View>
          <View style={styles.categoryTrend}>
            <Text style={[
              styles.categoryTrendText,
              { color: data.trend === 'increasing' ? colors.error : 
                       data.trend === 'decreasing' ? colors.success : colors.primary }
            ]}>
              {data.trend === 'increasing' ? '↗️' : data.trend === 'decreasing' ? '↘️' : '➡️'} 
              {data.change.toFixed(1)}%
            </Text>
          </View>
          <Text style={styles.categoryInsight}>{data.insight}</Text>
        </View>
      ))}
    </ScrollView>
  );

  const PredictionsTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>🔮 Next Month Prediction</Text>
      
      <View style={styles.predictionCard}>
        <View style={styles.predictionHeader}>
          <Text style={styles.predictionAmount}>
            ₹{analytics.predictions.amount.toLocaleString()}
          </Text>
          <View style={styles.confidenceContainer}>
            <Text style={styles.confidenceLabel}>Confidence:</Text>
            <Text style={[
              styles.confidenceValue,
              { color: analytics.predictions.confidence === 'high' ? colors.success :
                       analytics.predictions.confidence === 'medium' ? colors.warning : colors.error }
            ]}>
              {analytics.predictions.confidence.toUpperCase()}
            </Text>
          </View>
        </View>
        
        <Text style={styles.predictionSubtext}>
          Estimated spending for next month
        </Text>
        
        <View style={styles.factorsSection}>
          <Text style={styles.factorsTitle}>Based on:</Text>
          {analytics.predictions.factors.map((factor, index) => (
            <Text key={index} style={styles.factorItem}>• {factor}</Text>
          ))}
        </View>
      </View>
    </View>
  );

  return (
    <FadeInUp delay={200}>
      <View style={[styles.card, { backgroundColor: trendDisplay.color + '05' }]}>
        <View style={styles.cardHeader}>
          <View style={styles.iconContainer}>
            <View style={[styles.iconGradient, { backgroundColor: trendDisplay.color + '15' }]}>
              <Text style={styles.cardIcon}>📊</Text>
            </View>
          </View>
          <View style={styles.cardTitleContainer}>
            <View style={styles.titleRow}>
              <Text style={styles.cardTitle}>Spending Analytics</Text>
              <TouchableOpacity 
                onPress={() => setIsBookmarked(!isBookmarked)}
                style={styles.bookmarkButton}
              >
                <Text style={styles.bookmarkIcon}>
                  {isBookmarked ? '🔖' : '📌'}
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.cardDescription}>
              6-month spending analysis and predictions
            </Text>
          </View>
          <View style={styles.headerChart}>
            <TrendChart />
          </View>
        </View>
        
        <View style={styles.tabContainer}>
          <TabButton 
            id="trends" 
            title="Trends" 
            active={activeTab === 'trends'} 
            onPress={setActiveTab} 
          />
          <TabButton 
            id="categories" 
            title="Categories" 
            active={activeTab === 'categories'} 
            onPress={setActiveTab} 
          />
          <TabButton 
            id="predictions" 
            title="Forecast" 
            active={activeTab === 'predictions'} 
            onPress={setActiveTab} 
          />
        </View>
        
        {activeTab === 'trends' && <TrendsTab />}
        {activeTab === 'categories' && <CategoriesTab />}
        {activeTab === 'predictions' && <PredictionsTab />}
        
        <View style={styles.quickActions}>
          <Text style={styles.quickActionsTitle}>⚡ Quick Actions</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: trendDisplay.color + '15' }]}
              onPress={() => handleQuickAction('optimize')}
            >
              <Text style={[styles.actionButtonText, { color: trendDisplay.color }]}>
                🎯 Optimize Spending
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: colors.primary + '15' }]}
              onPress={() => handleQuickAction('budget')}
            >
              <Text style={[styles.actionButtonText, { color: colors.primary }]}>
                💰 Set Budget
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </FadeInUp>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 170, 0.1)',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  iconContainer: {
    marginRight: 12,
  },
  iconGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardIcon: {
    fontSize: 24,
  },
  cardTitleContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bookmarkButton: {
    padding: 4,
  },
  bookmarkIcon: {
    fontSize: 16,
  },
  headerChart: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  activeTabText: {
    fontWeight: '600',
  },
  tabContent: {
    minHeight: 200,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricLabel: {
    fontSize: 14,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  trendText: {
    fontSize: 14,
    fontWeight: '600',
  },
  insightText: {
    fontSize: 13,
    marginBottom: 8,
    lineHeight: 18,
  },
  seasonalitySection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E030',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  categoryItem: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E020',
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  categoryName: {
    fontSize: 15,
    fontWeight: '500',
  },
  categoryAmount: {
    fontSize: 15,
    fontWeight: '600',
  },
  categoryTrend: {
    marginBottom: 4,
  },
  categoryTrendText: {
    fontSize: 13,
    fontWeight: '600',
  },
  categoryInsight: {
    fontSize: 12,
  },
  predictionCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
  },
  predictionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  predictionAmount: {
    fontSize: 24,
    fontWeight: '700',
  },
  confidenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  confidenceLabel: {
    fontSize: 12,
    marginRight: 4,
  },
  confidenceValue: {
    fontSize: 12,
    fontWeight: '600',
  },
  predictionSubtext: {
    fontSize: 14,
    marginBottom: 12,
  },
  factorsSection: {
    marginTop: 8,
  },
  factorsTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },
  factorItem: {
    fontSize: 12,
    marginBottom: 2,
  },
  quickActions: {
    width: '100%',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  quickActionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  trendChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 40,
    width: 120,
    gap: 3,
  },
  trendColumn: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  trendBar: {
    borderRadius: 2,
    minHeight: 3,
  },
});

export default SpendingTrendsCard;