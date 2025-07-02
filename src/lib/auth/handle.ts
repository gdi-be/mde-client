import { getAccessToken, getRefreshToken, isTokenExpired, parseToken } from '$lib/auth/cookies';
import { redirect, type Handle } from '@sveltejs/kit';

const PUBLIC_ROUTES = [
  '/login',
  '/logout',
  '/auth-callback',
  '/'
];

const authHandle: Handle = async ({ event, resolve }) => {
  const { url, cookies, request } = event;
  const method = request.method;

  const isPublic = PUBLIC_ROUTES.includes(url.pathname);

  const accessToken = await getAccessToken(cookies);
  const refreshToken = getRefreshToken(cookies);

  const tokensValid =
    accessToken ||
    (refreshToken && !isTokenExpired(refreshToken));

  if (!isPublic && !tokensValid) {
    if (method === 'GET' || method === 'HEAD') {
      // Nur für GET/HEAD Redirect machen
      throw redirect(302, '/login');
    } else {
      // Für alles andere (POST, PATCH, etc.) lieber 401 zurückgeben
      return new Response('Unauthorized', { status: 401 });
    }
  }

  if (accessToken) {
    event.locals.token = parseToken(accessToken);
    event.locals.tokenUnparsed = accessToken;
  }

  if (refreshToken && !isTokenExpired(refreshToken)) {
    event.locals.refreshToken = parseToken(refreshToken);
  }

  return resolve(event);
};

export default authHandle;
