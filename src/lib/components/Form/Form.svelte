<script lang="ts">
  import { goto } from '$app/navigation';
  import { getContext, tick } from 'svelte';
  import { fade } from 'svelte/transition';
  import LinearProgress from '@smui/linear-progress';
  import {
    getFormContext,
    type FormState,
    FORMSTATE_CONTEXT
  } from '$lib/context/FormContext.svelte';
  import F01_TitleField from './Field/01_TitleField.svelte';
  import F02_DescriptionField from './Field/02_DescriptionField.svelte';
  import F15_KeywordsField from './Field/15_KeywordsField.svelte';
  import F29_PreviewField from './Field/29_PreviewField.svelte';
  import F19_ContactsField from './Field/19_ContactsField.svelte';
  import F05_MetadataProfileField from './Field/05_MetadataProfileField.svelte';
  import F04_PrivacyField from './Field/04_PrivacyField.svelte';
  import F25_TermsOfUseField from './Field/25_TermsOfUseField.svelte';
  import F26_TermsOfUseSourceField from './Field/26_TermsOfUseSourceField.svelte';
  import F07_AnnexThemeField from './Field/07_AnnexThemeField.svelte';
  import F37_QualityReportCheckField from './Field/37_QualityReportCheckField.svelte';
  import F06_HighValueDatasetField from './Field/06_HighValueDatasetField.svelte';
  import F13_TopicCategory from './Field/13_TopicCategory.svelte';
  import F09_CreatedField from './Field/09_CreatedField.svelte';
  import F10_PublishedField from './Field/10_PublishedField.svelte';
  import F14_MaintenanceFrequencyField from './Field/14_MaintenanceFrequencyField.svelte';
  import F11_LastUpdatedField from './Field/11_LastUpdatedField.svelte';
  import F12_ValidityRangeField from './Field/12_ValidityRangeField.svelte';
  import F16_DeliveredCoordinateSystemField from './Field/16_DeliveredCoordinateSystemField.svelte';
  import F17_CoordinateSystemField from './Field/17_CoordinateSystemField.svelte';
  import F18_ExtentField from './Field/18_ExtentField.svelte';
  import F28_ResolutionField from './Field/28_ResolutionField.svelte';
  import F30_ContentDescription from './Field/30_ContentDescription.svelte';
  import F31_TechnicalDescription from './Field/31_TechnicalDescription.svelte';
  import F32_Lineage from './Field/32_Lineage.svelte';
  import F38_InspireAnnexVersionField from './Field/38_InspireAnnexVersionField.svelte';
  import F39_SpatialRepresentationField from './Field/39_SpatialRepresentationField.svelte';
  import F41_AdditionalInformation from './Field/41_AdditionalInformation.svelte';
  import F70_InspireFormatNameField from './Field/70_InspireFormatName.svelte';
  import F40_ServicesSection from './service/40_ServicesSection.svelte';
  import FormFooter from './FormFooter.svelte';
  import type { MetadataCollection } from '$lib/models/metadata';
  import Button, { Icon, Label } from '@smui/button';
  import ScrollToTopButton from './ScrollToTopButton.svelte';
  import HelpPanel from './HelpPanel.svelte';
  import { page } from '$app/state';
  import { getHighestRole } from '$lib/util';
  import { getAccessToken } from '$lib/context/TokenContext.svelte';
  import { ValidationService, type ProgressInfo } from '$lib/services/ValidationService';
  import type { Section } from './FieldsConfig';

  const t = $derived(page.data.t);
  let activeSection = $state(page.url.hash.slice(1) || 'basedata');

  const formState = getContext<FormState>(FORMSTATE_CONTEXT);
  const metadata = $derived(formState.metadata);

  const formContext = getFormContext();
  const token = $derived(getAccessToken());
  const highestRole = $derived(getHighestRole(token));

  type SectionConfig = {
    section: Section;
    label: string;
    disabledCheck: (metadata?: MetadataCollection) => boolean;
  };

  let commentsPanelVisible = $state(false);
  let publishPanelVisible = $state(false);

  const SECTIONS: SectionConfig[] = $derived([
    {
      section: 'basedata',
      label: t('form.basedata'),
      disabledCheck: () => false
    },
    {
      section: 'classification',
      label: t('form.classification'),
      disabledCheck: () => false
    },
    {
      section: 'temp_and_spatial',
      label: t('form.temp_and_spatial'),
      disabledCheck: (metadata) => !metadata?.isoMetadata?.metadataProfile
    },
    {
      section: 'additional',
      label: t('form.additional'),
      disabledCheck: (metadata) => !metadata?.isoMetadata?.metadataProfile
    },
    {
      section: 'services',
      label: t('form.services'),
      disabledCheck: (metadata) => !metadata?.isoMetadata?.metadataProfile
    }
  ]);

  let formElement = $state<HTMLFormElement>();

  const onSectionClick = async (section: string) => {
    activeSection = section;
    formContext.clearActiveHelp();

    goto(`#${section}`, {
      replaceState: true,
      invalidateAll: true
    });
    await tick();
  };

  $effect(() => {
    const action = page.url.searchParams.get('action');

    if (action?.includes('print')) {
      print();
    }

    if (action?.includes('comments')) {
      commentsPanelVisible = true;
    }

    if (action?.includes('publish')) {
      publishPanelVisible = true;
    }
  });

  const getProgressTitle = (progressInfo: ProgressInfo) => {
    let baseText = `Fortschritt: ${Math.floor(progressInfo.progress * 100)} %`;
    return baseText;
  };
