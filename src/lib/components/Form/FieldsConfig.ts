/* eslint-disable @typescript-eslint/no-explicit-any */
import type { FieldKey } from '$lib/models/form';
import type { Contacts, Layer, Service } from '$lib/models/metadata';
import { getValue, type Section } from '$lib/context/FormContext.svelte';
import type { Role } from '$lib/models/keycloak';

export type ValidationResult = {
  valid: boolean;
  helpText?: string;
};

export interface YamlFieldConfig {
  key?: FieldKey;
  profileId: number;
  label: string;
  explanation?: string;
  placeholder?: string;
  hint?: string;
}

export interface FullFieldConfig<T> extends YamlFieldConfig {
  key: FieldKey;
  required?: boolean;
  editingRoles?: Role[];
  section: Section;
  validator: (
    val: T | undefined,
    extra?: Record<string, any>
  ) => ValidationResult;
  copyValue?: (val: T | undefined) => void;
}

const isDefined = (val: any) => {
  if (val === undefined || val === null || val === '') return false;
  if (Array.isArray(val)) return val.length > 0;
  return true;
};

const isValidPhoneNumber = (val: string) => {
  const numberRegex = /^[+]?[0-9\s]+$/;
  return numberRegex.test(val);
};

const isValidEmail = (val: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(val);
};

