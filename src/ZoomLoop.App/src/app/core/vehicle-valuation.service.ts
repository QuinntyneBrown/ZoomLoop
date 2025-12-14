// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface VehicleByVinResponse {
  year: number;
  make: string;
  model: string;
}

export interface VehicleValuationRequest {
  vin: string;
  year: number;
  make: string;
  model: string;
  postalCode: string;
  kilometers: number;
  accidents: number;
  interiorCondition: string;
  exteriorCondition: string;
}

export interface VehicleValuationResponse {
  fairValue: number;
  explanation: string;
}

@Injectable({
  providedIn: 'root'
})
export class VehicleValuationService {
  private readonly _http = inject(HttpClient);

  getVehicleByVin(vin: string): Observable<VehicleByVinResponse> {
    return this._http.get<VehicleByVinResponse>(`/api/vehiclevaluation/vin/${vin}`);
  }

  getVehicleValuation(request: VehicleValuationRequest): Observable<VehicleValuationResponse> {
    return this._http.post<VehicleValuationResponse>('/api/vehiclevaluation/valuation', request);
  }
}
