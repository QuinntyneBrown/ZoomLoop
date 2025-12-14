// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'zl-loan-calculator',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTooltipModule,
    MatIconModule
  ],
  templateUrl: './loan-calculator.html',
  styleUrl: './loan-calculator.scss'
})
export class LoanCalculator implements OnInit {
  private readonly _fb = inject(FormBuilder);

  form!: FormGroup;
  monthlyPayment = signal<number | null>(null);
  totalInterest = signal<number | null>(null);
  totalPayment = signal<number | null>(null);

  // Available term options in months
  termOptions = [12, 24, 36, 48, 60, 72, 84];

  // Default tax rate by region (configurable)
  defaultTaxRate = 7.0; // 7% sales tax

  ngOnInit() {
    this.form = this._fb.group({
      price: ['', [Validators.required, Validators.min(0.01)]],
      downPayment: [0, [Validators.min(0)]],
      tradeInValue: [0],
      interestRate: [7.99, [Validators.required, Validators.min(0), Validators.max(100)]],
      termMonths: [60, [Validators.required, Validators.min(1)]],
      taxRate: [this.defaultTaxRate, [Validators.min(0), Validators.max(100)]],
      fees: [0, [Validators.min(0)]]
    });

    // Subscribe to form changes to recalculate
    this.form.valueChanges.subscribe(() => {
      this.calculatePayment();
    });

    // Clamp down payment when it changes
    this.form.get('downPayment')?.valueChanges.subscribe((value) => {
      if (value !== null && value !== undefined) {
        this.clampDownPayment();
      }
    });

    // Re-clamp down payment when price changes
    this.form.get('price')?.valueChanges.subscribe(() => {
      this.clampDownPayment();
    });
  }

  clampDownPayment() {
    const price = this.form.get('price')?.value || 0;
    const downPayment = this.form.get('downPayment')?.value || 0;

    let newValue = downPayment;
    let changed = false;

    // Clamp to minimum of 0
    if (downPayment < 0) {
      newValue = 0;
      changed = true;
    }

    // Clamp to maximum of price (if price is set)
    if (price > 0 && downPayment > price) {
      newValue = price;
      changed = true;
    }

    if (changed) {
      this.form.get('downPayment')?.setValue(newValue, { emitEvent: false });
    }
  }

  calculatePayment() {
    if (this.form.invalid) {
      this.monthlyPayment.set(null);
      this.totalInterest.set(null);
      this.totalPayment.set(null);
      return;
    }

    const price = parseFloat(this.form.get('price')?.value) || 0;
    const downPayment = parseFloat(this.form.get('downPayment')?.value) || 0;
    const tradeInValue = parseFloat(this.form.get('tradeInValue')?.value) || 0;
    const annualRate = parseFloat(this.form.get('interestRate')?.value) || 0;
    const termMonths = parseInt(this.form.get('termMonths')?.value) || 60;
    const taxRate = parseFloat(this.form.get('taxRate')?.value) || 0;
    const fees = parseFloat(this.form.get('fees')?.value) || 0;

    // Calculate taxes
    const taxAmount = (price * taxRate) / 100;

    // Calculate principal (price + tax + fees - down payment - trade-in)
    // Note: negative trade-in value (negative equity) is added to the loan
    const principal = price + taxAmount + fees - downPayment - tradeInValue;

    if (principal <= 0) {
      this.monthlyPayment.set(0);
      this.totalInterest.set(0);
      this.totalPayment.set(0);
      return;
    }

    // Calculate monthly interest rate
    const monthlyRate = annualRate / 100 / 12;

    // Calculate monthly payment using standard loan formula
    // M = P * [r(1+r)^n] / [(1+r)^n - 1]
    let monthly: number;
    if (monthlyRate === 0) {
      monthly = principal / termMonths;
    } else {
      const factor = Math.pow(1 + monthlyRate, termMonths);
      monthly = principal * (monthlyRate * factor) / (factor - 1);
    }

    const total = monthly * termMonths;
    const interest = total - principal;

    this.monthlyPayment.set(monthly);
    this.totalInterest.set(interest);
    this.totalPayment.set(total);
  }

  reset() {
    this.form.reset({
      price: '',
      downPayment: 0,
      tradeInValue: 0,
      interestRate: 7.99,
      termMonths: 60,
      taxRate: this.defaultTaxRate,
      fees: 0
    });
    this.monthlyPayment.set(null);
    this.totalInterest.set(null);
    this.totalPayment.set(null);
  }
}