</script>

<div class="metadata-form">
  <nav class="tabs">
    {#each SECTIONS as { section, label, disabledCheck }, i}
      {@const progressInfo = ValidationService.getProgress(metadata!, highestRole, section)}
      <div class="tab-container" class:active={activeSection === section}>
        <button
          class="tab"
          onclick={() => onSectionClick(section)}
          disabled={disabledCheck(metadata)}
          title={label}
          type="button"
        >
          <Label>{label}</Label>
        </button>
        <LinearProgress
          progress={progressInfo.progress}
          aria-label={label + ' Fortschritt'}
          title={getProgressTitle(progressInfo)}
        />
      </div>
      {#if i + 1 < SECTIONS.length}
        <i class="material-icons">arrow_right_alt</i>
      {/if}
    {/each}
  </nav>
  <div class="form-wrapper">
    <form bind:this={formElement}>
      {#if activeSection === 'basedata'}
        <section id="basedata" transition:fade>
          <F01_TitleField />
          <F02_DescriptionField />
          <F15_KeywordsField />
          <F29_PreviewField />
          <F19_ContactsField />
          <ScrollToTopButton target={formElement} />
        </section>
      {/if}
      {#if activeSection === 'classification'}
        <section id="classification" transition:fade>
          <fieldset class="inspire-fieldset">
            <legend>{t('form.inspireLegend')}</legend>
            <F05_MetadataProfileField />
            <F07_AnnexThemeField />
            <F70_InspireFormatNameField />
            <F38_InspireAnnexVersionField />
            <F37_QualityReportCheckField />
          </fieldset>
          <F04_PrivacyField />
          <F25_TermsOfUseField />
          <F26_TermsOfUseSourceField />
          <F06_HighValueDatasetField />
          <F13_TopicCategory />
          <ScrollToTopButton target={formElement} />
        </section>
      {/if}
      {#if activeSection === 'temp_and_spatial'}
        <section id="temp_and_spatial" transition:fade>
          <F09_CreatedField />
          <F10_PublishedField />
          <F14_MaintenanceFrequencyField />
          <F11_LastUpdatedField />
          <F12_ValidityRangeField />
          <F16_DeliveredCoordinateSystemField />
          <F17_CoordinateSystemField />
          <F18_ExtentField />
          <F28_ResolutionField />
          <F39_SpatialRepresentationField />
          <ScrollToTopButton target={formElement} />
        </section>
      {/if}
      {#if activeSection === 'additional'}
        <section id="additional" transition:fade>
          <F30_ContentDescription />
          <F31_TechnicalDescription />
          <F32_Lineage />
          <F41_AdditionalInformation />
          <ScrollToTopButton target={formElement} />
        </section>
      {/if}
      {#if activeSection === 'services'}
        <section id="services" transition:fade>
          <F40_ServicesSection />
        </section>
      {/if}
    </form>
    <HelpPanel />
  </div>
  <FormFooter {commentsPanelVisible} {publishPanelVisible}>
    <Button
      class="previous-button"
      title={t('form.back')}
      disabled={activeSection === 'basedata'}
      onclick={() =>
        onSectionClick(
          SECTIONS[SECTIONS.findIndex((s) => s.section === activeSection) - 1].section
        )}
      type="button"
    >
      <Icon class="material-icons">chevron_left</Icon>
      <Label>{t('form.back')}</Label>
    </Button>
    <Button
      class="next-button"
      title={t('form.next')}
      disabled={activeSection === 'services'}
      onclick={() =>
        onSectionClick(
          SECTIONS[SECTIONS.findIndex((s) => s.section === activeSection) + 1].section
        )}
      type="button"
    >
      <Label>{t('form.next')}</Label>
      <Icon class="material-icons">chevron_right</Icon>
    </Button>
  </FormFooter>
</div>

<style lang="scss">
  .metadata-form {
    flex: 1;
    overflow: hidden;
    align-self: stretch;
    display: flex;
    flex-direction: column;

    fieldset.inspire-fieldset {
      padding-top: 1.2em;
      border-radius: 0.25rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 1em;

      legend {
        font-size: 1.5em;
      }

      :global(.text-input),
      :global(.select-input),
      :global(.multi-select-input) {
        border: none;
        background-color: rgba(244, 244, 244, 0.7);
      }

      :global(.text-input > legend),
      :global(.select-input > legend),
      :global(.multi-select-input > legend) {
        font-size: 1.2em;
        background-color: white;
        border-radius: 0.25em;
        padding: 0 0.25em;
      }
    }

    nav.tabs {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1em;
      padding: 0 2em;
    }

    .tab-container {
      background-color: #f0f0f0;
      border-radius: var(--mdc-shape-medium, 4px) var(--mdc-shape-medium, 4px) 0 0;

      :global(svg) {
        margin: 10px;
      }

      :global(.mdc-linear-progress:hover) {
        scale: 1 2;
      }

      :global(.mdc-linear-progress__bar-inner) {
        border-color: var(--ready-for-release-color, var(--mdc-theme-secondary));
      }

      :global(.mdc-linear-progress__buffer-bar) {
        background-color: var(--mdc-theme-error);
      }

      &:hover {
        background-color: #f0f0f0;
        border-color: var(--mdc-theme-primary);
      }

      &.active {
        font-weight: bold;
        background-color: var(--primary-90);
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

      :global(span) {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
        -webkit-line-clamp: 2;
        line-clamp: 2;
      }
    }

    .form-wrapper {
      display: flex;
      gap: 1rem;
      overflow: hidden;
      flex: 1;
      align-items: flex-start;

      form {
        flex: 2;
        padding: 0 1rem;
        overflow-y: auto;
        max-width: 67%;
        max-height: 100%;
        direction: rtl;

        * {
          direction: ltr;
        }

        section {
          width: 100%;
          display: flex;
          flex-direction: column;
          padding: 2em 0;

          &:not(#services) {
            gap: 4em;
          }

          &#services {
            gap: 1em;
          }
        }
      }
    }

    @media (max-width: 1024px) {
      .tab {
        font-size: 0.75rem;
      }
    }
  }
</style>
