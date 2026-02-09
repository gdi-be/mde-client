import { env } from '$env/dynamic/private';
import { error, json } from '@sveltejs/kit';
import { getAccessToken } from '$lib/auth/cookies.js';
import { logger } from 'loggisch';

/** @type {import('./$types').RequestHandler} */
export async function GET({ cookies, fetch, params }) {
  const token = await getAccessToken(cookies);
  if (!token) return error(401, 'Unauthorized');

  const headers = new Headers({
    Authorization: `Bearer ${token}`
  });

  const response = await fetch(`${env.BACKEND_URL}/metadata/${params.metadataid}/autokeywords`, {
    headers
  });

  if (!response.ok) {
    logger.error('Failed to fetch autokeywords: ' + response.status);
    return error(response.status, 'Failed to fetch autokeywords');
  }

  try {
    // we cant return response directly because it is a stream
    return json(await response.json());
  } catch (e) {
    logger.error('Failed to parse autokeywords response:', e);
    return error(500, 'Invalid response from server');
  }
}
