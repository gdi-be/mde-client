<script lang="ts">
  import TextInput from '$lib/components/Form/Inputs/TextInput.svelte';
  import type { Layer } from '$lib/models/metadata';
  import { getFieldConfig } from '$lib/context/FormContext.svelte';
  import { getHighestRole } from '$lib/util';
  import FieldTools from '$lib/components/Form/FieldTools.svelte';
  import { getAccessToken } from '$lib/context/TokenContext.svelte';

  export type ComponentProps = {
    value?: Layer['styleName'];
    onChange: (newValue: string) => Promise<Response>;
  };

  let { value, onChange }: ComponentProps = $props();

  const HELP_KEY = 'clientMetadata.layers.styleName';
  let showCheckmark = $state(false);

  const fieldConfig = getFieldConfig(51);
  const validationResult = $derived(fieldConfig?.validator(value));

  const token = $derived(getAccessToken());
  const highestRole = $derived(getHighestRole(token));
  const fieldVisible = $derived(['MdeEditor', 'MdeAdministrator'].includes(highestRole));

  const onChangeInternal = async (e: Event) => {
    const newValue = (e.target as HTMLInputElement).value;
    const response = await onChange(newValue);
    if (response.ok) {
      showCheckmark = true;
    }
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
    <FieldTools {value} key={HELP_KEY} bind:checkMarkAnmiationRunning={showCheckmark} />
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
