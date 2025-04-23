import { error, json } from '@sveltejs/kit';
import { getAccessToken } from '$lib/auth/cookies.js';
import { env } from '$env/dynamic/private';
import type { Lineage } from '$lib/models/metadata.js';

/** @type {import('./$types').RequestHandler} */
export async function GET({ cookies, url }) {
  const token = await getAccessToken(cookies);
  if (!token) return error(401, 'Unauthorized');

  const params = url?.searchParams;
  const searchTerm = params.get('searchTerm');
  const property = params.get('property') || 'title';
  const unique = Boolean(params.get('unique'));

  if (!searchTerm) {
    return error(400, 'Bad Request');
  }

  const requestUrl: URL = new URL(`${env.BACKEND_URL}/metadata/searchLineage`);
  requestUrl.searchParams.append('searchTerm', searchTerm);
  requestUrl.searchParams.append('property', property);

  const result = await fetch(requestUrl, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const lineages: Lineage[] = await result.json();

  if (!result.ok) {
    return error(result.status, result.statusText);
  }

  // sort by title with locale compare
  lineages.sort((a, b) => a.title.localeCompare(b.title));

  if (!unique) {
    return json(lineages);
  }

  // make sure that lineages are unique by "title"
  const uniqueLineages = lineages.reduce<Lineage[]>((acc, lineage) => {
    const existing = acc.find((l) => l.title === lineage.title);
    if (!existing && lineage.title.length > 0) {
      acc.push(lineage);
    }
    return acc;
  }, []);

  return json(uniqueLineages);
}
