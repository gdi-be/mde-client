import { error } from '@sveltejs/kit';
import { getAccessToken } from '$lib/auth/cookies.js';
import { env } from '$env/dynamic/private';

/** @type {import('./$types').RequestHandler} */
export async function POST({ cookies, params }) {
  const token = await getAccessToken(cookies);
  if (!token) return error(401, 'Unauthorized');

  const metadataId = params.metadataid;
  const fileIdentifier = params.fileIdentifier;

  if (!metadataId) return error(404, 'Not Found');
  if (!fileIdentifier) return error(404, 'Not Found');

  try {
    const response = await fetch(
      `${env.BACKEND_URL}/metadata/${metadataId}/delete/${fileIdentifier}`,
      {
        method: 'POST',
        headers: new Headers({
          'content-type': 'application/json',
          Authorization: `Bearer ${token}`
        })
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
