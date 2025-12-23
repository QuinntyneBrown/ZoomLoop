import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface GalleryImage {
  src: string;
  alt: string;
  thumbnail?: string;
  category?: 'exterior' | 'interior' | 'features' | '360';
}

@Component({
  selector: 'zl-image-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-gallery.component.html',
  styleUrl: './image-gallery.component.scss'
})
export class ImageGalleryComponent {
  @Input() images: GalleryImage[] = [];
  @Input() showThumbnails = true;
  @Input() maxThumbnails = 8;
  @Input() ariaLabel = 'Vehicle image gallery';

  @Output() imageChange = new EventEmitter<number>();

  currentIndex = 0;
  thumbnailOffset = 0;
  isFullscreen = false;

  get visibleThumbnails(): GalleryImage[] {
    return this.images.slice(this.thumbnailOffset, this.thumbnailOffset + this.maxThumbnails);
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (this.isFullscreen) {
      switch (event.key) {
        case 'ArrowLeft':
          this.prev();
          break;
        case 'ArrowRight':
          this.next();
          break;
        case 'Escape':
          this.closeFullscreen();
          break;
      }
    }
  }

  prev(): void {
    this.currentIndex = this.currentIndex === 0 ? this.images.length - 1 : this.currentIndex - 1;
    this.updateThumbnailOffset();
    this.imageChange.emit(this.currentIndex);
  }

  next(): void {
    this.currentIndex = this.currentIndex === this.images.length - 1 ? 0 : this.currentIndex + 1;
    this.updateThumbnailOffset();
    this.imageChange.emit(this.currentIndex);
  }

  goTo(index: number): void {
    this.currentIndex = index;
    this.imageChange.emit(this.currentIndex);
  }

  scrollThumbnails(direction: 'prev' | 'next'): void {
    if (direction === 'prev') {
      this.thumbnailOffset = Math.max(0, this.thumbnailOffset - this.maxThumbnails);
    } else {
      this.thumbnailOffset = Math.min(this.images.length - this.maxThumbnails, this.thumbnailOffset + this.maxThumbnails);
    }
  }

  openFullscreen(): void {
    this.isFullscreen = true;
    document.body.style.overflow = 'hidden';
  }

  closeFullscreen(): void {
    this.isFullscreen = false;
    document.body.style.overflow = '';
  }

  private updateThumbnailOffset(): void {
    if (this.currentIndex < this.thumbnailOffset) {
      this.thumbnailOffset = this.currentIndex;
    } else if (this.currentIndex >= this.thumbnailOffset + this.maxThumbnails) {
      this.thumbnailOffset = this.currentIndex - this.maxThumbnails + 1;
    }
  }
}
