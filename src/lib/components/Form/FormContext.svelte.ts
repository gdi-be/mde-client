import { getContext, setContext } from "svelte";
import type { FieldKey, FormHelp } from "../../models/form";

export type FormState = {
  data: Record<string, unknown>;
  help: FormHelp;
  activeHelpKey?: FieldKey;
};

const formState = $state<FormState>({
  data: {},
  help: {},
  activeHelpKey: undefined
});

const formStateKey = Symbol('formState');

export function initializeFormContext() {
  setContext(formStateKey, formState);
}

export function getFormContext() {
  return getContext<FormState>(formStateKey);
}

export function getValue<T>(key: string) {
  if (!formState?.data) return undefined;

  const value = key
    .split('.')
    .reduce((obj, k) => {
      return (obj && obj[k] !== undefined) ? obj[k] : undefined
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }, formState.data as Record<string, any>);

  return value as T
}

export function setFormData(data: Record<string, unknown>) {
  formState.data = data;
}

export function setHelp(help: FormHelp) {
  formState.help = help;
}

export function setValue<T>(key: string, value: T) {
  if (!formState || !formState.data) return;

  const keys = key.split('.');
  const lastKey = keys.pop();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let obj = formState.data as Record<string, any>;
  keys.forEach(k => {
    if (!obj[k]) obj[k] = {};
    obj = obj[k];
  });
  if (lastKey) {
    obj[lastKey] = value;
  }
}

export function hasHelpMarkdown(key?: FieldKey) {
  if (!key) {
    return false;
  }
  return !!formState.help[key];
}

export function getHelpMarkdown(key?: FieldKey) {
  if (!key) {
    return '';
  }
  return formState.help[key];
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