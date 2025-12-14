import { Component } from '@angular/core';
import { SummaryCard } from './summary-card';

/**
 * Demo component demonstrating the SummaryCard component usage.
 * This shows various use cases for displaying loan summary information.
 */
@Component({
  selector: 'zl-summary-card-demo',
  standalone: true,
  imports: [SummaryCard],
  template: `
    <div class="summary-card-demo">
      <h1>Summary Card Component Examples</h1>

      <!-- Example 1: Typical Car Loan -->
      <section>
        <h2>Example 1: Typical Car Loan</h2>
        <p>60-month auto loan with moderate APR</p>
        <zl-summary-card
          [monthlyPayment]="450.50"
          [totalPaid]="27030"
          [totalInterest]="2030"
          [financedPrincipal]="25000"
          [term]="60"
          [apr]="4.5"
          [taxesAndFees]="1500"
          [sticky]="false"
        ></zl-summary-card>
      </section>

      <!-- Example 2: Low Interest Loan -->
      <section>
        <h2>Example 2: Low Interest Promotional Loan</h2>
        <p>48-month loan with low promotional APR</p>
        <zl-summary-card
          [monthlyPayment]="565.25"
          [totalPaid]="27132"
          [totalInterest]="1132"
          [financedPrincipal]="26000"
          [term]="48"
          [apr]="1.9"
          [taxesAndFees]="2000"
          [sticky]="false"
        ></zl-summary-card>
      </section>

      <!-- Example 3: Extended Term Loan -->
      <section>
        <h2>Example 3: Extended Term Loan</h2>
        <p>72-month loan with higher total interest due to longer term</p>
        <zl-summary-card
          [monthlyPayment]="525.00"
          [totalPaid]="37800"
          [totalInterest]="7800"
          [financedPrincipal]="30000"
          [term]="72"
          [apr]="5.9"
          [taxesAndFees]="2500"
          [sticky]="false"
        ></zl-summary-card>
      </section>

      <!-- Example 4: High-End Vehicle Financing -->
      <section>
        <h2>Example 4: High-End Vehicle Financing</h2>
        <p>60-month loan for luxury vehicle with higher amounts</p>
        <zl-summary-card
          [monthlyPayment]="1234.56"
          [totalPaid]="74073.60"
          [totalInterest]="9073.60"
          [financedPrincipal]="65000"
          [term]="60"
          [apr]="3.9"
          [taxesAndFees]="5000"
          [sticky]="false"
        ></zl-summary-card>
      </section>

      <!-- Example 5: Sticky Behavior Demo -->
      <section>
        <h2>Example 5: Sticky Card (Desktop Only)</h2>
        <p>This card will stick to the top when scrolling on desktop viewports</p>
        <div class="sticky-demo-container">
          <div class="content-column">
            <div class="demo-content">
              <h3>Loan Application Details</h3>
              <p>
                This section simulates a longer form or content area. As you
                scroll down, the summary card on the right will stick to the
                viewport on desktop devices, making it easy to reference the
                loan details while reviewing other information.
              </p>
              <div class="demo-block">
                <h4>Personal Information</h4>
                <p>Name, address, contact details would go here...</p>
              </div>
              <div class="demo-block">
                <h4>Employment Details</h4>
                <p>Job title, employer, income information...</p>
              </div>
              <div class="demo-block">
                <h4>Vehicle Details</h4>
                <p>Make, model, year, VIN number...</p>
              </div>
              <div class="demo-block">
                <h4>Trade-In Information</h4>
                <p>Current vehicle details and value...</p>
              </div>
              <div class="demo-block">
                <h4>Additional Options</h4>
                <p>Extended warranty, gap insurance, accessories...</p>
              </div>
              <div class="demo-block">
                <h4>Supporting Documents</h4>
                <p>Driver's license, proof of insurance, pay stubs...</p>
              </div>
            </div>
          </div>
          <div class="summary-column">
            <zl-summary-card
              [monthlyPayment]="650.00"
              [totalPaid]="39000"
              [totalInterest]="4000"
              [financedPrincipal]="35000"
              [term]="60"
              [apr]="4.2"
              [taxesAndFees]="2000"
              [sticky]="true"
            ></zl-summary-card>
          </div>
        </div>
      </section>

      <!-- Example 6: Zero Interest Financing -->
      <section>
        <h2>Example 6: Zero Interest Financing</h2>
        <p>Special 0% APR promotional financing</p>
        <zl-summary-card
          [monthlyPayment]="500.00"
          [totalPaid]="24000"
          [totalInterest]="0"
          [financedPrincipal]="24000"
          [term]="48"
          [apr]="0"
          [taxesAndFees]="1800"
          [sticky]="false"
        ></zl-summary-card>
      </section>
    </div>
  `,
  styles: [
    `
      .summary-card-demo {
        padding: 2rem;
        max-width: 1400px;
        margin: 0 auto;
        background: #f9fafb;
        min-height: 100vh;
      }

      h1 {
        font-size: 2rem;
        margin-bottom: 2rem;
        color: #111827;
        font-weight: 700;
      }

      h2 {
        font-size: 1.5rem;
        margin: 0 0 0.5rem;
        color: #374151;
        font-weight: 600;
      }

      h3 {
        font-size: 1.25rem;
        margin-bottom: 1rem;
        color: #111827;
        font-weight: 600;
      }

      h4 {
        font-size: 1.125rem;
        margin-bottom: 0.5rem;
        color: #374151;
        font-weight: 600;
      }

      p {
        color: #6b7280;
        margin-bottom: 1rem;
        font-size: 0.875rem;
        line-height: 1.5;
      }

      section {
        margin-bottom: 3rem;
        padding: 2rem;
        background: #ffffff;
        border-radius: 12px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }

      .sticky-demo-container {
        display: grid;
        grid-template-columns: 1fr 400px;
        gap: 2rem;
        margin-top: 1.5rem;
      }

      .content-column {
        min-width: 0;
      }

      .summary-column {
        min-width: 0;
      }

      .demo-content {
        background: #f9fafb;
        padding: 1.5rem;
        border-radius: 8px;
      }

      .demo-block {
        background: #ffffff;
        padding: 1.5rem;
        border-radius: 8px;
        margin-bottom: 1rem;
        border: 1px solid #e5e7eb;
      }

      .demo-block p {
        margin: 0;
      }

      @media (max-width: 1024px) {
        .sticky-demo-container {
          grid-template-columns: 1fr;
        }

        .summary-column {
          order: -1;
        }
      }

      @media (max-width: 640px) {
        .summary-card-demo {
          padding: 1rem;
        }

        section {
          padding: 1.5rem;
        }

        h1 {
          font-size: 1.5rem;
        }

        h2 {
          font-size: 1.25rem;
        }
      }
    `,
  ],
})
export class SummaryCardDemo {}
