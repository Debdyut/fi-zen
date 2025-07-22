import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FadeInUp } from '../animations/AnimatedCard';
import RiskProfileAdapter from '../../utils/RiskProfileAdapter';

const RiskAdaptedCard = ({ userProfile, children, cardType = 'default' }) => {
  const uiAdaptations = RiskProfileAdapter.getUIAdaptations(userProfile.riskProfile);
  const messaging = RiskProfileAdapter.getRiskMessaging(userProfile.riskProfile);
  
  // Dynamic styles based on risk profile
  const dynamicStyles = StyleSheet.create({
    card: {
      backgroundColor: '#FFFFFF',
      borderRadius: 16,
      padding: 20,
      marginBottom: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
      borderLeftWidth: 4,
      borderLeftColor: uiAdaptations.primaryColor,
    },
    accentText: {
      color: uiAdaptations.primaryColor,
    },
    primaryButton: {
      backgroundColor: uiAdaptations.primaryColor,
      borderRadius: 12,
      paddingVertical: 12,
      paddingHorizontal: 20,
      alignItems: 'center',
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '600',
    }
  });

  // Risk-specific messaging
  const getRiskHeader = () => {
    const headers = {
      conservative: '🛡️ Safe & Steady Approach',
      moderate: '⚖️ Balanced Strategy',
      moderate_aggressive: '📈 Growth-Focused Plan',
      aggressive: '🚀 High-Growth Strategy',
      sophisticated_aggressive: '💎 Advanced Wealth Building',
      very_aggressive: '⚡ Maximum Growth Potential'
    };
    
    return headers[userProfile.riskProfile] || '💰 Financial Strategy';
  };

  const getRiskDescription = () => {
    const descriptions = {
      conservative: 'Prioritizing safety and steady returns',
      moderate: 'Balancing growth with security',
      moderate_aggressive: 'Seeking growth with calculated risks',
      aggressive: 'Maximizing long-term wealth potential',
      sophisticated_aggressive: 'Advanced strategies for experienced investors',
      very_aggressive: 'Pursuing maximum returns with high risk tolerance'
    };
    
    return descriptions[userProfile.riskProfile] || 'Tailored to your financial goals';
  };

  return (
    <FadeInUp delay={100}>
      <View style={dynamicStyles.card}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{getRiskHeader()}</Text>
          <Text style={styles.headerDescription}>{getRiskDescription()}</Text>
        </View>
        
        {children}
        
        <View style={styles.footer}>
          <Text style={[styles.riskLevel, dynamicStyles.accentText]}>
            Risk Level: {RiskProfileAdapter.getInvestmentRecommendations(userProfile.riskProfile).riskLevel}
          </Text>
        </View>
      </View>
    </FadeInUp>
  );
};

const styles = StyleSheet.create({
  header: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  headerDescription: {
    fontSize: 14,
    color: '#666666',
  },
  footer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  riskLevel: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'right',
  },
});

export default RiskAdaptedCard;
