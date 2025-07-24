/**
 * Voice Service - Speech-to-Text and Text-to-Speech
 * Integrates with Gemini AI for voice-based financial conversations
 */

import Voice from '@react-native-voice/voice';
import Tts from 'react-native-tts';

class VoiceService {
  constructor() {
    this.isListening = false;
    this.isInitialized = false;
    this.currentLanguage = 'en-IN';
    this.supportedLanguages = {
      'en': 'en-IN',
      'hi': 'hi-IN',
      'kn': 'kn-IN'
    };
    
    this.initialize();
  }

  async initialize() {
    try {
      // Initialize Voice Recognition
      Voice.onSpeechStart = this.onSpeechStart.bind(this);
      Voice.onSpeechEnd = this.onSpeechEnd.bind(this);
      Voice.onSpeechResults = this.onSpeechResults.bind(this);
      Voice.onSpeechError = this.onSpeechError.bind(this);

      // Initialize Text-to-Speech
      await Tts.setDefaultLanguage(this.currentLanguage);
      await Tts.setDefaultRate(0.5);
      await Tts.setDefaultPitch(1.0);

      this.isInitialized = true;
      console.log('✅ Voice Service initialized');
    } catch (error) {
      console.warn('⚠️ Voice Service initialization failed:', error);
      this.isInitialized = false;
    }
  }

  // Speech Recognition Events
  onSpeechStart(e) {
    console.log('🎤 Speech started');
    this.isListening = true;
  }

  onSpeechEnd(e) {
    console.log('🎤 Speech ended');
    this.isListening = false;
  }

  onSpeechResults(e) {
    console.log('🎤 Speech results:', e.value);
    if (this.onResultsCallback) {
      this.onResultsCallback(e.value[0]);
    }
  }

  onSpeechError(e) {
    console.warn('🎤 Speech error:', e.error);
    this.isListening = false;
    if (this.onErrorCallback) {
      this.onErrorCallback(e.error);
    }
  }

  // Start listening for speech
  async startListening(language = 'en', onResults, onError) {
    if (!this.isInitialized) {
      console.warn('Voice service not initialized');
      return false;
    }

    try {
      this.onResultsCallback = onResults;
      this.onErrorCallback = onError;
      
      const voiceLanguage = this.supportedLanguages[language] || 'en-IN';
      await Voice.start(voiceLanguage);
      
      return true;
    } catch (error) {
      console.error('Failed to start listening:', error);
      return false;
    }
  }

  // Stop listening
  async stopListening() {
    try {
      await Voice.stop();
      this.isListening = false;
    } catch (error) {
      console.error('Failed to stop listening:', error);
    }
  }

  // Text-to-Speech
  async speak(text, language = 'en') {
    if (!this.isInitialized) {
      console.warn('Voice service not initialized');
      return false;
    }

    try {
      const ttsLanguage = this.supportedLanguages[language] || 'en-IN';
      await Tts.setDefaultLanguage(ttsLanguage);
      await Tts.speak(text);
      return true;
    } catch (error) {
      console.error('Failed to speak:', error);
      return false;
    }
  }

  // Stop speaking
  async stopSpeaking() {
    try {
      await Tts.stop();
    } catch (error) {
      console.error('Failed to stop speaking:', error);
    }
  }

  // Check if currently listening
  getListeningStatus() {
    return this.isListening;
  }

  // Set language
  setLanguage(language) {
    this.currentLanguage = this.supportedLanguages[language] || 'en-IN';
  }

  // Get available languages
  getSupportedLanguages() {
    return Object.keys(this.supportedLanguages);
  }

  // Cleanup
  destroy() {
    Voice.destroy().then(Voice.removeAllListeners);
  }
}

// Singleton instance
const voiceService = new VoiceService();
export default voiceService;
