import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

const MilestonesCard = ({ user, onChatRequest, size = 'medium' }) => {
  const goals = user.goals || [];
  
  // Extract milestones from all goals
  const allMilestones = goals.flatMap(goal => 
    (goal.milestones || []).map(milestone => ({
      ...milestone,
      goalTitle: goal.title,
      goalId: goal.id
    }))
  );

  const upcomingMilestones = allMilestones
    .filter(m => !m.achieved)
    .sort((a, b) => new Date(a.targetDate) - new Date(b.targetDate))
    .slice(0, 3);

  const recentAchievements = allMilestones
    .filter(m => m.achieved)
    .sort((a, b) => new Date(b.achievedDate) - new Date(a.achievedDate))
    .slice(0, 2);

  const handleMilestoneChat = (milestone) => {
    const message = `Help me achieve the milestone "${milestone.milestone}" for my ${milestone.goalTitle} goal. Target: ₹${milestone.targetAmount?.toLocaleString() || 'N/A'}`;
    onChatRequest?.(message);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const getDaysUntil = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 7) return `${diffDays} days`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks`;
    return `${Math.ceil(diffDays / 30)} months`;
  };

  if (allMilestones.length === 0) {
    return (
      <View style={[styles.card, styles[`${size}Card`]]}>
        <Text style={styles.title}>Milestones</Text>
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🎯</Text>
          <Text style={styles.emptyText}>No milestones set yet</Text>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => onChatRequest?.('Help me set milestones for my financial goals')}
          >
            <Text style={styles.actionText}>Set Milestones</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.card, styles[`${size}Card`]]}>
      <View style={styles.header}>
        <Text style={styles.title}>Milestones</Text>
        <TouchableOpacity 
          style={styles.chatButton}
          onPress={() => onChatRequest?.('Help me plan and track my goal milestones')}
        >
          <Text style={styles.chatIcon}>💬</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Achievements */}
      {recentAchievements.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎉 Recent Achievements</Text>
          {recentAchievements.map((milestone, index) => (
            <View key={`achieved-${index}`} style={styles.achievementItem}>
              <View style={styles.achievementIcon}>
                <Text>✅</Text>
              </View>
              <View style={styles.achievementInfo}>
                <Text style={styles.achievementText}>{milestone.milestone}</Text>
                <Text style={styles.achievementGoal}>{milestone.goalTitle}</Text>
                <Text style={styles.achievementDate}>
                  Achieved {formatDate(milestone.achievedDate)}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Upcoming Milestones */}
      {upcomingMilestones.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎯 Upcoming Milestones</Text>
          {upcomingMilestones.map((milestone, index) => (
            <TouchableOpacity 
              key={`upcoming-${index}`} 
              style={styles.milestoneItem}
              onPress={() => handleMilestoneChat(milestone)}
            >
              <View style={styles.milestoneIcon}>
                <Text>📍</Text>
              </View>
              <View style={styles.milestoneInfo}>
                <Text style={styles.milestoneText}>{milestone.milestone}</Text>
                <Text style={styles.milestoneGoal}>{milestone.goalTitle}</Text>
                <View style={styles.milestoneDetails}>
                  <Text style={styles.milestoneDate}>
                    {formatDate(milestone.targetDate)}
                  </Text>
                  <Text style={styles.milestoneDays}>
                    ({getDaysUntil(milestone.targetDate)})
                  </Text>
                </View>
                {milestone.targetAmount && (
                  <Text style={styles.milestoneAmount}>
                    Target: ₹{milestone.targetAmount.toLocaleString()}
                  </Text>
                )}
              </View>
              <View style={styles.milestoneArrow}>
                <Text>→</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <TouchableOpacity 
        style={styles.actionButton}
        onPress={() => onChatRequest?.('Help me optimize my milestone timeline and strategy')}
      >
        <Text style={styles.actionText}>Optimize Milestones</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 16,
  },
  mediumCard: {
    minHeight: 200,
  },
  largeCard: {
    minHeight: 280,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
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
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    padding: 8,
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
  },
  achievementIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  achievementGoal: {
    fontSize: 11,
    color: '#666666',
    marginBottom: 2,
  },
  achievementDate: {
    fontSize: 11,
    color: '#51CF66',
  },
  milestoneItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    padding: 8,
    backgroundColor: '#FFFBF0',
    borderRadius: 8,
  },
  milestoneIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  milestoneInfo: {
    flex: 1,
  },
  milestoneText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  milestoneGoal: {
    fontSize: 11,
    color: '#666666',
    marginBottom: 4,
  },
  milestoneDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  milestoneDate: {
    fontSize: 11,
    color: '#1A1A1A',
    marginRight: 4,
  },
  milestoneDays: {
    fontSize: 11,
    color: '#FFB800',
  },
  milestoneAmount: {
    fontSize: 11,
    color: '#00D4AA',
    fontWeight: '500',
  },
  milestoneArrow: {
    marginLeft: 8,
    marginTop: 2,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 16,
  },
  actionButton: {
    backgroundColor: '#00D4AA',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default MilestonesCard;
