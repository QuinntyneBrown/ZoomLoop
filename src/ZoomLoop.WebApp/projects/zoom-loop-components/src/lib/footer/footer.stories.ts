// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import type { Meta, StoryObj } from '@storybook/angular';
import { FooterComponent, FooterColumn, SocialLink } from './footer.component';

const sampleColumns: FooterColumn[] = [
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Press', href: '/press' },
      { label: 'Blog', href: '/blog' },
    ],
  },
  {
    title: 'Buying',
    links: [
      { label: 'Browse Cars', href: '/browse' },
      { label: 'How It Works', href: '/how-it-works' },
      { label: 'Financing', href: '/financing' },
      { label: 'FAQs', href: '/faqs' },
    ],
  },
  {
    title: 'Selling',
    links: [
      { label: 'Sell Your Car', href: '/sell' },
      { label: 'Get an Offer', href: '/offer' },
      { label: 'Trade-In', href: '/trade-in' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Contact Us', href: '/contact' },
      { label: 'Help Center', href: '/help' },
      { label: 'Warranty', href: '/warranty' },
    ],
  },
];

const sampleSocialLinks: SocialLink[] = [
  { platform: 'facebook', href: 'https://facebook.com' },
  { platform: 'twitter', href: 'https://twitter.com' },
  { platform: 'instagram', href: 'https://instagram.com' },
  { platform: 'linkedin', href: 'https://linkedin.com' },
  { platform: 'youtube', href: 'https://youtube.com' },
];

const sampleLegalLinks = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Accessibility', href: '/accessibility' },
];

const meta: Meta<FooterComponent> = {
  title: 'Components/Layout/Footer',
  component: FooterComponent,
  tags: ['autodocs'],
  argTypes: {
    compact: {
      control: 'boolean',
    },
    showNewsletter: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<FooterComponent>;

export const Default: Story = {
  args: {
    logoText: 'ZoomLoop',
    logoInitial: 'Z',
    tagline: "Canada's #1 online car marketplace. Buy and sell quality used vehicles with confidence.",
    columns: sampleColumns,
    socialLinks: sampleSocialLinks,
    legalLinks: sampleLegalLinks,
    showNewsletter: true,
    copyright: '© 2024 ZoomLoop Inc. All rights reserved.',
    compact: false,
  },
};

export const Compact: Story = {
  args: {
    logoText: 'ZoomLoop',
    logoInitial: 'Z',
    tagline: "Canada's #1 online car marketplace.",
    columns: sampleColumns.slice(0, 2),
    socialLinks: sampleSocialLinks,
    legalLinks: sampleLegalLinks,
    showNewsletter: false,
    copyright: '© 2024 ZoomLoop Inc. All rights reserved.',
    compact: true,
  },
};

export const WithNewsletter: Story = {
  args: {
    logoText: 'ZoomLoop',
    logoInitial: 'Z',
    tagline: "Canada's #1 online car marketplace.",
    columns: sampleColumns,
    socialLinks: sampleSocialLinks,
    legalLinks: sampleLegalLinks,
    showNewsletter: true,
    newsletterTitle: 'Stay Connected',
    newsletterDescription: 'Get the latest deals, news, and updates delivered to your inbox.',
    newsletterPlaceholder: 'Enter your email',
    newsletterButtonText: 'Subscribe',
    copyright: '© 2024 ZoomLoop Inc. All rights reserved.',
    compact: false,
  },
};

export const MinimalLinks: Story = {
  args: {
    logoText: 'ZoomLoop',
    logoInitial: 'Z',
    tagline: "Your trusted car marketplace.",
    columns: [sampleColumns[0]],
    socialLinks: sampleSocialLinks.slice(0, 3),
    legalLinks: sampleLegalLinks,
    showNewsletter: false,
    copyright: '© 2024 ZoomLoop Inc.',
    compact: false,
  },
};
