import { env } from "$env/dynamic/private";
import log from "loggisch";
import type { Metadata } from "../models/metadata";

const defaultPage: PageAbleProps = {
  page: 0,
  size: 10
};

/**
 * Fetches all metadata from the backend.
 *
 * @param {string} [token] - Optional authorization token for the request.
 * @returns {Promise<PageAbleResponse<Metadata>>} - A promise that resolves to the fetched metadata.
 */
export const getAll = async <T extends Metadata>(token: string, pagingOpts = defaultPage): Promise<PageAbleResponse<T>> => {
  if (!token) {
    log.error("No token provided.");
    return Promise.reject(new Error("No token provided."));
  }

  const headers = new Headers({
    Authorization: `Bearer ${token}`
  });

  // TODO: Endpoint depends on metadata type
  const url: URL = new URL(`${env.BACKEND_URL}/metadata/iso`);

  if (pagingOpts) {
    url.searchParams.append('page', pagingOpts.page.toString());
    url.searchParams.append('size', pagingOpts.size.toString());
    if (pagingOpts.sort) {
      pagingOpts.sort.forEach((sort) => {
        url.searchParams.append('sort', `${sort.field},${sort.direction}`);
      });
    }
  }

  const response = await fetch(url, {
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
export const getById = async <T extends Metadata>(id: number, token: string): Promise<T> => {
  if (!token) {
    log.error("No token provided.");
    return Promise.reject(new Error("No token provided."));
  }

  const headers = new Headers({
    Authorization: `Bearer ${token}`
  });
  // TODO: Endpoint depends on metadata type
  const response = await fetch(`${env.BACKEND_URL}/metadata/iso/${id}`, {
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
export const getByMetadataId = async <T extends Metadata>(id: string, token: string): Promise<T> => {
  if (!token) {
    log.error("No token provided.");
    return Promise.reject(new Error("No token provided."));
  }

  const headers = new Headers({
    Authorization: `Bearer ${token}`
  });

  // TODO: Endpoint depends on metadata type
  const response = await fetch(`${env.BACKEND_URL}/metadata/iso/m/${id}`, {
    headers
  });

  return await response.json();
}
