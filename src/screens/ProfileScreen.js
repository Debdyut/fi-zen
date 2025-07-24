import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, Image, Alert } from 'react-native';
import { FadeInUp } from '../components/animations/AnimatedCard';
import { TouchableArea } from '../components/common/AccessibilityHelpers';
import { useTheme } from '../theme/ThemeContext';
import { useLanguage } from '../localization/LanguageContext';
import { getThemeColors } from '../theme/consolidatedFiColors';
import { getAvatarSource } from '../utils/avatarHelper';
import ThemeToggle from '../components/common/ThemeToggle';
import LanguageSelector from '../components/common/LanguageSelector';
import UserProfileService from '../services/UserProfileService';

const ProfileScreen = ({ navigation }) => {
  const { isDarkMode } = useTheme();
  const { t } = useLanguage();
  const colors = getThemeColors(isDarkMode);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const userProfile = UserProfileService.getCurrentUserProfile();
    setCurrentUser(userProfile);
  }, []);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            UserProfileService.logout();
            navigation.navigate('Login');
          },
        },
      ]
    );
  };

  if (!currentUser) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.loadingText, { color: colors.text }]}>Loading...</Text>
      </View>
    );
  }

  const ProfileHeader = () => (
    <FadeInUp delay={0}>
      <View style={[styles.profileHeader, { backgroundColor: colors.surface }]}>
        <View style={styles.avatarContainer}>
          <Image 
            source={getAvatarSource(currentUser.avatar)} 
            style={styles.avatar}
          />
          <TouchableArea style={[styles.editAvatarButton, { backgroundColor: colors.primary }]}>
            <Text style={styles.editIcon}>✏️</Text>
          </TouchableArea>
        </View>
        
        <Text style={[styles.userName, { color: colors.text }]}>{currentUser.name}</Text>
        <Text style={[styles.userEmail, { color: colors.textSecondary }]}>📍 {currentUser.location}</Text>
        <Text style={[styles.memberSince, { color: colors.textTertiary }]}>💼 {currentUser.profession}</Text>
        <Text style={[styles.memberSince, { color: colors.textTertiary }]}>{t('profile.memberSince')}</Text>
      </View>
    </FadeInUp>
  );

  const StatsCard = () => (
    <FadeInUp delay={100}>
      <View style={[styles.statsCard, { backgroundColor: colors.surface }]}>
        <Text style={[styles.statsTitle, { color: colors.text }]}>{t('profile.journey')}</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.primary }]}>47</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t('profile.daysActive')}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.primary }]}>₹2.4L</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t('profile.moneySaved')}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.primary }]}>12</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t('profile.goalsAchieved')}</Text>
          </View>
        </View>
      </View>
    </FadeInUp>
  );

  const MenuSection = ({ title, items, delay = 200 }) => (
    <FadeInUp delay={delay}>
      <View style={[styles.menuSection, { backgroundColor: colors.surface }]}>
        <Text style={[styles.menuSectionTitle, { color: colors.text }]}>{title}</Text>
        {items.map((item, index) => (
          <TouchableArea 
            key={index} 
            style={styles.menuItem}
            onPress={item.onPress}
          >
            <View style={styles.menuItemLeft}>
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <Text style={[
                styles.menuText, 
                { color: item.isDestructive ? colors.error : colors.text }
              ]}>
                {item.title}
              </Text>
            </View>
            <Text style={[styles.menuArrow, { color: colors.textSecondary }]}>›</Text>
          </TouchableArea>
        ))}
      </View>
    </FadeInUp>
  );

  const personalItems = [
    { icon: '👤', title: t('profile.personalInfo') },
    { icon: '🏠', title: t('profile.location') },
    { icon: '💰', title: t('profile.income') },
    { icon: '🎯', title: t('profile.financialGoals') },
  ];

  const appItems = [
    { icon: '🔔', title: t('profile.notifications') },
    { icon: '🔒', title: t('profile.privacy') },
    { icon: '📊', title: t('profile.dataAnalytics') },
  ];

  const supportItems = [
    { icon: '❓', title: t('profile.help') },
    { icon: '📝', title: t('profile.feedback') },
    { icon: '⭐', title: t('profile.rate') },
    { icon: '📄', title: t('profile.terms') },
  ];

  const accountItems = [
    { icon: '🚪', title: 'Logout', onPress: handleLogout, isDestructive: true },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar 
        barStyle={isDarkMode ? "light-content" : "dark-content"} 
        backgroundColor={colors.background} 
      />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        contentInsetAdjustmentBehavior="automatic"
      >
        <ProfileHeader />
        <StatsCard />
        
        {/* Theme Toggle Section */}
        <FadeInUp delay={150}>
          <View style={[styles.themeSection, { backgroundColor: colors.surface }]}>
            <Text style={[styles.menuSectionTitle, { color: colors.text }]}>{t('profile.appearance')}</Text>
            <ThemeToggle style={styles.themeToggle} />
          </View>
        </FadeInUp>
        
        {/* Language Selector Section */}
        <FadeInUp delay={175}>
          <View style={[styles.languageSection, { backgroundColor: colors.surface }]}>
            <Text style={[styles.menuSectionTitle, { color: colors.text }]}>{t('profile.language')}</Text>
            <LanguageSelector style={styles.languageSelector} />
          </View>
        </FadeInUp>
        
        <MenuSection title={t('profile.personal')} items={personalItems} delay={200} />
        <MenuSection title={t('profile.appSettings')} items={appItems} delay={250} />
        <MenuSection title={t('profile.support')} items={supportItems} delay={300} />
        <MenuSection title="Account" items={accountItems} delay={350} />
        
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 100,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 10,
    paddingBottom: 100,
  },
  profileHeader: {
    margin: 16,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  editIcon: {
    fontSize: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    marginBottom: 8,
  },
  memberSince: {
    fontSize: 14,
  },
  statsCard: {
    margin: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    textAlign: 'center',
  },
  themeSection: {
    borderRadius: 16,
    margin: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  themeToggle: {
    marginTop: 12,
  },
  languageSection: {
    borderRadius: 16,
    margin: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  languageSelector: {
    marginTop: 12,
  },
  menuSection: {
    borderRadius: 16,
    margin: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  menuSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    padding: 20,
    paddingBottom: 12,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 16,
  },
  menuText: {
    fontSize: 16,
    fontWeight: '500',
  },
  menuArrow: {
    fontSize: 20,
    fontWeight: '300',
  },
  bottomSpacing: {
    height: 20,
  },
});

export default ProfileScreen;
