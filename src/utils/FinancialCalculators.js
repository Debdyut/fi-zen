// Financial Calculators - Interactive tools for financial planning
class FinancialCalculators {
  
  // Emergency Fund Calculator
  static calculateEmergencyFund(monthlyExpenses, targetMonths = 6) {
    const targetAmount = monthlyExpenses * targetMonths;
    
    return {
      targetAmount,
      targetMonths,
      monthlyExpenses,
      recommendations: this.getEmergencyFundRecommendations(targetAmount)
    };
  }

  // SIP Calculator for goal-based investing
  static calculateSIP(targetAmount, timeframe, expectedReturn = 12) {
    const monthlyRate = expectedReturn / 100 / 12;
    const totalMonths = timeframe * 12;
    
    // PMT formula for SIP calculation
    const monthlySIP = targetAmount * monthlyRate / 
      (Math.pow(1 + monthlyRate, totalMonths) - 1);
    
    const totalInvestment = monthlySIP * totalMonths;
    const totalReturns = targetAmount - totalInvestment;
    
    return {
      monthlySIP: Math.round(monthlySIP),
      totalInvestment: Math.round(totalInvestment),
      totalReturns: Math.round(totalReturns),
      targetAmount,
      timeframe,
      expectedReturn,
      yearlyBreakdown: this.generateYearlyBreakdown(monthlySIP, timeframe, monthlyRate)
    };
  }

  // Retirement Planning Calculator
  static calculateRetirement(currentAge, retirementAge, currentSavings, monthlyIncome, inflationRate = 6) {
    const yearsToRetirement = retirementAge - currentAge;
    const expectedReturn = 12; // Annual return assumption
    
    // Calculate required corpus (25x annual expenses rule)
    const currentAnnualExpenses = monthlyIncome * 12 * 0.7; // 70% of income
    const futureAnnualExpenses = currentAnnualExpenses * Math.pow(1 + inflationRate/100, yearsToRetirement);
    const requiredCorpus = futureAnnualExpenses * 25;
    
    // Calculate future value of current savings
    const futureValueCurrentSavings = currentSavings * Math.pow(1 + expectedReturn/100, yearsToRetirement);
    
    // Calculate additional corpus needed
    const additionalCorpusNeeded = requiredCorpus - futureValueCurrentSavings;
    
    // Calculate required monthly SIP
    const monthlyRate = expectedReturn / 100 / 12;
    const totalMonths = yearsToRetirement * 12;
    const requiredMonthlySIP = additionalCorpusNeeded * monthlyRate / 
      (Math.pow(1 + monthlyRate, totalMonths) - 1);
    
    return {
      requiredCorpus: Math.round(requiredCorpus),
      currentSavings,
      additionalCorpusNeeded: Math.round(additionalCorpusNeeded),
      requiredMonthlySIP: Math.round(requiredMonthlySIP),
      yearsToRetirement,
      futureAnnualExpenses: Math.round(futureAnnualExpenses),
      recommendations: this.getRetirementRecommendations(requiredMonthlySIP, monthlyIncome)
    };
  }

  // Home Loan Affordability Calculator
  static calculateHomeLoanAffordability(monthlyIncome, existingEMIs, interestRate = 8.5, tenure = 20) {
    const maxEMIRatio = 0.4; // 40% of income for EMIs
    const availableForEMI = (monthlyIncome * maxEMIRatio) - existingEMIs;
    
    if (availableForEMI <= 0) {
      return {
        maxLoanAmount: 0,
        maxEMI: 0,
        affordablePropertyPrice: 0,
        recommendations: ['Reduce existing EMIs before taking home loan']
      };
    }
    
    // Calculate maximum loan amount using EMI formula
    const monthlyRate = interestRate / 100 / 12;
    const totalMonths = tenure * 12;
    const maxLoanAmount = availableForEMI * 
      (Math.pow(1 + monthlyRate, totalMonths) - 1) / 
      (monthlyRate * Math.pow(1 + monthlyRate, totalMonths));
    
    // Assuming 20% down payment
    const affordablePropertyPrice = maxLoanAmount / 0.8;
    
    return {
      maxLoanAmount: Math.round(maxLoanAmount),
      maxEMI: Math.round(availableForEMI),
      affordablePropertyPrice: Math.round(affordablePropertyPrice),
      downPaymentNeeded: Math.round(affordablePropertyPrice * 0.2),
      monthlyIncome,
      existingEMIs,
      recommendations: this.getHomeLoanRecommendations(maxLoanAmount, monthlyIncome)
    };
  }

  // Tax Savings Calculator
  static calculateTaxSavings(annualIncome, currentInvestments = 0) {
    const maxDeduction = 150000; // 80C limit
    const remainingDeduction = Math.max(0, maxDeduction - currentInvestments);
    
    // Tax slabs for new regime (simplified)
    let taxSavings = 0;
    if (annualIncome > 1500000) {
      taxSavings = remainingDeduction * 0.3; // 30% tax bracket
    } else if (annualIncome > 1200000) {
      taxSavings = remainingDeduction * 0.25; // 25% tax bracket
    } else if (annualIncome > 900000) {
      taxSavings = remainingDeduction * 0.2; // 20% tax bracket
    } else if (annualIncome > 600000) {
      taxSavings = remainingDeduction * 0.15; // 15% tax bracket
    } else if (annualIncome > 300000) {
      taxSavings = remainingDeduction * 0.1; // 10% tax bracket
    } else {
      taxSavings = remainingDeduction * 0.05; // 5% tax bracket
    }
    
    return {
      annualIncome,
      currentInvestments,
      remainingDeduction,
      potentialTaxSavings: Math.round(taxSavings),
      recommendedInvestments: this.getTaxSavingInvestments(remainingDeduction),
      monthlySavingsNeeded: Math.round(remainingDeduction / 12)
    };
  }

