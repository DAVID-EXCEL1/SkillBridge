import { jwtDecode } from 'jwt-decode';

export interface SkillBridgeTokenPayload {
  user_id: number;
  email: string;
  first_name: string;
  role: 'customer' | 'artisan' | 'admin';
  iat: number;
  exp: number;
}

/**
 * Reads and decodes the JWT stored in localStorage, or returns null if
 * there isn't one / it can't be decoded. Doesn't check expiry — that's
 * enforced server-side by AuthMiddleware.php on every protected request;
 * this is just for reading who's currently signed in on the client.
 */
export function getCurrentUser(): SkillBridgeTokenPayload | null {
  const token = localStorage.getItem('token');
  if (!token) {
    return null;
  }
  try {
    return jwtDecode<SkillBridgeTokenPayload>(token);
  } catch {
    return null;
  }
}
