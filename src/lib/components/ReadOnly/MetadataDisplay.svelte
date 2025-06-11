<script lang="ts">
  import DisplayField from './DisplayField.svelte';
</script>

<div class="metadata-display">
  <div class="content">
    <DisplayField key="isoMetadata.identifier" label="Identifier" />
    <DisplayField key="isoMetadata.fileIdentifier" label="File-Identifier" />
    <section id="basedata">
      <h2>1. Basisangaben</h2>
      <DisplayField key="isoMetadata.title" />
      <DisplayField key="isoMetadata.description" />
      <DisplayField key="isoMetadata.keywords" />
      <DisplayField key="isoMetadata.preview" />
      <DisplayField key="isoMetadata.pointsOfContact" />
    </section>
    <section id="classification">
      <h2>2. Einordnung</h2>
      <DisplayField key="isoMetadata.metadataProfile" />
      <DisplayField key="clientMetadata.privacy" />
      <DisplayField key="isoMetadata.termsOfUseId" />
      <DisplayField key="isoMetadata.annexTheme" />
      <DisplayField key="isoMetadata.qualityReportCheck" />
      <DisplayField key="isoMetadata.highValueDataset" />
      <DisplayField key="isoMetadata.topicCategory" />
    </section>
    <section id="temp_and_spatial">
      <h2>3. Zeitliche und Räumliche Angaben</h2>
      <DisplayField key="isoMetadata.created" />
      <DisplayField key="isoMetadata.published" />
      <DisplayField key="isoMetadata.maintenanceFrequency" />
      <DisplayField key="isoMetadata.modified" />
      <DisplayField key="isoMetadata.validFrom" />
      <DisplayField key="isoMetadata.validTo" />
      <DisplayField key="technicalMetadata.deliveredCrs" />
      <DisplayField key="isoMetadata.crs" />
      <DisplayField key="isoMetadata.extent" />
      <DisplayField key="isoMetadata.resolutions" />
      <DisplayField key="isoMetadata.scale" />
    </section>
    <section id="additional">
      <h2>4. Weitere Angaben</h2>
      <DisplayField key="isoMetadata.contentDescription" />
      <DisplayField key="isoMetadata.technicalDescription" />
      <DisplayField key="isoMetadata.lineage" />
      <DisplayField key="isoMetadata.contentDescriptions" />
    </section>
    <section id="services">
      <h2>5. Dienste</h2>
      <DisplayField key="isoMetadata.services" />
    </section>
  </div>
</div>

<style lang="scss">
  .metadata-display {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2em;
    overflow: auto;

    .content {
      width: 80%;

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
  }
</style>
