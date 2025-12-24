// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface FinanceBreakdown {
  principal: number;
  totalInterest: number;
  totalCost: number;
  monthlyPayment: number;
}

@Component({
  selector: 'zl-finance-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './finance-calculator.component.html',
  styleUrl: './finance-calculator.component.scss'
})
export class FinanceCalculatorComponent implements OnInit, OnChanges {
  @Input() title = 'Estimate Your Payment';
  @Input() vehiclePrice = 24500;
  @Input() defaultDownPayment = 2500;
  @Input() defaultLoanTerm = 60;
  @Input() defaultInterestRate = 6.99;
  @Input() ctaText = 'Get Pre-Approved';

  @Output() preApprovalClick = new EventEmitter<FinanceBreakdown>();
  @Output() calculationChange = new EventEmitter<FinanceBreakdown>();

  downPayment = 2500;
  loanTerm = 60;
  interestRate = 6.99;

  breakdown: FinanceBreakdown = {
    principal: 0,
    totalInterest: 0,
    totalCost: 0,
    monthlyPayment: 0
  };

  private titleIdValue = `calc-${Math.random().toString(36).substr(2, 9)}`;

  get titleId(): string {
    return this.titleIdValue;
  }

  get maxDownPayment(): number {
    return Math.floor(this.vehiclePrice * 0.5);
  }

  get downPaymentPercent(): number {
    return Math.round((this.downPayment / this.vehiclePrice) * 100);
  }

  ngOnInit(): void {
    this.downPayment = this.defaultDownPayment;
    this.loanTerm = this.defaultLoanTerm;
    this.interestRate = this.defaultInterestRate;
    this.calculate();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['vehiclePrice']) {
      this.calculate();
    }
  }

  calculate(): void {
    const principal = this.vehiclePrice - this.downPayment;
    const monthlyRate = this.interestRate / 100 / 12;
    const numPayments = this.loanTerm;

    let monthlyPayment: number;

    if (monthlyRate === 0) {
      monthlyPayment = principal / numPayments;
    } else {
      monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
        (Math.pow(1 + monthlyRate, numPayments) - 1);
    }

    const totalCost = monthlyPayment * numPayments;
    const totalInterest = totalCost - principal;

    this.breakdown = {
      principal,
      totalInterest,
      totalCost,
      monthlyPayment
    };

    this.calculationChange.emit(this.breakdown);
  }

  onPriceChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/[^0-9]/g, '');
    this.vehiclePrice = parseInt(value, 10) || 0;
    this.calculate();
  }

  onRateChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = parseFloat(input.value) || 0;
    this.interestRate = Math.min(Math.max(value, 0), 20);
    this.calculate();
  }

  onPreApprovalClick(): void {
    this.preApprovalClick.emit(this.breakdown);
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }

  formatNumber(value: number): string {
    return new Intl.NumberFormat('en-CA').format(value);
  }
}
