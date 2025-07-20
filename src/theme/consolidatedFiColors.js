// Consolidated Fi Colors (Based on Actual Fi App Screenshots)
// Single source of truth for all Fi-Zen components

export const FiColors = {
  // Fi App Primary Colors (from screenshots)
  background: '#1A1A1A',        // Fi's dark background
  surface: '#FFFFFF',           // White cards
  surfaceSecondary: '#F8F9FA',  // Light gray surface
  
  // Fi Brand Colors
  primary: '#00D4AA',           // Fi's signature teal (from screenshots)
  primaryLight: '#33E0BB',      // Lighter teal
  primaryDark: '#00B894',       // Darker teal
  
  // Text Colors
  text: '#1A1A1A',             // Dark text on light surfaces
  textSecondary: '#666666',     // Medium gray text
  textTertiary: '#999999',      // Light gray text
  textInverse: '#FFFFFF',       // White text on dark background
  textInverseSecondary: '#CCCCCC', // Light gray on dark background
  
  // Status Colors (Fi Style)
  success: '#00D4AA',           // Use Fi teal for success
  warning: '#FFB800',           // Warm yellow
  error: '#FF6B6B',             // Soft red (not harsh)
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
  
  // Backgrounds for different contexts
  backgroundLight: '#F5F5F5',   // Light background for content areas
  backgroundCard: '#FFFFFF',    // Card backgrounds
  backgroundAccent: '#00D4AA20', // Teal with 20% opacity
};

// Fi Typography Scale (Based on Screenshots)
export const FiTypography = {
  // Large wealth/number display (Fi style)
  wealth: {
    fontSize: 36,
    fontWeight: '300', // Fi's characteristic light weight
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

// Fi Component Styles (Reusable)
export const FiStyles = {
  // Standard Fi card
  card: {
    backgroundColor: FiColors.surface,
    borderRadius: 16,
    padding: 20,
    shadowColor: FiColors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  
  // Fi button primary
  buttonPrimary: {
    backgroundColor: FiColors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  
  // Fi button secondary
  buttonSecondary: {
    backgroundColor: FiColors.primaryLight + '20',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: FiColors.primary,
  },
  
  // Fi input field
  input: {
    borderWidth: 1,
    borderColor: FiColors.border,
    borderRadius: 8,
    padding: 12,
    backgroundColor: FiColors.surface,
    fontSize: 16,
  },
};

export default FiColors;
