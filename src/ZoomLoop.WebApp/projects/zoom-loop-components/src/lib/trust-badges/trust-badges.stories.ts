// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import type { Meta, StoryObj } from '@storybook/angular';
import { TrustBadgesComponent, TrustBadge } from './trust-badges.component';

const defaultBadges: TrustBadge[] = [
  {
    icon: 'check',
    title: '210-Point Inspection',
    description: 'Every car is thoroughly inspected and reconditioned',
  },
  {
    icon: 'truck',
    title: 'Free Delivery',
    description: 'Delivered to your door at no extra cost',
  },
  {
    icon: 'lock',
    title: 'Secure Financing',
    description: 'Pre-approved in minutes with no credit impact',
  },
  {
    icon: 'return',
    title: '10-Day Return',
    description: 'Love it or return it, no questions asked',
  },
];

const extendedBadges: TrustBadge[] = [
  ...defaultBadges,
  {
    icon: 'shield',
    title: 'Warranty Included',
    description: 'Comprehensive coverage for peace of mind',
  },
  {
    icon: 'star',
    title: '4.9 Star Rating',
    description: 'Trusted by thousands of happy customers',
  },
];

const meta: Meta<TrustBadgesComponent> = {
  title: 'Components/Marketing/TrustBadges',
  component: TrustBadgesComponent,
  tags: ['autodocs'],
  argTypes: {
    showDividers: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<TrustBadgesComponent>;

export const Default: Story = {
  args: {
    badges: defaultBadges,
    showDividers: false,
  },
};

export const WithDividers: Story = {
  args: {
    badges: defaultBadges,
    showDividers: true,
  },
};

export const SixBadges: Story = {
  args: {
    badges: extendedBadges,
    showDividers: false,
  },
};

export const TwoBadges: Story = {
  args: {
    badges: [
      {
        icon: 'check',
        title: 'Quality Guaranteed',
        description: 'Every vehicle passes our rigorous inspection',
      },
      {
        icon: 'return',
        title: 'Easy Returns',
        description: 'Not satisfied? Return within 10 days',
      },
    ],
    showDividers: false,
  },
};

export const ThreeBadges: Story = {
  args: {
    badges: [
      {
        icon: 'truck',
        title: 'Free Shipping',
        description: 'Nationwide delivery at no cost',
      },
      {
        icon: 'shield',
        title: 'Protected Purchase',
        description: 'Full warranty coverage included',
      },
      {
        icon: 'star',
        title: 'Top Rated',
        description: 'Highest customer satisfaction',
      },
    ],
    showDividers: true,
  },
};

export const CustomIcons: Story = {
  args: {
    badges: [
      {
        icon: 'shield',
        title: 'Secure Transactions',
        description: 'Your payment information is always protected',
      },
      {
        icon: 'star',
        title: 'Premium Selection',
        description: 'Hand-picked vehicles meeting our high standards',
      },
      {
        icon: 'check',
        title: 'Verified History',
        description: 'Complete vehicle history reports included',
      },
      {
        icon: 'lock',
        title: 'Privacy Protected',
        description: 'Your personal data is never shared',
      },
    ],
    showDividers: false,
  },
};
