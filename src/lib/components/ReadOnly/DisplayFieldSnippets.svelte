<script lang="ts">
  import type {
    Keywords,
    Contacts,
    PartialExtent,
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
  import type { FieldKey } from '$lib/models/form';

  import type { Option } from '$lib/models/form';
  import { toast } from 'svelte-french-toast';
  import { getFormContext } from '$lib/context/FormContext.svelte';

  interface Props {
    t: Awaited<ReturnType<typeof import('$lib/i18n').getTranslator>>;
    key: FieldKey;
    value: unknown;
    metadata: MetadataCollection | undefined;
  }

  let { t, key, value, metadata }: Props = $props();

  const DEFAULT_NULL_STRING = $derived(t('displayfield.noValue'));

  const getInspireThemes = async (): Promise<Option[]> => {
    const response = await fetch('/data/inspire_themes');

    if (!response.ok) {
      toast.error(t('displayfieldsnippets.errorFetchInspireThemes'));
      return [];
    }

    return response.json();
  };

  const getIsoThemes = async () => {
    const response = await fetch('/data/iso_themes');

    if (!response.ok) {
      toast.error(t('displayfieldsnippets.errorFetchIsoThemes'));
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
    const metadata = getFormContext()?.formState?.metadata;
    const metadataId = metadata?.metadataId;
    if (!metadataId) {
      toast.error(t('displayfieldsnippets.errorNoMetadataId'));
      return [];
    }
    const response = await fetch(`/metadata/${metadataId}/autokeywords`);

    if (!response.ok) {
      toast.error(t('displayfieldsnippets.errorFetchAutoKeywords'));
      return [];
    }

    const data = await response.json();
    return data || [];
  };

  const getTermsOfUse = async () => {
    const response = await fetch('/data/terms_of_use');

    if (!response.ok) {
      toast.error(t('displayfieldsnippets.errorFetchTermsOfUse'));
      return [];
    }

    return response.json();
  };

  const getPrivacy = async () => {
    const response = await fetch('/data/privacy');

    if (!response.ok) {
      toast.error(t('displayfieldsnippets.errorFetchPrivacy'));
      return [];
    }

    return response.json();
  };

  const getCrs = async () => {
    const response = await fetch('/data/crs');

    if (!response.ok) {
      toast.error(t('displayfieldsnippets.errorFetchCrs'));
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
      toast.error(t('displayfieldsnippets.errorFetchHvdCategories'));
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
      toast.error(t('displayfieldsnippets.errorReplaceVariable'));
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
      {t('general.loading')}
    {:then autoKeywords}
      {autoKeywords.join(', ')}
    {/await}
  {/if}
{/snippet}

{#snippet isoMetadataPreview(value: string)}
  {#await replaceVariable(value)}
    {t('general.loading')}
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

{#snippet isoMetadataPrivacy(value: string)}
  {#await getPrivacy()}
    {t('general.loading')}
  {:then data}
    {(data as Option[]).find((option) => option.key === value)?.label || DEFAULT_NULL_STRING}
  {/await}
{/snippet}

{#snippet isoMetadataTermsOfUse(value: string)}
  {#await getTermsOfUse()}
    {t('general.loading')}
  {:then data}
    {(data as TermsOfUse[]).find((entry: TermsOfUse) => entry.id === Number(value))?.shortname ||
      DEFAULT_NULL_STRING}
  {/await}
{/snippet}

{#snippet isoMetadataInspireTheme(value: string[])}
  {#await getInspireThemes()}
    {t('general.loading')}
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
      {t('general.loading')}
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
    {t('general.yes')}
  {:else if value === false}
    {t('general.no')}
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
    {t('general.loading')}
  {:then data}
    {(data as Option[]).find((option) => option.key === value)?.label || DEFAULT_NULL_STRING}
  {/await}
{/snippet}

{#snippet isoMetadataExtent(value: PartialExtent)}
  {value
    ? `${value.minx}, ${value.miny}, ${value.maxx}, ${value.maxy} (EPSG:4326)`
    : DEFAULT_NULL_STRING}
{/snippet}

{#snippet isoMetadataResolutions(value: string)}
  {value || DEFAULT_NULL_STRING}
{/snippet}

{#snippet isoMetadataContentDescription(value: string)}
  {#await replaceVariable(value)}
    {t('general.loading')}
  {:then value}
    {value || DEFAULT_NULL_STRING}
  {:catch}
    {value}
  {/await}
{/snippet}

{#snippet isoMetadataTechnicalDescription(value: string)}
  {#await replaceVariable(value)}
    {t('general.loading')}
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
            <strong>{t('32_Lineage.label_title')}</strong>
            <span class="list-item-value">{lineage.title || DEFAULT_NULL_STRING}</span>
          </div>
          <div class="list-item-field">
            <!-- Lineage-Date -->
            <strong>{t('32_Lineage.label_date')}</strong>
            <span class="list-item-value">{lineage.date || DEFAULT_NULL_STRING}</span>
          </div>
          <div class="list-item-field">
            <!-- Lineage-Identifier -->
            <strong>{t('32_Lineage.label_identifier')}</strong>
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
            <strong>{t('displayfieldsnippets.contentDescriptionDescription')}</strong>
            <span class="list-item-value">{contentDescription.description}</span>
          </div>
          <div class="list-item-field">
            <strong>{t('displayfieldsnippets.contentDescriptionCode')}</strong>
            <span class="list-item-value">
              {contentDescriptionsCodeMap[contentDescription.code]}
            </span>
          </div>
          <div class="list-item-field">
            <strong>{t('displayfieldsnippets.contentDescriptionUrl')}</strong>
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

{#snippet isoMetadataServices(services: Service[], metadata?: MetadataCollection)}
  {#if !services?.length}
    {DEFAULT_NULL_STRING}
  {:else if !metadata}
    {DEFAULT_NULL_STRING}
  {:else}
    <strong>Anzahl: {services.length}</strong>
    <div class="list">
      {#each services as service}
        {@const layers = getLayers(service, metadata)}
        <div class="list-item">
          <div class="list-item-field">
            <!-- ServiceTitle -->
            <strong>{t('59_ServiceTitle.label')}</strong>
            <span class="list-item-value">{service.title}</span>
          </div>
          <div class="list-item-field">
            <!-- Service-Type -->
            <strong>{t('58_ServiceType.label')}</strong>
            <span class="list-item-value">{service.serviceType}</span>
          </div>
          <div class="list-item-field">
            <!-- Service-ShortDescription -->
            <strong>{t('60_ServiceShortDescription.label')}</strong>
            <span class="list-item-value">{service.shortDescription}</span>
          </div>
          <div class="list-item-field">
            <!-- Service-Workspace -->
            <strong>{t('45_ServiceWorkspace.label')}</strong>
            <span class="list-item-value">{service.workspace}</span>
          </div>
          <div class="list-item-field">
            <!-- Service-Identifier -->
            <strong>{t('displayfieldsnippets.serviceIdentifier')}</strong>
            <span class="list-item-value">{service.serviceIdentification}</span>
          </div>
          <div class="list-item-field">
            <!-- File-Identifier -->
            <strong>{t('displayfieldsnippets.fileIdentifier')}</strong>
            <span class="list-item-value">{service.fileIdentifier}</span>
          </div>
          <div class="list-item-field">
            <strong>{t('46_ServicePreview.label')}</strong>
            <span class="list-item-value">
              {#await replaceVariable(service.preview)}
                {t('general.loading')}
              {:then url}
                {url || DEFAULT_NULL_STRING}
              {:catch}
                {service.preview || DEFAULT_NULL_STRING}
              {/await}
            </span>
          </div>
          {#if service.serviceType !== 'ATOM'}
            <div class="list-item-field">
              <strong>{t('47_ServiceLegendImage.label')}</strong>
              <div class="list">
                <div class="list-item-field">
                  <strong>{t('47_ServiceLegendImage.label_url')}</strong>
                  <span class="list-item-value">
                    {#await replaceVariable(service.legendImage?.url)}
                      {t('general.loading')}
                    {:then url}
                      {url || DEFAULT_NULL_STRING}
                    {:catch}
                      {service.preview || DEFAULT_NULL_STRING}
                    {/await}
                  </span>
                </div>
                <div class="list-item-field">
                  <!-- Service-LegendImage-Format -->
                  <strong>{t('47_ServiceLegendImage.label_format')}</strong>
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
                  <strong>{t('47_ServiceLegendImage.label_width')}</strong>
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
                  <strong>{t('47_ServiceLegendImage.label_height')}</strong>
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
              <strong>{t('56_FeatureTypeForm.label')} ({service.featureTypes?.length})</strong>
              <div class="list">
                {#each service?.featureTypes || [] as featureType}
                  <div class="list-item">
                    <div class="list-item-field">
                      <!-- FeatureType-Name -->
                      <strong>{t('62_FeatureTypeName.label')}</strong>
                      <span class="list-item-value">{featureType.name}</span>
                    </div>
                    <div class="list-item-field">
                      <!-- FeatureType-Title -->
                      <strong>{t('61_FeatureTypeTitle.label')}</strong>
                      <span class="list-item-value">{featureType.title}</span>
                    </div>
                    <div class="list-item-field">
                      <!-- FeatureType-ShortDescription -->
                      <strong>{t('69_FeatureTypeDescription.label')}</strong>
                      <span class="list-item-value">{featureType.shortDescription}</span>
                    </div>
                    {#if featureType?.columns}
                      <div class="list-item-field">
                        <strong>{t('63_ColumnsForm.label')}</strong>
                        <div class="list">
                          {#each featureType?.columns || [] as columnInfo}
                            <div class="list-item">
                              <div class="list-item-field">
                                <!-- Attribute-Name -->
                                <strong>{t('64_AttributeName.label')}</strong>
                                <span class="list-item-value">{columnInfo.name}</span>
                              </div>
                              <div class="list-item-field">
                                <!-- Attribute-Alias -->
                                <strong>{t('65_AttributeAlias.label')}</strong>
                                <span class="list-item-value">{columnInfo.alias}</span>
                              </div>
                              <div class="list-item-field">
                                <!-- Attribute-DataType -->
                                <strong>{t('66_AttributeDatatype.label')}</strong>
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
              <strong>{t('48_LayersForm.label')} ({layers?.length})</strong>
              <div class="list">
                {#each layers || [] as layer}
                  <div class="list-item">
                    <div class="list-item-field">
                      <!-- Layer-Title -->
                      <strong>{t('49_LayerTitle.label')}</strong>
                      <span class="list-item-value">{layer.title}</span>
                    </div>
                    <div class="list-item-field">
                      <!-- Layer-Name -->
                      <strong>{t('50_LayerName.label')}</strong>
                      <span class="list-item-value">{layer.name}</span>
                    </div>
                    <div class="list-item-field">
                      <!-- Layer-StyleTitle -->
                      <strong>{t('52_LayerStyleTitle.label')}</strong>
                      <span class="list-item-value">{layer.styleTitle}</span>
                    </div>
                    <div class="list-item-field">
                      <!-- Layer-StyleName -->
                      <strong>{t('51_LayerStyleName.label')}</strong>
                      <span class="list-item-value">{layer.styleName}</span>
                    </div>
                    <div class="list-item-field">
                      <!-- Layer-LegendImage -->
                      <strong>{t('53_LayerLegendImage.label')}</strong>
                      <span class="list-item-value">
                        {#await replaceVariable(layer.legendImage)}
                          {t('general.loading')}
                        {:then url}
                          {url || DEFAULT_NULL_STRING}
                        {:catch}
                          {layer.legendImage || DEFAULT_NULL_STRING}
                        {/await}
                      </span>
                    </div>
                    <div class="list-item-field">
                      <!-- Layer-ShortDescription -->
                      <strong>{t('54_LayerDescription.label')}</strong>
                      <span class="list-item-value">{layer.shortDescription}</span>
                    </div>
                    <div class="list-item-field">
                      <!-- Layer-DataSource -->
                      <strong>{t('55_LayerDatasource.label')}</strong>
                      <span class="list-item-value">{layer.datasource}</span>
                    </div>
                    <div class="list-item-field">
                      <!-- Layer-SecondaryDataSource -->
                      <strong>{t('68_LayerSecondaryDatasource.label')}</strong>
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

{#if key === 'isoMetadata.privacy'}
  {@render isoMetadataPrivacy(value as string)}
{:else if key === 'isoMetadata.annexTheme'}
  {@render isoMetadataAnnexTheme(value as string)}
{:else if key === 'isoMetadata.pointsOfContact'}
  {@render isoMetadataContacts(value as Contacts)}
{:else if key === 'isoMetadata.contentDescription'}
  {@render isoMetadataContentDescription(value as string)}
{:else if key === 'isoMetadata.contentDescriptions'}
  {@render isoMetadataContentDescriptions(value as ContentDescription[])}
{:else if key === 'isoMetadata.created'}
  {@render isoMetadataCreated(value as string)}
{:else if key === 'isoMetadata.crs'}
  {@render isoMetadataCrs(value as string)}
{:else if key === 'isoMetadata.description'}
  {@render isoMetadataDescription(value as string)}
{:else if key === 'isoMetadata.extent'}
  {@render isoMetadataExtent(value as PartialExtent)}
{:else if key === 'isoMetadata.highValueDataCategory'}
  {@render isoMetadataHighValueDataCategory(value as string[])}
{:else if key === 'isoMetadata.highValueDataset'}
  {@render isoMetadataHighValueDataset(value as boolean)}
{:else if key === 'isoMetadata.inspireAnnexVersion'}
  {@render isoMetadataInspireAnnexVersion(value as string)}
{:else if key === 'isoMetadata.inspireFormatName'}
  {@render isoMetadataInspireFormatName(value as string)}
{:else if key === 'isoMetadata.inspireTheme'}
  {@render isoMetadataInspireTheme(value as string[])}
{:else if key === 'isoMetadata.keywords'}
  {@render isoMetadataKeywords(value as Keywords)}
{:else if key === 'isoMetadata.lineage'}
  {@render isoMetadataLineage(value as Lineage[])}
{:else if key === 'isoMetadata.maintenanceFrequency'}
  {@render isoMetadataMaintenanceFrequency(value as MaintenanceFrequency)}
{:else if key === 'isoMetadata.metadataProfile'}
  {@render isoMetadataMetadataProfile(value as MetadataProfile)}
{:else if key === 'isoMetadata.modified'}
  {@render isoMetadataModified(value as string)}
{:else if key === 'isoMetadata.preview'}
  {@render isoMetadataPreview(value as string)}
{:else if key === 'isoMetadata.published'}
  {@render isoMetadataPublished(value as string)}
{:else if key === 'isoMetadata.qualityReportCheck'}
  {@render isoMetadataQualityReportCheck(value as string)}
{:else if key === 'isoMetadata.resolutions'}
  {@render isoMetadataResolutions(value as string)}
{:else if key === 'isoMetadata.services'}
  {@render isoMetadataServices(value as Service[], metadata)}
{:else if key === 'isoMetadata.technicalDescription'}
  {@render isoMetadataTechnicalDescription(value as string)}
{:else if key === 'isoMetadata.termsOfUseId'}
  {@render isoMetadataTermsOfUse(value as string)}
{:else if key === 'isoMetadata.title'}
  {@render isoMetadataTitle(value as string)}
{:else if key === 'isoMetadata.topicCategory'}
  {@render isoMetadataTopicCategory(value as string[])}
{:else if key === 'isoMetadata.valid'}
  {@render isoMetadataValid(value as boolean)}
{:else if key === 'isoMetadata.validFrom'}
  {@render isoMetadataValidFrom(value as string)}
{:else if key === 'isoMetadata.validTo'}
  {@render isoMetadataValidTo(value as string)}
{:else if key === 'technicalMetadata.deliveredCrs'}
  {@render technicalMetadataDeliveredCrs(value as string)}
{:else if key === 'technicalMetadata.categories'}
  {@render technicalMetadataCategories(value as string[])}
{:else}
  {@render defaultSnippet(value as string)}
{/if}

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
