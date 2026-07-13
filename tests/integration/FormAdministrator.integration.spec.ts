import { cleanup } from '@testing-library/svelte';
import { afterEach, describe, vi } from 'vitest';
import { tick } from 'svelte';

import { testAdditional } from './Additional.integration';
import { testBasedata } from './Basedata.integration';
import { testClassification } from './Classification.integration';
import { testServices } from './Services.integration';
import { testTempAndSpatial } from './TempAndSpatial.integration';

describe('Form completion with role MdeAdministrator', () => {
  afterEach(async () => {
    await tick();
    await Promise.resolve();
    cleanup();
    vi.clearAllMocks();
  });

  testBasedata('MdeAdministrator');
  testClassification('MdeAdministrator');
  testTempAndSpatial('MdeAdministrator');
  testAdditional('MdeAdministrator');
  testServices('MdeAdministrator');
});
