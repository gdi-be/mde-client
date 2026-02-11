import { error, json } from '@sveltejs/kit';
import { getAccessToken } from '$lib/auth/cookies.js';
import { createMetadataCollection } from '$lib/api/metadata.js';
import { ConflictError } from '$lib/error/error';
import { logger } from 'loggisch';

/** @type {import('./$types').RequestHandler} */
export async function POST({ cookies, request }) {
  const token = await getAccessToken(cookies);
  if (!token) return error(401, 'Unauthorized');

  let data;
  try {
    data = await request.json();

    if (!data.title) {
      return error(400, 'Bad Request');
    }

    const createResponse = await createMetadataCollection({
      ...data,
      token
    });
    return json(createResponse);
  } catch (e) {
    if (e instanceof SyntaxError) {
      logger.error('Failed to parse metadata creation request JSON:', e);
      return error(400, 'Invalid JSON in request body');
    }
    if (e instanceof ConflictError) {
      return error(409, e.message);
    }
    logger.error('Error creating metadata:', e);
    return error(500, 'Internal Server Error');
  }
}
