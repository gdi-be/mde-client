import { env } from '$env/dynamic/public';
import Keycloak from 'keycloak-js';

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

export async function initKeycloak() {
  const authenticated = await keycloak.init({
    checkLoginIframe: false,
    onLoad: 'check-sso',
  });
  return { authenticated, token: keycloak.token, keycloak };
}

export default keycloak;
