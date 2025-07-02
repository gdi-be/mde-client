/* eslint-disable @typescript-eslint/no-explicit-any */
import { getContext, setContext } from 'svelte';
import { page } from '$app/state';
import type { FieldKey } from '$lib/models/form';
import { log } from 'loggisch';
import {
  FieldConfigs,
  type FullFieldConfig,
  type YamlFieldConfig
} from '$lib/components/Form/FieldsConfig';
import { invalidateAll } from '$app/navigation';
import { type Layer, type MetadataCollection, type Service } from '$lib/models/metadata';
import { toast } from 'svelte-french-toast';
import type { Role } from '$lib/models/keycloak';

export type FormState = {
  metadata?: MetadataCollection;
  activeHelpKey?: FieldKey;
  assignedUser?: string;
  assignedRole?: string;
  fieldConfigs?: YamlFieldConfig[];
};

const formState = $state<FormState>({
  activeHelpKey: undefined
});

export const FORMSTATE_CONTEXT = Symbol('formState');

export async function initializeFormContext(
  metadata: MetadataCollection,
  fieldConfigs?: YamlFieldConfig[]
) {
  formState.metadata = metadata;
  formState.fieldConfigs = fieldConfigs;
  setContext(FORMSTATE_CONTEXT, formState);
}

export function getFormContext() {
  return getContext<FormState>(FORMSTATE_CONTEXT);
}

/**
 * Gets a value from the metadata collection.
 * Supports both simple paths (e.g. 'isoMetadata.title') and array access (e.g. 'services[0].featureTypes[1]').
 *
 * @example
 * // Simple path
 * getValue('isoMetadata.title')
 * // Array access
 * getValue('isoMetadata.services[0].featureTypes[1].columns[0].name')
 *
 * @param key - Path to the desired value
 * @param metadata - Optional: Alternative metadata collection. If not provided, formState.metadata is used
 * @returns The value at the specified path or undefined if the path does not exist
 */
export function getValue<T>(key: string, metadata?: MetadataCollection): T | undefined {
  const data = metadata || formState.metadata;
  if (!data) return undefined;

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
    data as Record<string, any>
  ) as T | undefined;
}

/**
 * Gets all values from a collection in the metadata collection for a given path.
 * Collects values recursively from nested arrays and returns them as a flat array.
 *
 * @example
 * // Get all column names from all feature types from all services
 * getAllValues('isoMetadata.services.featureTypes.columns.name')
 * // -> ['Mein Attribut', 'Mein zweites Attribut']
 *
 * @param key - Path to the desired collection without array indices
 * @param metadata - Optional: Alternative metadata collection. If not provided, formState.metadata is used
 * @returns Array of all values found at the specified path
 */
export function getAllValues<T>(key: string, metadata?: MetadataCollection): T[] {
  const data = metadata || formState.metadata;
  if (!data) return [];

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

  return collectValues(data, pathParts, []);
}

export function getFieldConfig<T>(profileId: number, key?: string): FullFieldConfig<T> | undefined {
  const staticFieldConfigs = FieldConfigs.filter(({ profileId: id }) => id === profileId) || [];
  const staticFieldConfig =
    staticFieldConfigs.length === 1 || key === undefined
      ? staticFieldConfigs[0]
      : staticFieldConfigs.find(({ key: k }) => k === key);

  const yamlConfigs = formState.fieldConfigs?.filter(({ profileId: id }) => id === profileId) || [];
  const dynamicFieldConfig =
    yamlConfigs.length === 1 ? yamlConfigs[0] : yamlConfigs.find(({ key: k }) => k === key);

  return {
    ...staticFieldConfig,
    ...dynamicFieldConfig
  } as FullFieldConfig<T>;
}

export function clearActiveHelp() {
  formState.activeHelpKey = undefined;
}

export function toggleActiveHelp(key: FieldKey) {
  if (formState.activeHelpKey === key) {
    formState.activeHelpKey = undefined;
  } else {
    formState.activeHelpKey = key;
  }
}

export type Section =
  | 'basedata'
  | 'classification'
  | 'temp_and_spatial'
  | 'additional'
  | 'services';

export type InvalidFieldInfo = {
  field: string;
  profileId: number;
  value: any;
  helpText?: string;
};

export type ProgressInfo = {
  progress: number;
  invalidFields?: InvalidFieldInfo[];
};

export function getExtraParams(
  field: FullFieldConfig<any>,
  metadata?: MetadataCollection,
  parentValue?: any
): Record<string, any> | undefined {
  if (!field.validatorExtraParams) return undefined;

  const extraParams: Record<string, any> = {};
  for (const param of field.validatorExtraParams) {
    if (param === 'PARENT_VALUE') {
      if (parentValue === undefined) {
        log('error', 'parent_value is undefined, but requested in validatorExtraParams');
        continue;
      }
      extraParams['PARENT_VALUE'] = parentValue;
    } else {
      const paramValue = getValue(param, metadata);
      if (paramValue !== undefined) {
        extraParams[param] = paramValue;
      }
    }
  }
  return extraParams;
}

