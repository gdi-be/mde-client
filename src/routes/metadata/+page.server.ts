import { error } from '@sveltejs/kit';
import { getAccessToken } from '$lib/auth/cookies.js';
import { getAll } from '$lib/api/metadata.js';
import type { PageableProps } from '$lib/api/api.js';

export async function load({ cookies, url }) {
  const page = url.searchParams.get('page');
  const size = url.searchParams.get('size');
  const sort = url.searchParams.get('sort');

  const token = await getAccessToken(cookies);
  if (!token) return error(401, 'Unauthorized');

  let pagingOptions: PageableProps | undefined;
  if (page && size) {
    pagingOptions = {
      page: Number(page) - 1,
      size: Math.min(Number(size), 100),
      sort: sort ? [{ field: sort.split(',')[0], direction: sort.split(',')[1] }] : undefined
    };
  }

  const metadata = await getAll(token, pagingOptions);
  if (metadata) return { metadata, pagingOptions };

  error(404, 'Not found');
}