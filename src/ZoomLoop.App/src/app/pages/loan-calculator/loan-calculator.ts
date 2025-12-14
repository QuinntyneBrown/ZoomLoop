// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { LoanCalculatorService, LoanCalculationResult } from '../../core/loan-calculator.service';

@Component({
  selector: 'zl-loan-calculator',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule
  ],
  templateUrl: './loan-calculator.html',
  styleUrls: ['./loan-calculator.scss']
})
export class LoanCalculator implements OnInit {
  private readonly _fb = inject(FormBuilder);
  private readonly _loanService = inject(LoanCalculatorService);

  form!: FormGroup;
  result = signal<LoanCalculationResult | null>(null);
  fieldErrors = signal<Record<string, string>>({});

  config = this._loanService.getConfig();
  allowedTerms = this.config.allowedTerms;

  ngOnInit() {
    this.form = this._fb.group({
      price: [
        '',
        [
          Validators.required,
          Validators.min(this.config.minPrice),
          Validators.max(this.config.maxPrice)
        ]
      ],
      downPayment: [
        '',
        [
          Validators.required,
          Validators.min(this.config.minDownPayment)
        ]
      ],
      apr: [
        '',
        [
          Validators.required,
          Validators.min(this.config.minAPR),
          Validators.max(this.config.maxAPR)
        ]
      ],
      termMonths: [
        '',
        [Validators.required]
      ],
      fees: [
        '',
        [
          Validators.required,
          Validators.min(this.config.minFees)
        ]
      ]
    });

    // Add custom validator for down payment <= price
    this.form.get('downPayment')?.addValidators(
      this.downPaymentValidator.bind(this)
    );

    // Add custom validator for term in allowed set
    this.form.get('termMonths')?.addValidators(
      this.termValidator.bind(this)
    );

    // Calculate on value changes
    this.form.valueChanges.subscribe(() => {
      if (this.form.valid) {
        this.calculateLoan();
      }
    });
  }

  private downPaymentValidator(control: any) {
    const downPayment = control.value;
    const price = this.form?.get('price')?.value;
    
    if (price && downPayment && Number(downPayment) > Number(price)) {
      return { exceedsPrice: true };
    }
    return null;
  }

  private termValidator(control: any) {
    const term = Number(control.value);
    
    if (term && !this.allowedTerms.includes(term)) {
      return { invalidTerm: true };
    }
    return null;
  }

  onFieldBlur(fieldName: string) {
    const control = this.form.get(fieldName);
    
    if (control && control.invalid && control.touched) {
      this.fieldErrors.update(errors => ({
        ...errors,
        [fieldName]: this.getFieldError(fieldName)
      }));
    } else {
      this.fieldErrors.update(errors => {
        const newErrors = { ...errors };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  }

  getFieldError(fieldName: string): string {
    const control = this.form.get(fieldName);
    
    if (!control || !control.errors) {
      return '';
    }

    if (control.errors['required']) {
      return `${this.getFieldLabel(fieldName)} is required`;
    }

    if (control.errors['min']) {
      const minValue = control.errors['min'].min;
      return `${this.getFieldLabel(fieldName)} must be at least ${minValue}`;
    }

    if (control.errors['max']) {
      const maxValue = control.errors['max'].max;
      return `${this.getFieldLabel(fieldName)} cannot exceed ${maxValue}`;
    }

    if (control.errors['exceedsPrice']) {
      return 'Down payment cannot exceed price';
    }

    if (control.errors['invalidTerm']) {
      return `Term must be one of: ${this.allowedTerms.join(', ')} months`;
    }

    return 'Invalid value';
  }

  getFieldLabel(fieldName: string): string {
    const labels: Record<string, string> = {
      price: 'Price',
      downPayment: 'Down payment',
      apr: 'APR',
      termMonths: 'Term',
      fees: 'Fees'
    };
    return labels[fieldName] || fieldName;
  }

  hasFieldError(fieldName: string): boolean {
    const control = this.form.get(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  calculateLoan() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.value;
    const input = {
      price: Number(formValue.price),
      downPayment: Number(formValue.downPayment),
      apr: Number(formValue.apr),
      termMonths: Number(formValue.termMonths),
      fees: Number(formValue.fees)
    };

    const calculationResult = this._loanService.calculate(input);
    this.result.set(calculationResult);
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      
      // Update all field errors
      Object.keys(this.form.controls).forEach(fieldName => {
        if (this.hasFieldError(fieldName)) {
          this.fieldErrors.update(errors => ({
            ...errors,
            [fieldName]: this.getFieldError(fieldName)
          }));
        }
      });
      
      return;
    }

    this.calculateLoan();
  }

  reset() {
    this.form.reset();
    this.result.set(null);
    this.fieldErrors.set({});
  }

  shouldDisableSubmit(): boolean {
    if (!this.form) {
      return true;
    }

    const priceControl = this.form.get('price');
    const anyTouched = Object.values(this.form.controls).some(control => control.touched);

    if (!anyTouched) {
      return true;
    }

    if (priceControl && !priceControl.touched) {
      return true;
    }

    return false;
  }
}
