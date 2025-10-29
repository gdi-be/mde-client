import { describe, expect, test, beforeEach, afterEach } from 'bun:test';
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
    // Mock a fixed date: October 28, 2025
    const mockDate = new Date('2025-10-28T14:30:00.000Z');
    const OriginalDate = global.Date;

    beforeEach(() => {
      // Mock Date constructor
      global.Date = class MockDate extends OriginalDate {
        constructor(value?: string | number | Date) {
          if (value === undefined) {
            super(mockDate);
          } else {
            super(value);
          }
        }

        static now() {
          return mockDate.getTime();
        }
      } as any;
    });

    afterEach(() => {
      global.Date = OriginalDate;
    });

    // Test cases with expected results based on the mocked date (2025-10-28)
    const testCases = [
      {
        published: '2024-01-01',
        frequency: 'continual' as MaintenanceFrequency,
        expected: '2025-10-28',
        description: 'continual should return today'
      },
      {
        published: '2024-01-01',
        frequency: 'daily' as MaintenanceFrequency,
        expected: '2025-10-27',
        description: 'daily should return yesterday'
      },
      {
        published: '2024-01-01', // Was a Monday
        frequency: 'weekly' as MaintenanceFrequency,
        expected: '2025-10-27', // Last Monday before Oct 28
        description: 'weekly should return last occurrence of same weekday'
      },
      {
        published: '2024-01-01',
        frequency: 'fortnightly' as MaintenanceFrequency,
        expected: '2025-10-20', // 14-day cycle from Jan 1
        description: 'fortnightly should return date from last 14-day cycle'
      },
      {
        published: '2024-01-15',
        frequency: 'monthly' as MaintenanceFrequency,
        expected: '2025-10-15', // 15th of October 2025
        description: 'monthly should return 15th of current month'
      },
      {
        published: '2024-01-30',
        frequency: 'monthly' as MaintenanceFrequency,
        expected: '2025-09-30', // 30th of September (October 30th hasn't occurred yet)
        description: 'monthly should handle end of month correctly'
      },
      {
        published: '2024-01-01',
        frequency: 'quarterly' as MaintenanceFrequency,
        expected: '2025-10-01', // Q4 2025
        description: 'quarterly should return start of current quarter'
      },
      {
        published: '2024-01-01',
        frequency: 'biannually' as MaintenanceFrequency,
        expected: '2025-07-01', // Second half of 2025
        description: 'biannually should return start of current half-year'
      },
      {
        published: '2022-03-15',
        frequency: 'annually' as MaintenanceFrequency,
        expected: '2025-03-15', // March 15, 2025
        description: 'annually should return same date in current year'
      },
      {
        published: '2022-12-15',
        frequency: 'annually' as MaintenanceFrequency,
        expected: '2024-12-15', // December 15, 2024 (2025-12-15 hasn't occurred yet)
        description: 'annually should return same date in previous year if not occurred yet'
      }
    ];

    describe('concrete test cases', () => {
      testCases.forEach(({ published, frequency, expected, description }) => {
        test(`${description}: published=${published}, frequency=${frequency} -> expected=${expected}`, () => {
          const result = getLastUpdateValue(published, frequency);

          expect(result).toBeDefined();
          const expectedDate = new OriginalDate(expected + 'T00:00:00.000Z');
          expect(result!.getUTCFullYear()).toBe(expectedDate.getUTCFullYear());
          expect(result!.getUTCMonth()).toBe(expectedDate.getUTCMonth());
          expect(result!.getUTCDate()).toBe(expectedDate.getUTCDate());
        });
      });
    });

    describe('edge cases', () => {
      test('should not return date before published date', () => {
        // Test with a future date (relative to our mocked "today")
        const result = getLastUpdateValue('2025-10-29', 'daily');
        const published = new OriginalDate('2025-10-29T00:00:00.000Z');

        expect(result).toBeDefined();
        expect(result!.getTime()).toBeGreaterThanOrEqual(published.getTime());
      });

      test('should handle very old published dates', () => {
        const published = '2020-01-01';
        const result = getLastUpdateValue(published, 'monthly');

        expect(result).toBeDefined();
        expect(result!.getTime()).toBeLessThanOrEqual(mockDate.getTime());
        expect(result!.getTime()).toBeGreaterThanOrEqual(new OriginalDate(published).getTime());
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

        console.log('Published Date Object:', new OriginalDate(published));
        console.log('Published Date ISO:', new OriginalDate(published).toISOString());
        console.log('Mocked Today Date Object:', mockDate);
        console.log('Mocked Today Date ISO:', mockDate.toISOString());
        console.log('Result:', result?.toISOString());

        expect(result).toBeDefined();
      });
    });

    describe('edge cases and validation', () => {
      test('should handle very old published dates', () => {
        const published = '2020-01-01';
        const result = getLastUpdateValue(published, 'monthly');

        expect(result).toBeDefined();
        expect(result!.getTime()).toBeLessThanOrEqual(mockDate.getTime());
        expect(result!.getTime()).toBeGreaterThanOrEqual(new OriginalDate(published).getTime());
      });

      test('should maintain day of week for weekly frequency', () => {
        const published = '2024-01-01'; // Monday
        const result = getLastUpdateValue(published, 'weekly');

        expect(result).toBeDefined();
        expect(result!.getDay()).toBe(new OriginalDate(published).getDay()); // Should be same day of week
      });

      test('should calculate correct fortnightly cycles', () => {
        const published = '2024-01-01';
        const result = getLastUpdateValue(published, 'fortnightly');

        expect(result).toBeDefined();

        // Verify the calculation: should be publishedDate + (cycles * 14 days)
        const publishedDate = new OriginalDate(published);
        const daysDiff = Math.floor(
          (result!.getTime() - publishedDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        expect(daysDiff % 14).toBe(0); // Should be exact multiple of 14 days
      });
    });
  });
});
