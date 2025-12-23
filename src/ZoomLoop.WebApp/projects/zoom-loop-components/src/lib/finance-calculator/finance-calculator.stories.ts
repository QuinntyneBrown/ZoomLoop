import type { Meta, StoryObj } from '@storybook/angular';
import { FinanceCalculatorComponent } from './finance-calculator.component';

const meta: Meta<FinanceCalculatorComponent> = {
  title: 'Components/Vehicle/FinanceCalculator',
  component: FinanceCalculatorComponent,
  tags: ['autodocs'],
  argTypes: {
    vehiclePrice: {
      control: { type: 'number', min: 5000, max: 100000, step: 1000 },
    },
    defaultDownPayment: {
      control: { type: 'number', min: 0, max: 50000, step: 500 },
    },
    defaultLoanTerm: {
      control: { type: 'number', min: 24, max: 84, step: 12 },
    },
    defaultInterestRate: {
      control: { type: 'number', min: 0, max: 20, step: 0.5 },
    },
  },
};

export default meta;
type Story = StoryObj<FinanceCalculatorComponent>;

export const Default: Story = {
  args: {
    title: 'Estimate Your Payment',
    vehiclePrice: 24500,
    defaultDownPayment: 2500,
    defaultLoanTerm: 60,
    defaultInterestRate: 6.99,
    ctaText: 'Get Pre-Approved',
  },
};

export const LuxuryVehicle: Story = {
  args: {
    title: 'Estimate Your Payment',
    vehiclePrice: 75000,
    defaultDownPayment: 15000,
    defaultLoanTerm: 72,
    defaultInterestRate: 5.49,
    ctaText: 'Get Pre-Approved',
  },
};

export const BudgetVehicle: Story = {
  args: {
    title: 'Estimate Your Payment',
    vehiclePrice: 12000,
    defaultDownPayment: 1000,
    defaultLoanTerm: 48,
    defaultInterestRate: 7.99,
    ctaText: 'Get Pre-Approved',
  },
};

export const ZeroDown: Story = {
  args: {
    title: 'Zero Down Payment',
    vehiclePrice: 30000,
    defaultDownPayment: 0,
    defaultLoanTerm: 60,
    defaultInterestRate: 6.99,
    ctaText: 'Apply Now',
  },
};

export const ShortTerm: Story = {
  args: {
    title: 'Quick Payoff Plan',
    vehiclePrice: 24500,
    defaultDownPayment: 5000,
    defaultLoanTerm: 24,
    defaultInterestRate: 5.99,
    ctaText: 'Get Pre-Approved',
  },
};

export const LongTerm: Story = {
  args: {
    title: 'Low Monthly Payments',
    vehiclePrice: 35000,
    defaultDownPayment: 3500,
    defaultLoanTerm: 84,
    defaultInterestRate: 6.49,
    ctaText: 'Get Pre-Approved',
  },
};

export const CustomCTA: Story = {
  args: {
    title: 'Calculate Your Budget',
    vehiclePrice: 28000,
    defaultDownPayment: 2800,
    defaultLoanTerm: 60,
    defaultInterestRate: 6.99,
    ctaText: 'Check Your Rate',
  },
};
