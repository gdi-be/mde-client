import { error } from '@sveltejs/kit';
import { getMetadataCollectionByMetadataId } from '$lib/api/metadata.js';
import { getAccessToken, parseToken } from '$lib/auth/cookies.js';
import { getHighestRole } from '$lib/util';
import { redirect } from '@sveltejs/kit';
import { parse } from 'yaml';

export async function load({ params, cookies, url }) {
  const token = await getAccessToken(cookies);
  if (!token) return redirect(302, '/login');

  const parsedToken = parseToken(token);
  const readOnly = getHighestRole(parsedToken) === 'MdeQualityAssurance';

  if (readOnly) {
    return redirect(302, url + '/readonly');
  }

  const metadata = await getMetadataCollectionByMetadataId(params.metadataid, token);
  if (!metadata) return error(404, `Metadata with ID ${params.metadataid} could not be found`);

  try {
    const file = Bun.file('/data/codelists/field_labels.yaml');
    const themes = await file.text();
    const fieldLabels = parse(themes);
    return {
      metadata,
      fieldLabels
    };
  } catch (e) {
    error(500, `Error loading field labels: ${e}`);
  }

}
