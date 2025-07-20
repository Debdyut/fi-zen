import React from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { FadeInUp } from '../components/animations/AnimatedCard';
import { TouchableArea } from '../components/common/AccessibilityHelpers';

const FiColors = {
  background: '#1A1A1A',
  surface: '#FFFFFF',
  primary: '#00D4AA',
  text: '#1A1A1A',
  textSecondary: '#666666',
  textInverse: '#FFFFFF',
  border: '#E0E0E0',
};

const InsightsScreen = ({ navigation }) => {
  const InsightCard = ({ title, value, trend, icon, description }) => (
    <FadeInUp delay={100}>
      <TouchableArea style={styles.insightCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardIcon}>{icon}</Text>
          <View style={styles.cardTitleContainer}>
            <Text style={styles.cardTitle}>{title}</Text>
            <Text style={styles.cardDescription}>{description}</Text>
          </View>
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardValue}>{value}</Text>
          <Text style={[styles.cardTrend, trend > 0 ? styles.trendUp : styles.trendDown]}>
            {trend > 0 ? '↗' : '↘'} {Math.abs(trend)}%
          </Text>
        </View>
      </TouchableArea>
    </FadeInUp>
  );

  const SpendingCategory = ({ category, amount, percentage, icon }) => (
    <View style={styles.categoryItem}>
      <View style={styles.categoryLeft}>
        <Text style={styles.categoryIcon}>{icon}</Text>
        <Text style={styles.categoryName}>{category}</Text>
      </View>
      <View style={styles.categoryRight}>
        <Text style={styles.categoryAmount}>₹{amount}</Text>
        <Text style={styles.categoryPercentage}>{percentage}%</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={FiColors.background} />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Financial Insights</Text>
          <Text style={styles.headerSubtitle}>Your spending patterns & trends</Text>
        </View>
        {/* Key Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Metrics</Text>
          
          <InsightCard
            title="Monthly Inflation Impact"
            value="₹2,450"
            trend={12.5}
            icon="📈"
            description="Additional cost due to inflation"
          />
          
          <InsightCard
            title="Purchasing Power"
            value="87.3%"
            trend={-2.1}
            icon="💰"
            description="Compared to last year"
          />
          
          <InsightCard
            title="Cost of Living Index"
            value="142.8"
            trend={8.7}
            icon="🏠"
            description="Your city vs national average"
          />
        </View>

        {/* Spending Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Inflation Impact by Category</Text>
          
          <View style={styles.spendingCard}>
            <SpendingCategory
              category="Food & Dining"
              amount="1,250"
              percentage="35"
              icon="🍽️"
            />
            <SpendingCategory
              category="Transportation"
              amount="890"
              percentage="25"
              icon="🚗"
            />
            <SpendingCategory
              category="Housing"
              amount="650"
              percentage="18"
              icon="🏠"
            />
            <SpendingCategory
              category="Healthcare"
              amount="420"
              percentage="12"
              icon="🏥"
            />
            <SpendingCategory
              category="Others"
              amount="240"
              percentage="10"
              icon="📦"
            />
          </View>
        </View>

        {/* Recommendations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Smart Recommendations</Text>
          
          <FadeInUp delay={300}>
            <View style={styles.recommendationCard}>
              <Text style={styles.recommendationIcon}>💡</Text>
              <View style={styles.recommendationContent}>
                <Text style={styles.recommendationTitle}>Switch to bulk buying</Text>
                <Text style={styles.recommendationText}>
                  Save ₹180/month on groceries by buying in bulk
                </Text>
              </View>
            </View>
          </FadeInUp>
          
          <FadeInUp delay={400}>
            <View style={styles.recommendationCard}>
              <Text style={styles.recommendationIcon}>🚌</Text>
              <View style={styles.recommendationContent}>
                <Text style={styles.recommendationTitle}>Use public transport</Text>
                <Text style={styles.recommendationText}>
                  Reduce fuel costs by ₹320/month with metro passes
                </Text>
              </View>
            </View>
          </FadeInUp>
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
  content: {
    flex: 1,
  },
  header: {
    backgroundColor: FiColors.background,
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '600',
    color: FiColors.textInverse,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: FiColors.textInverse + '80',
  },
  content: {
    flex: 1,
  },
  section: {
    margin: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: FiColors.text,
    marginBottom: 16,
  },
  insightCard: {
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
    alignItems: 'center',
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
    fontSize: 16,
    fontWeight: '600',
    color: FiColors.text,
    marginBottom: 2,
  },
  cardDescription: {
    fontSize: 14,
    color: FiColors.textSecondary,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardValue: {
    fontSize: 24,
    fontWeight: '700',
    color: FiColors.text,
  },
  cardTrend: {
    fontSize: 16,
    fontWeight: '600',
  },
  trendUp: {
    color: '#FF6B6B',
  },
  trendDown: {
    color: FiColors.primary,
  },
  spendingCard: {
    backgroundColor: FiColors.surface,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: FiColors.border + '30',
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '500',
    color: FiColors.text,
  },
  categoryRight: {
    alignItems: 'flex-end',
  },
  categoryAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: FiColors.text,
  },
  categoryPercentage: {
    fontSize: 14,
    color: FiColors.textSecondary,
  },
  recommendationCard: {
    backgroundColor: FiColors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  recommendationIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  recommendationContent: {
    flex: 1,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: FiColors.text,
    marginBottom: 4,
  },
  recommendationText: {
    fontSize: 14,
    color: FiColors.textSecondary,
    lineHeight: 20,
  },
});

export default InsightsScreen;
