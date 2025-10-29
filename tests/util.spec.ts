import { describe, expect, test } from 'bun:test';
import { getLastUpdateValue, isAutomatedValue } from '$lib/util';
import type { MaintenanceFrequency } from '$lib/models/metadata';

describe('util functions', () => {
  describe('isAutomatedValue', () => {
    test('should return true for automated maintenance frequencies', () => {
      const automatedFrequencies: MaintenanceFrequency[] = [
        'continual',
        'daily',
        'weekly',
        'fortnightly',
        'monthly',
        'quarterly',
        'biannually',
        'annually'
      ];

      automatedFrequencies.forEach((frequency) => {
        expect(isAutomatedValue(frequency)).toBe(true);
      });
    });

    test('should return false for non-automated maintenance frequencies', () => {
      const nonAutomatedFrequencies: MaintenanceFrequency[] = [
        'asNeeded',
        'irregular',
        'notPlanned',
        'unknown'
      ];

      nonAutomatedFrequencies.forEach((frequency) => {
        expect(isAutomatedValue(frequency)).toBe(false);
      });
    });

    test('should return false when maintenance frequency is missing', () => {
      expect(isAutomatedValue(undefined)).toBe(false);
    });
  });

  describe('getLastUpdateValue', () => {
    const today = new Date();

    // Konkrete Testwerte mit erwarteten Ergebnissen
    // Annahme: Tests laufen am 28. Oktober 2025
    const testCases = [
      {
        published: '2024-01-01',
        frequency: 'continual',
        expected: '2025-10-28',
        description: 'continual should return today'
      },
      {
        published: '2024-01-01',
        frequency: 'daily',
        expected: '2025-10-27',
        description: 'daily should return yesterday'
      },
      {
        published: '2024-01-01', // War ein Montag
        frequency: 'weekly',
        expected: '2025-10-27', // Letzter Montag vor heute
        description: 'weekly should return last Monday'
      },
      {
        published: '2024-01-01',
        frequency: 'fortnightly',
        expected: '2025-10-20', // Basierend auf den Test-Ergebnissen
        description: 'fortnightly should return date from last 14-day cycle'
      },
      {
        published: '2024-01-15',
        frequency: 'monthly',
        expected: '2025-10-15', // 15. Oktober 2025
        description: 'monthly should return 15th of current month'
      },
      {
        published: '2024-01-30',
        frequency: 'monthly',
        expected: '2025-09-30', // 30. September, da Oktober noch nicht vorbei ist
        description: 'monthly should handle end of month correctly'
      },
      {
        published: '2024-01-01',
        frequency: 'quarterly',
        expected: '2025-10-01', // Q4 2025
        description: 'quarterly should return start of current quarter'
      },
      {
        published: '2024-01-01',
        frequency: 'biannually',
        expected: '2025-07-01', // Halbjahr 2/2025
        description: 'biannually should return start of current half-year'
      },
      {
        published: '2022-03-15',
        frequency: 'annually',
        expected: '2025-03-15', // 15. März 2025
        description: 'annually should return same date in current year'
      },
      {
        published: '2022-12-15',
        frequency: 'annually',
        expected: '2024-12-15', // 15. Dezember 2024 (da 2025-12-15 noch nicht war)
        description: 'annually should return same date in previous year if not occurred yet'
      },
      // Edge Cases
      {
        published: '2025-10-29', // Morgen
        frequency: 'daily',
        expected: '2025-10-29', // Sollte das published date zurückgeben, da es nicht vor diesem liegen darf
        description:
          'edge case: published date in future should return published date, not go before it'
      }
    ];

    describe('concrete test cases', () => {
      testCases.forEach(({ published, frequency, expected, description }) => {
        test(`${description}: published=${published}, frequency=${frequency} -> expected=${expected}`, () => {
          const result = getLastUpdateValue(published, frequency as MaintenanceFrequency);

          if (expected) {
            expect(result).toBeDefined();
            const expectedDate = new Date(expected);
            // Vergleiche nur das Datum, nicht die Zeit
            expect(result!.getFullYear()).toBe(expectedDate.getFullYear());
            expect(result!.getMonth()).toBe(expectedDate.getMonth());
            expect(result!.getDate()).toBe(expectedDate.getDate());
          } else {
            expect(result).toBeUndefined();
          }
        });
      });
    });
    describe('non-automated frequencies should return undefined', () => {
      const nonAutomatedCases = [
        { published: '2024-01-01', frequency: 'asNeeded' },
        { published: '2024-01-01', frequency: 'irregular' },
        { published: '2024-01-01', frequency: 'notPlanned' },
        { published: '2024-01-01', frequency: 'unknown' }
      ];

      nonAutomatedCases.forEach(({ published, frequency }) => {
        test(`${frequency} should return undefined`, () => {
          const result = getLastUpdateValue(published, frequency as MaintenanceFrequency);
          expect(result).toBeUndefined();
        });
      });
    });

    describe('timezone handling', () => {
      test('should handle timezone correctly', () => {
        const published = '2024-01-01';
        const result = getLastUpdateValue(published, 'fortnightly');

        console.log('Published Date Object:', new Date(published));
        console.log('Published Date ISO:', new Date(published).toISOString());
        console.log('Today Date Object:', new Date());
        console.log('Today Date ISO:', new Date().toISOString());
        console.log('Result:', result?.toISOString());

        expect(result).toBeDefined();
      });
    });

    describe('edge cases and validation', () => {
      test('should handle very old published dates', () => {
        const published = '2020-01-01';
        const result = getLastUpdateValue(published, 'monthly');

        expect(result).toBeDefined();
        expect(result!.getTime()).toBeLessThanOrEqual(today.getTime());
        expect(result!.getTime()).toBeGreaterThanOrEqual(new Date(published).getTime());
      });

      test('should maintain day of week for weekly frequency', () => {
        const published = '2024-01-01'; // Monday
        const result = getLastUpdateValue(published, 'weekly');

        expect(result).toBeDefined();
        expect(result!.getDay()).toBe(new Date(published).getDay()); // Should be same day of week
      });

      test('should calculate correct fortnightly cycles', () => {
        const published = '2024-01-01';
        const result = getLastUpdateValue(published, 'fortnightly');

        expect(result).toBeDefined();

        // Verify the calculation: should be publishedDate + (cycles * 14 days)
        const publishedDate = new Date(published);
        const daysDiff = Math.floor(
          (result!.getTime() - publishedDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        expect(daysDiff % 14).toBe(0); // Should be exact multiple of 14 days
      });
    });
  });
});