/**
 * Get the progres of the form based on the highest role and an optional section.
 *
 * The progress is calculated as the ratio of valid fields to total fields in
 * the specified section. If no section is specified, it calculates the progress
 * for all fields in the metadata.
 *
 * @param highestRole - The highest role of the user.
 * @param section - Optional section to calculate progress for.
 * If not provided, calculates for all fields.
 * @param metadata - Optional metadata collection. If not provided, uses the
 * metadata from the form state.
 * @returns
 */
export function getProgress(
  highestRole: Role,
  section?: Section,
  metadata?: MetadataCollection
): ProgressInfo {
  let totalCount = 0;
  let validCount = 0;
  const invalidFields: InvalidFieldInfo[] = [];

  // Get base required fields configuration
  const baseRequired = FieldConfigs.filter(({ section: s, required, editingRoles }) => {
    const isEditingRole =
      highestRole === 'MdeAdministrator' ||
      (editingRoles ? editingRoles?.includes(highestRole) : true);

    if (!section) {
      return required && isEditingRole;
    }

    const isSection = s === section;
    return required && isSection && isEditingRole;
  });

  if (!metadata || baseRequired.length === 0) {
    return { progress: 1 };
  }

  // Helper function to validate a single value and track results
  const validateValue = (
    field: FullFieldConfig<any>,
    value: any,
    extraParams: Record<string, any> | undefined,
    fieldPath: string
  ) => {
    totalCount++;
    const validation = field.validator(value, extraParams);
    if (validation.valid) {
      validCount++;
    } else {
      invalidFields.push({
        field: fieldPath,
        profileId: field.profileId,
        value,
        helpText: validation.helpText
      });
    }
  };

  const validateCollectionField = (
    field: FullFieldConfig<any>,
    parentCollection: any[],
    parentKey: string,
    subKey: string
  ) => {
    parentCollection
      .filter((v) => !!v)
      .forEach((v, i) => {
        const subValue = v[subKey];
        const extraParams = getExtraParams(field, metadata, v);

        // layers need special handling
        if (field.profileId === 48 || field.collectionKey === 'clientMetadata.layers') {
          const layersMap = getValue<Record<string, Layer>>('clientMetadata.layers', metadata);

          if (!layersMap || Object.keys(layersMap).length === 0) {
            // TODO: we have no layers, so we cant get the service by the layers map.
            // How to get the correct service here?
            return;
          }

          for (const [serviceId, layers] of Object.entries(layersMap)) {
            const services = getValue<Service[]>('isoMetadata.services', metadata);
            const layerService = services?.find((s) => s.serviceIdentification === serviceId);
            if (!layerService || layerService.serviceType !== 'WMS') {
              // No service found for this layer, skip it
              continue;
            }

            const fieldPath = `clientMetadata.layers['${serviceId}']`;
            // handle the 'clientMetadata.layers' collection itself
            if (field.profileId === 48) {
              validateValue(field, layers, extraParams, fieldPath);
            } else if (Array.isArray(layers) && layers.length > 0) {
              // For each layer in the service, validate the subValue
              for (const layer of layers) {
                validateValue(field, layer[subKey], extraParams, `${fieldPath}[${i}].${subKey}`);
              }
            }
          }
          return;
        }

        // Only validate explicitly marked collections
        if (field.isCollection) {
          if (!Array.isArray(subValue) || subValue.length === 0) {
            validateValue(field, subValue, extraParams, `${parentKey}[${i}].${subKey}`);
          }
          return;
        }

        // For all other fields
        validateValue(field, subValue, extraParams, `${parentKey}[${i}].${subKey}`);
      });
  };

  const validateField = (field: FullFieldConfig<any>) => {
    // Handle fields that are part of a collection
    if (field.collectionKey) {
      const parentConfig = FieldConfigs.find(({ key }) => key === field.collectionKey);
      if (!parentConfig) return;

      const parentCollection = getAllValues(parentConfig.key, metadata) as any[];

      // If parent collection is empty or not an array, skip validation
      if (!Array.isArray(parentCollection) || parentCollection.length === 0) {
        return;
      }

      // If parent collection is not empty, validate its fields
      const subKey = field.key.replace(field.collectionKey + '.', '');
      validateCollectionField(field, parentCollection, parentConfig.key, subKey);
      return;
    }

    // For standalone collections, only validate if they don't exist or are empty
    if (field.isCollection) {
      const value = getValue(field.key, metadata);
      if (!Array.isArray(value) || value.length === 0) {
        validateValue(field, value, getExtraParams(field, metadata), field.key);
      }
      return;
    }

    // For regular fields (not in collections)
    validateValue(field, getValue(field.key, metadata), getExtraParams(field, metadata), field.key);
  };

  // Process all fields
  for (const field of baseRequired) {
    validateField(field);
  }

  // Calculate progress
  if (totalCount === 0) {
    return { progress: 1 };
  }

  return {
    progress: validCount / totalCount,
    invalidFields: invalidFields
  };
}

export function allFieldsValid(highestRole: Role, metadata?: MetadataCollection): boolean {
  if (!metadata) return false;
  const progress = getProgress(highestRole, undefined, metadata);
  log('warning', 'Invalid fields: ' + progress.invalidFields?.map((f) => f.field));
  // Check if progress is 1 (100%)
  return progress.progress === 1;
}

export async function persistValue(key: string, value: unknown) {
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
    const { message } = await response.json();
    toast.error(message || 'Fehler beim Speichern der Daten');
  }

  return response;
}
