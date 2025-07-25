import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import aiContextManager from '../../services/AIContextManager';

const FiMonetizationWidget = ({ user, screenType, onUpgrade }) => {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const getFiProFeatures = () => {
    const baseFeatures = [
      {
        icon: '🤖',
        title: 'Advanced AI Insights',
        description: 'Get deeper financial analysis with AI-powered recommendations',
        value: 'Unlimited AI conversations'
      },
      {
        icon: '📊',
        title: 'Premium Analytics',
        description: 'Advanced spending patterns and investment performance tracking',
        value: 'Detailed reports & forecasts'
      },
      {
        icon: '🎯',
        title: 'Goal Acceleration',
        description: 'AI-optimized strategies to reach your financial goals faster',
        value: 'Personalized action plans'
      },
      {
        icon: '💎',
        title: 'Priority Support',
        description: '24/7 premium customer support with dedicated relationship manager',
        value: 'Instant support access'
      },
      {
        icon: '🔒',
        title: 'Advanced Security',
        description: 'Enhanced security features and fraud protection',
        value: 'Bank-grade security'
      }
    ];

    // Screen-specific feature highlighting
    switch (screenType) {
      case 'insights':
        return baseFeatures.filter(f => 
          ['Advanced AI Insights', 'Premium Analytics'].includes(f.title)
        );
      case 'goals':
        return baseFeatures.filter(f => 
          ['Goal Acceleration', 'Advanced AI Insights'].includes(f.title)
        );
      case 'breakdown':
        return baseFeatures.filter(f => 
          ['Premium Analytics', 'Advanced AI Insights'].includes(f.title)
        );
      default:
        return baseFeatures.slice(0, 2);
    }
  };

  const getUpgradeIncentive = () => {
    const monthlyIncome = user.profile?.monthlyIncome || 50000;
    const potentialSavings = Math.round(monthlyIncome * 0.15); // 15% potential savings
    
    return {
      savings: potentialSavings,
      roi: Math.round((potentialSavings * 12) / 999), // ROI based on ₹999 annual fee
      message: `Fi Pro users save an average of ₹${potentialSavings.toLocaleString()} monthly`
    };
  };

  const features = getFiProFeatures();
  const incentive = getUpgradeIncentive();

  const handleUpgradePress = () => {
    // Track Fi Pro interest
    aiContextManager.trackCrossSellEvent('fi_pro_interest', 'Fi Pro', {
      screen: screenType,
      potentialSavings: incentive.savings,
      roi: incentive.roi
    });
    
    setShowUpgradeModal(true);
  };

  const handleConfirmUpgrade = () => {
    // Track Fi Pro conversion
    aiContextManager.trackCrossSellEvent('conversion', 'Fi Pro', {
      conversionType: 'subscription',
      revenue: 999,
      screen: screenType
    });
    
    setShowUpgradeModal(false);
    onUpgrade?.({
      plan: 'Fi Pro',
      price: 999,
      billing: 'annual',
      features: getFiProFeatures()
    });
  };

  const handleLearnMore = () => {
    // Track learn more interest
    aiContextManager.trackCrossSellEvent('learn_more', 'Fi Pro', {
      screen: screenType,
      interactionType: 'learn_more_click'
    });
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Upgrade to Fi Pro</Text>
            <View style={styles.priceBadge}>
              <Text style={styles.priceText}>₹999/year</Text>
            </View>
          </View>
          <Text style={styles.incentive}>{incentive.message}</Text>
        </View>

        <View style={styles.featuresContainer}>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <Text style={styles.featureIcon}>{feature.icon}</Text>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.valueProposition}>
          <Text style={styles.valueText}>
            🚀 {incentive.roi}x ROI • Save ₹{incentive.savings.toLocaleString()}/month
          </Text>
        </View>

        <TouchableOpacity style={styles.upgradeButton} onPress={handleUpgradePress}>
          <Text style={styles.upgradeButtonText}>Upgrade to Fi Pro</Text>
          <Text style={styles.upgradeSubtext}>7-day free trial</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.learnMoreButton} onPress={handleLearnMore}>
          <Text style={styles.learnMoreText}>Learn more about Fi Pro →</Text>
        </TouchableOpacity>
      </View>

      {/* Upgrade Confirmation Modal */}
      <Modal
        visible={showUpgradeModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowUpgradeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Upgrade to Fi Pro</Text>
            <Text style={styles.modalSubtitle}>
              Start your 7-day free trial and unlock premium features
            </Text>

            <View style={styles.modalFeatures}>
              <Text style={styles.modalFeaturesTitle}>What you'll get:</Text>
              {getFiProFeatures().slice(0, 3).map((feature, index) => (
                <View key={index} style={styles.modalFeatureItem}>
                  <Text style={styles.modalFeatureIcon}>{feature.icon}</Text>
                  <Text style={styles.modalFeatureText}>{feature.title}</Text>
                </View>
              ))}
            </View>

            <View style={styles.modalPricing}>
              <Text style={styles.modalPrice}>₹999/year</Text>
              <Text style={styles.modalPriceSubtext}>
                That's just ₹83/month • Cancel anytime
              </Text>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.modalCancelButton}
                onPress={() => setShowUpgradeModal(false)}
              >
                <Text style={styles.modalCancelText}>Maybe Later</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalConfirmButton}
                onPress={handleConfirmUpgrade}
              >
                <Text style={styles.modalConfirmText}>Start Free Trial</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    backgroundColor: '#6366F1',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
  },
  header: {
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  priceBadge: {
    backgroundColor: '#FFFFFF20',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  priceText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  incentive: {
    fontSize: 12,
    color: '#FFFFFF90',
  },
  featuresContainer: {
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureIcon: {
    fontSize: 16,
    marginRight: 12,
    width: 20,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  featureDescription: {
    fontSize: 11,
    color: '#FFFFFF80',
    lineHeight: 14,
  },
  valueProposition: {
    backgroundColor: '#FFFFFF20',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  valueText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  upgradeButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  upgradeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1',
  },
  upgradeSubtext: {
    fontSize: 10,
    color: '#6366F1',
    marginTop: 2,
  },
  learnMoreButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  learnMoreText: {
    fontSize: 12,
    color: '#FFFFFF80',
    textDecorationLine: 'underline',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 24,
  },
  modalFeatures: {
    marginBottom: 24,
  },
  modalFeaturesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  modalFeatureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalFeatureIcon: {
    fontSize: 16,
    marginRight: 12,
    width: 20,
  },
  modalFeatureText: {
    fontSize: 13,
    color: '#1A1A1A',
  },
  modalPricing: {
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
  },
  modalPrice: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  modalPriceSubtext: {
    fontSize: 12,
    color: '#666666',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  modalConfirmButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#6366F1',
    alignItems: 'center',
  },
  modalConfirmText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default FiMonetizationWidget;
