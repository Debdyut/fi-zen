import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { useLanguage } from '../localization/LanguageContext';
import { getThemeColors } from '../theme/consolidatedFiColors';
import { getAvatarSource } from '../utils/avatarHelper';
import UserProfileService from '../services/UserProfileService';
import DataService from '../services/DataService';
import { FadeInUp } from '../components/animations/AnimatedCard';
import { TouchableArea } from '../components/common/AccessibilityHelpers';

const { width } = Dimensions.get('window');
const cardWidth = (width - 60) / 2; // 2 columns with margins

const LoginScreen = ({ navigation }) => {
  const { isDarkMode } = useTheme();
  const { t } = useLanguage();
  const colors = getThemeColors(isDarkMode);
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = React.useRef(null);

  const userProfiles = UserProfileService.getAllUserProfiles();
  const userIds = Object.keys(userProfiles);
  const [selectedUser, setSelectedUser] = useState(userIds[Math.floor(Math.random() * userIds.length)]);

  const handleUserSelect = (userId) => {
    setSelectedUser(userId);
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: true, duration: 800 });
    }, 100);
  };

  const handleLogin = async () => {
    if (!selectedUser) return;

    setIsLoading(true);
    
    try {
      // Set the selected user as current user in both services
      const success = UserProfileService.setCurrentUser(selectedUser);
      DataService.setCurrentUser(selectedUser);
      
      console.log(`Login: Selected user ${selectedUser} (${userProfiles[selectedUser].name})`);
      
      if (success) {
        // Navigate to main app with selected user
        navigation.replace('MainTabs', { 
          selectedUserId: selectedUser
        });
      } else {
        console.error('Failed to set user');
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const UserProfileCard = ({ userId, profile, isSelected, onPress }) => (
    <FadeInUp delay={userIds.indexOf(userId) * 50}>
      <TouchableArea
        style={[
          styles.profileCard,
          {
            backgroundColor: colors.surface,
            borderColor: isSelected ? colors.primary : colors.border,
            borderWidth: isSelected ? 2 : 1,
          }
        ]}
        onPress={() => onPress(userId)}
        accessibilityLabel={`Select ${profile.name} from ${profile.location}`}
        accessibilityRole="button"
      >
        <View style={styles.avatarContainer}>
          <Image
            source={getAvatarSource(profile.avatar)}
            style={[
              styles.avatar,
              isSelected && { borderColor: colors.primary, borderWidth: 2 }
            ]}
            resizeMode="cover"
          />
          {isSelected && (
            <View style={[styles.selectedBadge, { backgroundColor: colors.primary }]}>
              <Text style={styles.selectedIcon}>✓</Text>
            </View>
          )}
        </View>
        
        <View style={styles.profileInfo}>
          <Text style={[styles.profileName, { color: colors.text }]} numberOfLines={1}>
            {profile.name}
          </Text>
          <Text style={[styles.profileLocation, { color: colors.textSecondary }]} numberOfLines={2}>
            {profile.location}
          </Text>
          <Text style={[styles.profileProfession, { color: colors.textTertiary }]} numberOfLines={1}>
            {profile.profession}
          </Text>
        </View>
      </TouchableArea>
    </FadeInUp>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar 
        barStyle={isDarkMode ? "light-content" : "dark-content"} 
        backgroundColor={colors.background} 
      />
      
      <ScrollView 
        ref={scrollViewRef}
        style={styles.scrollContainer} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            Welcome to Fi-Zen
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Select a test profile to continue
          </Text>
        </View>

        {/* Selected User Info */}
        {selectedUser && (
          <View>
            <View style={[styles.selectedUserInfo, { backgroundColor: colors.surface }]}>
              <Text style={[styles.selectedUserTitle, { color: colors.text }]}>
                Selected Profile
              </Text>
              <View style={styles.selectedUserDetails}>
                <Image
                  source={getAvatarSource(userProfiles[selectedUser].avatar)}
                  style={styles.selectedUserAvatar}
                />
                <View style={styles.selectedUserText}>
                  <Text style={[styles.selectedUserName, { color: colors.text }]}>
                    {userProfiles[selectedUser].name}
                  </Text>
                  <Text style={[styles.selectedUserLocation, { color: colors.textSecondary }]}>
                    📍 {userProfiles[selectedUser].location}
                  </Text>
                  <Text style={[styles.selectedUserProfession, { color: colors.textSecondary }]}>
                    💼 {userProfiles[selectedUser].profession}
                  </Text>
                  <Text style={[styles.selectedUserBalance, { color: colors.primary }]}>
                    💰 Balance: ₹{userProfiles[selectedUser].balance.toLocaleString('en-IN')}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Login Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.loginButton,
              {
                backgroundColor: selectedUser ? colors.primary : colors.border,
                opacity: selectedUser ? 1 : 0.5,
              }
            ]}
            onPress={handleLogin}
            disabled={!selectedUser || isLoading}
            activeOpacity={0.8}
          >
            <Text style={[styles.loginButtonText, { color: colors.white }]}>
              {isLoading ? 'Logging in...' : 'Continue to App'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* User Profiles Grid */}
        <View style={styles.profilesContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Choose Your Profile
          </Text>
          
          <View style={styles.profilesGrid}>
            {userIds.map((userId) => (
              <UserProfileCard
                key={userId}
                userId={userId}
                profile={userProfiles[userId]}
                isSelected={selectedUser === userId}
                onPress={handleUserSelect}
              />
            ))}
          </View>
        </View>

        {/* Back to Top Button */}
        <View style={styles.backToTopContainer}>
          <TouchableOpacity
            style={[styles.backToTopButton, { backgroundColor: colors.primary + '20' }]}
            onPress={() => scrollViewRef.current?.scrollTo({ y: 0, animated: true, duration: 800 })}
          >
            <Text style={[styles.backToTopText, { color: colors.primary }]}>↑ Back to Top</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textTertiary }]}>
            This is a demo app with test profiles for development purposes
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  profilesContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  profilesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  profileCard: {
    width: cardWidth,
    height: 140,
    borderRadius: 12,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  selectedBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedIcon: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  profileInfo: {
    alignItems: 'center',
    flex: 1,
  },
  profileName: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 2,
  },
  profileLocation: {
    fontSize: 9,
    textAlign: 'center',
    lineHeight: 12,
    marginBottom: 2,
  },
  profileProfession: {
    fontSize: 8,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  selectedUserInfo: {
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  selectedUserTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  selectedUserDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedUserAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  selectedUserText: {
    flex: 1,
  },
  selectedUserName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  selectedUserLocation: {
    fontSize: 14,
    marginBottom: 2,
  },
  selectedUserProfession: {
    fontSize: 14,
    marginBottom: 2,
  },
  selectedUserBalance: {
    fontSize: 14,
    fontWeight: '600',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  loginButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  backToTopContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  backToTopButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  backToTopText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default LoginScreen;
