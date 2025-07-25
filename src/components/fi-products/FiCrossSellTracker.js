import React, { useEffect } from 'react';
import aiContextManager from '../../services/AIContextManager';

const FiCrossSellTracker = ({ user, currentScreen, onConversion }) => {
  
  useEffect(() => {
    // Track screen view for cross-sell analytics
    if (user && currentScreen) {
      aiContextManager.trackCrossSellEvent('screen_view', 'none', {
        screen: currentScreen,
        userProfile: {
          age: user.profile?.age,
          income: user.profile?.monthlyIncome,
          spendingLevel: getSpendingLevel(user)
        }
      });
    }
  }, [user, currentScreen]);

  const getSpendingLevel = (user) => {
    const totalSpending = Object.values(user.monthlySpending || {}).reduce((a, b) => a + b, 0);
    if (totalSpending > 50000) return 'high';
    if (totalSpending > 25000) return 'medium';
    return 'low';
  };

  // Track product interest (when user clicks on Fi product widgets)
  const trackProductInterest = (productName, interactionType = 'click') => {
    aiContextManager.trackCrossSellEvent('product_interest', productName, {
      interactionType,
      screen: currentScreen
    });
  };

  // Track conversion events
  const trackConversion = (productName, conversionType = 'application') => {
    aiContextManager.trackCrossSellEvent('conversion', productName, {
      conversionType,
      screen: currentScreen,
      revenue: getProductRevenue(productName)
    });
    
    onConversion?.(productName, conversionType);
  };

  const getProductRevenue = (productName) => {
    const revenueMap = {
      'Fi Money': 2400,
      'Fi Credit Card': 6000,
      'Fi Investments': 3600,
      'Fi Insurance': 4800,
      'Fi Loans': 12000,
      'Fi UPI': 600
    };
    return revenueMap[productName] || 0;
  };

  // Expose tracking functions to parent components
  React.useImperativeHandle(React.forwardRef(() => null), () => ({
    trackProductInterest,
    trackConversion
  }));

  return null; // This is a tracking component, no UI
};

export default FiCrossSellTracker;
