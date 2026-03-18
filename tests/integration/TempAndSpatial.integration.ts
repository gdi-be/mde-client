import { render, screen, fireEvent, waitFor, within } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';

import { describe, it, expect, beforeEach } from 'vitest';

import { fetchMock, setMockMetadataId, setMockRoles } from '../setup';
import metadata3 from '../fixtures/metadata3';
import FormHarness from '../helpers/FormHarness.svelte';
import { isRequiredField, testField } from '../helpers/TestFieldHelpers';
import { tick } from 'svelte';

export async function testTempAndSpatial(role: string) {
  describe('Temporal and Spatial Information', () => {
    beforeEach(async () => {
      setMockMetadataId('a723e625-815c-4553-93bf-2fb62bb623d4');
      setMockRoles([role]);

      render(FormHarness, {
        props: {
          metadata: structuredClone(metadata3)
        }
      });

      const timeTab = await screen.findByText('form.temp_and_spatial');

      fireEvent.click(timeTab);
      await tick();
      await new Promise((r) => setTimeout(r, 0));
    });

    describe('09_CreatedField', () => {
      it('can set creation date correctly', async () => {
        const createdField = screen.getByRole('group', { name: '09_CreatedField.label' });

        await waitFor(() => {
          expect(createdField).toBeInTheDocument();
        });

        await testField('isoMetadata.created', {
          fieldset: createdField,
          fieldInput: '2025-06-05',
          fieldType: 'date',
          help: true,
          testProgress: {
            section: 'temp_and_spatial',
            label: 'form.temp_and_spatial',
            expectIncrease: isRequiredField('isoMetadata.created', 'temp_and_spatial')
          }
        });
      });
    });

    describe('10_PublishedField', () => {
      it('can set published date correctly', async () => {
        const publishedField = document.querySelector('.published-field') as HTMLElement;

        await waitFor(() => {
          expect(publishedField).toBeInTheDocument();
        });

        await testField('isoMetadata.published', {
          fieldset: publishedField,
          fieldInput: '2026-01-01',
          fieldType: 'date',
          help: true
        });
      });
    });

    describe('14_MaintenanceFrequencyField', () => {
      it('can set maintenance frequency', async () => {
        const fieldset = await waitFor(() => {
          const el = document.querySelector('.maintenance-frequency-field');
          expect(el).toBeInTheDocument();
          return el as HTMLElement;
        });

        await testField('isoMetadata.maintenanceFrequency', {
          fieldset: fieldset,
          fieldType: 'select',
          selectOptionText: 'monatlich',
          selectOptionValue: 'monthly',
          help: true
        });
      });
    });

    describe('11_LastUpdatedField', () => {
      it('can set last updated date correctly', async () => {
        const fieldset = await waitFor(() => {
          const el = document.querySelector('.last-updated-field');
          expect(el).toBeInTheDocument();
          return el as HTMLElement;
        });

        const input = fieldset.querySelector('input[type="date"]') as HTMLInputElement;

        expect(input).toBeEnabled();

        await testField('isoMetadata.modified', {
          fieldset: fieldset,
          fieldInput: '2024-06-21',
          fieldType: 'date',
          help: true
        });
      });
    });

    describe('12_ValidityRangeField', () => {
      it('can set valid from date', async () => {
        const fieldset = await waitFor(() => {
          const el = document.querySelector('.validity-range-field');
          expect(el).toBeInTheDocument();
          return el as HTMLElement;
        });

        await testField('isoMetadata.validFrom', {
          fieldset: within(fieldset).getAllByRole('group')[1],
          fieldType: 'date',
          fieldInput: '2025-01-01',
          help: false,
          testProgress: {
            section: 'temp_and_spatial',
            label: 'form.temp_and_spatial',
            expectIncrease: true
          }
        });
      });

      it('can set valid to date', async () => {
        const fieldset = await waitFor(() => {
          const el = document.querySelector('.validity-range-field');
          expect(el).toBeInTheDocument();
          return el as HTMLElement;
        });

        await testField('isoMetadata.validTo', {
          fieldset: within(fieldset).getAllByRole('group')[2],
          fieldType: 'date',
          fieldInput: '2025-12-31',
          help: false,
          testProgress: {
            section: 'temp_and_spatial',
            label: 'form.temp_and_spatial',
            expectIncrease: true
          }
        });
      });
    });

    describe('16_DeliveredCoordinateSystemField', () => {
      it('can set delivered crs correctly', async () => {
        const fieldset = await waitFor(() => {
          const el = document.querySelector('.delivered-crs-field');
          expect(el).toBeInTheDocument();
          return el as HTMLElement;
        });

        await testField('technicalMetadata.deliveredCrs', {
          fieldset: fieldset,
          fieldInput: 'New coordinate system...',
          help: true,
          testProgress: {
            section: 'temp_and_spatial',
            label: 'form.temp_and_spatial',
            expectIncrease: true
          }
        });
      });
    });

    describe('17_CoordinateSystemField', () => {
      if (role === 'MdeEditor' || role === 'MdeAdministrator' || role === 'MdeQualityAssurance') {
        it('can set CRS correctly with role MdeEditor, MdeQualityAssurance or MdeAdministrator', async () => {
          await waitFor(() => {
            expect(fetchMock).toHaveBeenCalledWith(`/data/crs`);
          });

          const fieldset = await waitFor(() => {
            const el = document.querySelector('.crs-field');
            expect(el).toBeInTheDocument();
            return el as HTMLElement;
          });

          await testField('isoMetadata.crs', {
            fieldset: fieldset,
            fieldType: 'select',
            selectOptionText: 'EPSG:4326',
            selectOptionValue: 'http://www.opengis.net/def/crs/EPSG/0/4326',
            help: true
          });
        });
      } else {
        it('can not set CRS with role MdeDataOwner', async () => {
          expect(fetchMock).not.toHaveBeenCalledWith('/help/isoMetadata.crs');
        });
      }
    });

    describe('18_ExtentField', () => {
      if (role === 'MdeEditor' || role === 'MdeAdministrator' || role === 'MdeQualityAssurance') {
        it('can set extent correctly with role MdeEditor, MdeQualityAssurance or MdeAdministrator', async () => {
          await waitFor(() => {
            expect(screen.getByText('Koordinatensystem')).toBeInTheDocument();
          });

          await waitFor(() => {
            expect(fetchMock).toHaveBeenCalledWith(`/help/isoMetadata.extent`);
          });

          await waitFor(() => {
            expect(fetchMock).toHaveBeenCalledWith(`/data/extents`);
          });

          await waitFor(
            () => {
              expect(fetchMock).toHaveBeenCalledWith('/data/crs');
            },
            { timeout: 2000 }
          );

          await new Promise((resolve) => setTimeout(resolve, 100));

          const fieldset = await waitFor(() => {
            const el = document.querySelector('.extent-field');
            expect(el).toBeInTheDocument();
            return el as HTMLElement;
          });

          const inputs = await within(fieldset).findAllByRole('textbox');

          async function setValue(input: HTMLElement, inputValue: string) {
            expect(input).toBeInTheDocument();

            const previousCallCount = fetchMock.mock.calls.length;

            await userEvent.clear(input);
            await tick();
            await new Promise((r) => setTimeout(r, 0));

            await userEvent.type(input, inputValue);
            await tick();
            await new Promise((r) => setTimeout(r, 0));

            await fireEvent.blur(input);
            await tick();
            await new Promise((r) => setTimeout(r, 0));

            await waitFor(() => {
              expect(fetchMock.mock.calls.length).toBeGreaterThan(previousCallCount);
            });
          }

          await setValue(inputs[0], '13');
          await setValue(inputs[1], '14');
          await setValue(inputs[2], '52');
          await setValue(inputs[3], '52');

          await waitFor(() => {
            expect(fetchMock).toHaveBeenCalledWith(expect.any(URL), {
              method: 'PATCH',
              body: JSON.stringify({
                key: 'isoMetadata.extent',
                value: { minx: 13, miny: 52, maxx: 14, maxy: 52 }
              }),
              headers: {
                'content-type': 'application/json'
              }
            });
          });
        });
      } else {
        it('can not set extent with role MdeDataOwner', async () => {
          expect(screen.queryByText('Koordinatensystem')).not.toBeInTheDocument();
          expect(fetchMock).not.toHaveBeenCalledWith('/help/isoMetadata.extent');
        });
      }
    });

    describe('28_ResolutionField', () => {
      it('can set resolution correctly', async () => {
        const fieldset = await waitFor(() => {
          const el = document.querySelector('.resolution-field');
          expect(el).toBeInTheDocument();
          return el as HTMLElement;
        });

        await testField('isoMetadata.resolutions', {
          fieldset: fieldset,
          fieldType: 'radio',
          radioOptionKey: 'isoMetadata.resolutions',
          help: true,
          testProgress: {
            section: 'temp_and_spatial',
            label: 'form.temp_and_spatial',
            expectIncrease: isRequiredField('isoMetadata.resolutions', 'temp_and_spatial')
          }
        });
      });

      it('can set scale correctly', async () => {
        const fieldset = await waitFor(() => {
          const el = document.querySelector('.resolution-field');
          expect(el).toBeInTheDocument();
          return el as HTMLElement;
        });

        const radioInput = fieldset!.querySelector(
          `input[value="isoMetadata.resolutions"]`
        ) as HTMLInputElement;
        expect(radioInput).toBeInTheDocument();

        await userEvent.click(radioInput);
        await tick();
        await new Promise((r) => setTimeout(r, 0));

        const fieldsetNew = await waitFor(() => {
          const el = document.querySelector('.resolution-field .number-input');
          expect(el).toBeInTheDocument();
          return el as HTMLElement;
        });

        await testField('isoMetadata.resolutions', {
          fieldset: fieldsetNew,
          fieldType: 'number',
          fieldInput: '25000',
          help: false,
          testProgress: {
            section: 'temp_and_spatial',
            label: 'form.temp_and_spatial',
            expectIncrease: isRequiredField('isoMetadata.scale', 'temp_and_spatial')
          }
        });
      });
    });

    describe('39_SpatialRepresentationField', () => {
      if (role === 'MdeEditor' || role === 'MdeAdministrator') {
        it('can set spatial representation correctly with role MdeEditor or MdeAdministrator', async () => {
          await waitFor(() => {
            expect(fetchMock).toHaveBeenCalledWith('/data/spatial_representation_types');
          });

          const fieldset = await waitFor(() => {
            const el = document.querySelector('.spatial-representation-field');
            expect(el).toBeInTheDocument();
            return el as HTMLElement;
          });

          await testField('isoMetadata.spatialRepresentationTypes', {
            fieldset: fieldset,
            fieldType: 'multiselect',
            multiSelectOptions: ['test representation'],
            help: true,
            testProgress: {
              section: 'temp_and_spatial',
              label: 'form.temp_and_spatial',
              expectIncrease: isRequiredField(
                'isoMetadata.spatialRepresentationTypes',
                'temp_and_spatial'
              )
            }
          });

          await new Promise((r) => setTimeout(r, 300));
        });
      } else {
        it('can not set extent with role MdeDataOwner or MdeQualityAssurance', async () => {
          expect(fetchMock).not.toHaveBeenCalledWith(
            '/help/isoMetadata.spatialRepresentationTypes'
          );

          const fieldset = document.querySelector('.spatial-representation-field') as HTMLElement;

          await waitFor(() => {
            expect(fieldset).not.toBeInTheDocument();
          });
        });
      }
    });
  });
}
