import { error } from '@sveltejs/kit';
import { getAccessToken } from '$lib/auth/cookies.js';
import { env } from '$env/dynamic/private';
import { logger } from 'loggisch';

/** @type {import('./$types').RequestHandler} */
export async function PATCH({ cookies, request, params }) {
  const token = await getAccessToken(cookies);
  if (!token) return error(401, 'Unauthorized');

  const metadataId = params.metadataid;
  const serviceIdentification = params.serviceIdentification;

  if (!metadataId) return error(404, 'Not Found');
  if (!serviceIdentification) return error(404, 'Not Found');

  let data;
  try {
    data = await request.json();
  } catch (e) {
    logger.error('Failed to parse updateLayers request JSON:', e);
    return error(400, 'Invalid JSON in request body');
  }

  if (!data.layers) {
    return error(400, 'Bad Request');
  }

  try {
    const response = await fetch(
      `${env.BACKEND_URL}/metadata/${metadataId}/updateLayers/${serviceIdentification}`,
      {
        method: 'PATCH',
        headers: new Headers({
          'content-type': 'application/json',
          Authorization: `Bearer ${token}`
        }),
        body: JSON.stringify(data.layers)
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error status: ${response.status}`);
    }

    return new Response('Updated', { status: 200 });
  } catch (e) {
    if (e instanceof Error) {
      console.error('Error updating layers:', e.message);
      return error(500, e.message);
    } else {
      return error(500, 'Internal Server Error');
    }
  }
}
