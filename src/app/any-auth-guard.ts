import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { getCurrentUser } from './core/current-user';

/**
 * For routes like /messages that both customers and artisans use — any
 * signed-in role is fine, since the component itself adapts based on the
 * role inside the token. The three existing role-specific guards
 * (auth-guard-guard, artisan-auth-guard-guard, adminauthguard-guard) stay
 * as-is for their own routes.
 */
export const anyAuthGuard: CanActivateFn = () => {
  const router = inject(Router);
  const user = getCurrentUser();

  if (user) {
    return true;
  }

  router.navigate(['/']);
  return false;
};
