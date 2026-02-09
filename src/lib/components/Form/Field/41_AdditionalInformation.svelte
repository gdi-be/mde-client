<script lang="ts">
  import IconButton from '@smui/icon-button';
  import { getFieldConfig, getFormContext, persistValue } from '$lib/context/FormContext.svelte';
  import TextInput from '$lib/components/Form/Inputs/TextInput.svelte';
  import FieldTools from '$lib/components/Form/FieldTools.svelte';
  import { getPopconfirm } from '$lib/context/PopConfirmContext.svelte';
  import type { CI_OnLineFunctionCode, ContentDescription } from '$lib/models/metadata';
  import FieldHint from '$lib/components/Form/FieldHint.svelte';
  import SelectInput from '../Inputs/SelectInput.svelte';
  import { page } from '$app/state';
  import { getAccessToken } from '$lib/context/TokenContext.svelte';
  import { getHighestRole } from '$lib/util';

  const t = $derived(page.data.t);

  const token = $derived(getAccessToken());
  const highestRole = $derived(getHighestRole(token));

  const KEY = 'isoMetadata.contentDescriptions';

  const { getValue } = getFormContext();
  const valueFromData = $derived(getValue<ContentDescription[]>(KEY));
  let contentDescriptions = $state<ContentDescription[]>([]);
  let isEditing = $state<boolean>(false);

  const popconfirm = $derived(getPopconfirm());

  // important that this is not a state
  let previousValueAsString: string;

  $effect(() => {
    // this check prevents rerendering if nothing has actually changed
    const newValueAsString = JSON.stringify(valueFromData);
    if (
      previousValueAsString === newValueAsString ||
      !valueFromData ||
      valueFromData.length === 0
    ) {
      return;
    }
    contentDescriptions = valueFromData?.map((contentDescription: ContentDescription) => {
      const { url, description, code, id } = contentDescription;
      return {
        id,
        code,
        description,
        url
      };
    });
    previousValueAsString = JSON.stringify(valueFromData);
  });

  let showCheckmark = $state(false);
  const fieldConfig = getFieldConfig<ContentDescription[]>(41);
  const descriptionFieldConfig = getFieldConfig<string>(42);
  const codeFieldConfig = getFieldConfig<string>(43);
  const urlFieldConfig = getFieldConfig<string>(44);

  const onBlur = async (evt: FocusEvent) => {
    await persistContentDescriptions(evt);
    isEditing = false;
  };

  const onFocus = () => {
    isEditing = true;
  };

  const persistContentDescriptions = async (evt?: FocusEvent) => {
    // Due to the SvelteKit lifecycle the blur effect gets trigger twice
    // this leads to a loss of focus on the input field. This need to be fixed.
    const focusedElement = evt?.relatedTarget as HTMLElement | null;
    const response = await persistValue(KEY, contentDescriptions);
    if (response.ok) {
      showCheckmark = true;
    }

    if (!focusedElement) return;
    setTimeout(() => {
      const elementToFocus = document.getElementById(focusedElement.id);
      elementToFocus?.focus();
      isEditing = true;
    }, 10);
  };

  const addItem = (evt: MouseEvent) => {
    evt.preventDefault();
    const id = crypto.randomUUID();
    contentDescriptions = [
      {
        id,
        code: 'information',
        description: '',
        url: ''
      },
      ...contentDescriptions
    ];
    persistContentDescriptions();
  };

  const removeItem = (id: string, evt: MouseEvent) => {
    const targetEl = evt.currentTarget as HTMLElement;
    evt.preventDefault();
    popconfirm.open(
      targetEl,
      async () => {
        contentDescriptions = contentDescriptions.filter(
          (contentDescription) => contentDescription.id !== id
        );
        persistContentDescriptions();
      },
      {
        text: t('41_AdditionalInformation.delete_confirm'),
        confirmButtonText: t('41_AdditionalInformation.delete_button')
      }
    );
  };

  let hasInvalidFields = $derived.by(() => {
    if (!fieldConfig) return false;
    const { editingRoles } = fieldConfig;
    const isEditingRole =
      highestRole === 'MdeAdministrator' ||
      (editingRoles ? editingRoles?.includes(highestRole) : true);
    const hasInvalidFields = contentDescriptions.some((contentDescription) => {
      const descriptionValid =
        descriptionFieldConfig?.validator(contentDescription.description).valid ?? true;
      const urlValid = urlFieldConfig?.validator(contentDescription.url).valid ?? true;
      const codeValid = codeFieldConfig?.validator(contentDescription.code).valid ?? true;
      return !descriptionValid || !urlValid || !codeValid;
    });
    return isEditingRole && hasInvalidFields;
  });
