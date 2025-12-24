// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import type { Meta, StoryObj } from '@storybook/angular';
import { HowItWorksComponent, Step } from './how-it-works.component';

const defaultSteps: Step[] = [
  {
    icon: 'search',
    number: 1,
    title: 'Browse & Choose',
    description: 'Search our inventory of 1,000+ quality used vehicles. Every car comes with a detailed inspection report and CARFAX history.',
  },
  {
    icon: 'document',
    number: 2,
    title: 'Finance Online',
    description: 'Get pre-approved for financing in minutes with no impact to your credit. See transparent pricing with no hidden fees.',
  },
  {
    icon: 'car',
    number: 3,
    title: 'Get It Delivered',
    description: "We deliver your car right to your door. Enjoy a 10-day/750km money-back guarantee to make sure you love it.",
  },
];

const sellingSteps: Step[] = [
  {
    icon: 'dollar',
    number: 1,
    title: 'Get an Instant Offer',
    description: 'Enter your vehicle details and receive a competitive offer in minutes. No haggling, no pressure.',
  },
  {
    icon: 'check',
    number: 2,
    title: 'Schedule Pickup',
    description: "Choose a convenient time and we'll come to you. Our team handles all the paperwork.",
  },
  {
    icon: 'dollar',
    number: 3,
    title: 'Get Paid Fast',
    description: 'Receive payment on the spot when we pick up your vehicle. Quick, easy, and hassle-free.',
  },
];

const meta: Meta<HowItWorksComponent> = {
  title: 'Components/Marketing/HowItWorks',
  component: HowItWorksComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<HowItWorksComponent>;

export const Default: Story = {
  args: {
    title: 'How It Works',
    subtitle: 'Buy your next car in 3 simple steps',
    steps: defaultSteps,
  },
};

export const SellingProcess: Story = {
  args: {
    title: 'Sell Your Car',
    subtitle: 'Get the best price with zero hassle',
    steps: sellingSteps,
  },
};

export const CustomTitle: Story = {
  args: {
    title: 'Easy as 1-2-3',
    subtitle: 'Getting your dream car has never been simpler',
    steps: defaultSteps,
  },
};

export const FourSteps: Story = {
  args: {
    title: 'Complete Process',
    subtitle: 'From browsing to driving',
    steps: [
      ...defaultSteps,
      {
        icon: 'check',
        number: 4,
        title: 'Enjoy Your Ride',
        description: 'Hit the road with confidence knowing you have our full support and warranty coverage.',
      },
    ],
  },
};

export const TwoSteps: Story = {
  args: {
    title: 'Quick & Easy',
    subtitle: 'Just two steps to get started',
    steps: [
      {
        icon: 'search',
        number: 1,
        title: 'Find Your Car',
        description: 'Browse our extensive inventory and find the perfect vehicle for your needs.',
      },
      {
        icon: 'car',
        number: 2,
        title: 'Get It Delivered',
        description: "Complete your purchase online and we'll deliver your car to your doorstep.",
      },
    ],
  },
};
