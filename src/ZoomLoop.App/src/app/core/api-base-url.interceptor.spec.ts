// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { ApiBaseUrlInterceptor } from './api-base-url.interceptor';
import { environment } from '../../environments/environment';

describe('ApiBaseUrlInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: ApiBaseUrlInterceptor,
          multi: true
        }
      ]
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should prepend base URL to API requests', () => {
    httpClient.get('/api/user/current').subscribe();

    const req = httpMock.expectOne((request) => {
      return request.url.includes('/api/user/current');
    });

    const expectedUrl = environment.apiBaseUrl 
      ? `${environment.apiBaseUrl}/api/user/current` 
      : '/api/user/current';
    expect(req.request.url).toBe(expectedUrl);
    req.flush({});
  });

  it('should not modify non-API requests', () => {
    const externalUrl = 'https://example.com/data';
    httpClient.get(externalUrl).subscribe();

    const req = httpMock.expectOne(externalUrl);
    expect(req.request.url).toBe(externalUrl);
    req.flush({});
  });

  it('should handle POST requests to API', () => {
    const payload = { username: 'test', password: 'test123' };
    httpClient.post('/api/user/token', payload).subscribe();

    const req = httpMock.expectOne((request) => {
      return request.url.includes('/api/user/token');
    });

    const expectedUrl = environment.apiBaseUrl 
      ? `${environment.apiBaseUrl}/api/user/token` 
      : '/api/user/token';
    expect(req.request.url).toBe(expectedUrl);
    expect(req.request.body).toEqual(payload);
    req.flush({});
  });
});
