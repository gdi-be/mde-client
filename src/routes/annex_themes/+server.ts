import { error, json } from '@sveltejs/kit';
import { getAccessToken } from '$lib/auth/cookies.js';

/** @type {import('./$types').RequestHandler} */
export async function GET({ cookies, fetch }) {

  const token = await getAccessToken(cookies);
  if (!token) return error(401, 'Unauthorized');

  const response = await fetch('https://inspire.ec.europa.eu/theme/theme.de.json', {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });

  const keywords = await response.json();

  return json(keywords);
}
