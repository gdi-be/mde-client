import { error } from '@sveltejs/kit';
import { getAccessToken } from '$lib/auth/cookies.js';

const file = Bun.file('/data/variables.json');
const variables = await file.json();

/** @type {import('./$types').RequestHandler} */
export async function POST({ cookies, request }) {
  const token = await getAccessToken(cookies);
  if (!token) return error(401, 'Unauthorized');

  let { value } = await request.json();

  Object.keys(variables).forEach((key) => {
    value = value.replace(key, variables[key]);
  });

  return new Response(value, { status: 200});
}
