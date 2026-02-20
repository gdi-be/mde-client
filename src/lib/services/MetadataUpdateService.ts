import { page } from '$app/state';
import { goto, invalidateAll } from '$app/navigation';
import { toast } from 'svelte-french-toast';
import { logger } from 'loggisch';

export type Update = {
  key: string;
  value: unknown;
};

export type UpdateQueue = Update[];

type PendingUpdate = {
  update: Update;
  resolve: (response: Response) => void;
};

export class MetadataUpdateService {
  /** Delay in milliseconds for batching updates before processing */
  static TIMEOUT_DELAY = 10;

  /** Timer reference for the current batching timeout */
  static executionTimeout: ReturnType<typeof setTimeout> | null = null;

  /** Flag indicating whether updates are currently being processed (sent to server) */
  static isProcessing = false;

  /** Pending updates with their resolvers */
  static pendingUpdates: PendingUpdate[] = [];

  /**
   * Push an update to the queue for processing. If updates are already being
   * processed, the new update will be added to the queue and processed in the
   * next batch after the current one finishes. If there is already a timeout
   * scheduled to process the queue, it will be reset to ensure the new update
   * is included in the batch.
   *
   * @param key The metadata key to update (e.g., 'isoMetadata.services')
   * @param value The new value for the metadata key
   * @returns A promise that resolves with the server response for this update.
   * If the update was merged with other updates, the promise resolves with the
   * response of the merged update. If the update was overridden by a parent update,
   * the promise resolves with a synthetic 204 No Content response indicating it was merged.
   */
  static async pushToQueue(key: string, value: unknown): Promise<Response> {
    return new Promise((resolve) => {
      MetadataUpdateService.pendingUpdates.push({
        update: { key, value },
        resolve
      });

      // If already processing, just add to queue and return
      if (MetadataUpdateService.isProcessing) {
        return;
      }

      // Clear existing timeout if there is already one scheduled
      if (MetadataUpdateService.executionTimeout) {
        clearTimeout(MetadataUpdateService.executionTimeout);
      }

      // Start processing after timeout
      MetadataUpdateService.processQueueWithDelay();
    });
  }

  /**
   * Process the queue of pending updates after the configured delay. This allows
   * batching multiple updates together.
   */
  static async processQueueWithDelay() {
    MetadataUpdateService.executionTimeout = setTimeout(() => {
      MetadataUpdateService.processQueue();
    }, MetadataUpdateService.TIMEOUT_DELAY);
  }

  /**
   * Process the queue of pending updates immediately. This method is called
   * after the timeout expires to send the batch of updates to the server. It merges
   * updates for the same keys, handles parent-child relationships between keys to avoid
   * sending redundant updates, and maps server responses back to the original updates.
   *
   * If there are already updates being processed or there are no pending updates,
   * this method will return early and the new updates will be handled in the next batch
   * after the current one finishes.
   *
   * @returns
   */
  static async processQueue() {
    if (MetadataUpdateService.isProcessing || MetadataUpdateService.pendingUpdates.length === 0) {
      return;
    }

    MetadataUpdateService.isProcessing = true;

    // Clear the timeout reference since we're now processing the queue
    MetadataUpdateService.executionTimeout = null;

    const pendingUpdates = [...MetadataUpdateService.pendingUpdates];
    MetadataUpdateService.pendingUpdates = [];

    // Extract just the updates for merging
    const updates = pendingUpdates.map((p) => p.update);

    // Merge updates and get mapping from original to merged
    const { merged, mapping } = MetadataUpdateService.mergeUpdates(updates);

    // Process merged updates sequentially and collect responses
    const responses: Response[] = [];
    for (const update of merged) {
      const response = await MetadataUpdateService.executeUpdate(update.key, update.value);
      responses.push(response);
      if (!response.ok) {
        break; // Stop on first failure
      }
    }

    // Map responses back to original updates
    for (let i = 0; i < pendingUpdates.length; i++) {
      const { resolve } = pendingUpdates[i];
      const mergedIndex = mapping.get(i);

      if (mergedIndex !== undefined && mergedIndex < responses.length) {
        // Use the response from the merged update
        resolve(responses[mergedIndex]);
      } else {
        // Update was discarded/overridden - create a synthetic ok response
        resolve(new Response(null, { status: 204, statusText: 'No Content (merged)' }));
      }
    }

    MetadataUpdateService.isProcessing = false;

    // If new updates came in during processing, process them
    if (MetadataUpdateService.pendingUpdates.length > 0) {
      MetadataUpdateService.processQueueWithDelay();
    }
  }

