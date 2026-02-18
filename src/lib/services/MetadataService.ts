/* eslint-disable @typescript-eslint/no-explicit-any */
import type { MetadataCollection } from '$lib/models/metadata';
import { FieldConfigs, type FullFieldConfig } from '$lib/components/Form/FieldsConfig';
import { logger } from 'loggisch';
import { MetadataUpdateService } from './MetadataUpdateService';

/**
 * MetadataService provides utilities for accessing and manipulating metadata collections.
 * This is a standalone service for metadata operations, separate from validation logic.
 */
export class MetadataService {
  /**
   * Gets a value from the metadata collection.
   * Supports both simple paths (e.g. 'isoMetadata.title') and array access (e.g. 'services[0].featureTypes[1]').
   *
   * @example
   * // Simple path
   * MetadataService.getValue('isoMetadata.title', metadata)
   * // Array access
   * MetadataService.getValue('isoMetadata.services[0].featureTypes[1].columns[0].name', metadata)
   *
   * @param key - Path to the desired value
   * @param metadata - The metadata collection
   * @returns The value at the specified path or undefined if the path does not exist
   */
  static getValue<T>(key: string, metadata?: MetadataCollection): T | undefined {
    if (!metadata) return undefined;

    return key.split('.').reduce(
      (obj, path) => {
        if (!obj) return undefined;

        // Check if we have an array index (e.g. "services[0]")
        const match = path.match(/^(\w+)(?:\[(\d+)\])?$/);
        if (!match) return undefined;

        const [, property, indexStr] = match;
        const value = obj[property];

        // If an index is specified and we have an array
        if (indexStr !== undefined && Array.isArray(value)) {
          const index = parseInt(indexStr, 10);
          return value[index];
        }

        return value;
      },
      metadata as Record<string, any>
    ) as T | undefined;
  }

  /**
   * Gets all values from a collection in the metadata collection for a given path.
   * Collects values recursively from nested arrays and returns them as a flat array.
   *
   * @example
   * // Get all column names from all feature types from all services
   * MetadataService.getAllValues('isoMetadata.services.featureTypes.columns.name', metadata)
   * // -> ['Mein Attribut', 'Mein zweites Attribut']
   *
   * @param key - Path to the desired collection without array indices
   * @param metadata - The metadata collection
   * @returns Array of all values found at the specified path
   */
  static getAllValues<T>(key: string, metadata?: MetadataCollection): T[] {
    if (!metadata) return [];

    const pathParts = key.split('.');

    function collectValues(obj: any, parts: string[], currentPath: string[]): T[] {
      if (!obj) return [];
      if (parts.length === 0) return [obj];

      const [current, ...rest] = parts;
      const value = obj[current];
      const fullPath = [...currentPath, current].join('.');

      // Get field config for current path to check if it's a collection
      const fieldConfig = FieldConfigs.find((config) => config.key === fullPath);

      // Special handling for layers
      if (fieldConfig?.profileId === 48 && value) {
        // Flatten all layers regardless of service
        const flattened = Object.values(value).flat() as T[];
        return rest.length === 0
          ? flattened
          : flattened.flatMap((item) => collectValues(item, rest, [...currentPath, current]));
      }

      // Handle collections based on fieldConfig
      if ((fieldConfig?.isCollection || fieldConfig?.collectionKey) && Array.isArray(value)) {
        return value.flatMap((item) => collectValues(item, rest, [...currentPath, current]));
      }

      // Regular object traversal
      return collectValues(value, rest, [...currentPath, current]);
    }

    return collectValues(metadata, pathParts, []);
  }

  /**
   * Persists a metadata value to the server.
   * Handles server communication, data invalidation, error handling, and user notifications.
   *
   * @param key - Path to the value to persist (e.g., 'isoMetadata.title')
   * @param value - The value to persist
   * @returns The server response
   */
  static async persistValue(key: string, value: unknown) {
    logger.trace(`Persisting value for key: ${key} with value:`, value);
    return MetadataUpdateService.pushToQueue(key, value);
  }

  /**
   * Gets a field configuration by profileId and optional key.
   * Returns the matching field configuration from FieldConfigs.
   *
   * @param profileId - The profile ID to search for
   * @returns The matching field configuration or undefined if not found
   */
  static getFieldConfig<T>(profileId: number): FullFieldConfig<T> {
    const staticFieldConfig = FieldConfigs.find(({ profileId: id }) => id === profileId);

    if (!staticFieldConfig) {
      logger.warning(`No field config found for profileId ${profileId}`);
      throw new Error(`No field config found for profileId ${profileId}`);
    }

    return staticFieldConfig;
  }
}
