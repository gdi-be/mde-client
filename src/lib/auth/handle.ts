import { getAccessToken, parseToken } from '$lib/auth/cookies';
import type { Handle } from '@sveltejs/kit';

const authHandle: Handle = async ({ event, resolve }) => {
  const token = await getAccessToken(event.cookies);
  if (token) {
    event.locals.token = parseToken(token);
  }
  return resolve(event);
};

export default authHandle;
