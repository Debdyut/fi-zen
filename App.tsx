import React from 'react';
import { LanguageProvider } from './src/localization/LanguageContext';
import { ThemeProvider } from './src/theme/ThemeContext';
import EnhancedAppNavigator from './src/navigation/EnhancedAppNavigator';

function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <EnhancedAppNavigator />
      </ThemeProvider>
    </LanguageProvider>
  );
}

export default App;
