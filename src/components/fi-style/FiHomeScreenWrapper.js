import React from 'react';
import EnhancedHomeScreen from '../../screens/EnhancedHomeScreen_WithRealData';
import DataService from '../../services/DataService';

const FiHomeScreenWrapper = ({ navigation, route }) => {
  // Get selected user from DataService
  const selectedUser = route.params?.selectedUserId || DataService.getCurrentUser() || '1010101010';
  console.log('FiHomeScreenWrapper: Using user', selectedUser);
  
  // Set the user in DataService
  DataService.setCurrentUser(selectedUser);

  return (
    <EnhancedHomeScreen 
      navigation={navigation}
      route={route}
    />
  );
};

export default FiHomeScreenWrapper;