  /**
   * This method takes a list of updates and merges them according to the following rules:
   * 1. If there are multiple updates for the same key, they are merged into a single update.
   *    For array values with objects that have 'id' properties, the merge "intelligently" combines
   *    items by ID instead of just taking the last value.
   * 2. If there are updates for parent and child keys (e.g., 'isoMetadata.services'),
   *    the child update is considered overridden by the parent update and is not included in
   *    the final merged list. Instead, any original updates that mapped to the child key will
   *    be remapped to the parent key's position in the final result.
   *
   * @param updates The list of updates to merge
   * @returns An object containing the merged list of updates and a mapping from original
   * update index to merged update index. The mapping allows us to resolve which server response
   * corresponds to each original update after merging.
   */
  static mergeUpdates(updates: UpdateQueue): { merged: UpdateQueue; mapping: Map<number, number> } {
    if (updates.length === 0) {
      return { merged: [], mapping: new Map() };
    }

    // Track which original update maps to which merged update
    const originalToMerged = new Map<number, string>(); // originalIndex -> mergedKey

    // Group updates by key to handle multiple updates to same key
    const updatesByKey = new Map<string, { update: Update; originalIndices: number[] }>();
    for (let i = 0; i < updates.length; i++) {
      const update = updates[i];
      const key = update.key;

      if (!updatesByKey.has(key)) {
        updatesByKey.set(key, { update, originalIndices: [] });
      }
      updatesByKey.get(key)!.originalIndices.push(i);
      originalToMerged.set(i, key); // Initially map to its own key
    }

    // Merge multiple updates for the same key
    const updateMap = new Map<string, Update>();
    for (const [key, { update, originalIndices }] of updatesByKey.entries()) {
      if (originalIndices.length === 1) {
        updateMap.set(key, update);
      } else {
        // Multiple updates for same key - merge intelligently
        const keyUpdates = originalIndices.map((i) => updates[i]);
        const merged = MetadataUpdateService.mergeArrayUpdates(keyUpdates);
        updateMap.set(key, merged);
      }
    }

    // Filter out updates that are children of other updates
    const result: Update[] = [];
    const keys = Array.from(updateMap.keys());
    const keyToResultIndex = new Map<string, number>(); // Track position in result array

    for (const key of keys) {
      const update = updateMap.get(key)!;
      let parentKey: string | undefined;

      // Check if any other key is a parent of this key
      for (const otherKey of keys) {
        if (otherKey !== key && MetadataUpdateService.isParentPath(otherKey, key)) {
          parentKey = otherKey;
          break;
        }
      }

      if (!parentKey) {
        // Not overridden - add to result
        keyToResultIndex.set(key, result.length);
        result.push(update);
      } else {
        // Overridden by parent - map to parent's position
        // Note: Parent might not be in result yet, we'll resolve this below
        for (let i = 0; i < updates.length; i++) {
          if (originalToMerged.get(i) === key) {
            originalToMerged.set(i, parentKey);
          }
        }
      }
    }

    // Build final mapping from original index to result index
    const mapping = new Map<number, number>();
    for (let i = 0; i < updates.length; i++) {
      const mergedKey = originalToMerged.get(i);
      if (mergedKey) {
        const resultIndex = keyToResultIndex.get(mergedKey);
        if (resultIndex !== undefined) {
          mapping.set(i, resultIndex);
        }
      }
    }

    return { merged: result, mapping };
  }

