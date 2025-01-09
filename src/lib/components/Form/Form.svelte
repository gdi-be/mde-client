<script lang="ts">
  /* eslint-disable svelte/no-at-html-tags */
  import { parse } from "marked";
  import { goto } from "$app/navigation";
  import { onMount, tick } from "svelte";
  import {
    setFormData,
    initializeFormContext,
    getFormContext,
    clearActiveHelp,
    setHelp,
    getHelpMarkdown,
    getProgress,
    type Section
  } from "./FormContext.svelte";
  import type { FormHelp } from "$lib/models/form";
  import Progress from "./Progress.svelte";

  import TitleField_01 from "./Field/TitleField_01.svelte";
  import DescriptionField_02 from "./Field/DescriptionField_02.svelte";
  import InternalCommentField_03 from "./Field/InternalCommentField_03.svelte";
  import KeywordsField_15 from "./Field/KeywordsField_15.svelte";
  import PreviewField_29 from "./Field/PreviewField_29.svelte";
  import ContactsField_19 from "./Field/ContactsField_19.svelte";
  import MetadataType_05 from "./Field/MetadataType_05.svelte";
  import DataProtectionField_04 from "./Field/DataProtectionField_04.svelte";
  import TermsOfUseField_24 from "./Field/TermsOfUseField_24.svelte";
  import AnnexThemeField_07 from "./Field/AnnexThemeField_07.svelte";
  import QualityReportCheckField_37 from "./Field/QualityReportCheckField_37.svelte";
  import HighValueDatasetField_06 from "./Field/HighValueDatasetField_06.svelte";
  import TopicCategory_13 from "./Field/TopicCategory_13.svelte";
  import { fade } from "svelte/transition";
  import { Label } from "@smui/button";

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

  const SECTIONS: { section: Section, label: string }[] = [{
    section: 'basedata',
    label: 'Basisangaben'
  }, {
    section: 'classification',
    label: 'Einordnung'
  }, {
    section: 'temp_and_spatial',
    label: 'Zeitliche und Räumliche Angaben'
  }, {
    section: 'additional',
    label: 'Weitere Angaben'
  }, {
    section: 'display_services',
    label: 'Darstellungsdienste'
  }, {
    section: 'download_services',
    label: 'Downloaddienste'
  }];

  initializeFormContext();

  if (metadata) {
    setFormData(metadata);
  }

  if (help) {
    setHelp(help);
  }

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

</script>

<div class="metadata-form">
  <nav class="tabs" bind:this={tabs}>
    {#each SECTIONS as { section, label }}
      <button
        class="section-button"
        class:active={activeSection === section}
        onclick={() => onSectionClick(section)}
      >
        <Label>{label}</Label>
        <Progress {...(getProgress(section, metadata))} />
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
  <div class="form-wrapper">
    <div>
      <!-- placeholder for flex layout-->
    </div>
    <div>
      <form>
        {#if activeSection === "basedata"}
          <section id="basedata" transition:fade >
            <TitleField_01 />
            <DescriptionField_02 />
            <InternalCommentField_03 />
            <KeywordsField_15 />
            <PreviewField_29 />
            <ContactsField_19 />
          </section>
        {/if}
        {#if activeSection === "classification"}
          <section id="classification" transition:fade >
            <MetadataType_05 />
            <DataProtectionField_04 />
            <TermsOfUseField_24 />
            <AnnexThemeField_07 />
            <QualityReportCheckField_37 {metadata} />
            <HighValueDatasetField_06 />
            <TopicCategory_13 />
          </section>
        {/if}
        {#if activeSection === "temp_and_spatial"}
          <section id="temp_and_spatial" transition:fade >
          </section>
        {/if}
        {#if activeSection === "additional"}
          <section id="additional" transition:fade >
          </section>
        {/if}
        {#if activeSection === "display_services"}
          <section id="display_services" transition:fade >
          </section>
        {/if}
        {#if activeSection === "download_services"}
          <section id="download_services" transition:fade >
          </section>
        {/if}
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
      overflow-y: scroll;
      flex: 1;
      margin: 2em 0;

      > * {
        flex: 1;
      }

      form {
        position: relative;

        section {
          position: absolute;
          top: 0;
          display: flex;
          flex-direction: column;
          gap: 1em;
        }
      }

      .help-section {
        padding: 0 3rem;
      }
    }

  }

</style>
