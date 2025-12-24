// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BadgeComponent } from '../badge/badge.component';

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
  disabled?: boolean;
}

export interface RangeFilter {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  currentMin: number;
  currentMax: number;
  format?: 'currency' | 'number' | 'year';
}

export interface CheckboxFilter {
  id: string;
  label: string;
  options: FilterOption[];
  selectedValues: string[];
  showMore?: boolean;
  maxVisible?: number;
}

export interface RadioFilter {
  id: string;
  label: string;
  options: FilterOption[];
  selectedValue: string;
}

export interface AppliedFilter {
  id: string;
  label: string;
  value: string;
}

@Component({
  selector: 'zl-filter-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule, BadgeComponent],
  templateUrl: './filter-sidebar.component.html',
  styleUrl: './filter-sidebar.component.scss'
})
export class FilterSidebarComponent {
  @Input() title = 'Filters';
  @Input() rangeFilters: RangeFilter[] = [];
  @Input() checkboxFilters: CheckboxFilter[] = [];
  @Input() radioFilters: RadioFilter[] = [];
  @Input() appliedFilters: AppliedFilter[] = [];
  @Input() isMobileDrawer = false;
  @Input() resultCount = 0;

  @Output() filtersChange = new EventEmitter<void>();
  @Output() filterRemove = new EventEmitter<AppliedFilter>();
  @Output() filtersClear = new EventEmitter<void>();
  @Output() apply = new EventEmitter<void>();

  expandedSections = new Set<string>();

  toggleSection(id: string): void {
    if (this.expandedSections.has(id)) {
      this.expandedSections.delete(id);
    } else {
      this.expandedSections.add(id);
    }
  }

  onRangeChange(filter: RangeFilter): void {
    if (filter.currentMin > filter.currentMax) {
      const temp = filter.currentMin;
      filter.currentMin = filter.currentMax;
      filter.currentMax = temp;
    }
    this.filtersChange.emit();
  }

  onCheckboxChange(filter: CheckboxFilter, value: string, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      filter.selectedValues.push(value);
    } else {
      const index = filter.selectedValues.indexOf(value);
      if (index > -1) {
        filter.selectedValues.splice(index, 1);
      }
    }
    this.filtersChange.emit();
  }

  onRadioChange(filter: RadioFilter, value: string): void {
    filter.selectedValue = value;
    this.filtersChange.emit();
  }

  toggleShowMore(filter: CheckboxFilter): void {
    filter.showMore = !filter.showMore;
  }

  getVisibleOptions(filter: CheckboxFilter): FilterOption[] {
    if (filter.showMore) {
      return filter.options;
    }
    return filter.options.slice(0, filter.maxVisible || 5);
  }

  removeFilter(filter: AppliedFilter): void {
    this.filterRemove.emit(filter);
  }

  clearAll(): void {
    this.filtersClear.emit();
  }

  applyFilters(): void {
    this.apply.emit();
  }

  formatValue(value: number, format?: 'currency' | 'number' | 'year'): string {
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-CA', {
          style: 'currency',
          currency: 'CAD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(value);
      case 'year':
        return value.toString();
      default:
        return new Intl.NumberFormat('en-CA').format(value);
    }
  }
}
