import React, { useRef, useState } from 'react';
import { 
  ScrollView, 
  RefreshControl, 
  Animated, 
  PanGestureHandler,
  State 
} from 'react-native';
import { EnhancedFiColors } from '../../theme/enhancedColors';

const EnhancedPullToRefresh = ({ 
  children, 
  onRefresh, 
  refreshing = false,
  style = {},
  showsVerticalScrollIndicator = false 
}) => {
  const [isRefreshing, setIsRefreshing] = useState(refreshing);
  const pullDistance = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    
    // Start rotation animation
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    ).start();

    try {
      if (onRefresh) {
        await onRefresh();
      }
    } finally {
      setIsRefreshing(false);
      rotateAnim.setValue(0);
    }
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <ScrollView
      style={style}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          tintColor={EnhancedFiColors.primary}
          colors={[EnhancedFiColors.primary]}
          progressBackgroundColor={EnhancedFiColors.surface}
          title="Pull to refresh"
          titleColor={EnhancedFiColors.textSecondary}
        />
      }
    >
      {children}
    </ScrollView>
  );
};

const SwipeableCard = ({ 
  children, 
  onSwipeLeft, 
  onSwipeRight, 
  leftAction, 
  rightAction,
  style = {} 
}) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const [swiping, setSwiping] = useState(false);

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = (event) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      const { translationX } = event.nativeEvent;
      
      if (translationX > 100 && onSwipeRight) {
        onSwipeRight();
      } else if (translationX < -100 && onSwipeLeft) {
        onSwipeLeft();
      }
      
      // Reset position
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
      
      setSwiping(false);
    } else if (event.nativeEvent.state === State.BEGAN) {
      setSwiping(true);
    }
  };

  return (
    <PanGestureHandler
      onGestureEvent={onGestureEvent}
      onHandlerStateChange={onHandlerStateChange}
    >
      <Animated.View
        style={[
          style,
          {
            transform: [{ translateX }],
          },
        ]}
      >
        {children}
      </Animated.View>
    </PanGestureHandler>
  );
};

export { EnhancedPullToRefresh, SwipeableCard };
