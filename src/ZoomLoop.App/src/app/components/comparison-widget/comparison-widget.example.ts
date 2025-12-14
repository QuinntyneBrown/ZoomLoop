import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComparisonWidget, LoanScenario } from './comparison-widget';

@Component({
  selector: 'zl-comparison-widget-example',
  standalone: true,
  imports: [CommonModule, ComparisonWidget],
  template: `
    <div class="example-container">
      <h2>Comparison Widget Example</h2>
      <p>Compare different loan terms and rates to find the best option for you.</p>
      
      <zl-comparison-widget
        [primaryScenario]="primaryScenario"
        [secondaryScenario]="secondaryScenario"
        [(activeScenario)]="activeScenario"
        (scenarioSwitch)="onScenarioSwitch($event)"
        (activeScenarioChange)="onActiveScenarioChange($event)"
      ></zl-comparison-widget>

      <div class="example-info">
        <h3>Current Active Scenario: {{ activeScenario }}</h3>
        <div class="scenario-details">
          <div class="detail-card">
            <h4>Primary Scenario</h4>
            <ul>
              <li>Term: {{ primaryScenario.term }} months ({{ primaryScenario.term / 12 }} years)</li>
              <li>Rate: {{ primaryScenario.rate }}%</li>
              <li>Principal: ${{ primaryScenario.principal.toLocaleString() }}</li>
            </ul>
          </div>
          <div class="detail-card">
            <h4>Secondary Scenario</h4>
            <ul>
              <li>Term: {{ secondaryScenario.term }} months ({{ secondaryScenario.term / 12 }} years)</li>
              <li>Rate: {{ secondaryScenario.rate }}%</li>
              <li>Principal: ${{ secondaryScenario.principal.toLocaleString() }}</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="example-actions">
        <h3>Try Different Scenarios</h3>
        <button (click)="useShortTermLowRate()">Short Term (36 mo @ 4.0%)</button>
        <button (click)="useMediumTermMidRate()">Medium Term (60 mo @ 5.0%)</button>
        <button (click)="useLongTermHighRate()">Long Term (72 mo @ 6.5%)</button>
      </div>
    </div>
  `,
  styles: [`
    .example-container {
      max-width: 1200px;
      margin: 2rem auto;
      padding: 2rem;
    }

    h2 {
      font-size: 2rem;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 0.5rem;
    }

    p {
      color: #6b7280;
      margin-bottom: 2rem;
    }

    .example-info {
      margin-top: 2rem;
      padding: 1.5rem;
      background: #f9fafb;
      border-radius: 8px;
    }

    h3 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 1rem;
    }

    h4 {
      font-size: 1rem;
      font-weight: 600;
      color: #374151;
      margin-bottom: 0.5rem;
    }

    .scenario-details {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin-top: 1rem;
    }

    .detail-card {
      background: #ffffff;
      padding: 1rem;
      border-radius: 6px;
      border: 1px solid #e5e7eb;
    }

    ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    li {
      padding: 0.25rem 0;
      color: #4b5563;
    }

    .example-actions {
      margin-top: 2rem;
      padding: 1.5rem;
      background: #eff6ff;
      border-radius: 8px;
      border: 1px solid #bfdbfe;
    }

    .example-actions button {
      margin: 0.5rem 0.5rem 0.5rem 0;
      padding: 0.75rem 1.5rem;
      background: #0066cc;
      color: #ffffff;
      border: none;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.2s ease;
    }

    .example-actions button:hover {
      background: #0052a3;
    }

    @media (max-width: 768px) {
      .scenario-details {
        grid-template-columns: 1fr;
      }

      .example-actions button {
        display: block;
        width: 100%;
        margin: 0.5rem 0;
      }
    }
  `]
})
export class ComparisonWidgetExample {
  primaryScenario: LoanScenario = {
    term: 60,
    rate: 5.0,
    principal: 30000
  };

  secondaryScenario: LoanScenario = {
    term: 48,
    rate: 4.5,
    principal: 30000
  };

  activeScenario: 'primary' | 'secondary' = 'primary';

  onScenarioSwitch(event: { primary: LoanScenario; secondary: LoanScenario }): void {
    this.primaryScenario = event.primary;
    this.secondaryScenario = event.secondary;
    console.log('Scenarios switched:', event);
  }

  onActiveScenarioChange(scenario: 'primary' | 'secondary'): void {
    this.activeScenario = scenario;
    console.log('Active scenario changed to:', scenario);
  }

  useShortTermLowRate(): void {
    this.secondaryScenario = {
      term: 36,
      rate: 4.0,
      principal: 30000
    };
  }

  useMediumTermMidRate(): void {
    this.secondaryScenario = {
      term: 60,
      rate: 5.0,
      principal: 30000
    };
  }

  useLongTermHighRate(): void {
    this.secondaryScenario = {
      term: 72,
      rate: 6.5,
      principal: 30000
    };
  }
}
