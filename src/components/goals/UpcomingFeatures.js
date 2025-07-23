// Upcoming Features Component for Goals Screen
// Showcases next-generation enhancements coming to Fi-Zen

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { FadeInUp } from '../animations/AnimatedCard';
import { TouchableArea } from '../common/AccessibilityHelpers';

const FiColors = {
  primary: '#00D4AA',
  success: '#00D4AA',
  warning: '#FFB800',
  error: '#FF6B6B',
  background: '#FFFFFF',
  surface: '#F8F9FA',
  text: '#1A1A1A',
  textSecondary: '#666666',
  border: '#E0E0E0',
  gradient: ['#00D4AA', '#00B894'],
};

const upcomingFeatures = [
  {
    phase: 'Phase 1',
    timeline: 'Q2 2025',
    title: 'AI-Powered Intelligence',
    features: [
      {
        id: 'ai_autopilot',
        name: 'AI Goal Autopilot',
        icon: '🤖',
        status: 'In Development',
        statusColor: '#FFB800',
        description: 'Fully autonomous goal management that learns from your behavior',
        benefits: [
          'Auto-adjusts contributions based on spending patterns',
          'Real-time goal rebalancing during market changes',
          'Predictive failure prevention with smart recommendations'
        ],
        impact: '+60% goal achievement rate'
      },
      {
        id: 'predictive_planning',
        name: 'Predictive Life Event Planning',
        icon: '🔮',
        status: 'Research Phase',
        statusColor: '#00D4AA',
        description: 'AI predicts major life changes and creates preparatory goals',
        benefits: [
          'Marriage, career change, and parenthood predictions',
          'Automatic preparatory goals 6-12 months in advance',
          'Industry-specific career progression planning'
        ],
        impact: '+40% user satisfaction'
      }
    ]
  },
  {
    phase: 'Phase 2',
    timeline: 'Q3 2025',
    title: 'Market Intelligence',
    features: [
      {
        id: 'market_linked',
        name: 'Real-Time Market-Linked Goals',
        icon: '📈',
        status: 'Planning Phase',
        statusColor: '#666666',
        description: 'Goals that dynamically adapt to market conditions',
        benefits: [
          'Inflation-adjusted targets in real-time',
          'Market volatility-based timeline adjustments',
          'Economic downturn protection protocols'
        ],
        impact: 'Smart market adaptation'
      },
      {
        id: 'scenario_modeling',
        name: 'Advanced Scenario Modeling',
        icon: '🎯',
        status: 'Concept Phase',
        statusColor: '#666666',
        description: 'Monte Carlo simulations for goal achievement probability',
        benefits: [
          'Multiple economic scenario testing',
          'Risk-adjusted timeline projections',
          'Confidence intervals for achievement'
        ],
        impact: 'Data-driven planning'
      }
    ]
  },
  {
    phase: 'Phase 3',
    timeline: 'Q4 2025',
    title: 'Conversational Interface',
    features: [
      {
        id: 'voice_management',
        name: 'Voice-Activated Goal Management',
        icon: '🎤',
        status: 'Prototype Phase',
        statusColor: '#00D4AA',
        description: 'Natural language interface for goal interaction',
        benefits: [
          'Voice commands for goal updates and queries',
          'Smart speaker integration (Alexa, Google)',
          'Multilingual support (Hindi, English, regional)'
        ],
        impact: '+80% daily active usage'
      },
      {
        id: 'ai_coach',
        name: 'AI Financial Coach',
        icon: '🧠',
        status: 'Research Phase',
        statusColor: '#00D4AA',
        description: 'Personalized AI advisor for goal optimization',
        benefits: [
          'Natural language goal consultation',
          'Behavioral pattern analysis and coaching',
          'Emotional spending intervention'
        ],
        impact: 'Personalized guidance'
      }
    ]
  },
  {
    phase: 'Phase 4',
    timeline: 'Q1 2026',
    title: 'Social & Community',
    features: [
      {
        id: 'social_challenges',
        name: 'Social Goal Challenges',
        icon: '👥',
        status: 'Design Phase',
        statusColor: '#666666',
        description: 'Gamified peer-to-peer goal achievement platform',
        benefits: [
          'Friend and colleague goal challenges',
          'Anonymous peer comparison by profession',
          'Achievement sharing and celebrations'
        ],
        impact: '+150% user retention'
      }
    ]
  }
];

