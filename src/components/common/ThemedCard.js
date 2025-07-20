import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemedStyles } from '../../theme/useThemedStyles';

const ThemedCard = ({ title, children, style }) => {
  const { colors, fiStyles } = useThemedStyles();

  return (
    <View style={[fiStyles.card, { backgroundColor: colors.surface }, style]}>
      {title && (
        <Text style={[styles.title, { color: colors.text }]}>
          {title}
        </Text>
      )}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
});

export default ThemedCard;
