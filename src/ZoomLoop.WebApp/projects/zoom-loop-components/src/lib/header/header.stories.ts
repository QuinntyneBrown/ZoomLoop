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
    variant: {
      control: 'select',
      options: ['default', 'transparent', 'minimal'],
    },
    sticky: {
      control: 'boolean',
    },
    showSearch: {
      control: 'boolean',
    },
    isLoggedIn: {
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
    variant: 'default',
    sticky: false,
    showSearch: true,
    isLoggedIn: false,
  },
};

export const Transparent: Story = {
  args: {
    logoText: 'ZoomLoop',
    logoInitial: 'Z',
    navItems: sampleNavItems,
    variant: 'transparent',
    sticky: false,
    showSearch: true,
    isLoggedIn: false,
  },
  decorators: [
    (story) => ({
      template: `
        <div style="background: linear-gradient(135deg, #1E40AF, #0F172A); padding: 20px; min-height: 200px;">
          ${story().template || '<ng-container *ngComponentOutlet="story"></ng-container>'}
        </div>
      `,
      props: story().props,
    }),
  ],
};

export const Minimal: Story = {
  args: {
    logoText: 'ZoomLoop',
    logoInitial: 'Z',
    navItems: sampleNavItems,
    variant: 'minimal',
    sticky: false,
    showSearch: false,
    isLoggedIn: false,
  },
};

export const LoggedIn: Story = {
  args: {
    logoText: 'ZoomLoop',
    logoInitial: 'Z',
    navItems: sampleNavItems,
    variant: 'default',
    sticky: false,
    showSearch: true,
    isLoggedIn: true,
    userName: 'John Doe',
  },
};

export const Sticky: Story = {
  args: {
    logoText: 'ZoomLoop',
    logoInitial: 'Z',
    navItems: sampleNavItems,
    variant: 'default',
    sticky: true,
    showSearch: true,
    isLoggedIn: false,
  },
};

export const WithPromoBar: Story = {
  args: {
    logoText: 'ZoomLoop',
    logoInitial: 'Z',
    navItems: sampleNavItems,
    variant: 'default',
    sticky: false,
    showSearch: true,
    isLoggedIn: false,
    showPromoBar: true,
    promoText: 'Holiday Sale! Save up to $2,000 on select vehicles',
    promoIcon: '🎄',
  },
};
