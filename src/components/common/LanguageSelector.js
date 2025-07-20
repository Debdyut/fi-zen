import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView } from 'react-native';
import { useLanguage, SUPPORTED_LANGUAGES } from '../../localization/LanguageContext';
import { useThemedStyles } from '../../theme/useThemedStyles';

const LanguageSelector = ({ style }) => {
  const { currentLanguage, changeLanguage, t } = useLanguage();
  const { colors } = useThemedStyles();
  const [modalVisible, setModalVisible] = useState(false);

  const currentLangInfo = SUPPORTED_LANGUAGES.find(lang => lang.code === currentLanguage);

  const handleLanguageSelect = (languageCode) => {
    changeLanguage(languageCode);
    setModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.container, { backgroundColor: colors.surface }, style]}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
      >
        <View style={styles.languageInfo}>
          <Text style={styles.flag}>{currentLangInfo?.flag}</Text>
          <View style={styles.textContainer}>
            <Text style={[styles.languageName, { color: colors.text }]}>
              {currentLangInfo?.nativeName}
            </Text>
            <Text style={[styles.languageSubtext, { color: colors.textSecondary }]}>
              {t('language.current')}
            </Text>
          </View>
        </View>
        <Text style={[styles.arrow, { color: colors.textSecondary }]}>›</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {t('language.select')}
              </Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Text style={[styles.closeButtonText, { color: colors.textSecondary }]}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.languageList}>
              {SUPPORTED_LANGUAGES.map((language) => (
                <TouchableOpacity
                  key={language.code}
                  style={[
                    styles.languageOption,
                    { borderBottomColor: colors.borderLight },
                    currentLanguage === language.code && { backgroundColor: colors.primary + '10' }
                  ]}
                  onPress={() => handleLanguageSelect(language.code)}
                >
                  <Text style={styles.languageFlag}>{language.flag}</Text>
                  <View style={styles.languageDetails}>
                    <Text style={[styles.languageOptionName, { color: colors.text }]}>
                      {language.nativeName}
                    </Text>
                    <Text style={[styles.languageOptionSubname, { color: colors.textSecondary }]}>
                      {language.name}
                    </Text>
                  </View>
                  {currentLanguage === language.code && (
                    <Text style={[styles.checkmark, { color: colors.primary }]}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  languageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  flag: {
    fontSize: 24,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '500',
  },
  languageSubtext: {
    fontSize: 14,
    marginTop: 2,
  },
  arrow: {
    fontSize: 20,
    fontWeight: '300',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '70%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  languageList: {
    maxHeight: 400,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 0.5,
  },
  languageFlag: {
    fontSize: 24,
    marginRight: 16,
  },
  languageDetails: {
    flex: 1,
  },
  languageOptionName: {
    fontSize: 16,
    fontWeight: '500',
  },
  languageOptionSubname: {
    fontSize: 14,
    marginTop: 2,
  },
  checkmark: {
    fontSize: 18,
    fontWeight: '600',
  },
});

export default LanguageSelector;
