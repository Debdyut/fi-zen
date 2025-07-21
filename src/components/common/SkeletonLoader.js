import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { FiColors } from '../../theme/consolidatedFiColors';

const SkeletonLoader = ({ width = '100%', height = 20, borderRadius = 4, style = {} }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    );
    animation.start();

    return () => animation.stop();
  }, [animatedValue]);

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [FiColors.secondary + '20', FiColors.secondary + '40'],
  });

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
          backgroundColor,
        },
        style,
      ]}
    />
  );
};

const InflationCardSkeleton = () => (
  <View style={styles.cardContainer}>
    <View style={styles.header}>
      <SkeletonLoader width="60%" height={18} />
      <SkeletonLoader width={60} height={24} borderRadius={12} />
    </View>

    <View style={styles.comparisonRow}>
      <View style={styles.rateSection}>
        <SkeletonLoader width={40} height={12} />
        <SkeletonLoader width={50} height={28} style={{ marginVertical: 8 }} />
        <SkeletonLoader width={35} height={10} />
      </View>
      
      <View style={styles.vsSection}>
        <SkeletonLoader width={20} height={12} />
        <SkeletonLoader width={24} height={24} borderRadius={12} style={{ marginTop: 4 }} />
      </View>
      
      <View style={styles.rateSection}>
        <SkeletonLoader width={40} height={12} />
        <SkeletonLoader width={50} height={28} style={{ marginVertical: 8 }} />
        <SkeletonLoader width={35} height={10} />
      </View>
    </View>

    <View style={styles.impactSection}>
      <SkeletonLoader width="80%" height={14} />
      <SkeletonLoader width="60%" height={14} style={{ marginTop: 4 }} />
    </View>

    <View style={styles.buttonRow}>
      <SkeletonLoader width="48%" height={40} borderRadius={8} />
      <SkeletonLoader width="48%" height={40} borderRadius={8} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: FiColors.secondary + '20',
  },
  cardContainer: {
    backgroundColor: FiColors.surface,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: FiColors.primary + '20',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  comparisonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  rateSection: {
    alignItems: 'center',
    flex: 1,
  },
  vsSection: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  impactSection: {
    backgroundColor: FiColors.primary + '10',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export { SkeletonLoader, InflationCardSkeleton };
