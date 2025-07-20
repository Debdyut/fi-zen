import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FiColors } from '../theme/consolidatedFiColors';
import FiHomeScreenWrapper from '../components/fi-style/FiHomeScreenWrapper';
import InflationScreen from '../screens/InflationScreen';
import InflationSetupScreen from '../screens/InflationSetupScreen';
import DetailedBreakdownScreen from '../components/results/DetailedBreakdownScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabNavigator = ({ navigation }) => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: FiColors.surface,
          borderTopColor: FiColors.secondary + '20',
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarActiveTintColor: FiColors.primary,
        tabBarInactiveTintColor: FiColors.secondary,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}>
      <Tab.Screen 
        name="Home" 
        component={FiHomeScreenWrapper}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>🏠</Text>,
        }}
      />
      <Tab.Screen 
        name="Inflation" 
        component={InflationScreen}
        options={{
          tabBarLabel: 'Inflation',
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>📈</Text>,
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

export default AppNavigator;