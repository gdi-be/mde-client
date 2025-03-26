/* eslint-disable @typescript-eslint/no-explicit-any */
import type { FieldKey } from '$lib/models/form';
import type { Contacts, Extent } from '$lib/models/metadata';
import type { Section } from '$lib/context/FormContext.svelte';

export type ValidationResult = {
  valid: boolean;
  helpText?: string;
};

export type ValidationResultList = (ValidationResult & {
  index?: number;
  subKey?: string;
})[];

export type FieldConfig<T> = {
  profile_id: number;
  key: FieldKey;
  label: string;
  validator: (
    val: T | undefined,
    extra?: Record<string, any>
  ) => ValidationResultList | ValidationResult;
  section: Section;
  required?: boolean;
};

const isDefined = (val: any) => val !== undefined && val !== null && val !== '';

const isValidPhoneNumber = (val: string) => {
  const numberRegex = /^[+]?[0-9\s]+$/;
  return numberRegex.test(val);
};

const isValidEmail = (val: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(val);
};

export const FieldConfigs: FieldConfig<any>[] = [
  {
    profile_id: 1,
    key: 'isoMetadata.title',
    label: 'Titel des Datenbestandes',
    validator: (val) => {
      if (!isDefined(val)) {
        return {
          valid: false,
          helpText: 'Bitte geben Sie einen Titel an.'
        };
      }
      return {
        valid: true,
        helpText: 'Es wird eine maximale Titel-Länge von 100 Zeichen empfohlen.'
      };
    },
    section: 'basedata',
    required: true
  },
  {
    profile_id: 2,
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
    profile_id: 15,
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
    required: true
  },
  {
    profile_id: 29,
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
    profile_id: 19,
    label: 'Kontaktangaben',
    key: 'isoMetadata.pointsOfContact',
    validator: (contacts?: Contacts): ValidationResultList => {
      const validationResult: ValidationResultList = [];
      if (!contacts || contacts.length < 1)
        return [
          {
            valid: false,
            helpText: 'Bitte geben Sie mindestens einen Kontakt an.'
          }
        ];

      for (const [index, contact] of contacts.entries()) {
        if (!isDefined(contact.name)) {
          validationResult.push({
            valid: false,
            helpText: 'Bitte geben Sie den Namen des Kontakts an.',
            index,
            subKey: 'name'
          });
        }
        if (!isDefined(contact.email)) {
          validationResult.push({
            valid: false,
            helpText: 'Bitte geben Sie die E-Mail-Adresse des Kontakts an.',
            index,
            subKey: 'email'
          });
        } else if (!isValidEmail(contact.email!)) {
          validationResult.push({
            valid: false,
            helpText: 'Bitte geben Sie eine gültige E-Mail-Adresse an.',
            index,
            subKey: 'email'
          });
        }
        if (!isDefined(contact.organisation)) {
          validationResult.push({
            valid: false,
            helpText: 'Bitte geben Sie die Organisation des Kontakts an.',
            index,
            subKey: 'organisation'
          });
        }
        if (!isDefined(contact.phone)) {
          validationResult.push({
            valid: false,
            helpText: 'Bitte geben Sie die Telefonnummer des Kontakts an.',
            index,
            subKey: 'phone'
          });
        } else if (!isValidPhoneNumber(contact.phone!)) {
          validationResult.push({
            valid: false,
            helpText: 'Bitte geben Sie eine gültige Telefonnummer an.',
            index,
            subKey: 'phone'
          });
        }
      }
      return validationResult;
    },
    section: 'basedata',
    required: true
  },
  {
    profile_id: 5,
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
    profile_id: 4,
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
    profile_id: 24,
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
    required: true
  },
  {
    profile_id: 7,
    label: 'INSPIRE Annex Thema',
    key: 'isoMetadata.inspireTheme',
    validator: (val: any) => {
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
    profile_id: 38,
    label: 'Schema-Version des INSPIRE Themas',
    key: 'isoMetadata.inspireAnnexVersion',
    validator: () => {
      // Optional
      return { valid: true };
    },
    section: 'classification',
    required: true
  },
  {
    profile_id: 37,
    label: 'Überprüfung des Qualitätsberichts',
    key: 'isoMetadata.valid',
    validator: () => ({ valid: true }),
    section: 'classification',
    required: true
  },
  {
    profile_id: 6,
    label: 'High Value Datensatz',
    key: 'clientMetadata.highValueDataset',
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
    profile_id: 13,
    label: 'Themenkategorie',
    key: 'isoMetadata.topicCategory',
    validator: (val: any) => {
      if (!isDefined(val)) {
        return {
          valid: false,
          helpText: 'Bitte geben Sie eine Themenkategorie an.'
        };
      }
      return { valid: true };
    },
    section: 'classification',
    required: true
  },
  {
    profile_id: 9,
    label: 'Erstellungsdatum',
    key: 'isoMetadata.created',
    validator: () => {
      // Optional
      return { valid: true };
    },
    section: 'temp_and_spatial',
    required: true
  },
  {
    profile_id: 10,
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
    profile_id: 14,
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
    profile_id: 11,
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
    profile_id: 12,
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
    required: true
  },
  {
    profile_id: 12,
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
    required: true
  },
  {
    profile_id: 16,
    label: 'geliefertes Koordinatensystem',
    key: 'technicalMetadata.deliveredCrs',
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
    required: true
  },
  {
    profile_id: 17,
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
    required: true
  },
  {
    profile_id: 18,
    label: 'Räumliche Ausdehnung',
    key: 'isoMetadata.extent',
    validator: (val?: Extent) => {
      const validationResult: ValidationResultList = [];
      if (!val) {
        return [
          {
            valid: false,
            helpText: 'Bitte geben Sie die Ausdehnung an.'
          }
        ];
      } else {
        if (!val.minx || val.minx < 1) {
          validationResult.push({
            valid: false,
            helpText: 'Bitte geben Sie den minimalen x-Wert an.',
            subKey: 'minx'
          });
        }
        if (!val.miny || val.miny < 1) {
          validationResult.push({
            valid: false,
            helpText: 'Bitte geben Sie den minimalen y-Wert an.',
            subKey: 'miny'
          });
        }
        if (!val.maxx || val.maxx < 1) {
          validationResult.push({
            valid: false,
            helpText: 'Bitte geben Sie den maximalen x-Wert an.',
            subKey: 'maxx'
          });
        }
        if (!val.maxy || val.maxy < 1) {
          validationResult.push({
            valid: false,
            helpText: 'Bitte geben Sie den maximalen y-Wert an.',
            subKey: 'maxy'
          });
        }
      }
      return validationResult;
    },
    section: 'temp_and_spatial',
    required: true
  },
  {
    profile_id: 28,
    label: 'Bodenauflösung',
    key: 'isoMetadata.resolutions',
    validator: (val: any) => {
      if (!isDefined(val)) {
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
    profile_id: 27,
    label: 'Vergleichsmaßstab',
    key: 'isoMetadata.scale',
    validator: (val: any) => {
      if (!isDefined(val)) {
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
    profile_id: 30,
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
    profile_id: 31,
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
    profile_id: 32,
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
    profile_id: 39,
    label: 'Weitere Informationen',
    key: 'isoMetadata.contentDescriptions',
    validator: () => {
      // Optional
      return { valid: true };
    },
    section: 'additional',
    required: false
  }
];
