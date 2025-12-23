import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const FAVORITES_KEY = 'zoomloop_favorites';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private favorites$ = new BehaviorSubject<Set<string>>(this.load());

  getFavorites(): Observable<string[]> {
    return this.favorites$.pipe(map(set => Array.from(set)));
  }

  getCount(): Observable<number> {
    return this.favorites$.pipe(map(set => set.size));
  }

  isFavorite(id: string): Observable<boolean> {
    return this.favorites$.pipe(map(set => set.has(id)));
  }

  isFavoriteSync(id: string): boolean {
    return this.favorites$.getValue().has(id);
  }

  toggle(id: string): void {
    const set = new Set(this.favorites$.getValue());
    if (set.has(id)) {
      set.delete(id);
    } else {
      set.add(id);
    }
    this.favorites$.next(set);
    this.save(set);
  }

  private load(): Set<string> {
    try {
      const data = localStorage.getItem(FAVORITES_KEY);
      return data ? new Set(JSON.parse(data)) : new Set();
    } catch {
      return new Set();
    }
  }

  private save(set: Set<string>): void {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify([...set]));
    } catch {
      // Storage unavailable
    }
  }
}
