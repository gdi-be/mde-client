import { env } from '$env/dynamic/private';
import { redirect } from '@sveltejs/kit';

export function GET() {
  if (!env.AUTH_KEYCLOAK_URL) {
    throw new Error('Keycloak URL is not defined');
  }
  if (!env.AUTH_KEYCLOAK_REALM) {
    throw new Error('Keycloak Realm is not defined');
  }
  if (!env.AUTH_KEYCLOAK_CLIENT_ID) {
    throw new Error('Keycloak Client ID is not defined');
  }

  const keycloakUrl = `${env.AUTH_KEYCLOAK_URL}/realms/${env.AUTH_KEYCLOAK_REALM}/protocol/openid-connect/auth`;

  const params = new URLSearchParams({
    client_id: env.AUTH_KEYCLOAK_CLIENT_ID,
    redirect_uri: env.AUTH_REDIRECT_URI,
    response_type: 'code',
    scope: 'openid profile email'
  });

  throw redirect(302, `${keycloakUrl}?${params}`);
}
