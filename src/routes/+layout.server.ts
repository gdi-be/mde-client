import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {
  return {
    path: url.pathname,
    token: locals.token,
    tokenUnparsed: locals.tokenUnparsed
  };
};
