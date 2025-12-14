// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, computed, signal } from '@angular/core';

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
  private primaryScenarioSignal = signal<LoanScenario | undefined>(undefined);
  private secondaryScenarioSignal = signal<LoanScenario | undefined>(undefined);
  private activeScenarioSignal = signal<'primary' | 'secondary'>('primary');

  @Input() 
  set primaryScenario(value: LoanScenario | undefined) {
    this.primaryScenarioSignal.set(value);
  }
  get primaryScenario(): LoanScenario | undefined {
    return this.primaryScenarioSignal();
  }

  @Input() 
  set secondaryScenario(value: LoanScenario | undefined) {
    this.secondaryScenarioSignal.set(value);
  }
  get secondaryScenario(): LoanScenario | undefined {
    return this.secondaryScenarioSignal();
  }

  @Input() 
  set activeScenario(value: 'primary' | 'secondary') {
    this.activeScenarioSignal.set(value);
  }
  get activeScenario(): 'primary' | 'secondary' {
    return this.activeScenarioSignal();
  }
  
  @Output() scenarioSwitch = new EventEmitter<{ primary: LoanScenario; secondary: LoanScenario }>();
  @Output() activeScenarioChange = new EventEmitter<'primary' | 'secondary'>();

  primaryComparison = computed(() => {
    const scenario = this.primaryScenarioSignal();
    if (!scenario) return null;

    const monthlyPayment = this.calculateMonthlyPayment(scenario);
    const totalInterest = this.calculateTotalInterest(scenario);
    
    return {
      monthlyPayment,
      totalInterest,
      totalPaid: monthlyPayment * scenario.term
    };
  });

  secondaryComparison = computed(() => {
    const scenario = this.secondaryScenarioSignal();
    if (!scenario) return null;

    const monthlyPayment = this.calculateMonthlyPayment(scenario);
    const totalInterest = this.calculateTotalInterest(scenario);
    
    return {
      monthlyPayment,
      totalInterest,
      totalPaid: monthlyPayment * scenario.term
    };
  });

  monthlyPaymentDelta = computed(() => {
    const primary = this.primaryComparison();
    const secondary = this.secondaryComparison();
    
    if (!primary || !secondary) return 0;
    return secondary.monthlyPayment - primary.monthlyPayment;
  });

  totalInterestDelta = computed(() => {
    const primary = this.primaryComparison();
    const secondary = this.secondaryComparison();
    
    if (!primary || !secondary) return 0;
    return secondary.totalInterest - primary.totalInterest;
  });

  calculateMonthlyPayment(scenario: LoanScenario): number {
    if (!scenario || scenario.term <= 0 || scenario.rate < 0 || scenario.principal <= 0) {
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
