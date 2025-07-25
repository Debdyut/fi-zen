// Enhanced Navigation Helper
// Provides navigation utilities for enhanced screens to navigate to each other

export const EnhancedNavigationHelper = {
  // Navigate to enhanced metric detail screen
  navigateToEnhancedMetricDetail: (navigation, params) => {
    navigation.navigate('EnhancedMetricDetail', params);
  },

  // Navigate to enhanced detailed breakdown screen
  navigateToEnhancedBreakdown: (navigation, params) => {
    navigation.navigate('EnhancedDetailedBreakdown', params);
  },

  // Navigate to enhanced goals screen
  navigateToEnhancedGoals: (navigation, params) => {
    navigation.navigate('EnhancedGoals', params);
  },

  // Navigate to enhanced insights screen
  navigateToEnhancedInsights: (navigation, params) => {
    navigation.navigate('EnhancedInsights', params);
  },

  // Navigate to enhanced home screen
  navigateToEnhancedHome: (navigation, params) => {
    navigation.navigate('EnhancedHome', params);
  },

  // Helper to determine if we should use enhanced or original navigation
  getNavigationTarget: (screenName, useEnhanced = true) => {
    if (!useEnhanced) {
      return screenName; // Use original screen names
    }

    const enhancedMapping = {
      'MetricDetail': 'EnhancedMetricDetail',
      'DetailedBreakdownScreen': 'EnhancedDetailedBreakdown',
      'Goals': 'EnhancedGoals',
      'Insights': 'EnhancedInsights',
      'Home': 'EnhancedHome'
    };

    return enhancedMapping[screenName] || screenName;
  },

  // Universal navigation function that respects enhanced mode
  navigateToScreen: (navigation, screenName, params, useEnhanced = true) => {
    const targetScreen = EnhancedNavigationHelper.getNavigationTarget(screenName, useEnhanced);
    navigation.navigate(targetScreen, params);
  }
};

export default EnhancedNavigationHelper;
