// Enhanced Fi Colors - Extended color palette
// This file provides additional colors for enhanced components

import { FiColors, DarkTheme, LightTheme } from './consolidatedFiColors';

// Enhanced color palette extending the base FiColors
export const EnhancedFiColors = {
  ...FiColors,
  
  // Additional enhanced colors
  accent: '#8B5CF6',
  accentLight: '#A78BFA',
  accentDark: '#7C3AED',
  
  // Extended status colors
  info: '#4A90E2',
  infoLight: '#6BA3F0',
  infoDark: '#357ABD',
  
  // Additional UI colors
  muted: '#6B7280',
  mutedLight: '#9CA3AF',
  mutedDark: '#4B5563',
  
  // Enhanced backgrounds
  backgroundOverlay: 'rgba(0, 0, 0, 0.5)',
  backgroundModal: '#1F2937',
  backgroundTooltip: '#374151',
  
  // Enhanced borders
  borderFocus: '#00D4AA',
  borderError: '#FF6B6B',
  borderWarning: '#FFB800',
  borderSuccess: '#00D4AA',
  
  // Enhanced shadows
  shadowLight: 'rgba(0, 0, 0, 0.1)',
  shadowMedium: 'rgba(0, 0, 0, 0.2)',
  shadowHeavy: 'rgba(0, 0, 0, 0.3)',
};

// Function to get enhanced theme colors
export const getEnhancedThemeColors = (isDarkMode) => {
  const baseColors = isDarkMode ? DarkTheme : LightTheme;
  return {
    ...baseColors,
    ...EnhancedFiColors,
  };
};

// Default export
export default EnhancedFiColors;