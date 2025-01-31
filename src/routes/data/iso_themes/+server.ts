import { error, json } from '@sveltejs/kit';
import { getAccessToken } from '$lib/auth/cookies.js';
import { parse } from 'yaml';

/** @type {import('./$types').RequestHandler} */
export async function GET({ cookies }) {
  const token = await getAccessToken(cookies);
  if (!token) return error(401, 'Unauthorized');

  const file = Bun.file('/data/codelists/iso_themes.yaml');
  const themes = await file.text();
  const parsed = parse(themes);

  return json(parsed);
}
