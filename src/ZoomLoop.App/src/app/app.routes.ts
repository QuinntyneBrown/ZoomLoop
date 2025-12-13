import { Routes } from '@angular/router';
import { authGuard } from './core';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  }
];
