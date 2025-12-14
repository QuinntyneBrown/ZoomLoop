// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { SellingOrTrading } from './selling-or-trading';

describe('SellingOrTrading', () => {
  let component: SellingOrTrading;
  let fixture: ComponentFixture<SellingOrTrading>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellingOrTrading],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideAnimations()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SellingOrTrading);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize in vin-input stage', () => {
      expect(component.stage).toBe('vin-input');
    });

    it('should initialize vinForm with empty value', () => {
      expect(component.vinForm.value.vin).toBe('');
    });

    it('should initialize detailsForm with empty values', () => {
      const formValue = component.detailsForm.value;
      expect(formValue.postalCode).toBe('');
      expect(formValue.kilometers).toBeNull();
      expect(formValue.accidents).toBeNull();
      expect(formValue.interiorCondition).toBe('');
      expect(formValue.exteriorCondition).toBe('');
    });
  });

  describe('VIN Form Validation', () => {
    it('should require VIN', () => {
      const vinControl = component.vinForm.get('vin');
      expect(vinControl?.hasError('required')).toBe(true);
    });

    it('should require VIN to be 17 characters', () => {
      const vinControl = component.vinForm.get('vin');
      vinControl?.setValue('123');
      expect(vinControl?.hasError('minlength')).toBe(true);

      vinControl?.setValue('12345678901234567890');
      expect(vinControl?.hasError('maxlength')).toBe(true);

      vinControl?.setValue('12345678901234567');
      expect(vinControl?.valid).toBe(true);
    });
  });

  describe('Details Form Validation', () => {
    it('should require postal code', () => {
      const postalCodeControl = component.detailsForm.get('postalCode');
      expect(postalCodeControl?.hasError('required')).toBe(true);
    });

    it('should require kilometers', () => {
      const kilometersControl = component.detailsForm.get('kilometers');
      expect(kilometersControl?.hasError('required')).toBe(true);
    });

    it('should require accidents', () => {
      const accidentsControl = component.detailsForm.get('accidents');
      expect(accidentsControl?.hasError('required')).toBe(true);
    });

    it('should require interior condition', () => {
      const interiorControl = component.detailsForm.get('interiorCondition');
      expect(interiorControl?.hasError('required')).toBe(true);
    });

    it('should require exterior condition', () => {
      const exteriorControl = component.detailsForm.get('exteriorCondition');
      expect(exteriorControl?.hasError('required')).toBe(true);
    });

    it('should validate minimum value for kilometers', () => {
      const kilometersControl = component.detailsForm.get('kilometers');
      kilometersControl?.setValue(-100);
      expect(kilometersControl?.hasError('min')).toBe(true);

      kilometersControl?.setValue(0);
      expect(kilometersControl?.hasError('min')).toBe(false);
    });

    it('should validate minimum value for accidents', () => {
      const accidentsControl = component.detailsForm.get('accidents');
      accidentsControl?.setValue(-1);
      expect(accidentsControl?.hasError('min')).toBe(true);

      accidentsControl?.setValue(0);
      expect(accidentsControl?.hasError('min')).toBe(false);
    });
  });

  describe('Condition Options', () => {
    it('should have correct condition options', () => {
      expect(component.conditionOptions).toEqual(['Excellent', 'Fair', 'Bad']);
    });
  });

  describe('Reset Functionality', () => {
    it('should reset to initial state', () => {
      // Set some state
      component.stage = 'result';
      component.error = 'Some error';
      component.vehicleInfo = { year: 2020, make: 'Toyota', model: 'Camry' };
      component.valuationResult = { fairValue: 25000, explanation: 'Test' };
      component.vinForm.setValue({ vin: '12345678901234567' });
      component.detailsForm.patchValue({
        postalCode: 'M5H 2N2',
        kilometers: 50000,
        accidents: 0,
        interiorCondition: 'Excellent',
        exteriorCondition: 'Excellent'
      });

      // Reset
      component.reset();

      // Verify
      expect(component.stage).toBe('vin-input');
      expect(component.error).toBeNull();
      expect(component.vehicleInfo).toBeNull();
      expect(component.valuationResult).toBeNull();
      expect(component.vinForm.value.vin).toBeNull();
      expect(component.detailsForm.value.postalCode).toBeNull();
    });
  });

  describe('Form Submission Guards', () => {
    it('should not proceed with invalid VIN form', () => {
      component.vinForm.setValue({ vin: '' });
      component.handleGetInstantOffer();
      expect(component.loading).toBe(false);
    });

    it('should not proceed with invalid details form', () => {
      component.vehicleInfo = { year: 2020, make: 'Toyota', model: 'Camry' };
      component.detailsForm.patchValue({
        postalCode: '',
        kilometers: null,
        accidents: null,
        interiorCondition: '',
        exteriorCondition: ''
      });
      component.handleGetInstantQuote();
      expect(component.loading).toBe(false);
    });
  });
});
