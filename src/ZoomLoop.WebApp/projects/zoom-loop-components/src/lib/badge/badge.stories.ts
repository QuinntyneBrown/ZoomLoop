import type { Meta, StoryObj } from '@storybook/angular';
import { BadgeComponent } from './badge.component';

const meta: Meta<BadgeComponent> = {
  title: 'Components/Core/Badge',
  component: BadgeComponent,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'danger', 'info', 'outline'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    pill: {
      control: 'boolean',
    },
    removable: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<BadgeComponent>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    pill: false,
    removable: false,
  },
  render: (args) => ({
    props: args,
    template: `<zl-badge [variant]="variant" [size]="size" [pill]="pill" [removable]="removable">Badge</zl-badge>`,
  }),
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    size: 'md',
  },
  render: (args) => ({
    props: args,
    template: `<zl-badge [variant]="variant" [size]="size">Secondary</zl-badge>`,
  }),
};

export const Success: Story = {
  args: {
    variant: 'success',
    size: 'md',
  },
  render: (args) => ({
    props: args,
    template: `<zl-badge [variant]="variant" [size]="size">Success</zl-badge>`,
  }),
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    size: 'md',
  },
  render: (args) => ({
    props: args,
    template: `<zl-badge [variant]="variant" [size]="size">Warning</zl-badge>`,
  }),
};

export const Danger: Story = {
  args: {
    variant: 'danger',
    size: 'md',
  },
  render: (args) => ({
    props: args,
    template: `<zl-badge [variant]="variant" [size]="size">Danger</zl-badge>`,
  }),
};

export const Pill: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    pill: true,
  },
  render: (args) => ({
    props: args,
    template: `<zl-badge [variant]="variant" [size]="size" [pill]="pill">Pill Badge</zl-badge>`,
  }),
};

export const Removable: Story = {
  args: {
    variant: 'info',
    size: 'md',
    removable: true,
    removeLabel: 'Remove filter',
  },
  render: (args) => ({
    props: args,
    template: `<zl-badge [variant]="variant" [size]="size" [removable]="removable" [removeLabel]="removeLabel">Removable</zl-badge>`,
  }),
};

export const AllVariants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        <zl-badge variant="primary">Primary</zl-badge>
        <zl-badge variant="secondary">Secondary</zl-badge>
        <zl-badge variant="success">Success</zl-badge>
        <zl-badge variant="warning">Warning</zl-badge>
        <zl-badge variant="error">Error</zl-badge>
        <zl-badge variant="info">Info</zl-badge>
      </div>
    `,
  }),
};

export const AllSizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 8px; align-items: center;">
        <zl-badge variant="primary" size="sm">Small</zl-badge>
        <zl-badge variant="primary" size="md">Medium</zl-badge>
        <zl-badge variant="primary" size="lg">Large</zl-badge>
      </div>
    `,
  }),
};
