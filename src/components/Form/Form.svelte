<script lang="ts">
  /* eslint-disable svelte/no-at-html-tags */
  import { parse } from "marked";
  import type { FormConfig } from "../../lib/models/form";
  import FormItem from "./FormItem.svelte";

  export type FormProps = {
    metadata?: unknown;
    config: FormConfig;
  }

  let helpMarkdown = $state<string | undefined>();
  let activeHelpKey = $state<string | undefined>();

  let {
    // metadata = undefined,
    config
  }: FormProps = $props();

  const onHelpClick = (key: string, help: string) => {
    if (activeHelpKey === key) {
      helpMarkdown = undefined;
      activeHelpKey = undefined;
    } else {
      helpMarkdown = help;
      activeHelpKey = key;
    }
  };

</script>

<div class="metadata-form">
  <div></div>
  <form>
    {#each config.formItems as itemConfig}
      <FormItem
        onHelpClick={onHelpClick}
        config={itemConfig}
        helpActive={activeHelpKey === itemConfig.key}
      />
    {/each}
  </form>
  <div class="help-section">
    {#if helpMarkdown}
      {#await parse(helpMarkdown)}
        <p>Loading...</p>
      {:then parsed}
        {@html parsed}
      {:catch error}
        <p>Error: {error.message}</p>
      {/await}
    {/if}
  </div>
</div>

<style lang="scss">
  .metadata-form {
    align-self: stretch;
    display: flex;

    > * {
      flex: 1;
    }

    form {
      display: flex;
      flex-direction: column;
    }

    .help-section {
      padding: 0 3rem;
    }
  }

</style>
