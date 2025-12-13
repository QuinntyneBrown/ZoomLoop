import { Routes } from '@angular/router';
import { authGuard } from './core';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login').then(m => m.Login)
  },
  {
    path: 'vehicles/create',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/vehicle-create').then(m => m.VehicleCreate)
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  }
];
