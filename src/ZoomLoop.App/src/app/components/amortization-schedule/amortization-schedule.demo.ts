import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AmortizationSchedule } from './amortization-schedule';

@Component({
  selector: 'zl-amortization-schedule-demo',
  standalone: true,
  imports: [CommonModule, AmortizationSchedule],
  template: `
    <section class="demo-section">
      <h2>Amortization Schedule Demo</h2>
      
      <div class="demo-controls">
        <h3>Car Loan Example</h3>
        <p>$25,000 loan at 3.9% APR for 60 months</p>
      </div>
      
      <zl-amortization-schedule
        [loanAmount]="25000"
        [interestRate]="3.9"
        [loanTermMonths]="60"
      ></zl-amortization-schedule>

      <div class="demo-controls" style="margin-top: 2rem;">
        <h3>Mortgage Example</h3>
        <p>$400,000 loan at 3.5% APR for 360 months (30 years)</p>
      </div>
      
      <zl-amortization-schedule
        [loanAmount]="400000"
        [interestRate]="3.5"
        [loanTermMonths]="360"
      ></zl-amortization-schedule>

      <div class="demo-controls" style="margin-top: 2rem;">
        <h3>Zero Interest Example</h3>
        <p>$12,000 loan at 0% APR for 24 months</p>
      </div>
      
      <zl-amortization-schedule
        [loanAmount]="12000"
        [interestRate]="0"
        [loanTermMonths]="24"
      ></zl-amortization-schedule>
    </section>
  `,
  styles: [`
    .demo-section {
      max-width: 1200px;
      margin: 2rem auto;
      padding: 2rem;
    }

    .demo-controls {
      margin-bottom: 1rem;
    }

    .demo-controls h3 {
      margin: 0 0 0.5rem 0;
      color: #333;
    }

    .demo-controls p {
      margin: 0;
      color: #666;
    }
  `]
})
export class AmortizationScheduleDemo {}
