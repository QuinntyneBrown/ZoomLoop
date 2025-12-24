// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchBarComponent, SearchSuggestion } from '../search-bar/search-bar.component';

export interface HeroStat {
  value: string;
  label: string;
}

@Component({
  selector: 'zl-hero',
  standalone: true,
  imports: [CommonModule, SearchBarComponent],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent {
  @Input() headline = 'Find Your Perfect Car';
  @Input() subheadline = 'Browse 1,000+ quality used vehicles with free delivery and a 10-day money-back guarantee';
  @Input() searchPlaceholder = 'Search for make, model, or keyword...';
  @Input() searchSuggestions: SearchSuggestion[] = [];
  @Input() showFiltersButton = true;
  @Input() backgroundImage = '';
  @Input() stats: HeroStat[] = [];
  @Input() showPromo = false;
  @Input() promoIcon = '🎄';
  @Input() promoText = '';
  @Input() promoButtonText = '';

  @Output() search = new EventEmitter<string>();
  @Output() searchQueryChange = new EventEmitter<string>();
  @Output() searchSuggestionSelected = new EventEmitter<SearchSuggestion>();
  @Output() filtersClick = new EventEmitter<void>();
  @Output() promoClick = new EventEmitter<void>();
  @Output() promoDismissed = new EventEmitter<void>();

  onSearch(query: string): void {
    this.search.emit(query);
  }

  dismissPromo(): void {
    this.showPromo = false;
    this.promoDismissed.emit();
  }
}
