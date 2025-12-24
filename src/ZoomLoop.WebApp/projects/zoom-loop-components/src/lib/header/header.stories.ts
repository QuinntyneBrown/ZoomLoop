// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import type { Meta, StoryObj } from '@storybook/angular';
import { HeaderComponent, NavItem } from './header.component';

const sampleNavItems: NavItem[] = [
  { label: 'Browse Cars', href: '/browse' },
  { label: 'Sell Your Car', href: '/sell' },
  { label: 'Financing', href: '/financing' },
  { label: 'How It Works', href: '/how-it-works' },
];

const meta: Meta<HeaderComponent> = {
  title: 'Components/Layout/Header',
  component: HeaderComponent,
  tags: ['autodocs'],
  argTypes: {
    scrolled: {
      control: 'boolean',
    },
    isLoggedIn: {
      control: 'boolean',
    },
    showAuthButtons: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<HeaderComponent>;

export const Default: Story = {
  args: {
    logoText: 'ZoomLoop',
    logoInitial: 'Z',
    navItems: sampleNavItems,
    scrolled: false,
    isLoggedIn: false,
    showAuthButtons: true,
  },
};

export const Scrolled: Story = {
  args: {
    logoText: 'ZoomLoop',
    logoInitial: 'Z',
    navItems: sampleNavItems,
    scrolled: true,
    isLoggedIn: false,
    showAuthButtons: true,
  },
};

export const LoggedIn: Story = {
  args: {
    logoText: 'ZoomLoop',
    logoInitial: 'Z',
    navItems: sampleNavItems,
    scrolled: false,
    isLoggedIn: true,
    userInitials: 'JD',
    showAuthButtons: false,
  },
};

export const WithoutAuthButtons: Story = {
  args: {
    logoText: 'ZoomLoop',
    logoInitial: 'Z',
    navItems: sampleNavItems,
    scrolled: false,
    isLoggedIn: false,
    showAuthButtons: false,
  },
};
