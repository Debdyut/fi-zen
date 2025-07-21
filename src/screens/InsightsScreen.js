import React from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { FadeInUp } from '../components/animations/AnimatedCard';
import { TouchableArea } from '../components/common/AccessibilityHelpers';
import { useLanguage } from '../localization/LanguageContext';
import { useTheme } from '../theme/ThemeContext';

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
  const { t } = useLanguage();
  const { isDarkMode } = useTheme();
  const InsightCard = ({ title, value, trend, icon, description }) => (
    <FadeInUp delay={100}>
      <TouchableArea>
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
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#1A1A1A' : '#E6FBF7' }]}>
      <StatusBar barStyle="light-content" backgroundColor={FiColors.background} />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: isDarkMode ? '#1A1A1A' : '#E6FBF7' }]}>
          <Text style={[styles.headerTitle, { color: isDarkMode ? '#FFFFFF' : '#1A1A1A' }]}>{t('insights.title')}</Text>
          <Text style={[styles.headerSubtitle, { color: isDarkMode ? '#FFFFFF' : '#1A1A1A' }]}>{t('insights.subtitle')}</Text>
        </View>
        {/* Market Overview */}
        <View style={[styles.infoSection, { backgroundColor: isDarkMode ? '#1A1A1A' : '#E6FBF7' }]}>
          <Text style={[styles.infoTitle, { color: isDarkMode ? '#FFFFFF' : '#1A1A1A' }]}>{t('insights.marketOverview')}</Text>
          <View style={styles.infoItem}>
            <Text style={[styles.infoLabel, { color: isDarkMode ? '#FFFFFF' : '#1A1A1A' }]}>{t('insights.purchasingPower')}</Text>
            <Text style={[styles.infoValue, { color: isDarkMode ? '#FFFFFF' : '#1A1A1A' }]}>87.3% ↘ -2.1%</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={[styles.infoLabel, { color: isDarkMode ? '#FFFFFF' : '#1A1A1A' }]}>{t('insights.costOfLivingIndex')}</Text>
            <Text style={[styles.infoValue, { color: isDarkMode ? '#FFFFFF' : '#1A1A1A' }]}>142.8 ↗ +8.7%</Text>
          </View>
        </View>

        {/* Key Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('insights.keyMetrics')}</Text>
          
          <View style={[styles.insightCard, { backgroundColor: '#FFF5F5' }]}>
            <InsightCard
              title={t('insights.monthlyInflationImpact')}
              value="₹2,450"
              trend={12.5}
              icon="📈"
              description={t('insights.additionalCost')}
            />
          </View>
        </View>

        {/* Spending Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('insights.inflationImpactByCategory')}</Text>
          
          <View style={styles.spendingCard}>
            <SpendingCategory
              category={t('insights.foodDining')}
              amount="1,250"
              percentage="35"
              icon="🍽️"
            />
            <SpendingCategory
              category={t('insights.transportation')}
              amount="890"
              percentage="25"
              icon="🚗"
            />
            <SpendingCategory
              category={t('insights.housing')}
              amount="650"
              percentage="18"
              icon="🏠"
            />
            <SpendingCategory
              category={t('insights.healthcare')}
              amount="420"
              percentage="12"
              icon="🏥"
            />
            <SpendingCategory
              category={t('insights.others')}
              amount="240"
              percentage="10"
              icon="📦"
            />
          </View>
        </View>

        {/* Recommendations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('insights.smartRecommendations')}</Text>
          
          <FadeInUp delay={300}>
            <View style={styles.recommendationCard}>
              <Text style={styles.recommendationIcon}>💡</Text>
              <View style={styles.recommendationContent}>
                <Text style={styles.recommendationTitle}>{t('insights.switchToBulkBuying')}</Text>
                <Text style={styles.recommendationText}>
                  {t('insights.bulkBuyingSavings')}
                </Text>
              </View>
            </View>
          </FadeInUp>
          
          <FadeInUp delay={400}>
            <View style={styles.recommendationCard}>
              <Text style={styles.recommendationIcon}>🚌</Text>
              <View style={styles.recommendationContent}>
                <Text style={styles.recommendationTitle}>{t('insights.usePublicTransport')}</Text>
                <Text style={styles.recommendationText}>
                  {t('insights.publicTransportSavings')}
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
    backgroundColor: '#E6FBF7',
  },
  content: {
    flex: 1,
  },
  header: {
    backgroundColor: '#E6FBF7',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#1A1A1A',
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
    backgroundColor: '#FFFBF0',
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
    backgroundColor: '#F0FDFA',
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
  infoSection: {
    backgroundColor: '#E6FBF7',
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginHorizontal: 16,
    borderRadius: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  infoLabel: {
    fontSize: 14,
    color: '#1A1A1A',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
});

export default InsightsScreen;
