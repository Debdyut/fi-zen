import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

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
  const { cardId } = route.params;

  const getMetricDetails = (id) => {
    const metrics = {
      inflation_rate: {
        title: 'Your Inflation Rate',
        value: '8.2%',
        description: 'Your personal inflation rate is higher than the government rate of 6.5%',
        details: [
          { label: 'Food & Beverages', value: '9.1%', impact: 'High' },
          { label: 'Housing', value: '7.8%', impact: 'Medium' },
          { label: 'Transportation', value: '8.5%', impact: 'High' },
          { label: 'Healthcare', value: '6.2%', impact: 'Low' },
        ],
        color: FiColors.error,
        icon: '📈'
      },
      salary_impact: {
        title: 'Salary Impact',
        value: '₹11,800',
        description: 'Additional monthly income needed to maintain your current lifestyle',
        details: [
          { label: 'Current Monthly Expenses', value: '₹45,000' },
          { label: 'Inflation Adjusted', value: '₹56,800' },
          { label: 'Additional Required', value: '₹11,800' },
          { label: 'Annual Impact', value: '₹1,41,600' },
        ],
        color: FiColors.warning,
        icon: '💼'
      },
      investment_target: {
        title: 'Investment Target',
        value: '16.8%',
        description: 'Minimum returns needed to beat your personal inflation rate',
        details: [
          { label: 'Your Inflation Rate', value: '8.2%' },
          { label: 'Tax Impact (30%)', value: '2.5%' },
          { label: 'Real Return Buffer', value: '6.1%' },
          { label: 'Target Return', value: '16.8%' },
        ],
        color: FiColors.success,
        icon: '🎯'
      },
      city_rank: {
        title: 'City Ranking',
        value: '#2',
        description: 'Your city ranks as the 2nd most expensive for your lifestyle',
        details: [
          { label: 'Mumbai', value: '#1', impact: 'Most Expensive' },
          { label: 'Your City', value: '#2', impact: 'Very Expensive' },
          { label: 'Bangalore', value: '#3', impact: 'Expensive' },
          { label: 'Delhi', value: '#4', impact: 'Moderate' },
        ],
        color: FiColors.primary,
        icon: '🏙️'
      },
      weekly_insight: {
        title: 'Weekly Insight',
        value: '+2.3%',
        description: 'Your food costs increased this week due to vegetable price surge in Mumbai markets',
        details: [
          { label: 'Vegetables', value: '+4.2%', impact: 'High' },
          { label: 'Fruits', value: '+1.8%', impact: 'Medium' },
          { label: 'Dairy', value: '+0.5%', impact: 'Low' },
          { label: 'Grains', value: '-0.2%', impact: 'Low' },
        ],
        color: FiColors.warning,
        icon: '📊'
      }
    };
    return metrics[id] || metrics.inflation_rate;
  };

  const metric = getMetricDetails(cardId);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{metric.title}</Text>
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
          {metric.details.map((detail, index) => (
            <View key={index} style={styles.detailItem}>
              <Text style={styles.detailLabel}>{detail.label}</Text>
              <Text style={styles.detailValue}>{detail.value}</Text>
              {detail.impact && (
                <Text style={[styles.detailImpact, { 
                  color: detail.impact === 'High' ? FiColors.error : 
                        detail.impact === 'Medium' ? FiColors.warning : FiColors.success 
                }]}>
                  {detail.impact}
                </Text>
              )}
            </View>
          ))}
        </View>

        <View style={styles.actionSection}>
          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>View Recommendations</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Share Insights</Text>
          </TouchableOpacity>
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: FiColors.text,
  },
  placeholder: {
    width: 40,
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
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  detailLabel: {
    fontSize: 14,
    color: FiColors.textSecondary,
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: FiColors.text,
    marginRight: 8,
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
});

export default MetricDetailScreen;