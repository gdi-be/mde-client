import { getAccessToken } from '$lib/auth/cookies';
import type { Handle } from '@sveltejs/kit';

const authHandle: Handle = ({ event, resolve }) => {
  const token = getAccessToken(event.cookies, true);

  if (token) {
    try {
      event.locals.token = token;
    } catch {
      event.locals.token = null;
    }
  }

  return resolve(event);
}

export default authHandle;
