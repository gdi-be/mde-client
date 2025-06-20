<script lang="ts">
  import TextInput from '$lib/components/Form/Inputs/TextInput.svelte';
  import type { Layer } from '$lib/models/metadata';
  import { getContext } from 'svelte';
  import { getFieldConfig } from '$lib/context/FormContext.svelte';
  import { getHighestRole } from '$lib/util';
  import type { Token } from '$lib/models/keycloak';

  export type ComponentProps = {
    value?: Layer['styleName'];
    onChange: (newValue: string) => void;
  };

  let { value, onChange }: ComponentProps = $props();

  const fieldConfig = getFieldConfig(51);
  const validationResult = $derived(fieldConfig?.validator(value));

  const token = getContext<Token>('user_token');
  const highestRole = $derived(getHighestRole(token));
  const fieldVisible = $derived(['MdeEditor', 'MdeAdministrator'].includes(highestRole));

  const onChangeInternal = (e: Event) => {
    const newValue = (e.target as HTMLInputElement).value;
    onChange(newValue);
  };
</script>

{#if fieldVisible}
  <div class="layer-style-name-field">
    <TextInput
      label={fieldConfig?.label || 'Name des Styles'}
      {value}
      maxlength={100}
      {fieldConfig}
      {validationResult}
      onchange={onChangeInternal}
    />
  </div>
{/if}

<style lang="scss">
  .layer-style-name-field {
    position: relative;
    display: flex;
    gap: 0.25em;

    :global(.text-input) {
      flex: 1;
    }
  }
</style>
