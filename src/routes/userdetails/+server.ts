import { env } from '$env/dynamic/private';
import { error } from '@sveltejs/kit';
import { getAccessToken } from '$lib/auth/cookies.js';
import { logger } from 'loggisch';

/** @type {import('./$types').RequestHandler} */
export async function GET({ cookies, fetch }) {
  const token = await getAccessToken(cookies);
  if (!token) return error(401, 'Unauthorized');

  const headers = new Headers({
    Authorization: `Bearer ${token}`
  });

  const response = await fetch(`${env.BACKEND_URL}/user/details`, {
    headers
  });

  if (!response.ok) {
    logger.error('Failed to fetch user details: ' + response.status);
    return error(response.status, 'Failed to fetch user details');
  }

  let json;
  try {
    json = await response.json();
  } catch (e) {
    logger.error('Failed to parse user details response:', e);
    return error(500, 'Invalid response from server');
  }

  return new Response(JSON.stringify(json), {
    status: response.status
  });
}
