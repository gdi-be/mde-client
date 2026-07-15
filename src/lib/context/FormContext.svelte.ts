import { getContext, setContext } from 'svelte';
import type { FieldKey } from '$lib/models/form';
import { type MetadataCollection } from '$lib/models/metadata';
import { MetadataService } from '$lib/services/MetadataService';
import { logger } from 'loggisch';

export type FormState = {
  metadata?: MetadataCollection;
  activeHelpKey?: FieldKey;
};

export const FORMSTATE_CONTEXT = Symbol('formState');

export async function initializeFormContext(metadata: MetadataCollection) {
  const formState = $state<FormState>({
    activeHelpKey: undefined
  });

  formState.metadata = metadata;
  setContext(FORMSTATE_CONTEXT, formState);
}

function clearActiveHelp(formState: FormState) {
  formState.activeHelpKey = undefined;
}

function toggleActiveHelp(key: FieldKey, formState: FormState) {
  if (formState.activeHelpKey === key) {
    formState.activeHelpKey = undefined;
  } else {
    formState.activeHelpKey = key;
  }
}

function setValueAtPath(
  target: Record<string, unknown>,
  [key, ...rest]: string[],
  value: unknown
): Record<string, unknown> {
  if (!key) {
    return target;
  }

  if (rest.length === 0) {
    return {
      ...target,
      [key]: value
    };
  }

  const child = target[key];
  const childObject =
    child && typeof child === 'object' && !Array.isArray(child)
      ? (child as Record<string, unknown>)
      : {};

  return {
    ...target,
    [key]: setValueAtPath(childObject, rest, value)
  };
}

function updateFormStateValue(formState: FormState, key: string, value: unknown) {
  if (!formState.metadata) {
    logger.error(`updateFormState: metadata is missing for ${key}`);
    return false;
  }

  const path = key.replace(/\[(\d+)\]/g, '.$1').split('.');
  const rootKey = path[0];
  if (!rootKey || !formState.metadata[rootKey as keyof MetadataCollection]) {
    logger.error(`updateFormState: ${rootKey || key} is missing for ${key}`);
    return false;
  }

  formState.metadata = setValueAtPath(
    formState.metadata as unknown as Record<string, unknown>,
    path,
    value
  ) as MetadataCollection;
  return true;
}

export function getFormContext() {
  const formState = getContext<FormState>(FORMSTATE_CONTEXT);
  return {
    formState,
    getValue: <T>(key: string, metadata?: MetadataCollection) =>
      MetadataService.getValue<T>(key, metadata || formState.metadata!),
    getAllValues: <T>(key: string, metadata?: MetadataCollection) =>
      MetadataService.getAllValues<T>(key, metadata || formState.metadata),
    updateFormState: (key: string, value: unknown) => updateFormStateValue(formState, key, value),
    clearActiveHelp: () => clearActiveHelp(formState),
    toggleActiveHelp: (key: FieldKey) => toggleActiveHelp(key, formState)
  };
}
