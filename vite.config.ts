import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import type { ClientRequest, IncomingMessage } from 'http';

const onProxyReq = async (proxyReq: ClientRequest) => {
  const cookie = proxyReq.getHeader('cookie');

  if (!cookie || typeof cookie !== 'string') {
    return;
  }

  const cookies = cookie.split(';').map((c) => c.trim());
  const accessTokenCookie = cookies.find((c) => c.startsWith('access_token='));
  const refreshTokenCookie = cookies.find((c) => c.startsWith('refresh_token='));

  if (!accessTokenCookie && !refreshTokenCookie) {
    console.error('No access token or refresh token found in cookies');
    return;
  }

  if (accessTokenCookie) {
    const accessToken = accessTokenCookie.split('=')[1];

    proxyReq.setHeader('Authorization', `Bearer ${accessToken}`);

    return;
  }

  if (refreshTokenCookie) {
    const refreshToken = refreshTokenCookie?.split('=')[1];

    const url = process.env.AUTH_KEYCLOAK_URL;
    if (!url) {
      return;
    }

    const realm = process.env.AUTH_KEYCLOAK_REALM;
    if (!realm) {
      return;
    }

    const clientId = process.env.AUTH_KEYCLOAK_CLIENT_ID;
    if (!clientId) {
      return;
    }

    const clientSecret = process.env.AUTH_KEYCLOAK_CLIENT_SECRET;
    if (!clientSecret) {
      return;
    }

    const body = new URLSearchParams();
    body.append('grant_type', 'refresh_token');
    body.append('client_id', clientId);
    body.append('client_secret', clientSecret);
    body.append('refresh_token', refreshToken);

    const response = await fetch(`${url}/realms/${realm}/protocol/openid-connect/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: body.toString()
    });

    if (!response.ok) {
      console.error('Could not refresh tokens: ' + response.status);
      return false;
    }

    const data = await response.json();

    proxyReq.setHeader('Authorization', `Bearer ${data.access_token}`);
  }
};

const onProxyRes = (proxyRes: IncomingMessage) => {
  // Remove some headers that would be duplicated otherwise.
  delete proxyRes.headers['date'];
  delete proxyRes.headers['transfer-encoding'];
};

const onProxyError = (error: Error) => {
  console.error('Error while proxying a MDE backend events request: ', error);
};

export default defineConfig({
  plugins: [sveltekit()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    hmr: {
      host: 'localhost'
    },
    proxy: {
      '/events': {
        target: 'http://mde-backend:8080/',
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on('proxyReq', onProxyReq);
          proxy.on('proxyRes', onProxyRes);
          proxy.on('error', onProxyError);
        }
      }
    }
  }
});
