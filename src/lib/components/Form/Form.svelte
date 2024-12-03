<script lang="ts">
  /* eslint-disable svelte/no-at-html-tags */
  import { parse } from "marked";
  import type { FormConfig } from "$lib/models/form";
  import FormItem from "./FormItem.svelte";
  import { goto } from "$app/navigation";

  export type FormProps = {
    metadata?: unknown;
    config: FormConfig;
    activeSection?: string;
  }

  let {
    // metadata = undefined,
    config,
    activeSection
  }: FormProps = $props();

  if (!activeSection) {
    activeSection = config.sections[0];
  }
  let helpMarkdown = $state<string | undefined>();
  let activeHelpKey = $state<string | undefined>();

  const onHelpClick = (key: string, help: string) => {
    if (activeHelpKey === key) {
      helpMarkdown = undefined;
      activeHelpKey = undefined;
    } else {
      helpMarkdown = help;
      activeHelpKey = key;
    }
  };

  const onSectionClick = (section: string) => {
    activeSection = section;
    goto(`#${section}`, {
      replaceState: true
    });
  };

</script>

<div class="metadata-form">
  <div></div>
  <div>
    <nav class="tabs">
      {#each config.sections as section}
        <button
          class="section-button"
          class:active={section === activeSection}
          onclick={() => onSectionClick(section)}
        >
          {section}
        </button>
      {/each}
    </nav>
    <form>
      {#each config.formItems as itemConfig}
        <FormItem
          hidden={itemConfig.section !== activeSection}
          onHelpClick={onHelpClick}
          config={itemConfig}
          helpActive={activeHelpKey === itemConfig.key}
        />
      {/each}
    </form>
  </div>
  <div>
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
</div>

<style lang="scss">
  .metadata-form {
    align-self: stretch;
    display: flex;

    > * {
      flex: 1;
    }

    .tabs {
      display: flex;
      padding-bottom: 0.25rem;

      button {
        cursor: pointer;
        flex: 1;
        background-color: transparent;
        border: none;

        &.active {
          border-bottom: 2px solid red;
        }
      }
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
