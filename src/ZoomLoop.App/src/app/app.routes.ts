import { Routes } from '@angular/router';
import { authGuard } from './core';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login').then(m => m.Login)
  },
  {
    path: 'loan-calculator',
    loadComponent: () => import('./pages/loan-calculator').then(m => m.LoanCalculator)
  },
  {
    path: 'personal-info',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/personal-info').then(m => m.PersonalInfo)
  },
  {
    path: 'administrator-cars',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/administrator-cars').then(m => m.AdministratorCars)
  },
  {
    path: 'vehicles/create',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/vehicle-create').then(m => m.VehicleCreate)
  },
  {
    path: 'cars/:keyword',
    loadComponent: () => import('./pages/cars').then(m => m.Cars)
  },
  {
    path: 'cars',
    loadComponent: () => import('./pages/cars').then(m => m.Cars)
  },
  {
    path: 'loan-calculator',
    loadComponent: () => import('./pages/loan-calculator').then(m => m.LoanCalculator)
  },
  {
    path: 'demo/amortization',
    loadComponent: () => import('./components/amortization-schedule/amortization-schedule.demo').then(m => m.AmortizationScheduleDemo)
  },
  {
    path: 'demo/tabs',
    loadComponent: () => import('./components/tabs/tabs.demo').then(m => m.TabsDemo)
  },
  {
    path: 'demo/summary-card',
    loadComponent: () => import('./components/summary-card/summary-card.demo').then(m => m.SummaryCardDemo)
  },
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./pages').then(m => m.BuyOrSellYourCar)
  }
];
