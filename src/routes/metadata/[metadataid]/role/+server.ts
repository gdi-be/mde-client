import { error, json } from '@sveltejs/kit';
import { getAccessToken } from '$lib/auth/cookies.js';
import { assignRole } from '$lib/api/metadata.js';
import { logger } from 'loggisch';

/** @type {import('./$types').RequestHandler} */
export async function POST({ cookies, request, params }) {
  const token = await getAccessToken(cookies);
  if (!token) return error(401, 'Unauthorized');

  let data;
  try {
    data = await request.json();
  } catch (e) {
    logger.error('Failed to parse role request JSON:', e);
    return error(400, 'Invalid JSON in request body');
  }

  if (!data.role) {
    return error(400, 'Bad Request');
  }

  const createResponse = await assignRole({
    role: data.role,
    metadataid: params.metadataid,
    token
  });

  return json(createResponse);
}
