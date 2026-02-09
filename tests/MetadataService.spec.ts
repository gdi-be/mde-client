import { describe, expect, test } from 'bun:test';
import { MetadataService } from '$lib/services/MetadataService';
import metadata1 from './fixtures/metadata1';
import metadata2 from './fixtures/metadata2';

describe('MetadataService', () => {
  describe('getValue', () => {
    test('should return undefined if metadata is undefined', () => {
      const result = MetadataService.getValue('any.path', undefined);
      expect(result).toBeUndefined();
    });

    test('should get a simple property value from metadata1', () => {
      const result = MetadataService.getValue('isoMetadata.title', metadata1);
      expect(result).toBe('123 Datentest');
    });

    test('should get a nested property value from metadata1', () => {
      const result = MetadataService.getValue('isoMetadata.pointsOfContact[0].name', metadata1);
      expect(result).toBe('Peter Klose');
    });

    test('should support array index access', () => {
      const result = MetadataService.getValue('isoMetadata.services[0].title', metadata1);
      expect(result).toBe('123 Datentest');
    });

    test('should support array access with higher indices', () => {
      const result = MetadataService.getValue('isoMetadata.services[2].title', metadata1);
      expect(result).toBe('WFS Titel');
    });

    test('should handle nested arrays', () => {
      const result = MetadataService.getValue(
        'isoMetadata.services[2].featureTypes[0].columns[0].name',
        metadata1
      );
      expect(result).toBe('Mein Attribut');
    });

    test('should return undefined if path does not exist', () => {
      const result = MetadataService.getValue('isoMetadata.nonexistent', metadata1);
      expect(result).toBeUndefined();
    });

    test('should return undefined if intermediate path does not exist', () => {
      const result = MetadataService.getValue('isoMetadata.contact.name', metadata2);
      expect(result).toBeUndefined();
    });

    test('should return undefined if array index is out of bounds', () => {
      const result = MetadataService.getValue('isoMetadata.services[99].name', metadata1);
      expect(result).toBeUndefined();
    });

    test('should handle clientMetadata structure', () => {
      const result = MetadataService.getValue('clientMetadata.layers', metadata1);
      expect(result).toBeDefined();
      expect(result).toHaveProperty('00e19242-8d3c-4617-ad73-d5a6b79ae55f');
    });

    test('should get top-level properties', () => {
      const result = MetadataService.getValue('id', metadata1);
      expect(result).toBe(13572);
    });
  });

  describe('getAllValues', () => {
    test('should return empty array if metadata is undefined', () => {
      const result = MetadataService.getAllValues('any.path', undefined);
      expect(result).toEqual([]);
    });

    test('should return empty array if path does not exist', () => {
      const result = MetadataService.getAllValues('isoMetadata.nonexistent.values', metadata1);
      expect(result).toEqual([]);
    });

    test('should collect service titles from metadata1', () => {
      const result = MetadataService.getAllValues<string>('isoMetadata.services.title', metadata1);
      expect(result).toEqual(['123 Datentest', 'ewfewf', 'WFS Titel']);
    });

    test('should collect values from deeply nested arrays', () => {
      const result = MetadataService.getAllValues<string>(
        'isoMetadata.services.featureTypes.columns.name',
        metadata1
      );
      expect(result).toEqual(['Mein Attribut', 'Mein zweites Attribut ']);
    });

    test('should return empty array for metadata2 services (empty collection)', () => {
      const result = MetadataService.getAllValues<string>('isoMetadata.services.title', metadata2);
      expect(result).toEqual([]);
    });

    test('should collect keywords from structure', () => {
      const result = MetadataService.getValue('isoMetadata.keywords', metadata1);
      expect(result).toBeDefined();
      expect(result).toHaveProperty('default');
    });

    test('should return the array items if no further path specified', () => {
      const result = MetadataService.getAllValues('isoMetadata.services', metadata1);
      expect(result).toHaveLength(3);
      expect(result[0]).toHaveProperty('title', '123 Datentest');
      expect(result[1]).toHaveProperty('title', 'ewfewf');
      expect(result[2]).toHaveProperty('title', 'WFS Titel');
    });

    test('should handle collection with single item', () => {
      const result = MetadataService.getAllValues<string>(
        'isoMetadata.pointsOfContact.email',
        metadata1
      );
      expect(result).toEqual(['klose@wefewf.de']);
    });

    test('should collect service types', () => {
      const result = MetadataService.getAllValues<string>(
        'isoMetadata.services.serviceType',
        metadata1
      );
      expect(result).toEqual(['WMS', 'ATOM', 'WFS']);
    });
  });

  describe('Edge cases', () => {
    test('should get description from metadata1', () => {
      const result = MetadataService.getValue('isoMetadata.description', metadata1);
      expect(result).toBe('wergwergergergergergrge');
    });

    test('should get privacy setting from metadata1', () => {
      const result = MetadataService.getValue('isoMetadata.privacy', metadata1);
      expect(result).toBe('NONE');
    });

    test('should get serviceType from specific service', () => {
      const result = MetadataService.getValue('isoMetadata.services[1].serviceType', metadata1);
      expect(result).toBe('ATOM');
    });

    test('should get metadataProfile', () => {
      const result = MetadataService.getValue('isoMetadata.metadataProfile', metadata1);
      expect(result).toBe('INSPIRE_HARMONISED');
    });

    test('should get responsibleRole', () => {
      const result = MetadataService.getValue('responsibleRole', metadata1);
      expect(result).toBe('MdeEditor');
    });

    test('should get nested service properties', () => {
      const result = MetadataService.getValue('isoMetadata.services[0].workspace', metadata1);
      expect(result).toBe('ewfewf');
    });

    test('should get clientMetadata', () => {
      const result = MetadataService.getValue('clientMetadata', metadata1);
      expect(result).toBeDefined();
      expect(result).toHaveProperty('layers');
    });
  });

  describe('getFieldConfig', () => {
    test('should return field config for valid profileId', () => {
      const config = MetadataService.getFieldConfig(1);
      expect(config).toBeDefined();
      expect(config?.profileId).toBe(1);
      expect(config?.key).toBe('isoMetadata.title');
    });

    test('should return field config for service fields', () => {
      const config = MetadataService.getFieldConfig(40);
      expect(config).toBeDefined();
      expect(config?.profileId).toBe(40);
      expect(config?.key).toBe('isoMetadata.services');
    });

    test('should return field config for layers', () => {
      const config = MetadataService.getFieldConfig(48);
      expect(config).toBeDefined();
      expect(config?.profileId).toBe(48);
      expect(config?.key).toBe('clientMetadata.layers');
    });

    test('should throw an error for non-existent profileId', () => {
      expect(() => MetadataService.getFieldConfig(99999)).toThrow(
        'No field config found for profileId 99999'
      );
    });

    test('should return typed field config', () => {
      const config = MetadataService.getFieldConfig<string>(2);
      expect(config).toBeDefined();
      expect(config?.key).toBe('isoMetadata.description');
    });

    test('should have validator function', () => {
      const config = MetadataService.getFieldConfig(1);
      expect(config).toBeDefined();
      expect(typeof config?.validator).toBe('function');
    });

    test('should return first config when key is undefined and only one exists', () => {
      const config = MetadataService.getFieldConfig(1);
      expect(config).toBeDefined();
      expect(config?.profileId).toBe(1);
    });
  });
});
