import { Component } from '@angular/core';
import { CarouselComponent, CarouselItem } from './carousel.component';

/**
 * Example component demonstrating the Carousel component usage.
 * This shows a typical use case for displaying a series of images.
 */
@Component({
  selector: 'zl-carousel-example',
  standalone: true,
  imports: [CarouselComponent],
  template: `
    <div class="carousel-demo">
      <h1>Carousel Component Examples</h1>

      <!-- Example 1: Basic Carousel -->
      <section>
        <h2>Basic Carousel</h2>
        <p>Simple carousel with default settings</p>
        <zl-carousel [items]="basicItems"></zl-carousel>
      </section>

      <!-- Example 2: Carousel with Custom Height -->
      <section>
        <h2>Custom Height Carousel</h2>
        <p>Carousel with custom height of 300px</p>
        <zl-carousel [items]="basicItems" [height]="'300px'"></zl-carousel>
      </section>

      <!-- Example 3: Carousel without Auto-Play -->
      <section>
        <h2>Manual Navigation Carousel</h2>
        <p>Carousel with auto-play disabled - use arrows only</p>
        <zl-carousel
          [items]="basicItems"
          [autoPlay]="false"
        ></zl-carousel>
      </section>

      <!-- Example 4: Carousel with Titles and Descriptions -->
      <section>
        <h2>Carousel with Content</h2>
        <p>Carousel displaying image with title and description overlay</p>
        <zl-carousel [items]="detailedItems"></zl-carousel>
      </section>

      <!-- Example 5: Single Item Carousel -->
      <section>
        <h2>Single Item Carousel</h2>
        <p>Carousel with only one item (no navigation needed)</p>
        <zl-carousel [items]="singleItem"></zl-carousel>
      </section>

      <!-- Example 6: Carousel without Indicators -->
      <section>
        <h2>Carousel without Indicator Dots</h2>
        <p>Carousel with indicator dots disabled</p>
        <zl-carousel
          [items]="basicItems"
          [showIndicators]="false"
        ></zl-carousel>
      </section>
    </div>
  `,
  styles: [
    `
      .carousel-demo {
        padding: 20px;
        max-width: 1200px;
        margin: 0 auto;
      }

      h1 {
        font-size: 32px;
        margin-bottom: 30px;
        color: #333;
      }

      h2 {
        font-size: 20px;
        margin: 30px 0 10px;
        color: #555;
      }

      p {
        color: #888;
        margin-bottom: 15px;
        font-size: 14px;
      }

      section {
        margin-bottom: 40px;
        padding-bottom: 40px;
        border-bottom: 1px solid #eee;
      }

      section:last-child {
        border-bottom: none;
      }

      zl-carousel {
        display: block;
      }
    `,
  ],
})
export class CarouselExampleComponent {
  basicItems: CarouselItem[] = [
    {
      imageUrl:
        'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1200&h=400&fit=crop',
      alt: 'Modern Office',
      title: 'Modern Office Design',
      description: 'Contemporary workspace with natural lighting',
    },
    {
      imageUrl:
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&h=400&fit=crop',
      alt: 'Living Room',
      title: 'Comfortable Living Room',
      description: 'Cozy seating area with elegant furniture',
    },
    {
      imageUrl:
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=400&fit=crop',
      alt: 'Modern Kitchen',
      title: 'Sleek Kitchen',
      description: 'State-of-the-art appliances and design',
    },
    {
      imageUrl:
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=400&fit=crop',
      alt: 'Bedroom',
      title: 'Relaxing Bedroom',
      description: 'Serene sleeping space with quality furnishings',
    },
  ];

  detailedItems: CarouselItem[] = [
    {
      imageUrl:
        'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1200&h=500&fit=crop',
      alt: 'Property 1',
      title: 'Stunning Penthouse',
      description: 'Luxury penthouse with city views and modern amenities',
    },
    {
      imageUrl:
        'https://images.unsplash.com/photo-1512917774080-9b274c5843c9?w=1200&h=500&fit=crop',
      alt: 'Property 2',
      title: 'Suburban Family Home',
      description: 'Spacious home with large yard, perfect for families',
    },
    {
      imageUrl:
        'https://images.unsplash.com/photo-1442821206421-2a37900cba3a?w=1200&h=500&fit=crop',
      alt: 'Property 3',
      title: 'Beachfront Villa',
      description: 'Exclusive villa with private beach access',
    },
  ];

  singleItem: CarouselItem[] = [
    {
      imageUrl:
        'https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=1200&h=400&fit=crop',
      alt: 'Beautiful Estate',
      title: 'Featured Property',
      description: 'This weeks featured listing',
    },
  ];
}
