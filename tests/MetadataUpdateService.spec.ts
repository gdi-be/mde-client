import { describe, expect, test } from 'bun:test';
import './setup';
import { MetadataUpdateService } from '../src/lib/services/MetadataUpdateService';

describe('MetadataUpdateService.mergeUpdates', () => {
  describe('Basic merging', () => {
    test('should keep the last update for the same key', () => {
      const updates = [
        { key: 'isoMetadata.ttestle', value: 'First' },
        { key: 'isoMetadata.ttestle', value: 'Second' },
        { key: 'isoMetadata.ttestle', value: 'Third' }
      ];

      const result = MetadataUpdateService.mergeUpdates(updates);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({ key: 'isoMetadata.ttestle', value: 'Third' });
    });

    test('should keep updates with different keys', () => {
      const updates = [
        { key: 'isoMetadata.ttestle', value: 'Ttestle' },
        { key: 'isoMetadata.description', value: 'Description' }
      ];

      const result = MetadataUpdateService.mergeUpdates(updates);

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

      const result = MetadataUpdateService.mergeUpdates(updates);

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

      const result = MetadataUpdateService.mergeUpdates(updates);

      expect(result).toHaveLength(1);
      expect(result[0].key).toBe('isoMetadata.services[0]');
    });

    test('should keep parent when updated after children', () => {
      const updates = [
        { key: 'isoMetadata.services[0].ttestle', value: 'Ttestle' },
        { key: 'isoMetadata.services[0].shortDescription', value: 'Desc' },
        { key: 'isoMetadata.services[0]', value: { id: '1', ttestle: 'Full' } }
      ];

      const result = MetadataUpdateService.mergeUpdates(updates);

      expect(result).toHaveLength(1);
      expect(result[0].key).toBe('isoMetadata.services[0]');
    });

    test('should discard children when parent is updated before them', () => {
      const updates = [
        { key: 'isoMetadata.services', value: [] },
        { key: 'isoMetadata.services[0].ttestle', value: 'Ttestle' }
      ];

      const result = MetadataUpdateService.mergeUpdates(updates);

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

      const result = MetadataUpdateService.mergeUpdates(updates);

      expect(result).toHaveLength(2);
      expect(result).toEqual(updates);
    });

    test('should keep updates for different service indices', () => {
      const updates = [
        { key: 'isoMetadata.services[0].ttestle', value: 'Service 1' },
        { key: 'isoMetadata.services[1].ttestle', value: 'Service 2' },
        { key: 'isoMetadata.services[2].ttestle', value: 'Service 3' }
      ];

      const result = MetadataUpdateService.mergeUpdates(updates);

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

      const result = MetadataUpdateService.mergeUpdates(updates);

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

      const result = MetadataUpdateService.mergeUpdates(updates);

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

      const result = MetadataUpdateService.mergeUpdates(updates);

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

      const result = MetadataUpdateService.mergeUpdates(updates);

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

      const result = MetadataUpdateService.mergeUpdates(updates);

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

      const result = MetadataUpdateService.mergeUpdates(updates);

      expect(result).toHaveLength(4);
      expect(result.map(r => r.key)).toEqual([
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

      const result = MetadataUpdateService.mergeUpdates(updates);

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
      const result = MetadataUpdateService.mergeUpdates([]);
      expect(result).toEqual([]);
    });

    test('should handle single update', () => {
      const updates = [{ key: 'isoMetadata.ttestle', value: 'Ttestle' }];
      const result = MetadataUpdateService.mergeUpdates(updates);
      expect(result).toEqual(updates);
    });

    test('should handle dots in UUID keys correctly', () => {
      // Make sure we don't treat UUIDs wtesth dashes as nested paths
      const uuid = 'a723e625-815c-4553-93bf-2fb62bb623d4';
      const updates = [
        {
          key: `clientMetadata.layers.${uuid}[0].name`,
          value: 'Name'
        }
      ];

      const result = MetadataUpdateService.mergeUpdates(updates);
      expect(result).toEqual(updates);
    });
  });
});