  /**
   * Deep merges two values, with special handling for arrays with ID properties.
   * For arrays of objects with 'id' properties, the merge is done by combining
   * items based on their IDs. For other types of values, the earlier value takes precedence.
   * This method also includes protection against circular references by using a WeakSet to
   * track visited objects.
   *
   * @param earlierValue The earlier value to merge
   * @param laterValue The later value to merge
   * @param visited WeakSet to track visited objects and prevent circular references
   * @returns The merged value
   */
  static deepMergeValues(
    earlierValue: unknown,
    laterValue: unknown,
    visited: WeakSet<object> = new WeakSet()
  ): unknown {
    // If either is not defined, return the other
    if (earlierValue === undefined) return laterValue;
    if (laterValue === undefined) return earlierValue;

    // Protection against circular references
    if (typeof earlierValue === 'object' && earlierValue !== null) {
      if (visited.has(earlierValue)) return laterValue;
      visited.add(earlierValue);
    }
    if (typeof laterValue === 'object' && laterValue !== null) {
      if (visited.has(laterValue)) return earlierValue;
      visited.add(laterValue);
    }

    // If both are arrays with objects that have 'id' property, merge by ID
    if (
      Array.isArray(earlierValue) &&
      Array.isArray(laterValue) &&
      earlierValue.length > 0 &&
      laterValue.length > 0 &&
      typeof earlierValue[0] === 'object' &&
      typeof laterValue[0] === 'object' &&
      earlierValue[0] !== null &&
      laterValue[0] !== null &&
      'id' in earlierValue[0] &&
      'id' in laterValue[0]
    ) {
      // Build map from later array (base structure)
      const itemMap = new Map<string, Record<string, unknown>>();
      for (const item of laterValue) {
        itemMap.set(item.id, { ...item });
      }

      // Merge items from earlier array
      for (const earlierItem of earlierValue) {
        const id = earlierItem.id;
        if (itemMap.has(id)) {
          // Recursively merge the matching item
          const laterItem = itemMap.get(id)!;
          itemMap.set(
            id,
            MetadataUpdateService.deepMergeObjects(
              earlierItem as Record<string, unknown>,
              laterItem,
              visited
            )
          );
        }
        // If ID doesn't exist in later array, it was deleted - don't add it back
      }

      return Array.from(itemMap.values());
    }

    // For primitives and non-ID arrays, earlier value takes precedence
    return earlierValue;
  }

  /**
   * Deep merges two objects, recursively handling nested arrays with IDs.
   * The later object serves as the base structure, and properties from the earlier object
   * are overlaid on top. For arrays with objects that have 'id' properties, the merge is done
   * intelligently by combining items based on their IDs instead of just taking the last value.
   * This method also includes protection against circular references by using a WeakSet to track
   * visited objects.
   *
   * @param earlierObj The earlier object to merge
   * @param laterObj The later object to merge
   * @param visited WeakSet to track visited objects and prevent circular references
   * @returns The merged object
   */
  static deepMergeObjects(
    earlierObj: Record<string, unknown>,
    laterObj: Record<string, unknown>,
    visited: WeakSet<object> = new WeakSet()
  ): Record<string, unknown> {
    const result = { ...laterObj }; // Start with later object (base structure)

    // Overlay properties from earlier object
    for (const [prop, earlierValue] of Object.entries(earlierObj)) {
      const laterValue = laterObj[prop];

      // If both values are objects (but not arrays), recurse
      if (
        typeof earlierValue === 'object' &&
        typeof laterValue === 'object' &&
        earlierValue !== null &&
        laterValue !== null &&
        !Array.isArray(earlierValue) &&
        !Array.isArray(laterValue)
      ) {
        result[prop] = MetadataUpdateService.deepMergeObjects(
          earlierValue as Record<string, unknown>,
          laterValue as Record<string, unknown>,
          visited
        );
      } else {
        // Use deep merge for arrays or direct value for primitives
        result[prop] = MetadataUpdateService.deepMergeValues(earlierValue, laterValue, visited);
      }
    }

    return result;
  }

