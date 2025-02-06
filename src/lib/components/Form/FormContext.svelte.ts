/* eslint-disable @typescript-eslint/no-explicit-any */
import { getContext, setContext } from "svelte";
import type { FieldKey } from "$lib/models/form";
import { FieldConfigs, type FieldConfig } from "./FieldsConfig";

export type FormState = {
  data: Record<string, unknown>;
  activeHelpKey?: FieldKey;
};

const formState = $state<FormState>({
  data: {},
  activeHelpKey: undefined
});

const formStateKey = Symbol('formState');

export function initializeFormContext() {
  setContext(formStateKey, formState);
}

export function getFormContext() {
  return getContext<FormState>(formStateKey);
}

export function getValue<T>(key: string, metadata?: Record<string, unknown>): T | undefined {
  const data = metadata || formState.data;
  if (!data) return undefined;
  const value = key
    .split('.')
    .reduce((obj, k) => {
      return (obj && obj[k] !== undefined) ? obj[k] : undefined
    }, data as Record<string, any>);

  return value as T
}

export function getFieldConfig<T>(key: FieldKey): FieldConfig<T> | undefined {
  return FieldConfigs.find(({key: k}) => k === key);
};

export function setFormData(data: Record<string, unknown>) {
  formState.data = data;
}

export function setValue<T>(key: string, value: T) {
  if (!formState || !formState.data) return;

  const keys = key.split('.');
  const lastKey = keys.pop();
  let obj = formState.data as Record<string, any>;
  keys.forEach(k => {
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

export type Section = 'basedata' | 'classification' | 'temp_and_spatial' | 'additional' | 'services';

export function getProgress(section: Section, metadata?: Record<string, unknown>): number {
  const totalRequired = FieldConfigs.filter(({section: s, required}) => s === section && required);

  if (!metadata) return 1;

  const isValidFilter = ({key, validator}: FieldConfig<any>) => {
    const value = getValue(key, metadata);
    const validationResult = validator(value);
    if (Array.isArray(validationResult)) {
      return validationResult.every(result => result.valid);
    } else {
      return validationResult.valid;
    }
  };

  const filledRequired = totalRequired.filter(isValidFilter);

  return filledRequired.length / totalRequired.length;
}

export function allFieldsValid(metadata?: Record<string, unknown>): boolean {
  if (!metadata) return false;
  const sections = Array.from(new Set(FieldConfigs.map(({section}) => section)));
  return sections.every((section: Section) => {
    return getProgress(section, metadata) === 1;
  });
}
