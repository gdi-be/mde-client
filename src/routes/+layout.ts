import { getSupportedLocale } from '$lib/i18n/locales';
import { getTranslator } from '$lib/i18n';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({
  data: { acceptedLanguage, chosenLocale, ...data },
  url: { searchParams },
  fetch
}) => {
  const urlLocale = searchParams.get('lang');
  const locale = getSupportedLocale(urlLocale || chosenLocale || acceptedLanguage);
  const t = await getTranslator({ locale, eventFetch: fetch });
  return {
    locale,
    t,
    ...data
  };
};
