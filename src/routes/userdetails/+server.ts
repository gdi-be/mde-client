import { env } from '$env/dynamic/private';
import { error } from '@sveltejs/kit';
import { getAccessToken } from '$lib/auth/cookies.js';

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
  const json = await response.json();

  return new Response(JSON.stringify(json), {
    status: response.status
  });
}
