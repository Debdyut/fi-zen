import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useLanguage } from '../../localization/LanguageContext';

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
  const { t } = useLanguage();
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Fi-style header */}
        <View style={styles.header}>
          <View style={styles.titleSection}>
            <Text style={styles.title}>{t('inflation.personalInflation')}</Text>
            <Text style={styles.lastUpdated}>{t('inflation.lastUpdated')}</Text>
          </View>
          <View style={styles.headerRight}>
            <View style={styles.locationBadge}>
              <Text style={styles.locationText}>📍 {t('location.mumbai')}</Text>
            </View>
            <TouchableOpacity style={styles.refreshButton} onPress={() => console.log('Refreshing data...')}>
              <Text style={styles.refreshIcon}>↻</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Large number display (Fi wealth style) */}
        <View style={styles.rateDisplay}>
          <View style={styles.rateWithTrend}>
            <Text style={styles.mainRate}>{inflationData.personal || 0}%</Text>
            <View style={styles.trendSection}>
              <Text style={styles.trendIndicator}>↗ {t('inflation.trendingUp')}</Text>
              <Text style={styles.trendSubtext}>{t('inflation.vsLastMonth')}</Text>
            </View>
          </View>
          <View style={styles.contextBadge}>
            <Text style={styles.contextText}>📈 {t('inflation.higherThanAverage')}</Text>
          </View>
          <View style={styles.govtRateSection}>
            <Text style={styles.rateLabel}>{t('inflation.vsGovt')}</Text>
            <Image 
              source={require('../../../assets/logos/Logo-MOSPI-01.58746789e2643aae82fb.png')}
              style={styles.mospiLogoSmall}
              resizeMode="contain"
            />
            <Text style={styles.mospiHelperText}>{t('inflation.officialSource')}</Text>
          </View>
        </View>

        {/* Fi-style impact section */}
        <View style={styles.impactSection}>
          <View style={styles.impactHeader}>
            <Text style={styles.impactEmoji}>💸</Text>
            <Text style={styles.impactTitle}>{t('inflation.realImpact')}</Text>
          </View>
          <Text style={styles.impactDescription}>{t('inflation.impactDescription')}</Text>
          <Text style={styles.impactValue}>{t('inflation.impactValue')}</Text>
          <Text style={styles.impactSubtext}>{t('inflation.impactSubtext')}</Text>
        </View>

        {/* Fi-style action button */}
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => navigation.navigate('DetailedBreakdownScreen')}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>{t('inflation.viewBreakdown')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    paddingHorizontal: 16,
    paddingVertical: 8,
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
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  titleSection: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  refreshButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: FiColors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  refreshIcon: {
    fontSize: 16,
    color: FiColors.primary,
    fontWeight: '600',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: FiColors.text,
  },
  lastUpdated: {
    fontSize: 11,
    color: FiColors.textLight,
    marginTop: 2,
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
  rateWithTrend: {
    alignItems: 'center',
    marginBottom: 8,
  },
  trendSection: {
    alignItems: 'center',
    marginTop: 4,
  },
  trendIndicator: {
    fontSize: 14,
    color: FiColors.error,
    fontWeight: '500',
  },
  trendSubtext: {
    fontSize: 11,
    color: FiColors.textLight,
    marginTop: 2,
  },
  contextBadge: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 12,
  },
  contextText: {
    fontSize: 12,
    color: '#E65100',
    fontWeight: '500',
  },
  mainRate: {
    fontSize: 48,
    fontWeight: '300', // Fi's light weight for numbers
    color: FiColors.error,
    marginBottom: 4,
  },
  govtRateSection: {
    alignItems: 'center',
    gap: 8,
  },
  rateLabel: {
    fontSize: 14,
    color: FiColors.textSecondary,
  },
  mospiLogoSmall: {
    width: 140,
    height: 70,
  },
  mospiHelperText: {
    fontSize: 11,
    color: FiColors.textLight,
    textAlign: 'center',
    fontStyle: 'italic',
    alignSelf: 'center',
  },
  impactSection: {
    backgroundColor: '#FFF5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    alignItems: 'center',
  },
  impactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  impactEmoji: {
    fontSize: 20,
  },
  impactTitle: {
    fontSize: 16,
    color: FiColors.text,
    fontWeight: '600',
  },
  impactDescription: {
    fontSize: 13,
    color: FiColors.textSecondary,
    marginBottom: 4,
  },
  impactValue: {
    fontSize: 18,
    fontWeight: '600',
    color: FiColors.error,
    marginBottom: 2,
    textAlign: 'center',
  },
  impactSubtext: {
    fontSize: 12,
    color: FiColors.textLight,
    fontStyle: 'italic',
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
