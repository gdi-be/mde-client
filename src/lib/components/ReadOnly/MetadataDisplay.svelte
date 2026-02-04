<script lang="ts">
  import { getFormContext } from '$lib/context/FormContext.svelte';
  import CommentsDisplay from './CommentsDisplay.svelte';
  import DisplayField from './DisplayField.svelte';
  import { page } from '$app/state';

  const { getValue } = getFormContext();
  const metadataProfile = $derived(getValue('isoMetadata.metadataProfile'));
  const highValueDataset = $derived(getValue('isoMetadata.highValueDataset'));

  const t = $derived(page.data.t);
</script>

<div class="metadata-display">
  <div class="content">
    <DisplayField key="isoMetadata.identifier" label={t('displayfieldsnippets.identifier')} />
    <DisplayField
      key="isoMetadata.fileIdentifier"
      label={t('displayfieldsnippets.fileIdentifier')}
    />
    <section id="basedata">
      <h2>{t('metadatadisplay.sectionBase')}</h2>
      <DisplayField key="isoMetadata.title" label={t('01_TitleField.label')} />
      <DisplayField key="isoMetadata.description" label={t('02_DescriptionField.label')} />
      <DisplayField key="isoMetadata.keywords" label={t('15_KeywordsField.label')} />
      <DisplayField key="isoMetadata.preview" label={t('29_PreviewField.label')} />
      <DisplayField key="isoMetadata.pointsOfContact" label={t('19_ContactsField.label')} />
    </section>
    <section id="classification">
      <h2>{t('metadatadisplay.sectionClassification')}</h2>
      <DisplayField key="isoMetadata.metadataProfile" label={t('05_MetadataProfileField.label')} />
      {#if metadataProfile === 'INSPIRE_HARMONISED' || metadataProfile === 'INSPIRE_IDENTIFIED'}
        <DisplayField key="isoMetadata.inspireTheme" label={t('07_AnnexThemeField.label')} />
      {/if}
      {#if metadataProfile === 'INSPIRE_HARMONISED'}
        <DisplayField key="isoMetadata.inspireFormatName" label={t('70_InspireFormatName.label')} />
      {/if}
      {#if metadataProfile === 'INSPIRE_HARMONISED'}
        <DisplayField
          key="isoMetadata.inspireAnnexVersion"
          label={t('38_InspireAnnexVersionField.label')}
        />
      {/if}
      {#if metadataProfile === 'INSPIRE_HARMONISED'}
        <DisplayField key="isoMetadata.valid" label={t('37_QualityReportCheckField.label')} />
      {/if}
      <DisplayField key="isoMetadata.privacy" label={t('04_PrivacyField.label')} />
      <DisplayField key="isoMetadata.termsOfUseId" label={t('25_TermsOfUseField.label')} />
      <DisplayField
        key="isoMetadata.termsOfUseSource"
        label={t('26_TermsOfUseSourceField.label')}
      />
      <DisplayField
        key="isoMetadata.highValueDataset"
        label={t('06_HighValueDatasetField.label')}
      />
      {#if highValueDataset === true}
        <DisplayField
          key="isoMetadata.highValueDataCategory"
          label={t('06_HighValueDatasetField.categoryLabel')}
        />
      {/if}
      <DisplayField key="isoMetadata.topicCategory" label={t('13_TopicCategory.label')} />
    </section>
    <section id="temp_and_spatial">
      <h2>{t('metadatadisplay.sectionTemporalSpatial')}</h2>
      <DisplayField key="isoMetadata.created" label={t('09_CreatedField.label')} />
      <DisplayField key="isoMetadata.published" label={t('10_PublishedField.label')} />
      <DisplayField
        key="isoMetadata.maintenanceFrequency"
        label={t('14_MaintenanceFrequencyField.label')}
      />
      <DisplayField key="isoMetadata.modified" label={t('11_LastUpdatedField.label')} />
      <DisplayField key="isoMetadata.validFrom" label={t('12_ValidityRangeField.label_from')} />
      <DisplayField key="isoMetadata.validTo" label={t('12_ValidityRangeField.label_to')} />
      <DisplayField
        key="technicalMetadata.deliveredCrs"
        label={t('16_DeliveredCoordinateSystemField.label')}
      />
      <DisplayField key="isoMetadata.crs" label={t('17_CoordinateSystemField.label')} />
      <DisplayField key="isoMetadata.extent" label={t('18_ExtentField.label')} />
      <DisplayField key="isoMetadata.resolutions" label={t('28_ResolutionField.label')} />
      <DisplayField key="isoMetadata.scale" label={t('28_ResolutionField.label_scale')} />
    </section>
    <section id="additional">
      <h2>{t('metadatadisplay.sectionAdditional')}</h2>
      <DisplayField key="isoMetadata.contentDescription" label={t('30_ContentDescription.label')} />
      <DisplayField
        key="isoMetadata.technicalDescription"
        label={t('31_TechnicalDescription.label')}
      />
      <DisplayField key="isoMetadata.lineage" label={t('32_Lineage.label')} />
      <DisplayField
        key="clientMetadata.relatedTopics"
        label={t('displayfieldsnippets.relatedTopics')}
      />
      <DisplayField
        key="isoMetadata.contentDescriptions"
        label={t('41_AdditionalInformation.label')}
      />
    </section>
    <section id="services">
      <h2>{t('metadatadisplay.sectionServices')}</h2>
      <DisplayField key="isoMetadata.services" label={t('40_ServicesSection.label')} />
    </section>
    <section id="comments">
      <h2>{t('metadatadisplay.sectionComments')}</h2>
      <CommentsDisplay />
    </section>
  </div>
</div>

<style lang="scss">
  .metadata-display {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;

    @media print {
      font-size: 9pt;
      print-color-adjust: exact;
      -webkit-print-color-adjust: exact;
    }

    .content {
      width: 80%;

      section {
        display: flex;
        flex-direction: column;
        padding: 1em;
      }

      h2 {
        margin-top: 0;
        font-size: 1.5em;
        color: #333;
      }
    }
  }
</style>