</script>

<div class="contentDescriptions-field">
  <fieldset class={[hasInvalidFields ? 'invalid' : '']}>
    <legend>
      {t('41_AdditionalInformation.label')}
      <IconButton
        class="material-icons"
        disabled={isEditing}
        onclick={(evt) => addItem(evt)}
        size="button"
        title={t('41_AdditionalInformation.add')}
        type="button"
      >
        add
      </IconButton>
    </legend>
    <FieldHint {fieldConfig} explanation={t('41_AdditionalInformation.explanation')} />
    {#each contentDescriptions as contentDescription, index (contentDescription.id)}
      <fieldset class="contentDescription">
        <legend>
          <IconButton
            class="material-icons"
            disabled={isEditing}
            onclick={(evt) => removeItem(contentDescription.id, evt)}
            size="button"
            type="button"
            title={t('41_AdditionalInformation.remove')}
          >
            delete
          </IconButton>
        </legend>
        <div class="subfield-wrapper">
          <TextInput
            bind:value={contentDescription.description}
            label={t('41_AdditionalInformation.description')}
            onblur={onBlur}
            onfocus={onFocus}
            fieldConfig={descriptionFieldConfig}
            validationResult={descriptionFieldConfig?.validator(contentDescription.description)}
            id={`${KEY}-${index}-description`}
          />
          <FieldTools
            noCloneButton
            key={`${KEY}[${index}].description`}
            fieldConfig={descriptionFieldConfig}
          />
        </div>
        <div class="inline-fields">
          <div class="subfield-wrapper code-select-field">
            <SelectInput
              value={contentDescription.code}
              onChange={(code) => {
                contentDescription.code = code as CI_OnLineFunctionCode;
                persistContentDescriptions();
              }}
              label={t('43_AdditionalInformationCode.label')}
              fieldConfig={codeFieldConfig}
              validationResult={codeFieldConfig?.validator(contentDescription.code)}
              options={[
                { label: t('43_AdditionalInformationCode.download'), key: 'download' },
                { label: t('43_AdditionalInformationCode.information'), key: 'information' },
                { label: t('43_AdditionalInformationCode.offlineAccess'), key: 'offlineAccess' },
                { label: t('43_AdditionalInformationCode.order'), key: 'order' },
                { label: t('43_AdditionalInformationCode.search'), key: 'search' }
              ]}
              id={`${KEY}-${index}-code`}
            />
            <FieldTools noCloneButton key={`${KEY}[${index}].code`} fieldConfig={codeFieldConfig} />
          </div>
          <div class="subfield-wrapper url-field">
            <TextInput
              bind:value={contentDescription.url}
              label={t('44_AdditionalInformationUrl.label')}
              onblur={onBlur}
              onfocus={onFocus}
              fieldConfig={urlFieldConfig}
              validationResult={urlFieldConfig?.validator(contentDescription.url)}
              id={`${KEY}-${index}-url`}
            />
            <FieldTools noCloneButton key={`${KEY}[${index}].url`} fieldConfig={urlFieldConfig} />
          </div>
        </div>
      </fieldset>
    {/each}
  </fieldset>
  <FieldTools noCopyButton key={KEY} bind:checkMarkAnmiationRunning={showCheckmark} />
</div>

<style lang="scss">
  .contentDescriptions-field {
    position: relative;
    display: flex;
    gap: 0.25em;

    fieldset {
      flex: 1;
      border-radius: 0.25em;

      &.invalid {
        border: 2px solid var(--mdc-theme-error) !important;
      }

      > legend {
        display: flex;
        align-items: center;
        font-size: 1.5em;
      }
    }

    .contentDescription {
      display: flex;
      flex-direction: column;
      gap: 1em;

      .subfield-wrapper {
        display: flex;

        :global(.text-input) {
          flex: 1;
        }
      }

      legend {
        text-align: right;
      }

      :global(.text-input),
      :global(.select-input) {
        border: none;
        background-color: rgba(244, 244, 244, 0.7);
      }

      :global(.text-input > legend),
      :global(.select-input > legend) {
        font-size: 1.2em;
        background-color: white;
        border-radius: 0.25em;
        padding: 0 0.25em;
      }

      :global(.mdc-select) {
        background-color: white;
      }
    }

    .inline-fields {
      display: flex;
      flex-wrap: wrap;
      gap: 1em;

      :global(.code-select-field) {
        flex: 1;

        :global(.select-input) {
          flex: 1;
        }
      }

      :global(.url-field) {
        flex: 3;
      }
    }

    :global(.mdc-text-field) {
      display: flex;
    }
  }
</style>
