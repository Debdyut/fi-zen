import { useTheme } from './ThemeContext';
import { getThemeColors, getFiStyles } from './consolidatedFiColors';

// Custom hook to get themed colors and styles
export const useThemedStyles = () => {
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);
  const fiStyles = getFiStyles(colors);

  return {
    colors,
    fiStyles,
    isDarkMode,
  };
};

export default useThemedStyles;
