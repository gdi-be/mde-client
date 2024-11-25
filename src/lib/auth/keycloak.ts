import jwt from 'jsonwebtoken';
import { env } from '$env/dynamic/private';
import { getRefreshToken, isTokenExpired, setAccessToken, setRefreshToken } from './cookies';
import { type Cookies } from '@sveltejs/kit';
import log from 'loggisch';

export const verifyToken = async (token: string) => {
  const publicKey = await fetchPublicKey();
  return jwt.verify(token, publicKey, { algorithms: ['RS256'] });
}

export const fetchPublicKey = async() => {
  const certsUrl = `${env.AUTH_KEYCLOAK_URL}/realms/${env.AUTH_KEYCLOAK_REALM}/protocol/openid-connect/certs`;

  const response = await fetch(certsUrl);
  if (!response.ok) {
    throw new Error('Failed to fetch Keycloak public keys');
  }

  const { keys } = (await response.json());
  if (!keys || keys.length === 0) {
    throw new Error('No public keys available');
  }

  const { n, e } = keys[0];

  const modulus = Buffer.from(n, 'base64url').toString('base64');
  const exponent = Buffer.from(e, 'base64url').toString('base64');

  const pemKey = `-----BEGIN PUBLIC KEY-----\n${modulus}\n${exponent}\n-----END PUBLIC KEY-----`;
  return pemKey;
}

export const updateTokens = async (cookies: Cookies): Promise<boolean> => {
  const refreshToken = getRefreshToken(cookies);

  if (!refreshToken || isTokenExpired(refreshToken)) {
    return Promise.reject('No valid refresh token found');
  }

  try {
    const body = new URLSearchParams();
    body.append('grant_type', 'refresh_token');
    body.append('client_id', env.AUTH_KEYCLOAK_CLIENT_ID);
    body.append('client_secret', env.AUTH_KEYCLOAK_CLIENT_SECRET);
    body.append('refresh_token', refreshToken);
    const response = await fetch(`${env.AUTH_KEYCLOAK_URL}/realms/${env.AUTH_KEYCLOAK_REALM}/protocol/openid-connect/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });

    if (!response.ok) {
      log.warning('Could not refresh tokens: ' + response.status);
      return false;
    }

    const data = await response.json();

    if (data.access_token) {
      setAccessToken(cookies, data.access_token);
    }
    if (data.refresh_token) {
      setRefreshToken(cookies, data.refresh_token);
    }

    return true;
  } catch (error) {
    log.warning('Error refreshing tokens: ' + error);
    return false;
  }
};
