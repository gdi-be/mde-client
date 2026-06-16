<svelte:options runes />

<Item
  bind:this={element}
  {use}
  data-value={value}
  {value}
  {selected}
  {...restProps}
>
  {@render children?.()}
</Item>

<script lang="ts">
  import type { ComponentProps, Snippet } from 'svelte';
  import { getContext, onDestroy, onMount, setContext } from 'svelte';
  import type { ActionArray } from '@smui/common/internal';
  import { Item } from '@smui/list';
  import type { Writable } from 'svelte/store';

  type OwnProps = {
    use?: ActionArray;
    class?: string;
    value?: string;
    children?: Snippet;
  };

  let {
    use = [],
    value = '',
    children,
    ...restProps
  }: OwnProps & Omit<ComponentProps<typeof Item>, keyof OwnProps> = $props();

  let element: Item | undefined;
  const selectedText = getContext<Writable<string>>('SMUI:select:selectedText');
  const selectedValue = getContext<Writable<string | undefined>>('SMUI:select:value');

  setContext('SMUI:list:item:role', 'option');

  const selected = $derived(value != null && value !== '' && $selectedValue === value);

  onMount(updateSelectedText);
  onDestroy(updateSelectedText);

  function updateSelectedText() {
    if (!selected || !element) return;

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
    if (!element) return;

    try {
      return element.getElement();
    } catch {
      return;
    }
  }
</script>
