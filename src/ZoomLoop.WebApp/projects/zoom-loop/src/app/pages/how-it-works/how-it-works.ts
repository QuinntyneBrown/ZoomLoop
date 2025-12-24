// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  HowItWorksComponent,
  TrustBadgesComponent,
  ButtonComponent,
  Step
} from 'zoom-loop-components';

@Component({
  selector: 'app-how-it-works',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    HowItWorksComponent,
    TrustBadgesComponent,
    ButtonComponent
  ],
  templateUrl: './how-it-works.html',
  styleUrl: './how-it-works.scss'
})
export class HowItWorks {
  buyingSteps: Step[] = [
    { icon: 'search', number: 1, title: 'Browse & Compare', description: 'Search our inventory of quality vehicles. Filter by make, model, price, and more to find your perfect match.' },
    { icon: 'document', number: 2, title: 'Get Pre-Approved', description: 'Apply for financing online in minutes. Get competitive rates with no impact to your credit score.' },
    { icon: 'car', number: 3, title: 'Schedule Delivery', description: 'Choose home delivery or pickup. Every vehicle comes with a 10-day money-back guarantee.' }
  ];

  sellingSteps: Step[] = [
    { icon: 'document', number: 1, title: 'Tell Us About Your Car', description: 'Enter your vehicle details including make, model, year, and condition for an instant estimate.' },
    { icon: 'dollar', number: 2, title: 'Get Your Offer', description: 'Receive a competitive cash offer in minutes. No haggling, no pressure, just a fair price.' },
    { icon: 'check', number: 3, title: 'Get Paid', description: 'Schedule a convenient pickup time and get paid the same day. It\'s that simple.' }
  ];
}
