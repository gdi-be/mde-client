import { error, json } from '@sveltejs/kit';
import { getAccessToken } from '$lib/auth/cookies.js';
import { parse } from 'yaml';
import { logger } from 'loggisch';

/** @type {import('./$types').RequestHandler} */
export async function GET({ cookies }) {
  const token = await getAccessToken(cookies);
  if (!token) return error(401, 'Unauthorized');

  try {
    const file = Bun.file('/data/codelists/privacy.yaml');
    const themes = await file.text();
    const parsed = parse(themes);
    return json(parsed);
  } catch (e) {
    logger.error('Error reading Privacy YAML file:', e);
    return error(404, 'Privacy data not found');
  }
}
