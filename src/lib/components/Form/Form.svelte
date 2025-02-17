<script lang="ts">
  import { goto } from "$app/navigation";
  import { tick } from "svelte";
  import { fade } from "svelte/transition";
  import LinearProgress from "@smui/linear-progress";
  import {
    setFormData,
    initializeFormContext,
    getProgress,
    type Section,
    clearActiveHelp
  } from "$lib/context/FormContext.svelte";;
  import F01_TitleField from "./Field/01_TitleField.svelte";
  import F02_DescriptionField from "./Field/02_DescriptionField.svelte";
  import F15_KeywordsField from "./Field/15_KeywordsField.svelte";
  import F29_PreviewField from "./Field/29_PreviewField.svelte";
  import F19_ContactsField from "./Field/19_ContactsField.svelte";
  import F05_MetadataProfile from "./Field/05_MetadataProfile.svelte";
  import F04_PrivacyField from "./Field/04_PrivacyField.svelte";
  import F24_TermsOfUseField from "./Field/24_TermsOfUseField.svelte";
  import F07_AnnexThemeField from "./Field/07_AnnexThemeField.svelte";
  import F37_QualityReportCheckField from "./Field/37_QualityReportCheckField.svelte";
  import F06_HighValueDatasetField from "./Field/06_HighValueDatasetField.svelte";
  import F13_TopicCategory from "./Field/13_TopicCategory.svelte";
  import F09_CreatedField from "./Field/09_CreatedField.svelte";
  import F10_PublishedField from "./Field/10_PublishedField.svelte";
  import F14_MaintenanceFrequencyField from "./Field/14_MaintenanceFrequencyField.svelte";
  import F11_LastUpdatedField from "./Field/11_LastUpdatedField.svelte";
  import F12_ValidityRangeField from "./Field/12_ValidityRangeField.svelte";
  import F16_DeliveredCoordinateSystemField from "./Field/16_DeliveredCoordinateSystemField.svelte";
  import F17_CoordinateSystemField from "./Field/17_CoordinateSystemField.svelte";
  import F18_ExtentField from "./Field/18_ExtentField.svelte";
  import F28_ResolutionField from "./Field/28_ResolutionField.svelte";
  import F30_ContentDescription from "./Field/30_ContentDescription.svelte";
  import F31_TechnicalDescription from "./Field/31_TechnicalDescription.svelte";
  import F32_Lineage from "./Field/32_Lineage.svelte";
  import F39_AdditionalInformation from "./Field/39_AdditionalInformation.svelte";
  import ServicesSection from "./service/ServicesSection.svelte";
  import FormFooter from "./FormFooter.svelte";
  import type { MetadataCollection } from "$lib/models/metadata";
  import Button, { Icon, Label } from "@smui/button";
  import ScrollToTopButton from "./ScrollToTopButton.svelte";
  import HelpPanel from "./HelpPanel.svelte";

  type FormProps = {
    metadata?: MetadataCollection;
    activeSection?: string;
  }

  let {
    activeSection,
    metadata
  }: FormProps = $props();

  type SectionConfig = {
    section: Section,
    label: string,
    disabledCheck: (metadata?: MetadataCollection) => boolean
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

  let tabs = $state<HTMLElement>();
  let formWrapper = $state<HTMLDivElement>();

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
  <div class="form-wrapper" bind:this={formWrapper}>
    <form>
      {#if activeSection === "basedata"}
        <section id="basedata" transition:fade >
          <F01_TitleField />
          <F02_DescriptionField />
          <F15_KeywordsField />
          <F29_PreviewField />
          <F19_ContactsField />
          <ScrollToTopButton target={formWrapper} />
        </section>
      {/if}
      {#if activeSection === "classification"}
        <section id="classification" transition:fade >
          <F05_MetadataProfile />
          <F04_PrivacyField />
          <F24_TermsOfUseField />
          <F07_AnnexThemeField {metadata} />
          <F37_QualityReportCheckField {metadata} />
          <F06_HighValueDatasetField />
          <F13_TopicCategory {metadata}/>
          <ScrollToTopButton target={formWrapper} />
        </section>
      {/if}
      {#if activeSection === "temp_and_spatial"}
        <section id="temp_and_spatial" transition:fade >
          <F09_CreatedField />
          <F10_PublishedField />
          <F14_MaintenanceFrequencyField />
          <F11_LastUpdatedField {metadata} />
          <F12_ValidityRangeField />
          <F16_DeliveredCoordinateSystemField />
          <F17_CoordinateSystemField />
          <F18_ExtentField />
          <F28_ResolutionField />
          <ScrollToTopButton target={formWrapper} />
        </section>
      {/if}
      {#if activeSection === "additional"}
        <section id="additional" transition:fade >
          <F30_ContentDescription />
          <F31_TechnicalDescription />
          <F32_Lineage />
          <F39_AdditionalInformation />
          <ScrollToTopButton target={formWrapper} />
        </section>
      {/if}
      {#if activeSection === "services"}
        <section id="services" transition:fade >
          <ServicesSection />
        </section>
      {/if}
    </form>
    <HelpPanel />
  </div>
  <FormFooter {metadata}>
    <Button
      class="previous-button"
      title="Zurück"
      disabled={activeSection === "basedata"}
      onclick={() => onSectionClick(SECTIONS[SECTIONS.findIndex(s => s.section === activeSection) - 1].section)}
    >
      <Icon class="material-icons">chevron_left</Icon>
      <Label>Zurück</Label>
    </Button>
    <Button
      class="next-button"
      title="Weiter"
      disabled={activeSection === "services"}
      onclick={() => onSectionClick(SECTIONS[SECTIONS.findIndex(s => s.section === activeSection) + 1].section)}
    >
      <Label>Weiter</Label>
      <Icon class="material-icons">chevron_right</Icon>
    </Button>
  </FormFooter>
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

      :global(.mdc-linear-progress) {
        margin-bottom: 4px;
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
    }

  }

</style>
