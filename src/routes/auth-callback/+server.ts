import { json, redirect } from '@sveltejs/kit';
import {
  AUTH_KEYCLOAK_CLIENT_ID,
  AUTH_KEYCLOAK_CLIENT_SECRET,
  AUTH_KEYCLOAK_REALM,
  AUTH_KEYCLOAK_URL,
  AUTH_REDIRECT_URI,
} from '$env/static/private';
import { setTokens } from '$lib/auth/cookies';

export async function GET({ url, cookies }) {
  const code = url.searchParams.get('code');
  if (!code) return json({ error: 'Authorization code missing' }, { status: 400 });

  const tokenResponse = await exchangeCodeForTokens(code);

  if (!tokenResponse || !tokenResponse.access_token || !tokenResponse.refresh_token) {
    throw new Error('Token exchange failed');
  }

  setTokens(cookies, tokenResponse.access_token, tokenResponse.refresh_token);

  throw redirect(302, '/');
}

async function exchangeCodeForTokens(code: string) {
  const tokenUrl = `${AUTH_KEYCLOAK_URL}/realms/${AUTH_KEYCLOAK_REALM}/protocol/openid-connect/token`;

  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    client_id: AUTH_KEYCLOAK_CLIENT_ID,
    redirect_uri: AUTH_REDIRECT_URI,
    client_secret: AUTH_KEYCLOAK_CLIENT_SECRET,
  });

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });

  if (!response.ok) {
    throw new Error('Failed to exchange authorization code for tokens');
  }

  return await response.json();
}
