/* eslint-disable @typescript-eslint/no-explicit-any */
import type { FieldKey, Option } from '$lib/models/form';
import {
  type ColumnInfo,
  type Contacts,
  type FeatureType,
  type IsoTheme,
  type Keywords,
  type Layer,
  type MaintenanceFrequency,
  type MetadataProfile,
  type Service,
  type TermsOfUse
} from '$lib/models/metadata';
import { getValue, type Section } from '$lib/context/FormContext.svelte';
import type { Role } from '$lib/models/keycloak';

export type ValidationResult = {
  valid: boolean;
  helpText?: string;
};

export interface YamlFieldConfig {
  key?: FieldKey;
  profileId: number;
  label?: string;
  explanation?: string;
  placeholder?: string;
  hint?: string;
}

export interface FullFieldConfig<T = any> extends YamlFieldConfig {
  // the key in the json structure
  key: FieldKey;
  // if the field is required
  required?: boolean;
  // the rootKey for nested fields
  collectionKey?: FieldKey;
  // indicates if this field is just a collection container (e.g. services[], featureTypes[])
  isCollection?: boolean;
  // the roles that can edit this field
  editingRoles?: Role[];
  // the section this field belongs to
  section: Section;
  // the validator function for this field
  validator: (val: T | undefined, extra?: Record<string, any>) => ValidationResult;
  // additional parameters for the validator function
  validatorExtraParams?: Array<FieldKey | 'PARENT_VALUE'>;
  // this function is used to get the value for the copy button
  getCopyValue?: (val: T | undefined) => string | Promise<string>;
}

const isDefined = <T>(val: T): val is NonNullable<T> => {
  if (val === undefined || val === null || val === '') return false;
  if (Array.isArray(val)) return val.length > 0;
  return true;
};

const isValidPhoneNumber = (val: string) => {
  const numberRegex = /^[0-9]+$/;
  return numberRegex.test(val);
};

const isValidEmail = (val: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(val);
};

const optionalValidator = () => ({
  valid: true
});

