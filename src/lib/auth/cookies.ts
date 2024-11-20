import type { Cookies } from '@sveltejs/kit';

export const setTokens = (cookies: Cookies, accessToken: string, refreshToken: string): void => {
  cookies.set('access_token', accessToken, {
    httpOnly: true,
    secure: true,
    path: '/',
    sameSite: 'strict',
    // 1 hour
    maxAge: 3600,
  });

  cookies.set('refresh_token', refreshToken, {
    httpOnly: true,
    secure: true,
    path: '/',
    sameSite: 'strict',
    // 30 days
    maxAge: 30 * 24 * 60 * 60,
  });
};

export const getAccessToken = (cookies: Cookies, parsed = false) => {
  const token = cookies.get('access_token');
  if (!token) return;
  return parsed ? parseToken(token) : token;
};

export const parseToken = (token: string) => {
  try {
    const payload = token.split('.')[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
};
