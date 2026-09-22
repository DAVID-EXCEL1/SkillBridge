import { HttpInterceptorFn } from '@angular/common/http';

/**
 * Attaches "Authorization: Bearer <token>" to every outgoing request that
 * targets our own API, using whatever is in localStorage under 'token'.
 *
 * This is what makes the new backend auth checks (AuthMiddleware.php) work
 * without having to manually add a header in every single component that
 * calls a protected endpoint (orders, payments, reviews, chat, services,
 * stats, admin creation, logout).
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return next(req);
  }

  const authReq = req.clone({
    setHeaders: { Authorization: `Bearer ${token}` }
  });

  return next(authReq);
};
