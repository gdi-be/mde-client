import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/svelte';
import ReadonlyHarness from '../helpers/ReadonlyHarness.svelte';
import { setMockRoles, setMockUserId, fetchMock, resetTestMetadata } from '../setup';
import metadata1 from '../fixtures/metadata1';

const TEST_USER_ID = 'test-user-id';

const metadataInspireHarmonised = {
  ...metadata1,
  isoMetadata: {
    ...metadata1.isoMetadata,
    metadataProfile: 'INSPIRE_HARMONISED',
    inspireTheme: ['001'],
    inspireFormatName: 'My format',
    inspireAnnexVersion: '1.0',
    valid: true
  }
};

const metadataInspireIdentified = {
  ...metadata1,
  isoMetadata: {
    ...metadata1.isoMetadata,
    metadataProfile: 'INSPIRE_IDENTIFIED',
    inspireTheme: ['002']
  }
};

const metadataHighValueDataset = {
  ...metadata1,
  isoMetadata: {
    ...metadata1.isoMetadata,
    highValueDataset: true,
    highValueDataCategory: ['A', 'B']
  }
};

const metadataWithComments = {
  ...metadata1,
  clientMetadata: {
    ...metadata1.clientMetadata,
    comments: [
      { id: 'c1', date: '2025-01-15T10:00:00Z', userName: 'Test User1', text: 'Testkommentar.' },
      {
        id: 'c2',
        date: '2025-01-16T14:30:00Z',
        userName: 'Test User2',
        text: 'Noch ein Kommentar.'
      }
    ]
  }
};

const metadataWithServices = {
  ...metadata1,
  isoMetadata: {
    ...metadata1.isoMetadata,
    services: [
      {
        serviceType: 'WMS',
        title: 'WMS Service',
        shortDescription: 'WMS Beschreibung',
        workspace: 'ws',
        serviceIdentification: 'wms-id',
        fileIdentifier: 'fid-1',
        legendImage: {
          url: 'https://example.com/legend.png',
          format: 'image/png',
          width: 200,
          height: 100
        },
        featureTypes: []
      },
      {
        serviceType: 'WFS',
        title: 'WFS Service',
        shortDescription: 'WFS Beschreibung',
        workspace: 'ws',
        serviceIdentification: 'wfs-id',
        fileIdentifier: 'fid-2',
        featureTypes: [
          {
            name: 'my_feature',
            title: 'Feature Type',
            shortDescription: 'FT Beschreibung',
            columns: [
              { name: 'fid', alias: 'Feature ID', type: 'integer' },
              { name: 'geom', alias: 'Geometrie', type: 'geometry' }
            ]
          }
        ]
      }
    ]
  },
  clientMetadata: {
    ...metadata1.clientMetadata,
    layers: {
      'wms-id': [
        {
          title: 'Layer1',
          name: 'layer_one',
          styleTitle: 'Default',
          styleName: 'default',
          shortDescription: 'Layer Beschreibung',
          datasource: 'ds',
          secondaryDatasource: null
        }
      ]
    }
  }
};

function testFieldVisibility(
  role: string,
  fieldLabel: string,
  fieldValue: string | undefined,
  sectionId: string,
  shouldBeVisible: boolean
) {
  if (shouldBeVisible) {
    it(`renders ${fieldLabel} from metadata for role ${role}`, async () => {
      setMockRoles([role]);
      const { unmount } = render(ReadonlyHarness, {
        props: {
          metadata: {
            ...metadata1,
            assignedUserId: TEST_USER_ID,
            responsibleRole: role
          }
        }
      });
      render(ReadonlyHarness, { props: { metadata: metadata1 } });

      const section = document.querySelector(sectionId) as HTMLElement;
      await waitFor(() => {
        expect(section).toBeInTheDocument();
      });

      const identifierLabel = within(section).getAllByText(fieldLabel)[0];

      await waitFor(() => {
        expect(identifierLabel).toBeInTheDocument();
      });

      const displayField = identifierLabel.closest('.display-field');

      if (fieldValue) {
        await waitFor(() => {
          expect(within(displayField as HTMLElement).getByText(fieldValue)).toBeInTheDocument();
        });
      }
      unmount();
    });
  } else {
    it(`does not render ${fieldLabel} from metadata for role ${role}`, async () => {
      setMockRoles([role]);
      const { unmount } = render(ReadonlyHarness, {
        props: {
          metadata: {
            ...metadata1,
            assignedUserId: TEST_USER_ID,
            responsibleRole: role
          }
        }
      });
      await waitFor(() => {
        expect(screen.queryByText(fieldLabel)).not.toBeInTheDocument();
      });
      unmount();
    });
  }
}

