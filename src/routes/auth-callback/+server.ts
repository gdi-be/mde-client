import { json, redirect, error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { setRefreshToken, setAccessToken } from '$lib/auth/cookies';
import { logger } from 'loggisch';

export async function GET({ url, cookies }) {
  const code = url.searchParams.get('code');
  if (!code) return json({ error: 'Authorization code missing' }, { status: 400 });

  const tokenResponse = await exchangeCodeForTokens(code);

  if (!tokenResponse || !tokenResponse.access_token || !tokenResponse.refresh_token) {
    throw new Error('Token exchange failed');
  }

  setAccessToken(cookies, tokenResponse.access_token);
  setRefreshToken(cookies, tokenResponse.refresh_token);

  throw redirect(302, '/?reload=force');
}

async function exchangeCodeForTokens(code: string) {
  const tokenUrl = `${env.AUTH_KEYCLOAK_URL}/realms/${env.AUTH_KEYCLOAK_REALM}/protocol/openid-connect/token`;

  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    client_id: env.AUTH_KEYCLOAK_CLIENT_ID,
    redirect_uri: env.AUTH_REDIRECT_URI,
    client_secret: env.AUTH_KEYCLOAK_CLIENT_SECRET
  });

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  });

  if (!response.ok) {
    logger.error('Failed to exchange authorization code for tokens: ' + response.status);
    throw error(400, 'Failed to exchange authorization code for tokens');
  }

  let tokenData;
  try {
    tokenData = await response.json();
  } catch (e) {
    logger.error('Failed to parse token exchange response:', e);
    throw error(400, 'Invalid response from authentication server');
  }

  return tokenData;
}
