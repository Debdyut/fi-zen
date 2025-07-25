import React, { createContext, useContext, useState, useEffect } from 'react';
import DataService from '../services/DataService';

// Create the context
const SharedUserContext = createContext();

// Custom hook to use the shared user context
export const useSharedUser = () => {
  const context = useContext(SharedUserContext);
  if (!context) {
    throw new Error('useSharedUser must be used within a SharedUserProvider');
  }
  return context;
};

// Provider component
export const SharedUserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Load user data
  const loadUserData = async (userId) => {
    try {
      setLoading(true);
      setError(null);
      
      const currentUserId = userId || DataService.getCurrentUser() || '1010101010';
      
      if (userId) {
        DataService.setCurrentUser(userId);
      }

      // Load comprehensive user data
      const [userProfile, userGoals, userSpending, userNetWorth, portfolio, assetAllocation, returns] = await Promise.all([
        DataService.getUserProfile(currentUserId),
        DataService.getUserGoals(currentUserId),
        DataService.getUserSpending(currentUserId),
        DataService.getUserNetWorth(currentUserId),
        DataService.getUserPortfolio(currentUserId).catch(() => ({ totalValue: 0 })),
        DataService.getUserAssetAllocation(currentUserId).catch(() => ({ equity: 60, debt: 30, cash: 10 })),
        DataService.getUserReturns(currentUserId).catch(() => ({ overallReturnPercentage: 12, breakdown: {} }))
      ]);

      // Generate spending trends (mock calculation based on spending data)
      const generateSpendingTrends = (spending) => {
        const trends = {};
        Object.keys(spending).forEach(category => {
          const baseChange = (Math.random() - 0.5) * 30; // -15% to +15%
          trends[category] = {
            change: Math.round(baseChange * 10) / 10,
            trend: baseChange > 5 ? 'increasing' : baseChange < -5 ? 'decreasing' : 'stable'
          };
        });
        return trends;
      };

      // Construct comprehensive user object
      const userData = {
        userId: currentUserId,
        name: userProfile?.name || 'User',
        profile: {
          profession: userProfile?.profession || 'Professional',
          monthlyIncome: userProfile?.monthlyIncome || 50000,
          location: userProfile?.location || 'India',
          riskProfile: userProfile?.riskProfile || 'moderate',
          age: userProfile?.age || 30,
          targetReturn: userProfile?.targetReturn || 15
        },
        goals: userGoals || [],
        monthlySpending: userSpending || {},
        netWorth: userNetWorth || { netWorth: 0, totalAssets: 0, totalLiabilities: 0 },
        portfolio: portfolio || { totalValue: 0 },
        assetAllocation: assetAllocation || { equity: 60, debt: 30, cash: 10 },
        returns: returns || { overallReturnPercentage: 12, breakdown: {} },
        // Add derived data
        spendingTrends: generateSpendingTrends(userSpending || {}),
        budgetAlerts: [],
        // Add peer comparison data
        peerComparison: {
          percentile: 65,
          average: (userProfile?.monthlyIncome || 50000) * 10,
          top10: (userProfile?.monthlyIncome || 50000) * 20
        },
        // Add financial metrics
        financialMetrics: {
          savingsRate: userProfile?.savingsRate || 20,
          debtToIncome: userProfile?.debtToIncome || 0.1
        },
        // Add financial health
        financialHealth: userProfile?.financialHealth || {
          score: 70,
          status: 'Good',
          strengths: ['Consistent savings'],
          improvements: ['Increase emergency fund']
        },
        // Add insights data
        insights: {
          spending: {
            trend: 'stable',
            topCategory: Object.keys(userSpending || {})[0] || 'housing',
            optimization: 'Review monthly expenses for optimization opportunities'
          },
          investments: {
            performance: 'average',
            allocation: userProfile?.riskProfile || 'moderate',
            suggestion: 'Consider diversifying your investment portfolio'
          },
          goals: {
            onTrack: (userGoals || []).filter(g => g.status === 'on_track').length,
            total: (userGoals || []).length,
            nextMilestone: 'Continue building your emergency fund'
          }
        }
      };

      setUser(userData);
      setLastUpdated(new Date());
      
    } catch (error) {
      console.error('Error loading user data:', error);
      setError(error.message);
      
      // Fallback to basic user data
      setUser({
        userId: '1010101010',
        name: 'User',
        profile: {
          profession: 'Professional',
          monthlyIncome: 50000,
          location: 'India',
          riskProfile: 'moderate',
          age: 30
        },
        goals: [],
        monthlySpending: {},
        netWorth: { netWorth: 0 },
        spendingTrends: {},
        budgetAlerts: []
      });
      
    } finally {
      setLoading(false);
    }
  };

  // Update user data (for when user makes changes)
  const updateUserData = async (updates) => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Apply updates to current user data
      const updatedUser = {
        ...user,
        ...updates,
        profile: {
          ...user.profile,
          ...(updates.profile || {})
        }
      };
      
      setUser(updatedUser);
      setLastUpdated(new Date());
      
      // Optionally persist changes to DataService
      // await DataService.updateUserProfile(user.userId, updatedUser.profile);
      
    } catch (error) {
      console.error('Error updating user data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Refresh user data
  const refreshUserData = () => {
    if (user?.userId) {
      loadUserData(user.userId);
    }
  };

  // Switch user (for user switching functionality)
  const switchUser = (userId) => {
    loadUserData(userId);
  };

  const contextValue = {
    user,
    loading,
    error,
    lastUpdated,
    loadUserData,
    updateUserData,
    refreshUserData,
    switchUser
  };

  return (
    <SharedUserContext.Provider value={contextValue}>
      {children}
    </SharedUserContext.Provider>
  );
};

export default SharedUserContext;