const FeatureCard = ({ feature, onLearnMore }) => {
  const getStatusStyle = (status, color) => ({
    backgroundColor: color + '20',
    color: color,
  });

  return (
    <FadeInUp delay={100}>
      <View style={styles.featureCard}>
        <View style={styles.featureHeader}>
          <View style={styles.featureIconContainer}>
            <Text style={styles.featureIcon}>{feature.icon}</Text>
          </View>
          <View style={styles.featureInfo}>
            <Text style={styles.featureName}>{feature.name}</Text>
            <View style={[styles.statusBadge, getStatusStyle(feature.status, feature.statusColor)]}>
              <Text style={[styles.statusText, { color: feature.statusColor }]}>
                {feature.status}
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.featureDescription}>{feature.description}</Text>

        <View style={styles.benefitsList}>
          {feature.benefits.slice(0, 2).map((benefit, index) => (
            <View key={index} style={styles.benefitItem}>
              <Text style={styles.benefitBullet}>•</Text>
              <Text style={styles.benefitText}>{benefit}</Text>
            </View>
          ))}
        </View>

        <View style={styles.featureFooter}>
          <View style={styles.impactContainer}>
            <Text style={styles.impactLabel}>Expected Impact:</Text>
            <Text style={styles.impactValue}>{feature.impact}</Text>
          </View>
          <TouchableArea 
            style={styles.learnMoreButton}
            onPress={() => onLearnMore(feature)}
          >
            <Text style={styles.learnMoreText}>Learn More</Text>
          </TouchableArea>
        </View>
      </View>
    </FadeInUp>
  );
};

const PhaseSection = ({ phase, onFeatureSelect }) => (
  <View style={styles.phaseSection}>
    <View style={styles.phaseHeader}>
      <View style={styles.phaseIndicator}>
        <Text style={styles.phaseNumber}>{phase.phase.split(' ')[1]}</Text>
      </View>
      <View style={styles.phaseInfo}>
        <Text style={styles.phaseTitle}>{phase.title}</Text>
        <Text style={styles.phaseTimeline}>{phase.timeline}</Text>
      </View>
    </View>

    <View style={styles.featuresContainer}>
      {phase.features.map(feature => (
        <FeatureCard
          key={feature.id}
          feature={feature}
          onLearnMore={onFeatureSelect}
        />
      ))}
    </View>
  </View>
);

const BetaAccessCard = ({ onJoinBeta }) => (
  <FadeInUp delay={300}>
    <View style={styles.betaCard}>
      <View style={styles.betaHeader}>
        <Text style={styles.betaIcon}>🚀</Text>
        <View>
          <Text style={styles.betaTitle}>Join Beta Testing</Text>
          <Text style={styles.betaSubtitle}>Get early access to upcoming features</Text>
        </View>
      </View>

      <View style={styles.betaFeatures}>
        <Text style={styles.betaFeaturesTitle}>Available in Beta:</Text>
        <Text style={styles.betaFeatureItem}>• AI Goal Autopilot (Limited Beta)</Text>
        <Text style={styles.betaFeatureItem}>• Voice Commands (Prototype)</Text>
        <Text style={styles.betaFeatureItem}>• Predictive Planning (Alpha)</Text>
      </View>

      <TouchableArea style={styles.betaButton} onPress={onJoinBeta}>
        <Text style={styles.betaButtonText}>Request Beta Access</Text>
      </TouchableArea>
    </View>
  </FadeInUp>
);

