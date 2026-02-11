import { error, json } from '@sveltejs/kit';
import { getAccessToken } from '$lib/auth/cookies.js';
import { logger } from 'loggisch';

/** @type {import('./$types').RequestHandler} */
export async function GET({ cookies, fetch, url }) {
  // TODO: add caching/fallback? Maybe via hooks?

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

  if (!response.ok) {
    logger.error('Failed to fetch keywords: ' + response.status);
    return error(response.status, 'Failed to fetch keywords');
  }

  let keywords;
  try {
    keywords = await response.json();
  } catch (e) {
    logger.error('Failed to parse keywords response:', e);
    return error(500, 'Invalid response from server');
  }

  return json(keywords);
}
