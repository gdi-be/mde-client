import { error, json } from '@sveltejs/kit';
import { getAccessToken, parseToken } from '$lib/auth/cookies.js';
import { assignRole, assignUser, unassignUser } from '$lib/api/metadata.js';
import { getHighestRole } from '$lib/util.js';

/** @type {import('./$types').RequestHandler} */
export async function POST({ cookies, request, params }) {
  const token = await getAccessToken(cookies);
  if (!token) return error(401, 'Unauthorized');

  const { userId } = await request.json();

  if (!userId) {
    return error(400, 'Bad Request');
  }

  await assignUser({
    userId: userId,
    metadataid: params.metadataid,
    token
  });

  await assignRole({
    role: getHighestRole(parseToken(token)),
    metadataid: params.metadataid,
    token
  });

  return new Response(null, { status: 204});
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
