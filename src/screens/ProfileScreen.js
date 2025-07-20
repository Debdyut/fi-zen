import React from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, Image } from 'react-native';
import { FadeInUp } from '../components/animations/AnimatedCard';
import { TouchableArea } from '../components/common/AccessibilityHelpers';

const FiColors = {
  background: '#1A1A1A',
  surface: '#FFFFFF',
  primary: '#00D4AA',
  text: '#1A1A1A',
  textSecondary: '#666666',
  textInverse: '#FFFFFF',
  border: '#E0E0E0',
};

const ProfileScreen = ({ navigation }) => {
  const ProfileHeader = () => (
    <FadeInUp delay={0}>
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <Image 
            source={require('../../assets/avatars/avatar-1.png')} 
            style={styles.avatar}
          />
          <TouchableArea style={styles.editAvatarButton}>
            <Text style={styles.editIcon}>✏️</Text>
          </TouchableArea>
        </View>
        
        <Text style={styles.userName}>Arjun Sharma</Text>
        <Text style={styles.userEmail}>arjun.sharma@email.com</Text>
        <Text style={styles.memberSince}>Member since March 2024</Text>
      </View>
    </FadeInUp>
  );

  const StatsCard = () => (
    <FadeInUp delay={100}>
      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>Your Fi Journey</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>47</Text>
            <Text style={styles.statLabel}>Days Active</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>₹2.4L</Text>
            <Text style={styles.statLabel}>Money Saved</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Goals Achieved</Text>
          </View>
        </View>
      </View>
    </FadeInUp>
  );

  const MenuSection = ({ title, items, delay = 200 }) => (
    <FadeInUp delay={delay}>
      <View style={styles.menuSection}>
        <Text style={styles.menuSectionTitle}>{title}</Text>
        {items.map((item, index) => (
          <TouchableArea key={index} style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <Text style={styles.menuText}>{item.title}</Text>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableArea>
        ))}
      </View>
    </FadeInUp>
  );

  const personalItems = [
    { icon: '👤', title: 'Personal Information' },
    { icon: '🏠', title: 'Location & Preferences' },
    { icon: '💰', title: 'Income & Expenses' },
    { icon: '🎯', title: 'Financial Goals' },
  ];

  const appItems = [
    { icon: '🔔', title: 'Notifications' },
    { icon: '🔒', title: 'Privacy & Security' },
    { icon: '📊', title: 'Data & Analytics' },
    { icon: '🌙', title: 'App Appearance' },
  ];

  const supportItems = [
    { icon: '❓', title: 'Help & Support' },
    { icon: '📝', title: 'Feedback' },
    { icon: '⭐', title: 'Rate Fi App' },
    { icon: '📄', title: 'Terms & Privacy' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={FiColors.background} />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>
        <ProfileHeader />
        <StatsCard />
        
        <MenuSection title="Personal" items={personalItems} delay={200} />
        <MenuSection title="App Settings" items={appItems} delay={300} />
        <MenuSection title="Support" items={supportItems} delay={400} />
        
        {/* Logout Button */}
        <FadeInUp delay={500}>
          <TouchableArea style={styles.logoutButton}>
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableArea>
        </FadeInUp>
        
        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Fi App v1.2.0</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
  },
  header: {
    backgroundColor: FiColors.background,
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '600',
    color: FiColors.textInverse,
  },
  content: {
    flex: 1,
  },
  profileHeader: {
    backgroundColor: FiColors.surface,
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
    backgroundColor: FiColors.surface,
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
    color: FiColors.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: FiColors.textSecondary,
    marginBottom: 8,
  },
  memberSince: {
    fontSize: 14,
    color: FiColors.textSecondary,
  },
  statsCard: {
    backgroundColor: FiColors.surface,
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
    color: FiColors.text,
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
    color: FiColors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: FiColors.textSecondary,
    textAlign: 'center',
  },
  menuSection: {
    backgroundColor: FiColors.surface,
    margin: 16,
    borderRadius: 16,
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
    color: FiColors.text,
    padding: 20,
    paddingBottom: 12,
    backgroundColor: FiColors.surface,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: FiColors.border + '30',
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
    color: FiColors.text,
    fontWeight: '500',
  },
  menuArrow: {
    fontSize: 20,
    color: FiColors.textSecondary,
    fontWeight: '300',
  },
  logoutButton: {
    backgroundColor: '#FF6B6B',
    margin: 16,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 20,
  },
  versionText: {
    fontSize: 14,
    color: FiColors.textSecondary,
  },
});

export default ProfileScreen;