  // Investment Growth Calculator
  static calculateInvestmentGrowth(principal, monthlyInvestment, timeframe, expectedReturn) {
    const monthlyRate = expectedReturn / 100 / 12;
    const totalMonths = timeframe * 12;
    
    // Future value of lump sum
    const futureValuePrincipal = principal * Math.pow(1 + monthlyRate, totalMonths);
    
    // Future value of SIP
    const futureValueSIP = monthlyInvestment * 
      (Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate;
    
    const totalFutureValue = futureValuePrincipal + futureValueSIP;
    const totalInvestment = principal + (monthlyInvestment * totalMonths);
    const totalReturns = totalFutureValue - totalInvestment;
    
    return {
      totalFutureValue: Math.round(totalFutureValue),
      totalInvestment: Math.round(totalInvestment),
      totalReturns: Math.round(totalReturns),
      returnPercentage: Math.round((totalReturns / totalInvestment) * 100),
      yearlyBreakdown: this.generateInvestmentBreakdown(principal, monthlyInvestment, timeframe, monthlyRate)
    };
  }

  // Helper functions
  static getEmergencyFundRecommendations(targetAmount) {
    return [
      `Keep ₹${Math.round(targetAmount).toLocaleString()} in liquid funds`,
      'Maintain in high-yield savings account or liquid mutual funds',
      'Review and adjust annually based on expense changes'
    ];
  }

  static getRetirementRecommendations(requiredSIP, monthlyIncome) {
    const sipPercentage = (requiredSIP / monthlyIncome) * 100;
    
    if (sipPercentage > 30) {
      return [
        'Required SIP is high - consider extending retirement age',
        'Increase income through skill development',
        'Start with smaller amount and increase annually'
      ];
    } else if (sipPercentage > 20) {
      return [
        'Significant commitment required - start gradually',
        'Consider tax-saving investments for dual benefit',
        'Review and increase SIP annually'
      ];
    } else {
      return [
        'Achievable target - start SIP immediately',
        'Consider increasing SIP with salary increments',
        'Diversify across equity and debt funds'
      ];
    }
  }

  static getHomeLoanRecommendations(maxLoanAmount, monthlyIncome) {
    if (maxLoanAmount < 2000000) {
      return [
        'Consider increasing income before home purchase',
        'Look for properties in affordable locations',
        'Save for higher down payment to reduce EMI'
      ];
    } else if (maxLoanAmount < 5000000) {
      return [
        'Good affordability for mid-range properties',
        'Compare interest rates across lenders',
        'Maintain good credit score for better rates'
      ];
    } else {
      return [
        'Excellent affordability for premium properties',
        'Consider investment properties as well',
        'Negotiate for best interest rates'
      ];
    }
  }

  static getTaxSavingInvestments(remainingDeduction) {
    const investments = [];
    
    if (remainingDeduction >= 150000) {
      investments.push('ELSS Mutual Funds: ₹1,25,000 (₹10,417/month)');
      investments.push('PPF: ₹25,000 (₹2,083/month)');
    } else if (remainingDeduction >= 50000) {
      investments.push(`ELSS Mutual Funds: ₹${remainingDeduction.toLocaleString()}`);
    } else if (remainingDeduction > 0) {
      investments.push(`PPF or ELSS: ₹${remainingDeduction.toLocaleString()}`);
    }
    
    return investments;
  }

  static generateYearlyBreakdown(monthlySIP, timeframe, monthlyRate) {
    const breakdown = [];
    let cumulativeInvestment = 0;
    let cumulativeValue = 0;
    
    for (let year = 1; year <= timeframe; year++) {
      const yearlyInvestment = monthlySIP * 12;
      cumulativeInvestment += yearlyInvestment;
      
      // Calculate value at end of year
      cumulativeValue = (cumulativeValue + yearlyInvestment) * Math.pow(1 + monthlyRate, 12);
      
      breakdown.push({
        year,
        yearlyInvestment: Math.round(yearlyInvestment),
        cumulativeInvestment: Math.round(cumulativeInvestment),
        cumulativeValue: Math.round(cumulativeValue),
        returns: Math.round(cumulativeValue - cumulativeInvestment)
      });
    }
    
    return breakdown;
  }

  static generateInvestmentBreakdown(principal, monthlyInvestment, timeframe, monthlyRate) {
    const breakdown = [];
    let principalValue = principal;
    let sipValue = 0;
    
    for (let year = 1; year <= timeframe; year++) {
      principalValue *= Math.pow(1 + monthlyRate, 12);
      
      const yearlyInvestment = monthlyInvestment * 12;
      sipValue = (sipValue + yearlyInvestment) * Math.pow(1 + monthlyRate, 12);
      
      breakdown.push({
        year,
        principalValue: Math.round(principalValue),
        sipValue: Math.round(sipValue),
        totalValue: Math.round(principalValue + sipValue)
      });
    }
    
    return breakdown;
  }
}

export default FinancialCalculators;
