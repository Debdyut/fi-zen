# Fi-Zen Language System Documentation

## Overview
The Fi-Zen app now supports multiple languages with a comprehensive internationalization (i18n) system. Users can switch between languages seamlessly with persistent storage.

## Supported Languages
- **English** 🇺🇸 (Default)
- **Hindi** 🇮🇳 (हिंदी)
- **Kannada** 🇮🇳 (ಕನ್ನಡ)

## Features
- **Persistent Language Selection**: User's language preference is saved and restored
- **Real-time Switching**: Language changes instantly without app restart
- **Fallback System**: Falls back to English if translation is missing
- **Easy Integration**: Simple translation function for components

## Implementation

### 1. Language Context (`src/localization/LanguageContext.js`)
Provides language state management and translation functions:
```javascript
import { useLanguage } from '../localization/LanguageContext';

const { currentLanguage, changeLanguage, t } = useLanguage();
```

### 2. Translations (`src/localization/translations.js`)
Contains all text content in supported languages:
```javascript
export const translations = {
  en: { profile: { title: 'Profile' } },
  hi: { profile: { title: 'प्रोफाइल' } },
  kn: { profile: { title: 'ಪ್ರೊಫೈಲ್' } }
};
```

### 3. Language Selector (`src/components/common/LanguageSelector.js`)
Ready-to-use language picker component:
```javascript
import LanguageSelector from '../components/common/LanguageSelector';

<LanguageSelector style={customStyles} />
```

## Usage Examples

### Basic Translation
```javascript
import { useLanguage } from '../localization/LanguageContext';

const MyComponent = () => {
  const { t } = useLanguage();
  
  return (
    <Text>{t('profile.title')}</Text>
  );
};
```

### Language Switching
```javascript
import { useLanguage } from '../localization/LanguageContext';

const LanguageSwitcher = () => {
  const { currentLanguage, changeLanguage } = useLanguage();
  
  return (
    <TouchableOpacity onPress={() => changeLanguage('hi')}>
      <Text>Switch to Hindi</Text>
    </TouchableOpacity>
  );
};
```

### Getting Current Language Info
```javascript
const { currentLanguage, supportedLanguages } = useLanguage();
const currentLang = supportedLanguages.find(lang => lang.code === currentLanguage);
```

## Translation Structure

### Nested Keys
```javascript
// translations.js
{
  profile: {
    title: 'Profile',
    settings: {
      theme: 'Theme',
      language: 'Language'
    }
  }
}

// Usage
t('profile.title')           // "Profile"
t('profile.settings.theme')  // "Theme"
```

### Common Sections
- `nav.*` - Navigation labels
- `common.*` - Common UI elements (buttons, messages)
- `profile.*` - Profile screen content
- `theme.*` - Theme-related text
- `language.*` - Language-related text

## Adding New Languages

### 1. Add Language to Supported List
```javascript
// LanguageContext.js
export const SUPPORTED_LANGUAGES = [
  // existing languages...
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
];
```

### 2. Add Translations
```javascript
// translations.js
export const translations = {
  // existing translations...
  ta: {
    nav: { home: 'முகப்பு' },
    profile: { title: 'சுயவிவரம்' }
    // ... all other translations
  }
};
```

## Adding New Translation Keys

### 1. Add to All Languages
```javascript
// translations.js
export const translations = {
  en: {
    newSection: {
      newKey: 'New English Text'
    }
  },
  hi: {
    newSection: {
      newKey: 'नया हिंदी टेक्स्ट'
    }
  },
  kn: {
    newSection: {
      newKey: 'ಹೊಸ ಕನ್ನಡ ಪಠ್ಯ'
    }
  }
};
```

### 2. Use in Components
```javascript
const text = t('newSection.newKey');
```

## Language Selector Locations

The language selector is currently available in:
- **Profile Screen**: Under "Language" section

## File Structure
```
src/
├── localization/
│   ├── LanguageContext.js    # Language state management
│   ├── translations.js       # All translations
│   └── languageContent.js    # Legacy content (can be removed)
├── components/
│   └── common/
│       └── LanguageSelector.js # Language picker component
└── screens/
    └── ProfileScreen.js      # Updated with language support
```

## Best Practices

1. **Always use translation keys**: Never hardcode text in components
2. **Use descriptive keys**: `profile.personalInfo` not `text1`
3. **Group related translations**: Keep related text under same parent key
4. **Test all languages**: Ensure UI works with different text lengths
5. **Handle missing translations**: System falls back to English automatically

## Migration Guide

To migrate existing hardcoded text:

1. **Identify text strings** in components
2. **Add translation keys** to all language files
3. **Replace hardcoded text** with `t('key')`
4. **Test in all languages**

Example:
```javascript
// Before
<Text>Profile</Text>

// After
<Text>{t('profile.title')}</Text>
```

## Future Enhancements

- **RTL Language Support** (Arabic, Hebrew)
- **Pluralization Rules** for complex grammar
- **Date/Number Formatting** per locale
- **Dynamic Language Loading** for app size optimization
- **Translation Management** system for non-developers
