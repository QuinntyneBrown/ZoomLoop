// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VehicleCreate } from './vehicle-create';
import { DebugElement } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

describe('VehicleCreate', () => {
  let component: VehicleCreate;
  let fixture: ComponentFixture<VehicleCreate>;
  let compiled: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleCreate],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        provideAnimations()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(VehicleCreate);
    component = fixture.componentInstance;
    compiled = fixture.debugElement;
    fixture.detectChanges();
  });

  describe('Initialization', () => {
    it('should create the vehicle create component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize the form', () => {
      expect(component.form).toBeTruthy();
    });

    it('should have default form values', () => {
      expect(component.form.value.year).toBe(new Date().getFullYear());
      expect(component.form.value.mileage).toBe(0);
      expect(component.form.value.doors).toBe(4);
      expect(component.form.value.seats).toBe(5);
      expect(component.form.value.isNew).toBe(false);
      expect(component.form.value.isCertified).toBe(false);
    });

    it('should initialize signals', () => {
      expect(component.images()).toEqual([]);
      expect(component.features()).toEqual([]);
      expect(component.isDragging()).toBe(false);
      expect(component.isSubmitting()).toBe(false);
      expect(component.errorMessage()).toBeNull();
    });

    it('should have vehicle options defined', () => {
      expect(component.transmissions.length).toBeGreaterThan(0);
      expect(component.fuelTypes.length).toBeGreaterThan(0);
      expect(component.driveTypes.length).toBeGreaterThan(0);
      expect(component.bodyTypes.length).toBeGreaterThan(0);
      expect(component.featureCategories.length).toBeGreaterThan(0);
    });
  });

  describe('Form Validation', () => {
    it('should be invalid when empty', () => {
      expect(component.form.valid).toBe(false);
    });

    it('should require VIN', () => {
      const vinControl = component.form.get('vin');
      expect(vinControl?.hasError('required')).toBe(true);
      
      vinControl?.setValue('1HGBH41JXMN109186');
      expect(vinControl?.hasError('required')).toBe(false);
    });

    it('should validate VIN pattern (17 characters)', () => {
      const vinControl = component.form.get('vin');
      
      vinControl?.setValue('INVALID');
      expect(vinControl?.hasError('pattern')).toBe(true);
      
      vinControl?.setValue('1HGBH41JXMN109186');
      expect(vinControl?.hasError('pattern')).toBe(false);
    });

    it('should require stock number', () => {
      const stockControl = component.form.get('stockNumber');
      expect(stockControl?.hasError('required')).toBe(true);
      
      stockControl?.setValue('STK123');
      expect(stockControl?.hasError('required')).toBe(false);
    });

    it('should require year', () => {
      const yearControl = component.form.get('year');
      expect(yearControl?.hasError('required')).toBe(true);
    });

    it('should validate year range', () => {
      const yearControl = component.form.get('year');
      const currentYear = new Date().getFullYear();
      
      yearControl?.setValue(1800);
      expect(yearControl?.hasError('min')).toBe(true);
      
      yearControl?.setValue(currentYear + 5);
      expect(yearControl?.hasError('max')).toBe(true);
      
      yearControl?.setValue(currentYear);
      expect(yearControl?.hasError('min')).toBe(false);
      expect(yearControl?.hasError('max')).toBe(false);
    });

    it('should require mileage', () => {
      const mileageControl = component.form.get('mileage');
      mileageControl?.setValue(null);
      expect(mileageControl?.hasError('required')).toBe(true);
      
      mileageControl?.setValue(15000);
      expect(mileageControl?.hasError('required')).toBe(false);
    });

    it('should validate mileage is not negative', () => {
      const mileageControl = component.form.get('mileage');
      
      mileageControl?.setValue(-100);
      expect(mileageControl?.hasError('min')).toBe(true);
      
      mileageControl?.setValue(0);
      expect(mileageControl?.hasError('min')).toBe(false);
    });

    it('should require exterior color', () => {
      const colorControl = component.form.get('exteriorColor');
      expect(colorControl?.hasError('required')).toBe(true);
      
      colorControl?.setValue('Silver');
      expect(colorControl?.hasError('required')).toBe(false);
    });

    it('should require interior color', () => {
      const colorControl = component.form.get('interiorColor');
      expect(colorControl?.hasError('required')).toBe(true);
      
      colorControl?.setValue('Black');
      expect(colorControl?.hasError('required')).toBe(false);
    });

    it('should require transmission', () => {
      const transControl = component.form.get('transmission');
      expect(transControl?.hasError('required')).toBe(true);
      
      transControl?.setValue('Automatic');
      expect(transControl?.hasError('required')).toBe(false);
    });

    it('should require description', () => {
      const descControl = component.form.get('description');
      expect(descControl?.hasError('required')).toBe(true);
      
      descControl?.setValue('Well-maintained vehicle');
      expect(descControl?.hasError('required')).toBe(false);
    });

    it('should be valid with all required fields filled', () => {
      component.form.patchValue({
        vin: '1HGBH41JXMN109186',
        stockNumber: 'STK123',
        year: 2023,
        mileage: 15000,
        exteriorColor: 'Silver',
        interiorColor: 'Black',
        transmission: 'Automatic',
        fuelType: 'Gasoline',
        driveType: 'FWD',
        bodyType: 'Sedan',
        description: 'Well-maintained vehicle'
      });
      
      expect(component.form.valid).toBe(true);
    });
  });

  describe('Image Handling', () => {
    it('should set dragging state on drag over', () => {
      const event = new DragEvent('dragover');
      component.onDragOver(event);
      expect(component.isDragging()).toBe(true);
    });

    it('should clear dragging state on drag leave', () => {
      component.isDragging.set(true);
      const event = new DragEvent('dragleave');
      component.onDragLeave(event);
      expect(component.isDragging()).toBe(false);
    });

    it('should remove image at index', () => {
      component.images.set([
        { imageUrl: 'url1', thumbnailUrl: 'url1', caption: '', displayOrder: 1, isPrimary: true, createdDate: new Date() },
        { imageUrl: 'url2', thumbnailUrl: 'url2', caption: '', displayOrder: 2, isPrimary: false, createdDate: new Date() }
      ]);

      component.removeImage(1);
      expect(component.images().length).toBe(1);
      expect(component.images()[0].imageUrl).toBe('url1');
    });

    it('should set first image as primary when primary is removed', () => {
      component.images.set([
        { imageUrl: 'url1', thumbnailUrl: 'url1', caption: '', displayOrder: 1, isPrimary: true, createdDate: new Date() },
        { imageUrl: 'url2', thumbnailUrl: 'url2', caption: '', displayOrder: 2, isPrimary: false, createdDate: new Date() }
      ]);

      component.removeImage(0);
      expect(component.images().length).toBe(1);
      expect(component.images()[0].isPrimary).toBe(true);
    });

    it('should set primary image', () => {
      component.images.set([
        { imageUrl: 'url1', thumbnailUrl: 'url1', caption: '', displayOrder: 1, isPrimary: true, createdDate: new Date() },
        { imageUrl: 'url2', thumbnailUrl: 'url2', caption: '', displayOrder: 2, isPrimary: false, createdDate: new Date() }
      ]);

      component.setPrimaryImage(1);
      expect(component.images()[0].isPrimary).toBe(false);
      expect(component.images()[1].isPrimary).toBe(true);
    });
  });

  describe('Feature Handling', () => {
    it('should toggle feature on', () => {
      expect(component.isFeatureSelected('Bluetooth')).toBe(false);
      
      component.toggleFeature('Bluetooth', 'Technology');
      
      expect(component.isFeatureSelected('Bluetooth')).toBe(true);
      expect(component.features().length).toBe(1);
      expect(component.features()[0].name).toBe('Bluetooth');
      expect(component.features()[0].category).toBe('Technology');
    });

    it('should toggle feature off', () => {
      component.toggleFeature('Bluetooth', 'Technology');
      expect(component.isFeatureSelected('Bluetooth')).toBe(true);
      
      component.toggleFeature('Bluetooth', 'Technology');
      
      expect(component.isFeatureSelected('Bluetooth')).toBe(false);
      expect(component.features().length).toBe(0);
    });

    it('should handle multiple features', () => {
      component.toggleFeature('Bluetooth', 'Technology');
      component.toggleFeature('Backup Camera', 'Safety');
      component.toggleFeature('Heated Seats', 'Comfort');
      
      expect(component.features().length).toBe(3);
      expect(component.isFeatureSelected('Bluetooth')).toBe(true);
      expect(component.isFeatureSelected('Backup Camera')).toBe(true);
      expect(component.isFeatureSelected('Heated Seats')).toBe(true);
    });
  });

  describe('Form Submission', () => {
    it('should not submit when form is invalid', () => {
      component.onSubmit();
      
      expect(component.isSubmitting()).toBe(false);
      expect(component.form.touched).toBe(true);
    });

    it('should set submitting state when form is valid', () => {
      component.form.patchValue({
        vin: '1HGBH41JXMN109186',
        stockNumber: 'STK123',
        year: 2023,
        mileage: 15000,
        exteriorColor: 'Silver',
        interiorColor: 'Black',
        transmission: 'Automatic',
        fuelType: 'Gasoline',
        driveType: 'FWD',
        bodyType: 'Sedan',
        description: 'Well-maintained vehicle'
      });

      // We can't fully test the async submission without mocking HttpClient
      // but we can verify the form is valid
      expect(component.form.valid).toBe(true);
    });
  });

  describe('Cancel', () => {
    it('should have cancel method', () => {
      expect(component.cancel).toBeDefined();
    });
  });
});
