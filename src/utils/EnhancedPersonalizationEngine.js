// Enhanced Personalization Engine for Goals
// Based on 20 user persona feedback analysis
// Now uses dynamic goal amounts instead of hard-coded values

import LocationCostEngine from './LocationCostEngine';
import DynamicThresholdEngine from './DynamicThresholdEngine';

class EnhancedPersonalizationEngine {
  
  // Professional goal templates based on user feedback
  static getProfessionalGoals(profile) {
    const profession = profile.profession.toLowerCase();
    const income = profile.monthlyIncome;
    const age = profile.age;
    
    const professionalGoals = [];
    
    // Tech Professionals (Software Engineer, VP Engineering, Product Manager, Data Scientist, UX Designer)
    if (profession.includes('engineer') || profession.includes('product') || 
        profession.includes('data') || profession.includes('designer') || 
        profession.includes('software')) {
      
      // Skill Development Goal - Dynamic amount based on income
      const skillGoal = DynamicThresholdEngine.getGoalAmounts(profile, 'tech_setup');
      professionalGoals.push({
        goalId: `skill_development_${profile.userId}`,
        title: 'Skill Development & Certifications',
        targetAmount: skillGoal.target,
        currentAmount: 0,
        targetDate: new Date(Date.now() + 12 * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        monthlyContribution: skillGoal.monthly,
        priority: 'medium',
        status: 'active',
        icon: '🎓',
        category: 'Professional',
        description: 'Courses, certifications, and skill upgrades to advance your tech career',
        reasoning: skillGoal.reasoning
      });
      
      // Equipment/Setup Goal (for senior roles) - Dynamic based on income and location
      if (income > 150000) {
        const equipmentGoal = DynamicThresholdEngine.getGoalAmounts(profile, 'tech_setup');
        professionalGoals.push({
          goalId: `tech_setup_${profile.userId}`,
          title: 'Home Office & Tech Setup',
          targetAmount: Math.round(equipmentGoal.target * 1.2), // 20% more for equipment
          currentAmount: Math.round(equipmentGoal.target * 0.25), // Assume some existing equipment
          targetDate: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          monthlyContribution: Math.round(equipmentGoal.monthly * 1.5),
          priority: 'low',
          status: 'active',
          icon: '💻',
          category: 'Professional',
          description: 'High-end laptop, monitor, desk setup for optimal productivity',
          reasoning: `Equipment budget scaled to your ${income >= 300000 ? 'senior' : 'mid-level'} role and location`
        });
      }
      
      // Startup Investment Goal (for aggressive profiles)
      if (profile.riskProfile.includes('aggressive') && income > 100000) {
        professionalGoals.push({
          goalId: `startup_investment_${profile.userId}`,
          title: 'Startup & Angel Investments',
          targetAmount: income * 6, // 6 months income for startup investments
          currentAmount: 0,
          targetDate: new Date(Date.now() + 24 * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          monthlyContribution: Math.max(10000, income * 0.08),
          priority: 'low',
          status: 'active',
          icon: '🚀',
          category: 'Investment',
          description: 'Angel investments in startups and tech companies'
        });
      }
    }
    
    // Healthcare Professionals (Doctor, Pharmacist)
    else if (profession.includes('doctor') || profession.includes('pharmacist')) {
      
      // Practice Setup/Expansion Goal
      professionalGoals.push({
        goalId: `practice_setup_${profile.userId}`,
        title: profession.includes('doctor') ? 'Clinic Setup & Equipment' : 'Pharmacy Business Expansion',
        targetAmount: income * 12, // 1 year income for practice setup
        currentAmount: income * 2, // Assume some existing setup
        targetDate: new Date(Date.now() + 36 * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        monthlyContribution: Math.max(15000, income * 0.12),
        priority: 'high',
        status: 'active',
        icon: profession.includes('doctor') ? '🏥' : '💊',
        category: 'Professional',
        description: profession.includes('doctor') ? 
          'Medical equipment, clinic setup, and practice expansion' :
          'Pharmacy inventory, equipment, and business expansion'
      });
      
      // Continuing Education Goal
      professionalGoals.push({
        goalId: `medical_education_${profile.userId}`,
        title: 'Medical Education & Conferences',
        targetAmount: 150000, // 1.5L annually for medical education
        currentAmount: 0,
        targetDate: new Date(Date.now() + 12 * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        monthlyContribution: 12500,
        priority: 'medium',
        status: 'active',
        icon: '📚',
        category: 'Professional',
        description: 'Medical conferences, journals, and continuing education requirements'
      });
      
      // Professional Insurance Goal
      professionalGoals.push({
        goalId: `professional_insurance_${profile.userId}`,
        title: 'Professional Liability Insurance',
        targetAmount: 100000, // 1L for comprehensive coverage
        currentAmount: 0,
        targetDate: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        monthlyContribution: 17000,
        priority: 'high',
        status: 'active',
        icon: '🛡️',
        category: 'Safety',
        description: 'Malpractice and professional liability insurance coverage'
      });
    }
    
    // Education Professionals (Teacher)
    else if (profession.includes('teacher')) {
      
      // Professional Development Goal
      professionalGoals.push({
        goalId: `teacher_development_${profile.userId}`,
        title: 'Teaching Qualifications & Development',
        targetAmount: 200000, // 2L for higher qualifications
        currentAmount: 0,
        targetDate: new Date(Date.now() + 24 * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        monthlyContribution: Math.max(8000, income * 0.15),
        priority: 'medium',
        status: 'active',
        icon: '🎓',
        category: 'Professional',
        description: 'Higher qualifications, certifications, and professional development'
      });
      
      // Summer Utilization Goal
      professionalGoals.push({
        goalId: `summer_planning_${profile.userId}`,
        title: 'Summer Break Utilization',
        targetAmount: income * 2, // 2 months income for summer activities
        currentAmount: 0,
        targetDate: new Date(Date.now() + 10 * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        monthlyContribution: Math.max(4000, income * 0.08),
        priority: 'low',
        status: 'active',
        icon: '☀️',
        category: 'Lifestyle',
        description: 'Summer courses, travel, or additional income opportunities'
      });
    }
    
    // Creative Professionals (Content Writer, Graphic Designer, UX Designer)
    else if (profession.includes('writer') || profession.includes('content') || 
             profession.includes('graphic') || profession.includes('creative')) {
      
      // Skill Development & Portfolio Goal
      professionalGoals.push({
        goalId: `creative_development_${profile.userId}`,
        title: 'Creative Skills & Portfolio Development',
        targetAmount: Math.max(100000, income * 2), // 2 months income for courses/tools
        currentAmount: 0,
        targetDate: new Date(Date.now() + 12 * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        monthlyContribution: Math.max(3000, income * 0.08),
        priority: 'medium',
        status: 'active',
        icon: '🎨',
        category: 'Professional',
        description: 'Creative courses, design tools, portfolio development, and freelance setup'
      });
      
      // Equipment & Tools Goal
      professionalGoals.push({
        goalId: `creative_tools_${profile.userId}`,
        title: 'Creative Tools & Equipment',
        targetAmount: Math.max(75000, income * 1.5), // 1.5 months income for tools
        currentAmount: 25000, // Assume some existing tools
        targetDate: new Date(Date.now() + 8 * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        monthlyContribution: Math.max(2500, income * 0.05),
        priority: 'low',
        status: 'active',
        icon: '🛠️',
        category: 'Professional',
        description: 'Design software, camera equipment, laptop, and creative tools'
      });
      
      // Freelance Income Goal (for building side income)
      if (income < 80000) { // For lower income creatives
        professionalGoals.push({
          goalId: `freelance_income_${profile.userId}`,
          title: 'Freelance Income Development',
          targetAmount: income * 6, // 6 months income as freelance target
          currentAmount: 0,
          targetDate: new Date(Date.now() + 18 * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          monthlyContribution: Math.max(2000, income * 0.06),
          priority: 'high',
          status: 'active',
          icon: '💼',
          category: 'Professional',
          description: 'Building freelance client base and additional income streams'
        });
      }
    }
    
    // Business/Entrepreneurial Professionals
    else if (profession.includes('owner') || profession.includes('entrepreneur') || 
             profession.includes('business')) {
      
      // Business Expansion Goal
      professionalGoals.push({
        goalId: `business_expansion_${profile.userId}`,
        title: 'Business Expansion Capital',
        targetAmount: income * 8, // 8 months income for expansion
        currentAmount: income * 1, // Assume some capital
        targetDate: new Date(Date.now() + 18 * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        monthlyContribution: Math.max(20000, income * 0.15),
        priority: 'high',
        status: 'active',
        icon: '📈',
        category: 'Professional',
        description: 'Capital for business expansion, new equipment, or market expansion'
      });
      
      // Business Emergency Fund (separate from personal)
      professionalGoals.push({
        goalId: `business_emergency_${profile.userId}`,
        title: 'Business Emergency Fund',
        targetAmount: income * 6, // 6 months business expenses
        currentAmount: income * 1,
        targetDate: new Date(Date.now() + 12 * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        monthlyContribution: Math.max(15000, income * 0.12),
        priority: 'high',
        status: 'active',
        icon: '🏢',
        category: 'Safety',
        description: 'Emergency fund specifically for business operations and cash flow'
      });
    }
    
    return professionalGoals;
  }
  
  // Generate all goals including professional ones with location adjustments
  static generateEnhancedGoals(profile, portfolio, netWorth) {
    const standardGoals = this.generateStandardGoals(profile, portfolio, netWorth);
    const professionalGoals = this.getProfessionalGoals(profile);
    
    // Combine all goals
    const allGoals = [...standardGoals, ...professionalGoals];
    
    // Apply location-based cost adjustments
    const locationAdjustedGoals = LocationCostEngine.adjustGoalsForLocation(allGoals, profile.location);
    
    return locationAdjustedGoals;
  }
  
  // Standard goals (existing logic)
  static generateStandardGoals(profile, portfolio, netWorth) {
    const income = profile.monthlyIncome;
    const age = profile.age;
    const goals = [];
    
    // Emergency Fund Goal
    const emergencyTarget = income * 6;
    const currentEmergency = Math.min(netWorth.breakdown.bankAccounts, emergencyTarget);
    goals.push({
      goalId: 'emergency_fund',
      title: 'Emergency Fund',
      targetAmount: emergencyTarget,
      currentAmount: currentEmergency,
      targetDate: new Date(Date.now() + 12 * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      monthlyContribution: Math.max(5000, (emergencyTarget - currentEmergency) / 12),
      priority: 'high',
      status: 'active',
      icon: '🛡️',
      category: 'Safety'
    });

    // House Down Payment (if age < 35 and income > 80k)
    if (age < 35 && income > 80000) {
      const houseTarget = income * 24;
      const currentHouse = Math.min(netWorth.breakdown.bankAccounts * 0.3, houseTarget * 0.5);
      goals.push({
        goalId: 'house_down_payment',
        title: 'House Down Payment',
        targetAmount: houseTarget,
        currentAmount: currentHouse,
        targetDate: new Date(Date.now() + 36 * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        monthlyContribution: Math.max(10000, (houseTarget - currentHouse) / 36),
        priority: 'medium',
        status: 'active',
        icon: '🏠',
        category: 'Investment'
      });
    }

    // Retirement Goal
    if (age > 25) {
      const retirementTarget = income * 12 * (65 - age) * 0.8;
      const currentRetirement = portfolio.totalMutualFunds + portfolio.totalStocks;
      goals.push({
        goalId: 'retirement_fund',
        title: 'Retirement Fund',
        targetAmount: retirementTarget,
        currentAmount: currentRetirement,
        targetDate: new Date(Date.now() + (65 - age) * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        monthlyContribution: Math.max(15000, income * 0.15),
        priority: 'high',
        status: 'active',
        icon: '🏖️',
        category: 'Retirement'
      });
    }

    return goals;
  }
}

export default EnhancedPersonalizationEngine;

// CommonJS export for testing
module.exports = EnhancedPersonalizationEngine;
