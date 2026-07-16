<script lang="ts">
  import TextInput from '$lib/components/Form/Inputs/TextInput.svelte';
  import type { Service } from '$lib/models/metadata';
  import { MetadataService } from '$lib/services/MetadataService';
  import { getFormContext } from '$lib/context/FormContext.svelte';
  import { getHighestRole } from '$lib/util';
  import FieldTools from '$lib/components/Form/FieldTools.svelte';
  import { getAccessToken } from '$lib/context/TokenContext.svelte';
  import { page } from '$app/state';
  const t = $derived(page.data.t);

  export type ComponentProps = {
    value?: Service['workspace'];
    service: Service;
    onChange: (newValue: string, persist?: boolean) => Promise<Response>;
  };

  let { value, service, onChange }: ComponentProps = $props();
  let localValue = $derived(value || '');

  const token = $derived(getAccessToken());
  const highestRole = $derived(getHighestRole(token));
  const { getValue } = getFormContext();

  const HELP_KEY = 'isoMetadata.services.workspace';
  const fieldConfig = MetadataService.getFieldConfig(45);
  const isDuplicateServiceId = (nextValue: string) => {
    const allServices = getValue<Service[]>('isoMetadata.services') || [];
    return allServices.some(
      (entry) =>
        entry.id !== service.id &&
        entry.workspace === nextValue &&
        entry.serviceType === service.serviceType
    );
  };
  let hasDuplicatedValue = $derived(isDuplicateServiceId(localValue));
  const isInvalidWorkspace = (nextValue: string) => {
    const nextValidation = fieldConfig?.validator(nextValue, {
      ['PARENT_VALUE']: service,
      ['HIGHEST_ROLE']: highestRole
    });
    return hasDuplicatedValue || nextValidation?.valid === false;
  };
  const validationResult = $derived.by(() => {
    if (hasDuplicatedValue) {
      return {
        valid: false,
        helpText: 'Der angegebene Identifikator ist bereits vergeben.'
      };
    }
    return fieldConfig?.validator(localValue, {
      ['PARENT_VALUE']: service,
      ['HIGHEST_ROLE']: highestRole
    });
  });
  let showCheckmark = $state(false);
  const fieldVisible = $derived(['MdeEditor', 'MdeAdministrator'].includes(highestRole));
</script>

{#if fieldVisible}
  <div class="service-id-field">
    <TextInput
      label={t('45_ServiceWorkspace.label')}
      value={localValue}
      {fieldConfig}
      {validationResult}
      onchange={(e: Event) => {
        const newValue = (e.target as HTMLInputElement).value;
        localValue = newValue;
        hasDuplicatedValue = isDuplicateServiceId(newValue);
        void onChange(newValue, false);
      }}
      onblur={async (e: Event) => {
        const newValue = (e.target as HTMLInputElement).value;
        hasDuplicatedValue = isDuplicateServiceId(newValue);
        if (isInvalidWorkspace(newValue)) return;

        const response = await onChange(newValue);
        if (response.ok) {
          showCheckmark = true;
        } else if (response.status === 409) {
          hasDuplicatedValue = true;
          void onChange(value || '', false);
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