const formatDate = (date: Date | string): string => {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  const format = Intl.DateTimeFormat('de-DE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  return format.format(date);
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
    getCopyValue: async (val: string) => {
      const response = await fetch('/data/privacy');
      const privacyOptions: Option[] = await response.json();
      return privacyOptions.find((option) => option.key === val)?.label || '';
    },
    section: 'classification',
    required: true
  },
  {
    profileId: 5,
    label: 'Metadaten-Typ',
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
    getCopyValue(val?: MetadataProfile) {
      if (!val) {
        return '';
      }
      const valueMap = {
        ISO: 'ISO',
        INSPIRE_HARMONISED: 'INSPIRE harmonisiert',
        INSPIRE_IDENTIFIED: 'INSPIRE identifiziert'
      };
      return valueMap[val];
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
    validatorExtraParams: ['isoMetadata.metadataProfile'],
    validator: (val: string[], extraParams) => {
      const metadataProfile = extraParams?.['isoMetadata.metadataProfile'];
      if (metadataProfile === 'ISO') {
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
    getCopyValue: async (val?: string[]) => {
      const response = await fetch('/data/inspire_themes');
      const themesArray: Option[] = await response.json();
      const themes = val?.map((v) => themesArray.find((theme) => theme.key === v)?.label) || [];
      return themes.join(', ');
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
    validator: optionalValidator,
    getCopyValue: (val?: string) => {
      if (!isDefined(val)) {
        return '';
      }
      return formatDate(val);
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
    getCopyValue: (val?: string) => {
      if (!isDefined(val)) {
        return '';
      }
      return formatDate(val);
    },
    section: 'temp_and_spatial',
    required: true
  },
  {
    profileId: 11,
    label: 'letzte Aktualisierung',
    key: 'isoMetadata.modified',
    validator: optionalValidator,
    getCopyValue: (val?: string) => {
      if (!isDefined(val)) {
        return '';
      }
      return formatDate(val);
    },
    section: 'temp_and_spatial',
    required: true
  },
  {
    profileId: 12, // duplication with "isoMetadata.validTo"
    label: 'gültig ab',
    key: 'isoMetadata.validFrom',
    validatorExtraParams: ['isoMetadata.validTo'],
    validator: (startValue: string, extraParams) => {
      const endValue = extraParams?.[0];
      if (startValue && endValue && new Date(startValue) > new Date(endValue)) {
        return {
          valid: false,
          helpText: 'Das Startdatum muss vor dem Enddatum liegen.'
        };
      }
      return { valid: true };
    },
    getCopyValue: (val?: string) => {
      const validTo = getValue<string>('isoMetadata.validTo');
      const fromDate = val && formatDate(val);
      const toDate = validTo && formatDate(validTo);

      if (fromDate && toDate) {
        return `Vom ${fromDate} bis ${toDate}`;
      }
      if (fromDate) {
        return `Ab ${fromDate}`;
      }
      if (toDate) {
        return `Bis ${toDate}`;
      }
      return '';
    },
    section: 'temp_and_spatial',
    required: false
  },
  {
    profileId: 12, // duplication with "isoMetadata.validFrom"
    label: 'gültig bis',
    key: 'isoMetadata.validTo',
    validatorExtraParams: ['isoMetadata.validFrom'],
    validator: (endValue: string, extraParams) => {
      const startValue = extraParams?.[0];
      if (endValue && startValue && new Date(startValue) > new Date(endValue)) {
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
    getCopyValue: async (val?: string[]) => {
      const response = await fetch('/data/iso_themes');
      const isoThemes: IsoTheme[] = await response.json();
      const categories =
        val?.map((v) => isoThemes.find((category) => category.isoID === v)?.isoName) || [];
      return categories.join(', ');
    },
    section: 'classification',
    required: true,
    editingRoles: ['MdeEditor']
  },
  {
    profileId: 14,
    label: 'Pflegeintervall',
    key: 'isoMetadata.maintenanceFrequency',
    validator: (val: string) => {
      if (!isDefined(val)) {
        return {
          valid: false,
          helpText: 'Bitte geben Sie ein Pflegeintervall an.'
        };
      }
      return { valid: true };
    },
    getCopyValue: async (val?: MaintenanceFrequency) => {
      const maintenanceFrequencyLabels: Record<MaintenanceFrequency, string> = {
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
      return val ? maintenanceFrequencyLabels[val] : '';
    },
    section: 'temp_and_spatial',
    required: true
  },
  {
    profileId: 15,
    label: 'Schlagwörter',
    key: 'isoMetadata.keywords',
    validator: (val?: Keywords) => {
      if (!val || !val.default || val.default.length < 1) {
        return {
          valid: false,
          helpText: 'Bitte geben Sie mindestens ein Schlagwort an.'
        };
      }
      return { valid: true };
    },
    getCopyValue: (val?: Keywords) => {
      if (!val || !val.default || val.default.length < 1) {
        return '';
      }
      return val.default.map((kw) => kw.keyword).join(', ');
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
    validator: (val?: string) => {
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
    profileId: 18, // multiple entries for extent
    label: 'Räumliche Ausdehnung',
    key: 'isoMetadata.extent.minx',
    section: 'temp_and_spatial',
    required: true,
    editingRoles: ['MdeEditor'],
    validator: (val?: number) => {
      if (!val || val < 1) {
        return {
          valid: false,
          helpText: 'Bitte geben Sie den minimalen x-Wert an.'
        };
      }
      return { valid: true };
    }
  },
  {
    profileId: 18, // multiple entries for extent
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
        };
      }
      return { valid: true };
    }
  },
  {
    profileId: 18, // multiple entries for extent
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
  },
  {
    profileId: 18, // multiple entries for extent
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
    }
  },
  {
    profileId: 19,
    label: 'Kontaktangaben',
    key: 'isoMetadata.pointsOfContact',
    isCollection: true,
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
  },
  {
    profileId: 20,
    label: 'Name',
    key: 'isoMetadata.pointsOfContact.name',
    section: 'basedata',
    required: true,
    collectionKey: 'isoMetadata.pointsOfContact',
    validator: (val: string) => {
      if (!isDefined(val)) {
        return {
          valid: false,
          helpText: 'Bitte geben Sie den Namen des Kontakts an.'
        };
      }
      return { valid: true };
    }
  },
  {
    profileId: 21,
    label: 'Organisation',
    key: 'isoMetadata.pointsOfContact.organisation',
    section: 'basedata',
    required: true,
    collectionKey: 'isoMetadata.pointsOfContact',
    validator: (val: string) => {
      if (!isDefined(val)) {
        return {
          valid: false,
          helpText: 'Bitte geben Sie die Organisation des Kontakts an.'
        };
      }
      return { valid: true };
    }
  },
  {
    profileId: 22,
    label: 'E-Mail',
    key: 'isoMetadata.pointsOfContact.email',
    section: 'basedata',
    required: true,
    collectionKey: 'isoMetadata.pointsOfContact',
    validator: (val: string) => {
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
  },
  {
    profileId: 23,
    label: 'Telefonnummer',
    key: 'isoMetadata.pointsOfContact.phone',
    section: 'basedata',
    required: true,
    collectionKey: 'isoMetadata.pointsOfContact',
    validator: (val: string) => {
      if (!isDefined(val)) {
        return {
          valid: false,
          helpText: 'Bitte geben Sie die Telefonnummer des Kontakts an.'
        };
      }
      if (!isValidPhoneNumber(val)) {
        return {
          valid: false,
          helpText:
            'Bitte geben Sie eine gültige Telefonnummer an. Es sind ausschließlich Zahlen erlaubt.'
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
    getCopyValue: async (val: number) => {
      const response = await fetch('/data/terms_of_use');
      const termsOfUseList: TermsOfUse[] = await response.json();
      return termsOfUseList.find((tou) => tou.id === val)?.shortname || '';
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
    validatorExtraParams: ['isoMetadata.resolutions'],
    validator: (val: any, extraParams) => {
      const resolutions = extraParams?.['isoMetadata.resolutions'];
      if (!isDefined(val) && !isDefined(resolutions)) {
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
    validatorExtraParams: ['isoMetadata.scale'],
    validator: (val: any, extraParams) => {
      const scale = extraParams?.['isoMetadata.scale'];
      if (!isDefined(val) && !isDefined(scale)) {
        return {
          valid: false,
          helpText: 'Bitte geben Sie die Bodenauflösung an.'
        };
      }
      return { valid: true };
    },
    getCopyValue: (val?: [number]) => {
      return val?.length === 1 ? val[0].toString() : '';
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
    isCollection: true,
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
    profileId: 33,
    label: 'Herkunft der Daten',
    key: 'isoMetadata.lineage.title',
    collectionKey: 'isoMetadata.lineage',
    validator: (val: any) => {
      if (!isDefined(val)) {
        return {
          valid: false,
          helpText: 'Bitte geben Sie einen Titel an.'
        };
      }
      return { valid: true };
    },
    section: 'additional',
    required: true
  },
  {
    profileId: 34,
    label: 'Herkunft der Daten',
    key: 'isoMetadata.lineage.date',
    collectionKey: 'isoMetadata.lineage',
    validator: optionalValidator,
    getCopyValue: (val?: string) => {
      if (!isDefined(val)) {
        return '';
      }
      return formatDate(val);
    },
    section: 'additional',
    required: false
  },
  {
    profileId: 35,
    label: 'Herkunft der Daten',
    key: 'isoMetadata.lineage.identifier',
    collectionKey: 'isoMetadata.lineage',
    validator: () => {
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
    getCopyValue: (val?: boolean) => {
      return val ? 'Überprüft' : 'Nicht überprüft';
    },
    section: 'classification',
    required: false
  },
  {
    profileId: 38,
    label: 'Schema-Version des INSPIRE Themas',
    key: 'isoMetadata.inspireAnnexVersion',
    validatorExtraParams: ['isoMetadata.metadataProfile'],
    validator: (val: any, extraParams) => {
      const metadataProfile = extraParams?.['isoMetadata.metadataProfile'];
      if (metadataProfile === 'INSPIRE_HARMONISED' && !isDefined(val)) {
        return {
          valid: false,
          helpText: 'Bitte geben Sie die Schema-Version des INSPIRE Themas an.'
        };
      }
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
    isCollection: true,
    validator: optionalValidator,
    section: 'additional',
    required: false
  },
  {
    profileId: 39,
    key: 'isoMetadata.contentDescriptions.title',
    collectionKey: 'isoMetadata.contentDescriptions',
    validator: (val: string) => {
      if (!isDefined(val)) {
        return {
          valid: false,
          helpText: 'Bitte geben Sie einen Titel an.'
        };
      }
      return { valid: true };
    },
    section: 'additional',
    required: false
  },
  {
    profileId: 39,
    key: 'isoMetadata.contentDescriptions.code',
    collectionKey: 'isoMetadata.contentDescriptions',
    validator: optionalValidator,
    getCopyValue: (val?: string) => {
      const codeLabels: Record<string, string> = {
        download: 'Herunterladen',
        information: 'Information',
        offlineAccess: 'Offline-Zugriff',
        order: 'Bestellung',
        search: 'Suche'
      };
      return val ? codeLabels[val] || '' : '';
    },
    section: 'additional',
    required: false
  },
  {
    profileId: 39,
    key: 'isoMetadata.contentDescriptions.url',
    collectionKey: 'isoMetadata.contentDescriptions',
    validator: optionalValidator,
    section: 'additional',
    required: false
  },
  {
    profileId: 40,
    key: 'isoMetadata.services',
    isCollection: true,
    validator: () => ({ valid: true }),
    section: 'services',
    required: false
  },
  // profileId: 41 and 42 are not used anymore (WMTS special handling)
  // profiledId: 43 and 44 are superseeded by (58 and 59) service title and short description
  {
    profileId: 45,
    key: 'isoMetadata.services.workspace',
    collectionKey: 'isoMetadata.services',
    validatorExtraParams: ['PARENT_VALUE'],
    validator: (workspace: Service['workspace'], extraParams) => {
      const service = extraParams?.['PARENT_VALUE'];
      if (service?.serviceType !== 'WMTS' && service?.serviceType !== 'WMS') {
        return { valid: true };
      }
      const valid = !!(isDefined(workspace) && /^[a-zA-Z0-9_]+$/.test(workspace));
      if (!valid) {
        return {
          valid: false,
          helpText:
            'Bitte geben Sie einen gültigen Workspace an. Nur Buchstaben, Zahlen und Unterstriche sind erlaubt.'
        };
      }
      return { valid };
    },
    section: 'services',
    required: true,
    editingRoles: ['MdeEditor']
  },
  {
    profileId: 46,
    key: 'isoMetadata.services.preview',
    collectionKey: 'isoMetadata.services',
    validatorExtraParams: ['PARENT_VALUE'],
    validator: (preview: Service['preview'], extraParams) => {
      const service = extraParams?.['PARENT_VALUE'];
      if (service?.serviceType !== 'WMS' && service?.serviceType !== 'WMTS') {
        return { valid: true };
      }
      const valid = isDefined(preview);
      if (!valid) {
        return {
          valid: false,
          helpText: 'Bitte geben Sie ein Vorschaubild für den Service an.'
        };
      }
      return { valid };
    },
    section: 'services',
    required: true
  },
  {
    profileId: 47,
    key: 'isoMetadata.services.legendImage',
    validator: optionalValidator,
    section: 'services',
    required: false
  },
  {
    profileId: 47,
    key: 'isoMetadata.services.legendImage.url',
    validator: optionalValidator,
    section: 'services',
    required: false
  },
  {
    profileId: 47,
    key: 'isoMetadata.services.legendImage.format',
    validator: optionalValidator,
    section: 'services',
    required: false
  },
  {
    profileId: 47,
    key: 'isoMetadata.services.legendImage.width',
    validator: optionalValidator,
    section: 'services',
    required: false
  },
  {
    profileId: 47,
    key: 'isoMetadata.services.legendImage.height',
    validator: optionalValidator,
    section: 'services',
    required: false
  },
  {
    // This is used in the LayersForm
    profileId: 48,
    key: 'clientMetadata.layers',
    collectionKey: 'isoMetadata.services',
    validatorExtraParams: ['PARENT_VALUE'],
    validator: (layers: Layer[], extraParams) => {
      const service = extraParams?.['PARENT_VALUE'];
      // only needs layers if type is WMS or WMTS
      if (service?.serviceType !== 'WMS' && service?.serviceType !== 'WMTS') {
        return { valid: true };
      }
      const valid = layers?.length > 0;
      if (!valid) {
        return {
          valid: false,
          helpText: 'Bitte geben Sie mindestens einen Layer an.'
        };
      }
      return { valid };
    },
    section: 'services',
    required: true
  },
  {
    profileId: 49,
    key: 'clientMetadata.layers.title',
    collectionKey: 'clientMetadata.layers',
    validator: (layerTitle: Layer['title']) => {
      if (!isDefined(layerTitle)) {
        return {
          valid: false,
          helpText: 'Bitte geben Sie einen Titel für den Layer an.'
        };
      }
      return { valid: true };
    },
    section: 'services',
    required: true
  },
  {
    profileId: 50,
    key: 'clientMetadata.layers.name',
    collectionKey: 'clientMetadata.layers',
    validator: (layerName: Layer['name']) => {
      if (!isDefined(layerName)) {
        return {
          valid: false,
          helpText: 'Bitte geben Sie einen Namen für den Layer an.'
        };
      }
      if (!/^[a-zA-Z0-9_]+$/.test(layerName)) {
        return {
          valid: false,
          helpText: 'Der Name des Layers darf nur Buchstaben, Zahlen und Unterstriche enthalten.'
        };
      }
      return { valid: true };
    },
    section: 'services',
    required: true,
    editingRoles: ['MdeEditor']
  },
  {
    profileId: 51,
    key: 'clientMetadata.layers.styleName',
    collectionKey: 'clientMetadata.layers',
    validator: (styleName: Layer['styleName']) => {
      if (!styleName || !isDefined(styleName)) {
        return {
          valid: false,
          helpText: 'Bitte geben Sie einen Style-Namen für den Layer an.'
        };
      } else if (!/^[a-zA-Z0-9_]+$/.test(styleName)) {
        return {
          valid: false,
          helpText:
            'Der Style-Name des Layers darf nur Buchstaben, Zahlen und Unterstriche enthalten.'
        };
      }
      return { valid: true };
    },
    section: 'services',
    required: true,
    editingRoles: ['MdeEditor']
  },
  {
    profileId: 52,
    key: 'clientMetadata.layers.styleTitle',
    collectionKey: 'clientMetadata.layers',
    validator: (styleTitle: Layer['styleTitle']) => {
      const isInspireHarmonized =
        getValue<MetadataProfile>('isoMetadata.metadataProfile') === 'INSPIRE_HARMONISED';
      if (isInspireHarmonized && !isDefined(styleTitle)) {
        return {
          valid: false,
          helpText: 'Bitte geben Sie einen Style-Titel für den Layer an.'
        };
      }
      return { valid: true };
    },
    section: 'services',
    required: true,
    editingRoles: ['MdeEditor']
  },
  {
    profileId: 53,
    key: 'clientMetadata.layers.legendImage',
    collectionKey: 'clientMetadata.layers',
    validator: (legendImage: Layer['legendImage']) => {
      if (!isDefined(legendImage)) {
        return {
          valid: false,
          helpText: 'Bitte geben Sie ein Legendenbild für den Layer an.'
        };
      }
      return { valid: true };
    },
    section: 'services',
    required: true
  },
  {
    profileId: 54,
    key: 'clientMetadata.layers.shortDescription',
    collectionKey: 'clientMetadata.layers',
    validator: (description: Layer['shortDescription']) => {
      const valid = isDefined(description);
      if (!valid) {
        return {
          valid: false,
          helpText: 'Bitte geben Sie eine kurze Beschreibung an.'
        };
      }
      return { valid: true };
    },
    section: 'services',
    required: true
  },
  {
    profileId: 55,
    key: 'clientMetadata.layers.datasource',
    collectionKey: 'clientMetadata.layers',
    validator: (datasource: Layer['datasource']) => {
      const valid = isDefined(datasource);
      if (!valid) {
        return {
          valid: false,
          helpText: 'Bitte geben Sie eine Datenquelle an.'
        };
      }
      return { valid };
    },
    section: 'services',
    required: true
  },
  {
    profileId: 56,
    key: 'clientMetadata.layers.secondaryDatasource',
    collectionKey: 'clientMetadata.layers',
    validator: (secondaryDatasource: Layer['secondaryDatasource']) => {
      const valid = isDefined(secondaryDatasource);
      if (!valid) {
        return {
          valid: false,
          helpText: 'Bitte geben Sie eine sekundäre Datenquelle an.'
        };
      }
      return { valid };
    },
    section: 'services',
    required: true,
    editingRoles: ['MdeEditor']
  },
  // profileId: 57 is not used anymore (service count)
  {
    profileId: 58,
    key: 'isoMetadata.services.serviceType',
    collectionKey: 'isoMetadata.services',
    validator: (serviceType: Service['serviceType']) => {
      const valid = isDefined(serviceType);
      if (!valid) {
        return {
          valid: false,
          helpText: 'Bitte geben Sie einen Service-Typ an.'
        };
      }
      return { valid };
    },
    section: 'services',
    required: true
  },
  {
    profileId: 59,
    key: 'isoMetadata.services.title',
    collectionKey: 'isoMetadata.services',
    validator: (title: Service['title']) => {
      const valid = isDefined(title);
      if (!valid) {
        return {
          valid: false,
          helpText: 'Bitte geben Sie einen Titel für den Service an.'
        };
      }
      return { valid };
    },
    section: 'services',
    required: true
  },
  {
    profileId: 60,
    key: 'isoMetadata.services.shortDescription',
    collectionKey: 'isoMetadata.services',
    validator: (shortDescription: Service['shortDescription']) => {
      const valid = isDefined(shortDescription);
      if (!valid) {
        return {
          valid: false,
          helpText: 'Bitte geben Sie eine kurze Beschreibung für den Service an.'
        };
      }
      return { valid };
    },
    section: 'services',
    required: true
  },
  {
    profileId: 61,
    key: 'isoMetadata.services.featureTypes',
    collectionKey: 'isoMetadata.services',
    isCollection: true,
    validatorExtraParams: ['PARENT_VALUE'],
    validator: (featureTypes: FeatureType[], extraParams) => {
      const service = extraParams?.['PARENT_VALUE'];
      // only needs featureTypes if type is WFS
      if (!service || service.serviceType !== 'WFS') {
        return { valid: true };
      }
      const valid = featureTypes?.length > 0;
      if (!valid) {
        return {
          valid: false,
          helpText: 'Bitte geben Sie mindestens einen FeatureType an.'
        };
      }
      return { valid };
    },
    section: 'services',
    required: true
  },
  {
    profileId: 62,
    key: 'isoMetadata.services.featureTypes.title',
    collectionKey: 'isoMetadata.services.featureTypes',
    validator: (title: FeatureType['title']) => {
      const valid = isDefined(title);
      if (!valid) {
        return {
          valid: false,
          helpText: 'Bitte geben Sie einen Titel für den FeatureType an.'
        };
      }
      return { valid };
    },
    section: 'services',
    required: true
  },
  {
    profileId: 63,
    key: 'isoMetadata.services.featureTypes.name',
    collectionKey: 'isoMetadata.services.featureTypes',
    validator: (name: FeatureType['name']) => {
      const valid = isDefined(name) && /^[a-zA-Z0-9_]+$/.test(name);
      if (!valid) {
        return {
          valid: false,
          helpText:
            'Der Name des FeatureTypes darf nur Buchstaben, Zahlen und Unterstriche enthalten.'
        };
      }
      return { valid };
    },
    section: 'services',
    required: true,
    editingRoles: ['MdeEditor']
  },
  {
    profileId: 64,
    key: 'isoMetadata.services.featureTypes.columns',
    collectionKey: 'isoMetadata.services.featureTypes',
    isCollection: true,
    validator: (val: ColumnInfo) => {
      const valid = isDefined(val);
      if (!valid) {
        return {
          valid: false,
          helpText: 'Bitte geben Sie mindestens eine Spalte für den FeatureType an.'
        };
      }
      return { valid };
    },
    section: 'services',
    required: true
  },
  {
    profileId: 65,
    key: 'isoMetadata.services.featureTypes.columns.name',
    collectionKey: 'isoMetadata.services.featureTypes.columns',
    validator: (name: ColumnInfo['name']) => {
      const valid = isDefined(name);
      if (!valid) {
        return {
          valid: false,
          helpText: 'Bitte geben Sie einen Namen für die Spalte an.'
        };
      }
      return { valid };
    },
    section: 'services',
    required: true
  },
  {
    profileId: 66,
    key: 'isoMetadata.services.featureTypes.columns.alias',
    collectionKey: 'isoMetadata.services.featureTypes.columns',
    validator: (alias: ColumnInfo['alias']) => {
      const valid = isDefined(alias);
      if (!valid) {
        return {
          valid: false,
          helpText: 'Bitte geben Sie einen Alias für die Spalte an.'
        };
      }
      return { valid };
    },
    section: 'services',
    required: true
  },
  {
    profileId: 67,
    key: 'isoMetadata.services.featureTypes.columns.type',
    collectionKey: 'isoMetadata.services.featureTypes.columns',
    validator: (type: ColumnInfo['type']) => {
      const valid = isDefined(type);
      if (!valid) {
        return {
          valid: false,
          helpText: 'Bitte geben Sie einen Typ für die Spalte an.'
        };
      }
      return { valid };
    },
    section: 'services',
    required: true,
    editingRoles: ['MdeEditor']
  },
  {
    profileId: 68,
    key: 'isoMetadata.services.featureTypes.columns.filterType',
    collectionKey: 'isoMetadata.services.featureTypes.columns',
    validator: (filterType: ColumnInfo['filterType']) => {
      const valid = isDefined(filterType);
      if (!valid) {
        return {
          valid: false,
          helpText: 'Bitte geben Sie einen Filtertyp für die Spalte an.'
        };
      }
      return { valid };
    },
    section: 'services',
    required: true,
    editingRoles: ['MdeEditor']
  }
];
