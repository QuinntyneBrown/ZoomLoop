// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Injectable } from '@angular/core';

export interface LoanCalculationInput {
  price: number;
  downPayment: number;
  apr: number;
  termMonths: number;
  fees: number;
}

export interface LoanCalculationResult {
  monthlyPayment: number;
  totalLoanAmount: number;
  totalInterest: number;
  totalCost: number;
  isValid: boolean;
  error?: string;
}

export interface LoanValidationConfig {
  minPrice: number;
  maxPrice: number;
  minAPR: number;
  maxAPR: number;
  allowedTerms: number[];
  minDownPayment: number;
  minFees: number;
}

@Injectable({
  providedIn: 'root'
})
export class LoanCalculatorService {
  private readonly defaultConfig: LoanValidationConfig = {
    minPrice: 0.01,
    maxPrice: 1000000,
    minAPR: 0,
    maxAPR: 30,
    allowedTerms: [12, 24, 36, 48, 60, 72, 84],
    minDownPayment: 0,
    minFees: 0
  };

  private config: LoanValidationConfig = this.defaultConfig;

  setConfig(config: Partial<LoanValidationConfig>): void {
    this.config = { ...this.defaultConfig, ...config };
  }

  getConfig(): LoanValidationConfig {
    return { ...this.config };
  }

  validateInput(input: LoanCalculationInput): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validate price
    if (!this.isValidNumber(input.price)) {
      errors.push('Price must be a valid number');
    } else if (input.price <= 0) {
      errors.push('Price must be greater than 0');
    } else if (input.price < this.config.minPrice) {
      errors.push(`Price must be at least ${this.config.minPrice}`);
    } else if (input.price > this.config.maxPrice) {
      errors.push(`Price cannot exceed ${this.config.maxPrice}`);
    }

    // Validate down payment
    if (!this.isValidNumber(input.downPayment)) {
      errors.push('Down payment must be a valid number');
    } else if (input.downPayment < this.config.minDownPayment) {
      errors.push(`Down payment must be at least ${this.config.minDownPayment}`);
    } else if (this.isValidNumber(input.price) && input.downPayment > input.price) {
      errors.push('Down payment cannot exceed price');
    }

    // Validate APR
    if (!this.isValidNumber(input.apr)) {
      errors.push('APR must be a valid number');
    } else if (input.apr < this.config.minAPR) {
      errors.push(`APR must be at least ${this.config.minAPR}%`);
    } else if (input.apr > this.config.maxAPR) {
      errors.push(`APR cannot exceed ${this.config.maxAPR}%`);
    }

    // Validate term
    if (!this.isValidNumber(input.termMonths)) {
      errors.push('Term must be a valid number');
    } else if (!this.config.allowedTerms.includes(input.termMonths)) {
      errors.push(`Term must be one of: ${this.config.allowedTerms.join(', ')} months`);
    }

    // Validate fees
    if (!this.isValidNumber(input.fees)) {
      errors.push('Fees must be a valid number');
    } else if (input.fees < this.config.minFees) {
      errors.push(`Fees must be at least ${this.config.minFees}`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  calculate(input: LoanCalculationInput): LoanCalculationResult {
    const validation = this.validateInput(input);
    
    if (!validation.isValid) {
      return {
        monthlyPayment: 0,
        totalLoanAmount: 0,
        totalInterest: 0,
        totalCost: 0,
        isValid: false,
        error: validation.errors.join('; ')
      };
    }

    try {
      const principal = input.price - input.downPayment + input.fees;
      
      // Handle zero interest case
      if (input.apr === 0) {
        const monthlyPayment = principal / input.termMonths;
        return {
          monthlyPayment: this.roundToTwoDecimals(monthlyPayment),
          totalLoanAmount: this.roundToTwoDecimals(principal),
          totalInterest: 0,
          totalCost: this.roundToTwoDecimals(principal + input.downPayment),
          isValid: true
        };
      }

      // Convert APR to monthly interest rate
      const monthlyRate = input.apr / 100 / 12;
      
      // Calculate monthly payment using amortization formula
      // M = P * [r(1+r)^n] / [(1+r)^n - 1]
      const rateMultiplier = Math.pow(1 + monthlyRate, input.termMonths);
      const monthlyPayment = principal * (monthlyRate * rateMultiplier) / (rateMultiplier - 1);
      
      // Check for invalid results
      if (!this.isValidNumber(monthlyPayment) || monthlyPayment === Infinity) {
        return {
          monthlyPayment: 0,
          totalLoanAmount: 0,
          totalInterest: 0,
          totalCost: 0,
          isValid: false,
          error: 'Unable to calculate monthly payment with provided values'
        };
      }

      const totalPaid = monthlyPayment * input.termMonths;
      const totalInterest = totalPaid - principal;

      return {
        monthlyPayment: this.roundToTwoDecimals(monthlyPayment),
        totalLoanAmount: this.roundToTwoDecimals(principal),
        totalInterest: this.roundToTwoDecimals(totalInterest),
        totalCost: this.roundToTwoDecimals(totalPaid + input.downPayment),
        isValid: true
      };
    } catch {
      return {
        monthlyPayment: 0,
        totalLoanAmount: 0,
        totalInterest: 0,
        totalCost: 0,
        isValid: false,
        error: 'Calculation error occurred'
      };
    }
  }

  private isValidNumber(value: number): boolean {
    return typeof value === 'number' && 
           isFinite(value) && 
           !isNaN(value);
  }

  private roundToTwoDecimals(value: number): number {
    return Math.round(value * 100) / 100;
  }
}
