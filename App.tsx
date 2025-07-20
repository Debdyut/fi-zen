import React from 'react';
import { LanguageProvider } from './src/localization/LanguageContext';
import { ThemeProvider } from './src/theme/ThemeContext';
import AppNavigator from './src/navigation/AppNavigator';

function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <AppNavigator />
      </ThemeProvider>
    </LanguageProvider>
  );
}

export default App;
