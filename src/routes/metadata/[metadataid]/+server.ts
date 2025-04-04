import { error, json } from '@sveltejs/kit';
import { getAccessToken } from '$lib/auth/cookies.js';
import { deleteMetadataCollection, updateDataValue } from '$lib/api/metadata.js';

/** @type {import('./$types').RequestHandler} */
export async function PATCH({ cookies, request, params }) {
  const token = await getAccessToken(cookies);
  if (!token) return error(401, 'Unauthorized');
  if (!params.metadataid) return error(404, 'Not Found');

  const data = await request.json();

  if (!data.key || data.value === undefined) {
    return error(400, 'Bad Request');
  }

  const updateResponse = await updateDataValue({
    metadataId: params.metadataid,
    key: data.key,
    value: data.value,
    token
  });

  return json(updateResponse);
}

export async function DELETE({ cookies, params }) {
  const token = await getAccessToken(cookies);
  if (!token) return error(401, 'Unauthorized');

  const deleteResponse = await deleteMetadataCollection({
    id: params.metadataid,
    token
  });

  return json(deleteResponse);
}
