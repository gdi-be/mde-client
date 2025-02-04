/* eslint-disable @typescript-eslint/no-explicit-any */
import { getContext, setContext } from "svelte";
import type { FieldKey, FormHelp } from "$lib/models/form";

export type FormState = {
  data: Record<string, unknown>;
  help: FormHelp;
  activeHelpKey?: FieldKey;
};

const formState = $state<FormState>({
  data: {},
  help: {},
  activeHelpKey: undefined
});

const formStateKey = Symbol('formState');

export function initializeFormContext() {
  setContext(formStateKey, formState);
}

export function getFormContext() {
  return getContext<FormState>(formStateKey);
}

export function getValue<T>(key: string, metadata?: Record<string, unknown>): T | undefined {
  const data = metadata || formState.data;
  if (!data) return undefined;
  const value = key
    .split('.')
    .reduce((obj, k) => {
      return (obj && obj[k] !== undefined) ? obj[k] : undefined
    }, data as Record<string, any>);

  return value as T
}

export function setFormData(data: Record<string, unknown>) {
  formState.data = data;
}

export function setHelp(help: FormHelp) {
  formState.help = help;
}

export function setValue<T>(key: string, value: T) {
  if (!formState || !formState.data) return;

  const keys = key.split('.');
  const lastKey = keys.pop();
  let obj = formState.data as Record<string, any>;
  keys.forEach(k => {
    if (!obj[k]) obj[k] = {};
    obj = obj[k];
  });
  if (lastKey) {
    obj[lastKey] = value;
  }
}

export function hasHelpMarkdown(key?: FieldKey) {
  if (!key) {
    return false;
  }
  return !!formState.help[key];
}

export function getHelpMarkdown(key?: FieldKey) {
  if (!key) {
    return '';
  }
  return formState.help[key];
}

export function clearActiveHelp() {
  formState.activeHelpKey = undefined;
}

export function toggleActiveHelp(key: FieldKey) {
  if (formState.activeHelpKey === key) {
    formState.activeHelpKey = undefined;
  } else {
    formState.activeHelpKey = key;
  }
}

export type Section = 'basedata' | 'classification' | 'temp_and_spatial' | 'additional' | 'services';

type FormValidators = {
  [key in Section]: {
    required: {
      key: FieldKey;
      validator: (val?: any) => boolean;
    }[];
    optional: {
      key: FieldKey;
      validator: (val?: any) => boolean;
    }[];
  };
};

const formValidators: FormValidators = {
  basedata: {
    required: [
      {
        key: 'isoMetadata.title',
        validator: (val) => val !== undefined && val !== null && val !== ''
      },
      {
        key: 'isoMetadata.description',
        validator: (val) => val !== undefined && val !== null && val !== ''
      },
      {
        key: 'isoMetadata.keywords',
        validator: (val) => val?.default?.length > 0 && val.default.every(({keyword}: any) => keyword !== '')
      },
      {
        key: 'isoMetadata.previews',
        validator: (val) => val?.length > 0 && val?.every(({content}: any) => content !== '')
      },
      {
        key: 'isoMetadata.contacts',
        validator: (val) => val?.length > 0 && val?.every(({name, email, organisation, phone}: any) =>
          name !== undefined && name !== null && name !== '' &&
          email !== undefined && email !== null && email !== '' &&
          organisation !== undefined && organisation !== null && organisation !== '' &&
          phone !== undefined && phone !== null && phone !== ''
        )
      }
    ],
    optional: [
      {
        key: 'isoMetadata.internal_comment',
        validator: (val) => val !== undefined && val !== null && val !== ''
      }
    ]
  },
  classification: {
    required: [{
      // Metadaten-Typ
      key: 'isoMetadata.metadataProfile',
      validator: (val) => val !== undefined && val !== null && val !== ''
    }, {
      // Datenschutz
      // TODO: check this
      key: 'isoMetadata.resourceConstraints',
      validator: (val) => val !== undefined && val !== null && val !== ''
    }, {
      // Nutzungsbedingung
      // TODO: check this
      key: 'isoMetadata.resourceConstraints',
      validator: (val) => val !== undefined && val !== null && val !== ''
    }, {
      key: 'isoMetadata.inspireTheme',
      validator: (val) => val !== undefined && val !== null && val !== ''
    }, {
      key: 'isoMetadata.qualityReportCheck',
      validator: (val) => val !== undefined && val !== null && val !== ''
    }, {
      key: 'clientMetadata.highValueDataset',
      validator: (val) => val !== undefined && val !== null
    }, {
      key: 'isoMetadata.topicCategory',
      validator: (val) => val !== undefined && val !== null && val !== ''
    }],
    optional: []
  },
  temp_and_spatial: {
    required: [{
      key: 'isoMetadata.published',
      validator: (val) => val?.length > 0
    }, {
      key: 'isoMetadata.maintenanceFrequency',
      validator: (val) => val !== undefined && val !== null && val !== ''
    }, {
      key: 'isoMetadata.maintained',
      validator: (val) => val !== undefined && val !== null && val !== ''
    }, {
      key: 'isoMetadata.deliveredCrs',
      validator: (val) => val !== undefined && val !== null && val !== ''
    }, {
      key: 'isoMetadata.crs',
      validator: (val) => val !== undefined && val !== null && val !== ''
    }, {
      key: 'isoMetadata.extent',
      validator: (val) => !!val?.maxx && !!val?.maxy && !!val?.minx && !!val?.miny
    }, {
      key: 'isoMetadata.resolution',
      validator: (val) => val !== undefined && val !== null && val !== ''
    }, {
      key: 'isoMetadata.representiveFraction',
      validator: (val) => val !== undefined && val !== null && val !== ''
    }],
    optional: [{
      key: 'isoMetadata.dateTime',
      validator: (val) => val !== undefined && val !== null && val !== ''
    }, {
      key: 'isoMetadata.validityRange',
      validator: (val) => val !== undefined && val !== null && val !== ''
    }]
  },
  additional: {
    required: [],
    optional: [{
      key: 'isoMetadata.contentDescription',
      validator: (val) => val !== undefined && val !== null && val !== ''
    }, {
      key: 'isoMetadata.contentDescriptionTextarea',
      validator: (val) => val !== undefined && val !== null && val !== ''
    },{
      key: 'isoMetadata.technicalDescription',
      validator: (val) => val !== undefined && val !== null && val !== ''
    }, {
      key: 'isoMetadata.lineage',
      validator: (val) => val !== undefined && val !== null && val !== ''
    },{
      key: 'isoMetadata.additionalInformation',
      validator: (val) => val !== undefined && val !== null && val !== ''
    }]
  },
  services: {
    required: [],
    optional: []
  }
};

export function getProgress(section: Section, metadata?: Record<string, unknown>): number {
  const totalRequired = formValidators[section].required.length;
  if (!metadata) return 1;

  const invalidFilter = ({key, validator}: { key: FieldKey, validator: (val: unknown) => boolean }) => {
    const val = getValue(key, metadata);
    const valid = validator(val);
    return !valid;
  };

  const filledRequired = formValidators[section].required.filter(invalidFilter).length;
  return filledRequired / totalRequired;
}

export function allFieldsValid(metadata?: Record<string, unknown>): boolean {
  if (!metadata) return false;
  const sections = Object.keys(formValidators) as Section[];
  return sections.every((section: Section) => {
    return getProgress(section, metadata) === 1;
  });
}
