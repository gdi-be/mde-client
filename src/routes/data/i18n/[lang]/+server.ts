import { error, json } from '@sveltejs/kit';
import { getAccessToken } from '$lib/auth/cookies.js';
import { parse } from 'yaml';

/** @type {import('./$types').RequestHandler} */
export async function GET({ cookies, params }) {
  const token = await getAccessToken(cookies);
  if (!token) return error(401, 'Unauthorized');

  const lang = params?.lang;
  if (!lang) return error(404, 'Not Found');
  const file = Bun.file(`/data/codelists/i18n/${lang}.yaml`);
  const themes = await file.text();
  const parsed = parse(themes);

  return json(parsed);
}
