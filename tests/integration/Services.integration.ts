import { render, screen, fireEvent, waitFor, cleanup, within } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';

import { describe, it, expect, beforeEach } from 'vitest';

import { fetchMock, setMockMetadataId, setMockRoles } from '../setup';
import metadata3 from '../fixtures/metadata3';
import FormHarness from '../helpers/FormHarness.svelte';
import { isRequiredField, testField } from '../helpers/TestFieldHelpers';
import { testLayersForm } from './Layers.integration';

export async function testServices(role: string) {
  describe('Dienste', () => {
    beforeEach(async () => {
      cleanup();
      setMockMetadataId('a723e625-815c-4553-93bf-2fb62bb623d4');
      setMockRoles([role]);

      render(FormHarness, {
        props: {
          metadata: structuredClone(metadata3)
        }
      });

      const servicesTab = screen.queryByText('form.services') as HTMLElement;
      expect(servicesTab).toBeInTheDocument();
      fireEvent.click(servicesTab);
    });

    describe('40_ServiceForm', () => {
      beforeEach(async () => {
        const addButton = screen.getByTitle('servicessection.add_button');
        await userEvent.click(addButton);
      });
      it('can add a service', async () => {
        const tab = screen.getByTitle('servicessection.add_button');
        expect(tab).toBeVisible();
      });

      describe('58_ServiceType', () => {
        it('can set service type correctly', async () => {
          const fieldset = document.querySelector('.service-type-field') as HTMLElement;

          waitFor(() => {
            expect(fieldset).toBeInTheDocument();
            expect(within(fieldset).getByText('📥 58_ServiceType.atom')).toBeInTheDocument();
            expect(within(fieldset).getByText('📥 58_ServiceType.wfs')).toBeInTheDocument();
            expect(within(fieldset).getByText('🌎 58_ServiceType.wms')).toBeInTheDocument();
            expect(within(fieldset).getByText('🌎 58_ServiceType.wmts')).toBeInTheDocument();
          });

          await testField('isoMetadata.services', {
            fieldType: 'select',
            fieldset: fieldset,
            selectOptionText: '📥 58_ServiceType.atom',
            selectOptionValue: 'ATOM',
            help: false
          });
        });

        it('switching to WFS toggles subforms', async () => {
          const fieldset = document.querySelector('.service-type-field') as HTMLElement;
          expect(
            document.querySelector('.featuretypes-form') as HTMLElement
          ).not.toBeInTheDocument();

          const previousCallCount = fetchMock.mock.calls.length;

          await userEvent.click(fieldset!);
          await userEvent.click(screen.getByText('📥 58_ServiceType.wfs'));

          await waitFor(() => {
            expect(fetchMock.mock.calls.length).toBeGreaterThan(previousCallCount);
          });

          await waitFor(() => {
            expect(document.querySelector('.featuretypes-form') as HTMLElement).toBeVisible();
          });
        });

        it('switching to WMS toggles subforms', async () => {
          const fieldset = document.querySelector('.service-type-field') as HTMLElement;
          expect(document.querySelector('.layers-form') as HTMLElement).not.toBeInTheDocument();
          expect(document.querySelector('.legend-fieldset') as HTMLElement).not.toBeInTheDocument();

          const previousCallCount = fetchMock.mock.calls.length;

          await userEvent.click(fieldset!);
          await userEvent.click(screen.getByText('🌎 58_ServiceType.wms'));

          await waitFor(() => {
            expect(fetchMock.mock.calls.length).toBeGreaterThan(previousCallCount);
          });

          await waitFor(() => {
            expect(document.querySelector('.layers-form') as HTMLElement).toBeVisible();
            expect(document.querySelector('.legend-fieldset') as HTMLElement).toBeVisible();
          });
        });
      });

      describe('59_ServiceTitle', () => {
        it('can set service title correctly', async () => {
          const fieldset = document.querySelector('.service-title-field') as HTMLElement;

          waitFor(() => {
            expect(fieldset).toBeInTheDocument();
          });

          await testField('isoMetadata.services.title', {
            fieldset: fieldset,
            fieldType: 'text',
            fieldInput: 'New Service',
            help: true,
            testProgress: {
              section: 'services',
              label: 'form.services',
              expectIncrease: false
            }
          });
        });
      });

      describe('60_ServiceShortDescription', () => {
        it('can set service description correctly', async () => {
          const fieldset = document.querySelector('.service-description-field') as HTMLElement;

          waitFor(() => {
            expect(fieldset).toBeInTheDocument();
          });

          await testField('isoMetadata.services.shortDescription', {
            fieldset: fieldset,
            fieldType: 'text',
            fieldInput: 'New Service Description...',
            requiredMessage: 'Bitte geben Sie eine kurze Beschreibung für den Service an.',
            help: true,
            testProgress: {
              section: 'services',
              label: 'form.services',
              expectIncrease: isRequiredField('isoMetadata.services.shortDescription', 'services')
            }
          });
        });
      });

      describe('45_ServiceWorkspace', () => {
        if (role === 'MdeEditor' || role === 'MdeAdministrator') {
          it('can set service workspace correctly with role MdeEditor or MdeAdministrator', async () => {
            const fieldset = document.querySelector('.service-id-field') as HTMLElement;

            waitFor(() => {
              expect(fieldset).toBeInTheDocument();
            });

            await testField('isoMetadata.services.workspace', {
              fieldset: fieldset,
              fieldType: 'text',
              fieldInput: 'NewValidServiceWorkspace',
              requiredMessage:
                'Bitte geben Sie einen gültigen Workspace an. Nur Buchstaben, Zahlen und Unterstriche sind erlaubt.',
              help: true,
              testProgress: {
                section: 'services',
                label: 'form.services',
                expectIncrease: isRequiredField('isoMetadata.services.workspace', 'services')
              }
            });
          });
        } else {
          it('can not set service workspace with role MdeDataOwner or MdeQualityAssurance', async () => {
            expect(fetchMock).not.toHaveBeenCalledWith('/help/isoMetadata.services.workspace');

            const fieldset = document.querySelector('.service-id-field') as HTMLElement;

            waitFor(() => {
              expect(fieldset).not.toBeInTheDocument();
            });
          });
        }
      });

      describe('46_ServicePreview', () => {
        it('can set service preview correctly', async () => {
          const fieldset = document.querySelector('.service-preview-field') as HTMLElement;

          waitFor(() => {
            expect(fieldset).toBeInTheDocument();
          });

          await testField('isoMetadata.services.preview', {
            fieldset: fieldset,
            fieldType: 'text',
            fieldInput: 'https://gdi.berlin.de/data/example.json',
            help: true,
            testProgress: {
              section: 'services',
              label: 'form.services',
              expectIncrease: false
            }
          });
        });
      });

      describe('56_FeatureTypeForm', () => {
        beforeEach(async () => {
          const fieldset = document.querySelector('.service-type-field') as HTMLElement;

          await userEvent.click(fieldset!);
          await userEvent.click(screen.getByText('📥 58_ServiceType.wfs'));

          await waitFor(() => {
            expect(document.querySelector('.featuretypes-form') as HTMLElement).toBeVisible();
          });

          const container = document.querySelector('.featuretypes-form') as HTMLElement;
          const fieldsets = within(container).getAllByRole('group');
          expect(fieldsets).toHaveLength(1);

          await userEvent.click(within(container).getByText('add'));
        });

        it('can add feature type', async () => {
          await waitFor(async () => {
            expect(
              document.querySelector('.featuretype-title-field') as HTMLElement
            ).toBeInTheDocument();
            expect(
              document.querySelector('.featuretype-short-description-field') as HTMLElement
            ).toBeInTheDocument();
            expect(document.querySelector('.columns-form') as HTMLElement).toBeInTheDocument();
          });
        });

        describe('61_FeatureTypeTitle', () => {
          it('can set feature type title correctly', async () => {
            const fieldset = document.querySelector('.featuretype-title-field') as HTMLElement;

            waitFor(() => {
              expect(fieldset).toBeInTheDocument();
            });

            await testField('isoMetadata.services.featureTypes.title', {
              fieldset: fieldset,
              fieldType: 'text',
              fieldInput: 'New FeatureType Title',
              help: true,
              testProgress: {
                section: 'services',
                label: 'form.services',
                expectIncrease: false
              }
            });
          });
        });

        describe('62_FeatureTypeName', () => {
          if (role === 'MdeEditor' || role === 'MdeAdministrator') {
            it('can set feature type name correctly with role MdeEditor or MdeAdministrator', async () => {
              const fieldset = document.querySelector('.featuretype-name-field') as HTMLElement;

              waitFor(() => {
                expect(fieldset).toBeInTheDocument();
              });

              await testField('isoMetadata.services.featureTypes.name', {
                fieldset: fieldset,
                fieldType: 'text',
                fieldInput: 'New FeatureType Name',
                help: true,
                testProgress: {
                  section: 'services',
                  label: 'form.services',
                  expectIncrease: false
                }
              });
            });
          } else {
            it('can not set feature type name with role MdeDataOwner or MdeQualityAssurance', async () => {
              expect(fetchMock).not.toHaveBeenCalledWith(
                '/help/isoMetadata.services.featureTypes.name'
              );

              const fieldset = document.querySelector('.featuretype-name-field') as HTMLElement;

              waitFor(() => {
                expect(fieldset).not.toBeInTheDocument();
              });
            });
          }
        });

        describe('69_FeatureTypeDescription', () => {
          it('can set feature type description correctly', async () => {
            const fieldset = document.querySelector(
              '.featuretype-short-description-field'
            ) as HTMLElement;

            waitFor(() => {
              expect(fieldset).toBeInTheDocument();
            });

            await testField('isoMetadata.services.featureTypes.shortDescription', {
              fieldset: fieldset,
              fieldType: 'text',
              fieldInput: 'New featureType Description...',
              requiredMessage: 'Bitte geben Sie eine Kurzbeschreibung für den FeatureType an.',
              help: true,
              testProgress: {
                section: 'services',
                label: 'form.services',
                expectIncrease: isRequiredField(
                  'isoMetadata.services.featureTypes.shortDescription',
                  'services'
                )
              }
            });
          });
        });

        describe('63_ColumnsForm', () => {
          beforeEach(async () => {
            await waitFor(() => {
              expect(document.querySelector('.featuretypes-form') as HTMLElement).toBeVisible();
            });

            const container = document.querySelector('.columns-form') as HTMLElement;
            const fieldsets = within(container).getAllByRole('group');
            expect(fieldsets).toHaveLength(1);

            await userEvent.click(within(container).getByText('add'));
          });

          describe('64_AttributeName', () => {
            it('can set attribute name correctly', async () => {
              const fieldset = document.querySelector('.attribute-name-field') as HTMLElement;

              waitFor(() => {
                expect(fieldset).toBeInTheDocument();
              });

              await testField('isoMetadata.services.featureTypes.columns.name', {
                fieldset: fieldset,
                fieldType: 'text',
                fieldInput: 'New FeatureType Name',
                help: true,
                testProgress: {
                  section: 'services',
                  label: 'form.services',
                  expectIncrease: false
                }
              });
            });
          });

          describe('65_AttributeAlias', () => {
            it('can set attribute alias correctly', async () => {
              const fieldset = document.querySelector('.attribute-alias-field') as HTMLElement;

              waitFor(() => {
                expect(fieldset).toBeInTheDocument();
              });

              await testField('isoMetadata.services.featureTypes.columns.alias', {
                fieldset: fieldset,
                fieldType: 'text',
                fieldInput: 'New FeatureType Alias',
                help: true,
                testProgress: {
                  section: 'services',
                  label: 'form.services',
                  expectIncrease: false
                }
              });
            });
          });

          describe('66_AttributeDatatype', () => {
            if (role === 'MdeEditor' || role === 'MdeAdministrator') {
              it('can set attribute datatype correctly with role MdeEditor or MdeAdministrator', async () => {
                const fieldset = document.querySelector('.attribute-type-field') as HTMLElement;
                waitFor(() => {
                  expect(fieldset).toBeInTheDocument();
                  expect(within(fieldset).getByText('BigDecimal')).toBeInTheDocument();
                  expect(within(fieldset).getByText('Boolean')).toBeInTheDocument();
                  expect(within(fieldset).getByText('Date')).toBeInTheDocument();
                  expect(within(fieldset).getByText('Double')).toBeInTheDocument();
                  expect(within(fieldset).getByText('Float')).toBeInTheDocument();
                  expect(within(fieldset).getByText('Geometry')).toBeInTheDocument();
                  expect(within(fieldset).getByText('Integer')).toBeInTheDocument();
                  expect(within(fieldset).getByText('Link')).toBeInTheDocument();
                  expect(within(fieldset).getByText('Long')).toBeInTheDocument();
                  expect(within(fieldset).getByText('Short')).toBeInTheDocument();
                  expect(within(fieldset).getByText('Text')).toBeInTheDocument();
                  expect(within(fieldset).getByText('Timestamp')).toBeInTheDocument();
                });

                await testField('isoMetadata.services.featureTypes.columns.type', {
                  fieldType: 'select',
                  selectOptionText: 'Date',
                  selectOptionValue: 'Date',
                  fieldset: fieldset,
                  help: false,
                  testProgress: {
                    section: 'services',
                    label: 'form.services',
                    expectIncrease: false
                  }
                });
              });
            } else {
              it('can not set attribute datatype with role MdeDataOwner or MdeQualityAssurance', async () => {
                expect(fetchMock).not.toHaveBeenCalledWith(
                  '/help/isoMetadata.services.featureTypes.columns.type'
                );

                const fieldset = document.querySelector('.attribute-type-field') as HTMLElement;

                waitFor(() => {
                  expect(fieldset).not.toBeInTheDocument();
                });
              });
            }
          });
        });
      });

      describe('47_ServiceLegendImage', () => {
        beforeEach(async () => {
          render(FormHarness, {
            props: {
              metadata: structuredClone(metadata3)
            }
          });

          const fieldset = document.querySelector('.service-type-field') as HTMLElement;

          await userEvent.click(fieldset!);
          await userEvent.click(screen.getByText('🌎 58_ServiceType.wms'));

          await waitFor(() => {
            expect(document.querySelector('.legend-fieldset') as HTMLElement).toBeVisible();
          });
        });

        it('can set legend url correctly', async () => {
          const fieldset = document.querySelectorAll(
            '.legend-text-fields .field-wrapper'
          )[0] as HTMLElement;

          waitFor(() => {
            expect(fieldset).toBeInTheDocument();
          });

          await testField('isoMetadata.services.legendImage', {
            fieldset: fieldset,
            fieldType: 'text',
            fieldInput: 'https://gdi.berlin.de/data/example.png',
            help: true,
            testProgress: {
              section: 'services',
              label: 'form.services',
              expectIncrease: isRequiredField('isoMetadata.services.legendImage', 'services')
            }
          });
        });

        it('can set legend format correctly', async () => {
          const fieldset = document.querySelectorAll(
            '.legend-text-fields .field-wrapper'
          )[1] as HTMLElement;

          waitFor(() => {
            expect(fieldset).toBeInTheDocument();
          });

          await testField('isoMetadata.services.legendImage', {
            fieldset: fieldset,
            fieldType: 'text',
            fieldInput: 'png',
            help: true,
            testProgress: {
              section: 'services',
              label: 'form.services',
              expectIncrease: isRequiredField('isoMetadata.services.legendImage', 'services')
            }
          });
        });

        it('can set legend width correctly', async () => {
          const fieldset = document.querySelector('.legend-size-fields') as HTMLElement;

          waitFor(() => {
            expect(fieldset).toBeInTheDocument();
          });

          await testField('isoMetadata.services.legendImage', {
            fieldset: fieldset.querySelectorAll('.field-wrapper')[0] as HTMLElement,
            fieldType: 'number',
            fieldInput: '1',
            help: true,
            testProgress: {
              section: 'services',
              label: 'form.services',
              expectIncrease: isRequiredField('isoMetadata.services.legendImage.width', 'services')
            }
          });
        });

        it('can set legend height correctly', async () => {
          const fieldset = document.querySelector('.legend-size-fields') as HTMLElement;

          waitFor(() => {
            expect(fieldset).toBeInTheDocument();
          });

          await testField('isoMetadata.services.legendImage', {
            fieldset: fieldset.querySelectorAll('.field-wrapper')[1] as HTMLElement,
            fieldType: 'number',
            fieldInput: '2',
            help: true,
            testProgress: {
              section: 'services',
              label: 'form.services',
              expectIncrease: isRequiredField('isoMetadata.services.legendImage.height', 'services')
            }
          });
        });
      });
    });
    testLayersForm(role);
  });
}
