import type { FormConfig } from "../models/form";

export const getFormConfig = async (): Promise<FormConfig> => {

  // TODO: this config should be fetched from a static resource
  return {
    formItems: [{
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
      type: "float",
      key: "isometadata.float",
      label: "Zahlenfeld (Dezimal)",
      help: "This is a help text for the float field."
    }, {
      type: "text",
      key: "isometadata.text",
      label: "Freitextfeld",
      help: "This is a help text for the text field."
    }, {
      type: "textarea",
      key: "isometadata.textarea",
      label: "Fließtextfeld",
      help: "This is a help text for the textarea field."
    }, {
      type: "boolean",
      key: "isometadata.boolean",
      label: "Entscheidung",
      help: "This is a help text for the boolean field."
    }, {
      type: "date",
      key: "isometadata.date",
      label: "Datumsauswahl",
      help: "This is a help text for the date field."
    }, {
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
  };
}
