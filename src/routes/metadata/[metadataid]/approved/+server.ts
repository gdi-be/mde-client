import { error } from '@sveltejs/kit';
import { getAccessToken } from '$lib/auth/cookies.js';
import { env } from '$env/dynamic/private';

/** @type {import('./$types').RequestHandler} */
export async function POST({ cookies, params }) {
  const token = await getAccessToken(cookies);
  if (!token) return error(401, 'Unauthorized');

  if (!params.metadataid) return error(404, 'Not Found');

  const response = await fetch(`${env.BACKEND_URL}/metadata/${params.metadataid}/approved`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    return error(response.status, response.statusText);
  }

  return new Response(null, { status: 204 });
}

export async function DELETE({ cookies, params }) {
  const token = await getAccessToken(cookies);
  if (!token) return error(401, 'Unauthorized');

  if (!params.metadataid) return error(404, 'Not Found');

  const response = await fetch(`${env.BACKEND_URL}/metadata/${params.metadataid}/approved`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    return error(response.status, response.statusText);
  }

  return new Response(null, { status: 204 });
}
