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
  import { getFieldConfig, getFormContext } from '$lib/context/FormContext.svelte';

  export {
    defaultSnippet,
    clientMetadataPrivacy as 'clientMetadata.privacy',
    isoMetadataAnnexTheme as 'isoMetadata.annexTheme',
    isoMetadataContacts as 'isoMetadata.pointsOfContact',
    isoMetadataContentDescription as 'isoMetadata.contentDescription',
    isoMetadataContentDescriptions as 'isoMetadata.contentDescriptions',
    isoMetadataCreated as 'isoMetadata.created',
    isoMetadataCrs as 'isoMetadata.crs',
    isoMetadataDescription as 'isoMetadata.description',
    isoMetadataExtent as 'isoMetadata.extent',
    isoMetadataHighValueDataCategory as 'isoMetadata.highValueDataCategory',
    isoMetadataHighValueDataset as 'isoMetadata.highValueDataset',
    isoMetadataInspireAnnexVersion as 'isoMetadata.inspireAnnexVersion',
    isoMetadataInspireFormatName as 'isoMetadata.inspireFormatName',
    isoMetadataInspireTheme as 'isoMetadata.inspireTheme',
    isoMetadataKeywords as 'isoMetadata.keywords',
    isoMetadataLineage as 'isoMetadata.lineage',
    isoMetadataMaintenanceFrequency as 'isoMetadata.maintenanceFrequency',
    isoMetadataMetadataProfile as 'isoMetadata.metadataProfile',
    isoMetadataModified as 'isoMetadata.modified',
    isoMetadataPreview as 'isoMetadata.preview',
    isoMetadataPublished as 'isoMetadata.published',
    isoMetadataQualityReportCheck as 'isoMetadata.qualityReportCheck',
    isoMetadataResolutions as 'isoMetadata.resolutions',
    isoMetadataServices as 'isoMetadata.services',
    isoMetadataTechnicalDescription as 'isoMetadata.technicalDescription',
    isoMetadataTermsOfUse as 'isoMetadata.termsOfUseId',
    isoMetadataTitle as 'isoMetadata.title',
    isoMetadataTopicCategory as 'isoMetadata.topicCategory',
    isoMetadataValid as 'isoMetadata.valid',
    isoMetadataValidFrom as 'isoMetadata.validFrom',
    isoMetadataValidTo as 'isoMetadata.validTo',
    technicalMetadataDeliveredCrs as 'technicalMetadata.deliveredCrs',
    technicalMetadataCategories as 'technicalMetadata.categories'
  };

  const DEFAULT_NULL_STRING = 'Keine Angabe';

  const getInspireThemes = async (): Promise<Option[]> => {
    const response = await fetch('/data/inspire_themes');

    if (!response.ok) {
      toast.error('Fehler beim Abrufen der INSPIRE Themen');
      return [];
    }

    return response.json();
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

  const contentDescriptionsCodeMap: Record<string, string> = {
    download: 'Herunterladen',
    information: 'Information',
    offlineAccess: 'Offline-Zugriff',
    order: 'Bestellung',
    search: 'Suche'
  };

  const getAutoKeywords = async () => {
    const metadata = getFormContext()?.metadata;
    const metadataId = metadata?.metadataId;
    if (!metadataId) {
      toast.error('Metadaten-ID ist nicht verfügbar');
      return [];
    }
    const response = await fetch(`/metadata/${metadataId}/autokeywords`);

    if (!response.ok) {
      toast.error('Fehler beim Abrufen der automatisch generierten Schlagwörter');
      return [];
    }

    const data = await response.json();
    return data || [];
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

  const getHVDCategories = async () => {
    const response = await fetch('/data/hvd_categories');

    if (!response.ok) {
      toast.error('Fehler beim Abrufen der HVD Kategorien');
      return [];
    }

    return response.json();
  };

  const replaceVariable = async (value?: string) => {
    if (!value) {
      return DEFAULT_NULL_STRING;
    }
    const response = await fetch('/replace_variable', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({ value })
    });
    if (!response.ok) {
      toast.error('Fehler beim Ersetzen der Variablen');
      return value;
    }
    const data = await response.json();
    return data.value || value;
  };
</script>

{#snippet defaultSnippet(value: string)}
  {value || DEFAULT_NULL_STRING}
{/snippet}

{#snippet isoMetadataTitle(value: string)}
  {value || DEFAULT_NULL_STRING}
{/snippet}

{#snippet isoMetadataDescription(value: string)}
  {value || DEFAULT_NULL_STRING}
{/snippet}

{#snippet isoMetadataKeywords(value: Keywords)}
  {#if !value?.default?.length}
    {DEFAULT_NULL_STRING}
  {:else}
    {value?.default?.map(({ keyword }) => keyword)?.join(', ') + ','}
    {#await getAutoKeywords()}
      Lädt ...
    {:then autoKeywords}
      {autoKeywords.join(', ')}
    {/await}
  {/if}
{/snippet}

{#snippet isoMetadataPreview(value: string)}
  {#await replaceVariable(value)}
    Lädt ...
  {:then value}
    {value || DEFAULT_NULL_STRING}
  {:catch}
    {value}
  {/await}
{/snippet}

{#snippet isoMetadataContacts(value: Contacts)}
  {#if !value?.length}
    {DEFAULT_NULL_STRING}
  {:else}
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
  {/if}
{/snippet}

{#snippet isoMetadataMetadataProfile(value: MetadataProfile)}
  {#if value === 'INSPIRE_HARMONISED'}INSPIRE harmonisiert{/if}
  {#if value === 'INSPIRE_IDENTIFIED'}INSPIRE identifiziert{/if}
  {#if value === 'ISO'}ISO{/if}
  {#if !value}{DEFAULT_NULL_STRING}{/if}
{/snippet}

{#snippet clientMetadataPrivacy(value: string)}
  {#await getPrivacy()}
    Lädt ...
  {:then data}
    {(data as Option[]).find((option) => option.key === value)?.label || DEFAULT_NULL_STRING}
  {/await}
{/snippet}

{#snippet isoMetadataTermsOfUse(value: string)}
  {#await getTermsOfUse()}
    Lädt ...
  {:then data}
    {(data as TermsOfUse[]).find((entry: TermsOfUse) => entry.id === Number(value))?.shortname ||
      DEFAULT_NULL_STRING}
  {/await}
{/snippet}

{#snippet isoMetadataInspireTheme(value: string[])}
  {#await getInspireThemes()}
    Lädt ...
  {:then data}
    {#if Array.isArray(value) && value.length === 0}
      {DEFAULT_NULL_STRING}
    {:else}
      {value
        .map((themeId) => {
          const theme = data.find((entry) => entry.key === themeId);
          return theme ? theme.label : DEFAULT_NULL_STRING;
        })
        .join(', ')}
    {/if}
  {/await}
{/snippet}

{#snippet isoMetadataAnnexTheme(value: string)}
  {value ? value.toString() : DEFAULT_NULL_STRING}
{/snippet}

{#snippet isoMetadataInspireFormatName(value: string)}
  {value ? value.toString() : DEFAULT_NULL_STRING}
{/snippet}

{#snippet isoMetadataInspireAnnexVersion(value: string)}
  {value ? value.toString() : DEFAULT_NULL_STRING}
{/snippet}

{#snippet isoMetadataQualityReportCheck(value: string)}
  {value ? 'Ja' : 'Nein'}
{/snippet}

{#snippet isoMetadataTopicCategory(value: string[])}
  {#if !value?.length}
    {DEFAULT_NULL_STRING}
  {:else}
    {#await getIsoThemes()}
      Lädt ...
    {:then data}
      {value
        .map((themeId) => {
          const theme = (data as IsoTheme[]).find((entry: IsoTheme) => entry.isoID === themeId);
          return theme ? theme.isoName : DEFAULT_NULL_STRING;
        })
        .join(', ')}
    {/await}
  {/if}
{/snippet}

{#snippet isoMetadataCreated(value: string)}
  {value ? new Date(value).toLocaleDateString() : DEFAULT_NULL_STRING}
{/snippet}

{#snippet isoMetadataPublished(value: string)}
  {value ? new Date(value).toLocaleDateString() : DEFAULT_NULL_STRING}
{/snippet}

{#snippet isoMetadataMaintenanceFrequency(value: MaintenanceFrequency)}
  {value ? maintenanceFrequencyMap[value] : DEFAULT_NULL_STRING}
{/snippet}

{#snippet isoMetadataModified(value: string)}
  {value ? new Date(value).toLocaleDateString() : DEFAULT_NULL_STRING}
{/snippet}

{#snippet isoMetadataValid(value: boolean)}
  {#if value === true}
    {'Ja'}
  {:else if value === false}
    {'Nein'}
  {:else}
    {DEFAULT_NULL_STRING}
  {/if}
{/snippet}

{#snippet isoMetadataValidFrom(value: string)}
  {value ? new Date(value).toLocaleDateString() : DEFAULT_NULL_STRING}
{/snippet}

{#snippet isoMetadataValidTo(value: string)}
  {value ? new Date(value).toLocaleDateString() : DEFAULT_NULL_STRING}
{/snippet}

{#snippet technicalMetadataDeliveredCrs(value: string)}
  {value || DEFAULT_NULL_STRING}
{/snippet}

{#snippet isoMetadataCrs(value: string)}
  {#await getCrs()}
    Lädt ...
  {:then data}
    {(data as Option[]).find((option) => option.key === value)?.label || DEFAULT_NULL_STRING}
  {/await}
{/snippet}

{#snippet isoMetadataExtent(value: Extent)}
  {value
    ? `${value.minx}, ${value.miny}, ${value.maxx}, ${value.maxy} (EPSG:4326)`
    : DEFAULT_NULL_STRING}
{/snippet}

{#snippet isoMetadataResolutions(value: string)}
  {value || DEFAULT_NULL_STRING}
{/snippet}

{#snippet isoMetadataContentDescription(value: string)}
  {#await replaceVariable(value)}
    Lädt ...
  {:then value}
    {value || DEFAULT_NULL_STRING}
  {:catch}
    {value}
  {/await}
{/snippet}

{#snippet isoMetadataTechnicalDescription(value: string)}
  {#await replaceVariable(value)}
    Lädt ...
  {:then value}
    {value || DEFAULT_NULL_STRING}
  {:catch}
    {value}
  {/await}
{/snippet}

{#snippet isoMetadataLineage(value: Lineage[])}
  {#if !value?.length}
    {DEFAULT_NULL_STRING}
  {:else}
    <div class="list">
      {#each value as lineage}
        <div class="list-item">
          <div class="list-item-field">
            <!-- Lineage-Title -->
            <strong>{getFieldConfig(33)?.label}</strong>
            <span class="list-item-value">{lineage.title || DEFAULT_NULL_STRING}</span>
          </div>
          <div class="list-item-field">
            <!-- Lineage-Date -->
            <strong>{getFieldConfig(34)?.label}</strong>
            <span class="list-item-value">{lineage.date || DEFAULT_NULL_STRING}</span>
          </div>
          <div class="list-item-field">
            <!-- Lineage-Identifier -->
            <strong>{getFieldConfig(35)?.label}</strong>
            <span class="list-item-value">{lineage.identifier || DEFAULT_NULL_STRING}</span>
          </div>
        </div>
      {/each}
    </div>
  {/if}
{/snippet}

{#snippet isoMetadataContentDescriptions(value: ContentDescription[])}
  {#if !value?.length}
    {DEFAULT_NULL_STRING}
  {:else}
    <div class="list">
      {#each value as contentDescription}
        <div class="list-item">
          <div class="list-item-field">
            <strong>{getFieldConfig(42)?.label}</strong>
            <span class="list-item-value">{contentDescription.description}</span>
          </div>
          <div class="list-item-field">
            <strong>{getFieldConfig(43)?.label}</strong>
            <span class="list-item-value">
              {contentDescriptionsCodeMap[contentDescription.code]}
            </span>
          </div>
          <div class="list-item-field">
            <strong>{getFieldConfig(44)?.label}</strong>
            <span class="list-item-value">
              {#await replaceVariable(contentDescription.url)}
                Lädt ...
              {:then url}
                {url || DEFAULT_NULL_STRING}
              {:catch}
                {contentDescription.url || DEFAULT_NULL_STRING}
              {/await}
            </span>
          </div>
        </div>
      {/each}
    </div>
  {/if}
{/snippet}

{#snippet isoMetadataServices(services: Service[], metadata: MetadataCollection)}
  {#if !services?.length}
    {DEFAULT_NULL_STRING}
  {:else}
    <strong>Anzahl: {services.length}</strong>
    <div class="list">
      {#each services as service}
        {@const layers = getLayers(service, metadata)}
        <div class="list-item">
          <div class="list-item-field">
            <!-- ServiceTitle -->
            <strong>{getFieldConfig(59)?.label}</strong>
            <span class="list-item-value">{service.title}</span>
          </div>
          <div class="list-item-field">
            <!-- Service-Type -->
            <strong>{getFieldConfig(58)?.label}</strong>
            <span class="list-item-value">{service.serviceType}</span>
          </div>
          <div class="list-item-field">
            <!-- Service-ShortDescription -->
            <strong>{getFieldConfig(60)?.label}</strong>
            <span class="list-item-value">{service.shortDescription}</span>
          </div>
          <div class="list-item-field">
            <!-- Service-Workspace -->
            <strong>{getFieldConfig(45)?.label}</strong>
            <span class="list-item-value">{service.workspace}</span>
          </div>
          <div class="list-item-field">
            <!-- Service-Identifier -->
            <strong>Service Identifier</strong>
            <span class="list-item-value">{service.serviceIdentification}</span>
          </div>
          <div class="list-item-field">
            <!-- File-Identifier -->
            <strong>File Identifier</strong>
            <span class="list-item-value">{service.fileIdentifier}</span>
          </div>
          {#if service.serviceType === 'WMS' || service.serviceType === 'WMTS'}
            <div class="list-item-field">
              <!-- Service-Preview -->
              <strong>{getFieldConfig(46)?.label}</strong>
              <span class="list-item-value">
                {#await replaceVariable(service.preview)}
                  Lädt ...
                {:then url}
                  {url || DEFAULT_NULL_STRING}
                {:catch}
                  {service.preview || DEFAULT_NULL_STRING}
                {/await}
              </span>
            </div>
          {/if}
          {#if service.serviceType === 'WMS' || service.serviceType === 'WMTS'}
            <div class="list-item-field">
              <!-- Service-LegendImage -->
              <strong>{getFieldConfig(53)?.label}</strong>
              <div class="list">
                <div class="list-item-field">
                  <!-- Service-LegendImage-Url -->
                  <strong>{getFieldConfig(75)?.label}</strong>
                  <span class="list-item-value">
                    {#await replaceVariable(service.legendImage?.url)}
                      Lädt ...
                    {:then url}
                      {url || DEFAULT_NULL_STRING}
                    {:catch}
                      {service.preview || DEFAULT_NULL_STRING}
                    {/await}
                  </span>
                </div>
                <div class="list-item-field">
                  <!-- Service-LegendImage-Format -->
                  <strong>{getFieldConfig(76)?.label}</strong>
                  <span class="list-item-value">
                    {#if service.legendImage?.format}
                      {service.legendImage.format}
                    {:else}
                      {DEFAULT_NULL_STRING}
                    {/if}
                  </span>
                </div>
                <div class="list-item-field">
                  <!-- Service-LegendImage-Width -->
                  <strong>{getFieldConfig(77)?.label}</strong>
                  <span class="list-item-value">
                    {#if service.legendImage?.width}
                      {service.legendImage.width}
                    {:else}
                      {DEFAULT_NULL_STRING}
                    {/if}
                  </span>
                </div>
                <div class="list-item-field">
                  <!-- Service-LegendImage-Height -->
                  <strong>{getFieldConfig(78)?.label}</strong>
                  <span class="list-item-value">
                    {#if service.legendImage?.height}
                      {service.legendImage.height}
                    {:else}
                      {DEFAULT_NULL_STRING}
                    {/if}
                  </span>
                </div>
              </div>
            </div>
          {/if}
          {#if service.serviceType === 'WFS' && service.featureTypes?.length}
            <div class="list-item-field">
              <strong>{getFieldConfig(56)?.label} ({service.featureTypes?.length})</strong>
              <div class="list">
                {#each service?.featureTypes || [] as featureType}
                  <div class="list-item">
                    <div class="list-item-field">
                      <!-- FeatureType-Name -->
                      <strong>{getFieldConfig(62)?.label}</strong>
                      <span class="list-item-value">{featureType.name}</span>
                    </div>
                    <div class="list-item-field">
                      <!-- FeatureType-Title -->
                      <strong>{getFieldConfig(63)?.label}</strong>
                      <span class="list-item-value">{featureType.title}</span>
                    </div>
                    <div class="list-item-field">
                      <!-- FeatureType-ShortDescription -->
                      <strong>{getFieldConfig(69)?.label}</strong>
                      <span class="list-item-value">{featureType.shortDescription}</span>
                    </div>
                    {#if featureType?.columns}
                      <div class="list-item-field">
                        <strong>{getFieldConfig(63)?.label}</strong>
                        <div class="list">
                          {#each featureType?.columns || [] as columnInfo}
                            <div class="list-item">
                              <div class="list-item-field">
                                <!-- Attribute-Name -->
                                <strong>{getFieldConfig(65)?.label}</strong>
                                <span class="list-item-value">{columnInfo.name}</span>
                              </div>
                              <div class="list-item-field">
                                <!-- Attribute-Alias -->
                                <strong>{getFieldConfig(66)?.label}</strong>
                                <span class="list-item-value">{columnInfo.alias}</span>
                              </div>
                              <div class="list-item-field">
                                <!-- Attribute-DataType -->
                                <strong>{getFieldConfig(67)?.label}</strong>
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

          {#if (service.serviceType === 'WMS' || service.serviceType === 'WMTS') && layers?.length}
            <div class="list-item-field">
              <strong>Kartenebenen ({layers?.length})</strong>
              <div class="list">
                {#each layers || [] as layer}
                  <div class="list-item">
                    <div class="list-item-field">
                      <!-- Layer-Title -->
                      <strong>{getFieldConfig(49)?.label}</strong>
                      <span class="list-item-value">{layer.title}</span>
                    </div>
                    <div class="list-item-field">
                      <!-- Layer-Name -->
                      <strong>{getFieldConfig(50)?.label}</strong>
                      <span class="list-item-value">{layer.name}</span>
                    </div>
                    <div class="list-item-field">
                      <!-- Layer-StyleName -->
                      <strong>{getFieldConfig(52)?.label}</strong>
                      <span class="list-item-value">{layer.styleName}</span>
                    </div>
                    <div class="list-item-field">
                      <!-- Layer-StyleTitle -->
                      <strong>{getFieldConfig(51)?.label}</strong>
                      <span class="list-item-value">{layer.styleTitle}</span>
                    </div>
                    <div class="list-item-field">
                      <!-- Layer-LegendImage -->
                      <strong>{getFieldConfig(53)?.label}</strong>
                      <span class="list-item-value">
                        {#await replaceVariable(layer.legendImage)}
                          Lädt ...
                        {:then url}
                          {url || DEFAULT_NULL_STRING}
                        {:catch}
                          {layer.legendImage || DEFAULT_NULL_STRING}
                        {/await}
                      </span>
                    </div>
                    <div class="list-item-field">
                      <!-- Layer-ShortDescription -->
                      <strong>{getFieldConfig(54)?.label}</strong>
                      <span class="list-item-value">{layer.shortDescription}</span>
                    </div>
                    <div class="list-item-field">
                      <!-- Layer-DataSource -->
                      <strong>{getFieldConfig(55)?.label}</strong>
                      <span class="list-item-value">{layer.datasource}</span>
                    </div>
                    <div class="list-item-field">
                      <!-- Layer-SecondaryDataSource -->
                      <strong>{getFieldConfig(56)?.label}</strong>
                      <span class="list-item-value">{layer.secondaryDatasource}</span>
                    </div>
                  </div>
                {/each}
              </div>
            </div>
          {/if}
        </div>
      {/each}
    </div>
  {/if}
{/snippet}

{#snippet isoMetadataHighValueDataset(value: boolean)}
  {value ? 'Ja' : 'Nein'}
{/snippet}

{#snippet isoMetadataHighValueDataCategory(value: string[])}
  {#if !value?.length}
    {DEFAULT_NULL_STRING}
  {:else}
    {#await getHVDCategories()}
      Lädt ...
    {:then data}
      {value
        .map((val) => {
          const category = (data as Option[]).find((option) => option.key === val);
          return category?.label || 'Unbekannte Kategorie';
        })
        .join(', ')}
    {/await}
  {/if}
{/snippet}

{#snippet technicalMetadataCategories(value: string[])}
  {#if !value?.length}
    {DEFAULT_NULL_STRING}
  {:else}
    {value.join(', ')}
  {/if}
{/snippet}

<style lang="scss">
  .list {
    max-width: 100%;

    .list {
      display: flex;
      flex-direction: column;
      padding: 0 0 0 1.5em;
      margin: 0.5em 0 0 0;
      background: transparent;
    }

    .list-item {
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
</style>
