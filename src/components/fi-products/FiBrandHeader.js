import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';

const FiBrandHeader = ({ user, screenType, onBrandAction }) => {
  
  const getScreenBranding = () => {
    const brandingConfig = {
      goals: {
        title: 'Fi-Zen Goals',
        subtitle: 'Powered by Fi AI',
        tagline: 'Your intelligent financial companion',
        color: '#00D4AA',
        icon: '🎯'
      },
      insights: {
        title: 'Fi Analytics',
        subtitle: 'Powered by Deltaverse AI',
        tagline: 'Smart insights for smarter decisions',
        color: '#6366F1',
        icon: '📊'
      },
      breakdown: {
        title: 'Fi Spending Intelligence',
        subtitle: 'Powered by Fi AI',
        tagline: 'Optimize every rupee with AI',
        color: '#F59E0B',
        icon: '💰'
      },
      metricDetail: {
        title: 'Fi Metrics',
        subtitle: 'Powered by Fi Analytics',
        tagline: 'Deep dive into your financial health',
        color: '#8B5CF6',
        icon: '📈'
      },
      home: {
        title: 'Fi-Zen',
        subtitle: 'Your Financial Zen',
        tagline: 'Banking reimagined with AI',
        color: '#00D4AA',
        icon: '🏠'
      }
    };

    return brandingConfig[screenType] || brandingConfig.home;
  };

  const getFiEcosystemStatus = () => {
    // Mock Fi ecosystem integration status
    return {
      fiMoney: user.profile?.monthlyIncome > 25000,
      fiCredit: user.profile?.monthlyIncome > 30000,
      fiInvestments: user.netWorth?.netWorth > 100000,
      fiInsurance: user.profile?.age && user.profile.age > 21,
      fiUPI: true // Always available
    };
  };

  const branding = getScreenBranding();
  const ecosystem = getFiEcosystemStatus();
  const activeProducts = Object.values(ecosystem).filter(Boolean).length;

  return (
    <View style={[styles.container, { borderLeftColor: branding.color }]}>
      <View style={styles.mainHeader}>
        <View style={styles.brandInfo}>
          <View style={styles.titleContainer}>
            <Text style={styles.brandIcon}>{branding.icon}</Text>
            <View>
              <Text style={styles.title}>{branding.title}</Text>
              <Text style={styles.subtitle}>{branding.subtitle}</Text>
            </View>
          </View>
          <Text style={styles.tagline}>{branding.tagline}</Text>
        </View>

        <TouchableOpacity 
          style={[styles.fiLogoContainer, { backgroundColor: branding.color + '20' }]}
          onPress={() => onBrandAction?.('fi-ecosystem')}
        >
          <Text style={[styles.fiLogo, { color: branding.color }]}>Fi</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.ecosystemStatus}>
        <Text style={styles.ecosystemTitle}>
          Fi Ecosystem • {activeProducts}/5 products active
        </Text>
        
        <View style={styles.productIndicators}>
          <View style={[styles.indicator, ecosystem.fiMoney && styles.indicatorActive]}>
            <Text style={styles.indicatorText}>Money</Text>
          </View>
          <View style={[styles.indicator, ecosystem.fiCredit && styles.indicatorActive]}>
            <Text style={styles.indicatorText}>Credit</Text>
          </View>
          <View style={[styles.indicator, ecosystem.fiInvestments && styles.indicatorActive]}>
            <Text style={styles.indicatorText}>Invest</Text>
          </View>
          <View style={[styles.indicator, ecosystem.fiInsurance && styles.indicatorActive]}>
            <Text style={styles.indicatorText}>Insure</Text>
          </View>
          <View style={[styles.indicator, ecosystem.fiUPI && styles.indicatorActive]}>
            <Text style={styles.indicatorText}>UPI</Text>
          </View>
        </View>
      </View>

      <View style={styles.aiPowered}>
        <Text style={styles.aiText}>🤖 Powered by Deltaverse AI</Text>
        <TouchableOpacity onPress={() => onBrandAction?.('ai-info')}>
          <Text style={styles.aiLink}>Learn more</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mainHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  brandInfo: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  brandIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
  },
  tagline: {
    fontSize: 13,
    color: '#666666',
    fontStyle: 'italic',
  },
  fiLogoContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fiLogo: {
    fontSize: 18,
    fontWeight: '900',
  },
  ecosystemStatus: {
    marginBottom: 12,
  },
  ecosystemTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  productIndicators: {
    flexDirection: 'row',
    gap: 8,
  },
  indicator: {
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  indicatorActive: {
    backgroundColor: '#00D4AA20',
  },
  indicatorText: {
    fontSize: 10,
    color: '#666666',
    fontWeight: '500',
  },
  aiPowered: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  aiText: {
    fontSize: 11,
    color: '#666666',
  },
  aiLink: {
    fontSize: 11,
    color: '#00D4AA',
    fontWeight: '500',
  },
});

export default FiBrandHeader;
