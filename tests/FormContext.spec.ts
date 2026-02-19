import { describe, expect, test } from 'vitest';
import { MetadataService } from '$lib/services/MetadataService';
import metadata1 from './fixtures/metadata1';
import type { Contact } from '$lib/models/metadata';

//const { getValue, getAllValues } = getFormContext();

describe('FormContext', () => {
  describe('getValue', () => {
    test('should get simple values', () => {
      expect(MetadataService.getValue<string>('title', metadata1)).toBe('123 Datentest');
      expect(MetadataService.getValue<string>('isoMetadata.title', metadata1)).toBe('123 Datentest');
      expect(MetadataService.getValue<string>('isoMetadata.description', metadata1)).toBe(
        'wergwergergergergergrge'
      );
      expect(MetadataService.getValue<Contact[]>('isoMetadata.pointsOfContact', metadata1)).toEqual([
        {
          id: 'b3e1c2d4-5f6a-4e7b-8c9d-0a1b2c3d4e5f',
          name: 'Peter Klose',
          organisation: 'terrestris GmbH & Co Kg',
          phone: '123123123',
          email: 'klose@wefewf.de'
        }
      ]);
    });

    test('should get nested array values with index', () => {
      expect(MetadataService.getValue<string>('isoMetadata.services[0].title', metadata1)).toBe('123 Datentest');
      expect(MetadataService.getValue<string>('isoMetadata.services[1].serviceType', metadata1)).toBe('ATOM');
      expect(
        MetadataService.getValue<string>('isoMetadata.services[2].featureTypes[0].columns[0].name', metadata1)
      ).toBe('Mein Attribut');
    });

    test('should return undefined for non-existent paths', () => {
      expect(MetadataService.getValue('isoMetadata.nonexistent.path', metadata1)).toBeUndefined();
      expect(MetadataService.getValue('isoMetadata.services[99]', metadata1)).toBeUndefined();
    });
  });

  describe('getAllValues', () => {
    test('should collect all column names from all feature types', () => {
      const names = MetadataService.getAllValues('isoMetadata.services.featureTypes.columns.name', metadata1);
      expect(names).toEqual(['Mein Attribut', 'Mein zweites Attribut ']);
    });

    test('should collect all service titles', () => {
      const titles = MetadataService.getAllValues('isoMetadata.services.title', metadata1);
      expect(titles).toEqual(['123 Datentest', 'ewfewf', 'WFS Titel']);
    });

    test('should handle special case for layers (profileId 48)', () => {
      const layers = MetadataService.getAllValues('clientMetadata.layers', metadata1);
      expect(layers).toHaveLength(1); // Nach dem Flatten
      expect(layers[0]).toHaveProperty('name', 'ewfwefew');
    });

    test('should collect keywords as expected', () => {
      const keywords = MetadataService.getAllValues('isoMetadata.keywords', metadata1);
      expect(keywords).toEqual([
        {
          default: [
            {
              keyword: 'Betriebswasser'
            }
          ]
        }
      ]);
    });
  });
});