  /**
   * Merges multiple updates for the same array key by intelligently combining array items by ID.
   * If the values are not arrays with objects that have 'id' properties, it simply
   * takes the last update. This method is used to merge multiple updates to the same array key
   * into a single update that can be sent to the server, while preserving the intent of all
   * updates as much as possible.
   *
   * For example, if there are multiple updates to 'isoMetadata.services' that add, modify, or delete
   * services by ID, this method will combine those updates into a single array that reflects all
   * the changes. If there are updates that change the same service by ID, the earlier update takes
   * precedence for that service, but other services from later updates will still be included.
   *
   * @param updates The list of updates for the same key to merge
   * @returns A single merged update that combines the intent of all provided updates
   */
  static mergeArrayUpdates(updates: Update[]): Update {
    if (updates.length === 1) {
      return updates[0];
    }

    const key = updates[0].key;

    // Check if all values are arrays with objects that have 'id' property
    const allArraysWithIds = updates.every(
      (u) =>
        Array.isArray(u.value) &&
        (u.value.length === 0 ||
          (typeof u.value[0] === 'object' && u.value[0] !== null && 'id' in u.value[0]))
    );

    // If not all are arrays with IDs, just take the last one
    if (!allArraysWithIds) {
      return updates[updates.length - 1];
    }

    // Merge arrays by ID recursively
    let mergedArray = updates[updates.length - 1].value as Array<Record<string, unknown>>;

    // Go through earlier updates in reverse order and merge
    for (let i = updates.length - 2; i >= 0; i--) {
      const earlierArray = updates[i].value as Array<Record<string, unknown>>;
      mergedArray = MetadataUpdateService.deepMergeValues(earlierArray, mergedArray) as Array<
        Record<string, unknown>
      >;
    }

    return {
      key,
      value: mergedArray
    };
  }

  /**
   * Checks if parentPath is a parent/ancestor of childPath.
   *
   * @example
   * isParentPath('isoMetadata.services', 'isoMetadata.services[0].title') => true
   * isParentPath('isoMetadata.services[0]', 'isoMetadata.services[0].title') => true
   * isParentPath('isoMetadata.services[0]', 'isoMetadata.services[1].title') => false
   *
   * @param parentPath The potential parent path (e.g., 'isoMetadata.services')
   * @param childPath The potential child path (e.g., 'isoMetadata.services[0].title')
   * @returns True if parentPath is a parent of childPath, false otherwise
   */
  static isParentPath(parentPath: string, childPath: string): boolean {
    // If paths are equal, parent is not ancestor
    if (parentPath === childPath) {
      return false;
    }

    // Child must start with parent path
    if (!childPath.startsWith(parentPath)) {
      return false;
    }

    // Get the remainder after the parent path
    const remainder = childPath.substring(parentPath.length);

    // Valid parent-child relationship patterns:
    // 1. Parent ends and child continues with '.' (e.g., 'services' -> 'services.title')
    // 2. Parent ends and child continues with '[' (e.g., 'services' -> 'services[0]')
    // 3. Parent ends with ']' and child continues with '.' (e.g., 'services[0]' -> 'services[0].title')

    if (remainder.startsWith('.') || remainder.startsWith('[')) {
      return true;
    }

    return false;
  }

  /**
   * Executes an update by sending a PATCH request to the server with the provided key and value.
   * Handles different response statuses and displays appropriate messages or redirects.
   *
   * @param key The key of the metadata to update
   * @param value The new value for the metadata
   * @returns A promise that resolves to the server response
   */
  static async executeUpdate(key: string, value: unknown): Promise<Response> {
    //TODO: get rid of svelte specific code (invalidateAll, goto, toast, page)
    // here and move it to a separate adapter layer
    const response = await fetch(page.url, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        key,
        value
      })
    });

    if (response.ok) {
      // Invalidate all data to refetch from the server
      await invalidateAll();
    } else {
      let message = 'Fehler beim Speichern der Daten';
      try {
        const data = await response.json();
        message = data?.message ?? JSON.stringify(data);
      } catch {
        message = await response.text();
      }
      if (response.status === 401) {
        // If unauthorized, redirect to login
        logger.warning('Unauthorized access, redirecting to login');
        goto('/login');
      } else if (response.status === 409) {
        toast.error(`Konflikt beim Speichern eines eindeutigen Werts: ${key} - ${value}`);
      } else {
        toast.error(message);
      }
    }

    return response;
  }
}
