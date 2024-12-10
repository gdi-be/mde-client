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
      label: "Metadatenprofil",
      options: [{
        label: "ISO",
        value: "ISO"
      }, {
        label: "INSPIRE",
        value: "INSPIRE"
      }],
      key: "metadataProfile",
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
      key: "inspireTheme",
      label: "Inspire Thema",
      visibilityCondition: "metadataProfile == INSPIRE"
    }, {
      section: 'Basisdaten',
      type: "text",
      key: "fileIdentifier",
      label: "Datei-Identifikator"
    }, {
      section: 'Basisdaten',
      type: "group",
      key: "dataIdentificator",
      label: "Daten-Identifikator",
      layout: "horizontal",
      items: [{
        type: "text",
        key: "id",
        label: "id"
      }, {
        type: "text",
        key: "namespace",
        label: "Namensraum"
      }]
    }, {
      section: 'Basisdaten',
      type: "list",
      key: "serviceIds",
      label: "Service-IDs",
      item: {
        type: "text",
        label: "id"
      }
    }, {
      section: 'Basisdaten',
      type: "text",
      key: "services",
      label: "Services"
    }, {
      section: 'Basisdaten',
      type: "text",
      key: "keywords",
      label: "Schlagworte"
    }, {
      section: 'Basisdaten',
      type: "date",
      key: "dateTime",
      label: "Datum/Zeit"
    }, {
      section: 'Basisdaten',
      type: "date",
      key: "created",
      label: "Erstellt"
    }, {
      section: 'Basisdaten',
      type: "date",
      key: "published",
      label: "Veröffentlicht"
    }, {
      section: 'Basisdaten',
      type: "date",
      key: "modified",
      label: "Geändert"
    }, {
      section: 'Basisdaten',
      type: "date",
      key: "validFrom",
      label: "Gültig ab"
    }, {
      section: 'Basisdaten',
      type: "text",
      key: "preview",
      label: "Vorschau"
    }, {
      section: 'Basisdaten',
      type: "text",
      key: "url",
      label: "URL"
    }, {
      section: 'Basisdaten',
      type: "text",
      key: "capabilities",
      label: "Fähigkeiten"
    }, {
      section: 'Basisdaten',
      type: "text",
      key: "contacts",
      label: "Kontakte"
    }, {
      section: 'Basisdaten',
      type: "integer",
      key: "scale",
      label: "Maßstab"
    }, {
      section: 'Basisdaten',
      type: "text",
      key: "previewMap",
      label: "Vorschau-Karte"
    }, {
      section: 'Basisdaten',
      type: "text",
      key: "previewMapInternal",
      label: "Vorschau-Karte intern"
    }, {
      section: 'Basisdaten',
      type: "text",
      key: "extent",
      label: "Umfang"
    },


    {
      section: 'sample',
      type: "integer",
      key: "isometadata.number",
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
      key: "isometadata.float",
      label: "Zahlenfeld (Dezimal)",
      help: "This is a help text for the float field."
    }, {
      section: 'sample',
      type: "text",
      key: "isometadata.text",
      label: "Freitextfeld",
      help: "This is a help text for the text field."
    }, {
      section: 'sample',
      type: "textarea",
      key: "isometadata.textarea",
      label: "Fließtextfeld",
      help: "This is a help text for the textarea field."
    }, {
      section: 'sample',
      type: "boolean",
      key: "isometadata.boolean",
      label: "Entscheidung",
      help: "This is a help text for the boolean field."
    }, {
      section: 'sample',
      type: "date",
      key: "isometadata.date",
      label: "Datumsauswahl",
      help: "This is a help text for the date field."
    }, {
      section: 'sample',
      type: "select",
      key: "isometadata.select",
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
      key: "isometadata.autocomplete",
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
