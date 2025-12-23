import type { Meta, StoryObj } from '@storybook/angular';
import { SearchBarComponent, SearchSuggestion } from './search-bar.component';

const sampleSuggestions: SearchSuggestion[] = [
  { type: 'recent', text: 'Honda Civic 2022', icon: 'clock' },
  { type: 'recent', text: 'Toyota Camry', icon: 'clock' },
  { type: 'popular', text: 'SUV under $30,000', icon: 'trending' },
  { type: 'popular', text: 'Electric vehicles', icon: 'trending' },
  { type: 'make', text: 'BMW', icon: 'car' },
  { type: 'make', text: 'Mercedes-Benz', icon: 'car' },
];

const meta: Meta<SearchBarComponent> = {
  title: 'Components/Search/SearchBar',
  component: SearchBarComponent,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'hero', 'compact'],
    },
    showFiltersButton: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<SearchBarComponent>;

export const Default: Story = {
  args: {
    placeholder: 'Search for make, model, or keyword...',
    variant: 'default',
    showFiltersButton: true,
    suggestions: sampleSuggestions,
  },
};

export const Hero: Story = {
  args: {
    placeholder: 'Search for make, model, or keyword...',
    variant: 'hero',
    showFiltersButton: true,
    suggestions: sampleSuggestions,
  },
  decorators: [
    (story) => ({
      template: `
        <div style="background: linear-gradient(135deg, #1E40AF, #0F172A); padding: 40px;">
          <ng-container *ngComponentOutlet="storyComponent"></ng-container>
        </div>
      `,
      props: story().props,
    }),
  ],
};

export const Compact: Story = {
  args: {
    placeholder: 'Search...',
    variant: 'compact',
    showFiltersButton: false,
    suggestions: sampleSuggestions,
  },
};

export const WithoutFiltersButton: Story = {
  args: {
    placeholder: 'Search for vehicles...',
    variant: 'default',
    showFiltersButton: false,
    suggestions: sampleSuggestions,
  },
};

export const WithCustomPlaceholder: Story = {
  args: {
    placeholder: 'Find your dream car...',
    variant: 'default',
    showFiltersButton: true,
    suggestions: [],
  },
};

export const NoSuggestions: Story = {
  args: {
    placeholder: 'Search for make, model, or keyword...',
    variant: 'default',
    showFiltersButton: true,
    suggestions: [],
  },
};
