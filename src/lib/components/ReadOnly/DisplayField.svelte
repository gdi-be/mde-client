<script lang="ts">
  import { getValue } from "$lib/context/FormContext.svelte";
  import type { FieldKey } from "$lib/models/form";
  import type { Snippet } from "svelte";
  import * as DisplayFieldSnippets from "./DisplayFieldSnippets.svelte";

  type DisplayFieldProps = {
    key: FieldKey;
  };

  const {
    key
  }: DisplayFieldProps = $props();

  const value = $derived(getValue(key));

  const germanTitles: Record<FieldKey, string> = {
    'isoMetadata.title': 'Titel des Datenbestandes',
    'isoMetadata.description': 'Kurzbeschreibung des Datenbestandes',
    'isoMetadata.keywords': 'Schlagwörter',
    'isoMetadata.preview': 'Vorschaubild',
    'isoMetadata.contacts': 'Kontaktangaben',
    'isoMetadata.metadataProfile': 'INSPIRE Relevanz',
    'isoMetadata.privacy': 'Datenschutz-Einstellungen',
    'isoMetadata.termsOfUse': 'Nutzungsbestimmungen',
    'isoMetadata.annexTheme': 'INSPIRE Annex Thema',
    'isoMetadata.qualityReportCheck': 'Überprüfung des Qualitätsberichts',
    'isoMetadata.highValueDataset': 'High Value Datensatz',
    'isoMetadata.topicCategory': 'Themenkategorie',
    'isoMetadata.created': 'Erstellungsdatum',
    'isoMetadata.published': 'Veröffentlichungsdatum',
    'isoMetadata.maintenanceFrequency': 'Pflegeintervall',
    'isoMetadata.lastUpdated': 'letzte Aktualisierung',
    'isoMetadata.validityRange': 'Gültigkeitszeitraum',
    'isoMetadata.deliveredCoordinateSystem': 'geliefertes Koordinatensystem',
    'isoMetadata.coordinateSystem': 'abzugebendes Koordinatensystem',
    'isoMetadata.extent': 'Räumliche Ausdehnung',
    'isoMetadata.resolution': 'Bodenauflösung',
    'isoMetadata.contentDescription': 'Inhaltliche Beschreibung',
    'isoMetadata.technicalDescription': 'Technische Beschreibung',
    'isoMetadata.lineage': 'Herkunft der Daten',
    'isoMetadata.additionalInformation': 'Weitere Informationen',
    'isoMetadata.services': 'Dienste',
    'clientMetadata.privacy': 'Datenschutz-Einstellungen',
    'clientMetadata.highValueDataset': 'High Value Datensatz',
    'technicalMetadata.categories': 'Kategorien'
  };

  const valueSnippet: Snippet<[unknown]> = $derived(
    DisplayFieldSnippets[key as keyof typeof DisplayFieldSnippets] as Snippet
  );

</script>

<div class="display-field">
  <strong class="title">{germanTitles[key]}</strong>
  {#if value}
    <span class="value">
      {@render valueSnippet(value)}
    </span>
  {:else}
    <span class="value">Keine Angabe</span>
  {/if}
</div>

<style lang="scss">
  .display-field {
    display: flex;
    gap: 2em;
    padding: 1em 0;

    strong.title {
      flex: 1;
      text-align: right;
      font-size: 1.1em;
    }

    span.value {
      flex: 4;
    }
  }
</style>
