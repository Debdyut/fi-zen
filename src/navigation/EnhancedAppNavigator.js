import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { getThemeColors } from '../theme/consolidatedFiColors';
import fonts from '../theme/fonts';
import { SharedUserProvider } from '../context/SharedUserContext';

// Original screens
import FiHomeScreenWrapper from '../components/fi-style/FiHomeScreenWrapper';
import InflationScreen from '../screens/InflationScreen';
import InflationSetupScreen from '../screens/InflationSetupScreen';
import DetailedBreakdownScreen from '../components/results/DetailedBreakdownScreen';
import InsightsScreen from '../screens/InsightsScreen';
import GoalsScreen from '../screens/GoalsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MetricDetailScreen from '../screens/MetricDetailScreen';
import LoginScreen from '../screens/LoginScreen';

// Enhanced screens
import EnhancedHomeScreen from '../screens/EnhancedHomeScreen_WithRealData';
import EnhancedInsightsScreen from '../screens/EnhancedInsightsScreen';
import EnhancedGoalsScreen from '../screens/EnhancedGoalsScreen';
import EnhancedMetricDetailScreen from '../screens/EnhancedMetricDetailScreen';
import EnhancedDetailedBreakdownScreen from '../screens/EnhancedDetailedBreakdownScreen';

import UserProfileService from '../services/UserProfileService';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Enhanced Tab Icon Component with mode toggle
const FiTabIcon = ({ emoji, focused, label, colors, onToggleMode, useEnhanced }) => (
  <View style={styles.tabIconContainer}>
    <TouchableOpacity 
      style={[
        styles.tabIconWrapper,
        focused && { backgroundColor: colors.primary + '20' }
      ]}
      onPress={onToggleMode}
      onLongPress={onToggleMode}
    >
      <Text style={[
        styles.tabEmoji,
        focused && styles.tabEmojiActive
      ]}>
        {emoji}
      </Text>
      {useEnhanced && (
        <View style={styles.enhancedIndicator}>
          <Text style={styles.enhancedDot}>✨</Text>
        </View>
      )}
    </TouchableOpacity>
    <Text style={[
      styles.tabLabel,
      { color: colors.textSecondary },
      focused && { color: colors.primary, fontWeight: '600' }
    ]}>
      {label}
    </Text>
  </View>
);

const TabNavigator = ({ navigation }) => {
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);
  const [useEnhancedScreens, setUseEnhancedScreens] = useState(true); // Default to enhanced

  const toggleScreenMode = () => {
    setUseEnhancedScreens(!useEnhancedScreens);
    console.log(`Switched to ${!useEnhancedScreens ? 'Enhanced' : 'Original'} screens`);
  };

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDarkMode ? '#262626' : '#FFFFFF',
          borderTopColor: isDarkMode ? '#333333' : colors.border,
          borderTopWidth: 0.5,
          height: 80,
          paddingBottom: 15,
          paddingTop: 12,
        },
        tabBarShowLabel: false,
      }}>
      <Tab.Screen 
        name="Home" 
        component={useEnhancedScreens ? EnhancedHomeScreen : FiHomeScreenWrapper}
        options={{
          tabBarIcon: ({ focused }) => (
            <FiTabIcon 
              emoji="🏠" 
              focused={focused} 
              label="Home" 
              colors={colors}
              onToggleMode={toggleScreenMode}
              useEnhanced={useEnhancedScreens}
            />
          ),
        }}
        initialParams={{ useEnhanced: useEnhancedScreens }}
      />
      <Tab.Screen 
        name="Insights" 
        component={useEnhancedScreens ? EnhancedInsightsScreen : InsightsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <FiTabIcon 
              emoji="📊" 
              focused={focused} 
              label="Insights" 
              colors={colors}
              onToggleMode={toggleScreenMode}
              useEnhanced={useEnhancedScreens}
            />
          ),
        }}
        initialParams={{ useEnhanced: useEnhancedScreens }}
      />
      <Tab.Screen 
        name="Goals" 
        component={useEnhancedScreens ? EnhancedGoalsScreen : GoalsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <FiTabIcon 
              emoji="🎯" 
              focused={focused} 
              label="Goals" 
              colors={colors}
              onToggleMode={toggleScreenMode}
              useEnhanced={useEnhancedScreens}
            />
          ),
        }}
        initialParams={{ useEnhanced: useEnhancedScreens }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <FiTabIcon 
              emoji="👤" 
              focused={focused} 
              label="Profile" 
              colors={colors}
              onToggleMode={toggleScreenMode}
              useEnhanced={false} // Profile doesn't have enhanced version yet
            />
          ),
        }}
        initialParams={{ useEnhanced: false }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigationRef = React.useRef();

  useEffect(() => {
    // Check if user is already logged in
    const checkLoginStatus = () => {
      const loggedIn = UserProfileService.isLoggedIn();
      setIsLoggedIn(loggedIn);
    };

    checkLoginStatus();
    
    // Set up interval to check login status
    const interval = setInterval(checkLoginStatus, 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaProvider>
      <SharedUserProvider>
        <NavigationContainer
          ref={navigationRef}
          theme={{
            dark: isDarkMode,
            colors: {
              primary: colors.primary,
              background: colors.background,
              card: colors.surface,
              text: colors.text,
              border: colors.border,
              notification: colors.primary,
            },
            fonts: fonts,
          }}
        >
          <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={isLoggedIn ? "MainTabs" : "Login"}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="MainTabs">
              {(props) => <TabNavigator {...props} />}
            </Stack.Screen>
          
          {/* Inflation Flow */}
          <Stack.Screen name="InflationSetup" component={InflationSetupScreen} />
          
          {/* Original Detail Screens */}
          <Stack.Screen 
            name="MetricDetail" 
            component={MetricDetailScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen 
            name="DetailedBreakdownScreen" 
            component={DetailedBreakdownScreen}
            options={{
              presentation: 'modal',
              headerShown: false,
            }}
          />
          
          {/* Enhanced Detail Screens */}
          <Stack.Screen 
            name="EnhancedMetricDetail" 
            component={EnhancedMetricDetailScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen 
            name="EnhancedDetailedBreakdown" 
            component={EnhancedDetailedBreakdownScreen}
            options={{
              presentation: 'modal',
              headerShown: false,
            }}
          />
          
          {/* Enhanced Standalone Screens (accessible via navigation) */}
          <Stack.Screen 
            name="EnhancedHome" 
            component={EnhancedHomeScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen 
            name="EnhancedInsights" 
            component={EnhancedInsightsScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen 
            name="EnhancedGoals" 
            component={EnhancedGoalsScreen}
            options={{
              headerShown: false,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      </SharedUserProvider>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
    width: 70,
  },
  tabIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    marginBottom: 4,
    position: 'relative',
  },
  tabEmoji: {
    fontSize: 18,
  },
  tabEmojiActive: {
    fontSize: 18,
  },
  enhancedIndicator: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#00D4AA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  enhancedDot: {
    fontSize: 8,
    color: '#FFFFFF',
  },
  tabLabel: {
    fontSize: 9,
    fontWeight: '500',
    textAlign: 'center',
    numberOfLines: 1,
  },
});

export default AppNavigator;
