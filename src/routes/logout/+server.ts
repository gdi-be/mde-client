import { env } from '$env/dynamic/private';
import { redirect } from '@sveltejs/kit';

export async function GET({ cookies }) {

  const refreshToken = cookies.get('refresh_token');

  if (refreshToken) {
    const logoutUrl = `${env.AUTH_KEYCLOAK_URL}/realms/${env.AUTH_KEYCLOAK_REALM}/protocol/openid-connect/logout`;

    const params = new URLSearchParams({
      client_id: env.AUTH_KEYCLOAK_CLIENT_ID,
      client_secret: env.AUTH_KEYCLOAK_CLIENT_SECRET,
      refresh_token: refreshToken
    });

    // Führe den POST-Request zum Keycloak-Logout-Endpunkt aus
    const response = await fetch(logoutUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params
    });

    if (!response.ok) {
      throw new Error('Failed to logout from Keycloak');
    }
  }

  cookies.delete('access_token', {
    path: '/',
    httpOnly: true,
    sameSite: 'strict',
    secure: true
  });

  cookies.delete('refresh_token', {
    path: '/',
    httpOnly: true,
    sameSite: 'strict',
    secure: true
  });

  throw redirect(302, '/');
}
