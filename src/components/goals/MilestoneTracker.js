// Milestone Celebration System
// Addresses user feedback: "Goals feel overwhelming, need smaller steps"

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { FadeInUp } from '../animations/AnimatedCard';

const FiColors = {
  primary: '#00D4AA',
  success: '#00D4AA',
  warning: '#FFB800',
  background: '#FFFFFF',
  text: '#1A1A1A',
  textSecondary: '#666666',
  border: '#E0E0E0',
};

class MilestoneEngine {
  // Generate milestones for a goal based on user feedback patterns
  static generateMilestones(goal, userProfile) {
    const milestones = [];
    const targetAmount = goal.targetAmount;
    const currentAmount = goal.currentAmount;
    const remaining = targetAmount - currentAmount;
    
    // Different milestone strategies based on goal size and user income
    const income = userProfile?.monthlyIncome || 100000;
    const isLargeGoal = targetAmount > income * 12; // More than 1 year income
    const isSmallIncome = income < 80000;
    
    // Milestone intervals based on user feedback
    let intervals;
    if (isSmallIncome) {
      // Smaller milestones for lower income users (Meera's feedback)
      intervals = [10000, 25000, 50000, 100000, 250000, 500000];
    } else if (isLargeGoal) {
      // Larger milestones for big goals (Sanjay's feedback)
      intervals = [100000, 250000, 500000, 1000000, 2500000, 5000000];
    } else {
      // Standard milestones for mid-range goals
      intervals = [25000, 50000, 100000, 250000, 500000, 1000000];
    }
    
    // Generate milestones from current amount to target
    intervals.forEach((interval, index) => {
      const milestoneAmount = Math.ceil(currentAmount / interval) * interval;
      
      // Only add milestones that are achievable and meaningful
      if (milestoneAmount > currentAmount && milestoneAmount <= targetAmount) {
        const progress = ((milestoneAmount - currentAmount) / remaining) * 100;
        const timeToReach = Math.ceil((milestoneAmount - currentAmount) / goal.monthlyContribution);
        
        milestones.push({
          id: `${goal.goalId}_milestone_${milestoneAmount}`,
          goalId: goal.goalId,
          amount: milestoneAmount,
          currentAmount: currentAmount,
          progress: Math.min(progress, 100),
          timeToReach: timeToReach,
          status: currentAmount >= milestoneAmount ? 'completed' : 'pending',
          tier: this.getMilestoneTier(interval),
          celebration: this.getCelebrationLevel(interval, isSmallIncome),
          message: this.getMilestoneMessage(milestoneAmount, goal.title, isSmallIncome)
        });
      }
    });
    
    // Add final goal milestone
    milestones.push({
      id: `${goal.goalId}_final`,
      goalId: goal.goalId,
      amount: targetAmount,
      currentAmount: currentAmount,
      progress: 100,
      timeToReach: Math.ceil(remaining / goal.monthlyContribution),
      status: currentAmount >= targetAmount ? 'completed' : 'pending',
      tier: 'final',
      celebration: 'major',
      message: `🎉 ${goal.title} Complete! You've achieved your full goal!`
    });
    
    return milestones.slice(0, 6); // Limit to 6 milestones to avoid overwhelm
  }
  
  static getMilestoneTier(amount) {
    if (amount <= 25000) return 'bronze';
    if (amount <= 100000) return 'silver';
    if (amount <= 500000) return 'gold';
    return 'platinum';
  }
  
  static getCelebrationLevel(amount, isSmallIncome) {
    if (isSmallIncome) {
      if (amount <= 10000) return 'small';
      if (amount <= 50000) return 'medium';
      return 'large';
    } else {
      if (amount <= 100000) return 'small';
      if (amount <= 500000) return 'medium';
      return 'large';
    }
  }
  
  static getMilestoneMessage(amount, goalTitle, isSmallIncome) {
    const formattedAmount = amount >= 100000 ? 
      `₹${(amount/100000).toFixed(1)}L` : 
      `₹${(amount/1000).toFixed(0)}K`;
    
    const encouragements = isSmallIncome ? [
      `Great progress! ${formattedAmount} saved for ${goalTitle}! 🌟`,
      `You're building momentum! ${formattedAmount} milestone reached! 💪`,
      `Small steps, big wins! ${formattedAmount} closer to your goal! 🎯`,
      `Every rupee counts! ${formattedAmount} milestone achieved! 🚀`
    ] : [
      `Excellent progress! ${formattedAmount} milestone reached! 🎉`,
      `You're on fire! ${formattedAmount} saved for ${goalTitle}! 🔥`,
      `Milestone unlocked! ${formattedAmount} towards your goal! ⭐`,
      `Keep it up! ${formattedAmount} milestone achieved! 💎`
    ];
    
    return encouragements[Math.floor(Math.random() * encouragements.length)];
  }
}

