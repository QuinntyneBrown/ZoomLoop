// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Profile } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private _http = inject(HttpClient);

  getCurrentProfile(): Observable<Profile | null> {
    return this._http.get<{ profile?: Profile }>('/api/profile/current')
      .pipe(map(response => response.profile || null));
  }

  updateProfile(profile: Profile): Observable<Profile> {
    return this._http.put<{ profile: Profile }>('/api/profile', { profile })
      .pipe(map(response => response.profile));
  }
}
