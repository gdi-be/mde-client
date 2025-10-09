<script lang="ts">
  import { getValue } from '$lib/context/FormContext.svelte';
  import CommentsDisplay from './CommentsDisplay.svelte';
  import DisplayField from './DisplayField.svelte';

  const metadataProfile = $derived(getValue('isoMetadata.metadataProfile'));
  const highValueDataset = $derived(getValue('isoMetadata.highValueDataset'));
</script>

<div class="metadata-display">
  <div class="content">
    <DisplayField key="isoMetadata.identifier" label="Identifier" />
    <DisplayField key="isoMetadata.fileIdentifier" label="File-Identifier" />
    <section id="basedata">
      <h2>1. Basisangaben</h2>
      <DisplayField key="isoMetadata.title" profileId={1} />
      <DisplayField key="isoMetadata.description" profileId={2} />
      <DisplayField key="isoMetadata.keywords" profileId={15} />
      <DisplayField key="isoMetadata.preview" profileId={29} />
      <DisplayField key="isoMetadata.pointsOfContact" profileId={19} />
    </section>
    <section id="classification">
      <h2>2. Einordnung</h2>
      <DisplayField key="isoMetadata.metadataProfile" profileId={5} />
      {#if metadataProfile === 'INSPIRE_HARMONISED' || metadataProfile === 'INSPIRE_IDENTIFIED'}
        <DisplayField key="isoMetadata.inspireTheme" profileId={7} />
      {/if}
      {#if metadataProfile === 'INSPIRE_HARMONISED'}
        <DisplayField key="isoMetadata.inspireFormatName" profileId={70} />
      {/if}
      {#if metadataProfile === 'INSPIRE_HARMONISED'}
        <DisplayField key="isoMetadata.inspireAnnexVersion" profileId={38} />
      {/if}
      {#if metadataProfile === 'INSPIRE_HARMONISED'}
        <DisplayField key="isoMetadata.valid" profileId={37} />
      {/if}
      <DisplayField key="clientMetadata.privacy" profileId={4} />
      <DisplayField key="isoMetadata.termsOfUseId" profileId={25} />
      <DisplayField key="isoMetadata.termsOfUseSource" profileId={26} />
      <DisplayField key="isoMetadata.highValueDataset" profileId={6} />
      {#if highValueDataset === true}
        <DisplayField key="isoMetadata.highValueDataCategory" profileId={8} />
      {/if}
      <DisplayField key="isoMetadata.topicCategory" profileId={13} />
    </section>
    <section id="temp_and_spatial">
      <h2>3. Zeitliche und Räumliche Angaben</h2>
      <DisplayField key="isoMetadata.created" profileId={9} />
      <DisplayField key="isoMetadata.published" profileId={10} />
      <DisplayField key="isoMetadata.maintenanceFrequency" profileId={14} />
      <DisplayField key="isoMetadata.modified" profileId={11} />
      <DisplayField key="isoMetadata.validFrom" profileId={12} />
      <DisplayField key="isoMetadata.validTo" profileId={24} />
      <DisplayField key="technicalMetadata.deliveredCrs" profileId={16} />
      <DisplayField key="isoMetadata.crs" profileId={17} />
      <DisplayField key="isoMetadata.extent" profileId={18} />
      <DisplayField key="isoMetadata.resolutions" profileId={28} />
      <DisplayField key="isoMetadata.scale" profileId={27} />
    </section>
    <section id="additional">
      <h2>4. Weitere Angaben</h2>
      <DisplayField key="isoMetadata.contentDescription" profileId={30} />
      <DisplayField key="isoMetadata.technicalDescription" profileId={31} />
      <DisplayField key="isoMetadata.lineage" profileId={32} />
      <DisplayField key="clientMetadata.relatedTopics" profileId={36} />
      <DisplayField key="isoMetadata.contentDescriptions" profileId={41} />
    </section>
    <section id="services">
      <h2>5. Dienste</h2>
      <DisplayField key="isoMetadata.services" profileId={40} label="" />
    </section>
    <section id="comments">
      <h2>Kommentare</h2>
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
