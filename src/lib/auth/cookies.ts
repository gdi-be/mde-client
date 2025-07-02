import { type Cookies } from '@sveltejs/kit';
import { updateTokens } from './keycloak';
import log from 'loggisch';

export const setAccessToken = (cookies: Cookies, accessToken: string): void => {
  const parsedToken = parseToken(accessToken);
  const maxAge = parsedToken.exp - parsedToken.iat;

  cookies.set('access_token', accessToken, {
    httpOnly: true,
    secure: true,
    path: '/',
    sameSite: 'strict',
    // fallback 24 hours
    maxAge: Number.isFinite(maxAge) ? maxAge : 60 * 60 * 24
  });
};

export const setRefreshToken = (cookies: Cookies, refreshToken: string): void => {
  const parsedToken = parseToken(refreshToken);
  const maxAge = parsedToken.exp - parsedToken.iat;

  cookies.set('refresh_token', refreshToken, {
    httpOnly: true,
    secure: true,
    path: '/',
    sameSite: 'strict',
    // fallback 30 days
    maxAge: Number.isFinite(maxAge) ? maxAge : 30 * 24 * 60 * 60
  });
};

export const getAccessToken = async (cookies: Cookies): Promise<string | undefined> => {
  const token = cookies.get('access_token');
  const refreshToken = getRefreshToken(cookies);

  if (!token && !refreshToken) {
    return undefined;
  }

  if (token) {
    if (!isTokenExpired(token)) {
      return token;
    }
    const { accessToken } = await updateTokens(cookies);
    if (accessToken) {
      return accessToken;
    } else {
      log.warning('Failed to refresh access token');
      return undefined;
    }
  }

  log.info('Access token missing, trying to refresh');
  const { accessToken } = await updateTokens(cookies);
  if (!accessToken) {
    log.warning('Failed to refresh access token');
    return Promise.reject('Failed to refresh access token');
  }

  return accessToken;
};

export const getRefreshToken = (cookies: Cookies) => {
  return cookies.get('refresh_token');
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

export const isTokenExpired = (token?: string, bufferMs: number = 0) => {
  if (!token) return false;
  const parsedToken = parseToken(token);
  if (!parsedToken?.exp) return false;
  return Date.now() >= (parsedToken.exp * 1000 - bufferMs);
};
