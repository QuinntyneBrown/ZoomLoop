// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Component, Input as InputDecorator, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  ControlValueAccessor, 
  FormBuilder, 
  FormGroup, 
  ReactiveFormsModule, 
  NG_VALUE_ACCESSOR,
  Validators 
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

export interface Address {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
}

@Component({
  selector: 'zl-address-editor',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule
  ],
  templateUrl: './address-editor.html',
  styleUrls: ['./address-editor.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddressEditor),
      multi: true
    }
  ]
})
export class AddressEditor implements ControlValueAccessor {
  @InputDecorator() label = 'Address';
  @InputDecorator() required = false;

  form: FormGroup;
  private onChange: (value: Address) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      addressLine1: [''],
      addressLine2: [''],
      city: [''],
      province: [''],
      postalCode: [''],
      country: ['']
    });

    this.form.valueChanges.subscribe(value => {
      this.onChange(value);
      this.onTouched();
    });
  }

  writeValue(value: Address | null): void {
    if (value) {
      this.form.patchValue(value, { emitEvent: false });
    } else {
      this.form.reset({}, { emitEvent: false });
    }
  }

  registerOnChange(fn: (value: Address) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.form.disable();
    } else {
      this.form.enable();
    }
  }

  // Address autocomplete functionality
  // This is a placeholder for third-party address lookup API integration
  // In a real implementation, you would integrate with Google Places API or similar
  onAddressSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    const searchValue = target?.value;
    if (searchValue && searchValue.length > 3) {
      // TODO: Integrate with address autocomplete API
      // Example: Google Places Autocomplete, Mapbox Geocoding, etc.
      console.log('Address search:', searchValue);
    }
  }
}
