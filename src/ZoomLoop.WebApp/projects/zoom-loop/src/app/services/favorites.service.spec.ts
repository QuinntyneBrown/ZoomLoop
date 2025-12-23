import { TestBed } from '@angular/core/testing';
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
    it('should emit false for non-favorites', (done) => {
      service.isFavorite('unknown').subscribe(result => {
        expect(result).toBe(false);
        done();
      });
    });

    it('should emit true for favorites', (done) => {
      service.toggle('1');
      service.isFavorite('1').subscribe(result => {
        expect(result).toBe(true);
        done();
      });
    });
  });

  describe('getFavorites', () => {
    it('should return empty array initially', (done) => {
      service.getFavorites().subscribe(favorites => {
        expect(favorites).toEqual([]);
        done();
      });
    });

    it('should return all favorites', (done) => {
      service.toggle('1');
      service.toggle('2');
      service.getFavorites().subscribe(favorites => {
        expect(favorites).toContain('1');
        expect(favorites).toContain('2');
        done();
      });
    });
  });

  describe('getCount', () => {
    it('should return 0 initially', (done) => {
      service.getCount().subscribe(count => {
        expect(count).toBe(0);
        done();
      });
    });

    it('should return correct count', (done) => {
      service.toggle('1');
      service.toggle('2');
      service.getCount().subscribe(count => {
        expect(count).toBe(2);
        done();
      });
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
