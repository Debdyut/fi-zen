import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { CardProvider, DynamicCardGrid } from '../common/DynamicCardSystem';
import SmartChatInterface from '../ai/SmartChatInterface';
import FiInflationCard from './FiInflationCard'; // Import existing inflation card
import { useThemedStyles } from '../../theme/useThemedStyles';

const EnhancedFiHomeScreen = ({ user, navigation }) => {
  const [chatVisible, setChatVisible] = useState(false);
  const [chatInitialMessage, setChatInitialMessage] = useState(null);
  const styles = useThemedStyles(createStyles);

  // Validate that we have real user data
  useEffect(() => {
    if (!user || !user.userId) {
      Alert.alert('Error', 'User data not available. Please login again.');
      return;
    }
  }, [user]);

  // Don't render if no user data
  if (!user || !user.userId) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Loading user data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const openChatWithMessage = (message) => {
    setChatInitialMessage(message);
    setChatVisible(true);
  };

  const FloatingChatButton = () => (
    <TouchableOpacity
      style={styles.floatingChatButton}
      onPress={() => setChatVisible(true)}
      activeOpacity={0.8}
    >
      <Text style={styles.chatButtonText}>💬</Text>
      <Text style={styles.chatButtonHint}>Ask AI</Text>
    </TouchableOpacity>
  );

  return (
    <CardProvider screenType="home" user={user}>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning,</Text>
            <Text style={styles.userName}>{user.profile?.name || user.name}</Text>
          </View>
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => navigation?.navigate('Profile')}
          >
            <Text style={styles.profileInitial}>
              {(user.profile?.name || user.name)?.charAt(0) || 'U'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Dynamic Card Grid */}
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {/* Keep existing inflation card unchanged */}
          <View style={styles.inflationCardContainer}>
            <FiInflationCard user={user} />
          </View>

          {/* Dynamic cards for everything else */}
          <DynamicCardGrid 
            screenType="home" 
            user={user}
            onChatRequest={openChatWithMessage}
          >
            {/* Quick Actions */}
            <View style={styles.quickActionsContainer}>
              <Text style={styles.sectionTitle}>Quick Actions</Text>
              <View style={styles.quickActionsGrid}>
                <QuickActionButton
                  title="Goals"
                  icon="🎯"
                  onPress={() => navigation?.navigate('Goals')}
                />
                <QuickActionButton
                  title="Insights"
                  icon="📊"
                  onPress={() => navigation?.navigate('Insights')}
                />
                <QuickActionButton
                  title="Calculate"
                  icon="🧮"
                  onPress={() => openChatWithMessage("Help me calculate my investment returns")}
                />
                <QuickActionButton
                  title="Optimize"
                  icon="⚡"
                  onPress={() => openChatWithMessage("How can I optimize my finances?")}
                />
              </View>
            </View>
          </DynamicCardGrid>
        </ScrollView>

        {/* Floating Chat Button */}
        <FloatingChatButton />

        {/* Smart Chat Interface */}
        <SmartChatInterface
          user={user}
          currentScreen="home"
          visible={chatVisible}
          onClose={() => {
            setChatVisible(false);
            setChatInitialMessage(null);
          }}
          initialMessage={chatInitialMessage}
        />
      </SafeAreaView>
    </CardProvider>
  );
};

  const openChatWithMessage = (message) => {
    setChatInitialMessage(message);
    setChatVisible(true);
  };

  const FloatingChatButton = () => (
    <TouchableOpacity
      style={styles.floatingChatButton}
      onPress={() => setChatVisible(true)}
      activeOpacity={0.8}
    >
      <Text style={styles.chatButtonText}>💬</Text>
      <Text style={styles.chatButtonHint}>Ask AI</Text>
    </TouchableOpacity>
  );

  return (
    <CardProvider screenType="home" user={currentUser}>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning,</Text>
            <Text style={styles.userName}>{currentUser.name}</Text>
          </View>
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => navigation?.navigate('Profile')}
          >
            <Text style={styles.profileInitial}>
              {currentUser.name.charAt(0)}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Dynamic Card Grid */}
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {/* Keep existing inflation card unchanged */}
          <View style={styles.inflationCardContainer}>
            <FiInflationCard user={currentUser} />
          </View>

          {/* Dynamic cards for everything else */}
          <DynamicCardGrid 
            screenType="home" 
            user={currentUser}
            onChatRequest={openChatWithMessage}
          >
            {/* Quick Actions */}
            <View style={styles.quickActionsContainer}>
              <Text style={styles.sectionTitle}>Quick Actions</Text>
              <View style={styles.quickActionsGrid}>
                <QuickActionButton
                  title="Goals"
                  icon="🎯"
                  onPress={() => navigation?.navigate('Goals')}
                />
                <QuickActionButton
                  title="Insights"
                  icon="📊"
                  onPress={() => navigation?.navigate('Insights')}
                />
                <QuickActionButton
                  title="Calculate"
                  icon="🧮"
                  onPress={() => openChatWithMessage("Help me calculate my investment returns")}
                />
                <QuickActionButton
                  title="Optimize"
                  icon="⚡"
                  onPress={() => openChatWithMessage("How can I optimize my finances?")}
                />
              </View>
            </View>
          </DynamicCardGrid>
        </ScrollView>

        {/* Floating Chat Button */}
        <FloatingChatButton />

        {/* Smart Chat Interface */}
        <SmartChatInterface
          user={currentUser}
          currentScreen="home"
          visible={chatVisible}
          onClose={() => {
            setChatVisible(false);
            setChatInitialMessage(null);
          }}
          initialMessage={chatInitialMessage}
        />
      </SafeAreaView>
    </CardProvider>
  );
};

const QuickActionButton = ({ title, icon, onPress }) => {
  const styles = useThemedStyles(createStyles);
  
  return (
    <TouchableOpacity style={styles.quickActionButton} onPress={onPress}>
      <Text style={styles.quickActionIcon}>{icon}</Text>
      <Text style={styles.quickActionTitle}>{title}</Text>
    </TouchableOpacity>
  );
};

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: theme.colors.surface,
  },
  greeting: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    fontWeight: '400',
  },
  userName: {
    fontSize: 24,
    color: theme.colors.text,
    fontWeight: '600',
    marginTop: 2,
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  inflationCardContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  quickActionsContainer: {
    padding: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    width: '48%',
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text,
  },
  floatingChatButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: theme.colors.primary,
    borderRadius: 28,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  chatButtonText: {
    fontSize: 20,
  },
  chatButtonHint: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '500',
    marginTop: 2,
  },
});

export default EnhancedFiHomeScreen;
