<script lang="ts">
  import { initializeFormContext, setFormData } from '$lib/context/FormContext.svelte';
  import type { MetadataCollection } from '$lib/models/metadata';
  import DisplayField from './DisplayField.svelte';

  type MetadataDisplayProps = {
    metadata?: MetadataCollection;
  };

  const { metadata }: MetadataDisplayProps = $props();

  initializeFormContext();

  if (metadata) {
    setFormData(metadata);
  }
</script>

<div class="metadata-display">
  <section id="basedata">
    <h2>1. Basisangaben</h2>
    <DisplayField key="isoMetadata.title" />
    <DisplayField key="isoMetadata.description" />
    <DisplayField key="isoMetadata.keywords" />
    <DisplayField key="isoMetadata.preview" />
    <DisplayField key="isoMetadata.contacts" />
  </section>
  <section id="classification">
    <h2>2. Einordnung</h2>
    <DisplayField key="isoMetadata.metadataProfile" />
    <DisplayField key="clientMetadata.privacy" />
    <DisplayField key="isoMetadata.termsOfUse" />
    <DisplayField key="isoMetadata.annexTheme" />
    <DisplayField key="isoMetadata.qualityReportCheck" />
    <DisplayField key="clientMetadata.highValueDataset" />
    <DisplayField key="isoMetadata.topicCategory" />
  </section>
  <section id="temp_and_spatial">
    <h2>3. Zeitliche und Räumliche Angaben</h2>
    <DisplayField key="isoMetadata.created" />
    <DisplayField key="isoMetadata.published" />
    <DisplayField key="isoMetadata.maintenanceFrequency" />
    <DisplayField key="isoMetadata.lastUpdated" />
    <DisplayField key="isoMetadata.validityRange" />
    <DisplayField key="isoMetadata.deliveredCoordinateSystem" />
    <DisplayField key="isoMetadata.coordinateSystem" />
    <DisplayField key="isoMetadata.extent" />
    <DisplayField key="isoMetadata.resolution" />
  </section>
  <section id="additional">
    <h2>4. Weitere Angaben</h2>
    <DisplayField key="isoMetadata.contentDescription" />
    <DisplayField key="isoMetadata.technicalDescription" />
    <DisplayField key="isoMetadata.lineage" />
    <DisplayField key="isoMetadata.additionalInformation" />
  </section>
  <section id="services">
    <h2>5. Dienste</h2>
    <DisplayField key="isoMetadata.services" />
  </section>
</div>

<style lang="scss">
  .metadata-display {
    width: 80%;
    display: flex;
    flex-direction: column;
    gap: 2em;
    padding: 1em;

    section {
      display: flex;
      flex-direction: column;
      gap: 1em;
      padding: 1em;
    }

    h2 {
      margin-top: 0;
      font-size: 1.5em;
      color: #333;
    }
  }
</style>
