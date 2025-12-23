import type { Meta, StoryObj } from '@storybook/angular';
import { FilterSidebarComponent, RangeFilter, CheckboxFilter, RadioFilter, AppliedFilter } from './filter-sidebar.component';

const priceFilter: RangeFilter = {
  id: 'price',
  label: 'Price',
  min: 5000,
  max: 100000,
  step: 1000,
  currentMin: 10000,
  currentMax: 50000,
  format: 'currency',
};

const yearFilter: RangeFilter = {
  id: 'year',
  label: 'Year',
  min: 2015,
  max: 2024,
  step: 1,
  currentMin: 2018,
  currentMax: 2024,
  format: 'year',
};

const mileageFilter: RangeFilter = {
  id: 'mileage',
  label: 'Mileage',
  min: 0,
  max: 200000,
  step: 5000,
  currentMin: 0,
  currentMax: 100000,
  format: 'number',
};

const makeFilter: CheckboxFilter = {
  id: 'make',
  label: 'Make',
  options: [
    { value: 'toyota', label: 'Toyota', count: 245 },
    { value: 'honda', label: 'Honda', count: 189 },
    { value: 'ford', label: 'Ford', count: 156 },
    { value: 'chevrolet', label: 'Chevrolet', count: 134 },
    { value: 'bmw', label: 'BMW', count: 98 },
    { value: 'mercedes', label: 'Mercedes-Benz', count: 87 },
    { value: 'audi', label: 'Audi', count: 76 },
    { value: 'nissan', label: 'Nissan', count: 65 },
  ],
  selectedValues: ['toyota', 'honda'],
  maxVisible: 5,
};

const bodyTypeFilter: CheckboxFilter = {
  id: 'bodyType',
  label: 'Body Type',
  options: [
    { value: 'sedan', label: 'Sedan', count: 312 },
    { value: 'suv', label: 'SUV', count: 287 },
    { value: 'truck', label: 'Truck', count: 156 },
    { value: 'coupe', label: 'Coupe', count: 89 },
    { value: 'wagon', label: 'Wagon', count: 45 },
    { value: 'van', label: 'Van', count: 34 },
  ],
  selectedValues: [],
  maxVisible: 5,
};

const transmissionFilter: RadioFilter = {
  id: 'transmission',
  label: 'Transmission',
  options: [
    { value: 'any', label: 'Any', count: 1000 },
    { value: 'automatic', label: 'Automatic', count: 850 },
    { value: 'manual', label: 'Manual', count: 150 },
  ],
  selectedValue: 'any',
};

const fuelTypeFilter: RadioFilter = {
  id: 'fuelType',
  label: 'Fuel Type',
  options: [
    { value: 'any', label: 'Any', count: 1000 },
    { value: 'gasoline', label: 'Gasoline', count: 750 },
    { value: 'diesel', label: 'Diesel', count: 100 },
    { value: 'hybrid', label: 'Hybrid', count: 100 },
    { value: 'electric', label: 'Electric', count: 50 },
  ],
  selectedValue: 'any',
};

const appliedFilters: AppliedFilter[] = [
  { id: 'make-toyota', label: 'Toyota', value: 'toyota' },
  { id: 'make-honda', label: 'Honda', value: 'honda' },
  { id: 'price', label: '$10,000 - $50,000', value: '10000-50000' },
];

const meta: Meta<FilterSidebarComponent> = {
  title: 'Components/Search/FilterSidebar',
  component: FilterSidebarComponent,
  tags: ['autodocs'],
  argTypes: {
    isMobileDrawer: {
      control: 'boolean',
    },
    resultCount: {
      control: 'number',
    },
  },
};

export default meta;
type Story = StoryObj<FilterSidebarComponent>;

export const Default: Story = {
  args: {
    title: 'Filters',
    rangeFilters: [priceFilter, yearFilter, mileageFilter],
    checkboxFilters: [makeFilter, bodyTypeFilter],
    radioFilters: [transmissionFilter, fuelTypeFilter],
    appliedFilters: [],
    isMobileDrawer: false,
    resultCount: 1000,
  },
};

export const WithAppliedFilters: Story = {
  args: {
    title: 'Filters',
    rangeFilters: [priceFilter, yearFilter],
    checkboxFilters: [makeFilter, bodyTypeFilter],
    radioFilters: [transmissionFilter],
    appliedFilters: appliedFilters,
    isMobileDrawer: false,
    resultCount: 245,
  },
};

export const MobileDrawer: Story = {
  args: {
    title: 'Filters',
    rangeFilters: [priceFilter, yearFilter, mileageFilter],
    checkboxFilters: [makeFilter, bodyTypeFilter],
    radioFilters: [transmissionFilter, fuelTypeFilter],
    appliedFilters: appliedFilters,
    isMobileDrawer: true,
    resultCount: 245,
  },
  decorators: [
    (story) => ({
      template: `
        <div style="width: 320px; height: 600px; border: 1px solid #E5E7EB; border-radius: 8px; overflow: hidden;">
          <ng-container *ngComponentOutlet="storyComponent"></ng-container>
        </div>
      `,
      props: story().props,
    }),
  ],
};

export const RangeFiltersOnly: Story = {
  args: {
    title: 'Price & Year',
    rangeFilters: [priceFilter, yearFilter],
    checkboxFilters: [],
    radioFilters: [],
    appliedFilters: [],
    isMobileDrawer: false,
    resultCount: 500,
  },
};

export const CheckboxFiltersOnly: Story = {
  args: {
    title: 'Select Options',
    rangeFilters: [],
    checkboxFilters: [makeFilter, bodyTypeFilter],
    radioFilters: [],
    appliedFilters: [],
    isMobileDrawer: false,
    resultCount: 750,
  },
};

export const RadioFiltersOnly: Story = {
  args: {
    title: 'Vehicle Type',
    rangeFilters: [],
    checkboxFilters: [],
    radioFilters: [transmissionFilter, fuelTypeFilter],
    appliedFilters: [],
    isMobileDrawer: false,
    resultCount: 1000,
  },
};

export const NoResults: Story = {
  args: {
    title: 'Filters',
    rangeFilters: [priceFilter],
    checkboxFilters: [makeFilter],
    radioFilters: [transmissionFilter],
    appliedFilters: [
      { id: 'price', label: '$90,000 - $100,000', value: '90000-100000' },
      { id: 'make-ferrari', label: 'Ferrari', value: 'ferrari' },
    ],
    isMobileDrawer: false,
    resultCount: 0,
  },
};
