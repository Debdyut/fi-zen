import React from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity, AccessibilityInfo } from 'react-native';
import { FiColors } from '../../theme/consolidatedFiColors';

// Ensures minimum touch target size of 44x44 points (iOS HIG & Android guidelines)
const TouchableArea = ({ 
  children, 
  minSize = 44, 
  style = {},
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole = 'button',
  onPress,
  ...props 
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.touchableArea,
        {
          minWidth: minSize,
          minHeight: minSize,
        },
        style,
      ]}
      accessible={true}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityRole={accessibilityRole}
      onPress={onPress}
      {...props}
    >
      {children}
    </TouchableOpacity>
  );
};

// Screen reader friendly text with proper semantics
const AccessibleText = ({ 
  children, 
  accessibilityLabel,
  accessibilityRole = 'text',
  style = {},
  ...props 
}) => {
  return (
    <Text
      style={style}
      accessible={true}
      accessibilityLabel={accessibilityLabel || children}
      accessibilityRole={accessibilityRole}
      {...props}
    >
      {children}
    </Text>
  );
};

// Accessible card with proper focus management
const AccessibleCard = ({ 
  children, 
  title,
  description,
  onPress,
  style = {},
  ...props 
}) => {
  const accessibilityLabel = title + (description ? `. ${description}` : '');
  
  return (
    <View
      style={[styles.accessibleCard, style]}
      accessible={true}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={onPress ? 'button' : 'text'}
      accessibilityHint={onPress ? 'Double tap to interact' : undefined}
      onPress={onPress}
      {...props}
    >
      {children}
    </View>
  );
};

// High contrast mode support
const HighContrastText = ({ 
  children, 
  style = {},
  highContrastStyle = {},
  ...props 
}) => {
  // In a real app, you'd check system accessibility settings
  const isHighContrastMode = false; // Platform-specific check would go here
  
  return (
    <Text
      style={[
        style,
        isHighContrastMode && {
          color: FiColors.text,
          fontWeight: '600',
          ...highContrastStyle,
        },
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

// Focus indicator for keyboard navigation
const FocusIndicator = ({ 
  children, 
  focused = false, 
  style = {},
  ...props 
}) => {
  return (
    <View
      style={[
        style,
        focused && styles.focusIndicator,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

// Semantic heading component
const AccessibleHeading = ({ 
  level = 1, 
  children, 
  style = {},
  ...props 
}) => {
  const headingStyles = {
    1: styles.heading1,
    2: styles.heading2,
    3: styles.heading3,
    4: styles.heading4,
  };

  return (
    <Text
      style={[headingStyles[level] || headingStyles[1], style]}
      accessible={true}
      accessibilityRole="header"
      accessibilityLevel={level}
      {...props}
    >
      {children}
    </Text>
  );
};

// Skip link for keyboard navigation
const SkipLink = ({ onPress, text = 'Skip to main content' }) => {
  return (
    <TouchableOpacity
      style={styles.skipLink}
      onPress={onPress}
      accessible={true}
      accessibilityLabel={text}
      accessibilityRole="button"
    >
      <Text style={styles.skipLinkText}>{text}</Text>
    </TouchableOpacity>
  );
};

// Accessibility announcements
const announceForAccessibility = (message) => {
  if (Platform.OS === 'ios') {
    // iOS VoiceOver announcement
    AccessibilityInfo.announceForAccessibility(message);
  } else if (Platform.OS === 'android') {
    // Android TalkBack announcement
    AccessibilityInfo.announceForAccessibility(message);
  }
};

// Color contrast checker utility
const checkColorContrast = (foreground, background) => {
  // Simplified contrast ratio calculation
  // In production, use a proper color contrast library
  const getLuminance = (color) => {
    // Convert hex to RGB and calculate luminance
    // This is a simplified version
    return 0.5; // Placeholder
  };

  const fgLuminance = getLuminance(foreground);
  const bgLuminance = getLuminance(background);
  
  const contrast = (Math.max(fgLuminance, bgLuminance) + 0.05) / 
                  (Math.min(fgLuminance, bgLuminance) + 0.05);
  
  return {
    ratio: contrast,
    passesAA: contrast >= 4.5,
    passesAAA: contrast >= 7,
  };
};

const styles = StyleSheet.create({
  touchableArea: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  accessibleCard: {
    backgroundColor: FiColors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: FiColors.border,
  },
  focusIndicator: {
    borderWidth: 2,
    borderColor: FiColors.primary,
    borderRadius: 4,
  },
  heading1: {
    fontSize: 24,
    fontWeight: '700',
    color: FiColors.text,
    marginBottom: 8,
  },
  heading2: {
    fontSize: 20,
    fontWeight: '600',
    color: FiColors.text,
    marginBottom: 6,
  },
  heading3: {
    fontSize: 18,
    fontWeight: '600',
    color: FiColors.text,
    marginBottom: 4,
  },
  heading4: {
    fontSize: 16,
    fontWeight: '500',
    color: FiColors.text,
    marginBottom: 4,
  },
  skipLink: {
    position: 'absolute',
    top: -100,
    left: 0,
    backgroundColor: FiColors.primary,
    padding: 8,
    zIndex: 1000,
  },
  skipLinkText: {
    color: FiColors.textInverse,
    fontSize: 14,
    fontWeight: '600',
  },
});

export {
  TouchableArea,
  AccessibleText,
  AccessibleCard,
  HighContrastText,
  FocusIndicator,
  AccessibleHeading,
  SkipLink,
  announceForAccessibility,
  checkColorContrast,
};
