import { error, text, isHttpError } from '@sveltejs/kit';
import { getAccessToken } from '$lib/auth/cookies.js';
import { publish } from '$lib/api/metadata.js';

/** @type {import('./$types').RequestHandler} */
export async function POST({ cookies, params }) {
  const token = await getAccessToken(cookies);
  if (!token) return error(401, 'Unauthorized');

  try {
    const publishResponse = await publish({
      metadataid: params.metadataid,
      token
    });

    if (!publishResponse.ok) {
      return error(publishResponse.status, 'Error while publishing metadata');
    }

    return text(await publishResponse.text());
  } catch (e) {
    console.error('Error while publishing metadata: ', e);

    if (isHttpError(e)) {
      return error(e.status, e.body);
    }

    return error(500, 'Unexpected error while publishing metadata');
  }
}
