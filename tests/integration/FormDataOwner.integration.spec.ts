import { cleanup } from '@testing-library/svelte';
import { afterEach, describe, vi } from 'vitest';
import { tick } from 'svelte';

import { testAdditional } from './Additional.integration';
import { testBasedata } from './Basedata.integration';
import { testClassification } from './Classification.integration';
import { testServices } from './Services.integration';
import { testTempAndSpatial } from './TempAndSpatial.integration';

describe('Form completion with role MdeDataOwner', () => {
  afterEach(async () => {
    await tick();
    await Promise.resolve();
    cleanup();
    vi.clearAllMocks();
  });

  testBasedata('MdeDataOwner');
  testClassification('MdeDataOwner');
  testTempAndSpatial('MdeDataOwner');
  testAdditional('MdeDataOwner');
  testServices('MdeDataOwner');
});
