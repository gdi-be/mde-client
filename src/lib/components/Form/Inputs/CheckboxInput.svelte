<script lang="ts">
  import type { Option } from '$lib/models/form';
  import FormField from '@smui/form-field';
  import Checkbox from '@smui/checkbox';

  type InputProps = {
    onChange?: (value: string[] | undefined) => void;
    key: string;
    label: string;
    value?: string[];
    options: Option[];
  };

  let {
    onChange,
    value = $bindable<string[] | undefined>([]),
    key,
    label,
    options
  }: InputProps = $props();

  const onSelect = () => {
    onChange?.(value);
  };
</script>

<div class="checkbox-input">
  <label class="checkbox-group-label" for={`${key}-checkbox-group`}>
    {label}
  </label>
  <div id={`${key}-checkbox-group`} class="checkbox-group">
    {#each options as option}
      <FormField>
        <Checkbox id={option.key} onchange={onSelect} bind:group={value} value={option.key} />
        {#snippet label()}
          <label for={option.key}>{option.label}</label>
        {/snippet}
      </FormField>
    {/each}
  </div>
</div>

<style lang="scss">
  .checkbox-input {
    display: flex;
    flex-direction: column;
    gap: 0.5em;

    .checkbox-group-label {
      color: rgba(0, 0, 0, 0.6);
      font-family: 'Roboto', sans-serif;
      font-size: 0.75em;
    }

    .checkbox-group {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5em;
    }
  }
</style>
