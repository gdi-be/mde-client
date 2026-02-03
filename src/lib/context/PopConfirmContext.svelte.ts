import { getContext, setContext } from 'svelte';
import { on } from 'svelte/events';

export const POPCONFIRM_CONTEXT = Symbol('popconfirm');

export type PopconfirmState = {
  open: boolean;
  text?: string;
  anchorElement?: HTMLElement;
  confirmButtonText?: string;
  onConfirm: () => Promise<void>;
};

type ConfirmOptions = Omit<PopconfirmState, 'open' | 'onConfirm' | 'targetEl'>;

const defaultState = {
  open: false,
  text: 'Sind sie sicher?',
  confirmButtonText: 'Bestätigen',
  onConfirm: async () => { }
};

export function initializePopconfirmContext() {
  const popConfirmState = $state<{ state: PopconfirmState }>({
    state: defaultState
  });
  setContext(POPCONFIRM_CONTEXT, popConfirmState);
}

export function getPopconfirm() {
  const popConfirmState = getContext<{ state: PopconfirmState }>(POPCONFIRM_CONTEXT);

  const close = (callback?: () => void) => {
    popConfirmState.state.open = false;
    if (callback) {
      callback();
    }
  };

  const open = (
    anchorElement: HTMLElement,
    onConfirm: () => Promise<void>,
    options?: ConfirmOptions
  ) => {
    popConfirmState.state = {
      ...defaultState,
      ...options,
      anchorElement,
      open: true,
      onConfirm
    };
  };

  return {
    open,
    close
  };
}

export function getPopconfirmState() {
  return getContext<{ state: PopconfirmState }>(POPCONFIRM_CONTEXT).state;
}
