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
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export {};
