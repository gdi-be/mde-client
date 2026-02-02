<script lang="ts">
  import TextInput from '$lib/components/Form/Inputs/TextInput.svelte';
  import type { Service } from '$lib/models/metadata';
  import { getHighestRole } from '$lib/util';
  import FieldTools from '$lib/components/Form/FieldTools.svelte';
  import { getFieldConfig } from '$lib/context/FormContext.svelte';
  import { getAccessToken } from '$lib/context/TokenContext.svelte';
  import { page } from '$app/state';
  const t = $derived(page.data.t);

  export type ComponentProps = {
    value?: Service['workspace'];
    service: Service;
    onChange: (newValue: string) => Promise<Response>;
  };

  let { value, service, onChange }: ComponentProps = $props();

  const HELP_KEY = 'isoMetadata.services.workspace';
  const fieldConfig = getFieldConfig(45);
  let hasDuplicatedValue = $state<boolean>(false);
  const validationResult = $derived.by(() => {
    if (hasDuplicatedValue) {
      return {
        valid: false,
        helpText: 'Der angegebene Identifikator ist bereits vergeben.'
      };
    }
    return fieldConfig?.validator(value, {
      ['PARENT_VALUE']: service
    });
  });
  let showCheckmark = $state(false);

  const token = $derived(getAccessToken());
  const highestRole = $derived(getHighestRole(token));
  const fieldVisible = $derived(['MdeEditor', 'MdeAdministrator'].includes(highestRole));
</script>

{#if fieldVisible}
  <div class="service-id-field">
    <TextInput
      label={t('45_ServiceWorkspace.label')}
      {value}
      {fieldConfig}
      {validationResult}
      onchange={async (e: Event) => {
        hasDuplicatedValue = false;
        const response = await onChange((e.target as HTMLInputElement).value);
        if (response.ok) {
          showCheckmark = true;
        } else if (response.status === 409) {
          hasDuplicatedValue = true;
        }
      }}
    />
    <FieldTools {value} key={HELP_KEY} bind:checkMarkAnmiationRunning={showCheckmark} />
  </div>
{/if}

<style lang="scss">
  .service-id-field {
    position: relative;
    display: flex;
    gap: 0.25em;

    :global(.text-input) {
      flex: 1;
    }
  }
</style>
