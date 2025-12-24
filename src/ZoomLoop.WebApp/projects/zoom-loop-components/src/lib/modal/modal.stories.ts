// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import type { Meta, StoryObj } from '@storybook/angular';
import { ModalComponent } from './modal.component';

const meta: Meta<ModalComponent> = {
  title: 'Components/Layout/Modal',
  component: ModalComponent,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'full'],
    },
    isOpen: {
      control: 'boolean',
    },
    showCloseButton: {
      control: 'boolean',
    },
    closeOnOverlayClick: {
      control: 'boolean',
    },
    closeOnEscape: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<ModalComponent>;

export const Default: Story = {
  args: {
    isOpen: true,
    title: 'Modal Title',
    size: 'md',
    showCloseButton: true,
    closeOnOverlayClick: true,
    closeOnEscape: true,
  },
  render: (args) => ({
    props: args,
    template: `
      <zl-modal [isOpen]="isOpen" [title]="title" [size]="size" [showCloseButton]="showCloseButton">
        <p>This is the modal content. You can put any content here including forms, images, or other components.</p>
      </zl-modal>
    `,
  }),
};

export const Small: Story = {
  args: {
    isOpen: true,
    title: 'Small Modal',
    size: 'sm',
  },
  render: (args) => ({
    props: args,
    template: `
      <zl-modal [isOpen]="isOpen" [title]="title" [size]="size">
        <p>A compact modal for simple confirmations.</p>
      </zl-modal>
    `,
  }),
};

export const Large: Story = {
  args: {
    isOpen: true,
    title: 'Large Modal',
    size: 'lg',
  },
  render: (args) => ({
    props: args,
    template: `
      <zl-modal [isOpen]="isOpen" [title]="title" [size]="size">
        <p>A larger modal for more complex content like forms or detailed information.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
      </zl-modal>
    `,
  }),
};

export const ExtraLarge: Story = {
  args: {
    isOpen: true,
    title: 'Extra Large Modal',
    size: 'xl',
  },
  render: (args) => ({
    props: args,
    template: `
      <zl-modal [isOpen]="isOpen" [title]="title" [size]="size">
        <p>An extra large modal for extensive content like image galleries or detailed forms.</p>
      </zl-modal>
    `,
  }),
};

export const Fullscreen: Story = {
  args: {
    isOpen: true,
    title: 'Fullscreen Modal',
    size: 'full',
  },
  render: (args) => ({
    props: args,
    template: `
      <zl-modal [isOpen]="isOpen" [title]="title" [size]="size">
        <p>A fullscreen modal for immersive experiences.</p>
      </zl-modal>
    `,
  }),
};

export const WithFooter: Story = {
  args: {
    isOpen: true,
    title: 'Confirm Action',
    size: 'md',
  },
  render: (args) => ({
    props: args,
    template: `
      <zl-modal [isOpen]="isOpen" [title]="title" [size]="size">
        <p>Are you sure you want to proceed with this action?</p>
        <div modal-footer style="display: flex; gap: 12px; justify-content: flex-end; margin-top: 24px;">
          <zl-button variant="outline">Cancel</zl-button>
          <zl-button variant="primary">Confirm</zl-button>
        </div>
      </zl-modal>
    `,
  }),
};

export const NoCloseButton: Story = {
  args: {
    isOpen: true,
    title: 'Required Action',
    size: 'md',
    showCloseButton: false,
    closeOnOverlayClick: false,
    closeOnEscape: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <zl-modal [isOpen]="isOpen" [title]="title" [size]="size" [showCloseButton]="showCloseButton" [closeOnOverlayClick]="closeOnOverlayClick" [closeOnEscape]="closeOnEscape">
        <p>This modal requires you to take an action before closing.</p>
      </zl-modal>
    `,
  }),
};
