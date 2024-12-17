<script lang="ts">
  import AutoCompleteInput from "./Inputs/AutoCompleteInput.svelte";
  import BooleanInput from "./Inputs/BooleanInput.svelte";
  import DateInput from "./Inputs/DateInput.svelte";
  import NumberInput from "./Inputs/NumberInput.svelte";
  import SelectInput from "./Inputs/SelectInput.svelte";
  import TextAreaInput from "./Inputs/TextAreaInput.svelte";
  import TextInput from "./Inputs/TextInput.svelte";
  import { Icon } from "@smui/button";
  import {
    isAutocompleteInputConfig,
    isBooleanInputConfig,
    isDateInputConfig,
    isFloatInputConfig,
    isFormItemConfig,
    isFormItemGroupConfig,
    isFormItemListConfig,
    isIntegerInputConfig,
    isSelectInputConfig,
    isTagsInputConfig,
    isTextAreaInputConfig,
    isTextInputConfig,
    type FormItemConfig,
    type FormStructureConfig,
  } from "$lib/models/form";
  import IconButton from "@smui/icon-button";
  import FormItemList from "./FormItemList.svelte";
  import FormItemGroup from "./FormItemGroup.svelte";
  import TagsInput from "./Inputs/TagsInput.svelte";
  import { page } from "$app/stores";

  type FormItemProps = {
    config: FormItemConfig | FormStructureConfig;
    onHelpClick?: (key: string | undefined, helpText: string) => void;
    helpActive?: boolean;
    hidden?: boolean;
    value?: unknown;
  }

  let {
    config,
    onHelpClick = () => {},
    helpActive = false,
    hidden = false,
    value
  }: FormItemProps = $props();

  const onChange = async (value: unknown) => {
    if (!config.metadataType) return;

    fetch($page.url, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        metadataType: config.metadataType,
        key: config.key,
        value
      })
    });
  };

</script>

<div class="form-item" class:hidden={hidden}>
  <div class="form-input" >
    {#if isTextInputConfig(config)}
      <TextInput {config} />
    {/if}
    {#if isIntegerInputConfig(config)}
      <NumberInput {config} />
    {/if}
    {#if isFloatInputConfig(config)}
      <NumberInput {config} />
    {/if}
    {#if isTextAreaInputConfig(config)}
      <TextAreaInput {config} />
    {/if}
    {#if isBooleanInputConfig(config)}
      <BooleanInput {config} />
    {/if}
    {#if isDateInputConfig(config)}
      <DateInput {config} />
    {/if}
    {#if isSelectInputConfig(config)}
      <SelectInput {config} {onChange} {value} />
    {/if}
    {#if isAutocompleteInputConfig(config)}
      <AutoCompleteInput {config} />
    {/if}
    {#if isTagsInputConfig(config)}
      <TagsInput {config} />
    {/if}
    {#if isFormItemListConfig(config)}
      <FormItemList {config} />
    {/if}
    {#if isFormItemGroupConfig(config)}
      <FormItemGroup {config} />
    {/if}
  </div>
  {#if isFormItemConfig(config) && config.help}
    <div class="help-icon" class:active={helpActive}>
      <IconButton
        toggle
        size="button"
        pressed={helpActive}
        onclick={() => onHelpClick(config.key, config.help!)}
      >
        <Icon class="material-icons" on>info</Icon>
        <Icon class="material-icons">info</Icon>
      </IconButton>
    </div>
  {/if}
</div>

<style lang="scss">
  .form-item {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 1em;
    border-radius: 5px;

    &.hidden {
      display: none;
    }

    &:nth-child(odd) {
      background-color: #f6f6f6;
    }

    .help-icon {
      color: grey;

      :global(button[aria-pressed="true"]) {
        color: green;
      }

    }
  }

</style>
