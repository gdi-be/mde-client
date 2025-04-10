import { getContext, setContext } from 'svelte';

export const POPCONFIRM_CONTEXT = Symbol('popconfirm');

export type PopconfirmState = {
  open: boolean;
  text?: string;
  anchorElement?: HTMLElement;
  confirmButtonText?: string;
  onConfirm: () => Promise<void>;
  onCancel?: () => void;
};

type ConfirmOptions = Omit<PopconfirmState, 'open' | 'onConfirm' | 'targetEl'>;

const defaultState = {
  open: false,
  text: 'Sind sie sicher?',
  confirmButtonText: 'Bestätigen',
  onConfirm: async () => closePopconfirm(),
  onCancel: closePopconfirm
};

const popConfirmState = $state<{ state: PopconfirmState }>({ state: defaultState });

export function initializePopconfimContext() {
  setContext(POPCONFIRM_CONTEXT, popConfirmState);
}

export function popconfirm(
  anchorElement: HTMLElement,
  onConfirm: () => Promise<void>,
  options?: ConfirmOptions
) {
  popConfirmState.state = {
    ...defaultState,
    ...options,
    anchorElement,
    open: true,
    onConfirm
  };
}

export function closePopconfirm() {
  popConfirmState.state.open = false;
}

export function getPopconfirmState() {
  return getContext<{ state: PopconfirmState }>(POPCONFIRM_CONTEXT).state;
}
