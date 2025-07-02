import { getAccessToken, getRefreshToken, isTokenExpired, parseToken } from '$lib/auth/cookies';
import { redirect, type Handle } from '@sveltejs/kit';

const authHandle: Handle = async ({ event, resolve }) => {
  const accessToken = await getAccessToken(event.cookies);
  const refreshToken = getRefreshToken(event.cookies);

  if (accessToken) {
    event.locals.token = parseToken(accessToken);
    event.locals.tokenUnparsed = accessToken;
  }

  if (refreshToken) {
    if (isTokenExpired(refreshToken)) {
      redirect(302, '/login');
    }

    event.locals.refreshToken = parseToken(refreshToken);
  }

  return resolve(event);
};

export default authHandle;
