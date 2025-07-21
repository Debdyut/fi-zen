# Fi Money App - Card System

## Overview
The Fi Money App uses a consistent card system with white cards as the default in light mode, and light pastel colors for attention-grabbing elements.

## Card Types

### 1. Default Cards (White in Light Mode)
- **Background**: `colors.surface` (white in light mode, dark in dark mode)
- **Usage**: Standard content cards, profile sections, menu items
- **Component**: `ThemedCard` with default variant
- **Style**: `fiStyles.card`

### 2. Attention Cards (Light Pastels in Light Mode)

#### Yellow Cards - Warnings/Highlights
- **Background**: `colors.backgroundCardYellow` (#FFFBF0 in light mode)
- **Usage**: Warnings, important information, spending alerts
- **Component**: `ThemedCard` with `variant="yellow"`
- **Style**: `fiStyles.cardAttentionYellow`
- **Examples**: Context badges, spending breakdown cards

#### Teal Cards - Success/Positive Actions
- **Background**: `colors.backgroundCardTeal` (#F0FDFA in light mode)
- **Usage**: Success messages, recommendations, positive insights
- **Component**: `ThemedCard` with `variant="teal"`
- **Style**: `fiStyles.cardAttentionTeal`
- **Examples**: Investment recommendations, achievement cards

#### Red Cards - Alerts/Errors
- **Background**: `colors.backgroundCardRed` (#FFF5F5 in light mode)
- **Usage**: Alerts, errors, critical information, inflation impact
- **Component**: `ThemedCard` with `variant="red"`
- **Style**: `fiStyles.cardAttentionRed`
- **Examples**: Inflation impact sections, error states

## Implementation

### Using ThemedCard Component
```jsx
import ThemedCard from '../components/common/ThemedCard';

// Default white card
<ThemedCard title="Profile Information">
  <Text>Content goes here</Text>
</ThemedCard>

// Yellow attention card
<ThemedCard title="Important Notice" variant="yellow">
  <Text>Warning content</Text>
</ThemedCard>

// Teal success card
<ThemedCard title="Recommendation" variant="teal">
  <Text>Success content</Text>
</ThemedCard>

// Red alert card
<ThemedCard title="Alert" variant="red">
  <Text>Alert content</Text>
</ThemedCard>
```

### Using Card Styles Directly
```jsx
import { useCardVariants } from '../components/common/CardVariants';

const MyComponent = () => {
  const { defaultCard, yellowCard, tealCard, redCard, colors } = useCardVariants();
  
  return (
    <View style={defaultCard}>
      <Text style={{ color: colors.text }}>Default card content</Text>
    </View>
  );
};
```

### Using getFiStyles
```jsx
import { useTheme } from '../theme/ThemeContext';
import { getThemeColors, getFiStyles } from '../theme/consolidatedFiColors';

const MyComponent = () => {
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);
  const fiStyles = getFiStyles(colors);
  
  return (
    <View style={fiStyles.cardAttentionYellow}>
      <Text style={{ color: colors.text }}>Yellow attention card</Text>
    </View>
  );
};
```

## Design Principles

1. **Default to White**: All cards should be white in light mode unless they need to attract attention
2. **Purposeful Color**: Only use colored cards when you need to draw user attention
3. **Consistent Pastels**: Use the predefined light pastel colors for consistency
4. **Theme Awareness**: All cards automatically adapt to dark mode
5. **Accessibility**: Maintain proper contrast ratios in all themes

## Color Palette

### Light Mode
- **Default Card**: #FFFFFF (white)
- **Yellow Attention**: #FFFBF0 (light pastel yellow)
- **Teal Attention**: #F0FDFA (light pastel teal)
- **Red Attention**: #FFF5F5 (light pastel red)

### Dark Mode
- **Default Card**: #2A2A2A (dark gray)
- **Attention cards**: Use same dark surface with appropriate accent colors

## Examples in App

### Current Implementation
- **Profile Screen**: All cards are white (default)
- **Inflation Card**: White with red pastel impact section
- **Metrics Cards**: White with colored gradient backgrounds for attention
- **Insights Screen**: White cards with pastel backgrounds for categories
- **Recommendations**: Teal pastel cards for positive suggestions

### Best Practices
- Use default white cards for 80% of content
- Reserve colored cards for important information that needs attention
- Maintain visual hierarchy with consistent spacing and shadows
- Test color combinations for accessibility compliance