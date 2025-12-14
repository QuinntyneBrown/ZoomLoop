// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { LoanCalculation, LOAN_TERM_OPTIONS } from '../../models';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'zl-loan-inputs-panel',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSliderModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './loan-inputs-panel.html',
  styleUrls: ['./loan-inputs-panel.scss']
})
export class LoanInputsPanel implements OnInit, OnDestroy {
  private readonly _fb = inject(FormBuilder);
  private readonly _destroy$ = new Subject<void>();

  form!: FormGroup;
  loanTermOptions = LOAN_TERM_OPTIONS;
  calculation = signal<LoanCalculation | null>(null);

  ngOnInit(): void {
    this.form = this._fb.group({
      price: [50000, [Validators.required, Validators.min(0)]],
      downPayment: [10000, [Validators.required, Validators.min(0)]],
      tradeInValue: [0, [Validators.required, Validators.min(0)]],
      apr: [5.99, [Validators.required, Validators.min(0), Validators.max(100)]],
      termMonths: [60, [Validators.required]]
    });

    // Subscribe to form changes to recalculate (automatically cleaned up on destroy)
    this.form.valueChanges
      .pipe(takeUntil(this._destroy$))
      .subscribe(() => {
        this.calculateLoan();
      });

    // Initial calculation
    this.calculateLoan();
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  get priceControl() {
    return this.form.get('price');
  }

  get downPaymentControl() {
    return this.form.get('downPayment');
  }

  get tradeInValueControl() {
    return this.form.get('tradeInValue');
  }

  get aprControl() {
    return this.form.get('apr');
  }

  get termMonthsControl() {
    return this.form.get('termMonths');
  }

  get maxDownPayment(): number {
    return this.priceControl?.value || 0;
  }

  incrementField(fieldName: string, step: number = 1000): void {
    const control = this.form.get(fieldName);
    if (control) {
      const currentValue = control.value || 0;
      let newValue = currentValue + step;

      // Special handling for down payment to not exceed price
      if (fieldName === 'downPayment') {
        newValue = Math.min(newValue, this.maxDownPayment);
      }

      control.setValue(newValue);
      control.markAsTouched();
    }
  }

  decrementField(fieldName: string, step: number = 1000): void {
    const control = this.form.get(fieldName);
    if (control) {
      const currentValue = control.value || 0;
      const newValue = Math.max(0, currentValue - step);
      control.setValue(newValue);
      control.markAsTouched();
    }
  }

  onDownPaymentSliderChange(value: number): void {
    if (this.downPaymentControl) {
      this.downPaymentControl.setValue(value);
      this.downPaymentControl.markAsTouched();
    }
  }

  onDownPaymentInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const numValue = parseFloat(input.value);
    if (!isNaN(numValue) && this.downPaymentControl) {
      const clampedValue = Math.min(numValue, this.maxDownPayment);
      if (clampedValue !== numValue) {
        this.downPaymentControl.setValue(clampedValue);
      }
    }
  }

  calculateLoan(): void {
    if (this.form.invalid) {
      return;
    }

    const formValue = this.form.value;
    const principal = formValue.price - formValue.downPayment - formValue.tradeInValue;
    
    if (principal <= 0) {
      this.calculation.set({
        ...formValue,
        monthlyPayment: 0,
        totalInterest: 0,
        totalCost: formValue.price
      });
      return;
    }

    const monthlyRate = formValue.apr / 100 / 12;
    const numberOfPayments = formValue.termMonths;

    let monthlyPayment: number;
    let totalInterest: number;

    if (monthlyRate === 0) {
      // No interest case
      monthlyPayment = principal / numberOfPayments;
      totalInterest = 0;
    } else {
      // Standard loan payment formula: M = P * [r(1+r)^n] / [(1+r)^n - 1]
      const rateCompounded = Math.pow(1 + monthlyRate, numberOfPayments);
      monthlyPayment = principal * (monthlyRate * rateCompounded) / (rateCompounded - 1);
      totalInterest = (monthlyPayment * numberOfPayments) - principal;
    }

    const totalCost = formValue.price + totalInterest;

    this.calculation.set({
      ...formValue,
      monthlyPayment: Math.round(monthlyPayment * 100) / 100,
      totalInterest: Math.round(totalInterest * 100) / 100,
      totalCost: Math.round(totalCost * 100) / 100
    });
  }
}
