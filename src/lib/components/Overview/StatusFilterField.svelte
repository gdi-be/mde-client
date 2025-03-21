<script lang="ts">
  import { Set } from "@smui/chips";
  import { getContext } from "svelte";
  import type { Token } from "$lib/models/keycloak";
  import FormField from "@smui/form-field";
  import { Icon } from "@smui/button";
  import { getAvailableStatuses, getStatusesState } from "$lib/context/StatusesContest.svelte";
  import StatusChip from "../StatusChip.svelte";

  const token = getContext<Token>('user_token');

  // TODO: instead of binding to context the selecte statuses should be peristed in the URL (searchParams)
  let statusesState = $derived(getStatusesState().state);

  const availableStatuses = $derived(getAvailableStatuses(token));
</script>

<div class="status-filter-field">
  <FormField align="end">
    <Set
      class="status-chipset"
      chips={availableStatuses.map(status => status.key)}
      filter
      bind:selected={statusesState.selectedStatuses}
    >
      {#snippet chip(chip)}
        <StatusChip
          chip={chip}
          colored={statusesState.selectedStatuses.includes(chip)}
        />
      {/snippet}
    </Set>
    {#snippet label()}
      <div
        class="label"
        title="Erlaubt die Filterung der Metadaten nach ihrem Status. Klicken Sie auf einen Status, um die Metadaten nach diesem Status zu filtern."
      >
        Statusfilter
        <Icon class="material-icons">help</Icon>
      </div>
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
