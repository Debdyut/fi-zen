import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import { useSharedUser } from '../../context/SharedUserContext';

const UserJourneyGuide = ({ currentScreen, navigation, visible, onClose, onChatRequest }) => {
  const { user } = useSharedUser();
  const [currentStep, setCurrentStep] = useState(0);

  // Define user journey flows based on current screen and user data
  const getJourneySteps = () => {
    if (!user) return [];

    const hasGoals = user.goals && user.goals.length > 0;
    const hasSpending = user.monthlySpending && Object.keys(user.monthlySpending).length > 0;
    const netWorth = user.netWorth?.netWorth || 0;

    switch (currentScreen) {
      case 'home':
        return [
          {
            title: 'Welcome to Fi-Zen! 👋',
            description: 'Let\'s start your financial journey with a quick overview.',
            action: 'Continue',
            nextScreen: null
          },
          {
            title: 'Check Your Insights 📊',
            description: 'First, let\'s understand your current financial situation.',
            action: 'View Insights',
            nextScreen: 'Insights'
          },
          {
            title: 'Set Your Goals 🎯',
            description: 'Based on your insights, let\'s set some financial goals.',
            action: 'Create Goals',
            nextScreen: 'Goals'
          }
        ];

      case 'insights':
        if (!hasSpending) {
          return [
            {
              title: 'Add Your Spending Data 💰',
              description: 'To get personalized insights, we need your spending information.',
              action: 'Add Spending',
              nextScreen: 'EnhancedDetailedBreakdown'
            }
          ];
        }
        return [
          {
            title: 'Great! You have insights 📈',
            description: 'Now let\'s turn these insights into actionable goals.',
            action: 'Set Goals',
            nextScreen: 'Goals'
          },
          {
            title: 'Optimize Your Spending 💡',
            description: 'Want to dive deeper into your spending patterns?',
            action: 'Analyze Spending',
            nextScreen: 'EnhancedDetailedBreakdown'
          }
        ];

      case 'goals':
        if (!hasGoals) {
          return [
            {
              title: 'Create Your First Goal 🎯',
              description: 'Goals help you stay focused on what matters most.',
              action: 'Start with Emergency Fund',
              nextScreen: null,
              chatMessage: 'Help me create an emergency fund goal based on my income and expenses'
            },
            {
              title: 'Review Your Insights 📊',
              description: 'Check your financial insights to set realistic goals.',
              action: 'View Insights',
              nextScreen: 'Insights'
            }
          ];
        }
        return [
          {
            title: 'Track Your Progress 📈',
            description: 'Monitor how you\'re doing with detailed metrics.',
            action: 'View Metrics',
            nextScreen: 'EnhancedMetricDetail',
            params: { metric: { name: 'Goal Progress', value: 0 } }
          },
          {
            title: 'Optimize for Goals 💰',
            description: 'Analyze your spending to free up money for goals.',
            action: 'Optimize Spending',
            nextScreen: 'EnhancedDetailedBreakdown'
          }
        ];

      case 'metricDetail':
        return [
          {
            title: 'Take Action 🚀',
            description: 'Based on this metric, here\'s what you can do next.',
            action: 'Set Related Goal',
            nextScreen: 'Goals'
          },
          {
            title: 'Deep Dive Analysis 🔍',
            description: 'Get a detailed breakdown of this metric.',
            action: 'Detailed Analysis',
            nextScreen: 'EnhancedDetailedBreakdown'
          }
        ];

      case 'breakdown':
        return [
          {
            title: 'Create Savings Goals 💰',
            description: 'Turn your spending optimizations into savings goals.',
            action: 'Set Savings Goal',
            nextScreen: 'Goals'
          },
          {
            title: 'Monitor Progress 📊',
            description: 'Track how your optimizations affect your overall financial health.',
            action: 'View Insights',
            nextScreen: 'Insights'
          }
        ];

      default:
        return [];
    }
  };

  const journeySteps = getJourneySteps();

  const handleStepAction = (step) => {
    if (step.chatMessage && onChatRequest) {
      // Trigger chat with specific message
      onClose();
      onChatRequest(step.chatMessage);
    } else if (step.nextScreen) {
      onClose();
      navigation.navigate(step.nextScreen, step.params || { selectedUserId: user?.userId });
    } else {
      // Move to next step
      if (currentStep < journeySteps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        onClose();
      }
    }
  };

  const handleSkip = () => {
    onClose();
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (currentStep < journeySteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  if (!visible || journeySteps.length === 0) {
    return null;
  }

  const currentStepData = journeySteps[currentStep];

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Your Journey Guide</Text>
            <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${((currentStep + 1) / journeySteps.length) * 100}%` }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              {currentStep + 1} of {journeySteps.length}
            </Text>
          </View>

          <ScrollView style={styles.content}>
            <Text style={styles.stepTitle}>{currentStepData.title}</Text>
            <Text style={styles.stepDescription}>{currentStepData.description}</Text>

            {/* Contextual suggestions based on user data */}
            {currentScreen === 'insights' && user && (
              <View style={styles.contextualInfo}>
                <Text style={styles.contextualTitle}>Your Current Status:</Text>
                <Text style={styles.contextualText}>
                  • Net Worth: ₹{(user.netWorth?.netWorth || 0).toLocaleString()}
                </Text>
                <Text style={styles.contextualText}>
                  • Monthly Income: ₹{(user.profile?.monthlyIncome || 0).toLocaleString()}
                </Text>
                <Text style={styles.contextualText}>
                  • Goals: {user.goals?.length || 0} active
                </Text>
              </View>
            )}

            {currentScreen === 'goals' && user && (
              <View style={styles.contextualInfo}>
                <Text style={styles.contextualTitle}>Recommended Goals:</Text>
                <Text style={styles.contextualText}>
                  • Emergency Fund: ₹{((user.profile?.monthlyIncome || 50000) * 6).toLocaleString()}
                </Text>
                <Text style={styles.contextualText}>
                  • Investment Goal: 20% of monthly income
                </Text>
                <Text style={styles.contextualText}>
                  • Retirement Planning: Start early for compound growth
                </Text>
              </View>
            )}
          </ScrollView>

          <View style={styles.actions}>
            <View style={styles.navigationButtons}>
              {currentStep > 0 && (
                <TouchableOpacity onPress={handlePrevious} style={styles.navButton}>
                  <Text style={styles.navButtonText}>Previous</Text>
                </TouchableOpacity>
              )}
              
              {currentStep < journeySteps.length - 1 && (
                <TouchableOpacity onPress={handleNext} style={styles.navButton}>
                  <Text style={styles.navButtonText}>Next</Text>
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity 
              onPress={() => handleStepAction(currentStepData)} 
              style={styles.actionButton}
            >
              <Text style={styles.actionButtonText}>{currentStepData.action}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  skipButton: {
    padding: 8,
  },
  skipText: {
    fontSize: 14,
    color: '#666666',
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#F0F0F0',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#00D4AA',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    marginBottom: 20,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  stepDescription: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    marginBottom: 16,
  },
  contextualInfo: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  contextualTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  contextualText: {
    fontSize: 13,
    color: '#666666',
    marginBottom: 4,
  },
  actions: {
    gap: 12,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  navButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  navButtonText: {
    fontSize: 14,
    color: '#666666',
  },
  actionButton: {
    backgroundColor: '#00D4AA',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default UserJourneyGuide;
