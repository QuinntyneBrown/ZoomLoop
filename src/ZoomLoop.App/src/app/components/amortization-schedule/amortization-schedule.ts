// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges, signal } from '@angular/core';

export interface AmortizationPayment {
  paymentNumber: number;
  principal: number;
  interest: number;
  remainingBalance: number;
  totalPayment: number;
}

@Component({
  selector: 'zl-amortization-schedule',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './amortization-schedule.html',
  styleUrl: './amortization-schedule.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AmortizationSchedule implements OnChanges {
  @Input() loanAmount = 0;
  @Input() interestRate = 0; // Annual interest rate as percentage (e.g., 5 for 5%)
  @Input() loanTermMonths = 0;
  @Input() monthlyPayment = 0;

  isExpanded = signal(false);
  schedule = signal<AmortizationPayment[]>([]);
  totalPrincipal = signal(0);
  totalInterest = signal(0);

  ngOnChanges(changes: SimpleChanges): void {
    if (this.loanAmount > 0 && this.interestRate >= 0 && this.loanTermMonths > 0) {
      this.calculateSchedule();
    }
  }

  toggleExpanded(): void {
    this.isExpanded.set(!this.isExpanded());
  }

  private calculateSchedule(): void {
    const payments: AmortizationPayment[] = [];
    const monthlyRate = this.interestRate / 100 / 12;
    let balance = this.loanAmount;
    let totalPrincipalSum = 0;
    let totalInterestSum = 0;

    // Calculate monthly payment if not provided
    let payment = this.monthlyPayment;
    if (payment <= 0 && monthlyRate > 0) {
      payment = this.loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, this.loanTermMonths)) /
        (Math.pow(1 + monthlyRate, this.loanTermMonths) - 1);
    } else if (payment <= 0) {
      payment = this.loanAmount / this.loanTermMonths;
    }

    for (let i = 1; i <= this.loanTermMonths; i++) {
      const interestPayment = balance * monthlyRate;
      const principalPayment = Math.max(0, payment - interestPayment);
      balance = Math.max(0, balance - principalPayment);

      totalPrincipalSum += principalPayment;
      totalInterestSum += interestPayment;

      payments.push({
        paymentNumber: i,
        principal: principalPayment,
        interest: interestPayment,
        remainingBalance: balance,
        totalPayment: payment
      });

      // Stop if balance is paid off
      if (balance === 0) {
        break;
      }
    }

    this.schedule.set(payments);
    this.totalPrincipal.set(totalPrincipalSum);
    this.totalInterest.set(totalInterestSum);
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  }
}
