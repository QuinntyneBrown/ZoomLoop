// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { TestBed } from '@angular/core/testing';
import { ProfileService } from './profile.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Profile } from '../models';
import { provideHttpClient } from '@angular/common/http';
import { expect } from 'vitest';

describe('ProfileService', () => {
  let service: ProfileService;
  let httpMock: HttpTestingController;

  const mockProfile: Profile = {
    profileId: '123',
    profileImageUrl: 'https://example.com/photo.jpg',
    firstName: 'John',
    lastName: 'Doe',
    phoneNumber: '555-1234',
    dateOfBirth: new Date('1990-01-01'),
    homeAddress: {
      address1: '123 Main St',
      address2: 'Apt 4B',
      city: 'New York',
      province: 'NY',
      postalCode: '10001'
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProfileService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(ProfileService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getCurrentProfile', () => {
    it('should return profile from API', async () => {
      const profilePromise = service.getCurrentProfile().toPromise();

      const req = httpMock.expectOne('/api/profile/current');
      expect(req.request.method).toBe('GET');
      req.flush({ profile: mockProfile });

      const profile = await profilePromise;
      expect(profile).toEqual(mockProfile);
    });

    it('should return null when no profile exists', async () => {
      const profilePromise = service.getCurrentProfile().toPromise();

      const req = httpMock.expectOne('/api/profile/current');
      req.flush({});

      const profile = await profilePromise;
      expect(profile).toBeNull();
    });

    it('should handle API errors', async () => {
      const profilePromise = service.getCurrentProfile().toPromise();

      const req = httpMock.expectOne('/api/profile/current');
      req.error(new ProgressEvent('error'));

      await expect(profilePromise).rejects.toThrowError();
    });
  });

  describe('updateProfile', () => {
    it('should update profile via API', async () => {
      const updatedProfile = { ...mockProfile, firstName: 'Jane' };
      const updatePromise = service.updateProfile(updatedProfile).toPromise();

      const req = httpMock.expectOne('/api/profile');
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual({ profile: updatedProfile });
      req.flush({ profile: updatedProfile });

      const profile = await updatePromise;
      expect(profile?.firstName).toBe('Jane');
    });

    it('should send profile data in request body', async () => {
      const updatePromise = service.updateProfile(mockProfile).toPromise();

      const req = httpMock.expectOne('/api/profile');
      expect(req.request.body.profile).toEqual(mockProfile);
      req.flush({ profile: mockProfile });

      await updatePromise;
    });

    it('should handle update errors', async () => {
      const updatePromise = service.updateProfile(mockProfile).toPromise();

      const req = httpMock.expectOne('/api/profile');
      req.error(new ProgressEvent('error'));

      await expect(updatePromise).rejects.toThrowError();
    });
  });
});