const MilestoneCard = ({ milestone, onCelebrate }) => {
  const [animatedValue] = useState(new Animated.Value(0));
  
  useEffect(() => {
    if (milestone.status === 'completed') {
      Animated.spring(animatedValue, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  }, [milestone.status]);
  
  const getTierColor = (tier) => {
    switch (tier) {
      case 'bronze': return '#CD7F32';
      case 'silver': return '#C0C0C0';
      case 'gold': return '#FFD700';
      case 'platinum': return '#E5E4E2';
      case 'final': return FiColors.primary;
      default: return FiColors.border;
    }
  };
  
  const getTierIcon = (tier) => {
    switch (tier) {
      case 'bronze': return '🥉';
      case 'silver': return '🥈';
      case 'gold': return '🥇';
      case 'platinum': return '💎';
      case 'final': return '🏆';
      default: return '⭐';
    }
  };
  
  return (
    <FadeInUp delay={100}>
      <TouchableOpacity 
        style={[
          styles.milestoneCard,
          milestone.status === 'completed' && styles.completedCard
        ]}
        onPress={() => milestone.status === 'completed' && onCelebrate(milestone)}
      >
        <View style={styles.milestoneHeader}>
          <View style={styles.milestoneIcon}>
            <Text style={styles.tierIcon}>{getTierIcon(milestone.tier)}</Text>
          </View>
          <View style={styles.milestoneInfo}>
            <Text style={styles.milestoneAmount}>
              ₹{milestone.amount.toLocaleString()}
            </Text>
            <Text style={styles.milestoneStatus}>
              {milestone.status === 'completed' ? 'Achieved!' : `${milestone.timeToReach} months to go`}
            </Text>
          </View>
          <View style={styles.milestoneProgress}>
            <Text style={[
              styles.progressText,
              milestone.status === 'completed' && styles.completedText
            ]}>
              {milestone.status === 'completed' ? '✓' : `${milestone.progress.toFixed(0)}%`}
            </Text>
          </View>
        </View>
        
        {milestone.status === 'completed' && (
          <Animated.View 
            style={[
              styles.celebrationBanner,
              {
                opacity: animatedValue,
                transform: [{
                  scale: animatedValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1],
                  }),
                }],
              }
            ]}
          >
            <Text style={styles.celebrationText}>{milestone.message}</Text>
          </Animated.View>
        )}
        
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill,
              { 
                width: `${Math.min(milestone.progress, 100)}%`,
                backgroundColor: getTierColor(milestone.tier)
              }
            ]} 
          />
        </View>
      </TouchableOpacity>
    </FadeInUp>
  );
};

const MilestoneTracker = ({ goal, userProfile, onMilestoneAchieved }) => {
  const [milestones, setMilestones] = useState([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebratingMilestone, setCelebratingMilestone] = useState(null);
  
  useEffect(() => {
    const generatedMilestones = MilestoneEngine.generateMilestones(goal, userProfile);
    setMilestones(generatedMilestones);
  }, [goal, userProfile]);
  
  const handleCelebration = (milestone) => {
    setCelebratingMilestone(milestone);
    setShowCelebration(true);
    
    // Auto-hide celebration after 3 seconds
    setTimeout(() => {
      setShowCelebration(false);
    }, 3000);
    
    // Notify parent component
    if (onMilestoneAchieved) {
      onMilestoneAchieved(milestone);
    }
  };
  
  const completedMilestones = milestones.filter(m => m.status === 'completed').length;
  const totalMilestones = milestones.length;
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Milestones for {goal.title}</Text>
        <Text style={styles.subtitle}>
          {completedMilestones} of {totalMilestones} milestones achieved
        </Text>
      </View>
      
      <View style={styles.milestonesContainer}>
        {milestones.map((milestone, index) => (
          <MilestoneCard
            key={milestone.id}
            milestone={milestone}
            onCelebrate={handleCelebration}
          />
        ))}
      </View>
      
      {showCelebration && celebratingMilestone && (
        <View style={styles.celebrationOverlay}>
          <View style={styles.celebrationModal}>
            <Text style={styles.celebrationTitle}>🎉 Milestone Achieved!</Text>
            <Text style={styles.celebrationMessage}>
              {celebratingMilestone.message}
            </Text>
            <TouchableOpacity 
              style={styles.celebrationButton}
              onPress={() => setShowCelebration(false)}
            >
              <Text style={styles.celebrationButtonText}>Keep Going!</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: FiColors.background,
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: FiColors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: FiColors.textSecondary,
  },
  milestonesContainer: {
    gap: 8,
  },
  milestoneCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: FiColors.border,
  },
  completedCard: {
    backgroundColor: '#E6FBF7',
    borderColor: FiColors.success,
  },
  milestoneHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  milestoneIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: FiColors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  tierIcon: {
    fontSize: 20,
  },
  milestoneInfo: {
    flex: 1,
  },
  milestoneAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: FiColors.text,
  },
  milestoneStatus: {
    fontSize: 12,
    color: FiColors.textSecondary,
    marginTop: 2,
  },
  milestoneProgress: {
    alignItems: 'center',
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: FiColors.textSecondary,
  },
  completedText: {
    color: FiColors.success,
    fontSize: 18,
  },
  progressBar: {
    height: 4,
    backgroundColor: FiColors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  celebrationBanner: {
    backgroundColor: FiColors.success + '20',
    borderRadius: 8,
    padding: 8,
    marginVertical: 8,
  },
  celebrationText: {
    fontSize: 12,
    color: FiColors.success,
    textAlign: 'center',
    fontWeight: '500',
  },
  celebrationOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  celebrationModal: {
    backgroundColor: FiColors.background,
    borderRadius: 16,
    padding: 24,
    margin: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  celebrationTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: FiColors.text,
    marginBottom: 12,
  },
  celebrationMessage: {
    fontSize: 16,
    color: FiColors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  celebrationButton: {
    backgroundColor: FiColors.primary,
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  celebrationButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: FiColors.background,
  },
});

export { MilestoneTracker, MilestoneEngine };
export default MilestoneTracker;
