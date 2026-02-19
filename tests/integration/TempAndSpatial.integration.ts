import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
  within
} from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';

import {
  describe,
  it,
  expect,
  beforeEach
} from 'vitest';

import { fetchMock, setMockMetadataId, setMockRoles } from '../setup';
import metadata3 from '../fixtures/metadata3';
import FormHarness from '../helpers/FormHarness.svelte';
import { isRequiredField, testField } from '../helpers/TestFieldHelpers';

export async function testTempAndSpatial(role: string) {
  describe('Temporal and Spatial Information', () => {
    beforeEach(async () => {
      cleanup();
      setMockMetadataId('a723e625-815c-4553-93bf-2fb62bb623d4');
      setMockRoles([role]);

      render(FormHarness, {
        props: {
          metadata: structuredClone(metadata3)
        }
      });

      const timeTab = screen.queryByText('form.temp_and_spatial') as HTMLElement
      expect(timeTab).toBeInTheDocument();
      fireEvent.click(timeTab);
    });

    describe('09_CreatedField', () => {
      it('can set creation date correctly', async () => {
        const createdField = screen.getByRole('group', { name: '09_CreatedField.label' });

        await waitFor(() => {
          expect(createdField).toBeInTheDocument();
        });

        await testField(
          'isoMetadata.created',
          {
            fieldset: createdField,
            fieldInput: '2025-06-05',
            fieldType: 'date',
            help: true,
            testProgress: {
              section: 'temp_and_spatial',
              label: 'form.temp_and_spatial',
              expectIncrease: isRequiredField('isoMetadata.created', 'temp_and_spatial')
            }
          }
        )
      });
    });

    describe('10_PublishedField', () => {
      it('can set published date correctly', async () => {
        const publishedField = document.querySelector('.published-field') as HTMLElement;

        await waitFor(() => {
          expect(publishedField).toBeInTheDocument();
        });

        await testField(
          'isoMetadata.published',
          {
            fieldset: publishedField,
            fieldInput: '2026-01-01',
            fieldType: 'date',
            help: true
          }
        )
      });
    });

    describe('14_MaintenanceFrequencyField', () => {
      it('can set maintenance frequency', async () => {
        const fieldset = document.querySelector('.maintenance-frequency-field') as HTMLElement;

        waitFor(() => {
          expect(fieldset).toBeInTheDocument();
        })

        await testField(
          'isoMetadata.maintenanceFrequency',
          {
            fieldset: fieldset,
            fieldType: 'select',
            selectOptionText: 'monatlich',
            selectOptionValue: 'monthly',
            help: true
          }
        );
      });
    });

    describe('11_LastUpdatedField', () => {
      it('can set last updated date correctly', async () => {
        const fieldset = document.querySelector('.last-updated-field') as HTMLElement;

        waitFor(() => {
          expect(fieldset).toBeInTheDocument();
        })

        const input = fieldset.querySelector(
          'input[type="date"]'
        ) as HTMLInputElement;

        expect(input).toBeEnabled();

        await testField(
          'isoMetadata.modified',
          {
            fieldset: fieldset,
            fieldInput: '2024-06-21',
            fieldType: 'date',
            help: true
          }
        )
      });
    });

    describe('12_ValidityRangeField', () => {
      it('can set valid from date', async () => {
        const fieldset = document.querySelector('.validity-range-field') as HTMLElement;

        waitFor(() => {
          expect(fieldset).toBeInTheDocument();
        })

        await testField(
          'isoMetadata.validFrom',
          {
            fieldset: within(fieldset).getAllByRole('group')[1],
            fieldType: 'date',
            fieldInput: '2025-01-01',
            help: false,
            testProgress: {
              section: 'temp_and_spatial',
              label: 'form.temp_and_spatial',
              expectIncrease: true
            }
          }
        );
      });

      it('can set valid to date', async () => {
        const fieldset = document.querySelector('.validity-range-field') as HTMLElement;

        waitFor(() => {
          expect(fieldset).toBeInTheDocument();
        })

        await testField(
          'isoMetadata.validTo',
          {
            fieldset: within(fieldset).getAllByRole('group')[2],
            fieldType: 'date',
            fieldInput: '2025-12-31',
            help: false,
            testProgress: {
              section: 'temp_and_spatial',
              label: 'form.temp_and_spatial',
              expectIncrease: true
            }
          }
        );
      });
    });

    describe('16_DeliveredCoordinateSystemField', () => {
      it('can set delivered crs correctly', async () => {
        const fieldset = document.querySelector('.delivered-crs-field') as HTMLElement;

        waitFor(() => {
          expect(fieldset).toBeInTheDocument();
        })

        await testField(
          'technicalMetadata.deliveredCrs',
          {
            fieldset: fieldset,
            fieldInput: 'New coordinate system...',
            help: true,
            testProgress: {
              section: 'temp_and_spatial',
              label: 'form.temp_and_spatial',
              expectIncrease: true
            }
          }
        )
      });
    });

    describe('17_CoordinateSystemField', () => {
      if (role === 'MdeEditor' || role === 'MdeAdministrator' || role === 'MdeQualityAssurance') {
        it('can set CRS correctly with role MdeEditor, MdeQualityAssurance or MdeAdministrator', async () => {
          await waitFor(() => {
            expect(fetchMock).toHaveBeenCalledWith(`/data/crs`);
          });
          const fieldset = document.querySelector('.crs-field') as HTMLElement;

          waitFor(() => {
            expect(fieldset).toBeInTheDocument();
          })

          await testField(
            'isoMetadata.crs',
            {
              fieldset: fieldset,
              fieldType: 'select',
              selectOptionText: 'EPSG:4326',
              selectOptionValue: 'http://www.opengis.net/def/crs/EPSG/0/4326',
              help: true
            }
          );
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
          const inputs = await screen.getAllByRole('spinbutton');

          async function setValue(input: HTMLElement, inputValue: string) {
            expect(input).toBeInTheDocument();

            await userEvent.clear(input);

            await userEvent.type(input, inputValue);
            await fireEvent.blur(input);
          }

          const previousCallCount = fetchMock.mock.calls.length;

          await setValue(inputs[0], '13')
          await setValue(inputs[1], '14')
          await setValue(inputs[2], '52')
          await setValue(inputs[3], '53')

          await waitFor(() => {
            expect(fetchMock.mock.calls.length).toBeGreaterThan(previousCallCount);
          });

          await waitFor(() => {
            expect(fetchMock).toHaveBeenCalledWith(
              expect.any(URL),
              {
                method: 'PATCH',
                body: JSON.stringify({
                  key: 'isoMetadata.extent',
                  value: { minx: 13, miny: 52, maxx: 14, maxy: 53 }
                }),
                headers: {
                  "content-type": "application/json",
                },
              }
            );
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
        const fieldset = document.querySelector('.resolution-field') as HTMLElement;

        waitFor(() => {
          expect(fieldset).toBeInTheDocument();
        })

        await testField('isoMetadata.resolutions', {
          fieldset: fieldset,
          fieldType: 'radio',
          radioOptionKey: 'isoMetadata.resolutions',
          fieldInput: '10',
          help: true,
          testProgress: {
            section: 'temp_and_spatial',
            label: 'form.temp_and_spatial',
            expectIncrease: isRequiredField('isoMetadata.resolutions', 'temp_and_spatial')
          }
        });

      });

      it('can set scale correctly', async () => {
        const fieldset = document.querySelector('.resolution-field') as HTMLElement;

        waitFor(() => {
          expect(fieldset).toBeInTheDocument();
        })

        const radioInput = fieldset!.querySelector(`input[value="isoMetadata.resolutions"]`) as HTMLInputElement;
        expect(radioInput).toBeInTheDocument();

        await userEvent.click(radioInput);

        const fieldsetNew = document.querySelector('.resolution-field') as HTMLElement;

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

          const fieldset = document.querySelector('.spatial-representation-field') as HTMLElement

          waitFor(() => {
            expect(fieldset).toBeInTheDocument();
          })

          await testField(
            'isoMetadata.spatialRepresentationTypes',
            {
              fieldset: fieldset,
              fieldType: 'multiselect',
              multiSelectOptions: ['test representation'],
              help: true,
              testProgress: {
                section: 'temp_and_spatial',
                label: 'form.temp_and_spatial',
                expectIncrease: isRequiredField('isoMetadata.spatialRepresentationTypes', 'temp_and_spatial')
              }
            }
          );

          await new Promise((r) => setTimeout(r, 300));
        });
      } else {
        it('can not set extent with role MdeDataOwner or MdeQualityAssurance', async () => {
          expect(fetchMock).not.toHaveBeenCalledWith('/help/isoMetadata.spatialRepresentationTypes');

          const fieldset = document.querySelector('.spatial-representation-field') as HTMLElement

          waitFor(() => {
            expect(fieldset).not.toBeInTheDocument();
          })
        });
      }
    });
  });
};