import { env } from "$env/dynamic/private";
import log from "loggisch";
import type { IsoMetadata, MetadataCollection, MetadataType } from "../models/metadata";
import type { PageableProps, PageableResponse } from "./api";

const defaultPage: PageableProps = {
  page: 0,
  size: 10
};

/**
 * Fetches all iso metadata from the backend.
 *
 * @param {string} [token] - Optional authorization token for the request.
 * @returns {Promise<PageAbleResponse<Metadata>>} - A promise that resolves to the fetched metadata.
 */
export const getAll = async (token: string, pagingOpts = defaultPage): Promise<PageableResponse<IsoMetadata>> => {
  if (!token) {
    log.error("No token provided.");
    return Promise.reject(new Error("No token provided."));
  }

  const headers = new Headers({
    Authorization: `Bearer ${token}`
  });

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

  if (!response.ok) {
    throw new Error(`HTTP error status: ${response.status}`);
  }

  return await response.json();
}

/**
 * Fetches metadata by metadataId from the backend.
 *
 * @param metadataId - The metadataId to fetch.
 * @param token - Optional authorization token for the request.
 * @returns A promise that resolves to the fetched metadata.
 */
export const getMetadataCollectionByMetadataId = async (metadataId: string, token: string): Promise<MetadataCollection> => {
  if (!token) {
    log.error("No token provided.");
    return Promise.reject(new Error("No token provided."));
  }

  const headers = new Headers({
    Authorization: `Bearer ${token}`
  });

  const response = await fetch(`${env.BACKEND_URL}/metadata/collection/${metadataId}`, {
    headers
  });

  if (!response.ok) {
    throw new Error(`HTTP error status: ${response.status}`);
  }

  return await response.json();
}

export type UpdateProps = {
  metadataId: string;
  metadataType: MetadataType;
  key: string;
  value: unknown;
  token: string;
}

export const updateDataValue = async ({
  metadataId,
  metadataType,
  key,
  value,
  token
}: UpdateProps): Promise<unknown> => {

  if (!token) {
    log.error("No token provided.");
    return Promise.reject(new Error("No token provided."));
  }

  const headers = new Headers({
    'content-type': 'application/json',
    Authorization: `Bearer ${token}`
  });

  const response = await fetch(`${env.BACKEND_URL}/metadata/collection/${metadataId}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({
      type: metadataType,
      key,
      value
    })
  });

  if (!response.ok) {
    throw new Error(`HTTP error status: ${response.status}`);
  }

  return await response.json();


}
