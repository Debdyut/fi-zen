import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { EnhancedFiColors } from '../../theme/enhancedColors';
import { Icon } from './Icons';
import { AnimatedCard } from '../animations/AnimatedCard';

const ErrorState = ({ 
  type = 'general', 
  title, 
  message, 
  actionText, 
  onAction, 
  showIcon = true 
}) => {
  const errorConfigs = {
    network: {
      icon: '📡',
      defaultTitle: 'Connection Issue',
      defaultMessage: 'Unable to fetch your inflation data. Please check your internet connection.',
      actionText: 'Retry',
      color: EnhancedFiColors.warning,
    },
    data: {
      icon: '📊',
      defaultTitle: 'No Data Available',
      defaultMessage: 'We need your transaction data to calculate personal inflation rate.',
      actionText: 'Add Data',
      color: EnhancedFiColors.info,
    },
    calculation: {
      icon: '🧮',
      defaultTitle: 'Calculation Error',
      defaultMessage: 'Unable to calculate your inflation rate. Using estimated data.',
      actionText: 'Try Again',
      color: EnhancedFiColors.error,
    },
    permission: {
      icon: '🔒',
      defaultTitle: 'Permission Required',
      defaultMessage: 'We need access to your location for city-specific inflation rates.',
      actionText: 'Grant Permission',
      color: EnhancedFiColors.warning,
    },
    general: {
      icon: '⚠️',
      defaultTitle: 'Something went wrong',
      defaultMessage: 'An unexpected error occurred. Please try again.',
      actionText: 'Retry',
      color: EnhancedFiColors.error,
    },
  };

  const config = errorConfigs[type];
  const displayTitle = title || config.defaultTitle;
  const displayMessage = message || config.defaultMessage;
  const displayActionText = actionText || config.actionText;

  return (
    <AnimatedCard style={styles.container}>
      <View style={[styles.errorContainer, { borderColor: config.color + '30' }]}>
        {showIcon && (
          <View style={[styles.iconContainer, { backgroundColor: config.color + '10' }]}>
            <Text style={styles.errorIcon}>{config.icon}</Text>
          </View>
        )}
        
        <Text style={[styles.errorTitle, { color: config.color }]}>
          {displayTitle}
        </Text>
        
        <Text style={styles.errorMessage}>
          {displayMessage}
        </Text>
        
        {onAction && (
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: config.color }]}
            onPress={onAction}
            activeOpacity={0.8}
          >
            <Text style={styles.actionButtonText}>{displayActionText}</Text>
          </TouchableOpacity>
        )}
      </View>
    </AnimatedCard>
  );
};

const EmptyState = ({ 
  icon = '📊', 
  title = 'No Data Yet', 
  message = 'Start by adding your financial data to see insights.',
  actionText = 'Get Started',
  onAction 
}) => {
  return (
    <AnimatedCard style={styles.container}>
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconContainer}>
          <Text style={styles.emptyIcon}>{icon}</Text>
        </View>
        
        <Text style={styles.emptyTitle}>{title}</Text>
        <Text style={styles.emptyMessage}>{message}</Text>
        
        {onAction && (
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={onAction}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>{actionText}</Text>
          </TouchableOpacity>
        )}
      </View>
    </AnimatedCard>
  );
};

const DataQualityIndicator = ({ quality = 'good', confidence = 85, dataSource = 'estimated' }) => {
  const getQualityConfig = (quality) => {
    const configs = {
      excellent: { color: EnhancedFiColors.success, icon: '🎯', label: 'Excellent' },
      good: { color: EnhancedFiColors.info, icon: '✅', label: 'Good' },
      fair: { color: EnhancedFiColors.warning, icon: '⚠️', label: 'Fair' },
      poor: { color: EnhancedFiColors.error, icon: '❌', label: 'Poor' },
    };
    return configs[quality] || configs.fair;
  };

  const config = getQualityConfig(quality);

  return (
    <View style={styles.qualityContainer}>
      <View style={styles.qualityHeader}>
        <Text style={styles.qualityIcon}>{config.icon}</Text>
        <Text style={[styles.qualityLabel, { color: config.color }]}>
          Data Quality: {config.label}
        </Text>
      </View>
      
      <View style={styles.qualityDetails}>
        <Text style={styles.qualityText}>
          Confidence: {confidence}%
        </Text>
        <Text style={styles.qualityText}>
          Source: {dataSource === 'transactions' ? 'Your transactions' : 'Estimated data'}
        </Text>
      </View>
      
      <View style={styles.confidenceBar}>
        <View 
          style={[
            styles.confidenceFill, 
            { 
              width: `${confidence}%`, 
              backgroundColor: config.color 
            }
          ]} 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  errorContainer: {
    backgroundColor: EnhancedFiColors.surface,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  errorIcon: {
    fontSize: 28,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 14,
    color: EnhancedFiColors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  actionButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 120,
  },
  actionButtonText: {
    color: EnhancedFiColors.white,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  emptyContainer: {
    backgroundColor: EnhancedFiColors.surface,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: EnhancedFiColors.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyIcon: {
    fontSize: 36,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: EnhancedFiColors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyMessage: {
    fontSize: 14,
    color: EnhancedFiColors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  primaryButton: {
    backgroundColor: EnhancedFiColors.primary,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    minWidth: 140,
  },
  primaryButtonText: {
    color: EnhancedFiColors.white,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  qualityContainer: {
    backgroundColor: EnhancedFiColors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: EnhancedFiColors.border,
  },
  qualityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  qualityIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  qualityLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  qualityDetails: {
    marginBottom: 12,
  },
  qualityText: {
    fontSize: 12,
    color: EnhancedFiColors.textSecondary,
    marginBottom: 2,
  },
  confidenceBar: {
    height: 4,
    backgroundColor: EnhancedFiColors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  confidenceFill: {
    height: '100%',
    borderRadius: 2,
  },
});

export { ErrorState, EmptyState, DataQualityIndicator };
