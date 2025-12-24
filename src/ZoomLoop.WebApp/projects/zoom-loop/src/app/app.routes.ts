// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Routes } from '@angular/router';
import { Layout } from './components';
import { authGuard } from './guards';

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
      },
      {
        path: 'how-it-works',
        loadComponent: () => import('./pages').then(m => m.Sell)
      },
      {
        path: 'my-dashboard',
        loadComponent: () => import('./pages').then(m => m.MyDashboard),
        canActivate: [authGuard]
      },
      {
        path: 'create-account',
        loadComponent: () => import('./pages').then(m => m.CreateAccount)
      }
    ]
  }
];
