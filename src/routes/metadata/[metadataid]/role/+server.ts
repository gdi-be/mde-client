import { error, json } from '@sveltejs/kit';
import { getAccessToken } from '$lib/auth/cookies.js';
import { assignRole } from '$lib/api/metadata.js';

/** @type {import('./$types').RequestHandler} */
export async function POST({ cookies, request, params }) {

  const token = await getAccessToken(cookies);
  if (!token) return error(401, 'Unauthorized');

  const data = await request.json();

  if (!data.userId) {
    return error(400, 'Bad Request');
  }

  const createResponse = await assignRole({
    role: data.role,
    metadataid: params.metadataid,
    token
  });

  return json(createResponse);
}
