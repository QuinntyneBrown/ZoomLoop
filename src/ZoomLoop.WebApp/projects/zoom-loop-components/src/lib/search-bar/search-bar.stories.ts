import type { Meta, StoryObj } from '@storybook/angular';
import { SearchBarComponent, SearchSuggestion } from './search-bar.component';

const sampleSuggestions: SearchSuggestion[] = [
  { id: '1', type: 'popular', label: 'SUV under $30,000' },
  { id: '2', type: 'popular', label: 'Electric vehicles' },
  { id: '3', type: 'make', label: 'BMW' },
  { id: '4', type: 'make', label: 'Mercedes-Benz' },
  { id: '5', type: 'model', label: 'Honda Civic', sublabel: '2022' },
  { id: '6', type: 'model', label: 'Toyota Camry' },
];

const meta: Meta<SearchBarComponent> = {
  title: 'Components/Search/SearchBar',
  component: SearchBarComponent,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['hero', 'inline'],
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
    variant: 'inline',
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
    variant: 'inline',
    showFiltersButton: false,
    suggestions: sampleSuggestions,
  },
};

export const WithoutFiltersButton: Story = {
  args: {
    placeholder: 'Search for vehicles...',
    variant: 'inline',
    showFiltersButton: false,
    suggestions: sampleSuggestions,
  },
};

export const WithCustomPlaceholder: Story = {
  args: {
    placeholder: 'Find your dream car...',
    variant: 'inline',
    showFiltersButton: true,
    suggestions: [],
  },
};

export const NoSuggestions: Story = {
  args: {
    placeholder: 'Search for make, model, or keyword...',
    variant: 'inline',
    showFiltersButton: true,
    suggestions: [],
  },
};
