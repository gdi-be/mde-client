import { screen, waitFor, within } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';

import { describe, it, expect, beforeEach } from 'vitest';

import { isRequiredField, testField } from '../helpers/TestFieldHelpers';
import { fetchMock } from '../setup';

export async function testLayersForm(role: string) {
  describe('48_LayerForm', () => {
    beforeEach(async () => {
      const fieldset = document.querySelector('.service-type-field') as HTMLElement;

      await userEvent.click(fieldset!);
      await userEvent.click(screen.getAllByText('🌎 58_ServiceType.wms')[0]);

      await waitFor(() => {
        expect(document.querySelector('.layers-form') as HTMLElement).toBeVisible();
      });

      const container = document.querySelector('.layers-form') as HTMLElement;
      const fieldsets = within(container).getAllByRole('group');
      expect(fieldsets).toHaveLength(1);

      await userEvent.click(within(container).getByText('add'));
      await waitFor(() => {
        const tabs = container.querySelectorAll('.tab-container');
        expect(tabs.length).toBeGreaterThan(1);
      });
    });

    describe('49_LayerTitle', () => {
      it('can set layer title correctly', async () => {
        const fieldset = document.querySelector('.layer-title-field') as HTMLElement;

        await waitFor(() => {
          expect(fieldset).toBeInTheDocument();
        });

        await testField('clientMetadata.layers', {
          fieldset: fieldset,
          fieldType: 'text',
          fieldInput: 'New Layer Title',
          help: true,
          testProgress: {
            section: 'services',
            label: 'form.services',
            expectIncrease: isRequiredField('clientMetadata.layers.title', 'services')
          }
        });
      });
    });

    describe('50_LayerName', () => {
      if (role === 'MdeEditor' || role === 'MdeAdministrator') {
        it('can set layer name correctly with role MdeEditor or MdeAdministrator', async () => {
          const fieldset = document.querySelector('.layer-name-field') as HTMLElement;

          await waitFor(() => {
            expect(fieldset).toBeInTheDocument();
          });

          await testField('clientMetadata.layers', {
            fieldset: fieldset,
            fieldType: 'text',
            fieldInput: 'New Layer Name',
            help: true,
            testProgress: {
              section: 'services',
              label: 'form.services',
              expectIncrease: isRequiredField('clientMetadata.layers.name', 'services')
            }
          });
        });
      } else {
        it('can not set layer name with role MdeDataOwner or MdeQualityAssurance', async () => {
          expect(fetchMock).not.toHaveBeenCalledWith('/help/clientMetadata.layers.name');

          await waitFor(() => {
            const fieldset = document.querySelector('.layer-name-field') as HTMLElement;
            expect(fieldset).not.toBeInTheDocument();
          });
        });
      }
    });

    describe('51_LayerStyleName', () => {
      if (role === 'MdeEditor' || role === 'MdeAdministrator') {
        it('can set layer style name correctly with role MdeEditor or MdeAdministrator', async () => {
          const fieldset = document.querySelector('.layer-style-name-field') as HTMLElement;

          await waitFor(() => {
            expect(fieldset).toBeInTheDocument();
          });

          await testField('clientMetadata.layers', {
            fieldset: fieldset as HTMLElement,
            fieldType: 'text',
            fieldInput: 'New Layer Style Name',
            help: true,
            testProgress: {
              section: 'services',
              label: 'form.services',
              expectIncrease: isRequiredField('clientMetadata.layers.styleName', 'services')
            }
          });
        });
      } else {
        it('can not set layer name with role MdeDataOwner or MdeQualityAssurance', async () => {
          expect(fetchMock).not.toHaveBeenCalledWith('/help/clientMetadata.layers.styleName');

          await waitFor(() => {
            const fieldset = document.querySelector('.layer-style-name-field') as HTMLElement;
            expect(fieldset).not.toBeInTheDocument();
          });
        });
      }
    });

    describe('53_LayerLegendImage', () => {
      it('can set layer legend correctly', async () => {
        const fieldset = document.querySelector('.layer-legend-image-field') as HTMLElement;

        await waitFor(() => {
          expect(fieldset).toBeInTheDocument();
        });

        await testField('clientMetadata.layers', {
          fieldset: fieldset,
          fieldType: 'text',
          fieldInput: 'examplelegend.png',
          help: true,
          testProgress: {
            section: 'services',
            label: 'form.services',
            expectIncrease: isRequiredField('clientMetadata.layers.legendImage', 'services')
          }
        });
      });
    });

    describe('54_Description', () => {
      it('can set layer description correctly', async () => {
        const fieldset = document.querySelector('.layer-short-description-field') as HTMLElement;

        await waitFor(() => {
          expect(fieldset).toBeInTheDocument();
        });

        await testField('clientMetadata.layers', {
          fieldset: fieldset,
          fieldType: 'text',
          fieldInput: 'New Description...',
          help: true,
          testProgress: {
            section: 'services',
            label: 'form.services',
            expectIncrease: isRequiredField('clientMetadata.layers.shortDescription', 'services')
          }
        });
      });
    });

    describe('55_LayerDatasource', () => {
      it('can set layer datasource correctly', async () => {
        const fieldset = document.querySelector('.layer-datasource-field') as HTMLElement;

        await waitFor(() => {
          expect(fieldset).toBeInTheDocument();
        });

        await testField('clientMetadata.layers', {
          fieldset: fieldset,
          fieldType: 'text',
          fieldInput: 'New Datasource...',
          help: true,
          testProgress: {
            section: 'services',
            label: 'form.services',
            expectIncrease: isRequiredField('clientMetadata.layers.datasource', 'services')
          }
        });
      });
    });

    describe('68_LayerSecondaryDatasource', () => {
      if (role === 'MdeEditor' || role === 'MdeAdministrator') {
        it('can set secondary datasource correctly with role MdeEditor or MdeAdministrator', async () => {
          const fieldset = document.querySelector(
            '.layer-secondary-datasource-field'
          ) as HTMLElement;

          await waitFor(() => {
            expect(fieldset).toBeInTheDocument();
          });

          await testField('clientMetadata.layers', {
            fieldset: fieldset,
            fieldType: 'text',
            fieldInput: 'Secondary Datasource...',
            help: true,
            testProgress: {
              section: 'services',
              label: 'form.services',
              expectIncrease: isRequiredField(
                'clientMetadata.layers.secondaryDatasource',
                'services'
              )
            }
          });
        });
      } else {
        it('can not set secondary datasource with role MdeDataOwner or MdeQualityAssurance', async () => {
          expect(fetchMock).not.toHaveBeenCalledWith(
            '/help/clientMetadata.layers.secondaryDatasource'
          );

          await waitFor(() => {
            const fieldset = document.querySelector(
              '.layer-secondary-datasource-field'
            ) as HTMLElement;
            expect(fieldset).not.toBeInTheDocument();
          });
        });
      }
    });
  });
}
