import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { jwtDecode, JwtPayload } from 'jwt-decode';

export const artisanAuthGuardGuard: CanActivateFn = (route, state) => {
  const token = localStorage['token'];
  const router = inject(Router);
  if (token) {
    //confirm token validity
    const decoded: any = jwtDecode<JwtPayload>(token);
    const expTime = decoded.exp * 1000;
    const now = Date.now();
  
    if ((now - expTime) < 3000) {
      return true;
  
    } else {
      router.navigate(['/artisan-signin']);
      return false;
    }
  }

  router.navigate(['/artisan-signin']);
  return false;
};

