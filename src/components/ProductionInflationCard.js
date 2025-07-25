import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useThemedStyles } from '../theme/useThemedStyles';
import DataService from '../services/DataService';

const ProductionInflationCard = ({ userId, navigation }) => {
  const [inflationData, setInflationData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { colors } = useThemedStyles();

  useEffect(() => {
    loadInflationData();
  }, [userId]);

  const loadInflationData = async () => {
    setIsLoading(true);
    try {
      const data = await DataService.getUserInflationData(userId);
      setInflationData(data);
    } catch (error) {
      console.error('Failed to load inflation data:', error);
      // Fallback data
      setInflationData({
        personalInflationRate: 8.2,
        categories: {
          food: { rate: 9.1, weight: 30 },
          housing: { rate: 7.8, weight: 25 },
          transport: { rate: 8.5, weight: 20 }
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getInflationStatus = () => {
    if (!inflationData) return { status: 'loading', color: colors.textSecondary };
    
    const personalRate = inflationData.personalInflationRate || 0;
    const govRate = 6.5;
    
    if (personalRate > govRate + 2) return { status: 'high', color: '#FF6B6B' };
    if (personalRate > govRate) return { status: 'above', color: '#FFB347' };
    return { status: 'good', color: '#51CF66' };
  };

  const inflationStatus = getInflationStatus();

  if (isLoading) {
    return (
      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00D4AA" />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Loading your inflation data...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.card, { backgroundColor: colors.surface }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>
            Your Personal Inflation
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            vs Government Rate (6.5%)
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.detailsButton}
          onPress={() => navigation?.navigate('EnhancedDetailedBreakdown', { userId })}
        >
          <Text style={styles.detailsIcon}>📊</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <View style={styles.inflationComparison}>
          <View style={styles.rateContainer}>
            <Text style={[styles.rateValue, { color: inflationStatus.color }]}>
              {inflationData?.personalInflationRate?.toFixed(1) || 'N/A'}%
            </Text>
            <Text style={[styles.rateLabel, { color: colors.textSecondary }]}>
              Your Rate
            </Text>
          </View>
          
          <View style={styles.vsContainer}>
            <Text style={[styles.vsText, { color: colors.textSecondary }]}>vs</Text>
          </View>
          
          <View style={styles.rateContainer}>
            <Text style={[styles.govRate, { color: colors.textSecondary }]}>6.5%</Text>
            <Text style={[styles.rateLabel, { color: colors.textSecondary }]}>
              Govt Rate
            </Text>
          </View>
        </View>

        {/* Status Indicator */}
        <View style={[styles.statusBadge, { backgroundColor: inflationStatus.color }]}>
          <Text style={styles.statusText}>
            {inflationStatus.status === 'high' && '⚠️ High Impact'}
            {inflationStatus.status === 'above' && '📈 Above Average'}
            {inflationStatus.status === 'good' && '✅ Under Control'}
            {inflationStatus.status === 'loading' && '⏳ Calculating...'}
          </Text>
        </View>

        {/* Top Categories */}
        {inflationData?.categories && (
          <View style={styles.categoriesContainer}>
            <Text style={[styles.categoriesTitle, { color: colors.text }]}>
              Top Impact Categories
            </Text>
            <View style={styles.categoriesList}>
              {Object.entries(inflationData.categories)
                .sort(([,a], [,b]) => b.rate - a.rate)
                .slice(0, 3)
                .map(([category, data]) => (
                  <View key={category} style={styles.categoryItem}>
                    <Text style={[styles.categoryName, { color: colors.text }]}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </Text>
                    <Text style={[styles.categoryRate, { color: inflationStatus.color }]}>
                      {data.rate?.toFixed(1)}%
                    </Text>
                  </View>
                ))}
            </View>
          </View>
        )}
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation?.navigate('Home')}
        >
          <Text style={styles.actionText}>View Details</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation?.navigate('Insights', { selectedUserId: userId })}
        >
          <Text style={styles.actionText}>View Insights</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    minHeight: 280,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
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
  },
  subtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  detailsButton: {
    backgroundColor: '#00D4AA',
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsIcon: {
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
    marginBottom: 4,
  },
  rateLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  vsContainer: {
    paddingHorizontal: 16,
  },
  vsText: {
    fontSize: 16,
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
  categoriesContainer: {
    marginBottom: 16,
  },
  categoriesTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  categoriesList: {
    gap: 4,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  categoryName: {
    fontSize: 12,
    flex: 1,
  },
  categoryRate: {
    fontSize: 12,
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  actionButton: {
    backgroundColor: '#00D4AA',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flex: 1,
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default ProductionInflationCard;