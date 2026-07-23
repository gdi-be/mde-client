import { describe, expect, test } from 'vitest';
import { FieldConfigs } from '$lib/components/Form/FieldsConfig';
import type { ValidationContext } from '$lib/services/ValidationService';

const featureType = { id: 'feature-type' };
const contexts: Record<number, ValidationContext | undefined> = {
  50: { HIGHEST_ROLE: 'MdeEditor' },
  51: { HIGHEST_ROLE: 'MdeEditor' },
  62: {
    HIGHEST_ROLE: 'MdeEditor',
    PARENT_VALUE: featureType,
    'isoMetadata.services': [
      {
        serviceType: 'WFS',
        featureTypes: [featureType]
      }
    ]
  },
  64: undefined
};

describe.each([50, 51, 62, 64])('field %i technical name validation', (profileId) => {
  const fieldConfig = FieldConfigs.find((config) => config.profileId === profileId);
  const context = contexts[profileId as keyof typeof contexts];

  test.each(['name', '_name', '-name', 'name-1_2', 'a'.repeat(100)])('accepts %s', (value) => {
    expect(fieldConfig?.validator(value, context)).toEqual({ valid: true });
  });

  test.each(['1name', 'Name', 'name.test', 'name test', 'a'.repeat(101)])('rejects %s', (value) => {
    expect(fieldConfig?.validator(value, context).valid).toBe(false);
  });
});
