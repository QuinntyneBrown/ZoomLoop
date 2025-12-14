import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Button } from '../button';

export interface CarouselItem {
  imageUrl: string;
  alt?: string;
  title?: string;
  description?: string;
  [key: string]: any;
}

@Component({
  selector: 'zl-carousel',
  standalone: true,
  imports: [CommonModule, Button],
  templateUrl: './carousel.html',
  styleUrl: './carousel.scss',
})
export class Carousel implements OnInit, OnDestroy {
  @Input() items: CarouselItem[] = [];
  @Input() autoPlay = true;
  @Input() autoPlayInterval = 5000;
  @Input() showIndicators = true;
  @Input() height = '400px';

  currentIndex = 0;
  autoPlayTimer: any;

  ngOnInit(): void {
    if (this.items.length === 0) {
      console.warn('Carousel: No items provided');
    }
    if (this.autoPlay && this.items.length > 0) {
      this.startAutoPlay();
    }
  }

  ngOnDestroy(): void {
    if (this.autoPlayTimer) {
      clearInterval(this.autoPlayTimer);
    }
  }

  nextSlide(): void {
    this.currentIndex = (this.currentIndex + 1) % this.items.length;
    this.resetAutoPlay();
  }

  prevSlide(): void {
    this.currentIndex =
      (this.currentIndex - 1 + this.items.length) % this.items.length;
    this.resetAutoPlay();
  }

  goToSlide(index: number): void {
    if (index >= 0 && index < this.items.length) {
      this.currentIndex = index;
      this.resetAutoPlay();
    }
  }

  getCurrentItem(): CarouselItem | null {
    return this.items[this.currentIndex] || null;
  }

  private startAutoPlay(): void {
    this.autoPlayTimer = setInterval(() => {
      this.nextSlide();
    }, this.autoPlayInterval);
  }

  private resetAutoPlay(): void {
    if (this.autoPlay) {
      clearInterval(this.autoPlayTimer);
      this.startAutoPlay();
    }
  }
}
