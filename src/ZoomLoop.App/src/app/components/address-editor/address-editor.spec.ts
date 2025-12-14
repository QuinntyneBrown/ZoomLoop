// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddressEditor, Address } from './address-editor';

describe('AddressEditor', () => {
  let component: AddressEditor;
  let fixture: ComponentFixture<AddressEditor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddressEditor],
    }).compileComponents();

    fixture = TestBed.createComponent(AddressEditor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Initialization', () => {
    it('should create the address editor component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default label', () => {
      expect(component.label).toBe('Address');
    });

    it('should initialize with required false', () => {
      expect(component.required).toBe(false);
    });

    it('should initialize form with empty values', () => {
      const formValue = component.form.value;
      expect(formValue.addressLine1).toBe('');
      expect(formValue.addressLine2).toBe('');
      expect(formValue.city).toBe('');
      expect(formValue.province).toBe('');
      expect(formValue.postalCode).toBe('');
      expect(formValue.country).toBe('');
    });
  });

  describe('ControlValueAccessor', () => {
    it('should write value to form', () => {
      const address: Address = {
        addressLine1: '123 Main St',
        addressLine2: 'Apt 4B',
        city: 'New York',
        province: 'NY',
        postalCode: '10001',
        country: 'USA'
      };

      component.writeValue(address);

      expect(component.form.value).toEqual(address);
    });

    it('should reset form when writeValue is called with null', () => {
      const address: Address = {
        addressLine1: '123 Main St',
        addressLine2: 'Apt 4B',
        city: 'New York',
        province: 'NY',
        postalCode: '10001',
        country: 'USA'
      };

      component.writeValue(address);
      expect(component.form.value.addressLine1).toBe('123 Main St');

      component.writeValue(null);
      expect(component.form.value.addressLine1).toBeNull();
    });

    it('should register onChange callback', () => {
      const onChange = vi.fn();
      component.registerOnChange(onChange);

      component.form.patchValue({ addressLine1: '456 Oak Ave' });

      expect(onChange).toHaveBeenCalled();
    });

    it('should register onTouched callback', () => {
      const onTouched = vi.fn();
      component.registerOnTouched(onTouched);

      component.form.patchValue({ city: 'Boston' });

      expect(onTouched).toHaveBeenCalled();
    });

    it('should disable form when setDisabledState is called with true', () => {
      component.setDisabledState(true);
      expect(component.form.disabled).toBe(true);
    });

    it('should enable form when setDisabledState is called with false', () => {
      component.setDisabledState(true);
      component.setDisabledState(false);
      expect(component.form.enabled).toBe(true);
    });
  });

  describe('Form Changes', () => {
    it('should call onChange when form values change', () => {
      const onChange = vi.fn();
      component.registerOnChange(onChange);

      component.form.patchValue({
        addressLine1: '789 Elm St',
        city: 'Chicago'
      });

      expect(onChange).toHaveBeenCalled();
    });

    it('should pass updated form values to onChange', () => {
      let capturedValue: any = null;
      component.registerOnChange((value: Address) => {
        capturedValue = value;
      });

      component.form.patchValue({
        addressLine1: '321 Pine St',
        city: 'Seattle'
      });

      expect(capturedValue).toBeTruthy();
      expect(capturedValue.addressLine1).toBe('321 Pine St');
      expect(capturedValue.city).toBe('Seattle');
    });
  });
});
