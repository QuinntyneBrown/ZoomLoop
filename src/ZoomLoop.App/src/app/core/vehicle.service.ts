// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vehicle } from '../models';

export interface VehiclesPageResponse {
  length: number;
  entities: Vehicle[];
}

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private readonly _http = inject(HttpClient);

  getVehiclesPage(pageSize: number, pageIndex: number): Observable<VehiclesPageResponse> {
    return this._http.get<VehiclesPageResponse>(`/api/vehicle/page/${pageSize}/${pageIndex}`);
  }

  getVehicleById(vehicleId: string): Observable<{ vehicle: Vehicle }> {
    return this._http.get<{ vehicle: Vehicle }>(`/api/vehicle/${vehicleId}`);
  }

  createVehicle(vehicle: Vehicle): Observable<{ vehicle: Vehicle }> {
    return this._http.post<{ vehicle: Vehicle }>('/api/vehicle', { vehicle });
  }

  updateVehicle(vehicle: Vehicle): Observable<{ vehicle: Vehicle }> {
    return this._http.put<{ vehicle: Vehicle }>('/api/vehicle', { vehicle });
  }

  deleteVehicle(vehicleId: string): Observable<{ vehicleId: string }> {
    return this._http.delete<{ vehicleId: string }>(`/api/vehicle/${vehicleId}`);
  }

  ingestVehicle(images: File[]): Observable<{ vehicle: Vehicle }> {
    const formData = new FormData();
    images.forEach(image => {
      formData.append('images', image);
    });
    return this._http.post<{ vehicle: Vehicle }>('/api/vehicle/ingest', formData);
  }
}
