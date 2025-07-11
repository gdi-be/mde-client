<script lang="ts">
  import TextInput from '$lib/components/Form/Inputs/TextInput.svelte';
  import { getFieldConfig, getValue, persistValue } from '$lib/context/FormContext.svelte';
  import FieldTools from '../FieldTools.svelte';
  import type { ValidationResult } from '../FieldsConfig';
  import { getHighestRole } from '$lib/util';
  import { getAccessToken } from '$lib/context/TokenContext.svelte';

  const KEY = 'clientMetadata.relatedTopics';

  const valueFromData = $derived(getValue<string>(KEY));
  let value = $state('');
  $effect(() => {
    value = valueFromData || '';
  });

  const token = $derived(getAccessToken());
  const highestRole = $derived(getHighestRole(token));

  let showCheckmark = $state(false);
  const fieldConfig = getFieldConfig<string>(36);
  let validationResult = $derived(fieldConfig?.validator(value)) as ValidationResult;
  const fieldVisible = $derived(['MdeEditor', 'MdeAdministrator'].includes(highestRole));

  const onBlur = async () => {
    const response = await persistValue(KEY, value);
    if (response.ok) {
      showCheckmark = true;
    }
  };
</script>

{#if fieldVisible}
  <div class="related-topics-field">
    <TextInput
      bind:value
      label={fieldConfig?.label || KEY}
      {fieldConfig}
      {validationResult}
      onblur={onBlur}
    />
    <FieldTools key={KEY} bind:checkMarkAnmiationRunning={showCheckmark} />
  </div>
{/if}

<style lang="scss">
  .related-topics-field {
    position: relative;
    display: flex;
    gap: 0.25em;

    :global(.text-input) {
      flex: 1;
    }

    :global(.mdc-text-field) {
      display: flex;
    }
  }
</style>
