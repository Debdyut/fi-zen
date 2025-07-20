import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { getThemeColors } from '../../theme/consolidatedFiColors';

const ThemeToggle = ({ style }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const colors = getThemeColors(isDarkMode);

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.surface }, style]}
      onPress={toggleTheme}
      activeOpacity={0.7}
    >
      <View style={[styles.toggleContainer, { backgroundColor: colors.backgroundLight }]}>
        <View style={[
          styles.toggleSlider,
          {
            backgroundColor: colors.primary,
            transform: [{ translateX: isDarkMode ? 0 : 24 }]
          }
        ]}>
          <Text style={styles.toggleIcon}>
            {isDarkMode ? '🌙' : '☀️'}
          </Text>
        </View>
      </View>
      <Text style={[styles.label, { color: colors.text }]}>
        {isDarkMode ? 'Dark Mode' : 'Light Mode'}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  toggleContainer: {
    width: 48,
    height: 24,
    borderRadius: 12,
    padding: 2,
    marginRight: 12,
    justifyContent: 'center',
  },
  toggleSlider: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleIcon: {
    fontSize: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default ThemeToggle;
