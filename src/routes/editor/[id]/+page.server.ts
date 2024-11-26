import { error } from '@sveltejs/kit';
import { getById } from '../../../lib/api/metadata.js';
import { getAccessToken } from '../../../lib/auth/cookies.js';
import { getFormConfig } from '../../../lib/api/config.js';

export async function load({ params, cookies }) {

  const token = await getAccessToken(cookies);
  if (!token) return error(401, 'Unauthorized');

  const config = await getFormConfig();
  if (!config) return error(500, 'Failed to fetch form config');

  if (params.id === 'new') {
    return {
      mode: 'create',
      config
    }
  }

  const metadata = await getById(Number(params.id), token);
  if (!metadata) return error(404, `Metadata with ID ${params.id} could not be found`);

  return {
    mode: 'edit',
    metadata,
    config
  }
}
