// Consolidated Fi Colors (Based on Actual Fi App Screenshots)
// Single source of truth for all Fi-Zen components with Dark/Light mode support

// Export FiColors at the top for immediate availability
export const FiColors = {
  // Fi App Primary Colors
  background: '#1A1A1A',
  surface: '#2A2A2A',
  surfaceSecondary: '#333333',
  
  // Fi Brand Colors
  primary: '#00D4AA',
  primaryLight: '#33E0BB',
  primaryDark: '#00B894',
  
  // Text Colors
  text: '#FFFFFF',
  textSecondary: '#CCCCCC',
  textTertiary: '#999999',
  textInverse: '#1A1A1A',
  textInverseSecondary: '#666666',
  
  // Status Colors
  success: '#00D4AA',
  warning: '#FFB800',
  error: '#FF6B6B',
  info: '#4A90E2',
  
  // Inflation Colors
  inflationLow: '#00D4AA',
  inflationModerate: '#FFB800',
  inflationHigh: '#FF8A65',
  inflationVeryHigh: '#FF6B6B',
  
  // UI Elements
  border: '#404040',
  borderLight: '#333333',
  shadow: 'rgba(0, 0, 0, 0.3)',
  secondary: '#666666',
  white: '#FFFFFF',
  
  // Special colors
  ai: '#8B5CF6',
  gradient1: '#00D4AA',
  gradient2: '#33E0BB',
  
  // Attention surfaces
  surfaceAttentionYellow: '#FFFBF0',
  surfaceAttentionTeal: '#F0FDFA',
  surfaceAttentionRed: '#FFF5F5',
  
  // Background variants
  backgroundLight: '#2A2A2A',
  backgroundCard: '#2A2A2A',
  backgroundAccent: '#00D4AA20',
  backgroundCardYellow: '#FFFBF0',
  backgroundCardTeal: '#F0FDFA',
  backgroundCardRed: '#FFF5F5',
  backgroundHeader: '#00D4AA',
};

// Dark Theme Colors (Fi's signature dark mode)
export const DarkTheme = {
  // Fi App Primary Colors (from screenshots)
  background: '#1A1A1A',        // Fi's dark background
  surface: '#2A2A2A',           // Dark cards
  surfaceSecondary: '#333333',  // Darker gray surface
  
  // Fi Brand Colors (consistent across themes)
  primary: '#00D4AA',           // Fi's signature teal
  primaryLight: '#33E0BB',      // Lighter teal
  primaryDark: '#00B894',       // Darker teal
  
  // Text Colors for Dark Mode
  text: '#FFFFFF',              // White text on dark surfaces
  textSecondary: '#CCCCCC',     // Light gray text
  textTertiary: '#999999',      // Medium gray text
  textInverse: '#1A1A1A',       // Dark text on light elements
  textInverseSecondary: '#666666', // Medium gray on light elements
  
  // Status Colors (Fi Style)
  success: '#00D4AA',           // Use Fi teal for success
  warning: '#FFB800',           // Warm yellow
  error: '#FF6B6B',             // Soft red
  info: '#4A90E2',              // Blue
  
  // Inflation-Specific Colors
  inflationLow: '#00D4AA',      // Fi teal for good rates
  inflationModerate: '#FFB800', // Yellow for moderate
  inflationHigh: '#FF8A65',     // Orange for concerning
  inflationVeryHigh: '#FF6B6B', // Red for very high
  
  // UI Elements
  border: '#404040',            // Dark border
  borderLight: '#333333',       // Darker border
  shadow: 'rgba(0, 0, 0, 0.3)', // Stronger shadow for dark mode
  secondary: '#666666',         // Secondary color
  white: '#FFFFFF',             // White color
  
  // Attention surfaces
  surfaceAttentionYellow: '#FFFBF0',   // Light pastel yellow
  surfaceAttentionTeal: '#F0FDFA',     // Light pastel teal
  surfaceAttentionRed: '#FFF5F5',      // Light pastel red
  
  // Backgrounds for different contexts
  backgroundLight: '#2A2A2A',   // Dark background for content areas
  backgroundCard: '#2A2A2A',    // Dark card backgrounds
  backgroundAccent: '#00D4AA20', // Teal with 20% opacity
  backgroundCardYellow: '#FFFBF0', // Light pastel yellow cards
  backgroundCardTeal: '#F0FDFA',   // Light pastel teal cards
  backgroundCardRed: '#FFF5F5',    // Light pastel red cards
  backgroundHeader: '#00D4AA',     // Signature teal for headers
};

