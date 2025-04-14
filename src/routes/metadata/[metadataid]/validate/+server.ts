import { error, text, isHttpError } from '@sveltejs/kit';
import { getAccessToken } from '$lib/auth/cookies.js';
import { validate } from '$lib/api/metadata.js';

/** @type {import('./$types').RequestHandler} */
export async function GET({ cookies, params }) {
  const token = await getAccessToken(cookies);
  if (!token) return error(401, 'Unauthorized');

  try {
    const validateResponse = await validate({
      metadataid: params.metadataid,
      token
    });

    if (!validateResponse.ok) {
      return error(validateResponse.status, 'Error while starting the validation');
    }

    return text(await validateResponse.text());
  } catch (e) {
    console.error('Error while starting the validation: ', e);

    if (isHttpError(e)) {
      return error(e.status, e.body);
    }

    return error(500, 'Unexpected error while starting the validation');
  }
}
