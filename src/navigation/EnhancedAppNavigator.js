import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { getThemeColors } from '../theme/consolidatedFiColors';
import fonts from '../theme/fonts';
import { SharedUserProvider } from '../context/SharedUserContext';

// Original screens
import FiHomeScreenWrapper from '../components/fi-style/FiHomeScreenWrapper';
import InflationScreen from '../screens/InflationScreen';
import InflationSetupScreen from '../screens/InflationSetupScreen';
import DetailedBreakdownScreen from '../components/results/DetailedBreakdownScreen';
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

// Enhanced Tab Icon Component
const FiTabIcon = ({ emoji, focused, label, colors }) => (
  <View style={styles.tabIconContainer}>
    <View style={[
      styles.tabIconWrapper,
      focused && { backgroundColor: colors.primary + '20' }
    ]}>
      <Text style={[
        styles.tabEmoji,
        focused && styles.tabEmojiActive
      ]}>
        {emoji}
      </Text>
    </View>
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
        component={EnhancedHomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <FiTabIcon 
              emoji="🏠" 
              focused={focused} 
              label="Home" 
              colors={colors}
            />
          ),
        }}
      />
      <Tab.Screen 
        name="Insights" 
        component={EnhancedInsightsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <FiTabIcon 
              emoji="📊" 
              focused={focused} 
              label="Insights" 
              colors={colors}
            />
          ),
        }}
      />
      <Tab.Screen 
        name="Goals" 
        component={EnhancedGoalsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <FiTabIcon 
              emoji="🎯" 
              focused={focused} 
              label="Goals" 
              colors={colors}
            />
          ),
        }}
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
            />
          ),
        }}
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
  },
  tabEmoji: {
    fontSize: 18,
  },
  tabEmojiActive: {
    fontSize: 18,
  },

  tabLabel: {
    fontSize: 9,
    fontWeight: '500',
    textAlign: 'center',
    numberOfLines: 1,
  },
});

export default AppNavigator;
