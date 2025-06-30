<script module lang="ts">
  import type {
    Keywords,
    Contacts,
    Extent,
    Service,
    MetadataProfile,
    IsoTheme,
    MaintenanceFrequency,
    TermsOfUse,
    Lineage,
    ContentDescription,
    MetadataCollection,
    Layer
  } from '$lib/models/metadata';

  import type { Option } from '$lib/models/form';
  import { toast } from 'svelte-french-toast';

  export {
    defaultSnippet,
    isoMetadataTitle as 'isoMetadata.title',
    isoMetadataDescription as 'isoMetadata.description',
    isoMetadataKeywords as 'isoMetadata.keywords',
    isoMetadataPreview as 'isoMetadata.preview',
    isoMetadataContacts as 'isoMetadata.pointsOfContact',
    isoMetadataMetadataProfile as 'isoMetadata.metadataProfile',
    isoMetadataTermsOfUse as 'isoMetadata.termsOfUseId',
    isoMetadataAnnexTheme as 'isoMetadata.annexTheme',
    isoMetadataQualityReportCheck as 'isoMetadata.qualityReportCheck',
    isoMetadataTopicCategory as 'isoMetadata.topicCategory',
    isoMetadataCreated as 'isoMetadata.created',
    isoMetadataPublished as 'isoMetadata.published',
    isoMetadataMaintenanceFrequency as 'isoMetadata.maintenanceFrequency',
    isoMetadataModified as 'isoMetadata.modified',
    isoMetadataValidFrom as 'isoMetadata.validFrom',
    isoMetadataValidTo as 'isoMetadata.validTo',
    technialMetadataDeliveredCrs as 'isoMetadata.deliveredCoordinateSystem',
    isoMetadataCrs as 'isoMetadata.crs',
    isoMetadataExtent as 'isoMetadata.extent',
    isoMetadataResolutions as 'isoMetadata.resolutions',
    isoMetadataTechnicalDescription as 'isoMetadata.technicalDescription',
    isoMetadataLineage as 'isoMetadata.lineage',
    isoMetadataContentDescriptions as 'isoMetadata.contentDescriptions',
    isoMetadataServices as 'isoMetadata.services',
    clientMetadataPrivacy as 'clientMetadata.privacy',
    isoMetadataHighValueDataset as 'isoMetadata.highValueDataset',
    technicalMetadataCategories as 'technicalMetadata.categories'
  };

  const getIsoThemes = async () => {
    const response = await fetch('/data/iso_themes');

    if (!response.ok) {
      toast.error('Fehler beim Abrufen der ISO Themen');
      return [];
    }

    return response.json();
  };

  const maintenanceFrequencyMap: Record<MaintenanceFrequency, string> = {
    continual: 'kontinuierlich',
    daily: 'täglich',
    weekly: 'wöchentlich',
    fortnightly: 'vierzehntägig',
    monthly: 'monatlich',
    quarterly: 'vierteljährlich',
    biannually: 'halbjährlich',
    annually: 'jährlich',
    asNeeded: 'bei Bedarf',
    irregular: 'unregelmäßig',
    notPlanned: 'nicht geplant',
    unknown: 'unbekannt'
  };

  const getTermsOfUse = async () => {
    const response = await fetch('/data/terms_of_use');

    if (!response.ok) {
      toast.error('Fehler beim Abrufen der Nutzungsbedingungen');
      return [];
    }

    return response.json();
  };

  const getPrivacy = async () => {
    const response = await fetch('/data/privacy');

    if (!response.ok) {
      toast.error('Fehler beim Abrufen der Datenschutzoptionen');
      return [];
    }

    return response.json();
  };

  const getCrs = async () => {
    const response = await fetch('/data/crs');

    if (!response.ok) {
      toast.error('Fehler beim Abrufen der Koordinatensysteme');
      return [];
    }

    return response.json();
  };

  const getLayers = (service: Service, metadata?: MetadataCollection): Layer[] => {
    if (!service || !metadata) {
      return [];
    }
    const layersMap = metadata?.clientMetadata?.layers;
    const serviceIdentification = service?.serviceIdentification;
    if (!layersMap || !serviceIdentification) {
      return [];
    }
    return layersMap[serviceIdentification] || [];
  };
