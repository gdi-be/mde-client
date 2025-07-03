import { error, json } from '@sveltejs/kit';
import { getAccessToken } from '$lib/auth/cookies.js';
import { parse } from 'yaml';

/** @type {import('./$types').RequestHandler} */
export async function GET({ cookies }) {
  const token = await getAccessToken(cookies);
  if (!token) return error(401, 'Unauthorized');
  const terms_of_use = Bun.file('/data/codelists/terms_of_use_privacy.yaml');

  const terms = await terms_of_use.text();
  const parsed = parse(terms);

  return json(parsed);
}
