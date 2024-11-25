import { error } from '@sveltejs/kit';
import { getAccessToken } from '../../lib/auth/cookies.js';
import { getAll } from '../../lib/api/metadata.js';

export async function load({ cookies }) {

  const token = await getAccessToken(cookies);
  if (!token) return error(401, 'Unauthorized');

  const metadata = await getAll(token);
  if (metadata) return { metadata };

  error(404, 'Not found');
}
