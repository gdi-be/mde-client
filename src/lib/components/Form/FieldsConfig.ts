/* eslint-disable @typescript-eslint/no-explicit-any */
import type { FieldKey } from "$lib/models/form";
import type { Contacts } from "$lib/models/metadata";
import type { Section } from "./FormContext.svelte";

export type ValidationResult = {
  valid: boolean;
  helpText?: string;
};

export type ValidationResultList = (ValidationResult & {
  index?: number;
  subKey?: string;
})[];

export type FieldConfig<T> = {
  key: FieldKey;
  validator: (val: T) => T extends any[] ? ValidationResultList : ValidationResult;
  section: Section;
  required?: boolean;
};

const isDefined = (val: any) => val !== undefined && val !== null && val !== '';

const isValidNumber = (val: string) => {
  const numberRegex = /^[+]?[0-9\s]+$/;
  return numberRegex.test(val);
};

const isValidEmail = (val: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(val);
}

export const FieldConfigs: FieldConfig<any>[] = [
  {
    key: 'isoMetadata.title',
    validator: (val) => {
      if (!isDefined(val)) {
        return {
          valid: false,
          helpText: 'Bitte geben Sie einen Titel an.',
        }
      }
      return {
        valid: true,
        helpText: 'Es wird eine maximale Titel-Länge von 100 Zeichen empfohlen.',
      };
    },
    section: 'basedata',
    required: true
  },
  {
    key: 'isoMetadata.description',
    validator: (val) => {
      if (!isDefined(val)) {
        return {
          valid: false,
          helpText: 'Bitte geben Sie eine Beschreibung an.',
        }
      };
      return { valid: true };
    },
    section: 'basedata',
    required: true
  },
  {
    key: 'isoMetadata.keywords',
    validator: (val: any) => {
      if (!val?.default?.length || !val.default.every(({ keyword }: any) => keyword !== '')) {
        return {
          valid: false,
          helpText: 'Bitte geben Sie mindestens ein Schlagwort an.',
        }
      }
      return { valid: true };
    },
    section: 'basedata',
    required: true
  },
  {
    key: 'isoMetadata.preview',
    validator: (val: any) => {
      if (!isDefined(val)) {
        return {
          valid: false,
          helpText: 'Bitte geben Sie ein Vorschaubild an.',
        }
      }
      if (!val.endsWith('.png')) {
        return {
          valid: false,
          helpText: 'Das Vorschaubild muss im PNG-Format sein.',
        }
      }
      return { valid: true };
    },
    section: 'basedata',
    required: true
  },
  {
    key: 'isoMetadata.pointsOfContact',
    validator: (contacts: Contacts) => {
      if (contacts?.length < 1) return {
        valid: false,
        helpText: 'Bitte geben Sie mindestens einen Kontakt an.',
      };
      const validationResult: ValidationResultList = [];

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
        } else if (!isValidNumber(contact.phone!)) {
          validationResult.push({
            valid: false,
            helpText: 'Bitte geben Sie eine gültige Telefonnummer an. (z.B. +49 123 456789)',
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
    key: 'isoMetadata.internal_comment',
    validator: (val: any) => {
      if (!isDefined(val)) {
        return {
          valid: false,
          helpText: 'Bitte geben Sie einen internen Kommentar an.',
        }
      }
      return { valid: true };
    },
    section: 'basedata',
    required: false
  },
  {
    key: 'isoMetadata.metadataProfile',
    validator: (val: any) => {
      if (!isDefined(val)) {
        return {
          valid: false,
          helpText: 'Bitte geben Sie einen Metadaten-Typ an.',
        }
      }
      return { valid: true };
    },
    section: 'classification',
    required: true
  },
  {
    key: 'isoMetadata.resourceConstraints',
    validator: (val: any) => {
      if (!isDefined(val)) {
        return {
          valid: false,
          helpText: 'Bitte geben Sie Datenschutz und Nutzungsbedingung an.',
        }
      }
      return { valid: true };
    },
    section: 'classification',
    required: true
  },
  {
    key: 'isoMetadata.inspireTheme',
    validator: (val: any) => {
      if (!isDefined(val)) {
        return {
          valid: false,
          helpText: 'Bitte geben Sie ein INSPIRE-Thema an.',
        }
      }
      return { valid: true };
    },
    section: 'classification',
    required: true
  },
  {
    key: 'isoMetadata.qualityReportCheck',
    validator: (val: any) => {
      if (!isDefined(val)) {
        return {
          valid: false,
          helpText: 'Bitte geben Sie eine Qualitätsprüfung an.',
        }
      }
      return { valid: true };
    },
    section: 'classification',
    required: true
  },
  {
    key: 'clientMetadata.highValueDataset',
    validator: (val: any) => {
      if (!isDefined(val)) {
        return {
          valid: false,
          helpText: 'Bitte geben Sie an, ob es sich um ein hochwertiges Datenset handelt.',
        }
      }
      return { valid: true };
    },
    section: 'classification',
    required: true
  },
  {
    key: 'isoMetadata.topicCategory',
    validator: (val: any) => {
      if (!isDefined(val)) {
        return {
          valid: false,
          helpText: 'Bitte geben Sie eine Themenkategorie an.',
        }
      }
      return { valid: true };
    },
    section: 'classification',
    required: true
  },
  {
    key: 'isoMetadata.published',
    validator: (val: any) => {
      if (!isDefined(val) || val.length === 0) {
        return {
          valid: false,
          helpText: 'Bitte geben Sie ein Veröffentlichungsdatum an.',
        }
      }
      return { valid: true };
    },
    section: 'temp_and_spatial',
    required: true
  },
  {
    key: 'isoMetadata.maintenanceFrequency',
    validator: (val: any) => {
      if (!isDefined(val)) {
        return {
          valid: false,
          helpText: 'Bitte geben Sie eine Wartungsfrequenz an.',
        }
      }
      return { valid: true };
    },
    section: 'temp_and_spatial',
    required: true
  },
  {
    key: 'isoMetadata.maintained',
    validator: (val: any) => {
      if (!isDefined(val)) {
        return {
          valid: false,
          helpText: 'Bitte geben Sie an, ob die Daten gewartet werden.',
        }
      }
      return { valid: true };
    },
    section: 'temp_and_spatial',
    required: true
  },
  {
    key: 'isoMetadata.deliveredCrs',
    validator: (val: any) => {
      if (!isDefined(val)) {
        return {
          valid: false,
          helpText: 'Bitte geben Sie das gelieferte CRS an.',
        }
      }
      return { valid: true };
    },
    section: 'temp_and_spatial',
    required: true
  },
  {
    key: 'isoMetadata.crs',
    validator: (val: any) => {
      if (!isDefined(val)) {
        return {
          valid: false,
          helpText: 'Bitte geben Sie das CRS an.',
        }
      }
      return { valid: true };
    },
    section: 'temp_and_spatial',
    required: true
  },
  {
    key: 'isoMetadata.extent',
    validator: (val: any) => {
      if (!val?.maxx || !val?.maxy || !val?.minx || !val?.miny) {
        return {
          valid: false,
          helpText: 'Bitte geben Sie die Ausdehnung an.',
        }
      }
      return { valid: true };
    },
    section: 'temp_and_spatial',
    required: true
  },
  {
    key: 'isoMetadata.resolution',
    validator: (val: any) => {
      if (!isDefined(val)) {
        return {
          valid: false,
          helpText: 'Bitte geben Sie die Auflösung an.',
        }
      }
      return { valid: true };
    },
    section: 'temp_and_spatial',
    required: true
  },
  {
    key: 'isoMetadata.representiveFraction',
    validator: (val: any) => {
      if (!isDefined(val)) {
        return {
          valid: false,
          helpText: 'Bitte geben Sie den Maßstab an.',
        }
      }
      return { valid: true };
    },
    section: 'temp_and_spatial',
    required: true
  },
  {
    key: 'isoMetadata.dateTime',
    validator: (val: any) => {
      if (!isDefined(val)) {
        return {
          valid: false,
          helpText: 'Bitte geben Sie ein Datum an.',
        }
      }
      return { valid: true };
    },
    section: 'temp_and_spatial',
    required: false
  },
  {
    key: 'isoMetadata.validityRange',
    validator: (val: any) => {
      if (!isDefined(val)) {
        return {
          valid: false,
          helpText: 'Bitte geben Sie einen Gültigkeitsbereich an.',
        }
      }
      return { valid: true };
    },
    section: 'temp_and_spatial',
    required: false
  },
  {
    key: 'isoMetadata.contentDescription',
    validator: (val: any) => {
      if (!isDefined(val)) {
        return {
          valid: false,
          helpText: 'Bitte geben Sie eine Inhaltsbeschreibung an.',
        }
      }
      return { valid: true };
    },
    section: 'additional',
    required: false
  },
  {
    key: 'isoMetadata.contentDescriptionTextarea',
    validator: (val: any) => {
      if (!isDefined(val)) {
        return {
          valid: false,
          helpText: 'Bitte geben Sie eine Inhaltsbeschreibung an.',
        }
      }
      return { valid: true };
    },
    section: 'additional',
    required: false
  },
  {
    key: 'isoMetadata.technicalDescription',
    validator: (val: any) => {
      if (!isDefined(val)) {
        return {
          valid: false,
          helpText: 'Bitte geben Sie eine technische Beschreibung an.',
        }
      }
      return { valid: true };
    },
    section: 'additional',
    required: false
  },
  {
    key: 'isoMetadata.lineage',
    validator: (val: any) => {
      if (!isDefined(val)) {
        return {
          valid: false,
          helpText: 'Bitte geben Sie eine Herkunft an.',
        }
      }
      return { valid: true };
    },
    section: 'additional',
    required: false
  },
  {
    key: 'isoMetadata.additionalInformation',
    validator: (val: any) => {
      if (!isDefined(val)) {
        return {
          valid: false,
          helpText: 'Bitte geben Sie zusätzliche Informationen an.',
        }
      }
      return { valid: true };
    },
    section: 'additional',
    required: false
  }
];
