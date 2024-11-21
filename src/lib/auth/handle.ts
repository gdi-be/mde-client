import { getAccessToken } from '$lib/auth/cookies';
import type { Handle } from '@sveltejs/kit';

const authHandle: Handle = async ({ event, resolve }) => {
  event.locals.token = getAccessToken(event.cookies, true);

  return resolve(event);
}

export default authHandle;
