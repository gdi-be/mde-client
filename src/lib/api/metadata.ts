import { env } from '$env/dynamic/private';
import log from 'loggisch';
import type {
  MetadataProfile,
  MetadataCollection,
  MetadataId,
  MetadataType
} from '$lib/models/metadata';
import type { PageableProps, PageableResponse } from '$lib/models/api';
import type { Role } from '$lib/models/keycloak';

const defaultPage: PageableProps = {
  page: 0,
  size: 10,
  sort: [
    {
      field: 'title',
      direction: 'asc'
    }
  ]
};

/**
 * Fetches all iso metadata from the backend.
 *
 * @param {string} [token] - Optional authorization token for the request.
 * @returns {Promise<PageAbleResponse<Metadata>>} - A promise that resolves to the fetched metadata.
 */
export const getAll = async (
  token: string,
  pagingOpts = defaultPage
): Promise<PageableResponse<MetadataCollection>> => {
  if (!token) {
    log.error('No token provided.');
    return Promise.reject(new Error('No token provided.'));
  }

  const headers = new Headers({
    Authorization: `Bearer ${token}`
  });

  const url: URL = new URL(`${env.BACKEND_URL}/metadata`);

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
};

/**
 * Fetches metadata by metadataId from the backend.
 *
 * @param metadataId - The metadataId to fetch.
 * @param token - Optional authorization token for the request.
 * @returns A promise that resolves to the fetched metadata.
 */
export const getMetadataCollectionByMetadataId = async (
  metadataId: string,
  token: string
): Promise<MetadataCollection> => {
  if (!token) {
    log.error('No token provided.');
    return Promise.reject(new Error('No token provided.'));
  }

  const headers = new Headers({
    Authorization: `Bearer ${token}`
  });

  const response = await fetch(`${env.BACKEND_URL}/metadata/${metadataId}`, {
    headers
  });

  if (!response.ok) {
    throw new Error(`HTTP error status: ${response.status}`);
  }

  return await response.json();
};

export const searchForMetadata = async (
  token: string,
  searchTerm: string,
  pagingOpts = defaultPage
): Promise<MetadataCollection[]> => {
  if (!token) {
    log.error('No token provided.');
    return Promise.reject(new Error('No token provided.'));
  }

  const url: URL = new URL(`${env.BACKEND_URL}/metadata/search`);
  url.searchParams.append('searchTerm', searchTerm);

  if (pagingOpts) {
    const offset = pagingOpts.page * pagingOpts.size;
    const limit = pagingOpts.size;
    url.searchParams.append('offset', offset.toString());
    url.searchParams.append('limit', limit.toString());
  }

  const response = await fetch(url, {
    headers: new Headers({
      Authorization: `Bearer ${token}`,
      accept: 'application/json'
    })
  });

  if (!response.ok) {
    throw new Error(`HTTP error status: ${response.status}`);
  }

  const data = await response.json();

  return data;
};

export type UpdateProps = {
  metadataId: string;
  key: string;
  value: unknown;
  token: string;
};

/**
 * This function updates a metadata value by sending a PATCH request to the backend.
 *
 * To delete a value from the metadata, set the value to `null`.
 *
 * @param metadataId
 * @param key
 * @param value
 * @param token
 *
 * @returns
 */
