import { error, json } from '@sveltejs/kit';
import { getAccessToken } from '$lib/auth/cookies.js';
import { assignUser, unassignUser } from '$lib/api/metadata.js';

/** @type {import('./$types').RequestHandler} */
export async function POST({ cookies, request, params }) {

  const token = await getAccessToken(cookies);
  if (!token) return error(401, 'Unauthorized');

  const { userId } = await request.json();

  if (!userId) {
    return error(400, 'Bad Request');
  }

  const createResponse = await assignUser({
    userId: userId,
    metadataid: params.metadataid,
    token
  });

  return json(createResponse);
}

export async function DELETE({ cookies, request, params }) {
  const token = await getAccessToken(cookies);
  if (!token) return error(401, 'Unauthorized');

  const { userId } = await request.json();

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
