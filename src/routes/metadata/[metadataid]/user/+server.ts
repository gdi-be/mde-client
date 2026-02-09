import { error, json } from '@sveltejs/kit';
import { getAccessToken } from '$lib/auth/cookies.js';
import { assignUser, unassignUser } from '$lib/api/metadata.js';
import { ConflictError } from '$lib/error/error';
import { logger } from 'loggisch';

/** @type {import('./$types').RequestHandler} */
export async function POST({ cookies, request, params }) {
  const token = await getAccessToken(cookies);
  if (!token) return error(401, 'Unauthorized');

  let userId;
  try {
    ({ userId } = await request.json());
  } catch (e) {
    logger.error('Failed to parse user assignment request JSON:', e);
    return error(400, 'Invalid JSON in request body');
  }

  if (!userId) {
    return error(400, 'Bad Request');
  }

  try {
    await assignUser({
      userId: userId,
      metadataid: params.metadataid,
      token
    });
  } catch (e) {
    if (e instanceof ConflictError) {
      return error(409, 'Metadata already assigned to another user.');
    }
    return error(500, 'Internal Server Error');
  }

  return new Response(null, { status: 204 });
}

export async function DELETE({ cookies, request, params }) {
  const token = await getAccessToken(cookies);
  if (!token) return error(401, 'Unauthorized');

  let userId;
  try {
    ({ userId } = await request.json());
  } catch (e) {
    logger.error('Failed to parse user unassignment request JSON:', e);
    return error(400, 'Invalid JSON in request body');
  }

  if (!userId) {
    return error(400, 'Bad Request');
  }

  const deleteResponse = await unassignUser({
    metadataid: params.metadataid,
    token,
    userId
  });

  return json(deleteResponse);
}