</script>

{#snippet defaultSnippet(value: string)}
  {value}
{/snippet}

{#snippet isoMetadataTitle(value: string)}
  {value}
{/snippet}

{#snippet isoMetadataDescription(value: string)}
  {value}
{/snippet}

{#snippet isoMetadataKeywords(value: Keywords)}
  {value?.default?.map(({ keyword }) => keyword)?.join(', ')}
{/snippet}

{#snippet isoMetadataPreview(value: string)}
  {value}
{/snippet}

{#snippet isoMetadataContacts(value: Contacts)}
  <div class="list">
    {#each value as contact}
      <div class="list-item">
        <div class="list-item-field">
          <strong>Name</strong>
          <span class="list-item-value">{contact.name}</span>
        </div>
        <div class="list-item-field">
          <strong>Organisation</strong>
          <span class="list-item-value">{contact.organisation}</span>
        </div>
        <div class="list-item-field">
          <strong>Telefon</strong>
          <span class="list-item-value">{contact.phone}</span>
        </div>
        <div class="list-item-field">
          <strong>E-Mail</strong>
          <span class="list-item-value">{contact.email}</span>
        </div>
      </div>
    {/each}
  </div>
{/snippet}

{#snippet isoMetadataMetadataProfile(value: MetadataProfile)}
  {#if value === 'INSPIRE_HARMONISED'}INSPIRE harmonisiert{/if}
  {#if value === 'INSPIRE_IDENTIFIED'}INSPIRE identifiziert{/if}
  {#if value === 'ISO'}ISO{/if}
  {#if !value}Nicht angegeben{/if}
{/snippet}

{#snippet clientMetadataPrivacy(value: string)}
  {#await getPrivacy()}
    Lädt ...
  {:then data}
    {(data as Option[]).find((option) => option.key === value)?.label || 'Nicht angegeben'}
  {/await}
{/snippet}

{#snippet isoMetadataTermsOfUse(value: string)}
  {#await getTermsOfUse()}
    Lädt ...
  {:then data}
    {(data as TermsOfUse[]).find((entry: TermsOfUse) => entry.id === Number(value))?.shortname}
  {/await}
{/snippet}

{#snippet isoMetadataAnnexTheme(value: string)}
  {JSON.stringify(value)}
{/snippet}

{#snippet isoMetadataQualityReportCheck(value: string)}
  {JSON.stringify(value)}
{/snippet}

{#snippet isoMetadataTopicCategory(value: string)}
  {#await getIsoThemes()}
    Lädt ...
  {:then data}
    {data.find((entry: IsoTheme) => entry.isoID === value)?.isoName}
  {/await}
{/snippet}

{#snippet isoMetadataCreated(value: string)}
  {new Date(value).toLocaleDateString()}
{/snippet}

{#snippet isoMetadataPublished(value: string)}
  {new Date(value).toLocaleDateString()}
{/snippet}

{#snippet isoMetadataMaintenanceFrequency(value: MaintenanceFrequency)}
  {maintenanceFrequencyMap[value]}
{/snippet}

{#snippet isoMetadataModified(value: string)}
  {new Date(value).toLocaleDateString()}
{/snippet}

{#snippet isoMetadataValidFrom(value: string)}
  {new Date(value).toLocaleDateString()}
{/snippet}

{#snippet isoMetadataValidTo(value: string)}
  {new Date(value).toLocaleDateString()}
{/snippet}

{#snippet technialMetadataDeliveredCrs(value: string)}
  {value}
{/snippet}

{#snippet isoMetadataCrs(value: string)}
  {#await getCrs()}
    Lädt ...
  {:then data}
    {(data as Option[]).find((option) => option.key === value)?.label || 'Nicht angegeben'}
  {/await}
{/snippet}

{#snippet isoMetadataExtent(value: Extent)}
  {`${value.minx}, ${value.miny}, ${value.maxx}, ${value.maxy}`}
{/snippet}

{#snippet isoMetadataResolutions(value: string)}
  {value}
{/snippet}

{#snippet isoMetadataTechnicalDescription(value: string)}
  {value}
{/snippet}

{#snippet isoMetadataLineage(value: Lineage[])}
  <div class="list">
    {#each value as lineage}
      <div class="list-item">
        <div class="list-item-field">
          <strong>Title</strong>
          <span class="list-item-value">{lineage.title}</span>
        </div>
        <div class="list-item-field">
          <strong>Veröffentlichungsdatum</strong>
          <span class="list-item-value">{lineage.date || 'Keine Angaben'}</span>
        </div>
        <div class="list-item-field">
          <strong>Identifier</strong>
          <span class="list-item-value">{lineage.identifier || 'Keine Angaben'}</span>
        </div>
      </div>
    {/each}
  </div>
{/snippet}

{#snippet isoMetadataContentDescriptions(value: ContentDescription[])}
  <div class="list">
    {#each value as contentDescription}
      <div class="list-item">
        <div class="list-item-field">
          <strong>Title</strong>
          <span class="list-item-value">{contentDescription.description}</span>
        </div>
        <div class="list-item-field">
          <strong>Url</strong>
          <span class="list-item-value">{contentDescription.url || 'Keine Angaben'}</span>
        </div>
      </div>
    {/each}
  </div>
{/snippet}

{#snippet isoMetadataServices(services: Service[], metadata: MetadataCollection)}
  {#if services.length === 0}
    <span>Keine Angabe</span>
  {/if}
  <div class="list">
    {#each services as service}
      {@const layers = getLayers(service, metadata)}
      <div class="list-item">
        <div class="list-item-field">
          <strong>Titel</strong>
          <span class="list-item-value">{service.title}</span>
        </div>
        <div class="list-item-field">
          <strong>Typ</strong>
          <span class="list-item-value">{service.serviceType}</span>
        </div>
        <div class="list-item-field">
          <strong>Kurzbeschreibung</strong>
          <span class="list-item-value">{service.shortDescription}</span>
        </div>
        {#if service.serviceType === 'WMS' || service.serviceType === 'WMTS'}
          <div class="list-item-field">
            <strong>Identifikator des Kartendienstes</strong>
            <span class="list-item-value">{service.workspace}</span>
          </div>
        {/if}
        <div class="list-item-field">
          <strong>Service Identifier</strong>
          <span class="list-item-value">{service.serviceIdentification}</span>
        </div>
        <div class="list-item-field">
          <strong>File Identifier</strong>
          <span class="list-item-value">{service.fileIdentifier}</span>
        </div>

        {#if service.featureTypes?.length}
          <div class="list-item-field">
            <strong>Feature-Typen</strong>
            <div class="list">
              {#each service?.featureTypes || [] as featureType}
                <div class="list-item">
                  <div class="list-item-field">
                    <strong>Feature-Typ</strong>
                    <span class="list-item-value">{featureType.name}</span>
                  </div>
                  <div class="list-item-field">
                    <strong>Feature-Typ-Alias</strong>
                    <span class="list-item-value">{featureType.title}</span>
                  </div>
                  {#if featureType?.columns}
                    <div class="list-item-field">
                      <strong>Attribute</strong>
                      <div class="list">
                        {#each featureType?.columns || [] as columnInfo}
                          <div class="list-item">
                            <div class="list-item-field">
                              <strong>Attribut-Name</strong>
                              <span class="list-item-value">{columnInfo.name}</span>
                            </div>
                            <div class="list-item-field">
                              <strong>Attribut-Alias</strong>
                              <span class="list-item-value">{columnInfo.alias}</span>
                            </div>
                            <div class="list-item-field">
                              <strong>Attribut-Typ</strong>
                              <span class="list-item-value">{columnInfo.type}</span>
                            </div>
                          </div>
                        {/each}
                      </div>
                    </div>
                  {/if}
                </div>
              {/each}
            </div>
          </div>
        {/if}

        {#if layers?.length}
          <div class="list-item-field">
            <strong>Kartenebenen</strong>
            <div class="list">
              {#each layers || [] as layer}
                <div class="list-item">
                  <div class="list-item-field">
                    <strong>Titel der Kartenebene</strong>
                    <span class="list-item-value">{layer.title}</span>
                  </div>
                  <div class="list-item-field">
                    <strong>Name der Kartenebene</strong>
                    <span class="list-item-value">{layer.name}</span>
                  </div>
                  <div class="list-item-field">
                    <strong>Titel des Styles</strong>
                    <span class="list-item-value">{layer.styleTitle}</span>
                  </div>
                  <div class="list-item-field">
                    <strong>Name des Styles</strong>
                    <span class="list-item-value">{layer.styleName}</span>
                  </div>
                  <div class="list-item-field">
                    <strong>Legende</strong>
                    <span class="list-item-value">{layer.legendImage}</span>
                  </div>
                  <div class="list-item-field">
                    <strong>Kurzbeschreibung</strong>
                    <span class="list-item-value">{layer.shortDescription}</span>
                  </div>
                  <div class="list-item-field">
                    <strong>Ablageort der Daten</strong>
                    <span class="list-item-value">{layer.datasource}</span>
                  </div>
                  <div class="list-item-field">
                    <strong>sekundäre Datenhaltung</strong>
                    <span class="list-item-value">{layer.secondaryDatasource}</span>
                  </div>
                </div>
              {/each}
            </div>
          </div>
        {/if}

        {#if service?.downloads}
          <div class="list-item-field">
            <strong>Downloads</strong>
            <div class="list">
              {#each service?.downloads || [] as downloadInfo}
                <div class="list-item">
                  <div class="list-item-field">
                    <strong>Download-Titel</strong>
                    <span class="list-item-value">{downloadInfo.title}</span>
                  </div>
                  <div class="list-item-field">
                    <strong>Download-Typ</strong>
                    <span class="list-item-value">{downloadInfo.type}</span>
                  </div>
                  <div class="list-item-field">
                    <strong>Download-URL</strong>
                    <span class="list-item-value">{downloadInfo.href}</span>
                  </div>
                  <div class="list-item-field">
                    <strong>Download-Dateigröße</strong>
                    <span class="list-item-value">{downloadInfo.fileSize}</span>
                  </div>
                </div>
              {/each}
            </div>
          </div>
        {/if}
      </div>
    {/each}
  </div>
{/snippet}

{#snippet isoMetadataHighValueDataset(value: boolean)}
  {value ? 'Ja' : 'Nein'}
{/snippet}

{#snippet technicalMetadataCategories(value: string[])}
  {value.join(', ')}
{/snippet}

<style lang="scss">
  .list {
    max-width: 100%;

    .list {
      padding: 0 0 0 1.5em;
      margin: 0.5em 0 0 0;
      background: transparent;
    }

    .list-item {
      break-inside: avoid;
      display: table;
      width: 100%;
      padding: 0.5em 0.35em;

      &:nth-child(even) {
        background: rgba(0, 0, 0, 0.05);
      }

      &:last-child {
        margin-bottom: 0;
      }

      .list-item-field {
        display: table;
        width: 100%;

        &:has(> .list) {
          display: flex;
          flex-direction: column;

          > strong {
            font-weight: 600;
          }

          .list {
            margin: 0;
          }
        }

        &:nth-child(even) {
          background: rgba(0, 0, 0, 0.05);
        }

        strong {
          display: table-cell;
          width: 33%;
          padding-right: 1em;
          font-weight: 500;
          color: #333;
          vertical-align: top;
        }

        .list-item-value {
          display: table-cell;
          vertical-align: top;
          color: #333;
        }
      }
    }
  }

  @media print {
    .list {
      page-break-inside: avoid;
      font-size: 9pt;
      padding: 0;
      box-shadow: none;
      max-width: 100%;

      .list {
        padding-left: 1em;
      }

      .list-item {
        padding: 0.25em 0;
        border-bottom: 1px solid #eee;

        &:last-child {
          border-bottom: none;
        }

        &:nth-child(even) {
          background: none;
        }
      }

      .list-item-field:has(> .list) strong {
        border-bottom-color: #ccc;
      }
    }
  }
</style>
