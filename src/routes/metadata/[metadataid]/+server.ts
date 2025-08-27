import { error, json } from '@sveltejs/kit';
import { getAccessToken } from '$lib/auth/cookies.js';
import { deleteMetadataCollection, updateDataValue } from '$lib/api/metadata.js';
import { getMetadataCollectionByMetadataId } from '$lib/api/metadata.js';
import { ConflictError } from '$lib/error/error';

/** @type {import('./$types').RequestHandler} */
export async function GET({ cookies, params }) {
  const token = await getAccessToken(cookies);
  if (!token) return error(401, 'Unauthorized');
  if (!params.metadataid) return error(404, 'Not Found');

  const metadata = await getMetadataCollectionByMetadataId(params.metadataid, token);
  if (!metadata) return error(404, `Metadata with ID ${params.metadataid} could not be found`);

  return json(metadata);
}

/** @type {import('./$types').RequestHandler} */
export async function PATCH({ cookies, request, params }) {
  const token = await getAccessToken(cookies);
  if (!token) return error(401, 'Unauthorized');
  if (!params.metadataid) return error(404, 'Not Found');

  const data = await request.json();

  if (!data.key || data.value === undefined) {
    return error(400, 'Bad Request');
  }
  try {
    const updateResponse = await updateDataValue({
      metadataId: params.metadataid,
      key: data.key,
      value: data.value,
      token
    });
    return json(updateResponse);
  } catch (e) {
    if (e instanceof ConflictError) {
      return error(409, e.message);
    }
    return error(500, 'Internal Server Error');
  }

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