export const FieldConfigs: FullFieldConfig<any>[] = [
  {
    profileId: 1,
    key: 'isoMetadata.title',
    label: 'Titel des Datenbestandes',
    validator: (val) => {
      if (!isDefined(val)) {
        return {
          valid: false,
          helpText: 'Bitte geben Sie einen Titel an.'
        };
      }
      return { valid: val.length <= 250 };
    },
    section: 'basedata',
    required: true
  },
  {
    profileId: 2,
    key: 'isoMetadata.description',
    label: 'Kurzbeschreibung des Datenbestandes',
    validator: (val) => {
      if (!isDefined(val)) {
        return {
          valid: false,
          helpText: 'Bitte geben Sie eine Beschreibung an.'
        };
      }
      return { valid: true };
    },
    section: 'basedata',
    required: true
  },
  {
    profileId: 4,
    label: 'Datenschutz-Einstellungen',
    key: 'clientMetadata.privacy',
    validator: (val: any) => {
      if (!isDefined(val)) {
        return {
          valid: false,
          helpText: 'Bitte wählen sie die passende Datenschutz-Einstellung aus.'
        };
      }
      return { valid: true };
    },
    section: 'classification',
    required: true
  },
  {
    profileId: 5,
    label: 'INSPIRE Relevanz',
    key: 'isoMetadata.metadataProfile',
    validator: (val: any) => {
      if (!isDefined(val)) {
        return {
          valid: false,
          helpText: 'Bitte geben Sie einen Metadaten-Typ an.'
        };
      }
      return { valid: true };
    },
    section: 'classification',
    required: true
  },
  {
    profileId: 6,
    label: 'High Value Datensatz',
    key: 'isoMetadata.highValueDataset',
    validator: (val: any) => {
      if (!isDefined(val)) {
        return {
          valid: false,
          helpText: 'Bitte geben Sie an, ob es sich um einen High Value Datensatz handelt.'
        };
      }
      return { valid: true };
    },
    section: 'classification',
    required: true
  },
  {
    profileId: 7,
    label: 'INSPIRE Annex Thema',
    key: 'isoMetadata.inspireTheme',
    validator: (val: any) => {
      const isIso = getValue('isoMetadata.metadataProfile') === 'ISO';
      if (isIso) {
        return { valid: true };
      }
      if (!isDefined(val)) {
        return {
          valid: false,
          helpText: 'Bitte geben Sie ein INSPIRE-Thema an.'
        };
      }
      return { valid: true };
    },
    section: 'classification',
    required: true
  },
  {
    profileId: 8,
    label: 'HVD Kategorie',
    key: 'isoMetadata.highValueDataCategory',
    validator: (val: any) => {
      const isHighValueDataset = getValue('isoMetadata.highValueDataset');
      if (isHighValueDataset === true && !isDefined(val)) {
        return {
          valid: false,
          helpText: 'Bitte wählen Sie die passende(n) HVD Kategorie(n) aus.'
        };
      }
      return { valid: true };
    },
    section: 'classification',
    required: true
  },
  {
    profileId: 9,
    label: 'Erstellungsdatum',
    key: 'isoMetadata.created',
    validator: () => {
      // Optional
      return { valid: true };
    },
    section: 'temp_and_spatial',
    required: false
  },
  {
    profileId: 10,
    label: 'Veröffentlichungsdatum',
    key: 'isoMetadata.published',
    validator: (val: any) => {
      if (!isDefined(val) || val.length === 0) {
        return {
          valid: false,
          helpText: 'Bitte geben Sie ein Veröffentlichungsdatum an.'
        };
      }
      return { valid: true };
    },
    section: 'temp_and_spatial',
    required: true
  },
  {
    profileId: 11,
    label: 'letzte Aktualisierung',
    key: 'isoMetadata.modified',
    validator: () => {
      // Optional
      return { valid: true };
    },
    section: 'temp_and_spatial',
    required: true
  },
  {
    profileId: 12, // duplication with "isoMetadata.validTo"
    label: 'gültig ab',
    key: 'isoMetadata.validFrom',
    validator: (startValue: string, extra: any) => {
      if (startValue && extra?.endValue && new Date(startValue) > new Date(extra?.endValue)) {
        return {
          valid: false,
          helpText: 'Das Startdatum muss vor dem Enddatum liegen.'
        };
      }
      return { valid: true };
    },
    section: 'temp_and_spatial',
    required: false
  },
  {
    profileId: 12, // duplication with "isoMetadata.validFrom"
    label: 'gültig bis',
    key: 'isoMetadata.validTo',
    validator: (endValue: string, extra: any) => {
      if (endValue && extra?.startValue && new Date(extra?.startValue) > new Date(endValue)) {
        return {
          valid: false,
          helpText: 'Das Startdatum muss vor dem Enddatum liegen.'
        };
      }
      return { valid: true };
    },
    section: 'temp_and_spatial',
    required: false
  },
  {
    profileId: 13,
    label: 'Themenkategorie',
    key: 'isoMetadata.topicCategory',
    validator: (val: any[]) => {
      if (!val?.length) {
        return {
          valid: false,
          helpText: 'Bitte geben Sie eine Themenkategorie an.'
        };
      }
      return { valid: true };
    },
    section: 'classification',
    required: true,
    editingRoles: ['MdeEditor']
  },
  {
    profileId: 14,
    label: 'Pflegeintervall',
    key: 'isoMetadata.maintenanceFrequency',
    validator: () => {
      // Optional
      return { valid: true };
    },
    section: 'temp_and_spatial',
    required: true
  },
  {
    profileId: 15,
    label: 'Schlagwörter',
    key: 'isoMetadata.keywords',
    validator: (val: any) => {
      if (val?.length < 1) {
        return {
          valid: false,
          helpText: 'Bitte geben Sie mindestens ein Schlagwort an.'
        };
      }
      return { valid: true };
    },
    section: 'basedata',
    required: true,
    editingRoles: ['MdeEditor']
  },
  {
    profileId: 16,
    label: 'geliefertes Koordinatensystem',
    key: 'technicalMetadata.deliveredCrs',
    placeholder: 'EPSG:25833',
    validator: (val: any) => {
      if (!isDefined(val)) {
        return {
          valid: false,
          helpText: 'Bitte geben Sie das gelieferte Koordinatensystem an.'
        };
      }
      return { valid: true };
    },
    section: 'temp_and_spatial',
    required: true,
    editingRoles: ['MdeDataOwner']
  },
  {
    profileId: 17,
    label: 'abzugebendes Koordinatensystem',
    key: 'isoMetadata.crs',
    validator: (val: any) => {
      if (!isDefined(val)) {
        return {
          valid: false,
          helpText: 'Bitte geben Sie das abzugebende Koordinatensystem an.'
        };
      }
      return { valid: true };
    },
    section: 'temp_and_spatial',
    required: true,
    editingRoles: ['MdeEditor']
  },
  {
    profileId: 18,
    label: 'Räumliche Ausdehnung',
    key: 'isoMetadata.extent.minx',
    section: 'temp_and_spatial',
    required: true,
    editingRoles: ['MdeEditor'],
    validator: (val?: number) => {
      if (!val || val < 1) {
        return {
          valid: false,
          helpText: 'Bitte geben Sie den minimalen x-Wert an.',
        };
      }
      return { valid: true };
    }
  }, {
    profileId: 18,
    label: 'Räumliche Ausdehnung',
    key: 'isoMetadata.extent.miny',
    section: 'temp_and_spatial',
    required: true,
    editingRoles: ['MdeEditor'],
    validator: (val?: number) => {
      if (!val || val < 1) {
        return {
          valid: false,
          helpText: 'Bitte geben Sie den minimalen y-Wert an.'
        }
      }
      return { valid: true };
    }
  }, {
    profileId: 18,
    label: 'Räumliche Ausdehnung',
    key: 'isoMetadata.extent.maxx',
    section: 'temp_and_spatial',
    required: true,
    editingRoles: ['MdeEditor'],
    validator: (val?: number) => {
      if (!val || val < 1) {
        return {
          valid: false,
          helpText: 'Bitte geben Sie den maximalen x-Wert an.'
        };
      }
      return { valid: true };
    }
  }, {
    profileId: 18,
    label: 'Räumliche Ausdehnung',
    key: 'isoMetadata.extent.maxy',
    section: 'temp_and_spatial',
    required: true,
    editingRoles: ['MdeEditor'],
    validator: (val?: number) => {
      if (!val || val < 1) {
        return {
          valid: false,
          helpText: 'Bitte geben Sie den maximalen y-Wert an.'
        };
      }
      return { valid: true };
    },
  },
  {
    profileId: 19,
    label: 'Kontaktangaben',
    key: 'isoMetadata.pointsOfContact',
    section: 'basedata',
    required: true,
    validator: (contacts?: Contacts) => {
      if (!contacts || contacts.length < 1) {
        return {
          valid: false,
          helpText: 'Bitte geben Sie mindestens einen Kontakt an.'
        };
      }
      return { valid: true };
    }
  }, {
    profileId: 20,
    label: 'Name',
    key: 'isoMetadata.pointsOfContact.name',
    section: 'basedata',
    required: true,
    validator: (val: string, extra?: Record<string, any>) => {
      if (!isDefined(val)) {
        return {
          valid: false,
          helpText: 'Bitte geben Sie den Namen des Kontakts an.'
        };
      }
      return { valid: true };
    }
  }, {
    profileId: 21,
    label: 'Organisation',
    key: 'isoMetadata.pointsOfContact.organisation',
    section: 'basedata',
    required: true,
    validator: (val: string, extra?: Record<string, any>) => {
      if (!isDefined(val)) {
        return {
          valid: false,
          helpText: 'Bitte geben Sie die Organisation des Kontakts an.'
        };
      }
      return { valid: true };
    }
  }, {
    profileId: 22,
    label: 'E-Mail',
    key: 'isoMetadata.pointsOfContact.email',
    section: 'basedata',
    required: true,
    validator: (val: string, extra?: Record<string, any>) => {
      if (!isDefined(val)) {
        return {
          valid: false,
          helpText: 'Bitte geben Sie die E-Mail-Adresse des Kontakts an.'
        };
      }
      if (!isValidEmail(val)) {
        return {
          valid: false,
          helpText: 'Bitte geben Sie eine gültige E-Mail-Adresse an.'
        };
      }
      return { valid: true };
    }
  }, {
    profileId: 23,
    label: 'Telefonnummer',
    key: 'isoMetadata.pointsOfContact.phone',
    section: 'basedata',
    required: true,
    validator: (val: string, extra?: Record<string, any>) => {
      if (!isDefined(val)) {
        return {
          valid: false,
          helpText: 'Bitte geben Sie die Telefonnummer des Kontakts an.'
        };
      }
      if (!isValidPhoneNumber(val)) {
        return {
          valid: false,
          helpText: 'Bitte geben Sie eine gültige Telefonnummer an.'
        };
      }
      return { valid: true };
    }
  },
  // profileId: 24 is not used anymore
  {
    profileId: 25,
    label: 'Nutzungsbestimmungen',
    key: 'isoMetadata.termsOfUseId',
    validator: (val: any) => {
      if (!isDefined(val)) {
        return {
          valid: false,
          helpText: 'Bitte wählen sie die passenden Nutzungsbestimmungen.'
        };
      }
      return { valid: true };
    },
    section: 'classification',
    required: true,
    editingRoles: ['MdeDataOwner']
  },
  {
    profileId: 26,
    label: 'Nutzungsbestimmungen Quellenangabe',
    key: 'isoMetadata.termsOfUseSource',
    validator: () => {
      return { valid: true };
    },
    section: 'classification',
    required: true,
    editingRoles: ['MdeDataOwner']
  },
  {
    profileId: 27,
    label: 'Vergleichsmaßstab',
    key: 'isoMetadata.scale',
    validator: (val: any) => {
      const resolution = getValue('isoMetadata.resolutions');
      if (!isDefined(val) && !isDefined(resolution)) {
        return {
          valid: false,
          helpText: 'Bitte geben Sie den Vergleichsmaßstab an.'
        };
      }
      return { valid: true };
    },
    section: 'temp_and_spatial',
    required: true
  },
  {
    profileId: 28,
    label: 'Bodenauflösung',
    key: 'isoMetadata.resolutions',
    validator: (val: any) => {
      const scale = getValue('isoMetadata.scale');
      if (!isDefined(val) && !isDefined(scale)) {
        return {
          valid: false,
          helpText: 'Bitte geben Sie die Bodenauflösung an.'
        };
      }
      return { valid: true };
    },
    section: 'temp_and_spatial',
    required: true
  },
  {
    profileId: 29,
    label: 'Vorschaubild',
    key: 'isoMetadata.preview',
    validator: (val: any) => {
      if (!isDefined(val)) {
        return {
          valid: false,
          helpText: 'Bitte geben Sie ein Vorschaubild an.'
        };
      }
      return { valid: true };
    },
    section: 'basedata',
    required: true
  },
  {
    profileId: 30,
    label: 'Inhaltliche Beschreibung',
    key: 'isoMetadata.contentDescription',
    validator: (val: any) => {
      if (!isDefined(val)) {
        return {
          valid: false,
          helpText: 'Bitte geben Sie eine inhaltliche Beschreibung an.'
        };
      }
      return { valid: true };
    },
    section: 'additional',
    required: false
  },
  {
    profileId: 31,
    label: 'Technische Beschreibung',
    key: 'isoMetadata.technicalDescription',
    validator: (val: any) => {
      if (!isDefined(val)) {
        return {
          valid: false,
          helpText: 'Bitte geben Sie eine technische Beschreibung an.'
        };
      }
      return { valid: true };
    },
    section: 'additional',
    required: false
  },
  {
    profileId: 32,
    label: 'Herkunft der Daten',
    key: 'isoMetadata.lineage',
    validator: (val: any) => {
      if (!isDefined(val)) {
        return {
          valid: false,
          helpText: 'Bitte geben Sie eine Herkunft an.'
        };
      }
      return { valid: true };
    },
    section: 'additional',
    required: false
  },
  {
    profileId: 36,
    label: 'Verwandte Themen (MTK)',
    key: 'clientMetadata.relatedTopics',
    validator: () => {
      return { valid: true };
    },
    section: 'additional',
    required: false,
    editingRoles: ['MdeEditor']
  },
  {
    profileId: 37,
    label: 'Überprüfung des Qualitätsberichts',
    key: 'isoMetadata.valid',
    validator: () => ({ valid: true }),
    section: 'classification',
    required: false
  },
  {
    profileId: 38,
    label: 'Schema-Version des INSPIRE Themas',
    key: 'isoMetadata.inspireAnnexVersion',
    validator: () => {
      // Optional
      return { valid: true };
    },
    section: 'classification',
    required: true,
    editingRoles: ['MdeEditor']
  },
  {
    profileId: 39,
    label: 'Weitere Informationen',
    key: 'isoMetadata.contentDescriptions',
    validator: () => {
      // Optional
      return { valid: true };
    },
    section: 'additional',
    required: false
  },
  {
    profileId: 40,
    label: 'FAKE_LABEL SERVICE LENGTH',
    key: 'isoMetadata.services',
    validator: (services: Service[]) => {
      const valid = Array.isArray(services) && services.length > 0;
      return { valid };
    },
    section: 'services',
    required: true
  },
  // profileId: 41 and 42 are not used anymore (WMTS special handling)
  {
    profileId: 43,
    label: 'FAKE_LABEL SERVICE TITLE',
    key: 'isoMetadata.services',
    validator: (services: Service[]) => {
      const valid = services?.every((service) => isDefined(service.title));
      return { valid };
    },
    section: 'services',
    required: true
  },
  {
    profileId: 44,
    label: 'FAKE_LABEL SERVICE SHORT DESCRIPTION',
    key: 'isoMetadata.services',
    validator: (services: Service[]) => {
      const valid = services?.every((service) => isDefined(service.shortDescription));
      return { valid };
    },
    section: 'services',
    required: true
  },
  {
    profileId: 45,
    label: 'FAKE_LABEL SERVICE IDENTIFIER',
    key: 'isoMetadata.services',
    validator: (services: Service[]) => {
      const valid = services?.every((service) => isDefined(service.workspace));
      return { valid };
    },
    section: 'services',
    required: true,
    editingRoles: ['MdeEditor']
  },
  {
    profileId: 46,
    label: 'FAKE_LABEL SERVICE PREVIEW',
    key: 'isoMetadata.services',
    validator: (services: Service[]) => {
      const valid = services?.every((service) => {
        const isMappingService = service.serviceType === 'WMS' || service.serviceType === 'WMTS';
        return !isMappingService || isDefined(service.preview);
      });
      return { valid };
    },
    section: 'services',
    required: true
  },
  // TODO: create seperate configs for subfields of legendImage
  {
    profileId: 47,
    label: 'FAKE_LABEL FULL LEGEND',
    key: 'isoMetadata.services',
    validator: (services: Service[]) => {
      const valid = services?.every((service) => {
        const isMappingService = service.serviceType === 'WMS' || service.serviceType === 'WMTS';
        return !isMappingService || isDefined(service.preview);
      });
      return { valid };
    },
    section: 'services',
    required: true
  },
  {
    profileId: 48,
    label: 'FAKE_LABEL LAYER LENGTH',
    key: 'isoMetadata.services',
    validator: (services: Service[]) => {
      const layersMap: Record<string, Layer[]> = getValue('clientMetadata.layers') || {};
      const valid = services?.every((service) => {
        const isMappingService = service.serviceType === 'WMS' || service.serviceType === 'WMTS';
        return !isMappingService || layersMap[service.serviceIdentification]?.length > 0;
      });
      return { valid };
    },
    section: 'services',
    required: true
  },
  {
    profileId: 49,
    label: 'FAKE_LABEL LAYER TITLE',
    key: 'isoMetadata.services',
    validator: (services: Service[]) => {
      const layersMap: Record<string, Layer[]> = getValue('clientMetadata.layers') || {};
      const valid = services?.every((service) => {
        const isMappingService = service.serviceType === 'WMS' || service.serviceType === 'WMTS';
        return (
          !isMappingService ||
          layersMap[service.serviceIdentification]?.every((layer) => isDefined(layer.title))
        );
      });
      return { valid };
    },
    section: 'services',
    required: true
  },
  {
    profileId: 50,
    label: 'FAKE_LABEL LAYER NAME',
    key: 'isoMetadata.services',
    validator: (services: Service[]) => {
      const layersMap: Record<string, Layer[]> = getValue('clientMetadata.layers') || {};
      const valid = services?.every((service) => {
        const isMappingService = service.serviceType === 'WMS' || service.serviceType === 'WMTS';
        return (
          !isMappingService ||
          layersMap[service.serviceIdentification]?.every((layer) => (
            isDefined(layer.name) && /^[a-zA-Z0-9_]+$/.test(layer.name)
          ))
        );
      });
      return { valid };
    },
    section: 'services',
    required: true,
    editingRoles: ['MdeEditor']
  },
  {
    profileId: 51,
    label: 'FAKE_LABEL LAYER STYLE TITLE',
    key: 'isoMetadata.services',
    validator: (services: Service[]) => {
      const layersMap: Record<string, Layer[]> = getValue('clientMetadata.layers') || {};
      const valid = services?.every((service) => {
        const isMappingService = service.serviceType === 'WMS' || service.serviceType === 'WMTS';
        return (
          !isMappingService ||
          layersMap[service.serviceIdentification]?.every((layer) => isDefined(layer.styleTitle))
        );
      });
      return { valid };
    },
    section: 'services',
    required: true,
    editingRoles: ['MdeEditor']
  },
  {
    profileId: 52,
    label: 'FAKE_LABEL LAYER STYLE NAME',
    key: 'isoMetadata.services',
    validator: (services: Service[]) => {
      const layersMap: Record<string, Layer[]> = getValue('clientMetadata.layers') || {};
      const valid = services?.every((service) => {
        const isMappingService = service.serviceType === 'WMS' || service.serviceType === 'WMTS';
        return (
          !isMappingService ||
          layersMap[service.serviceIdentification]?.every((layer) => (
            isDefined(layer.styleName) && /^[a-zA-Z0-9_]+$/.test(layer.styleName!)
          ))
        );
      });
      return { valid };
    },
    section: 'services',
    required: true,
    editingRoles: ['MdeEditor']
  },
  {
    profileId: 53,
    label: 'FAKE_LABEL LAYER LEGEND',
    key: 'isoMetadata.services',
    validator: (services: Service[]) => {
      const layersMap: Record<string, Layer[]> = getValue('clientMetadata.layers') || {};
      const valid = services?.every((service) => {
        const isMappingService = service.serviceType === 'WMS' || service.serviceType === 'WMTS';
        return (
          !isMappingService ||
          layersMap[service.serviceIdentification]?.every((layer) => isDefined(layer.legendImage))
        );
      });
      return { valid };
    },
    section: 'services',
    required: true
  },
  {
    profileId: 54,
    label: 'FAKE_LABEL LAYER SHORT DESCRIPTION',
    key: 'isoMetadata.services',
    validator: (services: Service[], extra?: Record<string, any>) => {
      if (extra) {
        const valid = isDefined(extra?.value);
        if (!valid) {
          return {
            valid: false,
            helpText: 'Bitte geben Sie eine kurze Beschreibung an.'
          }
        }
        return { valid: true };
      }
      const layersMap: Record<string, Layer[]> = getValue('clientMetadata.layers') || {};
      const valid = services?.every((service) => {
        const isMappingService = service.serviceType === 'WMS' || service.serviceType === 'WMTS';
        return (
          !isMappingService ||
          layersMap[service.serviceIdentification]?.every((layer) =>
            isDefined(layer.shortDescription)
          )
        );
      });
      return { valid };
    },
    section: 'services',
    required: true
  },
  {
    profileId: 55,
    label: 'FAKE_LABEL LAYER DATASOURCE',
    key: 'isoMetadata.services',
    validator: (services: Service[]) => {
      const layersMap: Record<string, Layer[]> = getValue('clientMetadata.layers') || {};
      const valid = services?.every((service) => {
        const isMappingService = service.serviceType === 'WMS' || service.serviceType === 'WMTS';
        return (
          !isMappingService ||
          layersMap[service.serviceIdentification]?.every((layer) => isDefined(layer.datasource))
        );
      });
      return { valid };
    },
    section: 'services',
    required: true,
    editingRoles: ['MdeDataOwner']
  },
  {
    profileId: 56,
    label: 'FAKE_LABEL LAYER SECONDARY DATASOURCE',
    key: 'isoMetadata.services',
    validator: (services: Service[]) => {
      const layersMap: Record<string, Layer[]> = getValue('clientMetadata.layers') || {};
      const valid = services?.every((service) => {
        const isMappingService = service.serviceType === 'WMS' || service.serviceType === 'WMTS';
        return (
          !isMappingService ||
          layersMap[service.serviceIdentification]?.every((layer) =>
            isDefined(layer.secondaryDatasource)
          )
        );
      });
      return { valid };
    },
    section: 'services',
    required: true,
    editingRoles: ['MdeEditor']
  },
  // profileId: 57 is not used anymore (service count)
  // TODO: add profileId: 58 layerTyp
  // profileId: 59 and 60 are superseeded by (43 and 44) service title and short description
  {
    profileId: 61,
    label: 'FAKE_LABEL FEATURETYPE LENGTH',
    key: 'isoMetadata.services',
    validator: (services: Service[]) => {
      const valid = services?.every((service) => {
        const isWFS = service.serviceType === 'WFS';
        return !isWFS || service.featureTypes?.length;
      });
      return { valid };
    },
    section: 'services',
    required: true
  },
  {
    profileId: 62,
    label: 'FAKE_LABEL FEATURETYPE TITEL',
    key: 'isoMetadata.services',
    validator: (services: Service[]) => {
      const valid = services?.every((service) => {
        const isWFS = service.serviceType === 'WFS';
        return !isWFS || service.featureTypes?.every((ft) => isDefined(ft.title));
      });
      return { valid };
    },
    section: 'services',
    required: true
  },
  {
    profileId: 63,
    label: 'FAKE_LABEL FEATURETYPE NAME',
    key: 'isoMetadata.services',
    validator: (services: Service[]) => {
      const valid = services?.every((service) => {
        const isWFS = service.serviceType === 'WFS';
        return !isWFS || service.featureTypes?.every((ft) => isDefined(ft.name));
      });
      return { valid };
    },
    section: 'services',
    required: true,
    editingRoles: ['MdeEditor']
  },
  {
    profileId: 64,
    label: 'FAKE_LABEL FEATURETYPE ATTRIBUTE LENGTH',
    key: 'isoMetadata.services',
    validator: (services: Service[]) => {
      const valid = services?.every((service) => {
        const isWFS = service.serviceType === 'WFS';
        return !isWFS || service.featureTypes?.every((ft) => ft.columns?.length);
      });
      return { valid };
    },
    section: 'services',
    required: true
  },
  {
    profileId: 65,
    label: 'FAKE_LABEL FEATURETYPE ATTRIBUTE NAME',
    key: 'isoMetadata.services',
    validator: (services: Service[]) => {
      const valid = services?.every((service) => {
        const isWFS = service.serviceType === 'WFS';
        return (
          !isWFS ||
          service.featureTypes?.every((ft) => ft.columns?.every((col) => isDefined(col.name)))
        );
      });
      return { valid };
    },
    section: 'services',
    required: true
  },
  {
    profileId: 66,
    label: 'FAKE_LABEL FEATURETYPE ATTRIBUTE ALIAS',
    key: 'isoMetadata.services',
    validator: (services: Service[]) => {
      const valid = services?.every((service) => {
        const isWFS = service.serviceType === 'WFS';
        return (
          !isWFS ||
          service.featureTypes?.every((ft) => ft.columns?.every((col) => isDefined(col.alias)))
        );
      });
      return { valid };
    },
    section: 'services',
    required: true
  },
  {
    profileId: 67,
    label: 'FAKE_LABEL FEATURETYPE ATTRIBUTE DATA TYPE',
    key: 'isoMetadata.services',
    validator: (services: Service[]) => {
      const valid = services?.every((service) => {
        const isWFS = service.serviceType === 'WFS';
        return (
          !isWFS ||
          service.featureTypes?.every((ft) => ft.columns?.every((col) => isDefined(col.type)))
        );
      });
      return { valid };
    },
    section: 'services',
    required: true,
    editingRoles: ['MdeEditor']
  },
  {
    profileId: 68,
    label: 'FAKE_LABEL FEATURETYPE ATTRIBUTE FILTER TYPE',
    key: 'isoMetadata.services',
    validator: (services: Service[]) => {
      const valid = services?.every((service) => {
        const isWFS = service.serviceType === 'WFS';
        return (
          !isWFS ||
          service.featureTypes?.every((ft) => ft.columns?.every((col) => isDefined(col.filterType)))
        );
      });
      return { valid };
    },
    section: 'services',
    required: true,
    editingRoles: ['MdeEditor']
  },
  {
    profileId: 64, // duplication with "FAKE_LABEL FEATURETYPE ATTRIBUTE LENGTH"
    label: 'FAKE_LABEL DOWNLOAD LENGTH',
    key: 'isoMetadata.services',
    validator: (services: Service[]) => {
      const valid = services?.every((service) => {
        const isAtom = service.serviceType === 'ATOM';
        return !isAtom || service.downloads?.length;
      });
      return { valid };
    },
    section: 'services',
    required: true
  },
  {
    profileId: 69,
    label: 'FAKE_LABEL DOWNLOAD TITEL',
    key: 'isoMetadata.services',
    validator: (services: Service[]) => {
      const valid = services?.every((service) => {
        const isAtom = service.serviceType === 'ATOM';
        return !isAtom || service.downloads?.every((download) => isDefined(download.title));
      });
      return { valid };
    },
    section: 'services',
    required: true
  },
  {
    profileId: 70,
    label: 'FAKE_LABEL DOWNLOAD TYPE',
    key: 'isoMetadata.services',
    validator: (services: Service[]) => {
      const valid = services?.every((service) => {
        const isAtom = service.serviceType === 'ATOM';
        return !isAtom || service.downloads?.every((download) => isDefined(download.type));
      });
      return { valid };
    },
    section: 'services',
    required: true,
    editingRoles: ['MdeEditor']
  },
  {
    profileId: 71,
    label: 'FAKE_LABEL DOWNLOAD URL',
    key: 'isoMetadata.services',
    validator: (services: Service[]) => {
      const valid = services?.every((service) => {
        const isAtom = service.serviceType === 'ATOM';
        return !isAtom || service.downloads?.every((download) => isDefined(download.href));
      });
      return { valid };
    },
    section: 'services',
    required: true,
    editingRoles: ['MdeEditor']
  },
  {
    profileId: 72,
    label: 'FAKE_LABEL DOWNLOAD FILE SIZE',
    key: 'isoMetadata.services',
    validator: (services: Service[]) => {
      const valid = services?.every((service) => {
        const isAtom = service.serviceType === 'ATOM';
        return !isAtom || service.downloads?.every((download) => isDefined(download.fileSize));
      });
      return { valid };
    },
    section: 'services',
    required: true,
    editingRoles: ['MdeEditor']
  }
];
