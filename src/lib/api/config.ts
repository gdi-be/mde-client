import type { FormConfig } from "$lib/models/form";

export const getFormConfig = async (): Promise<FormConfig> => {

  // TODO: this should come from a static resource
  return {
    sections: [
      'Basisdaten',
      'sample'
    ],
    formItems: [{
      section: 'Basisdaten',
      type: "select",
      metadataType: "ISO",
      label: "Metadatenprofil",
      options: [{
        label: "ISO",
        value: "ISO"
      }, {
        label: "INSPIRE (harmonisiert)",
        value: "INSPIRE_HARMONISED"
      }, {
        label: "INSPIRE (identifiziert)",
        value: "INSPIRE_IDENTIFIED"
      }],
      key: "isoMetadata.metadataProfile",
    }, {
      section: 'Basisdaten',
      type: "select",
      options: [
        { label: 'AD', value: 'AD' },
        { label: 'AU', value: 'AU' },
        { label: 'BU', value: 'BU' },
        { label: 'CP', value: 'CP' },
        { label: 'EL', value: 'EL' },
        { label: 'GE', value: 'GE' },
        { label: 'GN', value: 'GN' },
        { label: 'LC', value: 'LC' },
        { label: 'LU', value: 'LU' },
        { label: 'OI', value: 'OI' },
        { label: 'PF', value: 'PF' },
        { label: 'PS', value: 'PS' },
        { label: 'SD', value: 'SD' },
        { label: 'SO', value: 'SO' },
        { label: 'SU', value: 'SU' },
        { label: 'US', value: 'US' },
      ],
      key: "isoMetadata.inspireTheme",
      metadataType: "ISO",
      label: "Inspire Thema",
      // visibilityCondition: "metadataProfile == INSPIRE"
    }, {
      section: 'Basisdaten',
      type: "text",
      key: "isoMetadata.fileIdentifier",
      metadataType: "ISO",
      label: "Datei-Identifikator"
    }, {
      section: 'Basisdaten',
      type: "group",
      key: "isoMetadata.dataIdentificator",
      metadataType: "ISO",
      label: "Daten-Identifikator",
      layout: "horizontal",
      items: [{
        type: "text",
        key: "isoMetadata.id",
        label: "id"
      }, {
        type: "text",
        key: "isoMetadata.namespace",
        label: "Namensraum"
      }]
    }, {
      section: 'Basisdaten',
      type: "list",
      key: "isoMetadata.serviceIds",
      metadataType: "ISO",
      label: "Service-IDs",
      item: {
        type: "text",
        label: "id"
      }
    }, {
      section: 'Basisdaten',
      type: "text",
      key: "isoMetadata.services",
      metadataType: "ISO",
      label: "Services"
    }, {
      section: 'Basisdaten',
      type: "tags",
      key: "isoMetadata.keywords",
      metadataType: "ISO",
      label: "Schlagworte",
      options: [{
        label: 'Abwasser',
        value: 'Abwasser'
      }, {
        label: 'Kanal',
        value: 'Kanal'
      }, {
        label: 'Wasser',
        value: 'Wasser'
      }],
      optionValueField: "value",
      optionLabelField: "label"
    }, {
      section: 'Basisdaten',
      type: "date",
      key: "isoMetadata.dateTime",
      metadataType: "ISO",
      label: "Datum/Zeit"
    }, {
      section: 'Basisdaten',
      type: "date",
      key: "isoMetadata.created",
      metadataType: "ISO",
      label: "Erstellt"
    }, {
      section: 'Basisdaten',
      type: "date",
      key: "isoMetadata.published",
      metadataType: "ISO",
      label: "Veröffentlicht"
    }, {
      section: 'Basisdaten',
      type: "date",
      key: "isoMetadata.modified",
      metadataType: "ISO",
      label: "Geändert"
    }, {
      section: 'Basisdaten',
      type: "date",
      key: "isoMetadata.validFrom",
      metadataType: "ISO",
      label: "Gültig ab"
    }, {
      section: 'Basisdaten',
      type: "text",
      key: "isoMetadata.preview",
      metadataType: "ISO",
      label: "Vorschau"
    }, {
      section: 'Basisdaten',
      type: "text",
      key: "isoMetadata.url",
      metadataType: "ISO",
      label: "URL"
    }, {
      section: 'Basisdaten',
      type: "text",
      key: "isoMetadata.capabilities",
      metadataType: "ISO",
      label: "Fähigkeiten"
    }, {
      section: 'Basisdaten',
      type: "text",
      key: "isoMetadata.contacts",
      metadataType: "ISO",
      label: "Kontakte"
    }, {
      section: 'Basisdaten',
      type: "integer",
      key: "isoMetadata.scale",
      metadataType: "ISO",
      label: "Maßstab"
    }, {
      section: 'Basisdaten',
      type: "text",
      key: "isoMetadata.previewMap",
      metadataType: "ISO",
      label: "Vorschau-Karte"
    }, {
      section: 'Basisdaten',
      type: "text",
      key: "isoMetadata.previewMapInternal",
      metadataType: "ISO",
      label: "Vorschau-Karte intern"
    }, {
      section: 'Basisdaten',
      type: "text",
      key: "isoMetadata.extent",
      metadataType: "ISO",
      label: "Umfang"
    },{
      section: 'sample',
      type: "integer",
      key: "isoMetadata.number",
      label: "Zahlenfeld (Ganzahl)",
      // consider if this should be stored elsewhere
      help: `
# My Random Markdown Document

## Table of Contents
1. [Introduction](#introduction)
2. [Features](#features)
3. [Code Example](#code-example)
4. [Conclusion](#conclusion)

---

## Introduction
This document showcases the power of Markdown. It's simple, flexible, and easy to read.

> "Markdown is a lightweight markup language." – *Everyone*

---

## Features
- **Readable syntax**
- Easy to convert to HTML
- Supports:
  - Headers
  - Lists
  - Code blocks
  - Links and images
`,
    }, {
      section: 'sample',
      type: "float",
      key: "isoMetadata.float",
      label: "Zahlenfeld (Dezimal)",
      help: "This is a help text for the float field."
    }, {
      section: 'sample',
      type: "text",
      key: "isoMetadata.text",
      label: "Freitextfeld",
      help: "This is a help text for the text field."
    }, {
      section: 'sample',
      type: "textarea",
      key: "isoMetadata.textarea",
      label: "Fließtextfeld",
      help: "This is a help text for the textarea field."
    }, {
      section: 'sample',
      type: "boolean",
      key: "isoMetadata.boolean",
      label: "Entscheidung",
      help: "This is a help text for the boolean field."
    }, {
      section: 'sample',
      type: "date",
      key: "isoMetadata.date",
      label: "Datumsauswahl",
      help: "This is a help text for the date field."
    }, {
      section: 'sample',
      type: "select",
      key: "isoMetadata.select",
      label: "Auswahlliste",
      help: "This is a help text for the select field.",
      options: [{
        label: "Option 1",
        value: "option1"
      }, {
        label: "Option 2",
        value: "option2"
      }]
    }, {
      section: 'sample',
      type: "autocomplete",
      key: "isoMetadata.autocomplete",
      label: "Thesaurusaufschlag",
      help: "This is a help text for the autocomplete field.",
      options: [{
        label: "Option 1",
        value: "option1"
      }, {
        label: "Option 2",
        value: "option2"
      }]
    }]
  } satisfies FormConfig;
}
