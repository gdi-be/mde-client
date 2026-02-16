import { error, json } from '@sveltejs/kit';
import { getAccessToken } from '$lib/auth/cookies.js';
import { parse } from 'yaml';
import { logger } from 'loggisch';

/** @type {import('./$types').RequestHandler} */
export async function GET({ cookies }) {
  const token = await getAccessToken(cookies);
  if (!token) return error(401, 'Unauthorized');

  try {
    const terms_of_use = Bun.file('/data/codelists/terms_of_use_on_privacy.yaml');
    const terms = await terms_of_use.text();
    const parsed = parse(terms);
    return json(parsed);
  } catch (e) {
    logger.error('Error reading Terms of Use on Privacy YAML file:', e);
    return error(404, 'Terms of Use on Privacy data not found');
  }
}
