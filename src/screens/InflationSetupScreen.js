import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, SafeAreaView, ScrollView } from 'react-native';
import { FiColors } from '../theme/consolidatedFiColors';

const InflationSetupScreen = ({ navigation, route }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState({});
  const [dataSource, setDataSource] = useState('manual');

  const questions = [
    { id: 'food', question: 'Monthly food & groceries spending?', placeholder: '₹15,000', emoji: '🛒' },
    { id: 'transport', question: 'Monthly transport costs?', placeholder: '₹8,000', emoji: '⛽' },
    { id: 'housing', question: 'Monthly rent/EMI?', placeholder: '₹25,000', emoji: '🏡' },
    { id: 'entertainment', question: 'Monthly entertainment & dining?', placeholder: '₹5,000', emoji: '🍿' }
  ];

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigation.navigate('Main', { screen: 'Home', params: { spendingData: responses, source: dataSource } });
    }
  };

  const handleResponse = (value) => {
    const numValue = parseInt(value.replace(/[^0-9]/g, '')) || 0;
    setResponses({ ...responses, [questions[currentStep].id]: numValue });
  };

  const handleDataSourceSelect = (source) => {
    setDataSource(source);
    if (source === 'manual') return;
    
    const mockData = {
      gmail: { food: 18000, transport: 12000, housing: 28000, entertainment: 8000 },
      fi_account: { food: 16000, transport: 9000, housing: 25000, entertainment: 6000 }
    };
    
    setResponses(mockData[source]);
    navigation.navigate('Main', { screen: 'Home', params: { spendingData: mockData[source], source } });
  };

  if (dataSource === 'manual') {
    const currentQuestion = questions[currentStep];
    const progress = ((currentStep + 1) / questions.length) * 100;

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Personal Inflation Setup</Text>
        </View>

        <View style={styles.progressBar}>
          <View style={[styles.progress, { width: `${progress}%` }]} />
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.questionContainer}>
            <Text style={styles.stepText}>Step {currentStep + 1} of {questions.length}</Text>
            <Text style={styles.questionEmoji}>{currentQuestion.emoji}</Text>
            <Text style={styles.questionText}>{currentQuestion.question}</Text>
            
            <TextInput
              style={styles.input}
              placeholder={currentQuestion.placeholder}
              placeholderTextColor={FiColors.secondary}
              keyboardType="numeric"
              onChangeText={handleResponse}
              value={responses[currentQuestion.id]?.toString() || ''}
            />
          </View>
        </ScrollView>

        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>
            {currentStep === questions.length - 1 ? 'Calculate My Inflation 🚀' : 'Next →'}
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Choose Data Source</Text>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.subtitle}>How would you like to calculate your personal inflation?</Text>

        <TouchableOpacity style={styles.optionCard} onPress={() => handleDataSourceSelect('fi_account')}>
          <Text style={styles.optionEmoji}>🏦</Text>
          <Text style={styles.optionTitle}>Fi Savings Account</Text>
          <Text style={styles.optionDesc}>Analyze your Fi account transactions automatically</Text>
          <Text style={styles.optionBadge}>Recommended</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionCard} onPress={() => handleDataSourceSelect('gmail')}>
          <Text style={styles.optionEmoji}>📧</Text>
          <Text style={styles.optionTitle}>Gmail Bank Statements</Text>
          <Text style={styles.optionDesc}>Connect Gmail to analyze bank statement emails</Text>
          <Text style={styles.optionSubtext}>Like CRED - secure & automatic</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionCard} onPress={() => setDataSource('manual')}>
          <Text style={styles.optionEmoji}>✏️</Text>
          <Text style={styles.optionTitle}>Manual Entry</Text>
          <Text style={styles.optionDesc}>Answer 4 quick questions about your spending</Text>
          <Text style={styles.optionSubtext}>Takes 2 minutes</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: FiColors.background },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: FiColors.secondary + '20' },
  backButton: { fontSize: 16, color: FiColors.primary, marginRight: 16 },
  title: { fontSize: 18, fontWeight: '600', color: FiColors.text },
  subtitle: { fontSize: 16, color: FiColors.text, marginBottom: 24, textAlign: 'center' },
  content: { flex: 1, padding: 20 },
  progressBar: { height: 4, backgroundColor: FiColors.secondary + '30', marginHorizontal: 20 },
  progress: { height: '100%', backgroundColor: FiColors.primary },
  questionContainer: { alignItems: 'center', marginTop: 40 },
  stepText: { fontSize: 12, color: FiColors.secondary, marginBottom: 16 },
  questionEmoji: { fontSize: 48, marginBottom: 20 },
  questionText: { fontSize: 20, color: FiColors.text, textAlign: 'center', marginBottom: 32, fontWeight: '500' },
  input: { borderWidth: 1, borderColor: FiColors.primary + '40', borderRadius: 12, padding: 16, fontSize: 18, color: FiColors.text, backgroundColor: FiColors.surface, width: '100%', textAlign: 'center' },
  nextButton: { backgroundColor: FiColors.primary, borderRadius: 12, padding: 16, margin: 20, alignItems: 'center' },
  nextButtonText: { color: FiColors.white, fontSize: 16, fontWeight: '600' },
  optionCard: { backgroundColor: FiColors.surface, borderRadius: 16, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: FiColors.secondary + '20' },
  optionEmoji: { fontSize: 32, marginBottom: 12 },
  optionTitle: { fontSize: 18, fontWeight: '600', color: FiColors.text, marginBottom: 8 },
  optionDesc: { fontSize: 14, color: FiColors.text, marginBottom: 8 },
  optionSubtext: { fontSize: 12, color: FiColors.secondary },
  optionBadge: { position: 'absolute', top: 16, right: 16, backgroundColor: FiColors.primary, color: FiColors.white, fontSize: 10, fontWeight: '600', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
});

export default InflationSetupScreen;