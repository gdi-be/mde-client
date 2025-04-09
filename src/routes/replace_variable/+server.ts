import { error, json } from '@sveltejs/kit';
import { getAccessToken } from '$lib/auth/cookies.js';


/** @type {import('./$types').RequestHandler} */
export async function POST({ cookies, request }) {
  const token = await getAccessToken(cookies);
  if (!token) return error(401, 'Unauthorized');

  let { value } = await request.json();

  const file = Bun.file('/data/variables.json');
  const variables = await file.json();

  Object.keys(variables).forEach((key) => {
    value = value.replace(key, variables[key]);
  });

  return json({ value });
}
