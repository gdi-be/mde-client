import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url, request, cookies }) => {
  const acceptedLanguage = request.headers.get('accept-language')?.split(',')[0].trim();
  const chosenLocale = cookies.get('locale');

  return {
    acceptedLanguage,
    chosenLocale,
    path: url.pathname,
    token: locals.token,
    tokenUnparsed: locals.tokenUnparsed,
    refreshToken: locals.refreshToken
  };
};
