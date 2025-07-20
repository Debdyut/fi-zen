import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { getThemeColors } from '../theme/consolidatedFiColors';
import FiHomeScreenWrapper from '../components/fi-style/FiHomeScreenWrapper';
import InflationScreen from '../screens/InflationScreen';
import InflationSetupScreen from '../screens/InflationSetupScreen';
import DetailedBreakdownScreen from '../components/results/DetailedBreakdownScreen';
import InsightsScreen from '../screens/InsightsScreen';
import GoalsScreen from '../screens/GoalsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MetricDetailScreen from '../screens/MetricDetailScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Custom Tab Icon Component
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
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          borderTopWidth: 0.5,
          height: 80,
          paddingBottom: 15,
          paddingTop: 12,
        },
        tabBarShowLabel: false,
      }}>
      <Tab.Screen 
        name="Home" 
        component={FiHomeScreenWrapper}
        options={{
          tabBarIcon: ({ focused }) => (
            <FiTabIcon emoji="🏠" focused={focused} label="Home" colors={colors} />
          ),
        }}
      />
      <Tab.Screen 
        name="Insights" 
        component={InsightsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <FiTabIcon emoji="📊" focused={focused} label="Insights" colors={colors} />
          ),
        }}
      />
      <Tab.Screen 
        name="Goals" 
        component={GoalsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <FiTabIcon emoji="🎯" focused={focused} label="Goals" colors={colors} />
          ),
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <FiTabIcon emoji="👤" focused={focused} label="Profile" colors={colors} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);

  return (
    <NavigationContainer
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
      }}
    >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main">
          {(props) => <TabNavigator {...props} />}
        </Stack.Screen>
        <Stack.Screen name="InflationSetup" component={InflationSetupScreen} />
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
      </Stack.Navigator>
    </NavigationContainer>
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