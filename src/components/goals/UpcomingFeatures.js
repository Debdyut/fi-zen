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
      {phase.features.map((feature, index) => (
        <FeatureCard
          key={`${feature.id}-${index}`}
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

const UpcomingFeatures = ({ navigation, onClose }) => {
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
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>🚀 Upcoming Features</Text>
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={onClose || (() => navigation.canGoBack() ? navigation.goBack() : navigation.navigate('MainTabs'))}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.headerSubtitle}>
          Next-generation enhancements coming to Fi-Zen Goals
        </Text>
      </View>

      <ScrollView 
        style={[styles.content, { height: '100%' }]} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        nestedScrollEnabled={true}
      >
        {upcomingFeatures.slice(0, 4).map((phase, index) => (
          <PhaseSection
            key={`${phase.phase}-${index}`}
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
    backgroundColor: '#E6FBF7',
  },
  header: {
    padding: 20,
    marginBottom: 8,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: FiColors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: FiColors.text,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: FiColors.text,
    flex: 1,
  },
  headerSubtitle: {
    fontSize: 16,
    color: FiColors.text,
    lineHeight: 22,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 500,
    minHeight: '100%',
  },
  
  // Phase Section Styles
  phaseSection: {
    marginVertical: 12,
    paddingHorizontal: 16,
  },
  phaseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  phaseIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: FiColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  phaseNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: FiColors.background,
  },
  phaseInfo: {
    flex: 1,
  },
  phaseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: FiColors.text,
    marginBottom: 2,
  },
  phaseTimeline: {
    fontSize: 12,
    color: FiColors.textSecondary,
    fontWeight: '500',
  },
  featuresContainer: {
    gap: 8,
  },

  // Feature Card Styles
  featureCard: {
    backgroundColor: FiColors.background,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: FiColors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  featureHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  featureIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: FiColors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginTop: 2,
  },
  featureIcon: {
    fontSize: 16,
  },
  featureInfo: {
    flex: 1,
  },
  featureName: {
    fontSize: 15,
    fontWeight: '600',
    color: FiColors.text,
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  featureDescription: {
    fontSize: 12,
    color: FiColors.textSecondary,
    lineHeight: 16,
    marginBottom: 8,
  },
  benefitsList: {
    marginBottom: 10,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 2,
  },
  benefitBullet: {
    fontSize: 12,
    color: FiColors.primary,
    marginRight: 6,
    marginTop: 1,
  },
  benefitText: {
    fontSize: 11,
    color: FiColors.text,
    flex: 1,
    lineHeight: 14,
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
    fontSize: 10,
    color: FiColors.textSecondary,
    marginBottom: 1,
  },
  impactValue: {
    fontSize: 12,
    fontWeight: '600',
    color: FiColors.primary,
  },
  learnMoreButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: FiColors.primary + '20',
  },
  learnMoreText: {
    fontSize: 11,
    fontWeight: '600',
    color: FiColors.primary,
  },

  // Beta Card Styles
  betaCard: {
    backgroundColor: '#E6FBF7',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    borderWidth: 1,
    borderColor: FiColors.primary + '40',
  },
  betaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  betaIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  betaTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: FiColors.text,
    marginBottom: 2,
  },
  betaSubtitle: {
    fontSize: 12,
    color: FiColors.textSecondary,
  },
  betaFeatures: {
    marginBottom: 12,
  },
  betaFeaturesTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: FiColors.text,
    marginBottom: 6,
  },
  betaFeatureItem: {
    fontSize: 12,
    color: FiColors.textSecondary,
    marginBottom: 2,
  },
  betaButton: {
    backgroundColor: FiColors.primary,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  betaButtonText: {
    fontSize: 14,
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
