import { json } from '@sveltejs/kit';
import { getAccessToken } from '$lib/auth/cookies.js';
import { getTeam } from '$lib/api/metadata.js';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function GET({ cookies, params }) {

  const token = await getAccessToken(cookies);
  if (!token) return error(401, 'Unauthorized');

  const team = await getTeam({ token, metadataid: params.metadataid});

  return json(team);
}
