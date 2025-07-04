import { getContext, setContext } from 'svelte';
import type { RefreshToken, Token } from '$lib/models/keycloak';

export const TOKEN_CONTEXT = Symbol('token');

export type TokenState = {
  accessToken?: Token;
  refreshToken?: RefreshToken;
};

const tokenState = $state<{ state: TokenState }>({ state: {} });

export function initializeTokenContext(accessToken?: Token, refreshToken?: RefreshToken) {
  tokenState.state.accessToken = accessToken;
  tokenState.state.refreshToken = refreshToken;
  setContext(TOKEN_CONTEXT, tokenState);
}

export function getTokenState() {
  return getContext<{ state: TokenState }>(TOKEN_CONTEXT).state;
}

export function getAccessToken() {
  return getTokenState().accessToken;
}

export function getRefreshToken() {
  return getTokenState().refreshToken;
}

export function setAccessToken(token: Token) {
  tokenState.state.accessToken = token;
}

export function setRefreshToken(token: RefreshToken) {
  tokenState.state.refreshToken = token;
}
