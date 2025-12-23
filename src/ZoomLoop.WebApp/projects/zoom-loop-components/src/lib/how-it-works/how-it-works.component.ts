import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Step {
  icon: 'search' | 'document' | 'car' | 'check' | 'dollar';
  number: number;
  title: string;
  description: string;
}

@Component({
  selector: 'zl-how-it-works',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './how-it-works.component.html',
  styleUrl: './how-it-works.component.scss'
})
export class HowItWorksComponent {
  @Input() title = 'How It Works';
  @Input() subtitle = 'Buy your next car in 3 simple steps';
  @Input() steps: Step[] = [
    {
      icon: 'search',
      number: 1,
      title: 'Browse & Choose',
      description: 'Search our inventory of 1,000+ quality used vehicles. Every car comes with a detailed inspection report and CARFAX history.'
    },
    {
      icon: 'document',
      number: 2,
      title: 'Finance Online',
      description: 'Get pre-approved for financing in minutes with no impact to your credit. See transparent pricing with no hidden fees.'
    },
    {
      icon: 'car',
      number: 3,
      title: 'Get It Delivered',
      description: 'We deliver your car right to your door. Enjoy a 10-day/750km money-back guarantee to make sure you love it.'
    }
  ];

  private titleIdValue = `how-it-works-${Math.random().toString(36).substr(2, 9)}`;

  get titleId(): string {
    return this.titleIdValue;
  }
}
