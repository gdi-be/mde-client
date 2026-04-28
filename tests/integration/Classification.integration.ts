import { render, screen, fireEvent, waitFor, within } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';

import { describe, it, expect, beforeEach } from 'vitest';

import { fetchMock, setMockMetadataId, setMockRoles } from '../setup';
import metadata3 from '../fixtures/metadata3';
import FormHarness from '../helpers/FormHarness.svelte';
import { isRequiredField, testField } from '../helpers/TestFieldHelpers';
import { tick } from 'svelte';

export async function testClassification(role: string) {
  describe('Classification', () => {
    beforeEach(async () => {
      setMockMetadataId('a723e625-815c-4553-93bf-2fb62bb623d4');
      setMockRoles([role]);

      render(FormHarness, {
        props: {
          metadata: structuredClone(metadata3)
        }
      });

      const contextTab = await screen.findByText('form.classification');

      fireEvent.click(contextTab);
      await tick();
      await new Promise((r) => setTimeout(r, 0));
    });

    describe('05_MetadataProfileField', () => {
      it('can set metadata profile correctly', async () => {
        const fieldset = await waitFor(() => {
          const el = document.querySelector('.metadata-type-field');
          expect(el).toBeInTheDocument();
          return el as HTMLElement;
        });

        await testField('isoMetadata.metadataProfile', {
          fieldset: fieldset,
          fieldType: 'select',
          selectOptionText: '05_MetadataProfileField.inspire_harmonised',
          selectOptionValue: 'INSPIRE_HARMONISED',
          help: true,
          testProgress: {
            section: 'classification',
            label: 'form.classification',
            expectIncrease: false // profile always has value
          }
        });
      });

      it('renders INSPIRE options', async () => {
        await waitFor(() => {
          const el = screen.getByRole('group', { name: 'form.inspireLegend' });
          expect(el).toBeInTheDocument();
          return el as HTMLElement;
        });

        expect(screen.getByRole('option', { name: '05_MetadataProfileField.iso' })).toBeVisible();
        expect(
          screen.getByRole('option', { name: '05_MetadataProfileField.inspire_harmonised' })
        ).toBeVisible();
        expect(
          screen.getByRole('option', { name: '05_MetadataProfileField.inspire_identified' })
        ).toBeVisible();
      });

      it('does not render fields for non-INSPIRE profile', () => {
        expect(
          screen.queryByRole('group', { name: '38_InspireAnnexVersionField.label' })
        ).not.toBeInTheDocument();
        expect(
          screen.queryByText('Bitte geben Sie die Schema-Version des INSPIRE Themas an.')
        ).not.toBeInTheDocument();
        expect(
          document.querySelector('.inspire-annex-version-field') as HTMLElement
        ).not.toBeInTheDocument();
        expect(document.querySelector('.annex-theme-field') as HTMLElement).not.toBeInTheDocument();
        expect(
          document.querySelector('.quality-report-check-field') as HTMLElement
        ).not.toBeInTheDocument();
      });
    });

    describe('04_PrivacyField', () => {
      it('can set privacy correctly', async () => {
        await waitFor(() => {
          expect(fetchMock).toHaveBeenCalledWith('/data/privacy');
        });

        const container = await waitFor(() => {
          const el = document.querySelector('.data-protection-field');
          expect(el).toBeInTheDocument();
          return el as HTMLElement;
        });

        await waitFor(() => {
          expect(within(container).queryByText('general.loading_options')).not.toBeInTheDocument();
        });

        await testField('isoMetadata.privacy', {
          fieldset: container,
          fieldType: 'radio',
          radioOptionKey: 'TEST',
          help: true,
          testProgress: {
            section: 'classification',
            label: 'form.classification',
            expectIncrease: false // privacy is initially set
          }
        });
      });
    });

    describe('25_TermsOfUseField', () => {
      it('can set user requirements correctly', async () => {
        await waitFor(() => {
          expect(fetchMock).toHaveBeenCalledWith('/data/terms_of_use');
        });

        const fieldset = await waitFor(() => {
          const el = document.querySelector('.terms-of-use-field');
          expect(el).toBeInTheDocument();
          return el as HTMLElement;
        });

        await testField('isoMetadata.termsOfUseId', {
          fieldType: 'select',
          fieldset: fieldset,
          selectOptionValue: 2,
          help: true,
          testProgress: {
            section: 'classification',
            label: 'form.classification',
            expectIncrease: false // terms of use always has value
          }
        });
      });
    });

    describe('06_HighValueDatasetField', () => {
      it('can set hvd correctly', async () => {
        await waitFor(() => {
          expect(fetchMock).toHaveBeenCalledWith('/help/isoMetadata.highValueDataCategory');
        });

        const fieldset = await waitFor(() => {
          const el = document.querySelector('.high-value-dataset-check-field');
          expect(el).toBeInTheDocument();
          return el as HTMLElement;
        });

        await testField('isoMetadata.highValueDataset', {
          fieldset: fieldset,
          fieldType: 'switch',
          switchValue: true,
          help: false,
          testProgress: {
            section: 'classification',
            label: 'form.classification',
            expectIncrease: false // switch always has value
          }
        });
      });

      it('can set hvd category after selecting hvd', async () => {
        await waitFor(() => {
          expect(fetchMock).toHaveBeenCalledWith('/help/isoMetadata.highValueDataCategory');
        });

        const hvdField = await waitFor(() => {
          const el = document.querySelector('.high-value-dataset-check-field');
          expect(el).toBeInTheDocument();
          return el as HTMLElement;
        });

        const hvdSwitch = within(hvdField).getByRole('switch');

        await userEvent.click(hvdSwitch);
        await tick();
        await new Promise((r) => setTimeout(r, 0));

        await waitFor(() => {
          expect(fetchMock).toHaveBeenCalledWith('/data/hvd_categories');
        });

        const categoryField = await screen.findByRole('group', {
          name: '06_HighValueDatasetField.categoryLabel'
        });
        expect(categoryField).toBeVisible();

        await userEvent.click(categoryField);
        await tick();
        await new Promise((r) => setTimeout(r, 0));

        await userEvent.click(screen.getByText('Kategorie A'));
        await tick();
        await new Promise((r) => setTimeout(r, 0));

        await waitFor(() => {
          const patchCalls = fetchMock.mock.calls.filter(
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            ([_, init]) => init?.method === 'PATCH'
          );

          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const categoryPatch = patchCalls.find(([_, init]) =>
            (init!.body as string).includes('isoMetadata.highValueDataCategory')
          );

          expect(categoryPatch).toBeDefined();

          const body = JSON.parse((categoryPatch![1] as RequestInit).body as string);

          expect(body.key).toBe('isoMetadata.highValueDataCategory');
          expect(body.value).toEqual(expect.arrayContaining(['A']));
        });
      });
    });

    describe('13_TopicCategory', () => {
      if (role === 'MdeEditor' || role === 'MdeAdministrator' || role === 'MdeQualityAssurance') {
        it('can set topic correctly for iso themes with role MdeEditor, MdeAdministrator or MdeQualityAssurance', async () => {
          await waitFor(() => {
            expect(fetchMock).toHaveBeenCalledWith('/data/iso_themes');
          });

          const fieldset = await waitFor(() => {
            const el = document.querySelector('.topic-category-field');
            expect(el).toBeInTheDocument();
            return el as HTMLElement;
          });

          await waitFor(() => {
            expect(within(fieldset).queryByText('general.loading_options')).not.toBeInTheDocument();
          });

          await testField('isoMetadata.topicCategory', {
            fieldType: 'multiselect',
            fieldset: fieldset,
            multiSelectOptions: ['Land use'],
            help: true,
            testProgress: {
              section: 'classification',
              label: 'form.classification',
              expectIncrease: isRequiredField('isoMetadata.topicCategory', 'classification')
            }
          });
        });
      } else {
        it('does not show topic field with role MdeDataOwner', async () => {
          expect(fetchMock).not.toHaveBeenCalledWith('/data/iso_themes');
          expect(fetchMock).not.toHaveBeenCalledWith('/help/isoMetadata.topicCategory');
        });
      }
    });
  });

  describe('INSPIRE harmonised', () => {
    beforeEach(async () => {
      const metadata = structuredClone(metadata3);

      metadata.isoMetadata = {
        ...metadata.isoMetadata,
        metadataProfile: 'INSPIRE_HARMONISED'
      };

      render(FormHarness, {
        props: {
          metadata: metadata
        }
      });

      const contextTab = await screen.findByText('form.classification');

      fireEvent.click(contextTab);
      await tick();
      await new Promise((r) => setTimeout(r, 0));
    });

    describe('38_InspireAnnexVersion', () => {
      if (role === 'MdeEditor' || role === 'MdeAdministrator') {
        it('can set INSPIRE annex version with role MdeEditor or MdeAdministrator', async () => {
          const fieldset = await waitFor(() => {
            const el = document.querySelector('.inspire-annex-version-field');
            expect(el).toBeInTheDocument();
            return el as HTMLElement;
          });

          await testField('isoMetadata.inspireAnnexVersion', {
            fieldset: fieldset,
            fieldType: 'text',
            fieldInput: 'v2.0',
            help: true,
            testProgress: {
              section: 'classification',
              label: 'form.classification',
              expectIncrease: isRequiredField('isoMetadata.inspireAnnexVersion', 'classification')
            }
          });
        });
      } else {
        it('does not show inspire annex version field with role MdeDataOwner or MdeQualityAssurance', async () => {
          expect(fetchMock).not.toHaveBeenCalledWith('/help/isoMetadata.inspireAnnexVersion');

          const fieldset = document.querySelector('.inspire-annex-version-field') as HTMLElement;

          await waitFor(() => {
            expect(fieldset).not.toBeInTheDocument();
          });
        });
      }
    });

    describe('07_AnnexThemeField', () => {
      it('can set inspire themes correctly', async () => {
        await waitFor(() => {
          expect(fetchMock).toHaveBeenCalledWith('/data/inspire_themes');
        });

        const fieldset = await waitFor(() => {
          const el = document.querySelector('.annex-theme-field');
          expect(el).toBeInTheDocument();
          return el as HTMLElement;
        });

        await testField('isoMetadata.inspireTheme', {
          fieldType: 'select',
          fieldset: fieldset,
          selectOptionText: 'Addresses',
          selectOptionValue: '001',
          help: true,
          testProgress: {
            section: 'classification',
            label: 'form.classification',
            expectIncrease: isRequiredField('isoMetadata.inspireTheme', 'classification')
          }
        });
      });
    });

    describe('37_QualityReportCheckField', () => {
      if (role === 'MdeEditor' || role === 'MdeAdministrator' || role === 'MdeQualityAssurance') {
        it('can set quality report check correctly with role MdeEditor, MdeQualityAssurance or MdeAdministrator', async () => {
          const fieldset = await waitFor(() => {
            const el = document.querySelector('.quality-report-check-field');
            expect(el).toBeInTheDocument();
            return el as HTMLElement;
          });

          await testField('isoMetadata.valid', {
            fieldset: fieldset,
            fieldType: 'switch',
            switchValue: true,
            help: true,
            testProgress: {
              section: 'classification',
              label: 'form.classification',
              expectIncrease: false
            }
          });
        });
      } else {
        it('can not set quality report check with role MdeDataOwner', async () => {
          expect(fetchMock).not.toHaveBeenCalledWith('/help/isoMetadata.valid');

          const fieldset = document.querySelector('.quality-report-check-field') as HTMLElement;

          await waitFor(() => {
            expect(fieldset).not.toBeInTheDocument();
          });
        });
      }
    });
  });
}
