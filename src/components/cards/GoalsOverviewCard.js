import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

const GoalsOverviewCard = ({ user, size = 'large' }) => {
  const goals = user.goals || [];
  const totalTarget = goals.reduce((sum, goal) => sum + goal.target, 0);
  const totalCurrent = goals.reduce((sum, goal) => sum + goal.current, 0);
  const overallProgress = totalTarget > 0 ? (totalCurrent / totalTarget) * 100 : 0;

  const onTrackGoals = goals.filter(g => g.status === 'on_track').length;
  const behindGoals = goals.filter(g => g.status === 'behind').length;
  const completedGoals = goals.filter(g => g.status === 'completed').length;

  return (
    <View style={[styles.card, styles[`${size}Card`]]}>
      <Text style={styles.title}>Goals Overview</Text>
      
      <View style={styles.statsGrid}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{goals.length}</Text>
          <Text style={styles.statLabel}>Active Goals</Text>
        </View>
        
        <View style={styles.stat}>
          <Text style={styles.statValue}>₹{(totalCurrent / 100000).toFixed(1)}L</Text>
          <Text style={styles.statLabel}>Saved</Text>
        </View>
        
        <View style={styles.stat}>
          <Text style={styles.statValue}>₹{(totalTarget / 100000).toFixed(1)}L</Text>
          <Text style={styles.statLabel}>Target</Text>
        </View>
        
        <View style={styles.stat}>
          <Text style={styles.statValue}>{Math.round(overallProgress)}%</Text>
          <Text style={styles.statLabel}>Progress</Text>
        </View>
      </View>

      <View style={styles.statusBreakdown}>
        <View style={styles.statusItem}>
          <View style={[styles.statusDot, { backgroundColor: '#51CF66' }]} />
          <Text style={styles.statusText}>{onTrackGoals} On Track</Text>
        </View>
        
        <View style={styles.statusItem}>
          <View style={[styles.statusDot, { backgroundColor: '#FF6B6B' }]} />
          <Text style={styles.statusText}>{behindGoals} Behind</Text>
        </View>
        
        <View style={styles.statusItem}>
          <View style={[styles.statusDot, { backgroundColor: '#00D4AA' }]} />
          <Text style={styles.statusText}>{completedGoals} Completed</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${Math.min(overallProgress, 100)}%` }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>
          Overall Progress: {Math.round(overallProgress)}%
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 16,
  },
  largeCard: {
    minHeight: 280,
  },
  mediumCard: {
    minHeight: 200,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  stat: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#00D4AA',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
  statusBreakdown: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: '#666666',
  },
  progressContainer: {
    marginTop: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#00D4AA',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
});

export default GoalsOverviewCard;
