<script module lang="ts">
  import type { Keywords, Contacts, Extent, Service, MetadataProfile, IsoTheme, MaintenanceFrequency } from '$lib/models/metadata';

  export {
    isoMetadataTitle as 'isoMetadata.title',
    isoMetadataDescription as 'isoMetadata.description',
    isoMetadataKeywords as 'isoMetadata.keywords',
    isoMetadataPreview as 'isoMetadata.preview',
    isoMetadataContacts as 'isoMetadata.contacts',
    isoMetadataMetadataProfile as 'isoMetadata.metadataProfile',
    isoMetadataPrivacy as 'isoMetadata.privacy',
    isoMetadataTermsOfUse as 'isoMetadata.termsOfUse',
    isoMetadataAnnexTheme as 'isoMetadata.annexTheme',
    isoMetadataQualityReportCheck as 'isoMetadata.qualityReportCheck',
    isoMetadataTopicCategory as 'isoMetadata.topicCategory',
    isoMetadataCreated as 'isoMetadata.created',
    isoMetadataPublished as 'isoMetadata.published',
    isoMetadataMaintenanceFrequency as 'isoMetadata.maintenanceFrequency',
    isoMetadataLastUpdated as 'isoMetadata.lastUpdated',
    isoMetadataValidityRange as 'isoMetadata.validityRange',
    isoMetadataDeliveredCoordinateSystem as 'isoMetadata.deliveredCoordinateSystem',
    isoMetadataCoordinateSystem as 'isoMetadata.coordinateSystem',
    isoMetadataExtent as 'isoMetadata.extent',
    isoMetadataResolution as 'isoMetadata.resolution',
    isoMetadataContentDescription as 'isoMetadata.contentDescription',
    isoMetadataTechnicalDescription as 'isoMetadata.technicalDescription',
    isoMetadataLineage as 'isoMetadata.lineage',
    isoMetadataAdditionalInformation as 'isoMetadata.additionalInformation',
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
    unknown: 'unbekannt',
  };

</script>

{#snippet isoMetadataTitle(value: string)}
  {value}
{/snippet}

{#snippet isoMetadataDescription(value: string)}
  {value}
{/snippet}

{#snippet isoMetadataKeywords(value: Keywords)}
  {value?.default?.map(({keyword}) => keyword)?.join(', ')}
{/snippet}

{#snippet isoMetadataPreview(value: string)}
  {value}
{/snippet}

{#snippet isoMetadataContacts(value: Contacts)}
  <div class="contacts">
    {#each value as contact}
      <div class="contact">
        <div>
          <strong class="contact-label">Organisation</strong>
          <span class="contact-value">{contact.organisation}</span>
        </div>
        <div>
          <strong class="contact-label">Telefon</strong>
          <span class="contact-value">{contact.phone}</span>
        </div>
        <div>
          <strong class="contact-label">E-Mail</strong>
          <span class="contact-value">{contact.email}</span>
        </div>
        <div>
          <strong class="contact-label">URL</strong>
          <span class="contact-value">{contact.url}</span>
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

{#snippet isoMetadataPrivacy(value: string)}
  {JSON.stringify(value)}
{/snippet}

{#snippet isoMetadataTermsOfUse(value: string)}
  {JSON.stringify(value)}
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

{#snippet isoMetadataLastUpdated(value: string)}
  {new Date(value).toLocaleDateString()}
{/snippet}

{#snippet isoMetadataValidityRange(value: string)}
  {value}
{/snippet}

{#snippet isoMetadataDeliveredCoordinateSystem(value: string)}
  {value}
{/snippet}

{#snippet isoMetadataCoordinateSystem(value: string)}
  {value}
{/snippet}

{#snippet isoMetadataExtent(value: Extent)}
  {`${value.minx}, ${value.miny}, ${value.maxx}, ${value.maxy}`}
{/snippet}

{#snippet isoMetadataResolution(value: string)}
  {value}
{/snippet}

{#snippet isoMetadataContentDescription(value: string)}
  {value}
{/snippet}

{#snippet isoMetadataTechnicalDescription(value: string)}
  {value}
{/snippet}

{#snippet isoMetadataLineage(value: string)}
  {value}
{/snippet}

{#snippet isoMetadataAdditionalInformation(value: string)}
  {value}
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
        {#if service?.columns}
          <div class="subheader">Attribute</div>
          <div class="columns">
            {#each service?.columns || [] as columnInfo}
              <fieldset class="service-column">
                <div>
                  <strong>Attribut-Name</strong>
                  <span>{columnInfo.name}</span>
                </div>
                <div>
                  <strong>Attribut-Alias</strong>
                  <span>{columnInfo.title}</span>
                </div>
                <div>
                  <strong>Attribut-Typ</strong>
                  <span>{columnInfo.type}</span>
                </div>
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

{#snippet clientMetadataPrivacy(value: string)}
  {value}
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

  .contacts {
    display: flex;
    flex-direction: column;
    gap: 1.5em;

    .contact {
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
      gap: 1em;

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
