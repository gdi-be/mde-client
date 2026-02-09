import defaultTranslations from './locales/de.json';
import type { LocaleCode } from './locales';
import { interpolate } from './interpolate';
import { dev } from '$app/environment';
import type { TranslationKeys } from './types';
import { logger } from 'loggisch';

type Translations = Record<LocaleCode, typeof defaultTranslations>;
type SectionKey = keyof typeof defaultTranslations;
const loadedTranslations: Translations = {} as Translations;

export async function getTranslator({
  locale,
  eventFetch
}: {
  locale: LocaleCode;
  eventFetch: typeof fetch;
}): Promise<(key: TranslationKeys, values?: Record<string, string | number>) => string> {
  if (!loadedTranslations[locale]) {
    const localeResponse = await eventFetch('/data/i18n/' + locale);
    if (!localeResponse.ok) {
      logger.warning(`Failed to fetch locale: ${localeResponse.status}. Falling back to default.`);
      loadedTranslations[locale] = defaultTranslations;
    } else {
      let data;
      try {
        data = await localeResponse.json();
      } catch (e) {
        logger.error('Failed to parse locale response:', e);
        throw new Error('Invalid response when loading locale ' + locale);
      }
      if (!data) throw new Error('Could not load locale ' + locale);
      loadedTranslations[locale] = data;
    }
  }

  return (key: TranslationKeys, values?: Record<string, string | number>): string => {
    if (!key.includes('.'))
      throw new Error('Incorrect i18n key. Must be nested 1 level (contain 1 period).');

    const [sectionKey, item] = key.split('.') as [SectionKey, string];
    const section = loadedTranslations[locale][sectionKey] as Record<string, string>;
    const localeResult = section?.[item];
    if (localeResult) return interpolate(localeResult, values);

    logger.warning(`Missing ${locale} translation for ${key}. Falling back to default.`);
    const defaultSection = defaultTranslations[sectionKey] as Record<string, string>;
    const defaultResult = defaultSection?.[item];
    if (defaultResult) return interpolate(defaultResult, values);

    const error = `Missing default translation for: ${key}`;
    if (dev) throw new Error(error);

    logger.error(error);
    return key;
  };
}
