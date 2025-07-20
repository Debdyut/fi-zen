import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { EnhancedFiColors } from '../../theme/enhancedColors';
import { AnimatedCard, FadeInUp } from '../animations/AnimatedCard';
import { AccessibleHeading } from '../common/AccessibilityHelpers';

const ComplianceDetailsScreen = ({ navigation }) => {
  const ComplianceSection = ({ title, logo, children, delay = 0 }) => (
    <FadeInUp delay={delay}>
      <AnimatedCard style={styles.complianceCard}>
        <View style={styles.complianceHeader}>
          {logo && <Image source={logo} style={styles.logo} resizeMode="contain" />}
          <Text style={styles.complianceTitle}>{title}</Text>
        </View>
        <View style={styles.complianceContent}>
          {children}
        </View>
      </AnimatedCard>
    </FadeInUp>
  );

  const CompliancePoint = ({ icon, title, description }) => (
    <View style={styles.compliancePoint}>
      <Text style={styles.pointIcon}>{icon}</Text>
      <View style={styles.pointContent}>
        <Text style={styles.pointTitle}>{title}</Text>
        <Text style={styles.pointDescription}>{description}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <FadeInUp delay={0}>
        <View style={styles.header}>
          <AccessibleHeading level={1} style={styles.title}>
            Regulatory Compliance
          </AccessibleHeading>
          <Text style={styles.subtitle}>
            We follow strict Indian financial regulations to protect your data and ensure accuracy
          </Text>
        </View>
      </FadeInUp>

      <ComplianceSection
        title="Reserve Bank of India (RBI)"
        logo={require('../../../assets/logos/Reserve_Bank_of_India_logo.svg.png')}
        delay={200}
      >
        <CompliancePoint
          icon="📋"
          title="Digital Lending Guidelines 2022"
          description="Transparent calculation methodology and clear disclosure of data usage"
        />
        <CompliancePoint
          icon="🏦"
          title="Account Aggregator Framework"
          description="Secure, consent-based access to your financial data through RBI-licensed entities"
        />
        <CompliancePoint
          icon="🇮🇳"
          title="Data Localization"
          description="All your financial data is processed and stored within India"
        />
        <CompliancePoint
          icon="⚖️"
          title="Fair Practices Code"
          description="No hidden charges, transparent terms, and clear grievance redressal"
        />
      </ComplianceSection>

      <ComplianceSection
        title="Securities and Exchange Board of India (SEBI)"
        logo={require('../../../assets/logos/sebi-new-logo-445.jpg')}
        delay={400}
      >
        <CompliancePoint
          icon="📚"
          title="Educational Content Only"
          description="All inflation insights are for educational purposes, not investment advice"
        />
        <CompliancePoint
          icon="⚠️"
          title="Risk Disclosures"
          description="Clear warnings about calculation limitations and data accuracy"
        />
        <CompliancePoint
          icon="🎯"
          title="No Investment Recommendations"
          description="We suggest consulting SEBI-registered advisors for personalized advice"
        />
      </ComplianceSection>

      <ComplianceSection
        title="Ministry of Electronics & IT (MeitY)"
        logo={require('../../../assets/logos/Ministry_of_Electronics_and_Information_Technology.svg')}
        delay={600}
      >
        <CompliancePoint
          icon="🔒"
          title="Data Protection"
          description="Compliance with IT Rules 2021 and upcoming Personal Data Protection Act"
        />
        <CompliancePoint
          icon="✅"
          title="Consent Management"
          description="Explicit user consent for data collection, processing, and usage"
        />
        <CompliancePoint
          icon="🛡️"
          title="Cybersecurity Framework"
          description="Multi-layer security with incident response and breach notification protocols"
        />
      </ComplianceSection>

      <ComplianceSection
        title="Payment Card Industry (PCI DSS)"
        logo={require('../../../assets/logos/PCI-DSS-1.png')}
        delay={800}
      >
        <CompliancePoint
          icon="💳"
          title="Secure Data Handling"
          description="Bank-grade security for all financial data transmission and processing"
        />
        <CompliancePoint
          icon="🔐"
          title="Encryption Standards"
          description="AES-256 encryption for data at rest and TLS 1.3 for data in transit"
        />
        <CompliancePoint
          icon="🔍"
          title="Regular Audits"
          description="Quarterly security assessments and compliance verification"
        />
      </ComplianceSection>

      <FadeInUp delay={1000}>
        <View style={styles.additionalInfo}>
          <Text style={styles.additionalTitle}>📊 Data Sources & Attribution</Text>
          <View style={styles.dataSource}>
            <Text style={styles.dataSourceTitle}>MOSPI (Ministry of Statistics)</Text>
            <Text style={styles.dataSourceDesc}>
              Consumer Price Index data with proper attribution and monthly updates
            </Text>
          </View>
          <View style={styles.dataSource}>
            <Text style={styles.dataSourceTitle}>RBI Policy Rates</Text>
            <Text style={styles.dataSourceDesc}>
              Official repo rates and inflation targets for benchmark comparisons
            </Text>
          </View>
        </View>
      </FadeInUp>

      <FadeInUp delay={1200}>
        <View style={styles.contactSection}>
          <Text style={styles.contactTitle}>📞 Compliance Contact</Text>
          <Text style={styles.contactText}>
            For any compliance-related queries or concerns:
          </Text>
          <Text style={styles.contactEmail}>compliance@fi-zen.com</Text>
          <Text style={styles.contactText}>
            Response time: Within 48 hours
          </Text>
        </View>
      </FadeInUp>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: EnhancedFiColors.background,
    padding: 20,
  },
  header: {
    marginBottom: 24,
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: EnhancedFiColors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: EnhancedFiColors.textSecondary,
    lineHeight: 22,
  },
  complianceCard: {
    backgroundColor: EnhancedFiColors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: EnhancedFiColors.border,
  },
  complianceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: EnhancedFiColors.border,
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  complianceTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: EnhancedFiColors.text,
    flex: 1,
  },
  complianceContent: {
    gap: 16,
  },
  compliancePoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  pointIcon: {
    fontSize: 20,
    marginRight: 12,
    marginTop: 2,
  },
  pointContent: {
    flex: 1,
  },
  pointTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: EnhancedFiColors.text,
    marginBottom: 4,
  },
  pointDescription: {
    fontSize: 13,
    color: EnhancedFiColors.textSecondary,
    lineHeight: 18,
  },
  additionalInfo: {
    backgroundColor: EnhancedFiColors.info + '10',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: EnhancedFiColors.info + '20',
  },
  additionalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: EnhancedFiColors.text,
    marginBottom: 12,
  },
  dataSource: {
    marginBottom: 12,
  },
  dataSourceTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: EnhancedFiColors.primary,
    marginBottom: 4,
  },
  dataSourceDesc: {
    fontSize: 13,
    color: EnhancedFiColors.textSecondary,
    lineHeight: 18,
  },
  contactSection: {
    backgroundColor: EnhancedFiColors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: EnhancedFiColors.border,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: EnhancedFiColors.text,
    marginBottom: 8,
  },
  contactText: {
    fontSize: 14,
    color: EnhancedFiColors.textSecondary,
    lineHeight: 20,
    marginBottom: 4,
  },
  contactEmail: {
    fontSize: 14,
    color: EnhancedFiColors.primary,
    fontWeight: '600',
    marginBottom: 8,
  },
});

export default ComplianceDetailsScreen;
