import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { FiColors } from '../../theme/consolidatedFiColors';

const { width } = Dimensions.get('window');

const SpendingBreakdownChart = ({ spendingData, inflationBreakdown }) => {
  // Prepare data for pie chart
  const chartData = Object.entries(spendingData)
    .filter(([_, data]) => data.amount > 0)
    .sort(([_, a], [__, b]) => b.amount - a.amount)
    .slice(0, 6) // Top 6 categories
    .map(([category, data], index) => ({
      name: category.charAt(0).toUpperCase() + category.slice(1),
      amount: data.amount,
      color: getColorForCategory(category, index),
      legendFontColor: FiColors.text,
      legendFontSize: 12,
    }));

  const chartConfig = {
    backgroundGradientFrom: FiColors.surface,
    backgroundGradientTo: FiColors.surface,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>💰 Spending Breakdown</Text>
      
      <View style={styles.chartContainer}>
        <PieChart
          data={chartData}
          width={width - 80}
          height={200}
          chartConfig={chartConfig}
          accessor="amount"
          backgroundColor="transparent"
          paddingLeft="15"
          center={[10, 0]}
          absolute
        />
      </View>

      <View style={styles.legendContainer}>
        {chartData.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: item.color }]} />
            <Text style={styles.legendText}>
              {item.name}: ₹{item.amount.toLocaleString()}
            </Text>
            <Text style={styles.inflationImpact}>
              +{inflationBreakdown[item.name.toLowerCase()]?.contribution || 0}%
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const getColorForCategory = (category, index) => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
    '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'
  ];
  return colors[index % colors.length];
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: FiColors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: FiColors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  legendContainer: {
    gap: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    flex: 1,
    fontSize: 12,
    color: FiColors.text,
  },
  inflationImpact: {
    fontSize: 11,
    color: FiColors.primary,
    fontWeight: '600',
  },
});

export default SpendingBreakdownChart;
