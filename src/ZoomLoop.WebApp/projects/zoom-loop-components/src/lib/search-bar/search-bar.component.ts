// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface SearchSuggestion {
  id: string;
  type: 'make' | 'model' | 'popular';
  label: string;
  sublabel?: string;
  count?: number;
}

@Component({
  selector: 'zl-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss'
})
export class SearchBarComponent {
  @Input() variant: 'hero' | 'inline' = 'hero';
  @Input() placeholder = 'Search for make, model, or keyword...';
  @Input() searchButtonText = 'Search';
  @Input() showFiltersButton = true;
  @Input() suggestions: SearchSuggestion[] = [];
  @Input() isLoading = false;
  @Input() ariaLabel = 'Search for vehicles';

  @Output() search = new EventEmitter<string>();
  @Output() queryChange = new EventEmitter<string>();
  @Output() suggestionSelected = new EventEmitter<SearchSuggestion>();
  @Output() filtersClick = new EventEmitter<void>();

  query = '';
  isFocused = false;
  showSuggestions = false;
  selectedIndex = -1;

  private suggestionsIdValue = `suggestions-${Math.random().toString(36).substr(2, 9)}`;

  get suggestionsId(): string {
    return this.suggestionsIdValue;
  }

  get groupedSuggestions(): { label: string; items: SearchSuggestion[] }[] {
    const groups: { [key: string]: SearchSuggestion[] } = {};

    this.suggestions.forEach(s => {
      const label = s.type === 'make' ? 'Makes' : s.type === 'model' ? 'Models' : 'Popular Searches';
      if (!groups[label]) groups[label] = [];
      groups[label].push(s);
    });

    return Object.keys(groups).map(label => ({ label, items: groups[label] }));
  }

  getGlobalIndex(group: { label: string; items: SearchSuggestion[] }, localIndex: number): number {
    let index = 0;
    for (const g of this.groupedSuggestions) {
      if (g.label === group.label) {
        return index + localIndex;
      }
      index += g.items.length;
    }
    return index;
  }

  onQueryChange(value: string): void {
    this.query = value;
    this.queryChange.emit(value);
    this.showSuggestions = value.length > 0 && this.suggestions.length > 0;
    this.selectedIndex = -1;
  }

  onFocus(): void {
    this.isFocused = true;
    if (this.query.length > 0 && this.suggestions.length > 0) {
      this.showSuggestions = true;
    }
  }

  onBlur(): void {
    this.isFocused = false;
    // Delay hiding to allow click on suggestions
    setTimeout(() => {
      this.showSuggestions = false;
    }, 200);
  }

  onKeyDown(event: KeyboardEvent): void {
    if (!this.showSuggestions) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.selectedIndex = Math.min(this.selectedIndex + 1, this.suggestions.length - 1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.selectedIndex = Math.max(this.selectedIndex - 1, -1);
        break;
      case 'Enter':
        if (this.selectedIndex >= 0) {
          this.selectSuggestion(this.suggestions[this.selectedIndex]);
        } else {
          this.onSearch();
        }
        break;
      case 'Escape':
        this.showSuggestions = false;
        this.selectedIndex = -1;
        break;
    }
  }

  onSearch(): void {
    this.showSuggestions = false;
    this.search.emit(this.query);
  }

  selectSuggestion(suggestion: SearchSuggestion): void {
    this.query = suggestion.label;
    this.showSuggestions = false;
    this.suggestionSelected.emit(suggestion);
  }

  clearSearch(): void {
    this.query = '';
    this.queryChange.emit('');
    this.showSuggestions = false;
  }
}
