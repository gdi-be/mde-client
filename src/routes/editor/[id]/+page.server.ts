import { error } from '@sveltejs/kit';
import { getById } from '../../../lib/api/metadata.js';
import { getAccessToken } from '../../../lib/auth/cookies.js';

export async function load({ params, cookies }) {

  const id = Number(params.id);
  if (isNaN(id)) return error(400, 'Invalid ID');

  const token = await getAccessToken(cookies);
  if (!token) return error(401, 'Unauthorized');

  const metadata = await getById(id, token);
  if (metadata) return { metadata };

  error(404, 'Not found');
}
