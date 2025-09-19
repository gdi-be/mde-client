import type de from './locales/de.json';

export type TranslationKeys = Flatten<TranslationKeysNested>;

type TranslationKeysNested = {
  [K in keyof typeof de]: {
    [L in StringKeyof<(typeof de)[K]>]: `${K}.${L}`;
  };
}[keyof typeof de];

type StringKeyof<T> = Extract<keyof T, string>;
type Flatten<T> = T extends infer U
  ? { [K in keyof U]: U[K] } extends Record<keyof U, infer V>
  ? V
  : never
  : never;
