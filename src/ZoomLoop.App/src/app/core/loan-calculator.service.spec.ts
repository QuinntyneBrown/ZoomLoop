// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { describe, it, expect, beforeEach } from 'vitest';
import { LoanCalculatorService, LoanCalculationInput } from './loan-calculator.service';

describe('LoanCalculatorService', () => {
  let service: LoanCalculatorService;

  beforeEach(() => {
    service = new LoanCalculatorService();
  });

  describe('validateInput', () => {
    it('should validate price greater than 0', () => {
      const input: LoanCalculationInput = {
        price: 0,
        downPayment: 0,
        apr: 5,
        termMonths: 60,
        fees: 0
      };

      const result = service.validateInput(input);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Price must be greater than 0');
    });

    it('should validate price is a valid number', () => {
      const input: LoanCalculationInput = {
        price: NaN,
        downPayment: 0,
        apr: 5,
        termMonths: 60,
        fees: 0
      };

      const result = service.validateInput(input);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Price must be a valid number');
    });

    it('should validate APR within configured bounds', () => {
      const input: LoanCalculationInput = {
        price: 25000,
        downPayment: 5000,
        apr: 35,
        termMonths: 60,
        fees: 500
      };

      const result = service.validateInput(input);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('APR cannot exceed'))).toBe(true);
    });

    it('should validate APR minimum bound', () => {
      const input: LoanCalculationInput = {
        price: 25000,
        downPayment: 5000,
        apr: -1,
        termMonths: 60,
        fees: 500
      };

      const result = service.validateInput(input);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('APR must be at least'))).toBe(true);
    });

    it('should validate term is in allowed set', () => {
      const input: LoanCalculationInput = {
        price: 25000,
        downPayment: 5000,
        apr: 5,
        termMonths: 30,
        fees: 500
      };

      const result = service.validateInput(input);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('Term must be one of'))).toBe(true);
    });

    it('should validate down payment does not exceed price', () => {
      const input: LoanCalculationInput = {
        price: 25000,
        downPayment: 30000,
        apr: 5,
        termMonths: 60,
        fees: 500
      };

      const result = service.validateInput(input);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Down payment cannot exceed price');
    });

    it('should validate fees are non-negative', () => {
      const input: LoanCalculationInput = {
        price: 25000,
        downPayment: 5000,
        apr: 5,
        termMonths: 60,
        fees: -100
      };

      const result = service.validateInput(input);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('Fees must be at least'))).toBe(true);
    });

    it('should pass validation with valid inputs', () => {
      const input: LoanCalculationInput = {
        price: 25000,
        downPayment: 5000,
        apr: 5,
        termMonths: 60,
        fees: 500
      };

      const result = service.validateInput(input);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should handle multiple validation errors', () => {
      const input: LoanCalculationInput = {
        price: -1,
        downPayment: -100,
        apr: -5,
        termMonths: 13,
        fees: -50
      };

      const result = service.validateInput(input);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
    });
  });

  describe('calculate', () => {
    it('should calculate monthly payment correctly', () => {
      const input: LoanCalculationInput = {
        price: 25000,
        downPayment: 5000,
        apr: 6,
        termMonths: 60,
        fees: 500
      };

      const result = service.calculate(input);
      expect(result.isValid).toBe(true);
      expect(result.monthlyPayment).toBeGreaterThan(0);
      expect(result.totalLoanAmount).toBe(20500); // 25000 - 5000 + 500
    });

    it('should handle zero APR correctly', () => {
      const input: LoanCalculationInput = {
        price: 24000,
        downPayment: 0,
        apr: 0,
        termMonths: 48,
        fees: 0
      };

      const result = service.calculate(input);
      expect(result.isValid).toBe(true);
      expect(result.monthlyPayment).toBe(500); // 24000 / 48
      expect(result.totalInterest).toBe(0);
    });

    it('should prevent NaN outputs', () => {
      const input: LoanCalculationInput = {
        price: NaN,
        downPayment: 0,
        apr: 5,
        termMonths: 60,
        fees: 0
      };

      const result = service.calculate(input);
      expect(result.isValid).toBe(false);
      expect(result.monthlyPayment).toBe(0);
      expect(isNaN(result.monthlyPayment)).toBe(false);
    });

    it('should prevent Infinity outputs', () => {
      const input: LoanCalculationInput = {
        price: Infinity,
        downPayment: 0,
        apr: 5,
        termMonths: 60,
        fees: 0
      };

      const result = service.calculate(input);
      expect(result.isValid).toBe(false);
      expect(result.monthlyPayment).toBe(0);
      expect(isFinite(result.monthlyPayment)).toBe(true);
    });

    it('should return error for invalid inputs', () => {
      const input: LoanCalculationInput = {
        price: -1000,
        downPayment: 0,
        apr: 5,
        termMonths: 60,
        fees: 0
      };

      const result = service.calculate(input);
      expect(result.isValid).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error!.length).toBeGreaterThan(0);
    });

    it('should calculate total interest correctly', () => {
      const input: LoanCalculationInput = {
        price: 20000,
        downPayment: 0,
        apr: 5,
        termMonths: 60,
        fees: 0
      };

      const result = service.calculate(input);
      expect(result.isValid).toBe(true);
      expect(result.totalInterest).toBeGreaterThan(0);
      expect(result.totalCost).toBe(result.totalLoanAmount + result.totalInterest);
    });

    it('should round results to two decimal places', () => {
      const input: LoanCalculationInput = {
        price: 25333.33,
        downPayment: 5000.50,
        apr: 5.75,
        termMonths: 60,
        fees: 499.99
      };

      const result = service.calculate(input);
      expect(result.isValid).toBe(true);
      // Check that values have at most 2 decimal places (allow for floating point precision errors)
      expect(Math.abs(result.monthlyPayment - Math.round(result.monthlyPayment * 100) / 100)).toBeLessThan(0.001);
      expect(Math.abs(result.totalLoanAmount - Math.round(result.totalLoanAmount * 100) / 100)).toBeLessThan(0.001);
    });
  });

  describe('setConfig and getConfig', () => {
    it('should allow custom configuration', () => {
      service.setConfig({
        minAPR: 2,
        maxAPR: 15,
        allowedTerms: [24, 36, 48]
      });

      const config = service.getConfig();
      expect(config.minAPR).toBe(2);
      expect(config.maxAPR).toBe(15);
      expect(config.allowedTerms).toEqual([24, 36, 48]);
    });

    it('should validate against custom configuration', () => {
      service.setConfig({
        maxAPR: 10
      });

      const input: LoanCalculationInput = {
        price: 25000,
        downPayment: 5000,
        apr: 12,
        termMonths: 60,
        fees: 500
      };

      const result = service.validateInput(input);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('10'))).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should handle very large valid numbers', () => {
      const input: LoanCalculationInput = {
        price: 999999,
        downPayment: 100000,
        apr: 5,
        termMonths: 84,
        fees: 5000
      };

      const result = service.calculate(input);
      expect(result.isValid).toBe(true);
      expect(isFinite(result.monthlyPayment)).toBe(true);
    });

    it('should handle very small APR', () => {
      const input: LoanCalculationInput = {
        price: 25000,
        downPayment: 5000,
        apr: 0.01,
        termMonths: 60,
        fees: 500
      };

      const result = service.calculate(input);
      expect(result.isValid).toBe(true);
      expect(result.monthlyPayment).toBeGreaterThan(0);
    });

    it('should handle maximum down payment equal to price', () => {
      const input: LoanCalculationInput = {
        price: 25000,
        downPayment: 25000,
        apr: 5,
        termMonths: 60,
        fees: 0
      };

      const result = service.calculate(input);
      expect(result.isValid).toBe(true);
      expect(result.totalLoanAmount).toBe(0);
      expect(result.monthlyPayment).toBe(0);
    });
  });
});
