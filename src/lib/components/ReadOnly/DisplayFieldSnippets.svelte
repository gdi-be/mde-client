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
    ContentDescription
  } from '$lib/models/metadata';
  import type { Option } from '$lib/models/form';

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
    clientMetadataHighValueDataset as 'clientMetadata.highValueDataset',
    technicalMetadataCategories as 'technicalMetadata.categories'
  };

  const getIsoThemes = async () => {
    const response = await fetch('/data/iso_themes');
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
    return response.json();
  };

  const getPrivacy = async () => {
    const response = await fetch('/data/privacy');
    return response.json();
  };

  const getCrs = async () => {
    const response = await fetch('/data/crs');
    return response.json();
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
        <div>
          <strong class="list-item-label">Name</strong>
          <span class="list-item-value">{contact.name}</span>
        </div>
        <div>
          <strong class="list-item-label">Organisation</strong>
          <span class="list-item-value">{contact.organisation}</span>
        </div>
        <div>
          <strong class="list-item-label">Telefon</strong>
          <span class="list-item-value">{contact.phone}</span>
        </div>
        <div>
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
        <div>
          <strong class="list-item-label">Title</strong>
          <span class="list-item-value">{lineage.title}</span>
        </div>
        <div>
          <strong class="list-item-label">Veröffentlichungsdatum</strong>
          <span class="list-item-value">{lineage.date || 'Keine Angaben'}</span>
        </div>
        <div>
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
        <div>
          <strong class="list-item-label">Title</strong>
          <span class="list-item-value">{contentDescription.description}</span>
        </div>
        <div>
          <strong class="list-item-label">Url</strong>
          <span class="list-item-value">{contentDescription.url || 'Keine Angaben'}</span>
        </div>
      </div>
    {/each}
  </fieldset>
{/snippet}

{#snippet isoMetadataServices(services: Service[])}
  <div class="services">
    {#each services as service}
      <fieldset class="service">
        <div>
          <strong>Titel</strong>
          <span>{service.title}</span>
        </div>
        <div>
          <strong>Typ</strong>
          <span>{service.serviceType}</span>
        </div>
        <div>
          <strong>Kurzbeschreibung</strong>
          <span>{service.shortDescription}</span>
        </div>
        <div>
          <strong>Service Identifier</strong>
          <span>{service.serviceIdentification}</span>
        </div>
        <div>
          <strong>File Identifier</strong>
          <span>{service.fileIdentifier}</span>
        </div>
        {#if service.featureTypes?.length}
          <div class="subheader">Feature-Typen</div>
          <div class="feature-types">
            {#each service?.featureTypes || [] as featureType}
              <fieldset class="service-feature-type">
                <div>
                  <strong>Feature-Typ</strong>
                  <span>{featureType.name}</span>
                </div>
                <div>
                  <strong>Feature-Typ-Alias</strong>
                  <span>{featureType.title}</span>
                </div>
                {#if featureType?.columns}
                  <div class="subheader">Attribute</div>
                  <div class="columns">
                    {#each featureType?.columns || [] as columnInfo}
                      <fieldset class="service-column">
                        <div>
                          <strong>Attribut-Name</strong>
                          <span>{columnInfo.name}</span>
                        </div>
                        <div>
                          <strong>Attribut-Alias</strong>
                          <span>{columnInfo.alias}</span>
                        </div>
                        <div>
                          <strong>Attribut-Typ</strong>
                          <span>{columnInfo.type}</span>
                        </div>
                      </fieldset>
                    {/each}
                  </div>
                {/if}
              </fieldset>
            {/each}
          </div>
        {/if}
        {#if service?.downloads}
          <div class="subheader">Downloads</div>
          <div class="downloads">
            {#each service?.downloads || [] as downloadInfo}
              <fieldset class="service-download">
                <div>
                  <strong>Download-Titel</strong>
                  <span>{downloadInfo.title}</span>
                </div>
                <div>
                  <strong>Download-Typ</strong>
                  <span>{downloadInfo.type}</span>
                </div>
                <div>
                  <strong>Download-URL</strong>
                  <span>{downloadInfo.href}</span>
                </div>
                <div>
                  <strong>Download-Dateigröße</strong>
                  <span>{downloadInfo.fileSize}</span>
                </div>
              </fieldset>
            {/each}
          </div>
        {/if}
      </fieldset>
    {/each}
  </div>
{/snippet}

{#snippet clientMetadataHighValueDataset(value: boolean)}
  {value ? 'Ja' : 'Nein'}
{/snippet}

{#snippet technicalMetadataCategories(value: string[])}
  {value.join(', ')}
{/snippet}

<style lang="scss">
  fieldset {
    border-radius: 0.5em;
  }

  .subheader {
    margin-top: 2em;
    font-weight: bold;
  }

  .list {
    display: flex;
    flex-direction: column;
    gap: 1.5em;

    .list-item {
      display: flex;
      flex-direction: column;
      gap: 0.5em;

      div {
        display: flex;
        gap: 1em;

        strong {
          flex: 1;
          text-align: right;
        }

        span {
          flex: 8;
        }
      }
    }
  }

  .services {
    display: flex;
    flex-direction: column;
    gap: 1.5em;

    .service {
      display: flex;
      flex-direction: column;

      div {
        display: flex;
        gap: 2em;

        strong {
          flex: 1;
          text-align: right;
        }

        span {
          flex: 5;
        }
      }

      .feature-types,
      .columns,
      .downloads {
        margin-left: 2em;
        padding: 1em;
        display: flex;
        flex-direction: column;
      }
    }
  }
</style>