export const updateDataValue = async ({
  metadataId,
  key,
  value,
  token
}: UpdateProps): Promise<unknown> => {
  if (!token) {
    log.error('No token provided.');
    return Promise.reject(new Error('No token provided.'));
  }

  const headers = new Headers({
    'content-type': 'application/json',
    Authorization: `Bearer ${token}`
  });

  const metadataTypeMap = new Map<string, MetadataType>([
    ['clientMetadata', 'CLIENT'],
    ['isoMetadata', 'ISO'],
    ['technicalMetadata', 'TECHNICAL']
  ]);
  const [type, restKey] = key.split('.');
  const metadataType = metadataTypeMap.get(type);

  const response = await fetch(`${env.BACKEND_URL}/metadata/${metadataId}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({
      type: metadataType,
      key: restKey,
      value
    })
  });

  if (!response.ok) {
    throw new Error(`HTTP error status: ${response.status}`);
  }

  return await response.json();
};

export type CreateProps = {
  token: string;
  title: string;
  metadataProfile: MetadataProfile;
  cloneMetadataId?: MetadataId;
};

export const createMetadataCollection = async ({
  token,
  title,
  cloneMetadataId
}: CreateProps): Promise<MetadataCollection> => {
  if (!token) {
    log.error('No token provided.');
    return Promise.reject(new Error('No token provided.'));
  }

  const headers = new Headers({
    Authorization: `Bearer ${token}`,
    'content-type': 'application/json'
  });

  const response = await fetch(`${env.BACKEND_URL}/metadata/`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      title,
      cloneMetadataId
    })
  });

  if (!response.ok) {
    throw new Error(`HTTP error status: ${response.status}`);
  }

  return await response.json();
};

export type AddCommentProps = {
  token: string;
  metadataid: string;
  text: string;
};

export const addComment = async ({
  token,
  metadataid,
  text
}: AddCommentProps): Promise<MetadataCollection> => {
  if (!token) {
    log.error('No token provided.');
    return Promise.reject(new Error('No token provided.'));
  }

  const headers = new Headers({
    Authorization: `Bearer ${token}`
  });

  const response = await fetch(`${env.BACKEND_URL}/metadata/${metadataid}/comment`, {
    method: 'POST',
    headers,
    body: text
  });

  if (!response.ok) {
    throw new Error(`HTTP error status: ${response.status}`);
  }

  return await response.json();
};

export type DeleteCommentProps = {
  token: string;
  metadataid: string;
  commentId: string;
};

export const deleteComment = async ({
  token,
  metadataid,
  commentId
}: DeleteCommentProps): Promise<void> => {
  if (!token) {
    log.error('No token provided.');
    return Promise.reject(new Error('No token provided.'));
  }

  if (!metadataid) {
    log.error('No metadataid provided.');
    return Promise.reject(new Error('No metadataid provided.'));
  }

  if (!commentId) {
    log.error('No commentId provided.');
    return Promise.reject(new Error('No commentId provided.'));
  }

  const headers = new Headers({
    Authorization: `Bearer ${token}`
  });

  const response = await fetch(`${env.BACKEND_URL}/metadata/client/comment/${metadataid}`, {
    method: 'DELETE',
    headers,
    body: commentId
  });

  if (!response.ok) {
    throw new Error(`HTTP error status: ${response.status}`);
  }

  return await response.json();
};

type AssignUserProps = {
  token: string;
  metadataid: string;
  userId: string;
};

export const assignUser = async ({
  token,
  metadataid,
  userId
}: AssignUserProps): Promise<MetadataCollection> => {
  if (!token) {
    log.error('No token provided.');
    return Promise.reject(new Error('No token provided.'));
  }

  const headers = new Headers({
    Authorization: `Bearer ${token}`
  });

  const response = await fetch(`${env.BACKEND_URL}/metadata/${metadataid}/assignUser`, {
    method: 'POST',
    headers,
    body: userId
  });

  if (!response.ok) {
    throw new Error(`HTTP error status: ${response.status}`);
  }

  return await response.json();
};

type UnassignUserProps = {
  token: string;
  metadataid: string;
  userId: string;
};

export const unassignUser = async ({
  token,
  metadataid,
  userId
}: UnassignUserProps): Promise<MetadataCollection> => {
  if (!token) {
    log.error('No token provided.');
    return Promise.reject(new Error('No token provided.'));
  }

  const headers = new Headers({
    Authorization: `Bearer ${token}`
  });

  const response = await fetch(`${env.BACKEND_URL}/metadata/${metadataid}/unassignUser`, {
    method: 'DELETE',
    headers,
    body: userId
  });

  if (!response.ok) {
    throw new Error(`HTTP error status: ${response.status}`);
  }

  return await response.json();
};

type AssignRoleProps = {
  token: string;
  metadataid: string;
  role: Role;
};
export const assignRole = async ({
  token,
  metadataid,
  role
}: AssignRoleProps): Promise<MetadataCollection> => {
  if (!token) {
    log.error('No token provided.');
    return Promise.reject(new Error('No token provided.'));
  }

  const headers = new Headers({
    Authorization: `Bearer ${token}`
  });

  const response = await fetch(`${env.BACKEND_URL}/metadata/${metadataid}/assignRole`, {
    method: 'POST',
    headers,
    body: role
  });

  if (!response.ok) {
    throw new Error(`HTTP error status: ${response.status}`);
  }

  return await response.json();
};

type UnassignRoleProps = {
  token: string;
  metadataid: string;
};

export const unassignRole = async ({
  token,
  metadataid
}: UnassignRoleProps): Promise<MetadataCollection> => {
  if (!token) {
    log.error('No token provided.');
    return Promise.reject(new Error('No token provided.'));
  }

  const headers = new Headers({
    Authorization: `Bearer ${token}`
  });

  const response = await fetch(`${env.BACKEND_URL}/metadata/${metadataid}/unassignRole`, {
    method: 'DELETE',
    headers
  });

  if (!response.ok) {
    throw new Error(`HTTP error status: ${response.status}`);
  }

  return await response.json();
};
