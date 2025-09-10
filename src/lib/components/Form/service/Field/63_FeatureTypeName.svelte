<script lang="ts">
  import TextInput from '$lib/components/Form/Inputs/TextInput.svelte';
  import type { FeatureType } from '$lib/models/metadata';
  import { getFieldConfig } from '$lib/context/FormContext.svelte';
  import { getHighestRole } from '$lib/util';
  import FieldTools from '$lib/components/Form/FieldTools.svelte';
  import { getAccessToken } from '$lib/context/TokenContext.svelte';

  export type ComponentProps = {
    value?: FeatureType['name'];
    onChange: (newValue: string) => Promise<Response>;
  };

  let { value, onChange }: ComponentProps = $props();

  const HELP_KEY = 'isoMetadata.services.featureTypes.name';
  const fieldConfig = getFieldConfig(63);
  const validationResult = $derived(fieldConfig?.validator(value));
  let showCheckmark = $state(false);

  const token = $derived(getAccessToken());
  const highestRole = $derived(getHighestRole(token));
  const fieldVisible = $derived(['MdeEditor', 'MdeAdministrator'].includes(highestRole));
</script>

{#if fieldVisible}
  <div class="featuretype-name-field">
    <TextInput
      label={fieldConfig?.label || 'Titel des Objekttyps'}
      {value}
      maxlength={100}
      {fieldConfig}
      {validationResult}
      onchange={async (e: Event) => {
        const response = await onChange((e.target as HTMLInputElement).value);
        if (response.ok) {
          showCheckmark = true;
        }
      }}
    />
    <FieldTools noCopyButton key={HELP_KEY} bind:checkMarkAnmiationRunning={showCheckmark} />
  </div>
{/if}

<style lang="scss">
  .featuretype-name-field {
    position: relative;
    display: flex;
    gap: 0.25em;

    :global(.text-input) {
      flex: 1;
    }
  }
</style>
