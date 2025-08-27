import { error, json } from '@sveltejs/kit';
import { getAccessToken } from '$lib/auth/cookies.js';
import { createMetadataCollection } from '$lib/api/metadata.js';
import { ConflictError } from '$lib/error/error';

/** @type {import('./$types').RequestHandler} */
export async function POST({ cookies, request }) {
  const token = await getAccessToken(cookies);
  if (!token) return error(401, 'Unauthorized');

  const data = await request.json();

  if (!data.title) {
    return error(400, 'Bad Request');
  }

  try {
    const createResponse = await createMetadataCollection({
      ...data,
      token
    });
    return json(createResponse);
  } catch (e) {
    if (e instanceof ConflictError) {
      return error(409, e.message);
    }
    return error(500, 'Internal Server Error');
  }

}
