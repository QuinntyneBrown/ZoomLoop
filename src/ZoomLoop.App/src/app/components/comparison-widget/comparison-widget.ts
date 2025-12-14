// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

export interface LoanScenario {
  term: number; // in months
  rate: number; // annual interest rate as percentage
  principal: number; // loan amount
}

export interface LoanComparison {
  monthlyPayment: number;
  totalInterest: number;
  totalPaid: number;
}

@Component({
  selector: 'zl-comparison-widget',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './comparison-widget.html',
  styleUrl: './comparison-widget.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComparisonWidget {
  @Input() primaryScenario?: LoanScenario;
  @Input() secondaryScenario?: LoanScenario;
  @Input() activeScenario: 'primary' | 'secondary' = 'primary';
  
  @Output() scenarioSwitch = new EventEmitter<{ primary: LoanScenario; secondary: LoanScenario }>();
  @Output() activeScenarioChange = new EventEmitter<'primary' | 'secondary'>();

  calculateMonthlyPayment(scenario: LoanScenario): number {
    if (!scenario || scenario.term <= 0 || scenario.rate < 0) {
      return 0;
    }

    const monthlyRate = scenario.rate / 100 / 12;
    
    // If rate is 0, simple division
    if (monthlyRate === 0) {
      return scenario.principal / scenario.term;
    }

    // Standard loan payment formula: P * [r(1+r)^n] / [(1+r)^n - 1]
    const payment = scenario.principal * 
      (monthlyRate * Math.pow(1 + monthlyRate, scenario.term)) / 
      (Math.pow(1 + monthlyRate, scenario.term) - 1);
    
    return payment;
  }

  calculateTotalInterest(scenario: LoanScenario): number {
    if (!scenario) {
      return 0;
    }

    const monthlyPayment = this.calculateMonthlyPayment(scenario);
    const totalPaid = monthlyPayment * scenario.term;
    return totalPaid - scenario.principal;
  }

  getPrimaryComparison(): LoanComparison | null {
    if (!this.primaryScenario) {
      return null;
    }

    const monthlyPayment = this.calculateMonthlyPayment(this.primaryScenario);
    const totalInterest = this.calculateTotalInterest(this.primaryScenario);
    
    return {
      monthlyPayment,
      totalInterest,
      totalPaid: monthlyPayment * this.primaryScenario.term
    };
  }

  getSecondaryComparison(): LoanComparison | null {
    if (!this.secondaryScenario) {
      return null;
    }

    const monthlyPayment = this.calculateMonthlyPayment(this.secondaryScenario);
    const totalInterest = this.calculateTotalInterest(this.secondaryScenario);
    
    return {
      monthlyPayment,
      totalInterest,
      totalPaid: monthlyPayment * this.secondaryScenario.term
    };
  }

  getMonthlyPaymentDelta(): number {
    const primary = this.getPrimaryComparison();
    const secondary = this.getSecondaryComparison();
    
    if (!primary || !secondary) {
      return 0;
    }

    return secondary.monthlyPayment - primary.monthlyPayment;
  }

  getTotalInterestDelta(): number {
    const primary = this.getPrimaryComparison();
    const secondary = this.getSecondaryComparison();
    
    if (!primary || !secondary) {
      return 0;
    }

    return secondary.totalInterest - primary.totalInterest;
  }

  switchScenarios(): void {
    if (this.primaryScenario && this.secondaryScenario) {
      this.scenarioSwitch.emit({
        primary: this.secondaryScenario,
        secondary: this.primaryScenario
      });
    }
  }

  setActiveScenario(scenario: 'primary' | 'secondary'): void {
    if (this.activeScenario !== scenario) {
      this.activeScenarioChange.emit(scenario);
    }
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  }

  formatPercentage(value: number): string {
    return `${value.toFixed(2)}%`;
  }
}
