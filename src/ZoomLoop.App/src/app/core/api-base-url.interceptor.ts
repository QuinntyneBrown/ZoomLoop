// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable()
export class ApiBaseUrlInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Only prepend base URL for relative API paths
    if (request.url.startsWith('/api/') && environment.apiBaseUrl) {
      const apiRequest = request.clone({
        url: `${environment.apiBaseUrl}${request.url}`
      });
      return next.handle(apiRequest);
    }
    
    return next.handle(request);
  }
}
