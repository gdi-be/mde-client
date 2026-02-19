import { describe, expect, test } from 'vitest';
import { ValidationService, type ValidationContext } from '$lib/services/ValidationService';
import metadata1 from './fixtures/metadata1';
import type { FullFieldConfig } from '../src/lib/components/Form/FieldsConfig';

describe('ValidationService', () => {
  describe('canEditField', () => {
    test('should allow MdeAdministrator to edit any field', () => {
      const field: FullFieldConfig<string> = {
        profileId: 1,
        key: 'isoMetadata.test',
        section: 'basedata',
        validator: () => ({ valid: true }),
        editingRoles: ['MdeEditor']
      };
      expect(ValidationService.canEditField('MdeAdministrator', field)).toBe(true);
    });

    test('should check editingRoles for specific roles', () => {
      const field: FullFieldConfig<string> = {
        profileId: 1,
        key: 'isoMetadata.test',
        section: 'basedata',
        validator: () => ({ valid: true }),
        editingRoles: ['MdeEditor']
      };
      expect(ValidationService.canEditField('MdeEditor', field)).toBe(true);
      expect(ValidationService.canEditField('MdeDataOwner', field)).toBe(false);
    });

    test('should allow any role if no editingRoles specified', () => {
      const field: FullFieldConfig<string> = {
        profileId: 1,
        key: 'isoMetadata.test',
        section: 'basedata',
        validator: () => ({ valid: true })
      };
      expect(ValidationService.canEditField('MdeEditor', field)).toBe(true);
      expect(ValidationService.canEditField('MdeDataOwner', field)).toBe(true);
    });

    test('should return false if no role provided', () => {
      const field: FullFieldConfig<string> = {
        profileId: 1,
        key: 'isoMetadata.test',
        section: 'basedata',
        validator: () => ({ valid: true })
      };
      // @ts-expect-error - Testing behavior when no role is provided
      expect(ValidationService.canEditField(undefined, field)).toBe(false);
    });
  });

  describe('shouldValidateField', () => {
    test('should validate required fields for authorized roles', () => {
      const field: FullFieldConfig<string> = {
        profileId: 1,
        key: 'isoMetadata.test',
        section: 'basedata',
        validator: () => ({ valid: true }),
        required: true
      };
      expect(ValidationService.shouldValidateField('MdeAdministrator', field)).toBe(true);
      expect(ValidationService.shouldValidateField('MdeEditor', field)).toBe(true);
    });

    test('should not validate optional fields', () => {
      const field: FullFieldConfig<string> = {
        profileId: 1,
        key: 'isoMetadata.test',
        section: 'basedata',
        validator: () => ({ valid: true }),
        required: false
      };
      expect(ValidationService.shouldValidateField('MdeAdministrator', field)).toBe(false);
    });
  });

  describe('getExtraParams', () => {
    test('should resolve HIGHEST_ROLE parameter', () => {
      const field: FullFieldConfig<string> = {
        profileId: 1,
        key: 'isoMetadata.test',
        section: 'basedata',
        validator: () => ({ valid: true }),
        extraParams: ['HIGHEST_ROLE']
      };
      const context: ValidationContext = {
        HIGHEST_ROLE: 'MdeEditor'
      };
      const params = ValidationService.getExtraParams(field, context);
      expect(params).toEqual({ HIGHEST_ROLE: 'MdeEditor' });
    });

    test('should resolve metadata values', () => {
      const field: FullFieldConfig<string> = {
        profileId: 1,
        key: 'isoMetadata.test',
        section: 'basedata',
        validator: () => ({ valid: true }),
        extraParams: ['isoMetadata.title']
      };
      const context: ValidationContext = {
        metadata: metadata1
      };
      const params = ValidationService.getExtraParams(field, context);
      expect(params).toEqual({ 'isoMetadata.title': '123 Datentest' });
    });

    test('should resolve PARENT_VALUE parameter', () => {
      const field: FullFieldConfig<string> = {
        profileId: 1,
        key: 'isoMetadata.test',
        section: 'basedata',
        validator: () => ({ valid: true }),
        extraParams: ['PARENT_VALUE']
      };
      const parentValue = { id: '123', name: 'Test' };
      const context: ValidationContext = {
        PARENT_VALUE: parentValue
      };
      const params = ValidationService.getExtraParams(field, context);
      expect(params).toEqual({ PARENT_VALUE: parentValue });
    });

    test('should return undefined if no extraParams defined', () => {
      const field: FullFieldConfig<string> = {
        profileId: 1,
        key: 'isoMetadata.test',
        section: 'basedata',
        validator: () => ({ valid: true })
      };
      const context: ValidationContext = {};
      const params = ValidationService.getExtraParams(field, context);
      expect(params).toBeUndefined();
    });
  });

  describe('validateField', () => {
    test('should validate field with context', () => {
      const field: FullFieldConfig<string> = {
        profileId: 1,
        key: 'isoMetadata.test',
        section: 'basedata',
        validator: (val) => {
          return { valid: val === 'testValue' };
        }
      };
      const context: ValidationContext = {
        HIGHEST_ROLE: 'MdeEditor'
      };
      const result = ValidationService.validateField(field, 'testValue', context);
      expect(result.valid).toBe(true);
    });

    test('should pass extra params to validator', () => {
      const field: FullFieldConfig<string> = {
        profileId: 1,
        key: 'isoMetadata.test',
        section: 'basedata',
        validator: (val, extra?: ValidationContext) => {
          return { valid: extra?.['isoMetadata.title'] === metadata1.isoMetadata.title };
        },
        extraParams: ['isoMetadata.title']
      };
      const context: ValidationContext = {
        metadata: metadata1
      };
      const result = ValidationService.validateField(field, 'any', context);
      expect(result.valid).toBe(true);
    });
  });

  describe('allFieldsValid', () => {
    test('should return true when all required fields are valid', () => {
      const result = ValidationService.allFieldsValid(metadata1, 'MdeAdministrator');
      expect(typeof result).toBe('boolean');
    });

    test('should return false for undefined metadata', () => {
      // @ts-expect-error - Testing behavior when metadata is undefined
      const result = ValidationService.allFieldsValid(undefined, 'MdeAdministrator');
      expect(result).toBe(false);
    });

    test('should return true when no role (no fields to validate)', () => {
      // @ts-expect-error - Testing behavior when no role is provided
      const result = ValidationService.allFieldsValid(metadata1, undefined);
      expect(result).toBe(true);
    });
  });
});
