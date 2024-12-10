<script lang="ts">
  import ChipInput from '@smui-extra/chip-input';
  import type { Option, TagsInputConfig } from '$lib/models/form';
  import FormItemGroup from '../FormItemGroup.svelte';

  type InputProps = {
    config: TagsInputConfig;
    value?: Option[];
  }
  let {
    config,
    value
  }: InputProps = $props();

  const {
    key,
    options = [{
      value: "peter",
      label: "peter"
    }],
    label: fieldLabel,
    optionLabelField = 'label',
    optionValueField = 'value'
  } = config;

  let chips = $state<Option[]>(value || []);
  let textValue = $state('');

  let autocompleteOptions = $derived(
    options
      .filter((option) => !chips.find((chip) => chip[optionValueField] === option[optionValueField]))
      .map((option) => option[optionLabelField])
  )

  function handleChipInputEntry(event: CustomEvent<{ text: string }>) {
    // This prevents the text itself from being pushed onto the array.
    event.preventDefault();
    chips = [...chips, {
      value: event.detail.text,
      label: event.detail.text,
    }];
    textValue = '';
  }

  async function handleChipInputSelect(event: CustomEvent<string>) {
    // This prevents the text itself from being pushed onto the array.
    event.preventDefault();
    chips = [...chips, {
      value: event.detail,
      label: event.detail,
    }];
    textValue = '';
  }

</script>

<div class="tags-input">
  <ChipInput
    chips={chips}
    bind:value={textValue}
    key={(option: Option) => option[optionValueField]}
    getChipLabel={(option: Option) => option[optionLabelField]}
    getChipText={(option: Option) => option[optionLabelField]}
    chipTrailingAction$class="material-icons"
    chipTrailingAction$aria-label="Remove category"
    autocomplete$combobox
    autocomplete$options={autocompleteOptions}
    autocomplete$showMenuWithNoInput
    onSMUIChipInputEntry={handleChipInputEntry}
    onSMUIChipInputSelect={handleChipInputSelect}
  >
    {#snippet chipTrailingAction()}delete{/snippet}
    {#snippet label()}
      {fieldLabel}
    {/snippet}
  </ChipInput>
</div>

<style lang="scss">
  .tags-input {
    :global(.smui-chip-input ) {
      gap: 0;
      :global(.mdc-chip:last-of-type) {
        margin-right: 8px;
      }
    }
  }
</style>
