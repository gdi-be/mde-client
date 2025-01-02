<script lang="ts">
  /* eslint-disable svelte/no-at-html-tags */
  import { parse } from "marked";
  import { goto } from "$app/navigation";
  import { onMount, tick } from "svelte";
  import TitleField from "./Field/TitleField_01.svelte";
  import { setFormData, initializeFormContext } from "./FormContext.svelte";
  type FormProps = {
    metadata?: Record<string, unknown>;
    activeSection?: string;
  }

  let {
    activeSection,
    metadata
  }: FormProps = $props();

  initializeFormContext();

  if (metadata) {
    setFormData(metadata);
  }

  let tabs = $state<HTMLElement | null>(null);
  let helpMarkdown= $state<string | undefined>();
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

  onMount(() => {
    updateBorder();
  });

</script>

<div class="metadata-form">
  <div>
    <!-- placeholder for flex layout-->
  </div>
  <div>
    <nav class="tabs" bind:this={tabs}>
      <button
        class="section-button"
        class:active={activeSection === "basedata"}
        onclick={() => onSectionClick("basedata")}
      >
        Basisangaben
      </button>
      <button
        class="section-button"
        class:active={activeSection === "classification"}
        onclick={() => onSectionClick("classification")}
      >
        Einordnung
      </button>
      <button
        class="section-button"
        class:active={activeSection === "temp_and_spatial"}
        onclick={() => onSectionClick("temp_and_spatial")}
      >
        Zeitliche und Räumliche Angaben
      </button>
      <button
        class="section-button"
        class:active={activeSection === "additional"}
        onclick={() => onSectionClick("additional")}
      >
        Weitere Angaben
      </button>
      <button
        class="section-button"
        class:active={activeSection === "display_services"}
        onclick={() => onSectionClick("display_services")}
      >
        Darstellungsdienste
      </button>
      <button
        class="section-button"
        class:active={activeSection === "download_services"}
        onclick={() => onSectionClick("download_services")}
      >
        Downloaddienste
      </button>
      <div
        class="active-border"
        style="
          --border-width: {borderStyles.width};
          --border-left: {borderStyles.left};
        ">
      </div>
    </nav>
    <form>
      <section
        class:active={activeSection === "basedata"}
        id="basedata"
      >
        <TitleField />
      </section>
      <section
        class:active={activeSection === "classification"}
        id="classification"
      >
      </section>
      <section
        class:active={activeSection === "temp_and_spatial"}
        id="temp_and_spatial"
      >
      </section>
      <section
        class:active={activeSection === "additional"}
        id="additional"
      >
      </section>
      <section
        class:active={activeSection === "display_services"}
        id="display_services"
      >
      </section>
      <section
        class:active={activeSection === "download_services"}
        id="download_services"
      >
      </section>
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

      section {
        display: flex;
        flex-direction: column;
        padding-top: 0.25rem;

        &:not(.active) {
          display: none;
        }
      }
    }

    .help-section {
      padding: 0 3rem;
    }
  }

</style>
