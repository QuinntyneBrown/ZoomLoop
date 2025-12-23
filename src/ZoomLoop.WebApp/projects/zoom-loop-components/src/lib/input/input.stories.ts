import type { Meta, StoryObj } from '@storybook/angular';
import { InputComponent } from './input.component';

const meta: Meta<InputComponent> = {
  title: 'Components/Core/Input',
  component: InputComponent,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url', 'search'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    disabled: {
      control: 'boolean',
    },
    readonly: {
      control: 'boolean',
    },
    error: {
      control: 'text',
    },
    hint: {
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<InputComponent>;

export const Default: Story = {
  args: {
    label: 'Email',
    placeholder: 'Enter your email',
    type: 'email',
    size: 'md',
  },
};

export const WithHint: Story = {
  args: {
    label: 'Password',
    placeholder: 'Enter your password',
    type: 'password',
    hint: 'Must be at least 8 characters',
    size: 'md',
  },
};

export const WithError: Story = {
  args: {
    label: 'Email',
    placeholder: 'Enter your email',
    type: 'email',
    error: 'Please enter a valid email address',
    size: 'md',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Input',
    placeholder: 'This is disabled',
    disabled: true,
    size: 'md',
  },
};

export const Readonly: Story = {
  args: {
    label: 'Readonly Input',
    placeholder: 'This is readonly',
    readonly: true,
    size: 'md',
  },
};

export const Required: Story = {
  args: {
    label: 'Required Field',
    placeholder: 'This field is required',
    required: true,
    size: 'md',
  },
};

export const WithPrefix: Story = {
  args: {
    label: 'Price',
    placeholder: '0.00',
    type: 'number',
    prefix: '$',
    size: 'md',
  },
};

export const WithSuffix: Story = {
  args: {
    label: 'Weight',
    placeholder: '0',
    type: 'number',
    suffix: 'kg',
    size: 'md',
  },
};

export const AllSizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; max-width: 400px;">
        <zl-input label="Small" placeholder="Small input" size="sm"></zl-input>
        <zl-input label="Medium" placeholder="Medium input" size="md"></zl-input>
        <zl-input label="Large" placeholder="Large input" size="lg"></zl-input>
      </div>
    `,
  }),
};

export const AllTypes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; max-width: 400px;">
        <zl-input label="Text" placeholder="Text input" type="text"></zl-input>
        <zl-input label="Email" placeholder="Email input" type="email"></zl-input>
        <zl-input label="Password" placeholder="Password input" type="password"></zl-input>
        <zl-input label="Number" placeholder="Number input" type="number"></zl-input>
        <zl-input label="Tel" placeholder="Phone input" type="tel"></zl-input>
        <zl-input label="Search" placeholder="Search input" type="search"></zl-input>
      </div>
    `,
  }),
};
