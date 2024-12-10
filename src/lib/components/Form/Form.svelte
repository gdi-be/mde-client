<script lang="ts">
  /* eslint-disable svelte/no-at-html-tags */
  import { parse } from "marked";
  import type { FormConfig } from "$lib/models/form";
  import FormItem from "./FormItem.svelte";
  import { goto } from "$app/navigation";
  import { onMount, tick } from "svelte";
  import { isVisible } from "../../util/Form";

  export type FormProps = {
    metadata?: unknown;
    config: FormConfig;
    activeSection?: string;
  }

  let {
    config,
    activeSection
  }: FormProps = $props();

  if (!activeSection) {
    activeSection = config.sections[0];
  }

  let formValues = $state<Record<string, unknown>>({});

  let tabs = $state<HTMLElement | null>(null);
  let helpMarkdown = $state<string | undefined>();
  let activeHelpKey = $state<string | undefined>();
  let borderStyles = $state<{ width: string; left: string }>({
    width: "0",
    left: "0"
  });

  const updateBorder = () => {
    if (!tabs) return;
    const buttonEl = tabs.querySelector(`button.section-button.active`);

    if (activeSection && buttonEl) {
      const { left: tabsLeft } = tabs.getBoundingClientRect();
      const { left: buttonLeft, width: buttonWidth } = buttonEl.getBoundingClientRect();
      borderStyles = {
        width: `${buttonWidth}px`,
        left: `${buttonLeft - tabsLeft}px`
      };
    }
  };

  const onHelpClick = (key: string | undefined, help: string) => {
    if (activeHelpKey === key) {
      helpMarkdown = undefined;
      activeHelpKey = undefined;
    } else {
      helpMarkdown = help;
      activeHelpKey = key;
    }
  };

  const onSectionClick = async (section: string) => {
    activeSection = section;
    activeHelpKey = undefined;
    helpMarkdown = undefined;
    goto(`#${section}`, {
      replaceState: true
    });
    await tick();
    updateBorder();
  };

  const onFormValueChange = (key: string, value: unknown) => {
    if (formValues[key] === value) return
    formValues = {
      ...formValues,
      [key]: value
    }
  };

  onMount(() => {
    updateBorder();
  });

  const filteredItems = $derived(
    config.formItems.filter(itemConfig => isVisible(formValues, itemConfig.visibilityCondition))
  );

</script>

<div class="metadata-form">
  <div>
    <!-- placeholder for flex layout-->
  </div>
  <div>
    <nav class="tabs" bind:this={tabs}>
      {#each config.sections as section}
        <button
          class="section-button"
          class:active={section === activeSection}
          onclick={() => onSectionClick(section)}
        >
          {section}
        </button>
        {/each}
      <div
        class="active-border"
        style="
          --border-width: {borderStyles.width};
          --border-left: {borderStyles.left};
        ">
      </div>
    </nav>
    <form>
      {#each filteredItems as itemConfig (itemConfig.key)}
        <FormItem
          hidden={itemConfig.section !== activeSection}
          onChange={onFormValueChange}
          onHelpClick={onHelpClick}
          config={itemConfig}
          helpActive={activeHelpKey === itemConfig.key}
        />
      {/each}
    </form>
  </div>
  <div>
    <!-- TODO: i18n -->
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

    nav.tabs {
      position: relative;
      display: flex;
      padding-bottom: 0.25rem;

      button.section-button {
        cursor: pointer;
        flex: 1;
        background-color: transparent;
        border: none;
        font-size: 1.25em;
      }

      .active-border {
        position: absolute;
        bottom: 0;
        height: 3px;
        background: linear-gradient(to right, transparent, var(--mdc-theme-primary) 5% 95%, transparent);
        transition: width 0.3s ease, left 0.3s ease;
        width: var(--border-width, 0px);
        left: var(--border-left, 0px);
      }
    }

    form {
      display: flex;
      flex-direction: column;
      padding-top: 0.25rem;
    }

    .help-section {
      padding: 0 3rem;
    }
  }

</style>
