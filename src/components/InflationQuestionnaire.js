import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { FiColors } from '../theme/colors';

const InflationQuestionnaire = ({ onComplete, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState({});

  const questions = [
    {
      id: 'food',
      question: 'Monthly food & groceries spending? 🍽️',
      placeholder: '₹15,000',
      emoji: '🛒'
    },
    {
      id: 'transport',
      question: 'Monthly transport costs? 🚗',
      placeholder: '₹8,000',
      emoji: '⛽'
    },
    {
      id: 'housing',
      question: 'Monthly rent/EMI? 🏠',
      placeholder: '₹25,000',
      emoji: '🏡'
    },
    {
      id: 'entertainment',
      question: 'Monthly entertainment & dining? 🎬',
      placeholder: '₹5,000',
      emoji: '🍿'
    }
  ];

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(responses);
    }
  };

  const handleResponse = (value) => {
    const numValue = parseInt(value.replace(/[^0-9]/g, '')) || 0;
    setResponses({
      ...responses,
      [questions[currentStep].id]: numValue
    });
  };

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Personal Inflation Setup 📊</Text>
      </View>

      <View style={styles.progressBar}>
        <View style={[styles.progress, { width: `${progress}%` }]} />
      </View>

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

      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>
          {currentStep === questions.length - 1 ? 'Calculate My Inflation 🚀' : 'Next →'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: FiColors.surface,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: FiColors.primary + '30',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  closeButton: {
    padding: 4,
  },
  closeText: {
    fontSize: 16,
    color: FiColors.secondary,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: FiColors.text,
    flex: 1,
    textAlign: 'center',
    marginRight: 20,
  },
  progressBar: {
    height: 4,
    backgroundColor: FiColors.secondary + '30',
    borderRadius: 2,
    marginBottom: 20,
  },
  progress: {
    height: '100%',
    backgroundColor: FiColors.primary,
    borderRadius: 2,
  },
  questionContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  stepText: {
    fontSize: 12,
    color: FiColors.secondary,
    marginBottom: 8,
  },
  questionEmoji: {
    fontSize: 32,
    marginBottom: 12,
  },
  questionText: {
    fontSize: 16,
    color: FiColors.text,
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: FiColors.primary + '40',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: FiColors.text,
    backgroundColor: FiColors.background,
    width: '100%',
    textAlign: 'center',
  },
  nextButton: {
    backgroundColor: FiColors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  nextButtonText: {
    color: FiColors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default InflationQuestionnaire;