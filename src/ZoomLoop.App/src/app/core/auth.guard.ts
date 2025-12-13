// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { NavigationService } from './navigation.service';
import { LocalStorageService } from './local-storage.service';
import { accessTokenKey } from './constants';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const localStorageService = inject(LocalStorageService);
  const navigationService = inject(NavigationService);

  const token = localStorageService.get({ name: accessTokenKey });
  if (token) {
    return true;
  }

  navigationService.lastPath = state.url;
  navigationService.redirectToLogin();

  return false;
};
