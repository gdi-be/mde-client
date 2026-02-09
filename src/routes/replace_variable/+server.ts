import { error, json } from '@sveltejs/kit';
import { getAccessToken } from '$lib/auth/cookies.js';
import { logger } from 'loggisch';

/** @type {import('./$types').RequestHandler} */
export async function POST({ cookies, request }) {
  const token = await getAccessToken(cookies);
  if (!token) return error(401, 'Unauthorized');

  let value: string;
  try {
    ({ value } = await request.json());
  } catch (e) {
    logger.error('Failed to parse variable replacement request JSON:', e);
    return error(400, 'Invalid JSON in request body');
  }

  let variables: Record<string, string>;
  try {
    const file = Bun.file('/data/variables.json');
    variables = await file.json();
  } catch (e) {
    logger.error('Failed to load variables file:', e);
    return error(500, 'Failed to load variables file');
  }

  try {
    Object.keys(variables).forEach((key) => {
      value = value.replace(key, variables[key]);
    });
  } catch (e) {
    logger.error('Error replacing variables:', e);
    return error(500, 'Error replacing variables');
  }

  return json({ value });
}
