import { TestBed, inject } from '@angular/core/testing';

import { AuthJWTManagementService } from './auth-jwtmanagement.service';

describe('AuthJWTManagementService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthJWTManagementService]
    });
  });

  it('should be created', inject([AuthJWTManagementService], (service: AuthJWTManagementService) => {
    expect(service).toBeTruthy();
  }));
});
