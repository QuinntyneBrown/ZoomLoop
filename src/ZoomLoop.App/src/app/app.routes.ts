import { Routes } from '@angular/router';
import { authGuard } from './core';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login').then(m => m.Login)
  },
  {
    path: 'personal-info',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/personal-info').then(m => m.PersonalInfo)
  },
  {
    path: 'vehicles/create',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/vehicle-create').then(m => m.VehicleCreate)
  },
  {
    path: 'demo/tabs',
    loadComponent: () => import('./components/tabs/tabs.demo').then(m => m.TabsDemo)
  },
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./pages').then(m => m.BuyOrSellYourCar)
  }
];
