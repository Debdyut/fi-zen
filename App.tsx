import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ScrollView,
} from 'react-native';

const colors = {
  primary: '#02B899',
  secondary: '#4B7672',
  darkText: '#FBFDFD',
  black: '#1C1B1C',
  background: '#272A29',
};

function App() {
  const [balance, setBalance] = useState(12450.75);
  const [plantGrowth, setPlantGrowth] = useState(3);
  const [rewardPoints, setRewardPoints] = useState(245);

  const getPlantEmoji = (growth) => {
    if (growth <= 1) return '🌱';
    if (growth <= 3) return '🌿';
    if (growth <= 5) return '🪴';
    return '🌳';
  };

  const handleTransaction = (amount) => {
    setBalance(balance + amount);
    if (amount > 0) {
      setPlantGrowth(Math.min(plantGrowth + 1, 6));
      setRewardPoints(rewardPoints + 10);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Good morning! 👋</Text>
              <Text style={styles.subtitle}>Money made simple</Text>
            </View>
            <TouchableOpacity style={styles.profileButton}>
              <Text style={styles.profileEmoji}>😊</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Total Balance</Text>
            <Text style={styles.balanceAmount}>₹{balance.toLocaleString('en-IN', {minimumFractionDigits: 2})}</Text>
            <Text style={styles.balanceSubtext}>Keep it growing! 📈</Text>
          </View>
          
          <View style={styles.rewardsSection}>
            <View style={styles.plantContainer}>
              <Text style={styles.plantEmoji}>{getPlantEmoji(plantGrowth)}</Text>
              <Text style={styles.plantText}>Your money plant is growing!</Text>
              <Text style={styles.rewardPoints}>{rewardPoints} Fi Points ✨</Text>
            </View>
          </View>
          
          <View style={styles.actionContainer}>
            <TouchableOpacity
              style={[styles.actionButton, styles.primaryButton]}
              onPress={() => handleTransaction(1000)}>
              <Text style={styles.primaryButtonText}>💰 Add Money</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.secondaryButton]}
              onPress={() => handleTransaction(-500)}>
              <Text style={styles.secondaryButtonText}>📤 Send Money</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.quickActions}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActionGrid}>
              <TouchableOpacity style={styles.quickActionItem}>
                <Text style={styles.quickActionEmoji}>💳</Text>
                <Text style={styles.quickActionText}>Cards</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickActionItem}>
                <Text style={styles.quickActionEmoji}>📊</Text>
                <Text style={styles.quickActionText}>Insights</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickActionItem}>
                <Text style={styles.quickActionEmoji}>🎯</Text>
                <Text style={styles.quickActionText}>Goals</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickActionItem}>
                <Text style={styles.quickActionEmoji}>🏆</Text>
                <Text style={styles.quickActionText}>Rewards</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.funSection}>
            <Text style={styles.funTitle}>Today's Vibe 🎭</Text>
            <View style={styles.vibeCard}>
              <Text style={styles.vibeEmoji}>🥲</Text>
              <Text style={styles.vibeText}>When you check your balance after weekend shopping</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.darkText,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.secondary,
    fontStyle: 'italic',
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileEmoji: {
    fontSize: 20,
  },
  balanceCard: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 14,
    color: '#FBFDFD',
    opacity: 0.9,
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FBFDFD',
    marginBottom: 4,
  },
  balanceSubtext: {
    fontSize: 12,
    color: '#FBFDFD',
    opacity: 0.8,
  },
  rewardsSection: {
    marginBottom: 24,
  },
  plantContainer: {
    backgroundColor: colors.secondary + '15',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.secondary + '30',
  },
  plantEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  plantText: {
    fontSize: 14,
    color: '#FBFDFD',
    fontWeight: '500',
    marginBottom: 4,
  },
  rewardPoints: {
    fontSize: 12,
    color: '#02B899',
    fontWeight: '600',
  },
  actionContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: colors.secondary,
  },
  primaryButtonText: {
    color: '#FBFDFD',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#FBFDFD',
    fontSize: 16,
    fontWeight: '600',
  },
  quickActions: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.darkText,
    marginBottom: 16,
  },
  quickActionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionItem: {
    width: '47%',
    backgroundColor: colors.black,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.secondary + '40',
  },
  quickActionEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 13,
    color: '#FBFDFD',
    fontWeight: '500',
  },
  funSection: {
    marginBottom: 20,
  },
  funTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.darkText,
    marginBottom: 12,
  },
  vibeCard: {
    backgroundColor: colors.primary + '10',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary + '20',
  },
  vibeEmoji: {
    fontSize: 28,
    marginBottom: 8,
  },
  vibeText: {
    fontSize: 13,
    color: '#FBFDFD',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default App;
