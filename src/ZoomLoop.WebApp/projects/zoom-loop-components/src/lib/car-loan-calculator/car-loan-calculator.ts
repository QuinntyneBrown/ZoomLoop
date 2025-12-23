import { Component, computed, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export type PaymentFrequency = 'monthly' | 'bi-weekly';

export interface CarLoanCalculation {
  paymentAmount: number;
  totalLoanCost: number;
  totalInterest: number;
  numberOfPayments: number;
  effectiveLoanAmount: number;
}

@Component({
  selector: 'zl-car-loan-calculator',
  imports: [CommonModule, FormsModule],
  templateUrl: './car-loan-calculator.html',
  styleUrls: ['./car-loan-calculator.scss'],
})
export class CarLoanCalculator {
  // Inputs with defaults
  readonly title = input<string>('Car Loan Calculator');
  readonly subtitle = input<string>('Estimate your payment and what you can afford');

  // Vehicle price configuration
  readonly initialVehiclePrice = input<number>(25000);
  readonly minVehiclePrice = input<number>(5000);
  readonly maxVehiclePrice = input<number>(100000);

  // Down payment configuration
  readonly initialDownPayment = input<number>(0);

  // Trade-in configuration
  readonly initialTradeInValue = input<number>(0);
  readonly maxTradeInValue = input<number>(50000);

  // Interest rate configuration
  readonly initialInterestRate = input<number>(8.99);
  readonly minInterestRate = input<number>(0);
  readonly maxInterestRate = input<number>(25);

  // Loan term configuration
  readonly initialLoanTermMonths = input<number>(60);
  readonly minLoanTermMonths = input<number>(12);
  readonly maxLoanTermMonths = input<number>(96);

  // Payment frequency configuration
  readonly initialPaymentFrequency = input<PaymentFrequency>('monthly');

  // Apply button configuration
  readonly showApplyButton = input<boolean>(true);
  readonly applyButtonText = input<string>('Get Pre-Approved');

  // Outputs
  readonly calculationChange = output<CarLoanCalculation>();
  readonly applyClicked = output<CarLoanCalculation>();

  // Internal state signals
  readonly vehiclePrice = signal(0);
  readonly downPayment = signal(0);
  readonly tradeInValue = signal(0);
  readonly interestRate = signal(8.99);
  readonly loanTermMonths = signal(60);
  readonly paymentFrequency = signal<PaymentFrequency>('monthly');

  constructor() {
    // Initialize signals with input values after component is created
    setTimeout(() => {
      this.vehiclePrice.set(this.initialVehiclePrice());
      this.downPayment.set(this.initialDownPayment());
      this.tradeInValue.set(this.initialTradeInValue());
      this.interestRate.set(this.initialInterestRate());
      this.loanTermMonths.set(this.initialLoanTermMonths());
      this.paymentFrequency.set(this.initialPaymentFrequency());
    }, 0);
  }

  readonly maxDownPayment = computed(() => {
    return Math.max(0, this.vehiclePrice() * 0.9);
  });

  readonly calculation = computed((): CarLoanCalculation => {
    const principal = Math.max(
      0,
      this.vehiclePrice() - this.downPayment() - this.tradeInValue()
    );
    const annualRate = this.interestRate() / 100;
    const termMonths = this.loanTermMonths();
    const frequency = this.paymentFrequency();

    // Convert to payment frequency
    const paymentsPerYear = frequency === 'monthly' ? 12 : 26;
    const totalPayments =
      frequency === 'monthly' ? termMonths : Math.round((termMonths / 12) * 26);
    const periodicRate = annualRate / paymentsPerYear;

    let paymentAmount: number;

    if (annualRate === 0) {
      // No interest - simple division
      paymentAmount = principal / totalPayments;
    } else {
      // Standard amortization formula: M = P * [r(1+r)^n] / [(1+r)^n - 1]
      const compoundFactor = Math.pow(1 + periodicRate, totalPayments);
      paymentAmount =
        (principal * (periodicRate * compoundFactor)) / (compoundFactor - 1);
    }

    // Handle edge cases
    if (!isFinite(paymentAmount) || isNaN(paymentAmount) || principal <= 0) {
      paymentAmount = 0;
    }

    const totalLoanCost = paymentAmount * totalPayments;
    const totalInterest = Math.max(0, totalLoanCost - principal);

    const result: CarLoanCalculation = {
      paymentAmount: Math.round(paymentAmount * 100) / 100,
      totalLoanCost: Math.round(totalLoanCost * 100) / 100,
      totalInterest: Math.round(totalInterest * 100) / 100,
      numberOfPayments: totalPayments,
      effectiveLoanAmount: principal,
    };

    // Emit calculation change
    this.calculationChange.emit(result);

    return result;
  });

  onApplyClick(): void {
    this.applyClicked.emit(this.calculation());
  }
}
