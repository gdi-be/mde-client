import { BACKEND_URL } from "$env/static/private";
import type { Metadata } from "../models/metadata";

/**
 * Fetches all metadata from the backend.
 *
 * @param {string} [token] - Optional authorization token for the request.
 * @returns {Promise<Metadata[]>} - A promise that resolves to an array of metadata objects.
 */
export const getAll = async (token?: string): Promise<Metadata[]> => {
  const headers = new Headers();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(`${BACKEND_URL}/metadata`);

  return await response.json();
}

/**
 * Fetches metadata by ID from the backend.
 *
 * @param id - The ID of the metadata to fetch.
 * @param token - Optional authorization token for the request.
 * @returns A promise that resolves to the fetched metadata.
 */
export const getById = async (id: number, token?: string): Promise<Metadata> => {
  const headers = new Headers();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(`${BACKEND_URL}/metadata/${id}`, {
    headers
  });

  return await response.json();;
}
