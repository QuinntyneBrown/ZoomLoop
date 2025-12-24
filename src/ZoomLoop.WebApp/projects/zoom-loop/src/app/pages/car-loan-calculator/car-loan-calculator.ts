// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinanceCalculatorComponent, FinanceBreakdown } from 'zoom-loop-components';

@Component({
  selector: 'app-car-loan-calculator',
  standalone: true,
  imports: [CommonModule, FinanceCalculatorComponent],
  templateUrl: './car-loan-calculator.html',
  styleUrl: './car-loan-calculator.scss'
})
export class CarLoanCalculator {
  onPreApprovalClick(breakdown: FinanceBreakdown): void {
    console.log('Pre-approval clicked with breakdown:', breakdown);
  }

  onCalculationChange(breakdown: FinanceBreakdown): void {
    console.log('Calculation changed:', breakdown);
  }
}
