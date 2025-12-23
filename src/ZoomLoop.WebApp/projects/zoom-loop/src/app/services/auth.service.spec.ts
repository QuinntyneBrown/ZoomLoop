import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  User,
  Session
} from '../models';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  const baseUrl = environment.apiUrl;

  const mockUser: User = {
    userId: '123e4567-e89b-12d3-a456-426614174000',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    phone: '555-1234',
    emailVerified: true,
    phoneVerified: false,
    twoFactorEnabled: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  };

  const mockLoginResponse: LoginResponse = {
    accessToken: 'mock-access-token',
    refreshToken: 'mock-refresh-token',
    expiresIn: 900,
    user: mockUser
  };

  const mockRegisterResponse: RegisterResponse = {
    userId: mockUser.userId,
    email: mockUser.email,
    message: 'Registration successful. Please verify your email.'
  };

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        AuthService
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should POST to /api/v1/auth/login and return login response', () => {
      const loginRequest: LoginRequest = {
        email: 'test@example.com',
        password: 'password123',
        rememberMe: true
      };

      service.login(loginRequest).subscribe(response => {
        expect(response).toEqual(mockLoginResponse);
      });

      const req = httpMock.expectOne(`${baseUrl}/api/v1/auth/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(loginRequest);
      req.flush(mockLoginResponse);
    });

    it('should store tokens after successful login', () => {
      const loginRequest: LoginRequest = {
        email: 'test@example.com',
        password: 'password123',
        rememberMe: false
      };

      service.login(loginRequest).subscribe(() => {
        expect(service.getAccessToken()).toBe('mock-access-token');
        expect(service.getRefreshToken()).toBe('mock-refresh-token');
      });

      const req = httpMock.expectOne(`${baseUrl}/api/v1/auth/login`);
      req.flush(mockLoginResponse);
    });

    it('should update currentUser$ after successful login', (done) => {
      const loginRequest: LoginRequest = {
        email: 'test@example.com',
        password: 'password123',
        rememberMe: false
      };

      service.login(loginRequest).subscribe(() => {
        service.currentUser$.subscribe(user => {
          expect(user).toEqual(mockUser);
          done();
        });
      });

      const req = httpMock.expectOne(`${baseUrl}/api/v1/auth/login`);
      req.flush(mockLoginResponse);
    });

    it('should update isAuthenticated$ to true after successful login', (done) => {
      const loginRequest: LoginRequest = {
        email: 'test@example.com',
        password: 'password123',
        rememberMe: false
      };

      service.login(loginRequest).subscribe(() => {
        service.isAuthenticated$.subscribe(isAuth => {
          expect(isAuth).toBe(true);
          done();
        });
      });

      const req = httpMock.expectOne(`${baseUrl}/api/v1/auth/login`);
      req.flush(mockLoginResponse);
    });

    it('should propagate error on login failure', (done) => {
      const loginRequest: LoginRequest = {
        email: 'test@example.com',
        password: 'wrongpassword',
        rememberMe: false
      };

      service.login(loginRequest).subscribe({
        error: (error) => {
          expect(error.status).toBe(401);
          done();
        }
      });

      const req = httpMock.expectOne(`${baseUrl}/api/v1/auth/login`);
      req.flush({ detail: 'Invalid credentials' }, { status: 401, statusText: 'Unauthorized' });
    });
  });

  describe('register', () => {
    it('should POST to /api/v1/auth/register and return register response', () => {
      const registerRequest: RegisterRequest = {
        email: 'newuser@example.com',
        password: 'Password123!',
        firstName: 'Jane',
        lastName: 'Doe',
        phone: '555-5678',
        marketingOptIn: true
      };

      service.register(registerRequest).subscribe(response => {
        expect(response).toEqual(mockRegisterResponse);
      });

      const req = httpMock.expectOne(`${baseUrl}/api/v1/auth/register`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(registerRequest);
      req.flush(mockRegisterResponse);
    });

    it('should not store tokens after registration', () => {
      const registerRequest: RegisterRequest = {
        email: 'newuser@example.com',
        password: 'Password123!',
        firstName: 'Jane',
        lastName: 'Doe',
        marketingOptIn: false
      };

      service.register(registerRequest).subscribe(() => {
        expect(service.getAccessToken()).toBeNull();
        expect(service.getRefreshToken()).toBeNull();
      });

      const req = httpMock.expectOne(`${baseUrl}/api/v1/auth/register`);
      req.flush(mockRegisterResponse);
    });

    it('should propagate error when email already exists', (done) => {
      const registerRequest: RegisterRequest = {
        email: 'existing@example.com',
        password: 'Password123!',
        firstName: 'Jane',
        lastName: 'Doe',
        marketingOptIn: false
      };

      service.register(registerRequest).subscribe({
        error: (error) => {
          expect(error.status).toBe(409);
          done();
        }
      });

      const req = httpMock.expectOne(`${baseUrl}/api/v1/auth/register`);
      req.flush({ detail: 'Email already registered' }, { status: 409, statusText: 'Conflict' });
    });
  });

  describe('logout', () => {
    beforeEach(() => {
      localStorage.setItem('zoomloop_access_token', 'test-token');
      localStorage.setItem('zoomloop_refresh_token', 'test-refresh');
    });

    it('should POST to /api/v1/auth/logout with auth header', () => {
      service.logout().subscribe();

      const req = httpMock.expectOne(`${baseUrl}/api/v1/auth/logout`);
      expect(req.request.method).toBe('POST');
      expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
      req.flush({});
    });

    it('should clear storage after successful logout', () => {
      service.logout().subscribe(() => {
        expect(service.getAccessToken()).toBeNull();
        expect(service.getRefreshToken()).toBeNull();
      });

      const req = httpMock.expectOne(`${baseUrl}/api/v1/auth/logout`);
      req.flush({});
    });

    it('should update currentUser$ to null after logout', (done) => {
      service.logout().subscribe(() => {
        service.currentUser$.subscribe(user => {
          expect(user).toBeNull();
          done();
        });
      });

      const req = httpMock.expectOne(`${baseUrl}/api/v1/auth/logout`);
      req.flush({});
    });

    it('should clear storage even on logout error', () => {
      service.logout().subscribe(() => {
        expect(service.getAccessToken()).toBeNull();
      });

      const req = httpMock.expectOne(`${baseUrl}/api/v1/auth/logout`);
      req.flush({}, { status: 500, statusText: 'Server Error' });
    });
  });

  describe('refreshToken', () => {
    beforeEach(() => {
      localStorage.setItem('zoomloop_access_token', 'old-access-token');
      localStorage.setItem('zoomloop_refresh_token', 'valid-refresh-token');
    });

    it('should POST to /api/v1/auth/refresh with refresh token', () => {
      service.refreshToken().subscribe();

      const req = httpMock.expectOne(`${baseUrl}/api/v1/auth/refresh`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ refreshToken: 'valid-refresh-token' });
      req.flush({ accessToken: 'new-access-token', expiresIn: 900 });
    });

    it('should update stored access token on success', () => {
      service.refreshToken().subscribe(() => {
        expect(service.getAccessToken()).toBe('new-access-token');
      });

      const req = httpMock.expectOne(`${baseUrl}/api/v1/auth/refresh`);
      req.flush({ accessToken: 'new-access-token', expiresIn: 900 });
    });

    it('should throw error when no refresh token exists', (done) => {
      localStorage.removeItem('zoomloop_refresh_token');

      service.refreshToken().subscribe({
        error: (error) => {
          expect(error.message).toBe('No refresh token');
          done();
        }
      });
    });

    it('should clear storage on refresh token failure', (done) => {
      service.refreshToken().subscribe({
        error: () => {
          expect(service.getAccessToken()).toBeNull();
          expect(service.getRefreshToken()).toBeNull();
          done();
        }
      });

      const req = httpMock.expectOne(`${baseUrl}/api/v1/auth/refresh`);
      req.flush({ detail: 'Invalid refresh token' }, { status: 401, statusText: 'Unauthorized' });
    });
  });

  describe('forgotPassword', () => {
    it('should POST to /api/v1/auth/forgot-password', () => {
      const request = { email: 'test@example.com' };

      service.forgotPassword(request).subscribe();

      const req = httpMock.expectOne(`${baseUrl}/api/v1/auth/forgot-password`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(request);
      req.flush({});
    });
  });

  describe('resetPassword', () => {
    it('should POST to /api/v1/auth/reset-password', () => {
      const request = { token: 'reset-token', newPassword: 'NewPassword123!' };

      service.resetPassword(request).subscribe();

      const req = httpMock.expectOne(`${baseUrl}/api/v1/auth/reset-password`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(request);
      req.flush({});
    });
  });

  describe('verifyEmail', () => {
    it('should POST to /api/v1/auth/verify-email with token', () => {
      const token = 'email-verification-token';

      service.verifyEmail(token).subscribe();

      const req = httpMock.expectOne(`${baseUrl}/api/v1/auth/verify-email`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ token });
      req.flush({});
    });
  });

  describe('getCurrentUser', () => {
    beforeEach(() => {
      localStorage.setItem('zoomloop_access_token', 'test-token');
    });

    it('should GET /api/v1/users/me with auth header', () => {
      service.getCurrentUser().subscribe(user => {
        expect(user).toEqual(mockUser);
      });

      const req = httpMock.expectOne(`${baseUrl}/api/v1/users/me`);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
      req.flush(mockUser);
    });

    it('should update currentUser$ with fetched user', (done) => {
      service.getCurrentUser().subscribe(() => {
        service.currentUser$.subscribe(user => {
          expect(user).toEqual(mockUser);
          done();
        });
      });

      const req = httpMock.expectOne(`${baseUrl}/api/v1/users/me`);
      req.flush(mockUser);
    });
  });

  describe('updateProfile', () => {
    beforeEach(() => {
      localStorage.setItem('zoomloop_access_token', 'test-token');
    });

    it('should PUT /api/v1/users/me with profile data', () => {
      const request = { firstName: 'Updated', lastName: 'Name' };

      service.updateProfile(request).subscribe();

      const req = httpMock.expectOne(`${baseUrl}/api/v1/users/me`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
      expect(req.request.body).toEqual(request);
      req.flush({});
    });
  });

  describe('changeEmail', () => {
    beforeEach(() => {
      localStorage.setItem('zoomloop_access_token', 'test-token');
    });

    it('should PUT /api/v1/users/me/email', () => {
      const request = { newEmail: 'newemail@example.com', password: 'currentPassword' };

      service.changeEmail(request).subscribe();

      const req = httpMock.expectOne(`${baseUrl}/api/v1/users/me/email`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
      expect(req.request.body).toEqual(request);
      req.flush({});
    });
  });

  describe('changePassword', () => {
    beforeEach(() => {
      localStorage.setItem('zoomloop_access_token', 'test-token');
    });

    it('should PUT /api/v1/users/me/password', () => {
      const request = { currentPassword: 'oldPass', newPassword: 'newPass123!' };

      service.changePassword(request).subscribe();

      const req = httpMock.expectOne(`${baseUrl}/api/v1/users/me/password`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
      expect(req.request.body).toEqual(request);
      req.flush({});
    });
  });

  describe('getSessions', () => {
    beforeEach(() => {
      localStorage.setItem('zoomloop_access_token', 'test-token');
    });

    it('should GET /api/v1/users/me/sessions with auth header', () => {
      const mockSessions: Session[] = [
        {
          sessionId: 'session-1',
          device: 'Chrome on Windows',
          ipAddress: '192.168.1.1',
          createdAt: '2024-01-01T00:00:00Z',
          lastActiveAt: '2024-01-02T00:00:00Z',
          isCurrent: true
        }
      ];

      service.getSessions().subscribe(response => {
        expect(response.sessions).toEqual(mockSessions);
      });

      const req = httpMock.expectOne(`${baseUrl}/api/v1/users/me/sessions`);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
      req.flush({ sessions: mockSessions });
    });
  });

  describe('revokeSession', () => {
    beforeEach(() => {
      localStorage.setItem('zoomloop_access_token', 'test-token');
    });

    it('should DELETE /api/v1/users/me/sessions/:sessionId', () => {
      const sessionId = 'session-to-revoke';

      service.revokeSession(sessionId).subscribe();

      const req = httpMock.expectOne(`${baseUrl}/api/v1/users/me/sessions/${sessionId}`);
      expect(req.request.method).toBe('DELETE');
      expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
      req.flush({});
    });
  });

  describe('token management', () => {
    it('should return null when no access token exists', () => {
      expect(service.getAccessToken()).toBeNull();
    });

    it('should return null when no refresh token exists', () => {
      expect(service.getRefreshToken()).toBeNull();
    });

    it('should return stored access token', () => {
      localStorage.setItem('zoomloop_access_token', 'stored-token');
      expect(service.getAccessToken()).toBe('stored-token');
    });

    it('should return stored refresh token', () => {
      localStorage.setItem('zoomloop_refresh_token', 'stored-refresh');
      expect(service.getRefreshToken()).toBe('stored-refresh');
    });
  });

  describe('initial state', () => {
    it('should have null currentUser initially', () => {
      expect(service.currentUser).toBeNull();
    });

    it('should not be authenticated initially', () => {
      expect(service.isAuthenticated).toBe(false);
    });

    it('should load user from localStorage on init', () => {
      localStorage.setItem('zoomloop_user', JSON.stringify(mockUser));
      localStorage.setItem('zoomloop_access_token', 'test-token');

      const newService = TestBed.inject(AuthService);
      expect(newService.currentUser).toEqual(mockUser);
    });
  });
});
