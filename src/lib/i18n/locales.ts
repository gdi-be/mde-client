export enum Locales {
  de = 'Deutsch'
}

export type LocaleCode = keyof typeof Locales;

export function getSupportedLocale(userLocale: string | undefined): LocaleCode {
  const locale = Object.keys(Locales).find((supportedLocale) => {
    return userLocale?.includes(supportedLocale);
  }) as LocaleCode | undefined;
  return locale || 'de';
}
