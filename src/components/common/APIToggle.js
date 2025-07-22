// API Toggle Component for Login Screen
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const APIToggle = ({ useAPI, onToggle, colors }) => {
  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <Text style={[styles.label, { color: colors.text }]}>
        Data Source
      </Text>
      
      <View style={styles.toggleContainer}>
        <Text style={[styles.modeText, { color: colors.textSecondary }]}>
          File
        </Text>
        
        <TouchableOpacity
          style={[
            styles.toggle,
            { backgroundColor: useAPI ? colors.primary : colors.border }
          ]}
          onPress={onToggle}
          activeOpacity={0.8}
        >
          <View
            style={[
              styles.toggleButton,
              {
                backgroundColor: colors.white,
                transform: [{ translateX: useAPI ? 20 : 2 }]
              }
            ]}
          />
        </TouchableOpacity>
        
        <Text style={[styles.modeText, { color: colors.textSecondary }]}>
          API
        </Text>
      </View>
      
      <Text style={[styles.status, { color: useAPI ? colors.primary : colors.textTertiary }]}>
        {useAPI ? '🌐 Using Live API' : '📁 Using Local Files'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  modeText: {
    fontSize: 14,
    fontWeight: '500',
    marginHorizontal: 8,
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  toggleButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    position: 'absolute',
  },
  status: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default APIToggle;
