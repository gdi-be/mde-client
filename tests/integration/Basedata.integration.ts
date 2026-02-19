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

import { fetchMock, resetTestMetadata, setMockMetadataId, setMockRoles } from '../setup';
import metadata3 from '../fixtures/metadata3';
import FormHarness from '../helpers/FormHarness.svelte';
import { isRequiredField, testField } from '../helpers/TestFieldHelpers';

export async function testBasedata(role: string) {
  describe('Basedata', () => {
    beforeEach(async () => {
      cleanup();
      setMockMetadataId('a723e625-815c-4553-93bf-2fb62bb623d4');
      setMockRoles([role]);
      resetTestMetadata(metadata3)

      render(FormHarness, {
        props: {
          metadata: structuredClone(metadata3)
        }
      });

      const baseTab = screen.queryByText('form.basedata') as HTMLElement
      expect(baseTab).toBeInTheDocument();
      fireEvent.click(baseTab);
    })

    describe('01_TitleField', () => {
      it('can set title correctly', async () => {
        const fieldset = document.querySelector('.title-field') as HTMLElement;

        waitFor(() => {
          expect(fieldset).toBeInTheDocument();
        })

        await testField(
          'isoMetadata.title',
          {
            fieldset: fieldset,
            fieldType: 'text',
            fieldInput: 'New Title',
            maxLength: 250,
            requiredMessage: 'Bitte geben Sie einen Titel an.',
            help: true,
            testProgress: {
              section: 'basedata',
              label: 'form.basedata',
              expectIncrease: isRequiredField('isoMetadata.title', 'basedata')
            }
          }
        )
      });
    });

    describe('02_DescriptionField', () => {
      it('can set description correctly', async () => {
        const fieldset = document.querySelector('.description-field') as HTMLElement;

        waitFor(() => {
          expect(fieldset).toBeInTheDocument();
        })

        await testField(
          'isoMetadata.description',
          {
            fieldset: fieldset,
            fieldType: 'textarea',
            fieldInput: 'New Description text...',
            requiredMessage: 'Bitte geben Sie eine Beschreibung an.',
            maxLength: 500,
            help: true,
            testProgress: {
              section: 'basedata',
              label: 'form.basedata',
              expectIncrease: isRequiredField('isoMetadata.title', 'basedata')
            }
          }
        )
      });
    });

    describe('15_KeywordsField', () => {
      it('can set keywords correctly', async () => {
        const fieldset = document.querySelector('.keywords-field') as HTMLElement;

        await waitFor(() => {
          expect(fieldset).toBeVisible();
          expect(screen.getByText('15_KeywordsField.autocomplete_label')).toBeVisible();
          expect(screen.getByText('15_KeywordsField.no_matches')).toBeVisible();
          expect(document.querySelector('#SMUI-autocomplete-4-menu'));
        });

        await testField(
          'isoMetadata.keywords',
          {
            fieldset: fieldset,
            fieldType: 'multiselect',
            fieldInput: 'Test',
            multiSelectOptions: ['test-keyword'],
            help: true,
            testProgress: {
              section: 'basedata',
              label: 'form.basedata',
              expectIncrease: isRequiredField('isoMetadata.keywords', 'basedata')
            }
          }
        );

        await new Promise((r) => setTimeout(r, 100));
      });

      it('can add new keywords', async () => {
        const noMatches = await screen.findByText('15_KeywordsField.no_matches');
        await userEvent.click(noMatches);

        await waitFor(() => {
          expect(screen.getByText('15_KeywordsField.dialog_title')).toBeVisible();
        });

        const textarea = screen.getByLabelText('15_KeywordsField.dialog_label');
        await userEvent.type(textarea, 'Custom1, Custom2');

        await userEvent.click(screen.getByText('general.add'));

        await waitFor(() => {
          expect(screen.getByText('Custom1')).toBeVisible();
          expect(screen.getByText('Custom2')).toBeVisible();
        });
      });
    });

    describe('29_PreviewField', () => {
      it('can set preview correctly', async () => {
        const fieldset = document.querySelector('.preview-field') as HTMLElement;

        waitFor(() => {
          expect(fieldset).toBeInTheDocument();
        })

        await testField(
          'isoMetadata.preview',
          {
            fieldset: screen.getAllByRole('group')[3],
            fieldInput: 'https://gdi.berlin.de/data/example.json',
            requiredMessage: 'Bitte geben Sie ein Vorschaubild an.',
            help: true,
            testProgress: {
              section: 'basedata',
              label: 'form.basedata',
              expectIncrease: isRequiredField('isoMetadata.preview', 'basedata')
            }
          }
        )
      });
    });

    describe('19_ContactsField', () => {
      it('can delete existing contact', async () => {
        expect(screen.getByRole('button', { name: 'delete' })).not.toBeDisabled();

        await userEvent.click(
          screen.getByRole('button', { name: 'delete' })
        );

        await waitFor(async () => {
          expect(screen.getByText('19_ContactsField.delete_confirm')).toBeInTheDocument();
        });

        const popconfirm = document.querySelector('.popconfirm') as HTMLDialogElement;


        await userEvent.click(
          within(popconfirm).getByText('19_ContactsField.delete')
        );

        await waitFor(() => {
          expect(fetchMock).toHaveBeenCalledWith(
            expect.any(URL),
            {
              method: 'PATCH',
              body: JSON.stringify({
                key: 'isoMetadata.pointsOfContact',
                value: []
              }),
              headers: {
                "content-type": "application/json",
              },
            }
          );
        });

        await waitFor(async () => {
          expect(screen.queryByRole('button', { name: 'delete' })).not.toBeInTheDocument();
        });
      });

      it('can set contact correctly', async () => {
        await testField(
          'isoMetadata.pointsOfContact[0]',
          {
            fieldset: document.querySelector('.contacts-field') as HTMLElement,
            fieldType: 'collection',
            addButtonTitle: '19_ContactsField.add',
            collectionFields: [
              {
                fieldKey: 'isoMetadata.pointsOfContact[0].name',
                fieldType: 'text',
                fieldInput: 'John Doe',
                fieldsetSelector: () =>
                  (document.querySelector('#isoMetadata\\.pointsOfContact-0-name') as HTMLInputElement)
                    ?.closest('fieldset') as HTMLElement
              },
              {
                fieldKey: 'isoMetadata.pointsOfContact[0].organisation',
                fieldType: 'text',
                fieldInput: 'Test Organisation',
                fieldsetSelector: () =>
                  (document.querySelector('#isoMetadata\\.pointsOfContact-0-organisation') as HTMLInputElement)
                    ?.closest('fieldset') as HTMLElement
              },
              {
                fieldKey: 'isoMetadata.pointsOfContact[0].phone',
                fieldType: 'text',
                fieldInput: '+49-123-0123',
                fieldsetSelector: () =>
                  (document.querySelector('#isoMetadata\\.pointsOfContact-0-phone') as HTMLInputElement)
                    ?.closest('fieldset') as HTMLElement
              },
              {
                fieldKey: 'isoMetadata.pointsOfContact[0].email',
                fieldType: 'text',
                fieldInput: 'john@example.com',
                fieldsetSelector: () =>
                  (document.querySelector('#isoMetadata\\.pointsOfContact-0-email') as HTMLInputElement)
                    ?.closest('fieldset') as HTMLElement
              }
            ],
            help: false,
            testProgress: {
              section: 'basedata',
              label: 'form.basedata',
              expectIncrease: false
            }
          }
        );

      });




      it('can import new contact', async () => {
        const contactBtn = screen.getByRole('button', {
          name: '19_ContactsField.autofill'
        });

        fireEvent.click(contactBtn);

        await waitFor(() => {
          expect(fetchMock).toHaveBeenCalledWith(
            '/userdetails',
            {
              method: 'GET',
              headers: {
                "content-type": "application/json",
              },
            }
          );
        });

        await waitFor(() => {
          expect(fetchMock).toHaveBeenCalledWith(
            expect.any(URL),
            {
              method: 'PATCH',
              body: expect.stringContaining('"key":"isoMetadata.pointsOfContact"'),
              headers: {
                "content-type": "application/json",
              },
            }
          );
        });
      });
    });
  });
};