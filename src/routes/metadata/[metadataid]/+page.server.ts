import { error } from '@sveltejs/kit';
import { getMetadataCollectionByMetadataId } from '$lib/api/metadata.js';
import { getAccessToken, parseToken } from '$lib/auth/cookies.js';
import { getHighestRole } from '$lib/util';
import { redirect } from '@sveltejs/kit';

export async function load({ params, cookies, url }) {
  const token = await getAccessToken(cookies);
  if (!token) return redirect(302, '/login');

  const parsedToken = parseToken(token);
  const readOnly = getHighestRole(parsedToken) === 'QualityAssurance';

  if (readOnly) {
    return redirect(302, url + '/readonly');
  }

  const metadata = await getMetadataCollectionByMetadataId(params.metadataid, token);
  if (!metadata) return error(404, `Metadata with ID ${params.metadataid} could not be found`);

  return {
    metadata
  };
}
