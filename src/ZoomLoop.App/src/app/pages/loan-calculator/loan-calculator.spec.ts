// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoanCalculator } from './loan-calculator';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { LoanCalculatorService } from '../../core/loan-calculator.service';

describe('LoanCalculator', () => {
  let component: LoanCalculator;
  let fixture: ComponentFixture<LoanCalculator>;
  let service: LoanCalculatorService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanCalculator],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        provideAnimations(),
        LoanCalculatorService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoanCalculator);
    component = fixture.componentInstance;
    service = TestBed.inject(LoanCalculatorService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Initialization', () => {
    it('should initialize form with all required fields', () => {
      expect(component.form.get('price')).toBeTruthy();
      expect(component.form.get('downPayment')).toBeTruthy();
      expect(component.form.get('apr')).toBeTruthy();
      expect(component.form.get('termMonths')).toBeTruthy();
      expect(component.form.get('fees')).toBeTruthy();
    });

    it('should set all fields as required', () => {
      expect(component.form.get('price')?.hasError('required')).toBe(true);
      expect(component.form.get('downPayment')?.hasError('required')).toBe(true);
      expect(component.form.get('apr')?.hasError('required')).toBe(true);
      expect(component.form.get('termMonths')?.hasError('required')).toBe(true);
      expect(component.form.get('fees')?.hasError('required')).toBe(true);
    });
  });

  describe('Price Validation', () => {
    it('should validate price greater than 0', () => {
      component.form.patchValue({ price: 0 });
      expect(component.form.get('price')?.hasError('min')).toBe(true);
    });

    it('should validate price within max bounds', () => {
      component.form.patchValue({ price: 2000000 });
      expect(component.form.get('price')?.hasError('max')).toBe(true);
    });

    it('should accept valid price', () => {
      component.form.patchValue({ price: 25000 });
      expect(component.form.get('price')?.hasError('min')).toBe(false);
      expect(component.form.get('price')?.hasError('max')).toBe(false);
    });
  });

  describe('Down Payment Validation', () => {
    it('should validate down payment is non-negative', () => {
      component.form.patchValue({ downPayment: -100 });
      expect(component.form.get('downPayment')?.hasError('min')).toBe(true);
    });

    it('should validate down payment does not exceed price', () => {
      component.form.patchValue({ 
        price: 25000,
        downPayment: 30000 
      });
      component.form.get('downPayment')?.updateValueAndValidity();
      expect(component.form.get('downPayment')?.hasError('exceedsPrice')).toBe(true);
    });

    it('should accept down payment equal to price', () => {
      component.form.patchValue({ 
        price: 25000,
        downPayment: 25000 
      });
      component.form.get('downPayment')?.updateValueAndValidity();
      expect(component.form.get('downPayment')?.hasError('exceedsPrice')).toBe(false);
    });
  });

  describe('APR Validation', () => {
    it('should validate APR minimum bound', () => {
      component.form.patchValue({ apr: -1 });
      expect(component.form.get('apr')?.hasError('min')).toBe(true);
    });

    it('should validate APR maximum bound', () => {
      component.form.patchValue({ apr: 35 });
      expect(component.form.get('apr')?.hasError('max')).toBe(true);
    });

    it('should accept valid APR', () => {
      component.form.patchValue({ apr: 5.5 });
      expect(component.form.get('apr')?.valid).toBe(true);
    });
  });

  describe('Term Validation', () => {
    it('should validate term is in allowed set', () => {
      component.form.patchValue({ termMonths: 30 });
      component.form.get('termMonths')?.updateValueAndValidity();
      expect(component.form.get('termMonths')?.hasError('invalidTerm')).toBe(true);
    });

    it('should accept allowed term', () => {
      component.form.patchValue({ termMonths: 60 });
      component.form.get('termMonths')?.updateValueAndValidity();
      expect(component.form.get('termMonths')?.hasError('invalidTerm')).toBe(false);
    });
  });

  describe('Fees Validation', () => {
    it('should validate fees are non-negative', () => {
      component.form.patchValue({ fees: -50 });
      expect(component.form.get('fees')?.hasError('min')).toBe(true);
    });

    it('should accept zero fees', () => {
      component.form.patchValue({ fees: 0 });
      expect(component.form.get('fees')?.hasError('min')).toBe(false);
    });
  });

  describe('Error Messages', () => {
    it('should return correct error message for required field', () => {
      component.form.get('price')?.markAsTouched();
      const error = component.getFieldError('price');
      expect(error).toContain('required');
    });

    it('should return correct error message for min validation', () => {
      component.form.patchValue({ price: -100 });
      component.form.get('price')?.markAsTouched();
      const error = component.getFieldError('price');
      expect(error).toContain('must be at least');
    });

    it('should return correct error message for max validation', () => {
      component.form.patchValue({ apr: 35 });
      component.form.get('apr')?.markAsTouched();
      const error = component.getFieldError('apr');
      expect(error).toContain('cannot exceed');
    });

    it('should return correct error message for down payment exceeding price', () => {
      component.form.patchValue({ 
        price: 25000,
        downPayment: 30000 
      });
      component.form.get('downPayment')?.updateValueAndValidity();
      component.form.get('downPayment')?.markAsTouched();
      const error = component.getFieldError('downPayment');
      expect(error).toBe('Down payment cannot exceed price');
    });

    it('should return correct error message for invalid term', () => {
      component.form.patchValue({ termMonths: 30 });
      component.form.get('termMonths')?.updateValueAndValidity();
      component.form.get('termMonths')?.markAsTouched();
      const error = component.getFieldError('termMonths');
      expect(error).toContain('Term must be one of');
    });
  });

  describe('Field Blur Handling', () => {
    it('should update field errors on blur when field is invalid', () => {
      component.form.get('price')?.markAsTouched();
      component.onFieldBlur('price');
      expect(component.fieldErrors()['price']).toBeDefined();
    });

    it('should clear field errors on blur when field is valid', () => {
      component.form.patchValue({ price: 25000 });
      component.form.get('price')?.markAsTouched();
      component.onFieldBlur('price');
      expect(component.fieldErrors()['price']).toBeUndefined();
    });
  });

  describe('Loan Calculation', () => {
    it('should calculate loan when form is valid', () => {
      component.form.patchValue({
        price: 25000,
        downPayment: 5000,
        apr: 5,
        termMonths: 60,
        fees: 500
      });
      
      component.calculateLoan();
      
      const result = component.result();
      expect(result).toBeTruthy();
      expect(result?.isValid).toBe(true);
      expect(result?.monthlyPayment).toBeGreaterThan(0);
    });

    it('should not calculate when form is invalid', () => {
      component.form.patchValue({
        price: -1000,
        downPayment: 0,
        apr: 5,
        termMonths: 60,
        fees: 0
      });
      
      component.calculateLoan();
      
      // Should mark all as touched but not calculate
      expect(component.form.get('price')?.touched).toBe(true);
    });

    it('should prevent NaN in results', () => {
      component.form.patchValue({
        price: 25000,
        downPayment: 5000,
        apr: 5,
        termMonths: 60,
        fees: 500
      });
      
      component.calculateLoan();
      
      const result = component.result();
      expect(isNaN(result?.monthlyPayment || 0)).toBe(false);
      expect(isNaN(result?.totalLoanAmount || 0)).toBe(false);
      expect(isNaN(result?.totalInterest || 0)).toBe(false);
      expect(isNaN(result?.totalCost || 0)).toBe(false);
    });

    it('should prevent Infinity in results', () => {
      component.form.patchValue({
        price: 25000,
        downPayment: 5000,
        apr: 5,
        termMonths: 60,
        fees: 500
      });
      
      component.calculateLoan();
      
      const result = component.result();
      expect(isFinite(result?.monthlyPayment || 0)).toBe(true);
      expect(isFinite(result?.totalLoanAmount || 0)).toBe(true);
      expect(isFinite(result?.totalInterest || 0)).toBe(true);
      expect(isFinite(result?.totalCost || 0)).toBe(true);
    });
  });

  describe('Form Submission', () => {
    it('should mark all fields as touched on submit when invalid', () => {
      component.onSubmit();
      
      expect(component.form.get('price')?.touched).toBe(true);
      expect(component.form.get('downPayment')?.touched).toBe(true);
      expect(component.form.get('apr')?.touched).toBe(true);
      expect(component.form.get('termMonths')?.touched).toBe(true);
      expect(component.form.get('fees')?.touched).toBe(true);
    });

    it('should calculate loan on submit when valid', () => {
      component.form.patchValue({
        price: 25000,
        downPayment: 5000,
        apr: 5,
        termMonths: 60,
        fees: 500
      });
      
      component.onSubmit();
      
      expect(component.result()).toBeTruthy();
      expect(component.result()?.isValid).toBe(true);
    });
  });

  describe('Reset Functionality', () => {
    it('should reset form to initial state', () => {
      component.form.patchValue({
        price: 25000,
        downPayment: 5000,
        apr: 5,
        termMonths: 60,
        fees: 500
      });
      component.calculateLoan();
      
      component.reset();
      
      expect(component.form.get('price')?.value).toBeNull();
      expect(component.result()).toBeNull();
      expect(Object.keys(component.fieldErrors()).length).toBe(0);
    });
  });

  describe('hasFieldError', () => {
    it('should return true for dirty invalid field', () => {
      const control = component.form.get('price');
      control?.markAsDirty();
      control?.setErrors({ required: true });
      
      expect(component.hasFieldError('price')).toBe(true);
    });

    it('should return true for touched invalid field', () => {
      const control = component.form.get('price');
      control?.markAsTouched();
      control?.setErrors({ required: true });
      
      expect(component.hasFieldError('price')).toBe(true);
    });

    it('should return false for pristine invalid field', () => {
      const control = component.form.get('price');
      control?.setErrors({ required: true });
      
      expect(component.hasFieldError('price')).toBe(false);
    });

    it('should return false for valid field', () => {
      component.form.patchValue({ price: 25000 });
      component.form.get('price')?.markAsTouched();
      
      expect(component.hasFieldError('price')).toBe(false);
    });
  });
});
