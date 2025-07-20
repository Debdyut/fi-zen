import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { EnhancedFiColors } from '../../theme/enhancedColors';

// Professional icon component using emoji with better styling
const Icon = ({ name, size = 20, color = EnhancedFiColors.text, style = {} }) => {
  const iconMap = {
    // Financial icons
    'trending-up': '📈',
    'trending-down': '📉',
    'dollar': '💰',
    'bank': '🏦',
    'credit-card': '💳',
    'chart-pie': '📊',
    'calculator': '🧮',
    'wallet': '👛',
    'coins': '🪙',
    'receipt': '🧾',
    
    // Location icons
    'location': '📍',
    'map': '🗺️',
    'home': '🏠',
    'building': '🏢',
    'city': '🏙️',
    
    // Category icons
    'food': '🍽️',
    'transport': '🚗',
    'healthcare': '🏥',
    'education': '📚',
    'entertainment': '🎬',
    'shopping': '🛍️',
    'utilities': '⚡',
    
    // Status icons
    'check': '✅',
    'warning': '⚠️',
    'error': '❌',
    'info': 'ℹ️',
    'star': '⭐',
    'fire': '🔥',
    'rocket': '🚀',
    'target': '🎯',
    
    // Action icons
    'refresh': '🔄',
    'settings': '⚙️',
    'edit': '✏️',
    'share': '📤',
    'download': '⬇️',
    'upload': '⬆️',
    'search': '🔍',
    'filter': '🔽',
    
    // Emotion icons
    'happy': '😊',
    'sad': '😢',
    'neutral': '😐',
    'excited': '🤩',
    'worried': '😰',
    'confident': '😎',
  };

  return (
    <View style={[styles.iconContainer, { width: size, height: size }, style]}>
      <Text style={[styles.icon, { fontSize: size * 0.8, color }]}>
        {iconMap[name] || '❓'}
      </Text>
    </View>
  );
};

// Specialized inflation status icon
const InflationStatusIcon = ({ inflationRate, size = 24 }) => {
  const getStatusIcon = (rate) => {
    if (rate < 3) return { icon: '🤑', color: EnhancedFiColors.inflationVeryLow };
    if (rate < 6) return { icon: '😊', color: EnhancedFiColors.inflationLow };
    if (rate < 9) return { icon: '😐', color: EnhancedFiColors.inflationModerate };
    if (rate < 12) return { icon: '😟', color: EnhancedFiColors.inflationHigh };
    if (rate < 15) return { icon: '😰', color: EnhancedFiColors.inflationVeryHigh };
    return { icon: '😱', color: EnhancedFiColors.inflationExtreme };
  };

  const status = getStatusIcon(inflationRate);

  return (
    <View style={[styles.statusIconContainer, { backgroundColor: status.color + '20' }]}>
      <Text style={[styles.statusIcon, { fontSize: size }]}>
        {status.icon}
      </Text>
    </View>
  );
};

// Category icon with background
const CategoryIcon = ({ category, size = 32, showBackground = true }) => {
  const categoryConfig = {
    food: { icon: '🍽️', color: EnhancedFiColors.chartColors[0] },
    housing: { icon: '🏠', color: EnhancedFiColors.chartColors[1] },
    transport: { icon: '🚗', color: EnhancedFiColors.chartColors[2] },
    healthcare: { icon: '🏥', color: EnhancedFiColors.chartColors[3] },
    education: { icon: '📚', color: EnhancedFiColors.chartColors[4] },
    entertainment: { icon: '🎬', color: EnhancedFiColors.chartColors[5] },
    clothing: { icon: '👕', color: EnhancedFiColors.chartColors[6] },
    debt_payments: { icon: '💳', color: EnhancedFiColors.error },
    miscellaneous: { icon: '📦', color: EnhancedFiColors.secondary },
  };

  const config = categoryConfig[category] || categoryConfig.miscellaneous;

  return (
    <View
      style={[
        styles.categoryIconContainer,
        {
          width: size,
          height: size,
          backgroundColor: showBackground ? config.color + '20' : 'transparent',
          borderRadius: size / 2,
        },
      ]}
    >
      <Text style={[styles.categoryIcon, { fontSize: size * 0.6 }]}>
        {config.icon}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    textAlign: 'center',
  },
  statusIconContainer: {
    borderRadius: 12,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusIcon: {
    textAlign: 'center',
  },
  categoryIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryIcon: {
    textAlign: 'center',
  },
});

export { Icon, InflationStatusIcon, CategoryIcon };
