import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import { FiColors } from '../theme/consolidatedFiColors';
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

const TabNavigator = ({ navigation }) => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1A1A1A', // Dark background like Fi
          borderTopColor: '#E0E0E0' + '30',
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
            <FiTabIcon emoji="🏠" focused={focused} label="Home" />
          ),
        }}
      />
      <Tab.Screen 
        name="Insights" 
        component={InsightsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <FiTabIcon emoji="📊" focused={focused} label="Insights" />
          ),
        }}
      />
      <Tab.Screen 
        name="Goals" 
        component={GoalsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <FiTabIcon emoji="🎯" focused={focused} label="Goals" />
          ),
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <FiTabIcon emoji="👤" focused={focused} label="Profile" />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
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
  tabIconWrapperActive: {
    backgroundColor: '#00D4AA' + '20', // Fi primary color
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
    color: '#FFFFFF' + '60',
    textAlign: 'center',
    numberOfLines: 1,
  },
  tabLabelActive: {
    color: '#00D4AA',
    fontWeight: '600',
  },
});

export default AppNavigator;