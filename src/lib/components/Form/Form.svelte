<script lang="ts">
  /* eslint-disable svelte/no-at-html-tags */
  import { parse } from "marked";
  import { goto } from "$app/navigation";
  import { tick } from "svelte";
  import { fade } from "svelte/transition";
  import LinearProgress from "@smui/linear-progress";
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

  import TitleField_01 from "./Field/TitleField_01.svelte";
  import DescriptionField_02 from "./Field/DescriptionField_02.svelte";
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
  import ResolutionField_28 from "./Field/ResolutionField_28.svelte";
  import ContentDescriptionTextarea_31 from "./Field/ContentDescriptionTextarea_31.svelte";
  import ContentDescription_30 from "./Field/ContentDescription_30.svelte";
  import TechnicalDescription_60 from "./Field/TechnicalDescription_60.svelte";
  import Lineage_32 from "./Field/Lineage_32.svelte";
  import AdditionalInformation_39 from "./Field/AdditionalInformation_39.svelte";
  import ServicesSection from "./service/ServicesSection.svelte";
  import FormFooter from "./FormFooter.svelte";
  import type { MetadataJson } from "$lib/models/metadata";
  import { Label } from "@smui/button";

  type FormProps = {
    metadata?: MetadataJson;
    activeSection?: string;
    help: FormHelp;
  }

  let {
    activeSection,
    metadata,
    help
  }: FormProps = $props();

  type SectionConfig = {
    section: Section,
    label: string,
    disabledCheck: (metadata?: MetadataJson) => boolean
  };

  const SECTIONS: SectionConfig[] = [{
    section: 'basedata',
    label: '1. Basisangaben',
    disabledCheck: () => false
  }, {
    section: 'classification',
    label: '2. Einordnung',
    disabledCheck: () => false
  }, {
    section: 'temp_and_spatial',
    label: '3. Zeitliche und Räumliche Angaben',
    disabledCheck: (metadata) => !metadata?.isoMetadata?.metadataProfile
  }, {
    section: 'additional',
    label: '4. Weitere Angaben',
    disabledCheck: (metadata) => !metadata?.isoMetadata?.metadataProfile
  }, {
    section: 'services',
    label: '5. Dienste',
    disabledCheck: (metadata) => !metadata?.isoMetadata?.metadataProfile
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

  const onSectionClick = async (section: string) => {
    activeSection = section;
    clearActiveHelp();

    goto(`#${section}`, {
      replaceState: true
    });
    await tick();
  };

</script>

<div class="metadata-form">
  <nav class="tabs" bind:this={tabs}>
    {#each SECTIONS as { section, label, disabledCheck }, i}
      <div
        class="tab-container"
        class:active={activeSection === section}
      >
        <button
          class="tab"
          onclick={() => onSectionClick(section)}
          disabled={disabledCheck(metadata)}
          >
          <Label>{label}</Label>
        </button>
        <LinearProgress progress={(getProgress(section, metadata))} />
      </div>
      {#if i + 1 < SECTIONS.length}
        <i class="material-icons">arrow_right_alt</i>
      {/if}
    {/each}
  </nav>
  <div class="form-wrapper">
    <form>
      {#if activeSection === "basedata"}
        <section id="basedata" transition:fade >
          <TitleField_01 />
          <DescriptionField_02 />
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
          <AnnexThemeField_07 {metadata} />
          <QualityReportCheckField_37 {metadata} />
          <HighValueDatasetField_06 />
          <TopicCategory_13 {metadata}/>
        </section>
      {/if}
      {#if activeSection === "temp_and_spatial"}
        <section id="temp_and_spatial" transition:fade >
          <CreatedField_09 />
          <PublishedField_10 />
          <MaintenanceFrequencyField_14 />
          <LastUpdatedField_11 {metadata} />
          <ValidityRangeField_12 />
          <DeliveredCoordinateSystemField_16 />
          <CoordinateSystemField_17 />
          <ExtentField_18 />
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
  <FormFooter {metadata} />
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
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1em;
    }

    .tab-container {
      background-color: #f0f0f0;
      border-bottom: 3px solid transparent;
      border-radius: var(--mdc-shape-medium, 4px) var(--mdc-shape-medium, 4px) 0 0;

      :global(svg) {
        margin: 10px;
      }

      &:hover {
        background-color: #f0f0f0;
        border-color: var(--mdc-theme-primary);
      }

      &.active {
        font-weight: bold;
        border-color: #0078d7;
      }
    }

    .tab {
      padding: 0.5rem 1rem;
      background-color: transparent;
      border: none;
      cursor: pointer;
      font-size: 1.25rem;
      border-radius: 5px;
      transition: background-color 0.3s;
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
        overflow: auto;
        flex: 1;
        padding: 0 3rem;
      }
    }

  }

</style>
