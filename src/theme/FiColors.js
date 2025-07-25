// Simple FiColors export for backward compatibility
// This file provides a direct import path for FiColors

export { FiColors, DarkTheme, LightTheme, getThemeColors } from './consolidatedFiColors';

// Re-export everything from consolidatedFiColors
export * from './consolidatedFiColors';

// Import and re-export as default
import { FiColors } from './consolidatedFiColors';
export default FiColors;