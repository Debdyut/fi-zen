import React, { useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Animated, 
  Easing,
  Vibration,
  Platform 
} from 'react-native';
import { EnhancedFiColors } from '../../theme/enhancedColors';

const ProgressIndicator = ({ 
  progress = 0, 
  duration = 1000, 
  color = EnhancedFiColors.primary,
  height = 4,
  showPercentage = false,
  style = {} 
}) => {
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [progress, duration, progressAnim]);

  const width = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });

  return (
    <View style={[styles.progressContainer, { height }, style]}>
      <Animated.View
        style={[
          styles.progressBar,
          {
            width,
            backgroundColor: color,
            height,
          },
        ]}
      />
      {showPercentage && (
        <Text style={styles.progressText}>
          {Math.round(progress * 100)}%
        </Text>
      )}
    </View>
  );
};

const CountUpNumber = ({ 
  value, 
  duration = 1500, 
  suffix = '', 
  prefix = '',
  decimals = 1,
  style = {} 
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const displayValue = useRef(0);

  useEffect(() => {
    const listener = animatedValue.addListener(({ value: animValue }) => {
      displayValue.current = animValue;
    });

    Animated.timing(animatedValue, {
      toValue: value,
      duration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();

    return () => {
      animatedValue.removeListener(listener);
    };
  }, [value, duration, animatedValue]);

  return (
    <Animated.Text style={style}>
      {animatedValue.interpolate({
        inputRange: [0, value],
        outputRange: [`${prefix}0${suffix}`, `${prefix}${value.toFixed(decimals)}${suffix}`],
        extrapolate: 'clamp',
      })}
    </Animated.Text>
  );
};

const RippleEffect = ({ 
  children, 
  onPress, 
  rippleColor = EnhancedFiColors.primary + '30',
  style = {} 
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const handlePress = (event) => {
    // Reset animations
    scaleAnim.setValue(0);
    opacityAnim.setValue(1);

    // Start ripple effect
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();

    // Haptic feedback
    if (Platform.OS === 'ios') {
      Vibration.vibrate(10);
    }

    if (onPress) {
      onPress(event);
    }
  };

  return (
    <View style={[styles.rippleContainer, style]}>
      <TouchableOpacity onPress={handlePress} style={styles.rippleButton}>
        {children}
        <Animated.View
          style={[
            styles.ripple,
            {
              backgroundColor: rippleColor,
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
            },
          ]}
        />
      </TouchableOpacity>
    </View>
  );
};

const ShakeAnimation = ({ children, trigger, intensity = 10, duration = 500 }) => {
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (trigger) {
      const shakeSequence = [];
      const steps = 8;
      
      for (let i = 0; i < steps; i++) {
        shakeSequence.push(
          Animated.timing(shakeAnim, {
            toValue: i % 2 === 0 ? intensity : -intensity,
            duration: duration / steps,
            useNativeDriver: true,
          })
        );
      }
      
      shakeSequence.push(
        Animated.timing(shakeAnim, {
          toValue: 0,
          duration: duration / steps,
          useNativeDriver: true,
        })
      );

      Animated.sequence(shakeSequence).start();
    }
  }, [trigger, intensity, duration, shakeAnim]);

  return (
    <Animated.View
      style={{
        transform: [{ translateX: shakeAnim }],
      }}
    >
      {children}
    </Animated.View>
  );
};

const BounceAnimation = ({ children, trigger, scale = 1.1, duration = 300 }) => {
  const bounceAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (trigger) {
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: scale,
          duration: duration / 2,
          easing: Easing.out(Easing.back(1.5)),
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 1,
          duration: duration / 2,
          easing: Easing.out(Easing.back(1.5)),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [trigger, scale, duration, bounceAnim]);

  return (
    <Animated.View
      style={{
        transform: [{ scale: bounceAnim }],
      }}
    >
      {children}
    </Animated.View>
  );
};

const FadeInUp = ({ children, delay = 0, duration = 600 }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(translateAnim, {
        toValue: 0,
        duration,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, translateAnim, delay, duration]);

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: translateAnim }],
      }}
    >
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  progressContainer: {
    backgroundColor: EnhancedFiColors.border,
    borderRadius: 2,
    overflow: 'hidden',
    position: 'relative',
  },
  progressBar: {
    borderRadius: 2,
  },
  progressText: {
    position: 'absolute',
    right: 8,
    top: -20,
    fontSize: 12,
    color: EnhancedFiColors.textSecondary,
  },
  rippleContainer: {
    overflow: 'hidden',
  },
  rippleButton: {
    position: 'relative',
  },
  ripple: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 1000,
  },
});

export { 
  ProgressIndicator, 
  CountUpNumber, 
  RippleEffect, 
  ShakeAnimation, 
  BounceAnimation, 
  FadeInUp 
};
