// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { FavoritesService } from './favorites.service';

describe('FavoritesService', () => {
  let service: FavoritesService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(FavoritesService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('toggle', () => {
    it('should add a favorite when not present', () => {
      service.toggle('1');
      expect(service.isFavoriteSync('1')).toBe(true);
    });

    it('should remove a favorite when present', () => {
      service.toggle('1');
      service.toggle('1');
      expect(service.isFavoriteSync('1')).toBe(false);
    });
  });

  describe('isFavoriteSync', () => {
    it('should return false for non-favorites', () => {
      expect(service.isFavoriteSync('unknown')).toBe(false);
    });

    it('should return true for favorites', () => {
      service.toggle('1');
      expect(service.isFavoriteSync('1')).toBe(true);
    });
  });

  describe('isFavorite', () => {
    it('should emit false for non-favorites', async () => {
      const result = await firstValueFrom(service.isFavorite('unknown'));
      expect(result).toBe(false);
    });

    it('should emit true for favorites', async () => {
      service.toggle('1');
      const result = await firstValueFrom(service.isFavorite('1'));
      expect(result).toBe(true);
    });
  });

  describe('getFavorites', () => {
    it('should return empty array initially', async () => {
      const favorites = await firstValueFrom(service.getFavorites());
      expect(favorites).toEqual([]);
    });

    it('should return all favorites', async () => {
      service.toggle('1');
      service.toggle('2');
      const favorites = await firstValueFrom(service.getFavorites());
      expect(favorites).toContain('1');
      expect(favorites).toContain('2');
    });
  });

  describe('getCount', () => {
    it('should return 0 initially', async () => {
      const count = await firstValueFrom(service.getCount());
      expect(count).toBe(0);
    });

    it('should return correct count', async () => {
      service.toggle('1');
      service.toggle('2');
      const count = await firstValueFrom(service.getCount());
      expect(count).toBe(2);
    });
  });

  describe('persistence', () => {
    it('should persist favorites to localStorage', () => {
      service.toggle('1');
      const stored = localStorage.getItem('zoomloop_favorites');
      expect(stored).toContain('1');
    });
  });
});
