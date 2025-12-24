// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import type { Meta, StoryObj } from '@storybook/angular';
import { ButtonComponent } from './button.component';

const meta: Meta<ButtonComponent> = {
  title: 'Components/Core/Button',
  component: ButtonComponent,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'danger'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    disabled: {
      control: 'boolean',
    },
    loading: {
      control: 'boolean',
    },
    fullWidth: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<ButtonComponent>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    disabled: false,
    loading: false,
    fullWidth: false,
  },
  render: (args) => ({
    props: args,
    template: `<zl-button [variant]="variant" [size]="size" [disabled]="disabled" [loading]="loading" [fullWidth]="fullWidth">Primary Button</zl-button>`,
  }),
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    size: 'md',
  },
  render: (args) => ({
    props: args,
    template: `<zl-button [variant]="variant" [size]="size">Secondary Button</zl-button>`,
  }),
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    size: 'md',
  },
  render: (args) => ({
    props: args,
    template: `<zl-button [variant]="variant" [size]="size">Outline Button</zl-button>`,
  }),
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    size: 'md',
  },
  render: (args) => ({
    props: args,
    template: `<zl-button [variant]="variant" [size]="size">Ghost Button</zl-button>`,
  }),
};

export const Danger: Story = {
  args: {
    variant: 'danger',
    size: 'md',
  },
  render: (args) => ({
    props: args,
    template: `<zl-button [variant]="variant" [size]="size">Danger Button</zl-button>`,
  }),
};

export const Loading: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    loading: true,
  },
  render: (args) => ({
    props: args,
    template: `<zl-button [variant]="variant" [size]="size" [loading]="loading">Loading...</zl-button>`,
  }),
};

export const Disabled: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    disabled: true,
  },
  render: (args) => ({
    props: args,
    template: `<zl-button [variant]="variant" [size]="size" [disabled]="disabled">Disabled Button</zl-button>`,
  }),
};

export const FullWidth: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    fullWidth: true,
  },
  render: (args) => ({
    props: args,
    template: `<zl-button [variant]="variant" [size]="size" [fullWidth]="fullWidth">Full Width Button</zl-button>`,
  }),
};

export const AllVariants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 12px; flex-wrap: wrap;">
        <zl-button variant="primary">Primary</zl-button>
        <zl-button variant="secondary">Secondary</zl-button>
        <zl-button variant="outline">Outline</zl-button>
        <zl-button variant="ghost">Ghost</zl-button>
        <zl-button variant="danger">Danger</zl-button>
      </div>
    `,
  }),
};

export const AllSizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 12px; align-items: center;">
        <zl-button variant="primary" size="sm">Small</zl-button>
        <zl-button variant="primary" size="md">Medium</zl-button>
        <zl-button variant="primary" size="lg">Large</zl-button>
      </div>
    `,
  }),
};
