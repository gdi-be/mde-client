<script lang="ts">
  import { Set } from '@smui/chips';
  import FormField from '@smui/form-field';
  import { getAvailableStatuses } from '$lib/context/StatusesContext.svelte';
  import StatusChip from '../StatusChip.svelte';
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import { getAccessToken } from '$lib/context/TokenContext.svelte';

  const t = $derived(page.data.t);
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
    url.searchParams.set('page', '1');
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
      {#snippet chip(chip: string)}
        <StatusChip {chip} hasAction colored={selected.includes(chip)} />
      {/snippet}
    </Set>
    {#snippet label()}
      <div class="label">{t('statusfilterfield.statusFilter')}</div>
    {/snippet}
  </FormField>
</div>

<style lang="scss">
  .status-filter-field {
    .label {
      display: flex;
      align-items: center;
    }

    :global(.status-chipset) {
      max-height: 88px;
      overflow-x: auto;
    }

    @media (max-width: 1024px) {
      :global(label) {
        display: none;
      }
    }
  }
</style>
