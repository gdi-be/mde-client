import { getAccessToken, getRefreshToken, parseToken } from '$lib/auth/cookies';
import type { Handle } from '@sveltejs/kit';

const authHandle: Handle = async ({ event, resolve }) => {
  const accessToken = await getAccessToken(event.cookies);
  const refreshToken = getRefreshToken(event.cookies);

  if (accessToken) {
    event.locals.token = parseToken(accessToken);
    event.locals.tokenUnparsed = accessToken;
  }

  if (refreshToken) {
    event.locals.refreshToken = parseToken(refreshToken);
  }

  return resolve(event);
};

export default authHandle;
