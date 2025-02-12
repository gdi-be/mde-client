import { error, redirect } from '@sveltejs/kit';
import { getAccessToken } from '$lib/auth/cookies';
import { getAll } from '$lib/api/metadata';
import type { PageableProps } from '$lib/models/api';

export async function load({ cookies, url }) {
  const page = url.searchParams.get('page');
  const size = url.searchParams.get('size');
  const sort = url.searchParams.get('sort');

  const token = await getAccessToken(cookies);
  if (!token) return redirect(302, '/login');

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
