import { error } from '@sveltejs/kit';
import { getAccessToken } from '$lib/auth/cookies.js';
import { env } from '$env/dynamic/private';

/** @type {import('./$types').RequestHandler} */
export async function GET({ cookies, params }) {
  const token = await getAccessToken(cookies);
  if (!token) return error(401, 'Unauthorized');

  if (!params.metadataid) {
    return error(400, 'Bad Request');
  }

  const response = await fetch(`${env.BACKEND_URL}/metadata/${params.metadataid}/download`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    return error(response.status, response.statusText);
  }

  const blob = await response.blob();
  return new Response(blob);

}
