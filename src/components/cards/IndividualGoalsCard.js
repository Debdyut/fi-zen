import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

const IndividualGoalsCard = ({ user, onChatRequest, size = 'dynamic' }) => {
  const goals = user.goals || [];

  const getStatusColor = (status) => {
    switch (status) {
      case 'on_track': return '#51CF66';
      case 'behind': return '#FF6B6B';
      case 'completed': return '#00D4AA';
      case 'paused': return '#FFB800';
      default: return '#666666';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'on_track': return '✅';
      case 'behind': return '⚠️';
      case 'completed': return '🎉';
      case 'paused': return '⏸️';
      default: return '📋';
    }
  };

  const formatDeadline = (deadline) => {
    const date = new Date(deadline);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays < 30) return `${diffDays} days left`;
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months left`;
    return `${Math.ceil(diffDays / 365)} years left`;
  };

  const handleGoalChat = (goal) => {
    const message = `Help me with my ${goal.title} goal. Current: ₹${goal.current.toLocaleString()}, Target: ₹${goal.target.toLocaleString()}, Progress: ${goal.progress}%`;
    onChatRequest?.(message);
  };

  const renderGoalCard = (goal, index) => (
    <View 
      key={goal.id} 
      style={[
        styles.goalCard, 
        { backgroundColor: index % 2 === 0 ? '#FFFBF0' : '#F0F9FF' }
      ]}
    >
      <View style={styles.goalHeader}>
        <View style={styles.goalTitleContainer}>
          <Text style={styles.goalIcon}>{getStatusIcon(goal.status)}</Text>
          <View style={styles.goalInfo}>
            <Text style={styles.goalTitle}>{goal.title}</Text>
            <Text style={styles.goalDeadline}>{formatDeadline(goal.deadline)}</Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.chatButton}
          onPress={() => handleGoalChat(goal)}
        >
          <Text style={styles.chatIcon}>💬</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.goalProgress}>
        <View style={styles.progressInfo}>
          <Text style={styles.currentAmount}>₹{goal.current.toLocaleString()}</Text>
          <Text style={styles.targetAmount}>of ₹{goal.target.toLocaleString()}</Text>
        </View>
        
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${Math.min(goal.progress, 100)}%`,
                  backgroundColor: getStatusColor(goal.status)
                }
              ]} 
            />
          </View>
          <Text style={styles.progressPercentage}>{goal.progress}%</Text>
        </View>
      </View>

      <View style={styles.goalFooter}>
        <View style={styles.contributionInfo}>
          <Text style={styles.contributionLabel}>Monthly:</Text>
          <Text style={styles.contributionAmount}>₹{goal.monthlyContribution?.toLocaleString() || '0'}</Text>
        </View>
        
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(goal.status) }]}>
          <Text style={styles.statusText}>{goal.status.replace('_', ' ').toUpperCase()}</Text>
        </View>
      </View>

      {goal.nextMilestone && (
        <View style={styles.milestoneContainer}>
          <Text style={styles.milestoneLabel}>Next Milestone:</Text>
          <Text style={styles.milestoneText}>{goal.nextMilestone}</Text>
        </View>
      )}
    </View>
  );

  if (goals.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyIcon}>🎯</Text>
        <Text style={styles.emptyTitle}>No Goals Yet</Text>
        <Text style={styles.emptySubtitle}>Start your financial journey by setting your first goal</Text>
        <TouchableOpacity 
          style={styles.createButton}
          onPress={() => onChatRequest?.('Help me create my first financial goal')}
        >
          <Text style={styles.createButtonText}>Create First Goal</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Your Goals</Text>
      {goals.map((goal, index) => renderGoalCard(goal, index))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  goalCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  goalTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  goalIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  goalInfo: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  goalDeadline: {
    fontSize: 12,
    color: '#666666',
  },
  chatButton: {
    backgroundColor: '#00D4AA',
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatIcon: {
    fontSize: 14,
  },
  goalProgress: {
    marginBottom: 16,
  },
  progressInfo: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  currentAmount: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginRight: 8,
  },
  targetAmount: {
    fontSize: 14,
    color: '#666666',
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressPercentage: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1A1A1A',
    minWidth: 35,
    textAlign: 'right',
  },
  goalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contributionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contributionLabel: {
    fontSize: 12,
    color: '#666666',
    marginRight: 4,
  },
  contributionAmount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  milestoneContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  milestoneLabel: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
  milestoneText: {
    fontSize: 13,
    color: '#1A1A1A',
    fontStyle: 'italic',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 20,
  },
  createButton: {
    backgroundColor: '#00D4AA',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default IndividualGoalsCard;
