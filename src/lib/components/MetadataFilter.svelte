<script lang="ts">
  import FormField from "@smui/form-field";
  import Checkbox from "@smui/checkbox";
  import { getContext } from "svelte";
  import type { Token } from "$lib/models/keycloak";
  import type { Option } from "../models/form";
  import { getHighestRole, getRoleName } from "../util";
  import { Icon } from "@smui/button";
  import { page } from "$app/state";
  import { goto } from "$app/navigation";

  const currentUrl = $derived(page.url);
  const token = getContext<Token>('user_token');
  const highestRole = $derived(getHighestRole(token));
  let options: Option[] = $derived.by(() => {
    const tempOptions = [];
    tempOptions.push({
      key: 'assignedToRole',
      label: getRoleName(highestRole)
    })
    tempOptions.push({
      key: 'assignedToUser',
      label: 'Mir zugewiesen'
    })
    return tempOptions;
  });

  let selected = $state<string[]>([]);

  const updateUrlSearchParam = () => {
    const newUrl = new URL(currentUrl);
    const filter: string[] = [];

    if(selected.length === 0) {
      newUrl.searchParams.delete('filter');
      goto(newUrl);
    } else {
      if(selected.includes('assignedToRole')) {
        filter.push('responsibleRole=' + highestRole);
      }
      if(selected.includes('assignedToUser')) {
        filter.push('responsibleUserIds=' + token.sub);
      }
      newUrl.searchParams.set('filter', filter.join(';'));
      goto(newUrl);
    }
  };

</script>

<div class="metadata-filter">
  <Icon class="material-icons">filter_alt</Icon>
  <div class="checkboxes">
    {#each options as option}
      <FormField>
        <Checkbox
          bind:group={selected}
          value={option.key}
          onchange={() => updateUrlSearchParam()}
        />
        {#snippet label()}
          {option.label}
        {/snippet}
      </FormField>
    {/each}
  </div>
</div>

<style lang="scss">
  .metadata-filter {
    display: flex;
    align-items: center;
    background-color: #f8f9fa;

    :global(.material-icons) {
      font-size: 1.5em;
      margin-right: 0.5em;
    }

    .checkboxes {
      flex: 1;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-evenly;
    }
  }
</style>
