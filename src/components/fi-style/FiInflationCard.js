import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Fi App Colors (from screenshots)
const FiColors = {
  background: '#1A1A1A',
  surface: '#FFFFFF', 
  primary: '#00D4AA',
  text: '#1A1A1A',
  textSecondary: '#666666',
  textLight: '#999999',
  error: '#FF6B6B'
};

const FiInflationCard = ({ inflationData = {} }) => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Fi-style header */}
        <View style={styles.header}>
          <Text style={styles.title}>Personal Inflation</Text>
          <View style={styles.locationBadge}>
            <Text style={styles.locationText}>Mumbai</Text>
          </View>
        </View>

        {/* Large number display (Fi wealth style) */}
        <View style={styles.rateDisplay}>
          <Text style={styles.mainRate}>{inflationData.personal || 0}%</Text>
          <Text style={styles.rateLabel}>vs Govt 6.5%</Text>
        </View>

        {/* Fi-style impact section */}
        <View style={styles.impactSection}>
          <Text style={styles.impactTitle}>Impact on ₹1L</Text>
          <Text style={styles.impactValue}>+₹11,800 needed</Text>
        </View>

        {/* Fi-style action button */}
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => navigation.navigate('DetailedBreakdownScreen')}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: FiColors.background,
    padding: 16,
  },
  card: {
    backgroundColor: FiColors.surface,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: FiColors.text,
  },
  locationBadge: {
    backgroundColor: FiColors.primary + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  locationText: {
    fontSize: 12,
    color: FiColors.primary,
    fontWeight: '500',
  },
  rateDisplay: {
    alignItems: 'center',
    marginBottom: 24,
  },
  mainRate: {
    fontSize: 48,
    fontWeight: '300', // Fi's light weight for numbers
    color: FiColors.error,
    marginBottom: 4,
  },
  rateLabel: {
    fontSize: 14,
    color: FiColors.textSecondary,
  },
  impactSection: {
    backgroundColor: '#FFF5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    alignItems: 'center',
  },
  impactTitle: {
    fontSize: 14,
    color: FiColors.textSecondary,
    marginBottom: 4,
  },
  impactValue: {
    fontSize: 18,
    fontWeight: '600',
    color: FiColors.error,
  },
  actionButton: {
    backgroundColor: FiColors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default FiInflationCard;
