import { env } from '$env/dynamic/public';
import Keycloak from 'keycloak-js';

if (!env.PUBLIC_KEYCLOAK_URL || !env.PUBLIC_KEYCLOAK_REALM || !env.PUBLIC_KEYCLOAK_ID) {
  throw new Error('Missing Keycloak configuration in environment variables');
}

const keycloak = new Keycloak({
  url: env.PUBLIC_KEYCLOAK_URL,
  realm: env.PUBLIC_KEYCLOAK_REALM,
  clientId: env.PUBLIC_KEYCLOAK_ID
});

keycloak.onTokenExpired = async () => {
  try {
    await keycloak.updateToken(0);
  } catch (error) {
    console.error('Failed to refresh token:', error);
  }
};

export const initKeycloak = async () => {
  const authenticated = await keycloak.init({
    checkLoginIframe: false,
    onLoad: 'check-sso',
  });
  return { authenticated, token: keycloak.token, keycloak };
}

export default keycloak;
