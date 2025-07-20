import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FiColors } from '../theme/colors';
import InflationCalculator from '../utils/InflationCalculator';
import InflationQuestionnaire from './InflationQuestionnaire';

const InflationCard = ({ userId, navigation }) => {
  const [showInfo, setShowInfo] = useState(false);
  const [userSpendingData, setUserSpendingData] = useState(null);
  
  const inflationData = InflationCalculator.getInflationComparison(userId, userSpendingData);
  const category = InflationCalculator.getInflationCategory(inflationData.personal);
  
  const handleQuestionnaireComplete = (spendingData, source) => {
    setUserSpendingData({ ...spendingData, source });
  };

  const openInflationSetup = () => {
    navigation.navigate('InflationSetup');
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Check if we have data from InflationSetup
      const params = navigation.getState()?.routes?.find(r => r.name === 'InflationSetup')?.params;
      if (params?.spendingData) {
        handleQuestionnaireComplete(params.spendingData, params.source);
        // Clear the params
        navigation.setParams({ spendingData: null, source: null });
      }
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Personal Inflation Rate 📈</Text>
        <Text style={styles.subtitle}>Your reality vs government data</Text>
      </View>

      <View style={styles.comparisonContainer}>
        <View style={styles.rateSection}>
          <Text style={styles.rateLabel}>Your Rate</Text>
          <Text style={[styles.rateValue, { color: category.color }]}>
            {inflationData.personal}%
          </Text>
          <Text style={styles.categoryText}>{category.category}</Text>
        </View>

        <View style={styles.vsSection}>
          <Text style={styles.vsText}>vs</Text>
          <Text style={styles.impactEmoji}>{inflationData.impactEmoji}</Text>
        </View>

        <View style={styles.rateSection}>
          <Text style={styles.rateLabel}>Govt Rate</Text>
          <Text style={[styles.rateValue, { color: FiColors.secondary }]}>
            {inflationData.government}%
          </Text>
          <Text style={styles.categoryText}>Official</Text>
        </View>
      </View>

      <View style={styles.impactSection}>
        <Text style={styles.impactText}>
          {inflationData.isHigher 
            ? `Your expenses are rising ${Math.abs(inflationData.difference).toFixed(1)}% faster than average`
            : `You're managing inflation ${Math.abs(inflationData.difference).toFixed(1)}% better than average`
          }
        </Text>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity 
          style={styles.updateButton}
          onPress={openInflationSetup}>
          <Text style={styles.updateButtonText}>Update My Data 📝</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.expandButton}
          onPress={() => setShowInfo(!showInfo)}>
          <Text style={styles.expandText}>
            {showInfo ? 'Less' : 'More'} 🤔
          </Text>
          <Text style={styles.arrowIcon}>{showInfo ? '‹' : '›'}</Text>
        </TouchableOpacity>
      </View>


      
      {showInfo && (
        <View style={styles.infoPanel}>
          <Text style={styles.infoPanelTitle}>How We Calculate This 🤔</Text>
          
          <Text style={styles.infoText}>
            <Text style={styles.boldText}>Your Personal Inflation:</Text>{"\n"}
            {userSpendingData ? 'Based on your spending data' : 'Using estimated spending patterns'}
          </Text>
          
          <Text style={styles.infoText}>
            <Text style={styles.boldText}>Government Rate:</Text> MOSPI Consumer Price Index data.
          </Text>
          
          {!userSpendingData && (
            <Text style={styles.infoText}>
              <Text style={styles.boldText}>💡 Tip:</Text> Update your data for accurate results!
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: FiColors.surface,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: FiColors.primary + '20',
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: FiColors.text,
    marginBottom: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  updateButton: {
    flex: 1,
    backgroundColor: FiColors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  updateButtonText: {
    color: FiColors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: FiColors.primary + '10',
    borderRadius: 8,
  },
  expandText: {
    fontSize: 12,
    color: FiColors.primary,
    fontWeight: '500',
    marginRight: 4,
  },
  arrowIcon: {
    fontSize: 18,
    color: FiColors.primary,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 12,
    color: FiColors.secondary,
    fontStyle: 'italic',
  },
  comparisonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  rateSection: {
    alignItems: 'center',
    flex: 1,
  },
  rateLabel: {
    fontSize: 12,
    color: FiColors.text,
    opacity: 0.7,
    marginBottom: 4,
  },
  rateValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 10,
    color: FiColors.text,
    opacity: 0.6,
  },
  vsSection: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  vsText: {
    fontSize: 12,
    color: FiColors.secondary,
    marginBottom: 4,
  },
  impactEmoji: {
    fontSize: 20,
  },
  impactSection: {
    backgroundColor: FiColors.primary + '10',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: FiColors.primary + '20',
  },
  impactText: {
    fontSize: 12,
    color: FiColors.text,
    textAlign: 'center',
    lineHeight: 16,
  },
  infoPanel: {
    backgroundColor: FiColors.background,
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: FiColors.primary + '40',
  },
  infoPanelTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: FiColors.text,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 12,
    color: FiColors.text,
    lineHeight: 16,
    marginBottom: 8,
  },
  boldText: {
    fontWeight: '600',
    color: FiColors.primary,
  },
});

export default InflationCard;