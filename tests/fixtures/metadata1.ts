import type { MetadataCollection } from '../../src/lib/models/metadata';

export default {
  id: 13572,
  created: '2025-06-16T14:25:05.368969Z',
  modified: '2025-06-25T08:51:17.210619Z',
  metadataId: 'a723e625-815c-4553-93bf-2fb62bb623d4',
  clonedFromId: null,
  title: '123 Datentest',
  approved: false,
  status: 'NEW',
  teamMemberIds: ['9282dbab-a97d-44fa-8f06-042ab34f6de6', '813793c7-bc20-48e9-8010-3474eeaa3908'],
  ownerId: '813793c7-bc20-48e9-8010-3474eeaa3908',
  assignedUserId: '9282dbab-a97d-44fa-8f06-042ab34f6de6',
  responsibleRole: 'MdeEditor',
  clientMetadata: {
    privacy: 'NONE',
    layers: {
      '00e19242-8d3c-4617-ad73-d5a6b79ae55f': [
        {
          name: 'ewfwefew',
          title: 'a',
          styleName: 'gggg',
          styleTitle: 'ewwefwe',
          shortDescription: 'ewewff',
          legendImage: 'wef',
          datasource: 'ewfefwefw',
          secondaryDatasource: 'ewfewf'
        }
      ]
    }
  },
  isoMetadata: {
    metadataProfile: 'INSPIRE_HARMONISED',
    identifier: 'a723e625-815c-4553-93bf-2fb62bb623d4',
    title: '123 Datentest',
    description: 'wergwergergergergergrge',
    services: [
      {
        workspace: 'ewfewf',
        title: '123 Datentest',
        shortDescription: 'dewf',
        serviceIdentification: '00e19242-8d3c-4617-ad73-d5a6b79ae55f',
        serviceType: 'WMS',
        legendImage: {
          format: 'wefwef',
          url: 'weffwe',
          width: 234,
          height: 234
        },
        preview: 'eeeee'
      },
      {
        title: 'ewfewf',
        shortDescription: 'ewfewfew',
        serviceIdentification: '3a5b3081-a5e0-4133-ad18-ea756331e33f',
        serviceType: 'ATOM',
        downloads: [
          {
            title: 'Neuer Download0',
            type: '',
            href: 'ewfwefew',
            fileSize: 123
          }
        ]
      },
      {
        title: 'WFS Titel',
        shortDescription: 'WFS Kurzbeschreibung',
        serviceIdentification: '284332a8-a765-4fd6-8ac8-66b49fb01794',
        serviceType: 'WFS',
        featureTypes: [
          {
            columns: [
              {
                name: 'Mein Attribut',
                alias: 'Der andere Name meines Attributs',
                type: 'Date',
                filterType: 'CatalogBox'
              },
              {
                name: 'Mein zweites Attribut ',
                alias: 'Attribut 2',
                type: 'Double',
                filterType: 'CatalogBox'
              }
            ],
            name: 'my_feature_type',
            title: 'Titel des FeatureTypes'
          }
        ]
      }
    ],
    keywords: {
      default: [
        {
          keyword: 'Betriebswasser'
        }
      ]
    },
    thesauri: {},
    highValueDataset: false,
    created: '2025-06-05T00:00:00Z',
    published: '2025-06-21T00:00:00Z',
    modified: '2024-06-21T00:00:00Z',
    validFrom: '2025-06-08T00:00:00Z',
    validTo: '2025-06-11T00:00:00Z',
    pointsOfContact: [
      {
        name: 'Peter Klose',
        organisation: 'terrestris GmbH & Co Kg',
        phone: '123123123',
        email: 'kaivol@wefewf.de'
      }
    ],
    resolutions: [222],
    preview: 'wefwefwef.png',
    crs: 'http://www.opengis.net/def/crs/EPSG/0/25833',
    extent: {
      minx: 13.079,
      miny: 52.3284,
      maxx: 13.7701,
      maxy: 52.68779
    },
    maintenanceFrequency: 'annually',
    contentDescriptions: [
      {
        url: '',
        description: 'wef',
        code: 'information'
      }
    ],
    technicalDescription: 'ewf',
    contentDescription: 'ewf',
    lineage: [
      {
        identifier: '',
        title: 'ggg',
        date: '2025-06-24T00:00:00Z'
      }
    ],
    valid: false,
    topicCategory: ['location'],
    termsOfUseId: 1
  },
  technicalMetadata: {
    deliveredCrs: 'EPSG:25833'
  }
} satisfies MetadataCollection;
