import { env } from "$env/dynamic/private";
import log from "loggisch";
import type { Metadata } from "../models/metadata";

/**
 * Fetches all metadata from the backend.
 *
 * @param {string} [token] - Optional authorization token for the request.
 * @returns {Promise<Metadata[]>} - A promise that resolves to an array of metadata objects.
 */
export const getAll = async (token: string): Promise<Metadata[]> => {
  if (!token) {
    log.error("No token provided.");
    return Promise.reject(new Error("No token provided."));
  }

  const headers = new Headers({
    Authorization: `Bearer ${token}`
  });
  const response = await fetch(`${env.BACKEND_URL}/metadata`, {
    headers
  });

  return await response.json();
}

/**
 * Fetches metadata by ID from the backend.
 *
 * @param id - The ID of the metadata to fetch.
 * @param token - Optional authorization token for the request.
 * @returns A promise that resolves to the fetched metadata.
 */
export const getById = async (id: number, token: string): Promise<Metadata> => {
  if (!token) {
    log.error("No token provided.");
    return Promise.reject(new Error("No token provided."));
  }

  const headers = new Headers({
    Authorization: `Bearer ${token}`
  });
  const response = await fetch(`${env.BACKEND_URL}/metadata/${id}`, {
    headers
  });

  return await response.json();;
}
