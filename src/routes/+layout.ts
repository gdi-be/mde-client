import { initKeycloak } from '../lib/auth/keycloak';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async () => {
  try {
    await initKeycloak();
  } catch (err) {
    console.error('Keycloak Initialization Error:', err);
  }
};
