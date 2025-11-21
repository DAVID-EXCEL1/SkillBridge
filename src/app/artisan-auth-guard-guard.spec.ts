import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { artisanAuthGuardGuard } from './artisan-auth-guard-guard';

describe('artisanAuthGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => artisanAuthGuardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
