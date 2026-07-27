import { render, screen, fireEvent, waitFor, within } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';

import { describe, it, expect, beforeEach } from 'vitest';

import metadata3 from '../fixtures/metadata3';
import FormHarness from '../helpers/FormHarness.svelte';
import { isRequiredField, testField } from '../helpers/TestFieldHelpers';
import { fetchMock, resetTestMetadata, setMockMetadataId, setMockRoles } from '../setup';
import { tick } from 'svelte';

export async function testAdditional(role: string) {
  describe('Additional Information', () => {
    beforeEach(async () => {
      setMockMetadataId('a723e625-815c-4553-93bf-2fb62bb623d4');
      setMockRoles([role]);
      resetTestMetadata(metadata3);

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
        expect(fieldsets.length).toBeGreaterThan(0);

        await userEvent.click(screen.getByTitle('32_Lineage.add'));
        await tick();
        await new Promise((r) => setTimeout(r, 0));

        await waitFor(async () => {
          expect(screen.queryAllByRole('group', { name: 'delete' }).length).toBeGreaterThan(0);
        });

        const titleInput = document.querySelector(
          '#isoMetadata\\.lineage-0-title'
        ) as HTMLInputElement | null;
        expect(titleInput).toBeInTheDocument();
        const titleFieldset = titleInput!.closest('fieldset') as HTMLElement;
        await testField('isoMetadata.lineage[0].title', {
          fieldset: titleFieldset,
          fieldInput: 'Test Title',
          expectPersist: false,
          help: true
        });

        fetchMock.mockResolvedValueOnce(
          new Response(
            JSON.stringify({
              content: [
                {
                  id: 1,
                  title: 'Selected dataset',
                  metadataId: '7af63ac1-9d95-38e6-9a9e-8b8eb9676da2'
                }
              ]
            })
          )
        );
        await fireEvent.keyUp(titleInput!, { target: { value: 'Selected dataset' } });
        await userEvent.click(await screen.findByRole('button', { name: 'Selected dataset' }));

        const dateInput = document.querySelector(
          '#isoMetadata\\.lineage-0-date'
        ) as HTMLInputElement | null;
        expect(dateInput).toBeInTheDocument();
        const dateFieldset = dateInput!.closest('fieldset') as HTMLElement;
        await testField('isoMetadata.lineage[0].date', {
          fieldset: dateFieldset,
          fieldType: 'date',
          fieldInput: '2026-01-01',
          expectPersist: false,
          help: true
        });

        const identifierInput = document.querySelector(
          '#isoMetadata\\.lineage-0-identifier'
        ) as HTMLInputElement | null;
        expect(identifierInput).toBeInTheDocument();
        expect(identifierInput).toHaveValue(
          'https://registry.gdi-de.org/id/de.be.csw/7af63ac1-9d95-38e6-9a9e-8b8eb9676da2'
        );

        fetchMock.mockResolvedValueOnce(
          new Response(
            JSON.stringify({
              content: [
                {
                  id: 2,
                  title: 'Dataset with URL',
                  metadataId: 'https://example.com/identifier'
                }
              ]
            })
          )
        );
        await fireEvent.keyUp(titleInput!, { target: { value: 'Dataset with URL' } });
        await userEvent.click(await screen.findByRole('button', { name: 'Dataset with URL' }));
        expect(identifierInput).toHaveValue('https://example.com/identifier');

        const identifierFieldset = identifierInput!.closest('fieldset') as HTMLElement;
        await testField('isoMetadata.lineage[0].identifier', {
          fieldset: identifierFieldset,
          fieldInput: 'Test Identifier',
          expectPersist: false,
          help: true
        });

        await userEvent.click(screen.getByTitle('32_Lineage.add'));
        await tick();
        await new Promise((r) => setTimeout(r, 0));

        await waitFor(() => {
          const inputFields = within(
            document.querySelector('.lineages-field') as HTMLElement
          ).getAllByRole('group');
          expect(inputFields.length).toBeGreaterThanOrEqual(5);
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
