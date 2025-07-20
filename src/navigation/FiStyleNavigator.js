import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';

// Fi-Style Components
import FiHomeScreen from '../components/fi-style/FiHomeScreen';
import FiInflationCard from '../components/fi-style/FiInflationCard';
import FiMetricsCards from '../components/fi-style/FiMetricsCards';

// Enhanced Components (Board Meeting Updates)
import StreamlinedWelcomeScreen from '../components/onboarding/StreamlinedWelcomeScreen';
import RevenueFocusedResultsScreen from '../components/results/RevenueFocusedResultsScreen';
import ProfessionalDashboard from '../components/professional/ProfessionalDashboard';

// Fi App Colors
const FiColors = {
  background: '#1A1A1A',
  surface: '#FFFFFF',
  primary: '#00D4AA',
  text: '#1A1A1A',
  textSecondary: '#666666',
  textInverse: '#FFFFFF',
  border: '#E0E0E0',
};

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const FiTabIcon = ({ emoji, focused, label }) => (
  <View style={styles.tabIconContainer}>
    <View style={[
      styles.tabIconWrapper,
      focused && styles.tabIconWrapperActive
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
      focused && styles.tabLabelActive
    ]}>
      {label}
    </Text>
  </View>
);

const InflationStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: FiColors.background,
        },
        headerTintColor: FiColors.textInverse,
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 18,
        },
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: FiColors.background,
        },
      }}
    >
      <Stack.Screen 
        name="FiHome" 
        component={FiHomeScreen}
        options={{ 
          headerShown: false
        }}
      />
      
      <Stack.Screen 
        name="Welcome" 
        component={StreamlinedWelcomeScreen}
        options={{ 
          title: 'Personal Inflation',
          headerStyle: {
            backgroundColor: FiColors.surface,
          },
          headerTintColor: FiColors.text,
        }}
      />
      
      <Stack.Screen 
        name="Results" 
        component={RevenueFocusedResultsScreen}
        options={{ 
          title: 'Your Rate',
          headerStyle: {
            backgroundColor: FiColors.surface,
          },
          headerTintColor: FiColors.text,
        }}
      />
      
      <Stack.Screen 
        name="Professional" 
        component={ProfessionalDashboard}
        options={{ 
          title: 'Professional Tools',
          headerStyle: {
            backgroundColor: FiColors.surface,
          },
          headerTintColor: FiColors.text,
        }}
      />
    </Stack.Navigator>
  );
};

const FiStyleTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: FiColors.background,
          borderTopColor: FiColors.border + '30',
          borderTopWidth: 0.5,
          height: 85,
          paddingBottom: 20,
          paddingTop: 10,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={InflationStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <FiTabIcon emoji="🏠" focused={focused} label="Home" />
          ),
        }}
      />
      
      <Tab.Screen 
        name="Insights" 
        component={InflationStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <FiTabIcon emoji="📊" focused={focused} label="Insights" />
          ),
        }}
      />
      
      <Tab.Screen 
        name="Goals" 
        component={InflationStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <FiTabIcon emoji="🎯" focused={focused} label="Goals" />
          ),
        }}
      />
      
      <Tab.Screen 
        name="Profile" 
        component={InflationStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <FiTabIcon emoji="👤" focused={focused} label="Profile" />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const FiStyleNavigator = () => {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        contentStyle: {
          backgroundColor: FiColors.background,
        },
      }}
    >
      <Stack.Screen name="Main" component={FiStyleTabNavigator} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
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
  tabIconWrapperActive: {
    backgroundColor: FiColors.primary + '20',
  },
  tabEmoji: {
    fontSize: 18,
  },
  tabEmojiActive: {
    fontSize: 20,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: FiColors.textInverse + '60',
  },
  tabLabelActive: {
    color: FiColors.primary,
    fontWeight: '600',
  },
});

export default FiStyleNavigator;
