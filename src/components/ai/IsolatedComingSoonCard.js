import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { FadeInUp } from '../animations/AnimatedCard';
import { FiColors } from '../../theme/consolidatedFiColors';

const comingSoonFeatures = [
  {
    id: 'market_integration',
    icon: '📈',
    title: 'Real-time Market Integration',
    subtitle: 'Live data feeds and market-aware recommendations',
    description: 'Get real-time market updates, live stock prices, and recommendations that adapt to current market conditions. Your investment advice will be powered by live NSE/BSE data.',
    benefits: [
      'Live stock prices and market indices',
      'Market-aware investment recommendations',
      'Real-time portfolio performance tracking',
      'Economic news impact analysis'
    ],
    timeline: 'Coming in Q2 2025',
    status: 'In Development'
  },
  {
    id: 'goal_tracking',
    icon: '🎯',
    title: 'Advanced Goal Tracking',
    subtitle: 'AI-powered progress monitoring and adjustment',
    description: 'Smart goal tracking that automatically monitors your progress, suggests adjustments, and celebrates milestones. AI will help you stay on track with dynamic goal optimization.',
    benefits: [
      'Automatic progress monitoring',
      'Smart milestone celebrations',
      'Dynamic goal adjustment suggestions',
      'Predictive goal achievement analysis'
    ],
    timeline: 'Coming in Q3 2025',
    status: 'Design Phase'
  },
  {
    id: 'social_learning',
    icon: '👥',
    title: 'Social Learning Features',
    subtitle: 'Community insights and peer learning',
    description: 'Learn from a community of like-minded investors. Share achievements, get insights from successful peers, and participate in financial challenges with anonymized data.',
    benefits: [
      'Anonymous peer learning groups',
      'Community financial challenges',
      'Success story sharing',
      'Collaborative goal achievement'
    ],
    timeline: 'Coming in Q4 2025',
    status: 'Research Phase'
  },
  {
    id: 'predictive_analytics',
    icon: '🔮',
    title: 'Predictive Analytics',
    subtitle: 'Future financial scenario modeling',
    description: 'Advanced AI that predicts future financial scenarios, market trends, and personal financial outcomes. Get insights into how current decisions will impact your future wealth.',
    benefits: [
      'Future wealth projection modeling',
      'Market trend predictions',
      'Scenario-based planning',
      'Risk-adjusted forecasting'
    ],
    timeline: 'Coming in 2026',
    status: 'Concept Phase'
  }
];

const getStatusColor = (status) => {
  switch (status) {
    case 'In Development': return FiColors.success;
    case 'Design Phase': return FiColors.warning;
    case 'Research Phase': return '#3B82F6';
    case 'Concept Phase': return FiColors.textSecondary;
    default: return FiColors.primary;
  }
};

const IsolatedComingSoonCard = () => {
  const [selectedFeature, setSelectedFeature] = useState(null);

  const FeaturePreview = ({ feature, index }) => {
    const isExpanded = selectedFeature === feature.id;
    
    return (
      <FadeInUp delay={100 + (index * 100)}>
        <View style={styles.featureCard}>
        <TouchableOpacity
          style={styles.featureHeader}
          onPress={() => setSelectedFeature(isExpanded ? null : feature.id)}
          activeOpacity={0.7}
        >
          <Text style={styles.featureIcon}>{feature.icon}</Text>
          <View style={styles.featureTitleContainer}>
            <Text style={styles.featureTitle}>{feature.title}</Text>
            <Text style={styles.featureSubtitle}>{feature.subtitle}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(feature.status) + '20' }]}>
            <Text style={[styles.statusText, { color: getStatusColor(feature.status) }]}>
              {feature.status}
            </Text>
          </View>
          <Text style={styles.expandIcon}>{isExpanded ? '▲' : '▼'}</Text>
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.expandedContent}>
            <Text style={styles.featureDescription}>{feature.description}</Text>
            
            <View style={styles.benefitsSection}>
              <Text style={styles.benefitsTitle}>✨ Key Benefits:</Text>
              {feature.benefits.map((benefit, idx) => (
                <Text key={idx} style={styles.benefitItem}>• {benefit}</Text>
              ))}
            </View>
            
            <View style={styles.timelineSection}>
              <Text style={styles.timelineLabel}>📅 Timeline:</Text>
              <Text style={styles.timelineText}>{feature.timeline}</Text>
            </View>
          </View>
        )}
        </View>
      </FadeInUp>
    );
  };

  return (
    <FadeInUp delay={50}>
      <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.headerIcon}>🚀</Text>
        <View>
          <Text style={styles.title}>Coming Soon</Text>
          <Text style={styles.subtitle}>
            Exciting AI-powered features in development
          </Text>
        </View>
      </View>

      <View style={styles.announcementBanner}>
        <Text style={styles.bannerIcon}>🎉</Text>
        <View style={styles.bannerContent}>
          <Text style={styles.bannerTitle}>The Future of Personal Finance</Text>
          <Text style={styles.bannerText}>
            We're building the next generation of AI-powered financial planning tools
          </Text>
        </View>
      </View>

      <ScrollView style={styles.featuresContainer} showsVerticalScrollIndicator={false}>
        {comingSoonFeatures.map((feature, index) => (
          <FeaturePreview key={feature.id} feature={feature} index={index} />
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Want early access? Keep using Fi-Zen to be first in line for beta features!
        </Text>
        <TouchableOpacity style={styles.notifyButton}>
          <Text style={styles.notifyButtonText}>🔔 Notify Me</Text>
        </TouchableOpacity>
      </View>
    </View>
    </FadeInUp>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: FiColors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: FiColors.gradient1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: FiColors.text,
  },
  subtitle: {
    fontSize: 14,
    color: FiColors.textSecondary,
  },
  announcementBanner: {
    backgroundColor: FiColors.gradient1 + '10',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: FiColors.gradient1 + '30',
  },
  bannerIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  bannerContent: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: FiColors.text,
    marginBottom: 4,
  },
  bannerText: {
    fontSize: 13,
    color: FiColors.textSecondary,
    lineHeight: 18,
  },
  featuresContainer: {
    flex: 1,
  },
  featureCard: {
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: FiColors.border + '50',
  },
  featureHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 4,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 12,
    marginTop: 2,
  },
  featureTitleContainer: {
    flex: 1,
    marginRight: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: FiColors.text,
    marginBottom: 4,
  },
  featureSubtitle: {
    fontSize: 13,
    color: FiColors.textSecondary,
    lineHeight: 18,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  expandIcon: {
    fontSize: 12,
    color: FiColors.textSecondary,
  },
  expandedContent: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: FiColors.border + '30',
  },
  featureDescription: {
    fontSize: 14,
    color: FiColors.text,
    lineHeight: 20,
    marginBottom: 16,
  },
  benefitsSection: {
    marginBottom: 16,
  },
  benefitsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: FiColors.text,
    marginBottom: 8,
  },
  benefitItem: {
    fontSize: 13,
    color: FiColors.textSecondary,
    lineHeight: 18,
    marginBottom: 4,
  },
  timelineSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timelineLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: FiColors.text,
    marginRight: 8,
  },
  timelineText: {
    fontSize: 13,
    color: FiColors.primary,
    fontWeight: '500',
  },
  footer: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: FiColors.border + '30',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    color: FiColors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 12,
  },
  notifyButton: {
    backgroundColor: FiColors.gradient1,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  notifyButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
});

export default IsolatedComingSoonCard;