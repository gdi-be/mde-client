// See https://svelte.dev/docs/kit/types#app.d.ts

import type { Token, RefreshToken } from '$lib/models/keycloak';

// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      token?: Token;
      tokenUnparsed?: string;
      refreshToken?: RefreshToken;
    }
    interface PageData {
      locale: import('$lib/i18n/locales').LocaleCode;
      t: Awaited<ReturnType<typeof import('$lib/i18n').getTranslator>>;
    }
    // interface PageState {}
    // interface Platform {}
  }
}

export {};
