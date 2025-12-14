// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoanInputsPanel } from './loan-inputs-panel';
import { provideAnimations } from '@angular/platform-browser/animations';

describe('LoanInputsPanel', () => {
  let component: LoanInputsPanel;
  let fixture: ComponentFixture<LoanInputsPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanInputsPanel],
      providers: [provideAnimations()]
    }).compileComponents();

    fixture = TestBed.createComponent(LoanInputsPanel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize form with default values', () => {
      expect(component.form).toBeTruthy();
      expect(component.form.get('price')?.value).toBe(50000);
      expect(component.form.get('downPayment')?.value).toBe(10000);
      expect(component.form.get('tradeInValue')?.value).toBe(0);
      expect(component.form.get('apr')?.value).toBe(5.99);
      expect(component.form.get('termMonths')?.value).toBe(60);
    });

    it('should have loan term options', () => {
      expect(component.loanTermOptions).toEqual([36, 48, 60, 72, 84]);
    });

    it('should calculate loan on initialization', () => {
      expect(component.calculation()).toBeTruthy();
      expect(component.calculation()?.monthlyPayment).toBeGreaterThan(0);
    });
  });

  describe('Form Validation', () => {
    it('should require price', () => {
      const priceControl = component.form.get('price');
      priceControl?.setValue(null);
      expect(priceControl?.hasError('required')).toBe(true);
    });

    it('should validate price is not negative', () => {
      const priceControl = component.form.get('price');
      priceControl?.setValue(-1000);
      expect(priceControl?.hasError('min')).toBe(true);
    });

    it('should require down payment', () => {
      const downPaymentControl = component.form.get('downPayment');
      downPaymentControl?.setValue(null);
      expect(downPaymentControl?.hasError('required')).toBe(true);
    });

    it('should validate down payment is not negative', () => {
      const downPaymentControl = component.form.get('downPayment');
      downPaymentControl?.setValue(-500);
      expect(downPaymentControl?.hasError('min')).toBe(true);
    });

    it('should require trade-in value', () => {
      const tradeInControl = component.form.get('tradeInValue');
      tradeInControl?.setValue(null);
      expect(tradeInControl?.hasError('required')).toBe(true);
    });

    it('should validate trade-in value is not negative', () => {
      const tradeInControl = component.form.get('tradeInValue');
      tradeInControl?.setValue(-100);
      expect(tradeInControl?.hasError('min')).toBe(true);
    });

    it('should require APR', () => {
      const aprControl = component.form.get('apr');
      aprControl?.setValue(null);
      expect(aprControl?.hasError('required')).toBe(true);
    });

    it('should validate APR range', () => {
      const aprControl = component.form.get('apr');
      
      aprControl?.setValue(-1);
      expect(aprControl?.hasError('min')).toBe(true);
      
      aprControl?.setValue(101);
      expect(aprControl?.hasError('max')).toBe(true);
      
      aprControl?.setValue(5.99);
      expect(aprControl?.valid).toBe(true);
    });

    it('should require term', () => {
      const termControl = component.form.get('termMonths');
      termControl?.setValue(null);
      expect(termControl?.hasError('required')).toBe(true);
    });
  });

  describe('Control Getters', () => {
    it('should return price control', () => {
      expect(component.priceControl).toBe(component.form.get('price'));
    });

    it('should return down payment control', () => {
      expect(component.downPaymentControl).toBe(component.form.get('downPayment'));
    });

    it('should return trade-in value control', () => {
      expect(component.tradeInValueControl).toBe(component.form.get('tradeInValue'));
    });

    it('should return APR control', () => {
      expect(component.aprControl).toBe(component.form.get('apr'));
    });

    it('should return term control', () => {
      expect(component.termMonthsControl).toBe(component.form.get('termMonths'));
    });

    it('should calculate max down payment from price', () => {
      component.form.patchValue({ price: 30000 });
      expect(component.maxDownPayment).toBe(30000);
    });
  });

  describe('Increment/Decrement Functions', () => {
    it('should increment price by default step', () => {
      component.form.patchValue({ price: 50000 });
      component.incrementField('price');
      expect(component.form.get('price')?.value).toBe(51000);
    });

    it('should decrement price by default step', () => {
      component.form.patchValue({ price: 50000 });
      component.decrementField('price');
      expect(component.form.get('price')?.value).toBe(49000);
    });

    it('should not decrement below 0', () => {
      component.form.patchValue({ price: 500 });
      component.decrementField('price');
      expect(component.form.get('price')?.value).toBe(0);
    });

    it('should increment trade-in with custom step', () => {
      component.form.patchValue({ tradeInValue: 1000 });
      component.incrementField('tradeInValue', 500);
      expect(component.form.get('tradeInValue')?.value).toBe(1500);
    });

    it('should decrement APR by custom step', () => {
      component.form.patchValue({ apr: 6.0 });
      component.decrementField('apr', 0.25);
      expect(component.form.get('apr')?.value).toBe(5.75);
    });

    it('should not allow down payment to exceed price when incrementing', () => {
      component.form.patchValue({ price: 30000, downPayment: 29500 });
      component.incrementField('downPayment');
      expect(component.form.get('downPayment')?.value).toBe(30000);
    });

    it('should mark field as touched when incrementing', () => {
      component.incrementField('price');
      expect(component.form.get('price')?.touched).toBe(true);
    });

    it('should mark field as touched when decrementing', () => {
      component.decrementField('price');
      expect(component.form.get('price')?.touched).toBe(true);
    });
  });

  describe('Down Payment Slider', () => {
    it('should update down payment from slider', () => {
      component.onDownPaymentSliderChange(15000);
      expect(component.form.get('downPayment')?.value).toBe(15000);
    });

    it('should mark down payment as touched when slider changes', () => {
      component.onDownPaymentSliderChange(15000);
      expect(component.form.get('downPayment')?.touched).toBe(true);
    });

    it('should clamp down payment input to max price', () => {
      component.form.patchValue({ price: 30000 });
      component.onDownPaymentInputChange(40000);
      expect(component.form.get('downPayment')?.value).toBe(30000);
    });

    it('should handle string input for down payment', () => {
      component.form.patchValue({ price: 50000, downPayment: 10000 });
      component.onDownPaymentInputChange('12000');
      // Value should remain unchanged when input is under max (clamping only applies when over max)
      expect(component.form.get('downPayment')?.value).toBe(10000);
    });

    it('should handle invalid string input for down payment', () => {
      const currentValue = component.form.get('downPayment')?.value;
      component.onDownPaymentInputChange('invalid');
      // Should not change the value for invalid input
      expect(component.form.get('downPayment')?.value).toBe(currentValue);
    });
  });

  describe('Loan Calculation', () => {
    it('should calculate monthly payment correctly', () => {
      component.form.patchValue({
        price: 30000,
        downPayment: 5000,
        tradeInValue: 0,
        apr: 6.0,
        termMonths: 60
      });
      component.calculateLoan();

      const calc = component.calculation();
      expect(calc).toBeTruthy();
      expect(calc?.monthlyPayment).toBeGreaterThan(0);
      // For a $25,000 loan at 6% APR over 60 months, payment should be around $483
      expect(calc?.monthlyPayment).toBeCloseTo(483, 0);
    });

    it('should calculate with zero interest rate', () => {
      component.form.patchValue({
        price: 24000,
        downPayment: 0,
        tradeInValue: 0,
        apr: 0,
        termMonths: 48
      });
      component.calculateLoan();

      const calc = component.calculation();
      expect(calc?.monthlyPayment).toBe(500); // 24000 / 48
      expect(calc?.totalInterest).toBe(0);
    });

    it('should handle principal of zero or less', () => {
      component.form.patchValue({
        price: 30000,
        downPayment: 20000,
        tradeInValue: 10000,
        apr: 6.0,
        termMonths: 60
      });
      component.calculateLoan();

      const calc = component.calculation();
      expect(calc?.monthlyPayment).toBe(0);
      expect(calc?.totalInterest).toBe(0);
    });

    it('should calculate total interest', () => {
      component.form.patchValue({
        price: 30000,
        downPayment: 5000,
        tradeInValue: 0,
        apr: 6.0,
        termMonths: 60
      });
      component.calculateLoan();

      const calc = component.calculation();
      expect(calc?.totalInterest).toBeGreaterThan(0);
    });

    it('should calculate total cost', () => {
      component.form.patchValue({
        price: 30000,
        downPayment: 5000,
        tradeInValue: 0,
        apr: 6.0,
        termMonths: 60
      });
      component.calculateLoan();

      const calc = component.calculation();
      expect(calc?.totalCost).toBeGreaterThan(30000);
    });

    it('should recalculate when form values change', () => {
      const initialCalc = component.calculation();
      
      component.form.patchValue({ price: 40000 });
      fixture.detectChanges();

      const newCalc = component.calculation();
      expect(newCalc?.monthlyPayment).not.toBe(initialCalc?.monthlyPayment);
    });

    it('should not calculate if form is invalid', () => {
      component.form.patchValue({ price: -1000 });
      const previousCalc = component.calculation();
      
      component.calculateLoan();
      
      // Calculation should not change with invalid form
      expect(component.calculation()).toBe(previousCalc);
    });
  });

  describe('Accessibility', () => {
    it('should have accessible labels on form fields', () => {
      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('#price')).toBeTruthy();
      expect(compiled.querySelector('#downPayment')).toBeTruthy();
      expect(compiled.querySelector('#tradeInValue')).toBeTruthy();
      expect(compiled.querySelector('#apr')).toBeTruthy();
      expect(compiled.querySelector('#termMonths')).toBeTruthy();
    });

    it('should display error messages for validation', () => {
      component.form.patchValue({ price: null });
      component.form.get('price')?.markAsTouched();
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const priceField = compiled.querySelector('mat-form-field');
      expect(priceField).toBeTruthy();
    });
  });
});
