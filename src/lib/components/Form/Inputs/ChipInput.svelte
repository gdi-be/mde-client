<script lang="ts">
  import SMUIChipInput from "@smui-extra/chip-input";
  import type { Option } from "$lib/models/form";
  import type { ComponentProps } from "svelte";

  type InputProps = {
    fieldLabel: string;
    search?: (input: string) => Promise<Option[] | false>;
    chips?: Option[];
    onChange: (value: Option[]) => void;
  } & Omit<ComponentProps<typeof SMUIChipInput>, 'value'>;

  let {
    chips = $bindable<Option[]>([]),
    fieldLabel,
    search,
    onChange,
    ...restProps
  }: InputProps = $props();

  // Remove duplicates
  chips = Array.from(new Map(chips.map(item => [item.key, item])).values());

  let value = $state('');

  function handleChipInputSelect(event: CustomEvent<Option>) {
    event.preventDefault();
    chips = [
      ...chips,
      event.detail
    ];
    onChange(chips);
  }

  function handleChipInputRemove(event: CustomEvent<{ chip: Option }>) {
    event.preventDefault();
    chips = chips.filter((chip) => chip.key !== event.detail.chip.key);
    onChange(chips);
  }

</script>

<SMUIChipInput
  {...restProps}
  bind:value
  bind:chips
  autocomplete$getOptionLabel={(option: Option) => option?.label as string || ''}
  autocomplete$search={search}
  autocomplete$selectOnExactMatch={false}
  key={(option: Option) => option?.key as string}
  getChipLabel={(option: Option) => option?.label as string || ''}
  getChipText={(option: Option) => option?.label as string || ''}
  chipTrailingAction$class="material-icons"
  chipTrailingAction$aria-label="Remove element"
  onSMUIChipInputSelect={handleChipInputSelect}
  onSMUIChipInputRemove={handleChipInputRemove}
>
  {#snippet chipTrailingAction()}cancel{/snippet}
  {#snippet label()}
    {fieldLabel}
  {/snippet}
</SMUIChipInput>
