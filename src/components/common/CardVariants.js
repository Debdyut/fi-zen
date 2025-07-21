import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { getThemeColors, getFiStyles } from '../../theme/consolidatedFiColors';

/**
 * Card Variants Component
 * Demonstrates different card styles for various use cases
 * 
 * Usage:
 * - Default: White cards in light mode, dark cards in dark mode
 * - Yellow: Light pastel yellow for warnings/highlights
 * - Teal: Light pastel teal for success/positive actions
 * - Red: Light pastel red for alerts/errors
 */

const CardVariants = ({ children }) => {
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);
  const fiStyles = getFiStyles(colors);

  const DefaultCard = ({ title, children }) => (
    <View style={fiStyles.card}>
      {title && <Text style={[styles.cardTitle, { color: colors.text }]}>{title}</Text>}
      {children}
    </View>
  );

  const AttentionCard = ({ title, children, variant = 'yellow' }) => {
    const getCardStyle = () => {
      switch (variant) {
        case 'yellow':
          return fiStyles.cardAttentionYellow;
        case 'teal':
          return fiStyles.cardAttentionTeal;
        case 'red':
          return fiStyles.cardAttentionRed;
        default:
          return fiStyles.card;
      }
    };

    return (
      <View style={getCardStyle()}>
        {title && <Text style={[styles.cardTitle, { color: colors.text }]}>{title}</Text>}
        {children}
      </View>
    );
  };

  return {
    DefaultCard,
    AttentionCard,
  };
};

const styles = StyleSheet.create({
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
});

export default CardVariants;

// Export individual card components for direct use
export const useCardVariants = () => {
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);
  const fiStyles = getFiStyles(colors);

  return {
    // Default white card in light mode
    defaultCard: fiStyles.card,
    
    // Attention cards (light pastels in light mode)
    yellowCard: fiStyles.cardAttentionYellow,
    tealCard: fiStyles.cardAttentionTeal,
    redCard: fiStyles.cardAttentionRed,
    
    colors,
  };
};