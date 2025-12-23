import type { Meta, StoryObj } from '@storybook/angular';
import { fn } from 'storybook/test';
import { CarLoanCalculator } from './car-loan-calculator';

const meta: Meta<CarLoanCalculator> = {
  title: 'Components/CarLoanCalculator',
  component: CarLoanCalculator,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
A comprehensive car loan calculator component that helps users estimate their monthly or bi-weekly car payments.

## Features
- **Vehicle Price**: Adjustable via slider or direct input
- **Down Payment**: Optional down payment that reduces loan amount
- **Trade-in Value**: Value of trade-in vehicle to reduce loan amount
- **Interest Rate (APR)**: Annual percentage rate for the loan
- **Loan Term**: Duration of the loan in months (1-8 years)
- **Payment Frequency**: Choose between monthly or bi-weekly payments

## Outputs
- Payment amount (monthly or bi-weekly)
- Effective loan amount
- Total interest paid
- Total cost of loan
- Number of payments

## Events
- \`calculationChange\`: Emitted when any calculation value changes
- \`applyClicked\`: Emitted when user clicks the apply/pre-approval button
        `,
      },
    },
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'The title displayed at the top of the calculator',
    },
    subtitle: {
      control: 'text',
      description: 'The subtitle/description below the title',
    },
    initialVehiclePrice: {
      control: { type: 'number', min: 5000, max: 100000, step: 1000 },
      description: 'Initial vehicle price value',
    },
    minVehiclePrice: {
      control: { type: 'number', min: 0, max: 50000, step: 1000 },
      description: 'Minimum allowed vehicle price',
    },
    maxVehiclePrice: {
      control: { type: 'number', min: 50000, max: 500000, step: 10000 },
      description: 'Maximum allowed vehicle price',
    },
    initialDownPayment: {
      control: { type: 'number', min: 0, max: 50000, step: 500 },
      description: 'Initial down payment value',
    },
    initialTradeInValue: {
      control: { type: 'number', min: 0, max: 50000, step: 500 },
      description: 'Initial trade-in value',
    },
    maxTradeInValue: {
      control: { type: 'number', min: 10000, max: 100000, step: 5000 },
      description: 'Maximum allowed trade-in value',
    },
    initialInterestRate: {
      control: { type: 'number', min: 0, max: 25, step: 0.1 },
      description: 'Initial interest rate (APR)',
    },
    minInterestRate: {
      control: { type: 'number', min: 0, max: 10, step: 0.5 },
      description: 'Minimum interest rate',
    },
    maxInterestRate: {
      control: { type: 'number', min: 10, max: 50, step: 1 },
      description: 'Maximum interest rate',
    },
    initialLoanTermMonths: {
      control: { type: 'number', min: 12, max: 96, step: 12 },
      description: 'Initial loan term in months',
    },
    minLoanTermMonths: {
      control: { type: 'number', min: 6, max: 24, step: 6 },
      description: 'Minimum loan term in months',
    },
    maxLoanTermMonths: {
      control: { type: 'number', min: 48, max: 120, step: 12 },
      description: 'Maximum loan term in months',
    },
    initialPaymentFrequency: {
      control: 'radio',
      options: ['monthly', 'bi-weekly'],
      description: 'Initial payment frequency',
    },
    showApplyButton: {
      control: 'boolean',
      description: 'Whether to show the apply/pre-approval button',
    },
    applyButtonText: {
      control: 'text',
      description: 'Text for the apply button',
    },
  },
};

export default meta;
type Story = StoryObj<CarLoanCalculator>;

// Default story with standard configuration
export const Default: Story = {
  args: {
    title: 'Car Loan Calculator',
    subtitle: 'Estimate your payment and what you can afford',
    initialVehiclePrice: 25000,
    minVehiclePrice: 5000,
    maxVehiclePrice: 100000,
    initialDownPayment: 0,
    initialTradeInValue: 0,
    maxTradeInValue: 50000,
    initialInterestRate: 8.99,
    minInterestRate: 0,
    maxInterestRate: 25,
    initialLoanTermMonths: 60,
    minLoanTermMonths: 12,
    maxLoanTermMonths: 96,
    initialPaymentFrequency: 'monthly',
    showApplyButton: true,
    applyButtonText: 'Get Pre-Approved',
  },
  render: (args) => ({
    props: {
      ...args,
      onCalculationChange: fn(),
      onApplyClicked: fn(),
    },
    template: `
      <zl-car-loan-calculator
        [title]="title"
        [subtitle]="subtitle"
        [initialVehiclePrice]="initialVehiclePrice"
        [minVehiclePrice]="minVehiclePrice"
        [maxVehiclePrice]="maxVehiclePrice"
        [initialDownPayment]="initialDownPayment"
        [initialTradeInValue]="initialTradeInValue"
        [maxTradeInValue]="maxTradeInValue"
        [initialInterestRate]="initialInterestRate"
        [minInterestRate]="minInterestRate"
        [maxInterestRate]="maxInterestRate"
        [initialLoanTermMonths]="initialLoanTermMonths"
        [minLoanTermMonths]="minLoanTermMonths"
        [maxLoanTermMonths]="maxLoanTermMonths"
        [initialPaymentFrequency]="initialPaymentFrequency"
        [showApplyButton]="showApplyButton"
        [applyButtonText]="applyButtonText"
        (calculationChange)="onCalculationChange($event)"
        (applyClicked)="onApplyClicked($event)"
      />
    `,
  }),
};

