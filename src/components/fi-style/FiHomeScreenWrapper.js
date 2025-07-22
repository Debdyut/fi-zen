import React from 'react';
import FiHomeScreen from './FiHomeScreen';
import DataService from '../../services/DataService';

const FiHomeScreenWrapper = ({ navigation, route }) => {
  // Get selected user from DataService
  const selectedUser = route.params?.selectedUserId || DataService.getCurrentUser() || '1010101010';
  console.log('FiHomeScreenWrapper: Using user', selectedUser);
  
  // Set the user in DataService
  DataService.setCurrentUser(selectedUser);
  
  // Mock inflation data for demo
  const mockInflationData = {
    personal: 11.8,
    government: 6.5,
    location: { city: 'Mumbai', state: 'Maharashtra' },
    difference: 5.3,
    isHigher: true,
    confidence: 85,
    dataSource: 'Demo Data'
  };

  return (
    <FiHomeScreen 
      navigation={navigation}
      route={route}
      inflationData={mockInflationData}
      selectedUserId={selectedUser}
    />
  );
};

export default FiHomeScreenWrapper;
