import { JwtPayload } from '@/types/auth';

export function decodeJwt(token: string): JwtPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = parts[1];
    // Replace URL-safe characters and restore padding
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = atob(base64);
    
    return JSON.parse(decoded) as JwtPayload;
  } catch (e) {
    console.error('Error decoding JWT token:', e);
    return null;
  }
}
