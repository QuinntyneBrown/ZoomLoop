import { Routes } from '@angular/router';
import { Layout } from './components';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '',
        loadComponent: () => import('./pages').then(m => m.Home)
      },
      {
        path: 'cars',
        loadComponent: () => import('./pages').then(m => m.Cars)
      },
      {
        path: 'cars/:id',
        loadComponent: () => import('./pages').then(m => m.VehicleDetail)
      },
      {
        path: 'sell',
        loadComponent: () => import('./pages').then(m => m.Sell)
      }
    ]
  }
];
