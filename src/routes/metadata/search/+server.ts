import { error, json } from '@sveltejs/kit';
import { getAccessToken } from '$lib/auth/cookies.js';
import { queryMetadata } from '$lib/api/metadata.js';

/** @type {import('./$types').RequestHandler} */
export async function GET({ cookies, url }) {
  const token = await getAccessToken(cookies);
  if (!token) return error(401, 'Unauthorized');

  const params = url?.searchParams;
  const query = params.get('query');

  if (!query) {
    return error(400, 'Bad Request');
  }

  const queryResponse = await queryMetadata(
    token,
    {
      searchTerm: query
    },
    {
      page: 0,
      size: 1000000
    }
  );

  return json(queryResponse);
}
