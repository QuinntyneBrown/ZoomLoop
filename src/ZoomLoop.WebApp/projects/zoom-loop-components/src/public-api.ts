/*
 * Public API Surface of zoom-loop-components
 */

// Legacy Components
export * from './lib/zoom-loop-components';

// Core Components
export * from './lib/badge/badge.component';
export * from './lib/button/button.component';
export * from './lib/input/input.component';

// Layout Components
export * from './lib/header/header.component';
export * from './lib/footer/footer.component';
export * from './lib/modal/modal.component';

// Search & Filter Components
export * from './lib/search-bar/search-bar.component';
export * from './lib/filter-sidebar/filter-sidebar.component';

// Hero & Marketing Components
export * from './lib/hero/hero.component';
export * from './lib/how-it-works/how-it-works.component';
export * from './lib/trust-badges/trust-badges.component';

// Vehicle Components
export { VehicleCardComponent } from './lib/vehicle-card/vehicle-card.component';
export type { VehicleData, VehicleSpec } from './lib/vehicle-card/vehicle-card.component';
export * from './lib/finance-calculator/finance-calculator.component';
export * from './lib/image-gallery/image-gallery.component';
export * from './lib/vehicle-master-detail/vehicle-master-detail.component';
export { VehiclesComponent } from './lib/vehicles/vehicles.component';
export type { VehiclesConfig } from './lib/vehicles/vehicles.component';

// Feedback Components
export * from './lib/toast/toast.component';

// Auth Components
export * from './lib/login-dialog';

// Dialog Components
export * from './lib/vehicle-ingestion-dialog';

// User Components
export * from './lib/my-profile/my-profile';
