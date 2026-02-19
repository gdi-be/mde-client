/* eslint-disable @typescript-eslint/no-explicit-any */
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import metadata3 from './fixtures/metadata3';

// Browser API Polyfills

global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

if (!Element.prototype.animate) {
  Element.prototype.animate = function () {
    return {
      finished: Promise.resolve(),
      cancel() {},
      play() {},
      pause() {},
      reverse() {},
      addEventListener() {},
      removeEventListener() {}
    } as any;
  };
}

// Test State Management

let currentMetadata: any = null;

export function resetTestMetadata(metadata: any) {
  currentMetadata = structuredClone(metadata);
}

export function getCurrentTestMetadata() {
  return currentMetadata;
}

// Fetch Mock

function mockJson(data: unknown) {
  const jsonString = JSON.stringify(data);

  const createResponse = () => ({
    ok: true,
    status: 200,
    json: async () => JSON.parse(jsonString),
    text: async () => jsonString,
    clone: createResponse
  });

  return Promise.resolve(createResponse() as Response);
}

export const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
  const url = input.toString();

  // Static Data Endpoints

  if (url.includes('/terms_of_use')) {
    return mockJson([{ id: 1, shortname: 'Test Terms', active: true }]);
  }

  if (url.includes('/privacy')) {
    return mockJson([
      { key: 'TEST', label: 'Test' },
      { key: 'NONE', label: 'Keine Einschränkung' }
    ]);
  }

  if (url === '/data/iso_themes') {
    return Promise.resolve(
      new Response(JSON.stringify([{ isoID: 'Land use', isoName: 'Land use' }]), { status: 200 })
    );
  }

  if (url.includes('inspire_themes')) {
    return Promise.resolve(
      new Response(
        JSON.stringify([
          { key: '001', label: 'Addresses' },
          { key: '002', label: 'Administrative units' }
        ])
      )
    );
  }

  if (url.includes('/extents')) {
    return mockJson([
      {
        key: 'WORLD',
        label: 'World',
        value: { minx: -180, miny: -90, maxx: 180, maxy: 90 }
      }
    ]);
  }

  if (url === '/data/crs') {
    return new Response(
      JSON.stringify([
        {
          key: 'http://www.opengis.net/def/crs/EPSG/0/4326',
          label: 'EPSG:4326',
          definition: '+proj=longlat +datum=WGS84 +no_defs'
        }
      ]),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }

  if (url === '/data/spatial_representation_types') {
    return Promise.resolve(
      new Response(JSON.stringify([{ key: 'test representation', label: 'test representation' }]))
    );
  }

  // Keywords

  if (url.startsWith('/data/keywords')) {
    return Promise.resolve({
      ok: true,
      json: async () => ({
        total_results: 1,
        results: ['test-keyword']
      })
    } as Response);
  }

  if (url.includes('/autokeywords')) {
    return Promise.resolve({
      ok: true,
      json: async () => []
    } as Response);
  }

  if (url.includes('hvd_categories')) {
    return Promise.resolve(
      new Response(
        JSON.stringify([
          { key: 'A', label: 'Kategorie A' },
          { key: 'B', label: 'Kategorie B' }
        ])
      )
    );
  }

  // PATCH Requests

  if (init?.method === 'PATCH') {
    if (!currentMetadata) {
      currentMetadata = structuredClone(metadata3);
    }

    if (url.includes('/updateLayers/')) {
      try {
        const body = JSON.parse(init.body as string);
        const serviceIdentification = url.split('/updateLayers/')[1];

        if (!currentMetadata.clientMetadata) {
          currentMetadata.clientMetadata = {};
        }
        if (!currentMetadata.clientMetadata.layers) {
          currentMetadata.clientMetadata.layers = {};
        }

        currentMetadata.clientMetadata.layers[serviceIdentification] = body.layers || [];
      } catch (e) {
        console.error('Failed to apply updateLayers PATCH:', e, 'Body:', init.body);
      }
      return mockJson(currentMetadata);
    }

    try {
      const body = JSON.parse(init.body as string);

      if (body.key && body.value !== undefined) {
        const keys = body.key.split('.');
        let current: any = currentMetadata;

        for (let i = 0; i < keys.length - 1; i++) {
          if (!current[keys[i]]) {
            current[keys[i]] = {};
          }
          current = current[keys[i]];
        }

        const lastKey = keys[keys.length - 1];

        let value = body.value;
        if (typeof value === 'string') {
          try {
            value = JSON.parse(value);
          } catch {
            // Keep as string if not JSON
          }
        }

        current[lastKey] = value;
      } else if (!body.key) {
        Object.keys(body).forEach((key) => {
          if (
            typeof body[key] === 'object' &&
            body[key] !== null &&
            !Array.isArray(body[key]) &&
            typeof currentMetadata[key] === 'object' &&
            currentMetadata[key] !== null &&
            !Array.isArray(currentMetadata[key])
          ) {
            currentMetadata[key] = {
              ...currentMetadata[key],
              ...body[key]
            };
          } else {
            currentMetadata[key] = body[key];
          }
        });
      } else {
        console.warn('PATCH with key but no value:', body);
      }
    } catch (e) {
      console.error('Failed to apply PATCH:', e, 'Body:', init.body);
    }

    return mockJson(currentMetadata);
  }

  return mockJson([]);
});

global.fetch = fetchMock as any;

// Mock FormContext

vi.mock('$lib/context/FormContext.svelte', async () => {
  const actual = await vi.importActual('$lib/context/FormContext.svelte');
  return {
    ...actual,
    allFieldsValid: vi.fn(() => true)
  };
});

// Mock User Context

let mockMetadataId = 'default-metadata-id';
let mockRoles = ['MdeEditor'];

export function setMockMetadataId(id: string) {
  mockMetadataId = id;
}

export function setMockRoles(roles: string[]) {
  mockRoles = roles;
}

let mockUserId = '9282dbab-a97d-44fa-8f06-042ab34f6de6';

export function setMockUserId(userId: string) {
  mockUserId = userId;
}

vi.mock('$lib/context/TokenContext.svelte', async () => {
  const actual = await vi.importActual('$lib/context/TokenContext.svelte');
  return {
    ...actual,
    getTokenState: () => ({
      accessToken: 'test-token',
      isAuthenticated: true
    }),
    getAccessToken: () => ({
      sub: mockUserId,
      realm_access: { roles: mockRoles }
    })
  };
});

vi.mock('$lib/context/ServerEventContext.svelte', async () => {
  const actual = await vi.importActual('$lib/context/ServerEventContext.svelte');
  return {
    ...actual,
    sseContext: {
      getSseContext: () => [
        {
          validation: {
            status: 'FINISHED',
            metadataId: mockMetadataId
          }
        }
      ]
    }
  };
});

vi.mock('$lib/util', async () => {
  const actual = await vi.importActual('$lib/util');
  return {
    ...actual,
    getHighestRole: () => mockRoles[0]
  };
});

vi.mock('@material/dom/focus-trap', () => ({
  FocusTrap: vi.fn(() => ({
    trapFocus: vi.fn(),
    releaseFocus: vi.fn()
  }))
}));
