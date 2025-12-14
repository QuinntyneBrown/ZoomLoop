// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

export interface LoanCalculation {
  price: number;
  downPayment: number;
  tradeInValue: number;
  apr: number;
  termMonths: number;
  monthlyPayment?: number;
  totalInterest?: number;
  totalCost?: number;
}

export const LOAN_TERM_OPTIONS = [36, 48, 60, 72, 84];