// Light Theme Colors
export const LightTheme = {
  // Light mode backgrounds
  background: '#E6FBF7',        // Light teal background
  surface: '#FFFFFF',           // White cards
  surfaceSecondary: '#F8F9FA',  // Light gray surface
  
  // Fi Brand Colors (consistent across themes)
  primary: '#00D4AA',           // Fi's signature teal
  primaryLight: '#33E0BB',      // Lighter teal
  primaryDark: '#00B894',       // Darker teal
  
  // Text Colors for Light Mode
  text: '#1A1A1A',             // Dark text on light surfaces
  textSecondary: '#666666',     // Medium gray text
  textTertiary: '#999999',      // Light gray text
  textInverse: '#FFFFFF',       // White text on dark elements
  textInverseSecondary: '#CCCCCC', // Light gray on dark elements
  
  // Status Colors (Fi Style)
  success: '#00D4AA',           // Use Fi teal for success
  warning: '#FFB800',           // Warm yellow
  error: '#FF6B6B',             // Soft red
  info: '#4A90E2',              // Blue
  
  // Inflation-Specific Colors
  inflationLow: '#00D4AA',      // Fi teal for good rates
  inflationModerate: '#FFB800', // Yellow for moderate
  inflationHigh: '#FF8A65',     // Orange for concerning
  inflationVeryHigh: '#FF6B6B', // Red for very high
  
  // UI Elements
  border: '#E0E0E0',            // Light border
  borderLight: '#F0F0F0',       // Very light border
  shadow: 'rgba(0, 0, 0, 0.1)', // Subtle shadow
  secondary: '#666666',         // Secondary color
  white: '#FFFFFF',             // White color
  
  // Attention surfaces
  surfaceAttentionYellow: '#FFFBF0',   // Light pastel yellow
  surfaceAttentionTeal: '#F0FDFA',     // Light pastel teal
  surfaceAttentionRed: '#FFF5F5',      // Light pastel red
  
  // Backgrounds for different contexts
  backgroundLight: '#F5F5F5',   // Light background for content areas
  backgroundCard: '#FFFFFF',    // Card backgrounds
  backgroundAccent: '#00D4AA20', // Teal with 20% opacity
  backgroundCardYellow: '#FFFBF0', // Light pastel yellow cards
  backgroundCardTeal: '#F0FDFA',   // Light pastel teal cards
  backgroundCardRed: '#FFF5F5',    // Light pastel red cards
  backgroundHeader: '#00D4AA',     // Signature teal for headers
};

// Function to get current theme colors
export const getThemeColors = (isDarkMode) => {
  return isDarkMode ? DarkTheme : LightTheme;
};

// Legacy export for backward compatibility - FiColors is now exported at the top

// Fi Typography Scale (Based on Screenshots)
export const FiTypography = {
  // Large wealth/number display (Fi style)
  wealth: {
    fontSize: 36,
    fontWeight: 'normal',
    lineHeight: 44,
  },
  
  // Main headings
  h1: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 34,
  },
  
  h2: {
    fontSize: 24,
    fontWeight: '600', 
    lineHeight: 30,
  },
  
  h3: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 26,
  },
  
  // Body text
  body: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  
  bodySmall: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  
  // UI elements
  button: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 20,
  },
  
  caption: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
  },
  
  // Card titles (Fi style)
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
  },
};

// Fi Component Styles (Theme-aware)
export const getFiStyles = (colors) => ({
  // Standard Fi card
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  
  // Fi button primary
  buttonPrimary: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  
  // Fi button secondary
  buttonSecondary: {
    backgroundColor: colors.primary + '20',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  
  // Fi input field
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    backgroundColor: colors.surface,
    fontSize: 16,
    color: colors.text,
  },
  
  // Attention card styles
  cardAttentionYellow: {
    backgroundColor: colors.backgroundCardYellow || colors.surface,
    borderRadius: 16,
    padding: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  
  cardAttentionTeal: {
    backgroundColor: colors.backgroundCardTeal || colors.surface,
    borderRadius: 16,
    padding: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  
  cardAttentionRed: {
    backgroundColor: colors.backgroundCardRed || colors.surface,
    borderRadius: 16,
    padding: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
});

// Legacy export for backward compatibility
export const FiStyles = getFiStyles(DarkTheme);

export default { DarkTheme, LightTheme, getThemeColors, FiTypography, getFiStyles };
