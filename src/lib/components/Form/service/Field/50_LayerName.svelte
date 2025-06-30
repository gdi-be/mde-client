<script lang="ts">
  import TextInput from '$lib/components/Form/Inputs/TextInput.svelte';
  import type { Layer } from '$lib/models/metadata';
  import { getContext } from 'svelte';
  import { getFieldConfig } from '$lib/context/FormContext.svelte';
  import type { Token } from '$lib/models/keycloak';
  import { getHighestRole } from '$lib/util';
  import FieldTools from '$lib/components/Form/FieldTools.svelte';

  export type ComponentProps = {
    value?: Layer['name'];
    onChange: (newValue: string) => Promise<Response>;
  };

  let { value, onChange }: ComponentProps = $props();

  const HELP_KEY = 'clientMetadata.layers.name';
  const fieldConfig = getFieldConfig(50);
  const validationResult = $derived(fieldConfig?.validator(value));

  const token = getContext<Token>('user_token');
  const highestRole = $derived(getHighestRole(token));
  const fieldVisible = $derived(['MdeEditor', 'MdeAdministrator'].includes(highestRole));
  let showCheckmark = $state(false);

  const onChangeInternal = async (e: Event) => {
    const newValue = (e.target as HTMLInputElement).value;
    const response = await onChange(newValue);
    if (response.ok) {
      showCheckmark = true;
    }
  };
</script>

{#if fieldVisible}
  <div class="layer-name-field">
    <TextInput
      label={fieldConfig?.label || 'Name der Kartenebene'}
      {value}
      maxlength={100}
      {fieldConfig}
      {validationResult}
      onchange={onChangeInternal}
    />
    <FieldTools key={HELP_KEY} bind:checkMarkAnmiationRunning={showCheckmark} />
  </div>
{/if}

<style lang="scss">
  .layer-name-field {
    position: relative;
    display: flex;
    gap: 0.25em;

    :global(.text-input) {
      flex: 1;
    }
  }
</style>
