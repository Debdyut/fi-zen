import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Dimensions } from 'react-native';
import { FiColors } from '../theme/consolidatedFiColors';
import InflationCard from '../components/fi-style/FiInflationCard';
import DataService from '../services/DataService';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const InflationScreen = () => {
  const navigation = useNavigation();
  const [currentUser] = useState(DataService.getCurrentUser());
  console.log('InflationScreen navigation:', navigation);
  console.log('Navigation methods:', Object.keys(navigation || {}));

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Personal Inflation Rate 📈</Text>
        <Text style={styles.subtitle}>Your financial reality vs market data</Text>
      </View>
      
      <ScrollView style={styles.content}>
        <InflationCard inflationData={{ personal: 11.8 }} />
        
        <View style={styles.insightCard}>
          <Text style={styles.insightTitle}>💡 Why This Matters</Text>
          <Text style={styles.insightText}>
            Your personal inflation rate shows how your cost of living changes compared to national averages. 
            This helps you make better financial decisions and plan for the future.
          </Text>
        </View>
        
        <View style={styles.spendingCard}>
          <Text style={styles.spendingTitle}>💰 Your Spending Breakdown</Text>
          <View style={styles.pieChart}>
            <View style={styles.pieSlice1} />
            <View style={styles.pieSlice2} />
            <View style={styles.pieSlice3} />
            <View style={styles.pieSlice4} />
          </View>
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: FiColors.primary }]} />
              <Text style={styles.legendText}>Food & Groceries (40%)</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: FiColors.secondary }]} />
              <Text style={styles.legendText}>Housing (30%)</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: FiColors.primary + '80' }]} />
              <Text style={styles.legendText}>Transport (20%)</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: FiColors.secondary + '80' }]} />
              <Text style={styles.legendText}>Entertainment (10%)</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.dataSourceCard}>
          <Text style={styles.dataSourceTitle}>📊 Data Sources Connected</Text>
          <View style={styles.sourceItem}>
            <Text style={styles.sourceEmoji}>🏦</Text>
            <Text style={styles.sourceText}>Fi Savings Account - Connected ✅</Text>
          </View>
          <View style={styles.sourceItem}>
            <Text style={styles.sourceEmoji}>📧</Text>
            <Text style={styles.sourceText}>Gmail Bank Statements - Available</Text>
          </View>
          <View style={styles.sourceItem}>
            <Text style={styles.sourceEmoji}>💳</Text>
            <Text style={styles.sourceText}>Credit Card Statements - Available</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: FiColors.background,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: FiColors.secondary + '20',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: FiColors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: FiColors.secondary,
    fontStyle: 'italic',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  insightCard: {
    backgroundColor: FiColors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: FiColors.primary + '20',
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: FiColors.text,
    marginBottom: 12,
  },
  insightText: {
    fontSize: 14,
    color: FiColors.text,
    lineHeight: 20,
  },
  tipsCard: {
    backgroundColor: FiColors.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: FiColors.secondary + '20',
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: FiColors.text,
    marginBottom: 12,
  },
  spendingCard: {
    backgroundColor: FiColors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: FiColors.primary + '20',
  },
  spendingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: FiColors.text,
    marginBottom: 16,
  },
  pieChart: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    marginBottom: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  pieSlice1: {
    position: 'absolute',
    width: 120,
    height: 60,
    backgroundColor: FiColors.primary,
    top: 0,
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
  },
  pieSlice2: {
    position: 'absolute',
    width: 60,
    height: 60,
    backgroundColor: FiColors.secondary,
    bottom: 0,
    right: 0,
    borderBottomRightRadius: 60,
  },
  pieSlice3: {
    position: 'absolute',
    width: 60,
    height: 48,
    backgroundColor: FiColors.primary + '80',
    bottom: 0,
    left: 0,
    borderBottomLeftRadius: 60,
  },
  pieSlice4: {
    position: 'absolute',
    width: 60,
    height: 12,
    backgroundColor: FiColors.secondary + '80',
    bottom: 48,
    left: 0,
  },
  legend: {
    gap: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 14,
    color: FiColors.text,
  },
  dataSourceCard: {
    backgroundColor: FiColors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 100,
    borderWidth: 1,
    borderColor: FiColors.secondary + '20',
  },
  dataSourceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: FiColors.text,
    marginBottom: 16,
  },
  sourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  sourceEmoji: {
    fontSize: 20,
  },
  sourceText: {
    fontSize: 14,
    color: FiColors.text,
  },
});

export default InflationScreen;