import { error, json } from '@sveltejs/kit';
import { getAccessToken } from '$lib/auth/cookies.js';
import { addComment, deleteComment } from '$lib/api/metadata.js';

/** @type {import('./$types').RequestHandler} */
export async function POST({ cookies, request, params }) {
  const token = await getAccessToken(cookies);
  if (!token) return error(401, 'Unauthorized');

  const data = await request.json();

  if (!data.text) {
    return error(400, 'Bad Request');
  }

  const createResponse = await addComment({
    text: data.text,
    metadataid: params.metadataid,
    token
  });

  return json(createResponse);
}

/** @type {import('./$types').RequestHandler} */
export async function DELETE({ cookies, request, params }) {
  const token = await getAccessToken(cookies);
  if (!token) return error(401, 'Unauthorized');

  const data = await request.json();

  if (!data.id) {
    return error(400, 'Bad Request');
  }

  const createResponse = await deleteComment({
    commentId: data.id,
    metadataid: params.metadataid,
    token
  });

  return json(createResponse);
}
