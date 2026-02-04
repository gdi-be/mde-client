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

  const t = $derived(page.data.t);

  type ContentDescriptionListEntry = ContentDescription & { listId: string };

  const KEY = 'isoMetadata.contentDescriptions';

  const { getValue } = getFormContext();
  const valueFromData = $derived(getValue<ContentDescription[]>(KEY));
  let contentDescriptions = $state<ContentDescriptionListEntry[]>([]);
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
      const { url, description, code } = contentDescription;
      const listId = crypto.randomUUID();
      return {
        listId,
        code,
        description,
        url
      };
    });
    previousValueAsString = JSON.stringify(valueFromData);
  });

  let showCheckmark = $state(false);
  const fieldConfig = getFieldConfig<ContentDescription[]>(41);
  const titleFieldConfig = getFieldConfig<string>(42);
  const codeFieldConfig = getFieldConfig<string>(43);
  const urlFieldConfig = getFieldConfig<string>(44);

  const onBlur = async () => {
    await persistContentDescriptions();
    isEditing = false;
  };

  const onFocus = () => {
    isEditing = true;
  };

  const persistContentDescriptions = async () => {
    const value = contentDescriptions.map((contentDescription) => ({
      description: contentDescription.description,
      url: contentDescription.url,
      code: contentDescription.code
    }));
    const response = await persistValue(KEY, value);
    if (response.ok) {
      showCheckmark = true;
    }
  };

  const addItem = (evt: MouseEvent) => {
    evt.preventDefault();
    const listId = crypto.randomUUID();
    contentDescriptions = [
      {
        listId,
        code: 'information',
        description: '',
        url: ''
      },
      ...contentDescriptions
    ];
    persistContentDescriptions();
  };

  const removeItem = (listId: string, evt: MouseEvent) => {
    const targetEl = evt.currentTarget as HTMLElement;
    evt.preventDefault();
    popconfirm.open(
      targetEl,
      async () => {
        contentDescriptions = contentDescriptions.filter(
          (contentDescription) => contentDescription.listId !== listId
        );
        persistContentDescriptions();
      },
      {
        text: t('41_AdditionalInformation.delete_confirm'),
        confirmButtonText: t('41_AdditionalInformation.delete_button')
      }
    );
  };
</script>

<div class="contentDescriptions-field">
  <fieldset>
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
    {#each contentDescriptions as contentDescription, index (contentDescription.listId)}
      <fieldset class="contentDescription">
        <legend>
          <IconButton
            class="material-icons"
            disabled={isEditing}
            onclick={(evt) => removeItem(contentDescription.listId, evt)}
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
            label={t('42_AdditionalInformationTitle.label')}
            onblur={onBlur}
            onfocus={onFocus}
            fieldConfig={titleFieldConfig}
            validationResult={titleFieldConfig?.validator(contentDescription.description)}
          />
          <FieldTools key={`${KEY}[${index}].description`} fieldConfig={titleFieldConfig} />
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
            />
            <FieldTools key={`${KEY}[${index}].code`} fieldConfig={codeFieldConfig} />
          </div>
          <div class="subfield-wrapper url-field">
            <TextInput
              bind:value={contentDescription.url}
              label={t('44_AdditionalInformationUrl.label')}
              onblur={onBlur}
              onfocus={onFocus}
              fieldConfig={urlFieldConfig}
              validationResult={urlFieldConfig?.validator(contentDescription.url)}
            />
            <FieldTools key={`${KEY}[${index}].url`} fieldConfig={urlFieldConfig} />
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
