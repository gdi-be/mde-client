/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, expect, test } from 'bun:test';
import './setup';
import { contactsRenameAddQueue } from './fixtures/contacts';
import {
  serviceFeaturetyeDescriptionAndAttributeAddQueue,
  servicesRenameAddQueue
} from './fixtures/services';

// Import after setup to ensure mocks are loaded first
const { MetadataUpdateService } = await import('../src/lib/services/MetadataUpdateService');

describe('MetadataUpdateService.mergeUpdates', () => {
  describe('Basic merging', () => {
    test('should keep the last update for the same key', () => {
      const updates = [
        { key: 'isoMetadata.ttestle', value: 'First' },
        { key: 'isoMetadata.ttestle', value: 'Second' },
        { key: 'isoMetadata.ttestle', value: 'Third' }
      ];

      const { merged: result } = MetadataUpdateService.mergeUpdates(updates);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({ key: 'isoMetadata.ttestle', value: 'Third' });
    });

    test('should keep updates with different keys', () => {
      const updates = [
        { key: 'isoMetadata.ttestle', value: 'Ttestle' },
        { key: 'isoMetadata.description', value: 'Description' }
      ];

      const { merged: result } = MetadataUpdateService.mergeUpdates(updates);

      expect(result).toHaveLength(2);
      expect(result).toEqual(updates);
    });
  });

  describe('Parent-child relationship', () => {
    test('should discard child updates when parent array is updated', () => {
      const updates = [
        { key: 'isoMetadata.pointsOfContact[0].name', value: 'New Name' },
        { key: 'isoMetadata.pointsOfContact', value: [{ id: '1', name: 'Old Name' }] }
      ];

      const { merged: result } = MetadataUpdateService.mergeUpdates(updates);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        key: 'isoMetadata.pointsOfContact',
        value: [{ id: '1', name: 'Old Name' }]
      });
    });

    test('should discard child updates when parent object is updated', () => {
      const updates = [
        { key: 'isoMetadata.services[0].ttestle', value: 'New Ttestle' },
        { key: 'isoMetadata.services[0]', value: { id: '1', ttestle: 'Complete Service' } }
      ];

      const { merged: result } = MetadataUpdateService.mergeUpdates(updates);

      expect(result).toHaveLength(1);
      expect(result[0].key).toBe('isoMetadata.services[0]');
    });

    test('should keep parent when updated after children', () => {
      const updates = [
        { key: 'isoMetadata.services[0].ttestle', value: 'Ttestle' },
        { key: 'isoMetadata.services[0].shortDescription', value: 'Desc' },
        { key: 'isoMetadata.services[0]', value: { id: '1', ttestle: 'Full' } }
      ];

      const { merged: result } = MetadataUpdateService.mergeUpdates(updates);

      expect(result).toHaveLength(1);
      expect(result[0].key).toBe('isoMetadata.services[0]');
    });

    test('should discard children when parent is updated before them', () => {
      const updates = [
        { key: 'isoMetadata.services', value: [] },
        { key: 'isoMetadata.services[0].ttestle', value: 'Ttestle' }
      ];

      const { merged: result } = MetadataUpdateService.mergeUpdates(updates);

      expect(result).toHaveLength(1);
      expect(result[0].key).toBe('isoMetadata.services');
    });
  });

  describe('Sibling updates', () => {
    test('should keep updates for different array indices', () => {
      const updates = [
        { key: 'isoMetadata.pointsOfContact[0].name', value: 'Name 1' },
        { key: 'isoMetadata.pointsOfContact[1].name', value: 'Name 2' }
      ];

      const { merged: result } = MetadataUpdateService.mergeUpdates(updates);

      expect(result).toHaveLength(2);
      expect(result).toEqual(updates);
    });

    test('should keep updates for different service indices', () => {
      const updates = [
        { key: 'isoMetadata.services[0].ttestle', value: 'Service 1' },
        { key: 'isoMetadata.services[1].ttestle', value: 'Service 2' },
        { key: 'isoMetadata.services[2].ttestle', value: 'Service 3' }
      ];

      const { merged: result } = MetadataUpdateService.mergeUpdates(updates);

      expect(result).toHaveLength(3);
    });
  });

  describe('Deep nesting', () => {
    test('should handle deeply nested updates', () => {
      const updates = [
        {
          key: 'isoMetadata.services[0].featureTypes[0].columns[0].name',
          value: 'Column Name'
        },
        {
          key: 'isoMetadata.services[0].featureTypes[0].columns[1].alias',
          value: 'Column Alias'
        }
      ];

      const { merged: result } = MetadataUpdateService.mergeUpdates(updates);

      expect(result).toHaveLength(2);
      expect(result).toEqual(updates);
    });

    test('should discard deep children when ancestor is updated', () => {
      const updates = [
        {
          key: 'isoMetadata.services[0].featureTypes[0].columns[0].name',
          value: 'Name'
        },
        {
          key: 'isoMetadata.services[0].featureTypes[0].columns[1].alias',
          value: 'Alias'
        },
        {
          key: 'isoMetadata.services[0].featureTypes',
          value: []
        }
      ];

      const { merged: result } = MetadataUpdateService.mergeUpdates(updates);

      expect(result).toHaveLength(1);
      expect(result[0].key).toBe('isoMetadata.services[0].featureTypes');
    });

    test('should keep parent column update and discard child property', () => {
      const updates = [
        {
          key: 'isoMetadata.services[0].featureTypes[0].columns[0].name',
          value: 'Name'
        },
        {
          key: 'isoMetadata.services[0].featureTypes[0].columns[0]',
          value: { id: '1', name: 'Full Column', alias: 'Alias', type: 'Text' }
        }
      ];

      const { merged: result } = MetadataUpdateService.mergeUpdates(updates);

      expect(result).toHaveLength(1);
      expect(result[0].key).toBe('isoMetadata.services[0].featureTypes[0].columns[0]');
    });
  });

  describe('UUID-based keys (layers)', () => {
    test('should handle UUID-based keys', () => {
      const uuid = '00e19242-8d3c-4617-ad73-d5a6b79ae55f';
      const updates = [
        {
          key: `clientMetadata.layers.${uuid}[0].name`,
          value: 'Layer Name'
        },
        {
          key: `clientMetadata.layers.${uuid}[0].ttestle`,
          value: 'Layer Ttestle'
        }
      ];

      const { merged: result } = MetadataUpdateService.mergeUpdates(updates);

      expect(result).toHaveLength(2);
      expect(result).toEqual(updates);
    });

    test('should discard UUID child updates when parent is updated', () => {
      const uuid = '00e19242-8d3c-4617-ad73-d5a6b79ae55f';
      const updates = [
        {
          key: `clientMetadata.layers.${uuid}[0].name`,
          value: 'Name'
        },
        {
          key: `clientMetadata.layers.${uuid}`,
          value: [{ name: 'Full Layer' }]
        }
      ];

      const { merged: result } = MetadataUpdateService.mergeUpdates(updates);

      expect(result).toHaveLength(1);
      expect(result[0].key).toBe(`clientMetadata.layers.${uuid}`);
    });
  });

  describe('Mixed scenarios', () => {
    test('should handle complex mixed updates correctly', () => {
      const updates = [
        { key: 'isoMetadata.ttestle', value: 'Ttestle' },
        { key: 'isoMetadata.pointsOfContact[0].name', value: 'Name 1' },
        { key: 'isoMetadata.services[0].ttestle', value: 'Service Ttestle' },
        { key: 'isoMetadata.pointsOfContact[1].email', value: 'email@test.com' },
        { key: 'isoMetadata.pointsOfContact', value: [{ id: '1' }] }, // Should override [0] and [1]
        { key: 'isoMetadata.services[1].shortDescription', value: 'Desc' }
      ];

      const { merged: result } = MetadataUpdateService.mergeUpdates(updates);

      expect(result).toHaveLength(4);
      expect(result.map((r) => r.key)).toEqual([
        'isoMetadata.ttestle',
        'isoMetadata.services[0].ttestle',
        'isoMetadata.pointsOfContact',
        'isoMetadata.services[1].shortDescription'
      ]);
    });

    test('should handle the original use case: name change + delete', () => {
      // User changes name in contact 0, then deletes contact 1
      // The delete sends the whole array (wtesth old name for contact 0)
      const updates = [
        {
          key: 'isoMetadata.pointsOfContact[0].name',
          value: 'Updated Name'
        },
        {
          key: 'isoMetadata.pointsOfContact',
          value: [
            { id: '1', name: 'Old Name', email: 'test@example.com' }
            // contact 1 was deleted
          ]
        }
      ];

      const { merged: result } = MetadataUpdateService.mergeUpdates(updates);

      // The array update should win, discarding the name update
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        key: 'isoMetadata.pointsOfContact',
        value: [{ id: '1', name: 'Old Name', email: 'test@example.com' }]
      });
    });
  });

  describe('Edge cases', () => {
    test('should handle empty updates array', () => {
      const { merged: result } = MetadataUpdateService.mergeUpdates([]);
      expect(result).toEqual([]);
    });

    test('should handle single update', () => {
      const updates = [{ key: 'isoMetadata.ttestle', value: 'Ttestle' }];
      const { merged: result } = MetadataUpdateService.mergeUpdates(updates);
      expect(result).toEqual(updates);
    });

    test('should handle dots in UUID keys correctly', () => {
      // Make sure we don't treat UUIDs with dashes as nested paths
      const uuid = 'a723e625-815c-4553-93bf-2fb62bb623d4';
      const updates = [
        {
          key: `clientMetadata.layers.${uuid}[0].name`,
          value: 'Name'
        }
      ];

      const { merged: result } = MetadataUpdateService.mergeUpdates(updates);
      expect(result).toEqual(updates);
    });
  });

  describe('Real world scenarios', () => {
    describe('Contact updates', () => {
      test('merging a name change and an add click', () => {
        const { merged: result } = MetadataUpdateService.mergeUpdates(
          contactsRenameAddQueue
        ) as any;
        expect(result).toHaveLength(1);
        expect(result[0].key).toBe('isoMetadata.pointsOfContact');
        expect(result[0].value).toHaveLength(2);
        expect(result[0].value[0].id).toBe('d5f856da-cfde-45e9-b6ce-f013d2b013d5');
        expect(result[0].value[1].id).toBe('6a07b9b2-1baa-4e19-bae9-228ede15d2a3');
        expect(result[0].value[1].name).toBe('Silke');
      });
    });

    describe('Service updates', () => {
      test('merging a short description change and an add click', () => {
        const { merged: result } = MetadataUpdateService.mergeUpdates(
          servicesRenameAddQueue
        ) as any;
        expect(result).toHaveLength(1);
        expect(result[0].key).toBe('isoMetadata.services');
        expect(result[0].value).toHaveLength(3);
        expect(result[0].value[0].id).toBe('a9a38aac-1e0e-467b-943f-fa94a4932cf2');
        expect(result[0].value[1].id).toBe('72ab09fa-f5ad-4e31-8b4f-e68dc93362e8');
        expect(result[0].value[2].id).toBe('0932b0de-06b4-4e5d-997a-4fc86bc4a6c9');
        expect(result[0].value[1].shortDescription).toBe('Neue Beschreibung');
      });

      test('Featuretype description update and attribute add', () => {
        const { merged: result } = MetadataUpdateService.mergeUpdates(
          serviceFeaturetyeDescriptionAndAttributeAddQueue
        ) as any;
        expect(result).toHaveLength(1);
        expect(result[0].key).toBe('isoMetadata.services');

        const services = result[0].value;
        expect(services).toHaveLength(3);
        expect(services[0].id).toBe('a9a38aac-1e0e-467b-943f-fa94a4932cf2');
        expect(services[1].id).toBe('72ab09fa-f5ad-4e31-8b4f-e68dc93362e8');
        expect(services[2].id).toBe('0932b0de-06b4-4e5d-997a-4fc86bc4a6c9');

        const service3featuretypes = services[2].featureTypes;
        expect(service3featuretypes).toHaveLength(2);

        const service3ft1 = service3featuretypes[0];
        const service3ft2 = service3featuretypes[1];
        expect(service3ft1.id).toBe('b081dea4-1fb7-4b0b-9ed2-8c48d8713ab1');
        expect(service3ft2.id).toBe('e1d0dac0-a5a8-4ce3-aaeb-7f520ffb97cf');
        expect(service3ft2.shortDescription).toBe(
          'FT 2 Beschreibung dies ist meine neue Beschreibung'
        );

        const service3ft2columns = service3ft2.columns;
        expect(service3ft2columns).toHaveLength(3);
        expect(service3ft2columns[0].id).toBe('916027aa-3820-4db3-8d5c-a2639d72c88a');
        expect(service3ft2columns[1].id).toBe('679df2ad-665d-43f2-94fe-3563cf9c3540');
        expect(service3ft2columns[2].id).toBe('e0a2158a-5b29-4512-801a-34b9f707fbbe');
      });
    });
  });
});
