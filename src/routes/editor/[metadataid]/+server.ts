import { error, json } from '@sveltejs/kit';
import { getAccessToken } from '$lib/auth/cookies.js';
import { updateDataValue } from '$lib/api/metadata.js';

/** @type {import('./$types').RequestHandler} */
export async function PATCH({ cookies, request, params }) {

  const token = await getAccessToken(cookies);
  if (!token) return error(401, 'Unauthorized');
  if (!params.metadataid) return error(404, 'Not Found');

  const data = await request.json();

  if (!data.key || !data.value || !data.metadataType) {
    return error(400, 'Bad Request');
  }

  const updateResponse = await updateDataValue({
    metadataId: params.metadataid,
    key: data.key,
    value: data.value,
    metadataType: data.metadataType,
    token
  })

  return json(updateResponse);
}
