// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import type { Meta, StoryObj } from '@storybook/angular';
import { InputComponent } from './input.component';

const meta: Meta<InputComponent> = {
  title: 'Components/Core/Input',
  component: InputComponent,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'search'],
    },
    state: {
      control: 'select',
      options: ['default', 'error', 'success'],
    },
    disabled: {
      control: 'boolean',
    },
    readonly: {
      control: 'boolean',
    },
    required: {
      control: 'boolean',
    },
    compact: {
      control: 'boolean',
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
  },
};

export const WithHint: Story = {
  args: {
    label: 'Password',
    placeholder: 'Enter your password',
    type: 'password',
    helperText: 'Must be at least 8 characters',
  },
};

export const WithError: Story = {
  args: {
    label: 'Email',
    placeholder: 'Enter your email',
    type: 'email',
    state: 'error',
    errorText: 'Please enter a valid email address',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Input',
    placeholder: 'This is disabled',
    disabled: true,
  },
};

export const Readonly: Story = {
  args: {
    label: 'Readonly Input',
    placeholder: 'This is readonly',
    readonly: true,
  },
};

export const Required: Story = {
  args: {
    label: 'Required Field',
    placeholder: 'This field is required',
    required: true,
  },
};

export const Compact: Story = {
  args: {
    label: 'Compact Input',
    placeholder: 'Compact variant',
    compact: true,
  },
};

export const WithSuccess: Story = {
  args: {
    label: 'Email',
    placeholder: 'Enter your email',
    type: 'email',
    state: 'success',
    helperText: 'Email is valid',
  },
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