// Pre-configured with down payment
export const WithDownPayment: Story = {
  args: {
    ...Default.args,
    initialVehiclePrice: 30000,
    initialDownPayment: 5000,
    initialInterestRate: 7.5,
    initialLoanTermMonths: 48,
  },
  render: Default.render,
};

// Pre-configured with trade-in
export const WithTradeIn: Story = {
  args: {
    ...Default.args,
    initialVehiclePrice: 35000,
    initialTradeInValue: 8000,
    initialInterestRate: 6.99,
    initialLoanTermMonths: 60,
  },
  render: Default.render,
};

// Bi-weekly payment example
export const BiWeeklyPayments: Story = {
  args: {
    ...Default.args,
    initialVehiclePrice: 25000,
    initialPaymentFrequency: 'bi-weekly',
    title: 'Bi-Weekly Payment Calculator',
    subtitle: 'Pay less interest with more frequent payments',
  },
  render: Default.render,
};

// Low interest rate scenario (promotional rate)
export const PromotionalRate: Story = {
  args: {
    ...Default.args,
    initialVehiclePrice: 40000,
    initialInterestRate: 0.99,
    minInterestRate: 0,
    maxInterestRate: 10,
    title: 'Special Financing Offer',
    subtitle: '0.99% APR for qualified buyers',
  },
  render: Default.render,
};

// High value vehicle
export const LuxuryVehicle: Story = {
  args: {
    ...Default.args,
    initialVehiclePrice: 75000,
    minVehiclePrice: 50000,
    maxVehiclePrice: 200000,
    initialDownPayment: 15000,
    initialInterestRate: 5.99,
    initialLoanTermMonths: 72,
    maxLoanTermMonths: 84,
    title: 'Luxury Vehicle Financing',
    subtitle: 'Premium financing options for high-end vehicles',
  },
  render: Default.render,
};

// Used car / budget option
export const BudgetVehicle: Story = {
  args: {
    ...Default.args,
    initialVehiclePrice: 12000,
    minVehiclePrice: 3000,
    maxVehiclePrice: 25000,
    initialInterestRate: 12.99,
    initialLoanTermMonths: 36,
    maxLoanTermMonths: 60,
    title: 'Used Car Calculator',
    subtitle: 'Affordable financing for pre-owned vehicles',
  },
  render: Default.render,
};

// No apply button (information only)
export const InformationOnly: Story = {
  args: {
    ...Default.args,
    showApplyButton: false,
    title: 'Loan Estimator',
    subtitle: 'For informational purposes only',
  },
  render: Default.render,
};

// Custom apply button text
export const CustomApplyButton: Story = {
  args: {
    ...Default.args,
    applyButtonText: 'Start My Application',
    title: 'Ready to Finance?',
    subtitle: 'Get approved in minutes',
  },
  render: Default.render,
};

// Complete example with all options filled
export const CompleteExample: Story = {
  args: {
    ...Default.args,
    initialVehiclePrice: 28500,
    initialDownPayment: 3500,
    initialTradeInValue: 5000,
    initialInterestRate: 6.49,
    initialLoanTermMonths: 60,
    initialPaymentFrequency: 'monthly',
    title: 'Your Car Loan',
    subtitle: 'Financing made simple',
    applyButtonText: 'Apply Now',
  },
  render: Default.render,
};

// Minimal configuration
export const Minimal: Story = {
  args: {
    title: 'Quick Calculator',
    subtitle: '',
    initialVehiclePrice: 20000,
    initialInterestRate: 8.99,
    initialLoanTermMonths: 60,
    showApplyButton: false,
  },
  render: Default.render,
};
