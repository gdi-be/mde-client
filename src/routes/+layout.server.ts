import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url, cookies }) => {

  return {
    path: url.pathname,
    token: locals.token
  };
};
