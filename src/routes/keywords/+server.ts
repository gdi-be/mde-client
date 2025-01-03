import { error, json } from '@sveltejs/kit';
import { getAccessToken } from '$lib/auth/cookies.js';

/** @type {import('./$types').RequestHandler} */
export async function GET({ cookies, fetch, url }) {

  const token = await getAccessToken(cookies);
  if (!token) return error(401, 'Unauthorized');

  const terms = url.searchParams.get('terms');

  const response = await fetch(`https://sns.uba.de/umthes/de/similar.json?terms=${terms}`, {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });

  const keywords = await response.json();

  return json(keywords);
}
