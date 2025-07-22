import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { FadeInUp } from '../animations/AnimatedCard';
import LocationAdapter from '../../utils/LocationAdapter';

const FiColors = {
  surface: '#FFFFFF',
  primary: '#00D4AA',
  text: '#1A1A1A',
  textSecondary: '#666666',
  success: '#00D4AA',
  warning: '#FFB800',
  error: '#FF6B6B',
  border: '#E0E0E0',
};

const LocationInsightsCard = ({ userProfile }) => {
  const [showDetails, setShowDetails] = useState(false);
  
  const locationInsights = LocationAdapter.getLocationInsights(
    userProfile.location, 
    userProfile.monthlyIncome
  );
  
  const savingsTarget = LocationAdapter.getLocationSavingsTarget(
    userProfile.location,
    userProfile.monthlyIncome
  );

  // Get city icon based on tier
  const getCityIcon = (tier) => {
    const icons = {
      tier1: '🏙️',
      tier2: '🌆',
      tier3: '🏘️'
    };
    return icons[tier] || '📍';
  };

  // Get affordability status
  const getAffordabilityStatus = (ratio) => {
    if (ratio > 4) return { status: 'Excellent', color: FiColors.success, icon: '💰' };
    if (ratio > 2.5) return { status: 'Good', color: FiColors.success, icon: '✅' };
    if (ratio > 1.5) return { status: 'Moderate', color: FiColors.warning, icon: '⚖️' };
    return { status: 'Tight', color: FiColors.error, icon: '⚠️' };
  };

  const affordabilityStatus = getAffordabilityStatus(locationInsights.affordabilityRatio);

  return (
    <FadeInUp delay={150}>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardIcon}>{getCityIcon(locationInsights.tier)}</Text>
          <View style={styles.cardTitleContainer}>
            <View style={styles.titleRow}>
              <Text style={styles.cardTitle}>Location Insights</Text>
              <TouchableOpacity 
                onPress={() => setShowDetails(true)}
                style={styles.detailsButton}
              >
                <Text style={styles.detailsIcon}>ℹ️</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.cardDescription}>
              Living in {locationInsights.city}
            </Text>
          </View>
        </View>
        
        <View style={styles.cardContent}>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Cost of Living</Text>
            <Text style={styles.metricValue}>
              ₹{Math.round(locationInsights.costOfLiving).toLocaleString()}/month
            </Text>
          </View>
          
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Affordability</Text>
            <View style={styles.statusContainer}>
              <Text style={styles.statusIcon}>{affordabilityStatus.icon}</Text>
              <Text style={[styles.statusText, { color: affordabilityStatus.color }]}>
                {affordabilityStatus.status}
              </Text>
            </View>
          </View>
          
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Recommended Savings</Text>
            <Text style={[styles.metricValue, { color: FiColors.primary }]}>
              {savingsTarget.target}%
            </Text>
          </View>
          
          <Text style={styles.reasoningText}>{savingsTarget.reasoning}</Text>
        </View>

        {/* Details Modal */}
        <Modal
          visible={showDetails}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowDetails(false)}
        >
          <TouchableOpacity 
            style={styles.modalOverlay}
            onPress={() => setShowDetails(false)}
          >
            <View style={styles.detailsContainer}>
              <Text style={styles.detailsTitle}>
                {locationInsights.city} Financial Overview
              </Text>
              
              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>City Profile</Text>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Tier:</Text>
                  <Text style={styles.detailValue}>
                    {locationInsights.tier.toUpperCase()} City
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Region:</Text>
                  <Text style={styles.detailValue}>
                    {locationInsights.region.charAt(0).toUpperCase() + locationInsights.region.slice(1)} India
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Cost Multiplier:</Text>
                  <Text style={styles.detailValue}>
                    {locationInsights.costMultiplier}x national average
                  </Text>
                </View>
              </View>
              
              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>Your Financial Position</Text>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Monthly Income:</Text>
                  <Text style={styles.detailValue}>
                    ₹{userProfile.monthlyIncome.toLocaleString()}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Living Costs:</Text>
                  <Text style={styles.detailValue}>
                    ₹{Math.round(locationInsights.costOfLiving).toLocaleString()}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Surplus Ratio:</Text>
                  <Text style={[styles.detailValue, { color: affordabilityStatus.color }]}>
                    {locationInsights.affordabilityRatio.toFixed(1)}x
                  </Text>
                </View>
              </View>
              
              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>Location Advantages</Text>
                {locationInsights.tier === 'tier1' && (
                  <>
                    <Text style={styles.advantageText}>• Higher salary opportunities</Text>
                    <Text style={styles.advantageText}>• Better career growth prospects</Text>
                    <Text style={styles.advantageText}>• Access to premium financial services</Text>
                  </>
                )}
                {locationInsights.tier === 'tier2' && (
                  <>
                    <Text style={styles.advantageText}>• Lower cost of living</Text>
                    <Text style={styles.advantageText}>• Higher savings potential</Text>
                    <Text style={styles.advantageText}>• Growing investment opportunities</Text>
                  </>
                )}
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    </FadeInUp>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: FiColors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  cardIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  cardTitleContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: FiColors.text,
    marginBottom: 4,
  },
  detailsButton: {
    padding: 4,
  },
  detailsIcon: {
    fontSize: 16,
  },
  cardDescription: {
    fontSize: 14,
    color: FiColors.textSecondary,
  },
  cardContent: {
    alignItems: 'flex-start',
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
  },
  metricLabel: {
    fontSize: 14,
    color: FiColors.textSecondary,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '600',
    color: FiColors.text,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  reasoningText: {
    fontSize: 12,
    color: FiColors.textSecondary,
    fontStyle: 'italic',
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  detailsContainer: {
    backgroundColor: FiColors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    maxHeight: '80%',
  },
  detailsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: FiColors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  detailSection: {
    marginBottom: 20,
  },
  detailSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: FiColors.text,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: FiColors.textSecondary,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: FiColors.text,
  },
  advantageText: {
    fontSize: 14,
    color: FiColors.text,
    marginBottom: 4,
  },
});

export default LocationInsightsCard;
