<script lang="ts">
  import { Set } from '@smui/chips';
  import FormField from '@smui/form-field';
  import { getAvailableStatuses } from '$lib/context/StatusesContext.svelte';
  import StatusChip from '../StatusChip.svelte';
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import { getAccessToken } from '$lib/context/TokenContext.svelte';

  const token = $derived(getAccessToken());
  const availableStatuses = $derived(token ? getAvailableStatuses(token) : []);
  let selected = $state(page.url.searchParams.get('statusfilter')?.split(',') || []);

  let onSMUIChipInteraction = () => {
    const url = new URL(page.url);
    if (selected.length > 0) {
      url.searchParams.set('statusfilter', selected.join(','));
    } else {
      url.searchParams.delete('statusfilter');
    }
    goto(url, {
      keepFocus: true
    });
  };
</script>

<div class="status-filter-field">
  <FormField align="end">
    <Set
      class="status-chipset"
      chips={availableStatuses.map((status) => status.key)}
      filter
      {onSMUIChipInteraction}
      bind:selected
    >
      {#snippet chip(chip)}
        <StatusChip {chip} hasAction colored={selected.includes(chip)} />
      {/snippet}
    </Set>
    {#snippet label()}
      <div class="label">Statusfilter:</div>
    {/snippet}
  </FormField>
</div>

<style lang="scss">
  .status-filter-field {
    .label {
      display: flex;
      align-items: center;
    }
  }
</style>
