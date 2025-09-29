import fallBackTranslations from './locales/de.json';
import type { LocaleCode } from './locales';
import { interpolate } from './interpolate';
import { dev } from '$app/environment';
import type { TranslationKeys } from './types';

const loadedTranslations: Record<string, any> = {};

export async function getTranslator({
  locale,
  eventFetch
}: {
  locale: LocaleCode;
  eventFetch: typeof fetch;
}): Promise<(key: TranslationKeys, values?: Record<string, string | number>) => string> {
  if (!loadedTranslations[locale]) {
    const localeResponse = await eventFetch('/data/i18n/' + locale);
    const data = await localeResponse.json();
    if (!data) throw new Error('Could not load locale ' + locale);
    loadedTranslations[locale] = data;
  }

  return (key: TranslationKeys, values?: Record<string, string | number>): string => {
    if (!key.includes('.'))
      throw new Error('Incorrect i18n key. Must be nested 1 level (contain 1 period).');

    const [section, item] = key.split('.') as [string, string];
    const localeResult = loadedTranslations[locale][section]?.[item];
    if (localeResult) return interpolate(localeResult, values);
    console.warn(`Missing ${locale} translation for ${key}. Falling back to default.`);

    // @ts-expect-error - we already typecheck the key argument and types don't
    // know how to properly distinguish the allowed items for a chosen section
    // if we do type the line above properly so we ignore here
    const fallbackResult = fallBackTranslations[section]?.[item];
    if (fallbackResult) return interpolate(fallbackResult, values);

    const error = `Missing default translation for: ${key}`;
    if (dev) throw new Error(error);

    console.error(error);
    return key;
  };
}
