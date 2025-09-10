import { env } from '$env/dynamic/private';
import log from 'loggisch';
import type {
  MetadataProfile,
  MetadataCollection,
  MetadataId,
  MetadataType
} from '$lib/models/metadata';

import type { PageableProps, PageableResponse, QueryConfig } from '$lib/models/api';
import type { Role } from '$lib/models/keycloak';
import { ConflictError } from '$lib/error/error';

const defaultPage: PageableProps = {
  page: 0,
  size: 10
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

export const queryMetadata = async (
  token: string,
  queryConfig: QueryConfig,
  pagingOpts = defaultPage
): Promise<PageableResponse<MetadataCollection>> => {
  if (!token) {
    log.error('No token provided.');
    return Promise.reject(new Error('No token provided.'));
  }

  const url: URL = new URL(`${env.BACKEND_URL}/metadata/query`);

  if (pagingOpts) {
    url.searchParams.append('page', pagingOpts.page.toString());
    url.searchParams.append('size', pagingOpts.size.toString());
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: new Headers({
      Authorization: `Bearer ${token}`,
      'content-type': 'application/json'
    }),
    body: JSON.stringify(queryConfig)
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
    if (response.status === 409) {
      return Promise.reject(
        new ConflictError(`Conflict: Metadata with the same ${restKey} already exists.`)
      );
    }
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
    if (response.status === 409) {
      return Promise.reject(
        new ConflictError('Conflict: Metadata with the same title already exists.')
      );
    }
  }

  return await response.json();
};

export type MetadataDeleteProps = {
  token: string;
  id: string;
};

export type MetadataDeletionResponse = {
  deletedMetadataCollection: string;
  deletedCatalogRecords: string[];
};

export const deleteMetadataCollection = async ({
  token,
  id
}: MetadataDeleteProps): Promise<MetadataDeletionResponse> => {
  if (!token) {
    log.error('No token provided.');
    return Promise.reject(new Error('No token provided.'));
  }

  const headers = new Headers({
    Authorization: `Bearer ${token}`
  });

  const response = await fetch(`${env.BACKEND_URL}/metadata/${id}`, {
    method: 'DELETE',
    headers
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

  const response = await fetch(`${env.BACKEND_URL}/metadata/${metadataid}/comment`, {
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
    Authorization: `Bearer ${token}`,
    'content-type': 'application/json'
  });

  const response = await fetch(`${env.BACKEND_URL}/metadata/${metadataid}/assignRole`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      role
    })
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

type GetTeamProps = {
  token: string;
  metadataid: string;
};

type UserData = {
  role: string;
  keycloakId: string;
  displayName: string;
};

export const getTeam = async ({ token, metadataid }: GetTeamProps): Promise<UserData[]> => {
  if (!token) {
    log.error('No token provided.');
    return Promise.reject(new Error('No token provided.'));
  }

  const headers = new Headers({
    Authorization: `Bearer ${token}`
  });

  const response = await fetch(`${env.BACKEND_URL}/metadata/${metadataid}/team`, {
    method: 'GET',
    headers
  });

  if (!response.ok) {
    throw new Error(`HTTP error status: ${response.status}`);
  }

  return await response.json();
};

type ValidateProps = {
  token: string;
  metadataid: string;
};

export const validate = async ({ token, metadataid }: ValidateProps) => {
  if (!token) {
    log.error('No token provided.');
    return Promise.reject(new Error('No token provided.'));
  }

  const headers = new Headers({
    Authorization: `Bearer ${token}`
  });

  return await fetch(`${env.BACKEND_URL}/metadata/${metadataid}/validate`, {
    method: 'GET',
    headers
  });
};

type PublishProps = {
  token: string;
  metadataid: string;
};

export const publish = async ({ token, metadataid }: PublishProps) => {
  if (!token) {
    log.error('No token provided.');
    return Promise.reject(new Error('No token provided.'));
  }

  const headers = new Headers({
    Authorization: `Bearer ${token}`
  });

  return await fetch(`${env.BACKEND_URL}/metadata/${metadataid}/publish`, {
    method: 'POST',
    headers
  });
};
