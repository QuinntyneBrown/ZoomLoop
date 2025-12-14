import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'zl-summary-card',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DecimalPipe],
  templateUrl: './summary-card.html',
  styleUrl: './summary-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SummaryCard {
  @Input() monthlyPayment = 0;
  @Input() totalPaid = 0;
  @Input() totalInterest = 0;
  @Input() financedPrincipal = 0;
  @Input() term = 0;
  @Input() apr = 0;
  @Input() taxesAndFees = 0;
  @Input() sticky = true;
}
