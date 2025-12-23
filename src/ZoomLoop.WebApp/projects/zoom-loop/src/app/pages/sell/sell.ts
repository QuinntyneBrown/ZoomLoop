import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  ButtonComponent,
  HowItWorksComponent,
  TrustBadgesComponent,
  Step
} from 'zoom-loop-components';

@Component({
  selector: 'app-sell',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent, HowItWorksComponent, TrustBadgesComponent],
  templateUrl: './sell.html',
  styleUrl: './sell.scss'
})
export class Sell {
  step = 1;
  isLoading = false;
  valuation: { value: number; low: number; high: number } | null = null;

  vehicle = { year: '', make: '', model: '', mileage: '', condition: 'good' };
  contact = { firstName: '', lastName: '', email: '' };

  years = Array.from({ length: 20 }, (_, i) => 2024 - i);
  makes = ['Honda', 'Toyota', 'Ford', 'Chevrolet', 'Hyundai', 'Kia', 'Nissan', 'Mazda'];
  conditions = ['excellent', 'good', 'fair', 'poor'];

  howItWorksSteps: Step[] = [
    { icon: 'document', number: 1, title: 'Tell Us About Your Car', description: 'Enter your vehicle details for an instant estimate.' },
    { icon: 'dollar', number: 2, title: 'Get Your Offer', description: 'Receive a competitive cash offer in minutes.' },
    { icon: 'car', number: 3, title: 'Get Paid', description: 'Schedule pickup and get paid the same day.' }
  ];

  constructor(private router: Router) {}

  nextStep(): void {
    this.step++;
  }

  prevStep(): void {
    this.step--;
  }

  async submit(): Promise<void> {
    this.isLoading = true;
    await new Promise(r => setTimeout(r, 1500));
    const base = 20000 + Math.random() * 15000;
    this.valuation = {
      value: Math.round(base),
      low: Math.round(base * 0.9),
      high: Math.round(base * 1.1)
    };
    this.isLoading = false;
    this.step = 3;
  }

  formatCurrency(n: number): string {
    return new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', minimumFractionDigits: 0 }).format(n);
  }

  startOver(): void {
    this.step = 1;
    this.valuation = null;
    this.vehicle = { year: '', make: '', model: '', mileage: '', condition: 'good' };
    this.contact = { firstName: '', lastName: '', email: '' };
  }

  browseCars(): void {
    this.router.navigate(['/cars']);
  }
}
