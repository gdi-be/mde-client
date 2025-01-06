import type { FormHelp } from "$lib/models/form";

export const getFormHelp = async (): Promise<FormHelp> => {

  // TODO: this should come from a static resource
  return {
    'isoMetadata.title': `
# Title

The title of the dataset.
    `,
    'isoMetadata.description': `
# Description

A description of the dataset.
    `,
    'isoMetadata.keywords': `
# Keywords

Keywords that describe the dataset.
    `
  } satisfies FormHelp;
}
