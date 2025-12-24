// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import type { Meta, StoryObj } from '@storybook/angular';
import { HeroComponent, HeroStat } from './hero.component';
import { SearchSuggestion } from '../search-bar/search-bar.component';

const sampleStats: HeroStat[] = [
  { value: '15,000+', label: 'Vehicles' },
  { value: '4.8★', label: 'Rating' },
  { value: '98%', label: 'Satisfaction' },
  { value: '24/7', label: 'Support' },
];

const sampleSuggestions: SearchSuggestion[] = [
  { id: '1', type: 'popular', label: 'SUV under $30,000' },
  { id: '2', type: 'popular', label: 'Electric vehicles' },
  { id: '3', type: 'make', label: 'Toyota' },
  { id: '4', type: 'make', label: 'Honda' },
];

const meta: Meta<HeroComponent> = {
  title: 'Components/Marketing/Hero',
  component: HeroComponent,
  tags: ['autodocs'],
  argTypes: {
    showFiltersButton: {
      control: 'boolean',
    },
    showPromo: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<HeroComponent>;

export const Default: Story = {
  args: {
    headline: 'Find Your Perfect Car',
    subheadline: 'Browse 1,000+ quality used vehicles with free delivery and a 10-day money-back guarantee',
    searchPlaceholder: 'Search for make, model, or keyword...',
    showFiltersButton: true,
    stats: sampleStats,
    searchSuggestions: sampleSuggestions,
    showPromo: false,
  },
};

export const WithPromo: Story = {
  args: {
    headline: 'Find Your Perfect Car',
    subheadline: 'Browse 1,000+ quality used vehicles with free delivery and a 10-day money-back guarantee',
    searchPlaceholder: 'Search for make, model, or keyword...',
    showFiltersButton: true,
    stats: sampleStats,
    searchSuggestions: sampleSuggestions,
    showPromo: true,
    promoIcon: '🎄',
    promoText: 'Holiday Sale! Save up to $2,000 on select vehicles',
    promoButtonText: 'Shop Now',
  },
};

export const WithBackgroundImage: Story = {
  args: {
    headline: 'Drive Your Dreams',
    subheadline: 'Premium vehicles at unbeatable prices with nationwide delivery',
    searchPlaceholder: 'What car are you looking for?',
    showFiltersButton: true,
    stats: sampleStats,
    searchSuggestions: sampleSuggestions,
    backgroundImage: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920',
    showPromo: false,
  },
};

export const NoStats: Story = {
  args: {
    headline: 'Find Your Perfect Car',
    subheadline: 'Browse quality used vehicles with free delivery',
    searchPlaceholder: 'Search for make, model, or keyword...',
    showFiltersButton: true,
    stats: [],
    searchSuggestions: sampleSuggestions,
    showPromo: false,
  },
};

export const CustomHeadline: Story = {
  args: {
    headline: 'Your Next Adventure Starts Here',
    subheadline: 'Discover thousands of certified pre-owned vehicles ready for delivery to your door',
    searchPlaceholder: 'Search by make, model, or features...',
    showFiltersButton: true,
    stats: [
      { value: '10,000+', label: 'Cars Available' },
      { value: 'Free', label: 'Delivery' },
      { value: '10 Days', label: 'Return Policy' },
    ],
    searchSuggestions: sampleSuggestions,
    showPromo: false,
  },
};

export const MinimalHero: Story = {
  args: {
    headline: 'Find Your Car',
    subheadline: 'Search our inventory',
    searchPlaceholder: 'Search...',
    showFiltersButton: false,
    stats: [],
    searchSuggestions: [],
    showPromo: false,
  },
};
