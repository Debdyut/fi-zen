# Fi-Zen Theme System Documentation

## Overview
The Fi-Zen app now supports both dark mode and light mode with a comprehensive theme system that maintains Fi's brand identity across both themes.

## Features
- **Persistent Theme Selection**: User's theme preference is saved and restored on app restart
- **Fi Brand Consistency**: Both themes maintain Fi's signature teal color and design language
- **Easy Integration**: Simple hooks and context for theme-aware components
- **Smooth Transitions**: Instant theme switching without app restart

## Implementation

### 1. Theme Context (`src/theme/ThemeContext.js`)
Provides theme state management and persistence:
```javascript
import { useTheme } from '../theme/ThemeContext';

const { isDarkMode, toggleTheme, isLoading } = useTheme();
```

### 2. Theme Colors (`src/theme/consolidatedFiColors.js`)
Updated to support both dark and light themes:
```javascript
import { getThemeColors } from '../theme/consolidatedFiColors';

const colors = getThemeColors(isDarkMode);
```

### 3. Theme Toggle Component (`src/components/common/ThemeToggle.js`)
Ready-to-use toggle component with Fi styling:
```javascript
import ThemeToggle from '../components/common/ThemeToggle';

<ThemeToggle style={customStyles} />
```

### 4. Themed Styles Hook (`src/theme/useThemedStyles.js`)
Convenient hook for getting themed colors and styles:
```javascript
import { useThemedStyles } from '../theme/useThemedStyles';

const { colors, fiStyles, isDarkMode } = useThemedStyles();
```

## Color Schemes

### Dark Theme (Default - Fi Style)
- **Background**: `#1A1A1A` (Fi's signature dark)
- **Surface**: `#2A2A2A` (Dark cards)
- **Text**: `#FFFFFF` (White text)
- **Primary**: `#00D4AA` (Fi teal - consistent across themes)

### Light Theme
- **Background**: `#FFFFFF` (Clean white)
- **Surface**: `#FFFFFF` (White cards)
- **Text**: `#1A1A1A` (Dark text)
- **Primary**: `#00D4AA` (Fi teal - consistent across themes)

## Usage Examples

### Basic Component with Theme
```javascript
import React from 'react';
import { View, Text } from 'react-native';
import { useThemedStyles } from '../theme/useThemedStyles';

const MyComponent = () => {
  const { colors, fiStyles } = useThemedStyles();
  
  return (
    <View style={[fiStyles.card, { backgroundColor: colors.surface }]}>
      <Text style={{ color: colors.text }}>Hello Fi-Zen!</Text>
    </View>
  );
};
```

### Using Theme Context Directly
```javascript
import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { getThemeColors } from '../theme/consolidatedFiColors';

const ThemeAwareButton = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const colors = getThemeColors(isDarkMode);
  
  return (
    <TouchableOpacity 
      onPress={toggleTheme}
      style={{ backgroundColor: colors.primary }}
    >
      <Text style={{ color: colors.textInverse }}>
        Switch to {isDarkMode ? 'Light' : 'Dark'} Mode
      </Text>
    </TouchableOpacity>
  );
};
```

## Integration Steps for Existing Components

### 1. Import Theme Hooks
```javascript
import { useThemedStyles } from '../theme/useThemedStyles';
// or
import { useTheme } from '../theme/ThemeContext';
import { getThemeColors } from '../theme/consolidatedFiColors';
```

### 2. Get Theme Colors
```javascript
const { colors, fiStyles, isDarkMode } = useThemedStyles();
```

### 3. Apply Theme Colors to Styles
```javascript
// Before
<View style={{ backgroundColor: '#FFFFFF' }}>
  <Text style={{ color: '#1A1A1A' }}>Text</Text>
</View>

// After
<View style={{ backgroundColor: colors.surface }}>
  <Text style={{ color: colors.text }}>Text</Text>
</View>
```

### 4. Update StatusBar
```javascript
<StatusBar 
  barStyle={isDarkMode ? "light-content" : "dark-content"} 
  backgroundColor={colors.background} 
/>
```

## Theme Toggle Locations

The theme toggle is currently available in:
- **Profile Screen**: Under "Appearance" section

## File Structure
```
src/
├── theme/
│   ├── ThemeContext.js          # Theme state management
│   ├── consolidatedFiColors.js  # Color definitions for both themes
│   └── useThemedStyles.js       # Convenience hook
├── components/
│   └── common/
│       ├── ThemeToggle.js       # Toggle component
│       └── ThemedCard.js        # Example themed component
└── screens/
    └── ProfileScreen.js         # Updated with theme support
```

## Best Practices

1. **Always use theme colors**: Never hardcode colors in components
2. **Test both themes**: Ensure components work well in both dark and light modes
3. **Maintain Fi branding**: Keep Fi's teal color and design language consistent
4. **Use semantic color names**: Use `colors.text` instead of specific hex values
5. **Handle loading states**: Check `isLoading` from theme context if needed

## Migration Guide

To migrate existing components to support themes:

1. Replace hardcoded colors with theme colors
2. Add theme context usage
3. Update StatusBar styling
4. Test in both dark and light modes
5. Ensure accessibility compliance

## Future Enhancements

- System theme detection (follow device settings)
- Custom theme colors
- Theme-specific animations
- High contrast mode support
- Theme scheduling (auto dark mode at night)
