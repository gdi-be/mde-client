import { getContext, setContext } from 'svelte';
import type { FieldKey } from '$lib/models/form';
import { type MetadataCollection } from '$lib/models/metadata';
import { MetadataService } from '$lib/services/MetadataService';

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

export function getFormContext() {
  const formState = getContext<FormState>(FORMSTATE_CONTEXT);
  return {
    formState,
    getValue: <T>(key: string, metadata?: MetadataCollection) =>
      MetadataService.getValue<T>(key, metadata || formState.metadata!),
    getAllValues: <T>(key: string, metadata?: MetadataCollection) =>
      MetadataService.getAllValues<T>(key, metadata || formState.metadata),
    clearActiveHelp: () => clearActiveHelp(formState),
    toggleActiveHelp: (key: FieldKey) => toggleActiveHelp(key, formState)
  };
}
