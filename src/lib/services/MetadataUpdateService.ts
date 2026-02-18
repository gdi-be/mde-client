import { page } from '$app/state';
import { goto, invalidateAll } from '$app/navigation';
import { toast } from 'svelte-french-toast';
import { logger } from 'loggisch';

type Update = {
  key: string;
  value: unknown;
};

type UpdateQueue = Update[];

type UpdateResult = {
  ok: boolean;
};

export class MetadataUpdateService {
  /** Delay in milliseconds for batching updates before processing */
  static TIMEOUT_DELAY = 10;

  /** Timer reference for the current batching timeout */
  static executionTimeout: ReturnType<typeof setTimeout> | null = null;

  /** Flag indicating whether updates are currently being processed (sent to server) */
  static isProcessing = false;

  /** Queue of pending updates waiting to be processed */
  static updateQueue: UpdateQueue = [];

  /** Resolvers for all promises waiting for the current batch to complete */
  static pendingResolvers: Array<(result: UpdateResult) => void> = [];

  static async pushToQueue(key: string, value: unknown): Promise<UpdateResult> {
    return new Promise((resolve) => {
      MetadataUpdateService.updateQueue.push({ key, value });
      MetadataUpdateService.pendingResolvers.push(resolve);

      // If already processing, just add to queue and return
      if (MetadataUpdateService.isProcessing) {
        return;
      }

      // Clear existing timeout if there is already one scheduled
      if (MetadataUpdateService.executionTimeout) {
        clearTimeout(MetadataUpdateService.executionTimeout);
      }

      // Start processing after timeout
      MetadataUpdateService.executionTimeout = setTimeout(() => {
        MetadataUpdateService.processQueue();
      }, MetadataUpdateService.TIMEOUT_DELAY);
    });
  }

  static async processQueue() {
    if (MetadataUpdateService.isProcessing || MetadataUpdateService.updateQueue.length === 0) {
      return;
    }

    console.log('Processing update queue with updates:', MetadataUpdateService.updateQueue);

    MetadataUpdateService.isProcessing = true;

    const mergedUpdates = MetadataUpdateService.mergeUpdates(MetadataUpdateService.updateQueue);
    const resolvers = [...MetadataUpdateService.pendingResolvers];

    MetadataUpdateService.executionTimeout = null;
    MetadataUpdateService.updateQueue = [];
    MetadataUpdateService.pendingResolvers = [];

    // Process updates sequentially, stop on first failure
    let allSuccessful = true;
    while (mergedUpdates.length > 0) {
      const update = mergedUpdates[0];
      const response = await MetadataUpdateService.executeUpdate(update.key, update.value);
      mergedUpdates.shift();
      if (!response.ok) {
        allSuccessful = false;
        break;
      }
    }

    resolvers.forEach(r => r({ ok: allSuccessful }));

    MetadataUpdateService.isProcessing = false;

    // If new updates came in during processing, process them
    if (MetadataUpdateService.updateQueue.length > 0) {
      // Set timeout for next batch
      MetadataUpdateService.executionTimeout = setTimeout(() => {
        MetadataUpdateService.processQueue();
      }, MetadataUpdateService.TIMEOUT_DELAY);
    }
  }

  static mergeUpdates(updates: UpdateQueue): UpdateQueue {
    if (updates.length === 0) {
      return [];
    }

    // Build a map to track the latest update for each key
    const updateMap = new Map<string, Update>();

    // Process updates in order (later updates override earlier ones for same key)
    for (const update of updates) {
      updateMap.set(update.key, update);
    }

    // Filter out updates that are children of other updates
    const result: Update[] = [];
    const keys = Array.from(updateMap.keys());

    for (const key of keys) {
      const update = updateMap.get(key)!;
      let isOverridden = false;

      // Check if any other key is a parent of this key
      for (const otherKey of keys) {
        if (otherKey !== key && MetadataUpdateService.isParentPath(otherKey, key)) {
          isOverridden = true;
          break;
        }
      }

      if (!isOverridden) {
        result.push(update);
      }
    }

    return result;
  }

  /**
   * Checks if parentPath is a parent/ancestor of childPath
   * @example
   * isParentPath('isoMetadata.services', 'isoMetadata.services[0].title') => true
   * isParentPath('isoMetadata.services[0]', 'isoMetadata.services[0].title') => true
   * isParentPath('isoMetadata.services[0]', 'isoMetadata.services[1].title') => false
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

  // TODO: get rid of svelte specific code here and move it to a separate adapter layer
  static async executeUpdate(key: string, value: unknown): Promise<Response> {
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
  };

}