describe('MetadataDisplay - Integration test', () => {
  beforeEach(() => {
    resetTestMetadata(metadata1);
    setMockUserId(TEST_USER_ID);
  });

  describe('Section structure', () => {
    it('renders all sections', async () => {
      render(ReadonlyHarness, { props: { metadata: metadata1 } });
      await waitFor(() => {
        expect(
          screen.getByRole('heading', { level: 2, name: 'metadatadisplay.sectionBase' })
        ).toBeInTheDocument();
        expect(
          screen.getByRole('heading', { level: 2, name: 'metadatadisplay.sectionClassification' })
        ).toBeInTheDocument();
        expect(
          screen.getByRole('heading', { level: 2, name: 'metadatadisplay.sectionTemporalSpatial' })
        ).toBeInTheDocument();
        expect(
          screen.getByRole('heading', { level: 2, name: 'metadatadisplay.sectionAdditional' })
        ).toBeInTheDocument();
        expect(
          screen.getByRole('heading', { level: 2, name: 'metadatadisplay.sectionServices' })
        ).toBeInTheDocument();
        expect(
          screen.getByRole('heading', { level: 2, name: 'metadatadisplay.sectionComments' })
        ).toBeInTheDocument();
      });
    });

    it('renders title, identifier, and fileIdentifier from metadata', async () => {
      render(ReadonlyHarness, { props: { metadata: metadata1 } });

      await waitFor(() => {
        expect(screen.getAllByText('123 Datentest')).toHaveLength(2);
      });

      await waitFor(() => {
        const identifierLabel = screen.getByText('displayfieldsnippets.identifier');
        const displayField = identifierLabel.closest('.display-field');
        expect(
          within(displayField as HTMLElement).getByText('a723e625-815c-4553-93bf-2fb62bb623d4')
        ).toBeInTheDocument();
      });

      await waitFor(() => {
        const identifierLabel = screen.getAllByText('displayfieldsnippets.fileIdentifier');
        expect(identifierLabel).toHaveLength(4);
        const displayField = identifierLabel[0].closest('.display-field');
        expect(
          within(displayField as HTMLElement).getByText('displayfield.noValue')
        ).toBeInTheDocument();
      });
    });
  });

  describe('Contacts', () => {
    it('displays contact details', async () => {
      render(ReadonlyHarness, { props: { metadata: metadata1 } });
      await waitFor(() => {
        expect(screen.getByText('Peter Klose')).toBeInTheDocument();
        expect(screen.getByText('terrestris GmbH & Co Kg')).toBeInTheDocument();
        expect(screen.getByText('123123123')).toBeInTheDocument();
        expect(screen.getByText('klose@wefewf.de')).toBeInTheDocument();
      });
    });

    it('shows noValue for empty contacts', async () => {
      const m = { ...metadata1, isoMetadata: { ...metadata1.isoMetadata, pointsOfContact: [] } };
      render(ReadonlyHarness, { props: { metadata: m } });
      await waitFor(() => {
        expect(screen.queryByText('Peter Klose')).not.toBeInTheDocument();
      });
    });
  });

  describe('INSPIRE conditional fields', () => {
    it('shows all INSPIRE fields for INSPIRE_HARMONISED', async () => {
      render(ReadonlyHarness, { props: { metadata: metadataInspireHarmonised } });
      const section = document.querySelector('#classification') as HTMLElement;
      await waitFor(() => {
        expect(section).toBeInTheDocument();
      });

      await waitFor(() => {
        const identifierLabel = screen.getByText('05_MetadataProfileField.label');
        const displayField = identifierLabel.closest('.display-field');
        expect(
          within(displayField as HTMLElement).getByText('INSPIRE harmonisiert')
        ).toBeInTheDocument();
      });

      await waitFor(() => {
        const identifierLabel = screen.getByText('38_InspireAnnexVersionField.label');
        const displayField = identifierLabel.closest('.display-field');
        expect(within(displayField as HTMLElement).getByText('1.0')).toBeInTheDocument();
      });

      await waitFor(() => {
        const identifierLabel = screen.getByText('37_QualityReportCheckField.label');
        const displayField = identifierLabel.closest('.display-field');
        expect(within(displayField as HTMLElement).getByText('general.yes')).toBeInTheDocument();
      });

      await waitFor(() => {
        const identifierLabel = screen.getByText('70_InspireFormatName.label');
        const displayField = identifierLabel.closest('.display-field');
        expect(within(displayField as HTMLElement).getByText('My format')).toBeInTheDocument();
      });

      await waitFor(() => {
        const identifierLabel = screen.getByText('07_AnnexThemeField.label');
        const displayField = identifierLabel.closest('.display-field');
        expect(within(displayField as HTMLElement).getByText('Addresses')).toBeInTheDocument();
      });
    });

    it('only shows inspireTheme for INSPIRE_IDENTIFIED', async () => {
      render(ReadonlyHarness, { props: { metadata: metadataInspireIdentified } });
      await waitFor(() => {
        expect(screen.getByText('07_AnnexThemeField.label')).toBeInTheDocument();
        expect(screen.getByText('Administrative units')).toBeInTheDocument();
        expect(screen.queryByText('38_InspireAnnexVersionField.label')).not.toBeInTheDocument();
        expect(screen.queryByText('37_QualityReportCheckField.label')).not.toBeInTheDocument();
        expect(screen.queryByText('70_InspireFormatName.label')).not.toBeInTheDocument();
      });
    });

    it('shows no INSPIRE fields for ISO profile', async () => {
      const m = { ...metadata1, isoMetadata: { ...metadata1.isoMetadata, metadataProfile: 'ISO' } };
      render(ReadonlyHarness, { props: { metadata: m } });
      await waitFor(() => {
        expect(screen.queryByText('07_AnnexThemeField.label')).not.toBeInTheDocument();
        expect(screen.queryByText('38_InspireAnnexVersionField.label')).not.toBeInTheDocument();
        expect(screen.queryByText('37_QualityReportCheckField.label')).not.toBeInTheDocument();
        expect(screen.queryByText('70_InspireFormatName.label')).not.toBeInTheDocument();
      });
    });
  });

  describe('High Value Dataset conditional fields', () => {
    it('shows HVD categories when highValueDataset is true', async () => {
      render(ReadonlyHarness, { props: { metadata: metadataHighValueDataset } });
      const section = document.querySelector('#classification') as HTMLElement;
      await waitFor(() => {
        expect(section).toBeInTheDocument();
      });

      await waitFor(() => {
        const identifierLabel = screen.getByText('06_HighValueDatasetField.label');
        const displayField = identifierLabel.closest('.display-field');
        expect(within(displayField as HTMLElement).getByText('Ja')).toBeInTheDocument();
      });

      await waitFor(() => {
        const identifierLabel = screen.getByText('06_HighValueDatasetField.categoryLabel');
        const displayField = identifierLabel.closest('.display-field');
        expect(
          within(displayField as HTMLElement).getByText('Kategorie A, Kategorie B')
        ).toBeInTheDocument();
      });
    });

    it('does NOT show HVD categories when highValueDataset is false', async () => {
      const m = {
        ...metadata1,
        isoMetadata: { ...metadata1.isoMetadata, highValueDataset: false }
      };
      render(ReadonlyHarness, { props: { metadata: m } });
      const section = document.querySelector('#classification') as HTMLElement;
      await waitFor(() => {
        expect(section).toBeInTheDocument();
      });

      await waitFor(() => {
        const identifierLabel = screen.getByText('06_HighValueDatasetField.label');
        const displayField = identifierLabel.closest('.display-field');
        expect(
          within(displayField as HTMLElement).getByText('displayfield.noValue')
        ).toBeInTheDocument();
        expect(
          screen.queryByText('06_HighValueDatasetField.categoryLabel')
        ).not.toBeInTheDocument();
      });
    });
  });

  describe('Async field resolution', () => {
    it('should resolve privacy label', async () => {
      render(ReadonlyHarness, { props: { metadata: metadata1 } });

      await waitFor(() => expect(screen.getByText('Keine Einschränkung')).toBeInTheDocument());
    });

    it('shows loading text while fetching', async () => {
      fetchMock.mockImplementation(() => new Promise(() => {}));
      render(ReadonlyHarness, { props: { metadata: metadata1 } });
      expect(screen.queryAllByText(/lädt/i).length).toBeGreaterThan(0);
      vi.resetAllMocks();
    });
  });

  describe('Date formatting', () => {
    it('formats created date as locale string', async () => {
      const m = {
        ...metadata1,
        isoMetadata: { ...metadata1.isoMetadata, created: '2024-03-15T00:00:00Z' }
      };
      render(ReadonlyHarness, { props: { metadata: m } });
      await waitFor(() => {
        expect(
          screen.getByText(new Date('2024-03-15T00:00:00Z').toLocaleDateString())
        ).toBeInTheDocument();
      });
    });

    it('formats published date as locale string', async () => {
      const m = {
        ...metadata1,
        isoMetadata: { ...metadata1.isoMetadata, published: '2024-06-01T00:00:00Z' }
      };
      render(ReadonlyHarness, { props: { metadata: m } });
      await waitFor(() => {
        expect(
          screen.getByText(new Date('2024-06-01T00:00:00Z').toLocaleDateString())
        ).toBeInTheDocument();
      });
    });
  });

  describe('Extent display', () => {
    it('formats extent as coordinate string', async () => {
      const m = {
        ...metadata1,
        isoMetadata: { ...metadata1.isoMetadata, extent: { minx: 6, miny: 47, maxx: 15, maxy: 55 } }
      };
      render(ReadonlyHarness, { props: { metadata: m } });
      await waitFor(() => {
        expect(screen.getByText('6, 47, 15, 55 (EPSG:4326)')).toBeInTheDocument();
      });
    });
  });

  describe('CommentsDisplay', () => {
    it('renders all comments with author, date and text', async () => {
      render(ReadonlyHarness, { props: { metadata: metadataWithComments } });
      await waitFor(() => {
        expect(screen.getByText('Test User1')).toBeInTheDocument();
        expect(screen.getByText('Testkommentar.')).toBeInTheDocument();
        expect(screen.getByText('Test User2')).toBeInTheDocument();
        expect(screen.getByText('Noch ein Kommentar.')).toBeInTheDocument();
      });
    });

    it('renders correct number of comment items', async () => {
      render(ReadonlyHarness, { props: { metadata: metadataWithComments } });
      await waitFor(() => {
        const items = document.querySelectorAll('li.comment');
        expect(items).toHaveLength(2);
      });
    });

    it('should show no-comments message for empty list', async () => {
      const m = { ...metadata1, clientMetadata: { ...metadata1.clientMetadata, comments: [] } };
      render(ReadonlyHarness, { props: { metadata: m } });
      const section = document.querySelector('#comments') as HTMLElement;
      await waitFor(() => {
        expect(section).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(within(section).getByText('commentsdisplay.noComments')).toBeInTheDocument();
      });
    });
  });

  describe('Services display', () => {
    it('displays service count and all service titles', async () => {
      render(ReadonlyHarness, { props: { metadata: metadataWithServices } });
      await waitFor(() => {
        expect(screen.getByText('Anzahl: 2')).toBeInTheDocument();
        expect(screen.getByText('WMS Service')).toBeInTheDocument();
        expect(screen.getByText('WFS Service')).toBeInTheDocument();
      });
    });

    it('shows legend image fields for WMS service', async () => {
      render(ReadonlyHarness, { props: { metadata: metadataWithServices } });
      await waitFor(() => {
        expect(screen.getByText('image/png')).toBeInTheDocument();
        expect(screen.getByText('200')).toBeInTheDocument();
        expect(screen.getByText('100')).toBeInTheDocument();
      });
    });

    it('shows feature types for WFS service', async () => {
      render(ReadonlyHarness, { props: { metadata: metadataWithServices } });
      await waitFor(() => {
        expect(screen.getByText('my_feature')).toBeInTheDocument();
        expect(screen.getByText('Feature Type')).toBeInTheDocument();
      });
    });

    it('shows attribute columns for WFS feature types', async () => {
      render(ReadonlyHarness, { props: { metadata: metadataWithServices } });
      await waitFor(() => {
        expect(screen.getByText('fid')).toBeInTheDocument();
        expect(screen.getByText('Feature ID')).toBeInTheDocument();
        expect(screen.getByText('integer')).toBeInTheDocument();
      });
    });

    it('shows layers for WMS service', async () => {
      render(ReadonlyHarness, { props: { metadata: metadataWithServices } });
      await waitFor(() => {
        expect(screen.getByText('Layer1')).toBeInTheDocument();
        expect(screen.getByText('layer_one')).toBeInTheDocument();
        expect(screen.getByText('Default')).toBeInTheDocument();
      });
    });

    it('shows noValue for empty services list', async () => {
      const m = { ...metadata1, isoMetadata: { ...metadata1.isoMetadata, services: [] } };
      render(ReadonlyHarness, { props: { metadata: m } });
      const servicesSection = document.querySelector('#services');
      await waitFor(() => {
        expect(
          within(servicesSection as HTMLElement).getByText('displayfield.noValue')
        ).toBeInTheDocument();
        expect(
          within(servicesSection as HTMLElement).queryByText('49_LayerTitle.label')
        ).not.toBeInTheDocument();
      });
    });
  });

  describe('Role-based visibility', () => {
    const roles = ['MdeDataOwner', 'MdeEditor', 'MdeQualityAssurance', 'MdeAdministrator'];

    it('should show all sections for every role', async () => {
      for (const role of roles) {
        setMockRoles([role]);
        const { unmount } = render(ReadonlyHarness, { props: { metadata: metadata1 } });

        await waitFor(() => {
          expect(
            screen.getByRole('heading', { level: 2, name: 'metadatadisplay.sectionBase' })
          ).toBeInTheDocument();
          expect(
            screen.getByRole('heading', { level: 2, name: 'metadatadisplay.sectionClassification' })
          ).toBeInTheDocument();
          expect(
            screen.getByRole('heading', {
              level: 2,
              name: 'metadatadisplay.sectionTemporalSpatial'
            })
          ).toBeInTheDocument();
          expect(
            screen.getByRole('heading', { level: 2, name: 'metadatadisplay.sectionAdditional' })
          ).toBeInTheDocument();
          expect(
            screen.getByRole('heading', { level: 2, name: 'metadatadisplay.sectionServices' })
          ).toBeInTheDocument();
          expect(
            screen.getByRole('heading', { level: 2, name: 'metadatadisplay.sectionComments' })
          ).toBeInTheDocument();
        });

        unmount();
      }
    });

    for (const role of roles) {
      testFieldVisibility(role, '01_TitleField.label', '123 Datentest', '#basedata', true);
      testFieldVisibility(
        role,
        '02_DescriptionField.label',
        'wergwergergergergergrge',
        '#basedata',
        true
      );
      testFieldVisibility(
        role,
        '04_PrivacyField.label',
        'Keine Einschränkung',
        '#classification',
        true
      );
      testFieldVisibility(
        role,
        '05_MetadataProfileField.label',
        'INSPIRE harmonisiert',
        '#classification',
        true
      );
      testFieldVisibility(
        role,
        '06_HighValueDatasetField.label',
        'displayfield.noValue',
        '#classification',
        true
      );
      testFieldVisibility(role, '07_AnnexThemeField.label', 'Addresses', '#classification', true);
      testFieldVisibility(role, '09_CreatedField.label', '05/06/2025', '#temp_and_spatial', true);
      testFieldVisibility(role, '10_PublishedField.label', '21/06/2025', '#temp_and_spatial', true);
      testFieldVisibility(
        role,
        '11_LastUpdatedField.label',
        '21/06/2024',
        '#temp_and_spatial',
        true
      );
      testFieldVisibility(
        role,
        '12_ValidityRangeField.label_from',
        '08/06/2025',
        '#temp_and_spatial',
        true
      );
      testFieldVisibility(
        role,
        '12_ValidityRangeField.label_to',
        '11/06/2025',
        '#temp_and_spatial',
        true
      );
      testFieldVisibility(
        role,
        '13_TopicCategory.label',
        'displayfield.noValue',
        '#classification',
        true
      );
      testFieldVisibility(
        role,
        '14_MaintenanceFrequencyField.label',
        'jährlich',
        '#temp_and_spatial',
        true
      );
      testFieldVisibility(role, '15_KeywordsField.label', 'Betriebswasser,', '#basedata', true);
      testFieldVisibility(
        role,
        '16_DeliveredCoordinateSystemField.label',
        'EPSG:25833',
        '#temp_and_spatial',
        true
      );
      testFieldVisibility(
        role,
        '17_CoordinateSystemField.label',
        'displayfield.noValue',
        '#temp_and_spatial',
        true
      );
      testFieldVisibility(
        role,
        '18_ExtentField.label',
        '13.079, 52.3284, 13.7701, 52.68779 (EPSG:4326)',
        '#temp_and_spatial',
        true
      );
      testFieldVisibility(role, '19_ContactsField.label', 'Peter Klose', '#basedata', true);
      testFieldVisibility(role, '25_TermsOfUseField.label', 'Test Terms', '#classification', true);
      testFieldVisibility(
        role,
        '26_TermsOfUseSourceField.label',
        'displayfield.noValue',
        '#classification',
        true
      );
      testFieldVisibility(role, '28_ResolutionField.label', '222', '#temp_and_spatial', true);
      testFieldVisibility(
        role,
        '28_ResolutionField.label_scale',
        'displayfield.noValue',
        '#temp_and_spatial',
        true
      );
      testFieldVisibility(role, '29_PreviewField.label', 'wefwefwef.png', '#basedata', true);
      testFieldVisibility(role, '30_ContentDescription.label', 'ewf', '#additional', true);
      testFieldVisibility(role, '31_TechnicalDescription.label', 'ewf', '#additional', true);
      testFieldVisibility(role, '32_Lineage.label_title', 'ggg', '#additional', true);
      testFieldVisibility(
        role,
        '32_Lineage.label_date',
        '2025-06-24T00:00:00Z',
        '#additional',
        true
      );
      testFieldVisibility(
        role,
        '32_Lineage.label_identifier',
        'displayfield.noValue',
        '#additional',
        true
      );
      testFieldVisibility(
        role,
        '37_QualityReportCheckField.label',
        'displayfield.noValue',
        '#classification',
        true
      );
      testFieldVisibility(
        role,
        '38_InspireAnnexVersionField.label',
        '1.0',
        '#classification',
        true
      );
      testFieldVisibility(role, '40_ServicesSection.label', 'Anzahl: 3', '#services', true);
      testFieldVisibility(role, '41_AdditionalInformation.label', undefined, '#additional', true);
      testFieldVisibility(
        role,
        'displayfieldsnippets.contentDescriptionDescription',
        'wef',
        '#additional',
        true
      );
      testFieldVisibility(
        role,
        'displayfieldsnippets.contentDescriptionCode',
        'Information',
        '#additional',
        true
      );
      testFieldVisibility(
        role,
        'displayfieldsnippets.contentDescriptionUrl',
        'displayfield.noValue',
        '#additional',
        true
      );
      testFieldVisibility(role, '45_ServiceWorkspace.label', 'workspace1', '#services', true);
      testFieldVisibility(role, '46_ServicePreview.label', 'preview.png', '#services', true);
      testFieldVisibility(role, '47_ServiceLegendImage.label_url', 'weffwe', '#services', true);
      testFieldVisibility(role, '47_ServiceLegendImage.label_format', 'wefwef', '#services', true);
      testFieldVisibility(role, '47_ServiceLegendImage.label_width', '234', '#services', true);
      testFieldVisibility(role, '47_ServiceLegendImage.label_height', '235', '#services', true);
      testFieldVisibility(role, '49_LayerTitle.label', 'a', '#services', true);
      testFieldVisibility(role, '50_LayerName.label', 'ewfwefew', '#services', true);
      testFieldVisibility(role, '51_LayerStyleName.label', 'gggg', '#services', true);
      testFieldVisibility(role, '52_LayerStyleTitle.label', 'ewwefwe', '#services', true);
      testFieldVisibility(role, '53_LayerLegendImage.label', 'wef', '#services', true);
      testFieldVisibility(role, '54_LayerDescription.label', 'ewewff', '#services', true);
      testFieldVisibility(role, '55_LayerDatasource.label', 'ewfefwefw', '#services', true);
      testFieldVisibility(role, '58_ServiceType.label', 'WMS', '#services', true);
      testFieldVisibility(role, '59_ServiceTitle.label', '123 Datentest', '#services', true);
      testFieldVisibility(role, '60_ServiceShortDescription.label', 'dewf', '#services', true);
      testFieldVisibility(
        role,
        '61_FeatureTypeTitle.label',
        'Titel des FeatureTypes',
        '#services',
        true
      );
      testFieldVisibility(role, '62_FeatureTypeName.label', 'my_feature_type', '#services', true);
      testFieldVisibility(role, '63_ColumnsForm.label', undefined, '#services', true);
      testFieldVisibility(role, '64_AttributeName.label', 'Mein Attribut', '#services', true);
      testFieldVisibility(
        role,
        '65_AttributeAlias.label',
        'Der andere Name meines Attributs',
        '#services',
        true
      );
      testFieldVisibility(role, '66_AttributeDatatype.label', 'Date', '#services', true);
      testFieldVisibility(role, '68_LayerSecondaryDatasource.label', '', '#services', true);
      testFieldVisibility(
        role,
        '69_FeatureTypeDescription.label',
        'Kurzbeschreibung des FeatureTypes',
        '#services',
        true
      );
      testFieldVisibility(
        role,
        '70_InspireFormatName.label',
        '0185 GML Application Schema',
        '#classification',
        true
      );
    }

    it('should show comments for every role', async () => {
      for (const role of roles) {
        setMockRoles([role]);
        const { unmount } = render(ReadonlyHarness, { props: { metadata: metadataWithComments } });

        await waitFor(() => {
          expect(screen.getByText('Test User1')).toBeInTheDocument();
        });

        unmount();
      }
    });
  });
});
