import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { EnhancedFiColors } from '../theme/enhancedColors';
import { EnhancedButton } from '../components/common/EnhancedButtons';
import { AnimatedCard, FadeInUp } from '../components/animations/AnimatedCard';
import { EnhancedPullToRefresh } from '../components/common/PullToRefresh';
import { AccessibleHeading } from '../components/common/AccessibilityHelpers';
import ProductionInflationCard from '../components/ProductionInflationCard';

const EnhancedHomeScreen = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [hasInflationData, setHasInflationData] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const QuickActionCard = ({ title, description, icon, onPress, variant = 'primary' }) => (
    <FadeInUp delay={200}>
      <AnimatedCard style={styles.quickActionCard}>
        <Text style={styles.quickActionIcon}>{icon}</Text>
        <Text style={styles.quickActionTitle}>{title}</Text>
        <Text style={styles.quickActionDescription}>{description}</Text>
        <EnhancedButton
          title="Get Started"
          variant={variant}
          size="small"
          onPress={onPress}
          style={styles.quickActionButton}
        />
      </AnimatedCard>
    </FadeInUp>
  );

  const FeatureHighlight = ({ title, subtitle, icon, onPress }) => (
    <AnimatedCard style={styles.featureCard}>
      <View style={styles.featureContent}>
        <Text style={styles.featureIcon}>{icon}</Text>
        <View style={styles.featureText}>
          <Text style={styles.featureTitle}>{title}</Text>
          <Text style={styles.featureSubtitle}>{subtitle}</Text>
        </View>
      </View>
      <EnhancedButton
        title="Try Now"
        variant="secondary"
        size="small"
        onPress={onPress}
        style={styles.featureButton}
      />
    </AnimatedCard>
  );

  return (
    <EnhancedPullToRefresh onRefresh={handleRefresh} refreshing={refreshing}>
      <ScrollView style={styles.container}>
        <FadeInUp delay={0}>
          <View style={styles.header}>
            <AccessibleHeading level={1} style={styles.welcomeText}>
              Welcome to Fi-Zen
            </AccessibleHeading>
            <Text style={styles.tagline}>
              Your personal financial intelligence platform
            </Text>
          </View>
        </FadeInUp>

        {/* Inflation Calculator Section */}
        <FadeInUp delay={100}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📈 Personal Inflation Calculator</Text>
            {hasInflationData ? (
              <ProductionInflationCard userId="2222222222" navigation={navigation} />
            ) : (
              <AnimatedCard style={styles.inflationPromptCard}>
                <Text style={styles.promptIcon}>🧮</Text>
                <Text style={styles.promptTitle}>
                  Discover Your Real Inflation Rate
                </Text>
                <Text style={styles.promptDescription}>
                  Government says 6.5%, but your personal rate could be different. 
                  Get accurate insights based on your spending patterns.
                </Text>
                <View style={styles.promptFeatures}>
                  <Text style={styles.promptFeature}>🏦 RBI Compliant</Text>
                  <Text style={styles.promptFeature}>📊 MOSPI Data</Text>
                  <Text style={styles.promptFeature}>🔒 Secure in India</Text>
                </View>
                <EnhancedButton
                  title="Calculate My Rate"
                  variant="primary"
                  size="large"
                  icon="calculator"
                  onPress={() => navigation.navigate('InflationFlow', { screen: 'Welcome' })}
                  style={styles.promptButton}
                />
              </AnimatedCard>
            )}
          </View>
        </FadeInUp>

        {/* Quick Actions */}
        <FadeInUp delay={300}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🚀 Quick Actions</Text>
            <View style={styles.quickActionsGrid}>
              <QuickActionCard
                title="City Comparison"
                description="Compare inflation rates across Indian cities"
                icon="🏙️"
                onPress={() => navigation.navigate('InflationFlow', { screen: 'CityComparison' })}
                variant="secondary"
              />
              <QuickActionCard
                title="Investment Guide"
                description="Beat inflation with smart investment strategies"
                icon="💰"
                onPress={() => navigation.navigate('InflationFlow', { screen: 'InvestmentRecommendations' })}
                variant="secondary"
              />
            </View>
          </View>
        </FadeInUp>

        {/* Feature Highlights */}
        <FadeInUp delay={500}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>✨ Features</Text>
            
            <FeatureHighlight
              title="Regulatory Compliant"
              subtitle="RBI, SEBI & MOSPI approved calculations"
              icon="🏛️"
              onPress={() => navigation.navigate('InflationFlow', { screen: 'ComplianceDetails' })}
            />
            
            <FeatureHighlight
              title="Location Intelligence"
              subtitle="City-specific inflation insights"
              icon="📍"
              onPress={() => navigation.navigate('InflationFlow', { screen: 'CityComparison' })}
            />
            
            <FeatureHighlight
              title="Detailed Breakdown"
              subtitle="Category-wise inflation analysis"
              icon="📊"
              onPress={() => navigation.navigate('InflationFlow', { screen: 'DetailedBreakdown' })}
            />
          </View>
        </FadeInUp>

        {/* Trust Indicators */}
        <FadeInUp delay={700}>
          <View style={styles.trustSection}>
            <Text style={styles.trustTitle}>🛡️ Trusted & Secure</Text>
            <View style={styles.trustBadges}>
              <View style={styles.trustBadge}>
                <Text style={styles.trustBadgeText}>🏦 RBI</Text>
              </View>
              <View style={styles.trustBadge}>
                <Text style={styles.trustBadgeText}>📊 MOSPI</Text>
              </View>
              <View style={styles.trustBadge}>
                <Text style={styles.trustBadgeText}>🔒 ISO 27001</Text>
              </View>
              <View style={styles.trustBadge}>
                <Text style={styles.trustBadgeText}>💳 PCI DSS</Text>
              </View>
            </View>
          </View>
        </FadeInUp>
      </ScrollView>
    </EnhancedPullToRefresh>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: EnhancedFiColors.background,
  },
  header: {
    padding: 20,
    paddingTop: 40,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '700',
    color: EnhancedFiColors.text,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: EnhancedFiColors.textSecondary,
    textAlign: 'center',
  },
  section: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: EnhancedFiColors.text,
    marginBottom: 16,
  },
  inflationPromptCard: {
    backgroundColor: EnhancedFiColors.surface,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: EnhancedFiColors.primary + '20',
  },
  promptIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  promptTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: EnhancedFiColors.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  promptDescription: {
    fontSize: 16,
    color: EnhancedFiColors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  promptFeatures: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 24,
  },
  promptFeature: {
    fontSize: 12,
    color: EnhancedFiColors.success,
    fontWeight: '500',
  },
  promptButton: {
    width: '100%',
    height: 56,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: EnhancedFiColors.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: EnhancedFiColors.border,
  },
  quickActionIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: EnhancedFiColors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  quickActionDescription: {
    fontSize: 12,
    color: EnhancedFiColors.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 16,
  },
  quickActionButton: {
    width: '100%',
    height: 36,
  },
  featureCard: {
    backgroundColor: EnhancedFiColors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: EnhancedFiColors.border,
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: EnhancedFiColors.text,
    marginBottom: 4,
  },
  featureSubtitle: {
    fontSize: 12,
    color: EnhancedFiColors.textSecondary,
  },
  featureButton: {
    width: 80,
    height: 36,
  },
  trustSection: {
    padding: 20,
    alignItems: 'center',
  },
  trustTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: EnhancedFiColors.text,
    marginBottom: 16,
  },
  trustBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  trustBadge: {
    backgroundColor: EnhancedFiColors.success + '10',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: EnhancedFiColors.success + '30',
  },
  trustBadgeText: {
    fontSize: 12,
    color: EnhancedFiColors.success,
    fontWeight: '600',
  },
});

export default EnhancedHomeScreen;