const UpcomingFeatures = ({ navigation }) => {
  const [selectedFeature, setSelectedFeature] = useState(null);

  const handleFeatureSelect = (feature) => {
    setSelectedFeature(feature);
    // Could navigate to detailed feature page or show modal
    console.log('Selected feature:', feature.name);
  };

  const handleJoinBeta = () => {
    // Navigate to beta signup or show modal
    console.log('Join beta requested');
    // navigation.navigate('BetaSignup');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🚀 Upcoming Features</Text>
        <Text style={styles.headerSubtitle}>
          Next-generation enhancements coming to Fi-Zen Goals
        </Text>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {upcomingFeatures.map((phase, index) => (
          <PhaseSection
            key={phase.phase}
            phase={phase}
            onFeatureSelect={handleFeatureSelect}
          />
        ))}

        <BetaAccessCard onJoinBeta={handleJoinBeta} />

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            🎯 Ready to revolutionize personal finance with AI-powered goal management!
          </Text>
          <Text style={styles.footerSubtext}>
            Stay tuned for regular updates and early access opportunities.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: FiColors.background,
  },
  header: {
    padding: 20,
    backgroundColor: FiColors.surface,
    borderBottomWidth: 1,
    borderBottomColor: FiColors.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: FiColors.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: FiColors.textSecondary,
    lineHeight: 22,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  
  // Phase Section Styles
  phaseSection: {
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  phaseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  phaseIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: FiColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  phaseNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: FiColors.background,
  },
  phaseInfo: {
    flex: 1,
  },
  phaseTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: FiColors.text,
    marginBottom: 2,
  },
  phaseTimeline: {
    fontSize: 14,
    color: FiColors.textSecondary,
    fontWeight: '500',
  },
  featuresContainer: {
    gap: 12,
  },

  // Feature Card Styles
  featureCard: {
    backgroundColor: FiColors.background,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: FiColors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  featureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: FiColors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  featureIcon: {
    fontSize: 24,
  },
  featureInfo: {
    flex: 1,
  },
  featureName: {
    fontSize: 18,
    fontWeight: '600',
    color: FiColors.text,
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  featureDescription: {
    fontSize: 14,
    color: FiColors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  benefitsList: {
    marginBottom: 16,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  benefitBullet: {
    fontSize: 14,
    color: FiColors.primary,
    marginRight: 8,
    marginTop: 2,
  },
  benefitText: {
    fontSize: 14,
    color: FiColors.text,
    flex: 1,
    lineHeight: 20,
  },
  featureFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  impactContainer: {
    flex: 1,
  },
  impactLabel: {
    fontSize: 12,
    color: FiColors.textSecondary,
    marginBottom: 2,
  },
  impactValue: {
    fontSize: 14,
    fontWeight: '600',
    color: FiColors.primary,
  },
  learnMoreButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: FiColors.primary + '20',
  },
  learnMoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: FiColors.primary,
  },

  // Beta Card Styles
  betaCard: {
    backgroundColor: '#E6FBF7',
    borderRadius: 16,
    padding: 20,
    margin: 16,
    borderWidth: 1,
    borderColor: FiColors.primary + '40',
  },
  betaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  betaIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  betaTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: FiColors.text,
    marginBottom: 2,
  },
  betaSubtitle: {
    fontSize: 14,
    color: FiColors.textSecondary,
  },
  betaFeatures: {
    marginBottom: 16,
  },
  betaFeaturesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: FiColors.text,
    marginBottom: 8,
  },
  betaFeatureItem: {
    fontSize: 14,
    color: FiColors.textSecondary,
    marginBottom: 4,
  },
  betaButton: {
    backgroundColor: FiColors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  betaButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: FiColors.background,
  },

  // Footer Styles
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    fontWeight: '600',
    color: FiColors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  footerSubtext: {
    fontSize: 14,
    color: FiColors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default UpcomingFeatures;
