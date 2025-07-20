import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FiBrandColors, FiTypography } from '../../theme/fiBrandColors';
import { TouchableArea } from './AccessibilityHelpers';

const LanguageSelector = ({ selectedLanguage, onLanguageChange }) => {
  const languages = [
    { code: 'english', name: 'English', native: 'English' },
    { code: 'hindi', name: 'Hindi', native: 'हिंदी' },
    { code: 'kannada', name: 'Kannada', native: 'ಕನ್ನಡ' }
  ];

  return (
    <View style={styles.container}>
      {languages.map((lang) => (
        <TouchableArea
          key={lang.code}
          style={[
            styles.langButton,
            selectedLanguage === lang.code && styles.activeLangButton
          ]}
          onPress={() => onLanguageChange(lang.code)}
        >
          <Text style={[
            styles.langText,
            selectedLanguage === lang.code && styles.activeLangText
          ]}>
            {lang.native}
          </Text>
        </TouchableArea>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: FiBrandColors.surface,
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  langButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeLangButton: {
    backgroundColor: FiBrandColors.primary,
  },
  langText: {
    ...FiTypography.bodySmall,
    color: FiBrandColors.textSecondary,
    fontWeight: '600',
  },
  activeLangText: {
    color: FiBrandColors.white,
  },
});

export default LanguageSelector;
