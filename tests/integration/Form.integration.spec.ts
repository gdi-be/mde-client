import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup
} from '@testing-library/svelte';

import {
  describe,
  it,
  expect,
  afterEach,
  vi
} from 'vitest';

import metadata3 from '../fixtures/metadata3';
import FormHarness from '../helpers/FormHarness.svelte';
import { testBasedata } from './Basedata.integration';
import { testClassification } from './Classification.integration';
import { testTempAndSpatial } from './TempAndSpatial.integration';
import { testAdditional } from './Additional.integration';
import { testServices } from './Services.integration';

describe('Form - Integration test', () => {
  afterEach(async () => {
    cleanup();
    vi.clearAllMocks();
    await Promise.resolve();
  })

  describe('Form navigation', () => {
    it('can navigate sections', async () => {
      render(FormHarness, {
        props: {
          metadata: structuredClone(metadata3)
        }
      });

      await fireEvent.click(
        screen.getByRole('button', { name: 'form.next' })
      );

      await waitFor(() => {
        expect(
          screen.getByText('form.inspireLegend')
        ).toBeInTheDocument();
      });

      await fireEvent.click(
        screen.getByRole('button', { name: 'form.back' })
      );

      await waitFor(() => {
        expect(
          screen.getByRole('group', {
            name: '01_TitleField.label'
          })).toBeInTheDocument();
      });
    });
  });

  describe('Form completion with role MdeAdministrator', () => {
    testBasedata('MdeAdministrator');
    testClassification('MdeAdministrator');
    testTempAndSpatial('MdeAdministrator');
    testAdditional('MdeAdministrator');
    testServices('MdeAdministrator');
  });

  describe('Form completion with role MdeEditor', () => {
    testBasedata('MdeEditor');
    testClassification('MdeEditor');
    testTempAndSpatial('MdeEditor');
    testAdditional('MdeEditor');
    testServices('MdeEditor');
  });

  describe('Form completion with role MdeDataOwner', () => {
    testBasedata('MdeDataOwner');
    testClassification('MdeDataOwner');
    testTempAndSpatial('MdeDataOwner');
    testAdditional('MdeDataOwner');
    testServices('MdeDataOwner');
  });
});
