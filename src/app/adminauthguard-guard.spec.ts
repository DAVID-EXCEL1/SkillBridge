import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { adminauthguardGuard } from './adminauthguard-guard';

describe('adminauthguardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => adminauthguardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
