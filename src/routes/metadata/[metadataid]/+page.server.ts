import { error } from '@sveltejs/kit';
import { getMetadataCollectionByMetadataId } from '$lib/api/metadata.js';
import { getAccessToken } from '$lib/auth/cookies.js';
import { getFormHelp } from '$lib/api/help.js';

export async function load({ params, cookies }) {

  const token = await getAccessToken(cookies);
  if (!token) return error(401, 'Unauthorized');

  const help = await getFormHelp();
  if (!help) return error(500, 'Failed to fetch form config');

  const metadata = await getMetadataCollectionByMetadataId(params.metadataid, token);
  if (!metadata) return error(404, `Metadata with ID ${params.metadataid} could not be found`);

  return {
    metadata,
    help
  }
}
