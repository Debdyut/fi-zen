import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { FadeInUp } from '../animations/AnimatedCard';
import LocationAdapter from '../../utils/LocationAdapter';
import { useTheme } from '../../theme/ThemeContext';
import { getThemeColors } from '../../theme/consolidatedFiColors';

// Remove hardcoded colors - will use theme colors instead

const LocationInsightsCard = ({ userProfile }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);
  
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
    if (ratio > 4) return { status: 'Excellent', color: colors.success, icon: '💰' };
    if (ratio > 2.5) return { status: 'Good', color: colors.success, icon: '✅' };
    if (ratio > 1.5) return { status: 'Moderate', color: colors.warning, icon: '⚖️' };
    return { status: 'Tight', color: colors.error, icon: '⚠️' };
  };

  const affordabilityStatus = getAffordabilityStatus(locationInsights.affordabilityRatio);
  
  // Affordability Gauge Component (simplified)
  const AffordabilityGauge = () => {
    const ratio = locationInsights.affordabilityRatio;
    const maxRatio = 5;
    const percentage = Math.min(ratio / maxRatio, 1) * 100;
    
    return (
      <View style={styles.affordabilityGauge}>
        <View style={styles.gaugeTrack}>
          <View 
            style={[
              styles.gaugeFill, 
              { 
                width: `${percentage}%`,
                backgroundColor: affordabilityStatus.color
              }
            ]} 
          />
        </View>
        <Text style={[styles.gaugeText, { color: affordabilityStatus.color }]}>
          {ratio.toFixed(1)}x
        </Text>
      </View>
    );
  };
  
  const handleQuickAction = (action) => {
    console.log('Quick action:', action);
  };

  const styles = StyleSheet.create({
    card: {
      backgroundColor: '#FFFFFF',
      borderRadius: 20,
      padding: 20,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 12,
      elevation: 6,
      borderWidth: 1,
      borderColor: 'rgba(0, 212, 170, 0.1)',
    },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 16,
    },
    iconContainer: {
      marginRight: 12,
    },
    iconGradient: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
    },
    cardIcon: {
      fontSize: 24,
    },
    cardTitleContainer: {
      flex: 1,
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    headerActions: {
      flexDirection: 'row',
      gap: 8,
    },
    bookmarkButton: {
      padding: 4,
    },
    bookmarkIcon: {
      fontSize: 16,
    },
    gaugeContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
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
      color: colors.textSecondary,
    },
    cardContent: {
      alignItems: 'flex-start',
    },
    benchmarkSection: {
      width: '100%',
      marginBottom: 16,
      backgroundColor: '#F8F9FA',
      borderRadius: 12,
      padding: 12,
    },
    benchmarkTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 8,
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
      color: colors.textSecondary,
    },
    metricValue: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
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
      color: colors.textSecondary,
      fontStyle: 'italic',
      marginBottom: 16,
    },
    quickActions: {
      width: '100%',
    },
    quickActionsTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 8,
    },
    actionButtons: {
      flexDirection: 'row',
      gap: 8,
    },
    actionButton: {
      flex: 1,
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 8,
      alignItems: 'center',
    },
    actionButtonText: {
      fontSize: 12,
      fontWeight: '600',
    },
    affordabilityGauge: {
      width: 80,
      alignItems: 'center',
    },
    gaugeTrack: {
      width: 60,
      height: 8,
      backgroundColor: '#E0E0E0',
      borderRadius: 4,
      overflow: 'hidden',
      marginBottom: 8,
    },
    gaugeFill: {
      height: '100%',
      borderRadius: 4,
    },
    gaugeText: {
      fontSize: 14,
      fontWeight: '600',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    detailsContainer: {
      backgroundColor: colors.surface,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 24,
      maxHeight: '80%',
    },
    detailsTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 20,
      textAlign: 'center',
    },
    detailSection: {
      marginBottom: 20,
    },
    detailSectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
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
      color: colors.textSecondary,
    },
    detailValue: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
    },
    advantageText: {
      fontSize: 14,
      color: colors.text,
      marginBottom: 4,
    },
  });

  return (
    <FadeInUp delay={150}>
      <View style={[styles.card, { backgroundColor: affordabilityStatus.color + '05' }]}>
        <View style={styles.cardHeader}>
          <View style={styles.iconContainer}>
            <View style={[styles.iconGradient, { backgroundColor: affordabilityStatus.color + '15' }]}>
              <Text style={styles.cardIcon}>{getCityIcon(locationInsights.tier)}</Text>
            </View>
          </View>
          <View style={styles.cardTitleContainer}>
            <View style={styles.titleRow}>
              <Text style={styles.cardTitle}>Location Insights</Text>
              <View style={styles.headerActions}>
                <TouchableOpacity 
                  onPress={() => setIsBookmarked(!isBookmarked)}
                  style={styles.bookmarkButton}
                >
                  <Text style={styles.bookmarkIcon}>
                    {isBookmarked ? '🔖' : '📌'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => setShowDetails(true)}
                  style={styles.detailsButton}
                >
                  <Text style={styles.detailsIcon}>ℹ️</Text>
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.cardDescription}>
              Living in {locationInsights.city}
            </Text>
          </View>
          <View style={styles.gaugeContainer}>
            <AffordabilityGauge />
          </View>
        </View>
        
        <View style={styles.cardContent}>
          <View style={styles.benchmarkSection}>
            <Text style={styles.benchmarkTitle}>📊 City Metrics</Text>
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
              <Text style={[styles.metricValue, { color: colors.primary }]}>
                {savingsTarget.target}%
              </Text>
            </View>
          </View>
          
          <Text style={styles.reasoningText}>{savingsTarget.reasoning}</Text>
          
          <View style={styles.quickActions}>
            <Text style={styles.quickActionsTitle}>⚡ Quick Actions</Text>
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={[styles.actionButton, { backgroundColor: affordabilityStatus.color + '15' }]}
                onPress={() => handleQuickAction('optimize')}
              >
                <Text style={[styles.actionButtonText, { color: affordabilityStatus.color }]}>
                  🏠 Optimize Living
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.actionButton, { backgroundColor: colors.primary + '15' }]}
                onPress={() => handleQuickAction('compare')}
              >
                <Text style={[styles.actionButtonText, { color: colors.primary }]}>
                  📊 Compare Cities
                </Text>
              </TouchableOpacity>
            </View>
          </View>
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



export default LocationInsightsCard;
