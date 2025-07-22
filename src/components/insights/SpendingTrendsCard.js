import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { FadeInUp } from '../animations/AnimatedCard';
import AnalyticsEngine from '../../utils/AnalyticsEngine';

const FiColors = {
  surface: '#FFFFFF',
  primary: '#00D4AA',
  text: '#1A1A1A',
  textSecondary: '#666666',
  success: '#00D4AA',
  warning: '#FFB800',
  error: '#FF6B6B',
  border: '#E0E0E0',
};

const SpendingTrendsCard = ({ userProfile, spendingData }) => {
  const [activeTab, setActiveTab] = useState('categories');
  
  const analytics = AnalyticsEngine.analyzeSpendingTrends(userProfile, spendingData);
  
  // Get trend color and icon
  const getTrendDisplay = (trend) => {
    const displays = {
      increasing: { color: FiColors.error, icon: '📈', text: 'Increasing' },
      decreasing: { color: FiColors.success, icon: '📉', text: 'Decreasing' },
      stable: { color: FiColors.primary, icon: '➡️', text: 'Stable' }
    };
    return displays[trend.direction] || displays.stable;
  };

  // Get volatility color
  const getVolatilityColor = (level) => {
    const colors = {
      high: FiColors.error,
      moderate: FiColors.warning,
      low: FiColors.success
    };
    return colors[level] || FiColors.primary;
  };

  const trendDisplay = getTrendDisplay(analytics.trend);

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
              { color: data.trend === 'increasing' ? FiColors.error : 
                       data.trend === 'decreasing' ? FiColors.success : FiColors.primary }
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
              { color: analytics.predictions.confidence === 'high' ? FiColors.success :
                       analytics.predictions.confidence === 'medium' ? FiColors.warning : FiColors.error }
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
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardIcon}>📊</Text>
          <View style={styles.cardTitleContainer}>
            <Text style={styles.cardTitle}>Spending Analytics</Text>
            <Text style={styles.cardDescription}>
              6-month spending analysis and predictions
            </Text>
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
      </View>
    </FadeInUp>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: FiColors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  cardIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  cardTitleContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: FiColors.text,
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: FiColors.textSecondary,
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
    backgroundColor: FiColors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    color: FiColors.textSecondary,
    fontWeight: '500',
  },
  activeTabText: {
    color: FiColors.text,
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
    color: FiColors.textSecondary,
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
    color: FiColors.textSecondary,
    marginBottom: 8,
    lineHeight: 18,
  },
  seasonalitySection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: FiColors.border + '30',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: FiColors.text,
    marginBottom: 12,
  },
  categoryItem: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: FiColors.border + '20',
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
    color: FiColors.text,
  },
  categoryAmount: {
    fontSize: 15,
    fontWeight: '600',
    color: FiColors.text,
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
    color: FiColors.textSecondary,
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
    color: FiColors.text,
  },
  confidenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  confidenceLabel: {
    fontSize: 12,
    color: FiColors.textSecondary,
    marginRight: 4,
  },
  confidenceValue: {
    fontSize: 12,
    fontWeight: '600',
  },
  predictionSubtext: {
    fontSize: 14,
    color: FiColors.textSecondary,
    marginBottom: 12,
  },
  factorsSection: {
    marginTop: 8,
  },
  factorsTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: FiColors.text,
    marginBottom: 4,
  },
  factorItem: {
    fontSize: 12,
    color: FiColors.textSecondary,
    marginBottom: 2,
  },
});

export default SpendingTrendsCard;
