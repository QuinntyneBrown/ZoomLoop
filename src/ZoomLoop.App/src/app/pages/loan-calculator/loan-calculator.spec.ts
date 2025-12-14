// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoanCalculator } from './loan-calculator';
import { DebugElement } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';

describe('LoanCalculator', () => {
  let component: LoanCalculator;
  let fixture: ComponentFixture<LoanCalculator>;
  let compiled: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanCalculator],
      providers: [provideAnimations()]
    }).compileComponents();

    fixture = TestBed.createComponent(LoanCalculator);
    component = fixture.componentInstance;
    compiled = fixture.debugElement;
    fixture.detectChanges();
  });

  describe('Initialization', () => {
    it('should create the loan calculator component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize the form', () => {
      expect(component.form).toBeTruthy();
    });

    it('should have default form values', () => {
      expect(component.form.value.price).toBe('');
      expect(component.form.value.downPayment).toBe(0);
      expect(component.form.value.tradeInValue).toBe(0);
      expect(component.form.value.interestRate).toBe(7.99);
      expect(component.form.value.termMonths).toBe(60);
      expect(component.form.value.taxRate).toBe(7.0);
      expect(component.form.value.fees).toBe(0);
    });

    it('should initialize result signals as null', () => {
      expect(component.monthlyPayment()).toBeNull();
      expect(component.totalInterest()).toBeNull();
      expect(component.totalPayment()).toBeNull();
    });

    it('should have term options defined', () => {
      expect(component.termOptions.length).toBeGreaterThan(0);
      expect(component.termOptions).toContain(60);
    });

    it('should have default tax rate', () => {
      expect(component.defaultTaxRate).toBe(7.0);
    });
  });

  describe('Form Validation', () => {
    it('should be invalid when price is empty', () => {
      expect(component.form.valid).toBe(false);
    });

    it('should require vehicle price', () => {
      const priceControl = component.form.get('price');
      expect(priceControl?.hasError('required')).toBe(true);

      priceControl?.setValue(25000);
      expect(priceControl?.hasError('required')).toBe(false);
    });

    it('should validate price is greater than 0', () => {
      const priceControl = component.form.get('price');

      priceControl?.setValue(0);
      expect(priceControl?.hasError('min')).toBe(true);

      priceControl?.setValue(-100);
      expect(priceControl?.hasError('min')).toBe(true);

      priceControl?.setValue(25000);
      expect(priceControl?.hasError('min')).toBe(false);
    });

    it('should require interest rate', () => {
      const rateControl = component.form.get('interestRate');
      rateControl?.setValue(null);
      expect(rateControl?.hasError('required')).toBe(true);

      rateControl?.setValue(7.99);
      expect(rateControl?.hasError('required')).toBe(false);
    });

    it('should validate interest rate range (0-100)', () => {
      const rateControl = component.form.get('interestRate');

      rateControl?.setValue(-1);
      expect(rateControl?.hasError('min')).toBe(true);

      rateControl?.setValue(101);
      expect(rateControl?.hasError('max')).toBe(true);

      rateControl?.setValue(7.99);
      expect(rateControl?.hasError('min')).toBe(false);
      expect(rateControl?.hasError('max')).toBe(false);
    });

    it('should require loan term', () => {
      const termControl = component.form.get('termMonths');
      termControl?.setValue(null);
      expect(termControl?.hasError('required')).toBe(true);

      termControl?.setValue(60);
      expect(termControl?.hasError('required')).toBe(false);
    });

    it('should validate down payment is not negative', () => {
      const downPaymentControl = component.form.get('downPayment');

      // When setting to negative, it gets clamped to 0 by validateDownPayment
      // So we just verify that the value is clamped rather than checking the validator
      downPaymentControl?.setValue(-100);
      expect(downPaymentControl?.value).toBe(0);

      downPaymentControl?.setValue(0);
      expect(downPaymentControl?.hasError('min')).toBe(false);
    });

    it('should validate tax rate range (0-100)', () => {
      const taxControl = component.form.get('taxRate');

      taxControl?.setValue(-1);
      expect(taxControl?.hasError('min')).toBe(true);

      taxControl?.setValue(101);
      expect(taxControl?.hasError('max')).toBe(true);

      taxControl?.setValue(7.0);
      expect(taxControl?.hasError('min')).toBe(false);
      expect(taxControl?.hasError('max')).toBe(false);
    });

    it('should validate fees are not negative', () => {
      const feesControl = component.form.get('fees');

      feesControl?.setValue(-100);
      expect(feesControl?.hasError('min')).toBe(true);

      feesControl?.setValue(0);
      expect(feesControl?.hasError('min')).toBe(false);
    });

    it('should be valid with all required fields filled', () => {
      component.form.patchValue({
        price: 25000,
        interestRate: 7.99,
        termMonths: 60
      });

      expect(component.form.valid).toBe(true);
    });
  });

  describe('Down Payment Clamping', () => {
    it('should clamp down payment to price when it exceeds price', () => {
      component.form.patchValue({
        price: 25000,
        downPayment: 30000
      });

      component.clampDownPayment();

      expect(component.form.get('downPayment')?.value).toBe(25000);
    });

    it('should clamp down payment to 0 when negative', () => {
      component.form.patchValue({
        price: 25000,
        downPayment: -1000
      });

      component.clampDownPayment();

      expect(component.form.get('downPayment')?.value).toBe(0);
    });

    it('should allow down payment between 0 and price', () => {
      component.form.patchValue({
        price: 25000,
        downPayment: 5000
      });

      component.clampDownPayment();

      expect(component.form.get('downPayment')?.value).toBe(5000);
    });
  });

  describe('Trade-in Value', () => {
    it('should allow negative trade-in value for negative equity', () => {
      const tradeInControl = component.form.get('tradeInValue');

      tradeInControl?.setValue(-3000);
      expect(tradeInControl?.valid).toBe(true);
      expect(tradeInControl?.value).toBe(-3000);
    });

    it('should allow positive trade-in value', () => {
      const tradeInControl = component.form.get('tradeInValue');

      tradeInControl?.setValue(5000);
      expect(tradeInControl?.valid).toBe(true);
      expect(tradeInControl?.value).toBe(5000);
    });

    it('should allow zero trade-in value', () => {
      const tradeInControl = component.form.get('tradeInValue');

      tradeInControl?.setValue(0);
      expect(tradeInControl?.valid).toBe(true);
      expect(tradeInControl?.value).toBe(0);
    });
  });

  describe('Payment Calculation', () => {
    it('should not calculate payment when form is invalid', () => {
      component.form.patchValue({
        price: '', // Invalid - required
        interestRate: 7.99,
        termMonths: 60
      });

      component.calculatePayment();

      expect(component.monthlyPayment()).toBeNull();
      expect(component.totalInterest()).toBeNull();
      expect(component.totalPayment()).toBeNull();
    });

    it('should calculate payment with valid inputs', () => {
      component.form.patchValue({
        price: 25000,
        downPayment: 5000,
        tradeInValue: 0,
        interestRate: 7.99,
        termMonths: 60,
        taxRate: 7.0,
        fees: 500
      });

      component.calculatePayment();

      expect(component.monthlyPayment()).not.toBeNull();
      expect(component.monthlyPayment()!).toBeGreaterThan(0);
      expect(component.totalInterest()).not.toBeNull();
      expect(component.totalPayment()).not.toBeNull();
    });

    it('should calculate correctly with zero interest rate', () => {
      component.form.patchValue({
        price: 24000,
        downPayment: 0,
        tradeInValue: 0,
        interestRate: 0,
        termMonths: 60,
        taxRate: 0,
        fees: 0
      });

      component.calculatePayment();

      // With 0% interest, monthly payment should be principal / months
      expect(component.monthlyPayment()).toBe(400); // 24000 / 60
      expect(component.totalInterest()).toBe(0);
      expect(component.totalPayment()).toBe(24000);
    });

    it('should include negative equity in loan amount', () => {
      component.form.patchValue({
        price: 25000,
        downPayment: 0,
        tradeInValue: -3000, // Negative equity
        interestRate: 0,
        termMonths: 60,
        taxRate: 0,
        fees: 0
      });

      component.calculatePayment();

      // Principal should be price - negative equity = 25000 + 3000 = 28000
      // Monthly payment = 28000 / 60
      expect(component.monthlyPayment()).toBeCloseTo(466.67, 1);
    });

    it('should include taxes and fees in principal', () => {
      component.form.patchValue({
        price: 20000,
        downPayment: 0,
        tradeInValue: 0,
        interestRate: 0,
        termMonths: 60,
        taxRate: 10, // 10% = $2000
        fees: 500
      });

      component.calculatePayment();

      // Principal = 20000 + 2000 (tax) + 500 (fees) = 22500
      // Monthly payment = 22500 / 60
      expect(component.monthlyPayment()).toBe(375);
    });

    it('should result in zero payment when down payment and trade-in cover full cost', () => {
      component.form.patchValue({
        price: 20000,
        downPayment: 15000,
        tradeInValue: 5000,
        interestRate: 0,
        termMonths: 60,
        taxRate: 0,
        fees: 0
      });

      component.calculatePayment();

      expect(component.monthlyPayment()).toBe(0);
      expect(component.totalInterest()).toBe(0);
      expect(component.totalPayment()).toBe(0);
    });
  });

  describe('Reset Functionality', () => {
    it('should reset form to default values', () => {
      component.form.patchValue({
        price: 30000,
        downPayment: 5000,
        tradeInValue: 2000,
        interestRate: 10.5,
        termMonths: 72,
        taxRate: 8.5,
        fees: 1000
      });

      component.reset();

      expect(component.form.value.price).toBe('');
      expect(component.form.value.downPayment).toBe(0);
      expect(component.form.value.tradeInValue).toBe(0);
      expect(component.form.value.interestRate).toBe(7.99);
      expect(component.form.value.termMonths).toBe(60);
      expect(component.form.value.taxRate).toBe(7.0);
      expect(component.form.value.fees).toBe(0);
    });

    it('should clear calculation results on reset', () => {
      component.form.patchValue({
        price: 25000,
        interestRate: 7.99,
        termMonths: 60
      });

      component.calculatePayment();
      expect(component.monthlyPayment()).not.toBeNull();

      component.reset();

      expect(component.monthlyPayment()).toBeNull();
      expect(component.totalInterest()).toBeNull();
      expect(component.totalPayment()).toBeNull();
    });
  });
});
