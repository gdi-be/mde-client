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
  <fieldset class="list">
    {#each value as contact}
      <div class="list-item">
        <div class="list-item-field">
          <strong class="list-item-label">Name</strong>
          <span class="list-item-value">{contact.name}</span>
        </div>
        <div class="list-item-field">
          <strong class="list-item-label">Organisation</strong>
          <span class="list-item-value">{contact.organisation}</span>
        </div>
        <div class="list-item-field">
          <strong class="list-item-label">Telefon</strong>
          <span class="list-item-value">{contact.phone}</span>
        </div>
        <div class="list-item-field">
          <strong class="list-item-label">E-Mail</strong>
          <span class="list-item-value">{contact.email}</span>
        </div>
      </div>
    {/each}
  </fieldset>
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
  <fieldset class="list">
    {#each value as lineage}
      <div class="list-item">
        <div class="list-item-field">
          <strong class="list-item-label">Title</strong>
          <span class="list-item-value">{lineage.title}</span>
        </div>
        <div class="list-item-field">
          <strong class="list-item-label">Veröffentlichungsdatum</strong>
          <span class="list-item-value">{lineage.date || 'Keine Angaben'}</span>
        </div>
        <div class="list-item-field">
          <strong class="list-item-label">Identifier</strong>
          <span class="list-item-value">{lineage.identifier || 'Keine Angaben'}</span>
        </div>
      </div>
    {/each}
  </fieldset>
{/snippet}

{#snippet isoMetadataContentDescriptions(value: ContentDescription[])}
  <fieldset class="list">
    {#each value as contentDescription}
      <div class="list-item">
        <div class="list-item-field">
          <strong class="list-item-label">Title</strong>
          <span class="list-item-value">{contentDescription.description}</span>
        </div>
        <div class="list-item-field">
          <strong class="list-item-label">Url</strong>
          <span class="list-item-value">{contentDescription.url || 'Keine Angaben'}</span>
        </div>
      </div>
    {/each}
  </fieldset>
{/snippet}

{#snippet isoMetadataServices(services: Service[], metadata: MetadataCollection)}
  {#if services.length === 0}
    <span>Keine Angabe</span>
  {/if}
  <fieldset class="list">
    {#each services as service}
      {@const layers = getLayers(service, metadata)}
      <div class="list-item">
        <div class="list-item-field">
          <strong class="list-item-label">Titel</strong>
          <span class="list-item-value">{service.title}</span>
        </div>
        <div class="list-item-field">
          <strong class="list-item-label">Typ</strong>
          <span class="list-item-value">{service.serviceType}</span>
        </div>
        <div class="list-item-field">
          <strong class="list-item-label">Kurzbeschreibung</strong>
          <span class="list-item-value">{service.shortDescription}</span>
        </div>
        {#if service.serviceType === 'WMS' || service.serviceType === 'WMTS'}
          <div class="list-item-field">
            <strong class="list-item-label">Identifikator des Kartendienstes</strong>
            <span class="list-item-value">{service.workspace}</span>
          </div>
        {/if}
        <div class="list-item-field">
          <strong class="list-item-label">Service Identifier</strong>
          <span class="list-item-value">{service.serviceIdentification}</span>
        </div>
        <div class="list-item-field">
          <strong class="list-item-label">File Identifier</strong>
          <span class="list-item-value">{service.fileIdentifier}</span>
        </div>

        {#if service.featureTypes?.length}
          <div class="list-item-field">
            <strong class="list-item-label">Feature-Typen</strong>
            <fieldset class="list">
              {#each service?.featureTypes || [] as featureType}
                <div class="list-item">
                  <div class="list-item-field">
                    <strong class="list-item-label">Feature-Typ</strong>
                    <span class="list-item-value">{featureType.name}</span>
                  </div>
                  <div class="list-item-field">
                    <strong class="list-item-label">Feature-Typ-Alias</strong>
                    <span class="list-item-value">{featureType.title}</span>
                  </div>
                  {#if featureType?.columns}
                    <div class="list-item-field">
                      <strong class="list-item-label">Attribute</strong>
                      <fieldset class="list">
                        {#each featureType?.columns || [] as columnInfo}
                          <div class="list-item">
                            <div class="list-item-field">
                              <strong class="list-item-label">Attribut-Name</strong>
                              <span class="list-item-value">{columnInfo.name}</span>
                            </div>
                            <div class="list-item-field">
                              <strong class="list-item-label">Attribut-Alias</strong>
                              <span class="list-item-value">{columnInfo.alias}</span>
                            </div>
                            <div class="list-item-field">
                              <strong class="list-item-label">Attribut-Typ</strong>
                              <span class="list-item-value">{columnInfo.type}</span>
                            </div>
                          </div>
                        {/each}
                      </fieldset>
                    </div>
                  {/if}
                </div>
              {/each}
            </fieldset>
          </div>
        {/if}

        {#if layers?.length}
          <div class="list-item-field">
            <strong class="list-item-label">Kartenebenen</strong>
            <fieldset class="list">
              {#each layers || [] as layer}
                <div class="list-item">
                  <div class="list-item-field">
                    <strong class="list-item-label">Titel der Kartenebene</strong>
                    <span class="list-item-value">{layer.title}</span>
                  </div>
                  <div class="list-item-field">
                    <strong class="list-item-label">Name der Kartenebene</strong>
                    <span class="list-item-value">{layer.name}</span>
                  </div>
                  <div class="list-item-field">
                    <strong class="list-item-label">Titel des Styles</strong>
                    <span class="list-item-value">{layer.styleTitle}</span>
                  </div>
                  <div class="list-item-field">
                    <strong class="list-item-label">Name des Styles</strong>
                    <span class="list-item-value">{layer.styleName}</span>
                  </div>
                  <div class="list-item-field">
                    <strong class="list-item-label">Legende</strong>
                    <span class="list-item-value">{layer.legendImage}</span>
                  </div>
                  <div class="list-item-field">
                    <strong class="list-item-label">Kurzbeschreibung</strong>
                    <span class="list-item-value">{layer.shortDescription}</span>
                  </div>
                  <div class="list-item-field">
                    <strong class="list-item-label">Ablageort der Daten</strong>
                    <span class="list-item-value">{layer.datasource}</span>
                  </div>
                  <div class="list-item-field">
                    <strong class="list-item-label">sekundäre Datenhaltung</strong>
                    <span class="list-item-value">{layer.secondaryDatasource}</span>
                  </div>
                </div>
              {/each}
            </fieldset>
          </div>
        {/if}

        {#if service?.downloads}
          <div class="list-item-field">
            <strong class="list-item-label">Downloads</strong>
            <fieldset class="list">
              {#each service?.downloads || [] as downloadInfo}
                <div class="list-item">
                  <div class="list-item-field">
                    <strong class="list-item-label">Download-Titel</strong>
                    <span class="list-item-value">{downloadInfo.title}</span>
                  </div>
                  <div class="list-item-field">
                    <strong class="list-item-label">Download-Typ</strong>
                    <span class="list-item-value">{downloadInfo.type}</span>
                  </div>
                  <div class="list-item-field">
                    <strong class="list-item-label">Download-URL</strong>
                    <span class="list-item-value">{downloadInfo.href}</span>
                  </div>
                  <div class="list-item-field">
                    <strong class="list-item-label">Download-Dateigröße</strong>
                    <span class="list-item-value">{downloadInfo.fileSize}</span>
                  </div>
                </div>
              {/each}
            </fieldset>
          </div>
        {/if}
      </div>
    {/each}
  </fieldset>
{/snippet}

{#snippet isoMetadataHighValueDataset(value: boolean)}
  {value ? 'Ja' : 'Nein'}
{/snippet}

{#snippet technicalMetadataCategories(value: string[])}
  {value.join(', ')}
{/snippet}

<style lang="scss">
  fieldset {
    border-radius: 0.5em;
  }

  .list {
    display: flex;
    flex-direction: column;
    gap: 1.5em;

    .list-item {
      display: flex;
      flex-direction: column;

      &:nth-of-type(even) {
        background: rgba(0, 0, 0, 0.05);
      }

      .list-item-field {
        display: flex;
        flex-direction: column;
        &:nth-of-type(even) {
          background: rgba(0, 0, 0, 0.05);
        }

        .list-item-value {
          margin-bottom: 0.25em;
        }

        &:has(fieldset) {
          margin-top: 1em;
        }
      }
    }
  }
</style>
