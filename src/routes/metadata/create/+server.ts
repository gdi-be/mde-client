import { error, json } from '@sveltejs/kit';
import { getAccessToken } from '$lib/auth/cookies.js';
import { createMetadataCollection } from '$lib/api/metadata.js';

/** @type {import('./$types').RequestHandler} */
export async function POST({ cookies, request }) {

  const token = await getAccessToken(cookies);
  if (!token) return error(401, 'Unauthorized');

  const data = await request.json();

  if (!data.title || !data.metadataProfile) {
    return error(400, 'Bad Request');
  }

  const updateResponse = await createMetadataCollection({
    title: data.title,
    metadataProfile: data.metadataProfile,
    cloneMetadataId: data.cloneMetadataId,
    token
  })

  return json(updateResponse);
}