import { env } from '$env/dynamic/private';
import { error, json } from '@sveltejs/kit';
import { getAccessToken } from '$lib/auth/cookies.js';

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

  // we cant return response directly because it is a stream
  return json(await response.json());
}
