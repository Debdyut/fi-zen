/**
 * AI-Enhanced Goals Screen
 * Integrates existing GoalsScreen with AI coaching capabilities
 */

import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Text } from 'react-native';
import GoalsScreen from './GoalsScreen';
import AIGoalCoach from '../components/goals/AIGoalCoach';
import { useTheme } from '../theme/ThemeContext';
import { useLanguage } from '../localization/LanguageContext';
import { getThemeColors } from '../theme/consolidatedFiColors';
import DataService from '../services/DataService';

const AIEnhancedGoalsScreen = ({ navigation }) => {
  const { isDarkMode } = useTheme();
  const { t } = useLanguage();
  const colors = getThemeColors(isDarkMode);
  
  const [currentUserId, setCurrentUserId] = useState(null);
  const [showAICoach, setShowAICoach] = useState(true);
  const [userGoals, setUserGoals] = useState([]);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userId = DataService.getCurrentUser();
      setCurrentUserId(userId);
      
      // Load existing goals
      const userData = await DataService.getUserData(userId);
      setUserGoals(userData?.goals || []);
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  const handleGoalUpdate = (newGoal) => {
    setUserGoals(prev => [...prev, newGoal]);
    // Here you would typically save to DataService
    console.log('New goal added:', newGoal);
  };

  const toggleAICoach = () => {
    setShowAICoach(!showAICoach);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* AI Toggle Button */}
      <View style={styles.header}>
        <TouchableOpacity
          style={[
            styles.aiToggle,
            { 
              backgroundColor: showAICoach ? colors.primary : colors.surface,
              borderColor: colors.primary
            }
          ]}
          onPress={toggleAICoach}
        >
          <Text style={[
            styles.aiToggleText,
            { color: showAICoach ? 'white' : colors.primary }
          ]}>
            {showAICoach ? '🤖 AI Coach ON' : '📋 AI Coach OFF'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* AI Goal Coach Section */}
        {showAICoach && currentUserId && (
          <View style={styles.aiSection}>
            <AIGoalCoach
              userId={currentUserId}
              currentGoals={userGoals}
              onGoalUpdate={handleGoalUpdate}
            />
          </View>
        )}

        {/* Original Goals Screen */}
        <View style={styles.originalGoalsSection}>
          <GoalsScreen navigation={navigation} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    paddingTop: 60, // Account for status bar
  },
  aiToggle: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  aiToggleText: {
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  aiSection: {
    marginBottom: 20,
  },
  originalGoalsSection: {
    flex: 1,
  },
});

export default AIEnhancedGoalsScreen;
