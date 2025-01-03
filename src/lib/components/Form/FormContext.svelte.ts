import { getContext, setContext } from "svelte";

export type FormState = {
  data: Record<string, unknown>;
};

const formState = $state<FormState>({
  data: {},
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
