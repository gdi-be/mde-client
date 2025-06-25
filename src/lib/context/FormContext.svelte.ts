/* eslint-disable @typescript-eslint/no-explicit-any */
import { getContext, setContext } from 'svelte';
import { page } from '$app/state';
import type { FieldKey } from '$lib/models/form';
import {
  FieldConfigs,
  type FullFieldConfig,
  type YamlFieldConfig
} from '$lib/components/Form/FieldsConfig';
import { invalidateAll } from '$app/navigation';
import type { Layer, MetadataCollection } from '$lib/models/metadata';
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
export function getValue<T>(key: string, metadata?: MetadataCollection): T | undefined | null {
  const data = metadata || formState.metadata;
  if (!data) return undefined;

  return key.split('.').reduce((obj, path) => {
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
  }, data as Record<string, any>) as T | undefined | null;
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
    const fieldConfig = FieldConfigs.find(config => config.key === fullPath);

    // Special handling for layers
    if (fieldConfig?.profileId === 48 && value) {
      // Flatten all layers regardless of service
      const flattened = Object.values(value).flat() as T[];
      return rest.length === 0 ? flattened : flattened.flatMap(item => collectValues(item, rest, [...currentPath, current]));
    }

    // Handle collections based on fieldConfig
    if ((fieldConfig?.isCollection || fieldConfig?.collectionKey) && Array.isArray(value)) {
      return value.flatMap(item => collectValues(item, rest, [...currentPath, current]));
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

  // Helper function to validate a field
  const validateField = (field: FullFieldConfig<any>) => {
    // For collection fields, only validate if they don't exist or are empty
    if (field.isCollection) {
      const value = getValue(field.key, metadata);
      if (!Array.isArray(value) || value.length === 0) {
        totalCount++;
        if (field.validatorExtraParams) {
          console.log(`Skipping validation for ${field.key} as it is a collection field with no values.`);
          return;
        }
        const validation = field.validator(value, field.validatorExtraParams);
        if (validation.valid) {
          validCount++;
        } else {
          invalidFields.push({ field: field.key, profileId: field.profileId, value, helpText: validation.helpText });
        }
      }
      return;
    }

    // for child fields in collections, validate each value
    if (field.collectionKey) {
      const parentConfig = FieldConfigs.find(({ key }) => key === field.collectionKey);
      const parentKey = parentConfig?.key;
      const subKey = field.key.replace(field.collectionKey + '.', '');

      if (!parentConfig) return;

      const parentCollection = getAllValues(parentConfig.key, metadata) as any;

      if (!Array.isArray(parentCollection)) {
        console.warn(`Expected ${parentConfig.key} to be an array, but got:`, parentCollection);
        return;
      }

      if (Array.isArray(parentCollection) && parentCollection.length > 0) {
        parentCollection.forEach((v, i) => {
          let subValue = v[subKey];

          // Get the needed extra parameters if configured
          let extraParams: Record<string, any> | undefined;
          if (field.validatorExtraParams?.length) {
            extraParams = {};
            field.validatorExtraParams.forEach((param) => {
              if (param === parentKey) {
                extraParams = {
                  ...extraParams,
                  [param]: v
                };
              } else {
                // I hope we never get here
                console.error(`Unexpected parameter ${param} in validatorExtraParams for ${field.key}`);
              }
            });
          }

          // layers need special handling
          if (field.profileId === 48 && field.validatorExtraParams?.[0]) {
            const serviceId = extraParams?.[field.validatorExtraParams[0]].serviceIdentification;
            if (!serviceId) {
              toast.error(`No serviceId found for ${field.key} in profile ${field.profileId}. Skipping validation.`);
              return;
            }
            const layersMap: Record<string, Layer[]> = metadata?.clientMetadata?.layers;
            subValue = layersMap[serviceId];
          }

          const validation = field.validator(subValue, extraParams)
          if (validation.valid) {
            validCount++;
          } else {
            invalidFields.push({
              field: parentKey + `[${i}].` + subKey,
              profileId: field.profileId,
              helpText: validation.helpText,
              value: subValue
            });
          }
          totalCount++;
        });
      }
      return;
    }

    // For regular fields (not in collections)
    totalCount++;
    const value = getValue(field.key, metadata);
    if (field.validatorExtraParams) {
      console.log(`Skipping validation for ${field.key} as it is a collection field with no values.`);
      return;
    }
    const validation = field.validator(value, field.validatorExtraParams);
    if (validation.valid) {
      validCount++;
    } else {
      invalidFields.push({ field: field.key, profileId: field.profileId, value, helpText: validation.helpText });
    }
  };

  // Process all fields
  for (const field of baseRequired) {
    validateField(field);
  }

  // Calculate progress
  if (totalCount === 0) {
    return { progress: 1 };
  };

  return {
    progress: validCount / totalCount,
    invalidFields: invalidFields
  };
}

export function allFieldsValid(highestRole: Role, metadata?: MetadataCollection): boolean {
  if (!metadata) return false;
  return getProgress(highestRole, undefined, metadata).progress === 1;
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
    await invalidateAll();
  } else {
    toast.error(`Fehler beim Speichern der Daten: ${response.statusText}`);
  }

  return response;
}
