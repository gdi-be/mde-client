<script lang="ts">
  import AutoCompleteInput from "./Inputs/AutoCompleteInput.svelte";
  import BooleanInput from "./Inputs/BooleanInput.svelte";
  import DateInput from "./Inputs/DateInput.svelte";
  import NumberInput from "./Inputs/NumberInput.svelte";
  import SelectInput from "./Inputs/SelectInput.svelte";
  import TextAreaInput from "./Inputs/TextAreaInput.svelte";
  import TextInput from "./Inputs/TextInput.svelte";
  import { Icon } from "@smui/button";
  import type { FormItemConfig } from "$lib/models/form";
  import IconButton from "@smui/icon-button";

  type FormItemProps = {
    config: FormItemConfig;
    onHelpClick: (key: string, helpText: string) => void;
    helpActive?: boolean;
    hidden?: boolean;
  }

  let {
    config,
    onHelpClick,
    helpActive = false,
    hidden = false
  }: FormItemProps = $props();

</script>

<div class="form-item" class:hidden={hidden}>
  <div class="form-input" >
    {#if config.type ==='text'}
      <TextInput {config} />
    {/if}
    {#if config.type ==='integer'}
      <NumberInput {config} />
    {/if}
    {#if config.type ==='float'}
      <NumberInput {config} />
    {/if}
    {#if config.type ==='textarea'}
      <TextAreaInput {config} />
    {/if}
    {#if config.type ==='boolean'}
      <BooleanInput {config} />
    {/if}
    {#if config.type ==='date'}
      <DateInput {config} />
    {/if}
    {#if config.type ==='select'}
      <SelectInput {config} />
    {/if}
    {#if config.type ==='autocomplete'}
      <AutoCompleteInput {config} />
    {/if}
  </div>
  {#if config.help}
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
