import { AUTH_KEYCLOAK_CLIENT_ID, AUTH_KEYCLOAK_REALM, AUTH_KEYCLOAK_URL, AUTH_REDIRECT_URI } from '$env/static/private';
import { redirect } from '@sveltejs/kit';

export function GET() {
  if (!AUTH_KEYCLOAK_URL) {
    throw new Error('Keycloak URL is not defined');
  }
  if (!AUTH_KEYCLOAK_REALM) {
    throw new Error('Keycloak Realm is not defined');
  }
  if (!AUTH_KEYCLOAK_CLIENT_ID) {
    throw new Error('Keycloak Client ID is not defined');
  }

  const keycloakUrl = `${AUTH_KEYCLOAK_URL}/realms/${AUTH_KEYCLOAK_REALM}/protocol/openid-connect/auth`;

  const params = new URLSearchParams({
    client_id: AUTH_KEYCLOAK_CLIENT_ID,
    redirect_uri: AUTH_REDIRECT_URI,
    response_type: 'code',
    scope: 'openid profile email'
  });

  throw redirect(302, `${keycloakUrl}?${params}`);
}
