import { beforeAll, describe, expect, it } from 'vitest';
import { transformExtent, transformCoordinate, registerCRSCodes } from '$lib/util';
import type { PartialExtent, PartialCoordinate } from '$lib/models/metadata';

describe('util functions', () => {
  describe('coordinate transformation', () => {
    it('should transform coordinate from EPSG:3857 to EPSG:4326', () => {
      const coord = [840000, 6500000] as [number, number];
      const transformed = transformCoordinate(coord, 'EPSG:3857', 'EPSG:4326');
      expect(transformed).toEqual([7.54585, 50.30922]);
    });
  });
});

describe('util - coordinate transformation functions', () => {
  beforeAll(() => {
    // Register common CRS definitions for testing
    registerCRSCodes([
      {
        label: 'EPSG:4326',
        key: 'EPSG:4326',
        definition: '+proj=longlat +datum=WGS84 +no_defs +type=crs'
      },
      {
        label: 'EPSG:3857',
        key: 'EPSG:3857',
        definition:
          '+proj=merc +a=6378137 +b=6378137 +lat_ts=0 +lon_0=0 +x_0=0 +y_0=0 +k=1 +units=m +nadgrids=@null +wktext +no_defs +type=crs'
      },
      {
        label: 'EPSG:25833',
        key: 'EPSG:25833',
        definition:
          '+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs'
      }
    ]);
  });

  describe('transformCoordinate', () => {
    it('should transform a coordinate from EPSG:25833 to EPSG:4326', () => {
      const coordinate: PartialCoordinate = [389000, 5819000];
      const result = transformCoordinate(coordinate, 'EPSG:25833', 'EPSG:4326');

      expect(result).toBeDefined();
      expect(result[0]).toBeCloseTo(13.364, 2);
      expect(result[1]).toBeCloseTo(52.50981, 2);
    });

    it('should transform a coordinate from EPSG:4326 to EPSG:3857', () => {
      const coordinate: PartialCoordinate = [13.4, 52.5];
      const result = transformCoordinate(coordinate, 'EPSG:4326', 'EPSG:3857');

      expect(result).toBeDefined();
      expect(result[0]).toBeCloseTo(1491681, 0);
      expect(result[1]).toBeCloseTo(6891042, 0);
    });

    it('should use EPSG:4326 as default target CRS', () => {
      const coordinate: PartialCoordinate = [1489000, 6894000];
      const result = transformCoordinate(coordinate, 'EPSG:3857');

      expect(result).toBeDefined();
      expect(result[0]).toBeCloseTo(13.375, 2);
      expect(result[1]).toBeCloseTo(52.516, 2);
    });

    it('should return original coordinate when x is undefined', () => {
      const coordinate: PartialCoordinate = [undefined, 52.5];
      const result = transformCoordinate(coordinate, 'EPSG:4326', 'EPSG:3857');

      expect(result).toEqual(coordinate);
    });

    it('should return original coordinate when y is undefined', () => {
      const coordinate: PartialCoordinate = [13.4, undefined];
      const result = transformCoordinate(coordinate, 'EPSG:4326', 'EPSG:3857');

      expect(result).toEqual(coordinate);
    });

    it('should return original coordinate when both values are undefined', () => {
      const coordinate: PartialCoordinate = [undefined, undefined];
      const result = transformCoordinate(coordinate, 'EPSG:4326', 'EPSG:3857');

      expect(result).toEqual(coordinate);
    });

    it('should round to 5 decimal places for degree-based CRS', () => {
      const coordinate: PartialCoordinate = [1489123.456789, 6894567.891234];
      const result = transformCoordinate(coordinate, 'EPSG:3857', 'EPSG:4326');

      // Check that the result has at most 5 decimal places
      expect(result[0]?.toString().split('.')[1]?.length || 0).toBeLessThanOrEqual(5);
      expect(result[1]?.toString().split('.')[1]?.length || 0).toBeLessThanOrEqual(5);
    });

    it('should round to 0 decimal places for meter-based CRS', () => {
      const coordinate: PartialCoordinate = [13.456789, 52.567891];
      const result = transformCoordinate(coordinate, 'EPSG:4326', 'EPSG:3857');

      // Check that the result has no decimal places
      expect(result[0]! % 1).toBe(0);
      expect(result[1]! % 1).toBe(0);
    });

    it('should handle zero coordinates', () => {
      const coordinate: PartialCoordinate = [0, 0];
      const result = transformCoordinate(coordinate, 'EPSG:4326', 'EPSG:3857');

      expect(result).toBeDefined();
      // Note: result may be -0, which is mathematically equal to 0
      expect(Math.abs(result[0]!)).toBe(0);
      expect(Math.abs(result[1]!)).toBe(0);
    });

    it('should handle negative coordinates', () => {
      const coordinate: PartialCoordinate = [-10.5, -20.3];
      const result = transformCoordinate(coordinate, 'EPSG:4326', 'EPSG:3857');

      expect(result).toBeDefined();
      expect(result[0]).toBeLessThan(0);
      expect(result[1]).toBeLessThan(0);
    });
  });

  describe('transformExtent', () => {
    it('should transform extent from EPSG:3857 to EPSG:4326', () => {
      const extent: PartialExtent = {
        minx: 1489000,
        miny: 6894000,
        maxx: 1500000,
        maxy: 6900000
      };
      const result = transformExtent(extent, 'EPSG:3857', 'EPSG:4326');

      expect(result).toBeDefined();
      expect(result.minx).toBeCloseTo(13.375, 2);
      expect(result.miny).toBeCloseTo(52.516, 2);
      expect(result.maxx).toBeCloseTo(13.474, 2);
      expect(result.maxy).toBeCloseTo(52.548, 2);
    });

    it('should transform extent from EPSG:4326 to EPSG:3857', () => {
      const extent: PartialExtent = {
        minx: 13.0,
        miny: 52.0,
        maxx: 13.5,
        maxy: 52.5
      };
      const result = transformExtent(extent, 'EPSG:4326', 'EPSG:3857');

      expect(result).toBeDefined();
      expect(result.minx).toBeCloseTo(1447153, 0);
      expect(result.miny).toBeCloseTo(6800125, 0);
      expect(result.maxx).toBeCloseTo(1502813, 0);
      expect(result.maxy).toBeCloseTo(6891042, 0);
    });

    it('should use EPSG:4326 as default target CRS', () => {
      const extent: PartialExtent = {
        minx: 1489000,
        miny: 6894000,
        maxx: 1500000,
        maxy: 6900000
      };
      const result = transformExtent(extent, 'EPSG:3857');

      expect(result).toBeDefined();
      expect(result.minx).toBeCloseTo(13.375, 2);
      expect(result.miny).toBeCloseTo(52.516, 2);
    });

    it('should preserve 0 values in minx', () => {
      const extent: PartialExtent = {
        minx: 0,
        miny: 6894000,
        maxx: 1500000,
        maxy: 6900000
      };
      const result = transformExtent(extent, 'EPSG:3857', 'EPSG:4326');

      expect(result.minx).toBe(0);
      expect(result.miny).not.toBe(0);
    });

    it('should preserve 0 values in miny', () => {
      const extent: PartialExtent = {
        minx: 1489000,
        miny: 0,
        maxx: 1500000,
        maxy: 6900000
      };
      const result = transformExtent(extent, 'EPSG:3857', 'EPSG:4326');

      expect(result.miny).toBe(0);
      expect(result.minx).not.toBe(0);
    });

    it('should preserve 0 values in maxx', () => {
      const extent: PartialExtent = {
        minx: 1489000,
        miny: 6894000,
        maxx: 0,
        maxy: 6900000
      };
      const result = transformExtent(extent, 'EPSG:3857', 'EPSG:4326');

      expect(result.maxx).toBe(0);
      expect(result.minx).not.toBe(0);
    });

    it('should preserve 0 values in maxy', () => {
      const extent: PartialExtent = {
        minx: 1489000,
        miny: 6894000,
        maxx: 1500000,
        maxy: 0
      };
      const result = transformExtent(extent, 'EPSG:3857', 'EPSG:4326');

      expect(result.maxy).toBe(0);
      expect(result.miny).not.toBe(0);
    });

    it('should preserve all 0 values', () => {
      const extent: PartialExtent = {
        minx: 0,
        miny: 0,
        maxx: 0,
        maxy: 0
      };
      const result = transformExtent(extent, 'EPSG:3857', 'EPSG:4326');

      expect(result.minx).toBe(0);
      expect(result.miny).toBe(0);
      expect(result.maxx).toBe(0);
      expect(result.maxy).toBe(0);
    });

    it('should handle undefined CRS values', () => {
      const extent: PartialExtent = {
        minx: 1489000,
        miny: 6894000,
        maxx: 1500000,
        maxy: 6900000
      };
      // @ts-expect-error - testing behavior with undefined CRS
      const result = transformExtent(extent, undefined, 'EPSG:4326');

      // Should return original extent when fromEPSG is undefined
      expect(result).toEqual(extent);
    });

    it('should use default EPSG:4326 when toEPSG is undefined', () => {
      const extent: PartialExtent = {
        minx: 1489000,
        miny: 6894000,
        maxx: 1500000,
        maxy: 6900000
      };
      const result = transformExtent(extent, 'EPSG:3857', undefined);

      // The function uses EPSG:4326 as default, so transformation occurs
      expect(result).toBeDefined();
      expect(result.minx).toBeCloseTo(13.375, 2);
      expect(result.miny).toBeCloseTo(52.516, 2);
    });

    it('should handle partial extent with missing coordinates', () => {
      const extent: PartialExtent = {
        minx: 1489000,
        miny: 6894000
      };
      const result = transformExtent(extent, 'EPSG:3857', 'EPSG:4326');

      expect(result.minx).toBeCloseTo(13.375, 2);
      expect(result.miny).toBeCloseTo(52.516, 2);
      expect(result.maxx).toBeUndefined();
      expect(result.maxy).toBeUndefined();
    });

    it('should transform extent between different meter-based CRS', () => {
      const extent: PartialExtent = {
        minx: 380000,
        miny: 5810000,
        maxx: 400000,
        maxy: 5830000
      };
      const result = transformExtent(extent, 'EPSG:25833', 'EPSG:3857');

      expect(result).toBeDefined();
      expect(result.minx).toBeDefined();
      expect(result.miny).toBeDefined();
      expect(result.maxx).toBeDefined();
      expect(result.maxy).toBeDefined();
    });

    it('should handle extent spanning large area', () => {
      const extent: PartialExtent = {
        minx: -180,
        miny: -85,
        maxx: 180,
        maxy: 85
      };
      const result = transformExtent(extent, 'EPSG:4326', 'EPSG:3857');

      expect(result).toBeDefined();
      expect(result.minx).toBeLessThan(result.maxx!);
      expect(result.miny).toBeLessThan(result.maxy!);
    });
  });
});
