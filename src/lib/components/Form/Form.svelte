<script lang="ts">
  /* eslint-disable svelte/no-at-html-tags */
  import { parse } from "marked";
  import { goto } from "$app/navigation";
  import { onMount, tick } from "svelte";
  import { fade } from "svelte/transition";
  import { Label } from "@smui/button";
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
  import CreatedField_09 from "./Field/CreatedField_09.svelte";
  import PublishedField_10 from "./Field/PublishedField_10.svelte";
  import MaintenanceFrequencyField_14 from "./Field/MaintenanceFrequencyField_14.svelte";
  import LastUpdatedField_11 from "./Field/LastUpdatedField_11.svelte";
  import ValidityRangeField_12 from "./Field/ValidityRangeField_12.svelte";
  import DeliveredCoordinateSystemField_16 from "./Field/DeliveredCoordinateSystemField_16.svelte";
  import CoordinateSystemField_17 from "./Field/CoordinateSystemField_17.svelte";
  import ExtentField_18 from "./Field/ExtentField_18.svelte";
  import RepresentiveFractionField_27 from "./Field/RepresentiveFractionField_27.svelte";
  import ResolutionField_28 from "./Field/ResolutionField_28.svelte";
  import ContentDescriptionTextarea_31 from "./Field/ContentDescriptionTextarea_31.svelte";
  import ContentDescription_30 from "./Field/ContentDescription_30.svelte";
  import TechnicalDescription_60 from "./Field/TechnicalDescription_60.svelte";
  import Lineage_32 from "./Field/Lineage_32.svelte";
  import AdditionalInformation_39 from "./Field/AdditionalInformation_39.svelte";
  import ServicesSection from "./service/ServicesSection.svelte";

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
    section: 'services',
    label: 'Dienste'
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

  $inspect(metadata);

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
          <CreatedField_09 />
          <PublishedField_10 />
          <MaintenanceFrequencyField_14 />
          <LastUpdatedField_11 />
          <ValidityRangeField_12 />
          <DeliveredCoordinateSystemField_16 />
          <CoordinateSystemField_17 />
          <ExtentField_18 />
          <RepresentiveFractionField_27 />
          <ResolutionField_28 />
        </section>
      {/if}
      {#if activeSection === "additional"}
        <section id="additional" transition:fade >
          <ContentDescriptionTextarea_31 />
          <ContentDescription_30 />
          <TechnicalDescription_60 />
          <Lineage_32 />
          <AdditionalInformation_39 />
        </section>
      {/if}
      {#if activeSection === "services"}
        <section id="services" transition:fade >
          <ServicesSection />
        </section>
      {/if}
    </form>
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
    flex: 1;
    width: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-self: stretch;

    nav.tabs {
      position: relative;
      display: flex;
      padding: 0 2em 0.25em 2em;
      margin-bottom: 1em;

      button.section-button {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 0.25em;
        cursor: pointer;
        flex: 1;
        background-color: transparent;
        border: none;
        font-family: 'Roboto', sans-serif;
        font-size: 1.25em;

        :global(.progress-chart) {
          flex: 0 0 auto;
        }
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
      position: relative;

      form {
        flex: 2;
        position: relative;
        padding-left: 2em;

        section {
          position: absolute;
          width: 100%;
          top: 0;
          display: flex;
          flex-direction: column;
          padding: 1em 0 2em 0;
          gap: 1em;
        }
      }

      .help-section {
        flex: 1;
        padding: 0 3rem;
      }
    }

  }

</style>
