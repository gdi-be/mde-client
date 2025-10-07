import { error } from '@sveltejs/kit';
import { getMetadataCollectionByMetadataId } from '$lib/api/metadata.js';
import { getAccessToken } from '$lib/auth/cookies.js';
import { redirect } from '@sveltejs/kit';
import type { YamlFieldConfig } from '$lib/components/Form/FieldsConfig';
import { parse } from 'yaml';

export async function load({ params, cookies }) {
  const token = await getAccessToken(cookies);
  if (!token) return redirect(302, '/login');

  const metadata = await getMetadataCollectionByMetadataId(params.metadataid, token);
  if (!metadata) return error(404, `Metadata with ID ${params.metadataid} could not be found`);

  try {
    const file = Bun.file('/data/codelists/field_labels.yaml');
    const fileContent = await file.text();
    const fieldLabels = parse(fileContent) as YamlFieldConfig[];
    return {
      metadata,
      fieldLabels
    };
  } catch (e) {
    error(500, `Error loading field labels: ${e}`);
  }
}
