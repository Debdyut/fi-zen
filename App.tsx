import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LanguageProvider } from './src/localization/LanguageContext';
import { ThemeProvider } from './src/theme/ThemeContext';
import EnhancedAppNavigator from './src/navigation/EnhancedAppNavigator';
import ErrorBoundary from './src/components/ErrorBoundary';

function App() {
  console.log('App component rendering...');
  
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <ThemeProvider>
          <EnhancedAppNavigator />
        </ThemeProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default App;
