import React, { createContext, useContext, useState } from 'react';
import { translations } from './translations';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
];

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isLoading, setIsLoading] = useState(false);

  const changeLanguage = (languageCode) => {
    if (translations[languageCode]) {
      setCurrentLanguage(languageCode);
    }
  };

  const t = (key, params = {}) => {
    const keys = key.split('.');
    let translation = translations[currentLanguage];
    
    for (const k of keys) {
      if (translation && typeof translation === 'object') {
        translation = translation[k];
      } else {
        // Fallback to English
        translation = translations['en'];
        for (const fallbackKey of keys) {
          if (translation && typeof translation === 'object') {
            translation = translation[fallbackKey];
          } else {
            return key;
          }
        }
        break;
      }
    }

    return translation || key;
  };

  const value = {
    currentLanguage,
    changeLanguage,
    t,
    isLoading,
    supportedLanguages: SUPPORTED_LANGUAGES,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
