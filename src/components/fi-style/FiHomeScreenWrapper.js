import React from 'react';
import FiHomeScreen from './FiHomeScreen';

const FiHomeScreenWrapper = ({ navigation }) => {
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
      inflationData={mockInflationData} 
    />
  );
};

export default FiHomeScreenWrapper;
