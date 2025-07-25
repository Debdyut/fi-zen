import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import aiContextManager from '../../services/AIContextManager';

const FiProductWidget = ({ user, screenType, onProductSelect }) => {
  
  const getFiProductRecommendations = () => {
    const monthlyIncome = user.profile?.monthlyIncome || 0;
    const netWorth = user.netWorth?.netWorth || 0;
    const hasGoals = user.goals && user.goals.length > 0;
    
    const recommendations = [];

    // Fi Money Account
    if (monthlyIncome > 25000) {
      recommendations.push({
        id: 'fi-money',
        name: 'Fi Money',
        icon: '💳',
        description: 'Zero balance savings account with 6% interest',
        benefit: `Earn ₹${Math.round(monthlyIncome * 0.06 / 12)} monthly interest`,
        cta: 'Open Account',
        priority: 'high',
        category: 'Banking'
      });
    }

    // Fi Credit Card
    if (monthlyIncome > 30000) {
      recommendations.push({
        id: 'fi-credit-card',
        name: 'Fi Credit Card',
        icon: '💎',
        description: 'Premium credit card with 5% cashback',
        benefit: `Up to ₹${Math.round(monthlyIncome * 0.05)} monthly cashback`,
        cta: 'Apply Now',
        priority: 'high',
        category: 'Credit'
      });
    }

    // Fi Investments
    if (netWorth > 100000 || hasGoals) {
      recommendations.push({
        id: 'fi-investments',
        name: 'Fi Investments',
        icon: '📈',
        description: 'AI-powered mutual fund investments',
        benefit: 'Expected 12-15% annual returns',
        cta: 'Start Investing',
        priority: 'medium',
        category: 'Investments'
      });
    }

    // Fi Insurance
    if (monthlyIncome > 20000) {
      const coverage = monthlyIncome * 120; // 10x annual income
      recommendations.push({
        id: 'fi-insurance',
        name: 'Fi Insurance',
        icon: '🛡️',
        description: 'Comprehensive health & term insurance',
        benefit: `₹${(coverage / 10000000).toFixed(1)}Cr coverage from ₹${Math.round(monthlyIncome * 0.01)}/month`,
        cta: 'Get Covered',
        priority: 'medium',
        category: 'Insurance'
      });
    }

    // Fi Loans
    if (monthlyIncome > 25000) {
      const loanAmount = monthlyIncome * 50;
      recommendations.push({
        id: 'fi-loans',
        name: 'Fi Instant Loan',
        icon: '⚡',
        description: 'Instant personal loans at competitive rates',
        benefit: `Get up to ₹${(loanAmount / 100000).toFixed(1)}L in 5 minutes`,
        cta: 'Apply Loan',
        priority: 'low',
        category: 'Loans'
      });
    }

    // Fi UPI
    recommendations.push({
      id: 'fi-upi',
      name: 'Fi UPI',
      icon: '📱',
      description: 'Seamless UPI payments with rewards',
      benefit: 'Earn rewards on every transaction',
      cta: 'Setup UPI',
      priority: 'low',
      category: 'Payments'
    });

    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  };

  const getScreenSpecificProducts = () => {
    const allProducts = getFiProductRecommendations();
    
    switch (screenType) {
      case 'goals':
        return allProducts.filter(p => 
          ['fi-investments', 'fi-money', 'fi-insurance'].includes(p.id)
        ).slice(0, 2);
      
      case 'insights':
        return allProducts.filter(p => 
          ['fi-credit-card', 'fi-money', 'fi-investments'].includes(p.id)
        ).slice(0, 2);
      
      case 'breakdown':
        return allProducts.filter(p => 
          ['fi-credit-card', 'fi-upi', 'fi-loans'].includes(p.id)
        ).slice(0, 2);
      
      case 'metricDetail':
        return allProducts.slice(0, 1);
      
      default:
        return allProducts.slice(0, 3);
    }
  };

  const handleProductClick = (product) => {
    // Track cross-sell interaction
    aiContextManager.trackCrossSellEvent('product_click', product.name, {
      priority: product.priority,
      category: product.category,
      screen: screenType
    });
    
    onProductSelect?.(product);
  };

  const handleViewAllClick = () => {
    // Track view all products interest
    aiContextManager.trackCrossSellEvent('view_all_products', 'multiple', {
      screen: screenType,
      availableProducts: products.length
    });
  };

  const products = getScreenSpecificProducts();

  if (products.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recommended Fi Products</Text>
        <Text style={styles.subtitle}>Tailored for your financial profile</Text>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.productsScroll}
      >
        {products.map((product) => (
          <TouchableOpacity
            key={product.id}
            style={[
              styles.productCard,
              product.priority === 'high' && styles.highPriority
            ]}
            onPress={() => onProductSelect?.(product)}
          >
            <View style={styles.productHeader}>
              <Text style={styles.productIcon}>{product.icon}</Text>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{product.category}</Text>
              </View>
            </View>

            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productDescription}>{product.description}</Text>
            
            <View style={styles.benefitContainer}>
              <Text style={styles.benefitText}>{product.benefit}</Text>
            </View>

            <TouchableOpacity 
              style={[
                styles.ctaButton,
                product.priority === 'high' && styles.ctaButtonHigh
              ]}
              onPress={() => handleProductClick(product)}
            >
              <Text style={[
                styles.ctaText,
                product.priority === 'high' && styles.ctaTextHigh
              ]}>
                {product.cta}
              </Text>
            </TouchableOpacity>

            {product.priority === 'high' && (
              <View style={styles.recommendedBadge}>
                <Text style={styles.recommendedText}>Recommended</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.viewAllButton} onPress={handleViewAllClick}>
        <Text style={styles.viewAllText}>View All Fi Products →</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    marginVertical: 8,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: '#666666',
  },
  productsScroll: {
    marginBottom: 12,
  },
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    width: 200,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    position: 'relative',
  },
  highPriority: {
    borderColor: '#00D4AA',
    borderWidth: 2,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  productIcon: {
    fontSize: 24,
  },
  categoryBadge: {
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  categoryText: {
    fontSize: 10,
    color: '#666666',
    fontWeight: '500',
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 6,
  },
  productDescription: {
    fontSize: 12,
    color: '#666666',
    lineHeight: 16,
    marginBottom: 12,
  },
  benefitContainer: {
    backgroundColor: '#00D4AA10',
    borderRadius: 6,
    padding: 8,
    marginBottom: 12,
  },
  benefitText: {
    fontSize: 11,
    color: '#00A085',
    fontWeight: '600',
    textAlign: 'center',
  },
  ctaButton: {
    backgroundColor: '#F0F0F0',
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: 'center',
  },
  ctaButtonHigh: {
    backgroundColor: '#00D4AA',
  },
  ctaText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666666',
  },
  ctaTextHigh: {
    color: '#FFFFFF',
  },
  recommendedBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#FF6B35',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  recommendedText: {
    fontSize: 9,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  viewAllButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  viewAllText: {
    fontSize: 12,
    color: '#00D4AA',
    fontWeight: '600',
  },
});

export default FiProductWidget;
