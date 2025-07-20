import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FiColors } from '../../theme/consolidatedFiColors';

// Professional icon component using emoji with better styling
const Icon = ({ name, size = 20, color = FiColors.text, style = {} }) => {
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
    if (rate < 3) return { icon: '🤑', color: FiColors.success };
    if (rate < 6) return { icon: '😊', color: FiColors.inflationLow };
    if (rate < 9) return { icon: '😐', color: FiColors.inflationModerate };
    if (rate < 12) return { icon: '😟', color: FiColors.inflationHigh };
    if (rate < 15) return { icon: '😰', color: FiColors.inflationVeryHigh };
    return { icon: '😱', color: FiColors.error };
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
    food: { icon: '🍽️', color: FiColors.primary },
    housing: { icon: '🏠', color: FiColors.primaryLight },
    transport: { icon: '🚗', color: FiColors.primaryDark },
    healthcare: { icon: '🏥', color: FiColors.success },
    education: { icon: '📚', color: FiColors.info },
    entertainment: { icon: '🎬', color: FiColors.warning },
    clothing: { icon: '👕', color: FiColors.textSecondary },
    debt_payments: { icon: '💳', color: FiColors.error },
    miscellaneous: { icon: '📦', color: FiColors.textTertiary },
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
