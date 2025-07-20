import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { FiBrandColors, FiTypography } from '../../theme/fiBrandColors';
import { AnimatedCard, FadeInUp } from '../animations/AnimatedCard';
import { EnhancedButton } from '../common/EnhancedButtons';
import { ProgressIndicator } from '../common/MicroInteractions';

const ProgressiveValueScreen = ({ navigation, userEngagement = 'new' }) => {
  const [unlockedLevels, setUnlockedLevels] = useState(1);
  const [showNextLevel, setShowNextLevel] = useState(false);

  // Progressive value levels based on user engagement
  const valueLevels = {
    1: {
      title: 'Level 1: Basic Rate',
      description: 'Your personal vs government inflation',
      content: 'Your rate: 11.8% vs Government: 6.5%',
      unlocked: true,
      timeToUnlock: 'Available now'
    },
    2: {
      title: 'Level 2: City Intelligence',
      description: 'Location-specific insights',
      content: 'Mumbai costs 23% more than national average',
      unlocked: userEngagement !== 'new',
      timeToUnlock: 'Unlocks after 1 week usage'
    },
    3: {
      title: 'Level 3: Professional Benchmarking',
      description: 'Compare with similar professionals',
      content: 'You\'re in 75th percentile among software engineers',
      unlocked: false,
      timeToUnlock: 'Unlocks after 1 month usage'
    },
    4: {
      title: 'Level 4: Advanced Analytics',
      description: 'Predictive insights & trends',
      content: 'Your inflation trending up 0.3% this quarter',
      unlocked: false,
      timeToUnlock: 'Premium feature - ₹199/month'
    }
  };

  useEffect(() => {
    // Simulate progressive unlocking
    const timer = setTimeout(() => {
      setShowNextLevel(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const ValueLevelCard = ({ level, data, index }) => (
    <FadeInUp delay={index * 200}>
      <View style={[
        styles.levelCard,
        data.unlocked ? styles.unlockedCard : styles.lockedCard
      ]}>
        <View style={styles.levelHeader}>
          <Text style={styles.levelTitle}>{data.title}</Text>
          {data.unlocked ? (
            <Text style={styles.unlockedBadge}>✅ Unlocked</Text>
          ) : (
            <Text style={styles.lockedBadge}>🔒 Locked</Text>
          )}
        </View>

        <Text style={styles.levelDescription}>{data.description}</Text>

        {data.unlocked ? (
          <View style={styles.levelContent}>
            <Text style={styles.contentText}>{data.content}</Text>
            {level === 1 && (
              <EnhancedButton
                title="See My Rate"
                variant="primary"
                size="small"
                onPress={() => navigation.navigate('Results')}
                style={styles.levelButton}
              />
            )}
          </View>
        ) : (
          <View style={styles.lockedContent}>
            <Text style={styles.unlockText}>{data.timeToUnlock}</Text>
            {level === 4 && (
              <EnhancedButton
                title="Upgrade to Premium"
                variant="secondary"
                size="small"
                onPress={() => navigation.navigate('PremiumUpgrade')}
                style={styles.upgradeButton}
              />
            )}
          </View>
        )}

        {/* Progress indicator for engagement-based unlocks */}
        {!data.unlocked && level <= 3 && (
          <View style={styles.progressSection}>
            <Text style={styles.progressLabel}>Progress to unlock:</Text>
            <ProgressIndicator
              progress={level === 2 ? 0.3 : level === 3 ? 0.1 : 0}
              color={FiBrandColors.primary}
              height={4}
            />
          </View>
        )}
      </View>
    </FadeInUp>
  );

  const EngagementIncentive = () => (
    <FadeInUp delay={800}>
      <AnimatedCard style={styles.incentiveCard}>
        <Text style={styles.incentiveTitle}>🚀 Unlock More Value</Text>
        <Text style={styles.incentiveText}>
          Keep using Fi-Zen to unlock advanced insights:
        </Text>
        
        <View style={styles.incentiveList}>
          <Text style={styles.incentiveItem}>📊 Week 1: City comparisons</Text>
          <Text style={styles.incentiveItem}>👥 Month 1: Peer benchmarking</Text>
          <Text style={styles.incentiveItem}>📈 Premium: Predictive analytics</Text>
        </View>

        <EnhancedButton
          title="Start My Journey"
          variant="primary"
          size="medium"
          onPress={() => navigation.navigate('QuickSetup')}
          style={styles.journeyButton}
        />
      </AnimatedCard>
    </FadeInUp>
  );

  return (
    <ScrollView style={styles.container}>
      <FadeInUp delay={0}>
        <View style={styles.header}>
          <Text style={styles.title}>📈 Your Financial Intelligence Journey</Text>
          <Text style={styles.subtitle}>
            Unlock deeper insights as you engage with Fi-Zen
          </Text>
        </View>
      </FadeInUp>

      <View style={styles.levelsContainer}>
        {Object.entries(valueLevels).map(([level, data], index) => (
          <ValueLevelCard
            key={level}
            level={parseInt(level)}
            data={data}
            index={index}
          />
        ))}
      </View>

      <EngagementIncentive />

      {/* Strategic Value Messaging */}
      <FadeInUp delay={1000}>
        <View style={styles.strategyMessage}>
          <Text style={styles.strategyTitle}>🎯 Why Progressive Unlocking?</Text>
          <Text style={styles.strategyText}>
            • <Text style={styles.bold}>Better Accuracy:</Text> More data = more precise insights
          </Text>
          <Text style={styles.strategyText}>
            • <Text style={styles.bold}>Relevant Timing:</Text> Advanced features when you're ready
          </Text>
          <Text style={styles.strategyText}>
            • <Text style={styles.bold}>Engagement Reward:</Text> Loyal users get premium value
          </Text>
        </View>
      </FadeInUp>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: FiBrandColors.background,
    padding: 20,
  },
  header: {
    marginBottom: 24,
    marginTop: 20,
  },
  title: {
    ...FiTypography.h2,
    color: FiBrandColors.text,
    marginBottom: 8,
  },
  subtitle: {
    ...FiTypography.body,
    color: FiBrandColors.textSecondary,
  },
  levelsContainer: {
    marginBottom: 24,
  },
  levelCard: {
    backgroundColor: FiBrandColors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  unlockedCard: {
    borderColor: FiBrandColors.success + '40',
    backgroundColor: FiBrandColors.success + '05',
  },
  lockedCard: {
    borderColor: FiBrandColors.border,
    opacity: 0.7,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  levelTitle: {
    ...FiTypography.body,
    color: FiBrandColors.text,
    fontWeight: '600',
    flex: 1,
  },
  unlockedBadge: {
    ...FiTypography.caption,
    color: FiBrandColors.success,
    fontWeight: '600',
  },
  lockedBadge: {
    ...FiTypography.caption,
    color: FiBrandColors.textSecondary,
    fontWeight: '600',
  },
  levelDescription: {
    ...FiTypography.bodySmall,
    color: FiBrandColors.textSecondary,
    marginBottom: 12,
  },
  levelContent: {
    backgroundColor: FiBrandColors.background,
    borderRadius: 8,
    padding: 12,
  },
  contentText: {
    ...FiTypography.bodySmall,
    color: FiBrandColors.text,
    fontWeight: '500',
    marginBottom: 8,
  },
  levelButton: {
    width: 100,
    height: 32,
  },
  lockedContent: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  unlockText: {
    ...FiTypography.caption,
    color: FiBrandColors.textSecondary,
    marginBottom: 8,
  },
  upgradeButton: {
    width: 140,
    height: 32,
  },
  progressSection: {
    marginTop: 12,
  },
  progressLabel: {
    ...FiTypography.caption,
    color: FiBrandColors.textSecondary,
    marginBottom: 4,
  },
  incentiveCard: {
    backgroundColor: FiBrandColors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: FiBrandColors.primary + '40',
  },
  incentiveTitle: {
    ...FiTypography.body,
    color: FiBrandColors.text,
    fontWeight: '600',
    marginBottom: 8,
  },
  incentiveText: {
    ...FiTypography.bodySmall,
    color: FiBrandColors.textSecondary,
    marginBottom: 12,
  },
  incentiveList: {
    marginBottom: 16,
  },
  incentiveItem: {
    ...FiTypography.bodySmall,
    color: FiBrandColors.primary,
    marginBottom: 4,
    fontWeight: '500',
  },
  journeyButton: {
    width: '100%',
    height: 48,
  },
  strategyMessage: {
    backgroundColor: FiBrandColors.info + '10',
    borderRadius: 12,
    padding: 16,
    marginBottom: 40,
  },
  strategyTitle: {
    ...FiTypography.body,
    color: FiBrandColors.text,
    fontWeight: '600',
    marginBottom: 8,
  },
  strategyText: {
    ...FiTypography.bodySmall,
    color: FiBrandColors.textSecondary,
    lineHeight: 18,
    marginBottom: 4,
  },
  bold: {
    fontWeight: '600',
    color: FiBrandColors.text,
  },
});

export default ProgressiveValueScreen;
