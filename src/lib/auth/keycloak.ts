import jwt from 'jsonwebtoken';
import {
  AUTH_KEYCLOAK_REALM,
  AUTH_KEYCLOAK_URL,
} from '$env/static/private';

export const verifyToken = async (token: string) => {
  const publicKey = await fetchPublicKey();
  return jwt.verify(token, publicKey, { algorithms: ['RS256'] });
}

export const fetchPublicKey = async() => {
  const certsUrl = `${AUTH_KEYCLOAK_URL}/realms/${AUTH_KEYCLOAK_REALM}/protocol/openid-connect/certs`;

  const response = await fetch(certsUrl);
  if (!response.ok) {
    throw new Error('Failed to fetch Keycloak public keys');
  }

  const { keys } = (await response.json());
  if (!keys || keys.length === 0) {
    throw new Error('No public keys available');
  }

  const { n, e } = keys[0];

  const modulus = Buffer.from(n, 'base64url').toString('base64');
  const exponent = Buffer.from(e, 'base64url').toString('base64');

  const pemKey = `-----BEGIN PUBLIC KEY-----\n${modulus}\n${exponent}\n-----END PUBLIC KEY-----`;
  return pemKey;
}
