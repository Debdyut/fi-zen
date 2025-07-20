import React, { useRef } from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  Animated, 
  Vibration,
  Platform 
} from 'react-native';
import { EnhancedFiColors } from '../../theme/enhancedColors';
import { Icon } from './Icons';

const EnhancedButton = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  icon,
  iconPosition = 'left',
  disabled = false,
  loading = false,
  hapticFeedback = true,
  style = {},
  textStyle = {},
  ...props
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (hapticFeedback && Platform.OS === 'ios') {
      Vibration.vibrate(10);
    }
    
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    if (!disabled && !loading && onPress) {
      onPress();
    }
  };

  const getVariantStyles = () => {
    const variants = {
      primary: {
        backgroundColor: disabled ? EnhancedFiColors.secondary + '40' : EnhancedFiColors.primary,
        borderColor: 'transparent',
      },
      secondary: {
        backgroundColor: EnhancedFiColors.primary + '10',
        borderColor: EnhancedFiColors.primary + '30',
      },
      outline: {
        backgroundColor: 'transparent',
        borderColor: disabled ? EnhancedFiColors.secondary + '40' : EnhancedFiColors.primary,
      },
      ghost: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
      },
      success: {
        backgroundColor: disabled ? EnhancedFiColors.secondary + '40' : EnhancedFiColors.success,
        borderColor: 'transparent',
      },
      warning: {
        backgroundColor: disabled ? EnhancedFiColors.secondary + '40' : EnhancedFiColors.warning,
        borderColor: 'transparent',
      },
      error: {
        backgroundColor: disabled ? EnhancedFiColors.secondary + '40' : EnhancedFiColors.error,
        borderColor: 'transparent',
      },
    };
    return variants[variant] || variants.primary;
  };

  const getSizeStyles = () => {
    const sizes = {
      small: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 6,
        fontSize: 12,
      },
      medium: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
        fontSize: 14,
      },
      large: {
        paddingHorizontal: 28,
        paddingVertical: 16,
        borderRadius: 12,
        fontSize: 16,
      },
    };
    return sizes[size] || sizes.medium;
  };

  const getTextColor = () => {
    if (disabled) return EnhancedFiColors.textTertiary;
    
    const textColors = {
      primary: EnhancedFiColors.white,
      secondary: EnhancedFiColors.primary,
      outline: EnhancedFiColors.primary,
      ghost: EnhancedFiColors.primary,
      success: EnhancedFiColors.white,
      warning: EnhancedFiColors.white,
      error: EnhancedFiColors.white,
    };
    return textColors[variant] || EnhancedFiColors.white;
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();
  const textColor = getTextColor();

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: variantStyles.backgroundColor,
            borderColor: variantStyles.borderColor,
            paddingHorizontal: sizeStyles.paddingHorizontal,
            paddingVertical: sizeStyles.paddingVertical,
            borderRadius: sizeStyles.borderRadius,
            opacity: disabled ? 0.6 : 1,
          },
          style,
        ]}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={0.8}
        {...props}
      >
        {loading ? (
          <Text style={[styles.buttonText, { color: textColor, fontSize: sizeStyles.fontSize }]}>
            Loading...
          </Text>
        ) : (
          <>
            {icon && iconPosition === 'left' && (
              <Icon 
                name={icon} 
                size={sizeStyles.fontSize + 2} 
                color={textColor} 
                style={styles.iconLeft} 
              />
            )}
            
            <Text 
              style={[
                styles.buttonText, 
                { color: textColor, fontSize: sizeStyles.fontSize },
                textStyle
              ]}
            >
              {title}
            </Text>
            
            {icon && iconPosition === 'right' && (
              <Icon 
                name={icon} 
                size={sizeStyles.fontSize + 2} 
                color={textColor} 
                style={styles.iconRight} 
              />
            )}
          </>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const FloatingActionButton = ({
  onPress,
  icon = 'refresh',
  size = 56,
  backgroundColor = EnhancedFiColors.primary,
  hapticFeedback = true,
  style = {},
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (hapticFeedback && Platform.OS === 'ios') {
      Vibration.vibrate(10);
    }
    
    Animated.spring(scaleAnim, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[
          styles.fab,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor,
          },
          style,
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.8}
      >
        <Icon name={icon} size={size * 0.4} color={EnhancedFiColors.white} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const ButtonGroup = ({ buttons, selectedIndex, onPress, style = {} }) => {
  return (
    <div style={[styles.buttonGroup, style]}>
      {buttons.map((button, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.groupButton,
            index === 0 && styles.firstButton,
            index === buttons.length - 1 && styles.lastButton,
            selectedIndex === index && styles.selectedButton,
          ]}
          onPress={() => onPress(index)}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.groupButtonText,
              selectedIndex === index && styles.selectedButtonText,
            ]}
          >
            {button}
          </Text>
        </TouchableOpacity>
      ))}
    </div>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    minHeight: 44, // Accessibility requirement
  },
  buttonText: {
    fontWeight: '600',
    textAlign: 'center',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
  fab: {
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: EnhancedFiColors.shadow.medium,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonGroup: {
    flexDirection: 'row',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: EnhancedFiColors.border,
  },
  groupButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: EnhancedFiColors.surface,
    borderRightWidth: 1,
    borderRightColor: EnhancedFiColors.border,
  },
  firstButton: {
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  lastButton: {
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    borderRightWidth: 0,
  },
  selectedButton: {
    backgroundColor: EnhancedFiColors.primary,
  },
  groupButtonText: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
    color: EnhancedFiColors.text,
  },
  selectedButtonText: {
    color: EnhancedFiColors.white,
  },
});

export { EnhancedButton, FloatingActionButton, ButtonGroup };
