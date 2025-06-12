/* eslint-disable @typescript-eslint/no-explicit-any */
import { getContext, setContext } from 'svelte';
import { page } from '$app/state';
import type { FieldKey } from '$lib/models/form';
import {
  FieldConfigs,
  type DynamicFieldConfig,
  type FieldConfig
} from '$lib/components/Form/FieldsConfig';
import { invalidate, invalidateAll } from '$app/navigation';
import type { MetadataCollection } from '$lib/models/metadata';
import { toast } from 'svelte-french-toast';

export type FormState = {
  metadata?: MetadataCollection;
  activeHelpKey?: FieldKey;
  assignedUser?: string;
  assignedRole?: string;
  fieldConfigs?: any;
};

const formState = $state<FormState>({
  activeHelpKey: undefined
});

export const FORMSTATE_CONTEXT = Symbol('formState');

export async function initializeFormContext(
  metadata: MetadataCollection,
  fieldConfigs?: FieldConfig<any>[]
) {
  formState.metadata = metadata;
  formState.fieldConfigs = fieldConfigs;
  setContext(FORMSTATE_CONTEXT, formState);
}

export function getFormContext() {
  return getContext<FormState>(FORMSTATE_CONTEXT);
}

export function getValue<T>(key: string, metadata?: MetadataCollection): T | undefined {
  const data = metadata || formState.metadata;
  if (!data) return undefined;
  const value = key.split('.').reduce(
    (obj, k) => {
      return obj && obj[k] !== undefined ? obj[k] : undefined;
    },
    data as Record<string, any>
  );

  return value as T;
}

export function getSubFieldConfig(
  key: FieldKey,
  ...subKeys: string[]
): DynamicFieldConfig | undefined {
  const configs: DynamicFieldConfig[] = formState.fieldConfigs || [];
  const dynamicFieldConfig = configs.find(({ key: k }) => k === key);
  if (!dynamicFieldConfig) return undefined;
  let config: DynamicFieldConfig | undefined = dynamicFieldConfig;
  subKeys.forEach((k) => {
    if (!config) {
      config = dynamicFieldConfig.subFields?.find(({ key: subKey }) => subKey === k);
    } else {
      config = config.subFields?.find(({ key: subKey }) => subKey === k);
    }
  });
  return config;
}

export function getFieldConfig<T>(key: FieldKey): FieldConfig<T> | undefined {
  const staticFieldConfig = FieldConfigs.find(({ key: k }) => k === key);
  const configs: DynamicFieldConfig[] = formState.fieldConfigs || [];
  const dynamicFieldConfig = configs.find(({ key: k }) => k === key);

  return {
    ...staticFieldConfig,
    ...dynamicFieldConfig
  } as FieldConfig<T>;
}

export function setValue<T>(key: string, value: T) {
  if (!formState || !formState.metadata) return;

  const keys = key.split('.');
  const lastKey = keys.pop();
  let obj = formState.metadata as Record<string, any>;
  keys.forEach((k) => {
    if (!obj[k]) obj[k] = {};
    obj = obj[k];
  });
  if (lastKey) {
    obj[lastKey] = value;
  }
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

export function getProgress(section: Section, metadata?: MetadataCollection): number {
  const totalRequired = FieldConfigs.filter(
    ({ section: s, required }) => s === section && required
  );

  if (!metadata || totalRequired.length === 0) return 1;

  const isValidFilter = ({ key, validator }: FieldConfig<any>) => {
    const value = getValue(key, metadata);
    const validationResult = validator(value);
    if (Array.isArray(validationResult)) {
      return validationResult.every((result) => result.valid);
    } else {
      return validationResult.valid;
    }
  };

  const filledRequired = totalRequired.filter(isValidFilter);

  return filledRequired.length / totalRequired.length;
}

export function allFieldsValid(metadata?: MetadataCollection): boolean {
  if (!metadata) return false;
  const sections = Array.from(new Set(FieldConfigs.map(({ section }) => section)));
  return sections.every((section: Section) => {
    return getProgress(section, metadata) === 1;
  });
}

export async function persistValue(key: string, value: unknown, invokeInvalidateAll = true) {
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
    if (invokeInvalidateAll) {
      invalidateAll();
    } else {
      invalidate(page.url.origin);
    }
  } else {
    toast.error(`Fehler beim Speichern der Daten: ${response.statusText}`);
  }

  return response;
}
