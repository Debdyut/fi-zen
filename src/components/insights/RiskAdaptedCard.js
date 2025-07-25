import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FadeInUp } from '../animations/AnimatedCard';
import RiskProfileAdapter from '../../utils/RiskProfileAdapter';
import { useTheme } from '../../theme/ThemeContext';
import { getThemeColors } from '../../theme/consolidatedFiColors';

const RiskAdaptedCard = ({ userProfile, children, cardType = 'default' }) => {
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);
  const uiAdaptations = RiskProfileAdapter.getUIAdaptations(userProfile.riskProfile);
  const messaging = RiskProfileAdapter.getRiskMessaging(userProfile.riskProfile);
  
  // Dynamic styles based on risk profile and theme
  const dynamicStyles = StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderRadius: 20,
      padding: 20,
      marginBottom: 16,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 12,
      elevation: 6,
      borderLeftWidth: 4,
      borderLeftColor: uiAdaptations.primaryColor,
      borderWidth: 1,
      borderColor: colors.border,
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
      color: colors.textInverse,
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

const RiskAdaptedCard = ({ userProfile, children, cardType = 'default' }) => {
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);
  const uiAdaptations = RiskProfileAdapter.getUIAdaptations(userProfile.riskProfile);
  const messaging = RiskProfileAdapter.getRiskMessaging(userProfile.riskProfile);
  
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

  // Dynamic styles based on risk profile and theme
  const dynamicStyles = StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderRadius: 20,
      padding: 20,
      marginBottom: 16,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 12,
      elevation: 6,
      borderLeftWidth: 4,
      borderLeftColor: uiAdaptations.primaryColor,
      borderWidth: 1,
      borderColor: colors.border,
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
      color: colors.textInverse,
      fontSize: 14,
      fontWeight: '600',
    }
  });

  const styles = StyleSheet.create({
  header: {
    marginBottom: 16,
  },
    headerTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
    },
    headerDescription: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    footer: {
      marginTop: 12,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    riskLevel: {
      fontSize: 12,
      fontWeight: '600',
      textAlign: 'right',
    },
  });

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

export default RiskAdaptedCard;

export default RiskAdaptedCard;
