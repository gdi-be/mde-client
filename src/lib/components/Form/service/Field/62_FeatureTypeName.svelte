<script lang="ts">
  import TextInput from '$lib/components/Form/Inputs/TextInput.svelte';
  import type { FeatureType } from '$lib/models/metadata';
  import { MetadataService } from '$lib/services/MetadataService';
  import { getHighestRole } from '$lib/util';
  import FieldTools from '$lib/components/Form/FieldTools.svelte';
  import { getAccessToken } from '$lib/context/TokenContext.svelte';
  import { page } from '$app/state';
  import { ValidationService } from '$lib/services/ValidationService';
  import { getContext } from 'svelte';
  import { FORMSTATE_CONTEXT, type FormState } from '$lib/context/FormContext.svelte';
  const t = $derived(page.data.t);

  export type ComponentProps = {
    value?: FeatureType['name'];
    featureType: FeatureType;
    onChange: (newValue: string) => Promise<Response>;
  };

  let { value, featureType, onChange }: ComponentProps = $props();
  const token = $derived(getAccessToken());
  const highestRole = $derived(getHighestRole(token));

  const HELP_KEY = 'isoMetadata.services.featureTypes.name';
  const fieldConfig = MetadataService.getFieldConfig(62);
  const formState = getContext<FormState>(FORMSTATE_CONTEXT);
  const metadata = $derived(formState.metadata);
  const validationResult = $derived(
    ValidationService.validateField(fieldConfig, value, {
      HIGHEST_ROLE: highestRole,
      PARENT_VALUE: featureType,
      metadata
    })
  );
  let showCheckmark = $state(false);
  const fieldVisible = $derived(['MdeEditor', 'MdeAdministrator'].includes(highestRole));
</script>

{#if fieldVisible}
  <div class="featuretype-name-field">
    <TextInput
      label={t('62_FeatureTypeName.label')}
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
    <FieldTools {value} key={HELP_KEY} bind:checkMarkAnmiationRunning={showCheckmark} />
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
