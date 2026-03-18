import { render, screen, fireEvent, waitFor, within } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';

import { describe, it, expect, beforeEach } from 'vitest';

import metadata3 from '../fixtures/metadata3';
import FormHarness from '../helpers/FormHarness.svelte';
import { isRequiredField, testField } from '../helpers/TestFieldHelpers';
import { setMockMetadataId, setMockRoles } from '../setup';
import { tick } from 'svelte';

export async function testAdditional(role: string) {
  describe('Additional Information', () => {
    beforeEach(async () => {
      setMockMetadataId('a723e625-815c-4553-93bf-2fb62bb623d4');
      setMockRoles([role]);

      render(FormHarness, {
        props: {
          metadata: structuredClone(metadata3)
        }
      });

      const additionalTab = await screen.findByText('form.additional');

      fireEvent.click(additionalTab);
      await tick();
      await new Promise((r) => setTimeout(r, 0));
    });

    describe('30_ContentDescription', () => {
      it('can set content description correctly', async () => {
        const fieldset = document.querySelector('.content-description-field') as HTMLElement;

        await testField('isoMetadata.contentDescription', {
          fieldset,
          fieldType: 'text',
          fieldInput: 'Dies ist eine inhaltliche Beschreibung',
          help: true,
          testProgress: {
            section: 'additional',
            label: 'form.additional',
            expectIncrease: isRequiredField('isoMetadata.contentDescription', 'additional')
          }
        });
      });
    });

    describe('31_TechnicalDescription', () => {
      it('can set technical description correctly', async () => {
        const fieldset = document.querySelector('.technical-description-field') as HTMLElement;

        await testField('isoMetadata.technicalDescription', {
          fieldset,
          fieldType: 'text',
          fieldInput: 'Dies ist eine technische Beschreibung',
          help: true
        });
      });
    });

    describe('32_Lineage', () => {
      it('can set lineage correctly', async () => {
        const container = await waitFor(() => {
          const el = document.querySelector('.lineages-field');
          expect(el).toBeInTheDocument();
          return el as HTMLElement;
        });

        const fieldsets = within(container).getAllByRole('group');
        expect(fieldsets).toHaveLength(1);

        await userEvent.click(screen.getByTitle('32_Lineage.add'));
        await tick();
        await new Promise((r) => setTimeout(r, 0));

        await waitFor(async () => {
          expect(screen.queryAllByRole('group', { name: 'delete' }).length).toBeGreaterThan(0);
        });

        const fieldset = within(container).getAllByRole('group')[2];

        //TODO: Add test for search-input field like title

        await testField('isoMetadata.lineage[0].date', {
          fieldset: fieldset,
          fieldInput: 'Test Date',
          help: true
        });

        await testField('isoMetadata.lineage[0].identifier', {
          fieldset: fieldset,
          fieldInput: 'Test Identifier',
          help: true
        });

        await userEvent.click(screen.getByTitle('32_Lineage.add'));
        await tick();
        await new Promise((r) => setTimeout(r, 0));

        const inputFields = within(
          document.querySelector('.lineages-field') as HTMLElement
        ).getAllByRole('group');

        await waitFor(() => {
          expect(inputFields).toHaveLength(9);
        });
      });
    });

    describe('41_AdditionalInformation', () => {
      it('can set additional information correctly', async () => {
        const fieldset = await waitFor(() => {
          const el = document.querySelector('.contentDescriptions-field');
          expect(el).toBeInTheDocument();
          return el as HTMLElement;
        });

        await testField('isoMetadata.contentDescriptions', {
          fieldset: fieldset,
          fieldType: 'collection',
          addButtonTitle: '41_AdditionalInformation.add',
          collectionFields: [
            {
              fieldKey: 'isoMetadata.contentDescriptions[0].description',
              fieldType: 'text',
              fieldInput: 'Test Title',
              help: true,
              fieldsetSelector: () => {
                const container = document.querySelector(
                  '.contentDescriptions-field'
                ) as HTMLElement;
                return within(container).getAllByRole('group')[2] as HTMLElement;
              }
            },
            {
              fieldKey: 'isoMetadata.contentDescriptions[0].code',
              fieldType: 'select',
              fieldInput: '43_AdditionalInformationCode.order',
              optionsCode: 'order',
              help: true,
              fieldsetSelector: () => {
                const container = document.querySelector(
                  '.contentDescriptions-field'
                ) as HTMLElement;
                return within(container).getAllByRole('group')[3] as HTMLElement;
              }
            },
            {
              fieldKey: 'isoMetadata.contentDescriptions[0].code',
              fieldType: 'select',
              fieldInput: '43_AdditionalInformationCode.download',
              optionsCode: 'download',
              help: true,
              fieldsetSelector: () => {
                const container = document.querySelector(
                  '.contentDescriptions-field'
                ) as HTMLElement;
                return within(container).getAllByRole('group')[3] as HTMLElement;
              }
            },
            {
              fieldKey: 'isoMetadata.contentDescriptions[0].code',
              fieldType: 'select',
              fieldInput: '43_AdditionalInformationCode.information',
              optionsCode: 'information',
              help: true,
              fieldsetSelector: () => {
                const container = document.querySelector(
                  '.contentDescriptions-field'
                ) as HTMLElement;
                return within(container).getAllByRole('group')[3] as HTMLElement;
              }
            },
            {
              fieldKey: 'isoMetadata.contentDescriptions[0].code',
              fieldType: 'select',
              fieldInput: '43_AdditionalInformationCode.offlineAccess',
              optionsCode: 'offlineAccess',
              help: true,
              fieldsetSelector: () => {
                const container = document.querySelector(
                  '.contentDescriptions-field'
                ) as HTMLElement;
                return within(container).getAllByRole('group')[3] as HTMLElement;
              }
            },
            {
              fieldKey: 'isoMetadata.contentDescriptions[0].code',
              fieldType: 'select',
              fieldInput: '43_AdditionalInformationCode.search',
              optionsCode: 'search',
              help: true,
              fieldsetSelector: () => {
                const container = document.querySelector(
                  '.contentDescriptions-field'
                ) as HTMLElement;
                return within(container).getAllByRole('group')[3] as HTMLElement;
              }
            },
            {
              fieldKey: 'isoMetadata.contentDescriptions[0].url',
              fieldType: 'text',
              fieldInput: 'https://test.com',
              help: true,
              fieldsetSelector: () => {
                const container = document.querySelector(
                  '.contentDescriptions-field'
                ) as HTMLElement;
                return within(container).getAllByRole('group')[4] as HTMLElement;
              }
            }
          ]
        });

        const inputFields = within(
          document.querySelector('.contentDescriptions-field') as HTMLElement
        ).getAllByRole('group');

        await waitFor(() => {
          expect(inputFields).toHaveLength(9);
        });
      });
    });
  });
}
