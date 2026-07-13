<svelte:options runes />

<script lang="ts">
  import type { Snippet } from 'svelte';
  import { getContext, onDestroy, onMount, setContext } from 'svelte';
  import type { ActionArray } from '@smui/common/internal';
  import { Item, type SMUIListItemAccessor } from '@smui/list';
  import type { Writable } from 'svelte/store';

  type Props = {
    use?: ActionArray;
    class?: string;
    value?: string;
    children?: Snippet;
    [key: string]: unknown;
  };

  let { use = [], value = '', children, ...restProps }: Props = $props();

  let element: Item | undefined;
  let mountedElement: Element | undefined;
  let listItemAccessor: SMUIListItemAccessor | undefined;

  const selectedText = getContext<Writable<string>>('SMUI:select:selectedText');
  const selectedValue = getContext<Writable<string | undefined>>('SMUI:select:value');
  const mountItem = getContext<((accessor: SMUIListItemAccessor) => void) | undefined>(
    'SMUI:list:item:mount'
  );
  const unmountItem = getContext<((accessor: SMUIListItemAccessor) => void) | undefined>(
    'SMUI:list:item:unmount'
  );

  setContext('SMUI:list:item:role', 'option');
  setContext('SMUI:list:item:mount', (accessor: SMUIListItemAccessor) => {
    mountedElement = getAccessorElement(accessor);
    listItemAccessor = createStableAccessor(accessor);
    mountItem?.(listItemAccessor);
  });
  setContext('SMUI:list:item:unmount', () => {
    if (listItemAccessor) {
      unmountItem?.(listItemAccessor);
    }
  });

  const selected = $derived(value != null && value !== '' && $selectedValue === value);

  onMount(updateSelectedText);
  onDestroy(updateSelectedText);

  function createStableAccessor(accessor: SMUIListItemAccessor) {
    return Object.create(accessor, {
      element: {
        get: () => getAccessorElement(accessor) || mountedElement
      }
    }) as SMUIListItemAccessor;
  }

  function getAccessorElement(accessor: SMUIListItemAccessor) {
    try {
      const currentElement = accessor.element;
      if (currentElement) {
        mountedElement = currentElement;
      }
    } catch {
      // SMUI may ask for the element while the item is already being destroyed.
    }

    return mountedElement;
  }

  function updateSelectedText() {
    if (!selected) return;

    const itemElement = getItemElement();
    if (!itemElement) return;

    const primaryText = itemElement.querySelector('.mdc-deprecated-list-item__primary-text');
    if (primaryText?.textContent) {
      $selectedText = primaryText.textContent;
      return;
    }

    const text = itemElement.querySelector('.mdc-deprecated-list-item__text');
    if (text?.textContent) {
      $selectedText = text.textContent;
      return;
    }

    $selectedText = itemElement.textContent ?? '';
  }

  export function getElement() {
    return getItemElement();
  }

  function getItemElement() {
    try {
      return element?.getElement() || mountedElement;
    } catch {
      return mountedElement;
    }
  }
</script>

<Item bind:this={element} {use} data-value={value} {value} {selected} {...restProps}>
  {@render children?.()}
</Item>
