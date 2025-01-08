<script lang="ts">
  /* eslint-disable svelte/no-at-html-tags */
  import { parse } from "marked";
  import { goto } from "$app/navigation";
  import { onMount, tick } from "svelte";
  import TitleField_01 from "./Field/TitleField_01.svelte";
  import { setFormData, initializeFormContext, getFormContext, clearActiveHelp, setHelp, getHelpMarkdown } from "./FormContext.svelte";
  import DescriptionField_02 from "./Field/DescriptionField_02.svelte";
  import InternalCommentField_03 from "./Field/InternalCommentField_03.svelte";
  import KeywordsField_15 from "./Field/KeywordsField_15.svelte";
  import PreviewField_29 from "./Field/PreviewField_29.svelte";
  import ContactsField_19 from "./Field/ContactsField_19.svelte";
  import type { FormHelp } from "../../models/form";
  import Progress from "./Progress.svelte";
  import { getProgress } from "../../util/Form";
  import MetadataType_05 from "./Field/MetadataType_05.svelte";
  import DataProtectionField_04 from "./Field/DataProtectionField_04.svelte";

  type FormProps = {
    metadata?: Record<string, unknown>;
    activeSection?: string;
    help: FormHelp;
  }

  let {
    activeSection,
    metadata,
    help
  }: FormProps = $props();

  initializeFormContext();

  if (metadata) {
    setFormData(metadata);
  }

  if (help) {
    setHelp(help);
  }

  let baseDataProgress = $derived(getProgress("basedata", metadata));
  let classificationProgress = $derived(getProgress("classification", metadata));
  let tempAndSpatialProgress = $derived(getProgress("temp_and_spatial", metadata));
  let additionalProgress = $derived(getProgress("additional", metadata));
  let displayServicesProgress = $derived(getProgress("display_services", metadata));
  let downloadServicesProgress = $derived(getProgress("download_services", metadata));

  const activeHelpKey = $derived(getFormContext().activeHelpKey);
  const helpMarkdown = $derived(getHelpMarkdown(activeHelpKey));

  let tabs = $state<HTMLElement | null>(null);
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

  const onSectionClick = async (section: string) => {
    activeSection = section;
    clearActiveHelp();

    goto(`#${section}`, {
      replaceState: true
    });
    await tick();
    updateBorder();
  };

  onMount(() => {
    updateBorder();
  });

  $inspect(metadata);

</script>

<div class="metadata-form">
  <nav class="tabs" bind:this={tabs}>
    <button
      class="section-button"
      class:active={activeSection === "basedata"}
      onclick={() => onSectionClick("basedata")}
    >
      Basisangaben <Progress {...baseDataProgress} />
    </button>
    <button
      class="section-button"
      class:active={activeSection === "classification"}
      onclick={() => onSectionClick("classification")}
    >
      Einordnung <Progress {...classificationProgress} />
    </button>
    <button
      class="section-button"
      class:active={activeSection === "temp_and_spatial"}
      onclick={() => onSectionClick("temp_and_spatial")}
    >
      Zeitliche und Räumliche Angaben <Progress {...tempAndSpatialProgress} />
    </button>
    <button
      class="section-button"
      class:active={activeSection === "additional"}
      onclick={() => onSectionClick("additional")}
    >
      Weitere Angaben <Progress {...additionalProgress} />
    </button>
    <button
      class="section-button"
      class:active={activeSection === "display_services"}
      onclick={() => onSectionClick("display_services")}
    >
      Darstellungsdienste <Progress {...displayServicesProgress} />
    </button>
    <button
      class="section-button"
      class:active={activeSection === "download_services"}
      onclick={() => onSectionClick("download_services")}
    >
      Downloaddienste <Progress {...downloadServicesProgress} />
    </button>
    <div
      class="active-border"
      style="
        --border-width: {borderStyles.width};
        --border-left: {borderStyles.left};
      ">
    </div>
  </nav>
  <div class="form-wrapper">
    <div>
      <!-- placeholder for flex layout-->
    </div>
    <div>
      <form>
        <section
          class:active={activeSection === "basedata"}
          id="basedata"
        >
          <TitleField_01 />
          <DescriptionField_02 />
          <InternalCommentField_03 />
          <KeywordsField_15 />
          <PreviewField_29 />
          <ContactsField_19 />
        </section>
        <section
          class:active={activeSection === "classification"}
          id="classification"
        >
          <DataProtectionField_04 />
          <MetadataType_05 />
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
</div>

<style lang="scss">
  .metadata-form {
    flex: 1;
    width: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-self: stretch;

    nav.tabs {
      position: relative;
      display: flex;
      padding-bottom: 0.25rem;

      button.section-button {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 0.25em;
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

    .form-wrapper {
      display: flex;
      overflow: auto;
      flex: 1;
      padding: 1em 0;

      > * {
        flex: 1;
      }

      form {
        display: flex;
        flex-direction: column;
        padding-top: 0.25rem;

        section {
          display: flex;
          flex-direction: column;
          padding-top: 0.25rem;
          gap: 1em;

          &:not(.active) {
            display: none;
          }
        }
      }

      .help-section {
        padding: 0 3rem;
      }
    }

  }

</style>
