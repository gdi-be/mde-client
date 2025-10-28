import type { MetadataCollection } from '../../src/lib/models/metadata';

export default {
  id: 13974,
  created: '2025-07-02T07:35:26.745787Z',
  modified: '2025-07-02T09:29:41.68458Z',
  metadataId: '74634f28-d980-3706-918b-3383b32f0216',
  clonedFromId: null,
  title: 'Adressen im INSPIRE-Datenmodell',
  approved: false,
  status: 'IN_EDIT',
  teamMemberIds: ['9282dbab-a97d-44fa-8f06-042ab34f6de6'],
  ownerId: null,
  assignedUserId: '9282dbab-a97d-44fa-8f06-042ab34f6de6',
  responsibleRole: 'MdeEditor',
  clientMetadata: {
    privacy: 'NONE',
    relatedTopics: 'in_ad_address_onhold@senstadt,in_ad_address@senstadt',
    layers: {
      '04fd4140-d8d5-3835-806b-6c173eb1b167': null,
      '4ee9af96-af7b-311d-a640-144fdae9235b': null,
      'c0223977-2fb7-3cc5-820c-64644fe5ef7b': [
        {
          name: 'a',
          title: 'a',
          styleName: 'a_DefaultStyle',
          styleTitle: 'qwdqw',
          shortDescription: 'qwdwqqwd',
          legendImage: 'wqdwq',
          secondaryDatasource: 'qwdwqwqd',
          datasource: 'datasource'
        }
      ],
      'e01b0c3e-b634-39ab-bbc4-88ebd01599e8': null,
      'edfcf00b-20fa-330f-8a5a-097713166596': [
        {
          name: 'qwdqwdqdw',
          title: 'Adressen',
          styleName: 'qwddqwqwd',
          styleTitle: 'Address Default Style',
          shortDescription: 'qwddqwqwd',
          legendImage: 'qwqdwqwd',
          datasource: 'qwqdwdqw',
          secondaryDatasource: 'qwddqwqwd'
        }
      ],
      'ee802686-04c0-3345-97ad-005e8bdb3759': [
        {
          name: 'AD.Address',
          title: 'Adressen',
          styleName: 'AD.Address.Default',
          styleTitle: 'AD.Address.Default',
          shortDescription:
            'Kennzeichnung des festen Standorts eines Grundstücks durch eine strukturierte Anordnung von geografischen Bezeichnungen und Identifikatoren.'
        },
        {
          title: 'Adressen im INSPIRE-Datenmodell',
          shortDescription:
            'Die Adresspunkte stellen die Berliner Adressen dar und sind durch Attribute des INSPIRE-Datenmodells "Adressen" beschrieben.'
        }
      ]
    }
  },
  isoMetadata: {
    metadataProfile: 'INSPIRE_HARMONISED',
    inspireTheme: ['AD'],
    inspireFormatName: 'Addresses GML Application Schema',
    inspireAnnexVersion: 'version 4.0',
    distributionVersions: [
      {
        name: 'Addresses GML Application Schema',
        version: 'version 4.0',
        specification: 'D2.8.I.5 Data Specification on Addresses ? Technical Guidelines'
      }
    ],
    fileIdentifier: 'ccaae886-4868-42b8-8ab1-307d51c31076',
    identifier: '74634f28-d980-3706-918b-3383b32f0216',
    title: 'Adressen im INSPIRE-Datenmodell',
    description:
      'Die Adresspunkte stellen die Berliner Adressen dar und sind durch Attribute des INSPIRE-Datenmodells "Adressen" beschrieben.',
    services: [
      {
        workspace: 'ewfewf',
        title: 'Adressen im INSPIRE-Datenmodell - onhold',
        shortDescription:
          'Die Adresspunkte stellen die Berliner Adressen dar und sind durch Attribute des INSPIRE-Datenmodells "Adressen" beschrieben.',
        contentDescription:
          'https://@@ServerName@senstadt@@@@text@senstadt@@AD_AdressenBerlin_K_002.html',
        fileIdentifier: '84399012-7cf5-3be1-8d93-e3639c706a79',
        serviceIdentification: 'c0223977-2fb7-3cc5-820c-64644fe5ef7b',
        serviceType: 'WMS',
        url: 'https://@@ServerName@senstadt@@/fb/wms/senstadt/AD_AdressenBerlin_K_onhold',
        capabilitiesUrl:
          'https://@@ServerName@senstadt@@/fb/wms/senstadt/AD_AdressenBerlin_K_onhold',
        serviceDescriptions: [
          {
            type: 'WMS',
            url: 'https://@@MetaDataServer@senstadt@@84399012-7cf5-3be1-8d93-e3639c706a79'
          },
          {
            type: 'ATOM',
            url: 'https://@@MetaDataServer@senstadt@@571672b8-003a-3236-aaed-ef80226b0bee'
          }
        ],
        legendImage: {
          format: 'image/png',
          url: 'https://@@ServerName@senstadt@@@@leg@senstadt@@leg_INSPIRE_AD_Address_02.png',
          width: 459,
          height: 111
        },
        publications: [],
        updated: '2023-12-31T00:00:00Z',
        published: '2023-03-22T00:00:00Z',
        preview: 'https://@@ServerName@senstadt@@@@leg@senstadt@@leg_INSPIRE_AD_Address_02.png',
        featureTypes: []
      },
      {
        workspace: 'ad_hko',
        title: 'Adressen im INSPIRE-Datenmodell',
        shortDescription:
          'Die Adresspunkte stellen die Berliner Adressen dar und sind durch Attribute des INSPIRE-Datenmodells "Adressen" beschrieben.',
        contentDescription:
          'https://@@ServerName@senstadt@@@@text@senstadt@@AD_AdressenBerlin_K_002.html',
        fileIdentifier: 'ee802686-04c0-3345-97ad-005e8bdb3759',
        serviceIdentification: 'edfcf00b-20fa-330f-8a5a-097713166596',
        serviceType: 'WMS',
        url: 'https://@@WMSServiceServer@senstadt@@ad_hko',
        capabilitiesUrl: 'https://@@WMSServiceServer@senstadt@@ad_hko',
        serviceDescriptions: [
          {
            type: 'WMS',
            url: 'https://@@MetaDataServer@senstadt@@ee802686-04c0-3345-97ad-005e8bdb3759'
          },
          {
            type: 'ATOM',
            url: 'https://@@MetaDataServer@senstadt@@3bd15407-2fa1-3a59-9e6b-c449d955b5e3'
          }
        ],
        legendImage: {
          format: 'image/png',
          url: 'https://@@ServerName@senstadt@@@@leg@senstadt@@leg_INSPIRE_AD_AdressenBerlin.png',
          width: 500,
          height: 147
        },
        publications: [],
        updated: '2023-12-31T00:00:00Z',
        published: '2024-06-13T00:00:00Z',
        preview: 'https://@@ServerName@senstadt@@@@leg@senstadt@@leg_INSPIRE_AD_AdressenBerlin.png',
        featureTypes: []
      },
      {
        workspace: 'a_AD_AdressenBerlin_onhold',
        title: 'Adressen im INSPIRE-Datenmodell - onhold',
        shortDescription:
          'Die Adresspunkte stellen die Berliner Adressen dar und sind durch Attribute des INSPIRE-Datenmodells "Adressen" beschrieben.',
        fileIdentifier: '571672b8-003a-3236-aaed-ef80226b0bee',
        serviceIdentification: '04fd4140-d8d5-3835-806b-6c173eb1b167',
        serviceType: 'ATOM',
        url: 'https://@@ServerName@senstadt@@/fb/feed/senstadt/a_AD_AdressenBerlin_onhold',
        capabilitiesUrl:
          'https://@@ServerName@senstadt@@/fb/feed/senstadt/a_AD_AdressenBerlin_onhold',
        serviceDescriptions: [],
        publications: [],
        featureTypes: [],
        downloads: [
          {
            title: 'Neuer Download0',
            type: 'ewfefw',
            href: 'ewefw',
            fileSize: 234
          }
        ]
      },
      {
        workspace: 'ad_hko',
        title: 'Adressen im INSPIRE-Datenmodell',
        shortDescription:
          'Die Adresspunkte stellen die Berliner Adressen dar und sind durch Attribute des INSPIRE-Datenmodells "Adressen" beschrieben.',
        fileIdentifier: 'd08cf635-4e2c-3f43-b523-18665bcc2a78',
        serviceIdentification: '4ee9af96-af7b-311d-a640-144fdae9235b',
        serviceType: 'WFS',
        url: 'https://@@WFSServiceServer@senstadt@@ad_hko',
        capabilitiesUrl: 'https://@@WFSServiceServer@senstadt@@ad_hko',
        serviceDescriptions: [],
        publications: [],
        updated: '2023-12-31T00:00:00Z',
        published: '2024-06-13T00:00:00Z',
        preview: 'https://@@ServerName@senstadt@@/fb_daten/vorschau/sachdaten/svor_default.gif',
        featureTypes: [
          {
            columns: [
              {
                name: 'Neues Attribut0',
                alias: 'Neues Attribut0',
                type: 'Date'
              }
            ],
            name: 'ad_hko_Address',
            shortDescription: 'ad_hko_Address description',
            title: 'Adresse'
          },
          {
            columns: [
              {
                name: 'Neues Attribut0',
                alias: 'Neues Attribut0',
                type: 'Date'
              }
            ],
            name: 'adfad',
            shortDescription: 'adfad description',
            title: 'Bezeichnung der Verwaltungseinheit'
          },
          {
            columns: [
              {
                name: 'Neues Attribut0',
                alias: 'Neues Attribut0',
                type: 'Double'
              }
            ],
            name: 'adfdas',
            shortDescription: 'adfdas description',
            title: 'Bezeichnung des Verkehrswegs'
          },
          {
            columns: [
              {
                name: 'Neues Attribut0',
                alias: 'Neues Attribut0',
                type: 'Date'
              }
            ],
            name: 'adfasds',
            shortDescription: 'adfasds description',
            title: 'Name des Adressbereichs'
          },
          {
            columns: [
              {
                name: 'Neues Attribut0',
                alias: 'Neues Attribut0',
                type: 'Date'
              }
            ],
            name: 'adfadasf',
            shortDescription: 'adfadasf description',
            title: 'Postalischer Deskriptor'
          }
        ]
      },
      {
        workspace: 'a_AD_AdressenBerlin',
        title: 'Adressen im INSPIRE-Datenmodell',
        shortDescription:
          'Die Adresspunkte stellen die Berliner Adressen dar und sind durch Attribute des INSPIRE-Datenmodells "Adressen" beschrieben.',
        fileIdentifier: '3bd15407-2fa1-3a59-9e6b-c449d955b5e3',
        serviceIdentification: 'e01b0c3e-b634-39ab-bbc4-88ebd01599e8',
        serviceType: 'ATOM',
        url: 'https://@@ServerName@senstadt@@/fb/feed/senstadt/a_AD_AdressenBerlin',
        capabilitiesUrl: 'https://@@ServerName@senstadt@@/fb/feed/senstadt/a_AD_AdressenBerlin',
        serviceDescriptions: [],
        publications: [],
        featureTypes: [],
        downloads: [
          {
            title: 'Neuer Download0',
            type: 'efwefw',
            href: 'ewfew',
            fileSize: 24243
          }
        ]
      }
    ],
    keywords: {
      default: [
        {
          keyword: 'Adressen Berlin'
        },
        {
          keyword: 'HKO'
        },
        {
          keyword: 'Georeferenzierte Gebäudeadresse'
        },
        {
          keyword: 'Hauskoordinaten'
        },
        {
          keyword: 'amtlichen Hauskoordinaten'
        },
        {
          keyword: 'INSPIRE'
        },
        {
          keyword: 'Adresse'
        },
        {
          keyword: 'Straße'
        },
        {
          keyword: 'Hausnummer'
        },
        {
          keyword: 'Grundstücksnummer'
        },
        {
          keyword: 'Blocknummer'
        },
        {
          keyword: 'Ortsteil'
        },
        {
          keyword: 'Bezirk'
        },
        {
          keyword: 'PLZ'
        },
        {
          keyword: 'SenStadtWohn'
        },
        {
          keyword: 'Senatsverwaltung für Stadtentwicklung, Bauen und Wohnen'
        },
        {
          keyword: 'RBS'
        },
        {
          keyword: 'Amt für Statistik Berlin Brandenburg'
        },
        {
          keyword: 'Regionales Bezugssystem Berlin'
        },
        {
          keyword: 'Address'
        },
        {
          keyword: 'Addresses'
        },
        {
          keyword: 'AD'
        }
      ],
      'Spatial scope': [
        {
          namespace: 'http://inspire.ec.europa.eu/metadata-codelist/SpatialScope/regional',
          keyword: 'Regional'
        }
      ]
    },
    thesauri: {
      default: {},
      'Spatial scope': {
        title: 'Spatial scope',
        namespace: 'http://inspire.ec.europa.eu/metadata-codelist/SpatialScope',
        date: '2019-05-22T00:00:00Z',
        code: 'publication'
      }
    },
    highValueDataset: false,
    dateTime: '2024-11-06T14:14:27Z',
    published: '2024-06-13T00:00:00Z',
    modified: '2023-12-31T00:00:00Z',
    contacts: [
      {
        organisation: 'Senatsverwaltung für Stadtentwicklung, Bauen und Wohnen Berlin',
        phone: '+4930901395257',
        email: 'fisbroker@senstadt.berlin.de',
        code: 'information',
        url: 'http://www.stadtentwicklung.berlin.de/geoinformation/fis-broker/',
        roleCode: 'pointOfContact'
      }
    ],
    pointsOfContact: [
      {
        name: 'Geoservice',
        organisation: 'Amt für Statistik Berlin-Brandenburg',
        phone: '3232432324',
        email: 'geoservice@statistik-bbb.de'
      }
    ],
    scale: 50,
    preview: 'https://@@ServerName@senstadt@@/fb_daten/vorschau/karten/karte_inspire_AD.gif',
    crs: 'http://www.opengis.net/def/crs/EPSG/0/25833',
    extent: {
      minx: 13.079,
      miny: 52.3284,
      maxx: 13.7701,
      maxy: 52.6877
    },
    maintenanceFrequency: 'asNeeded',
    contentDescriptions: [
      {
        url: 'https://gdi.berlin.de/viewer/main/?Map/layerIds=hintergrund_default_grau,ad_hko:AD.Address',
        description: 'Darstellung der Daten im Geoportal Berlin',
        code: 'information'
      },
      {
        url: 'https://@@ServerName@senstadt@@/fb/feed/senstadt/a_AD_AdressenBerlin',
        description: 'Downloaddienst - Adressen im INSPIRE-Datenmodell (Atom)',
        code: 'download'
      }
    ],
    contentDescription:
      'https://@@ServerName@senstadt@@@@text@senstadt@@AD_AdressenBerlin_K_002.html',
    lineage: [
      {
        title: 'Adressen Berlin'
      }
    ],
    valid: true,
    topicCategory: ['location'],
    termsOfUseId: 2,
    termsOfUseSource: '[Quelle] / [Titel des Datensatzes]',
    dataBases: [],
    spatialRepresentationTypes: ['vector']
  },
  technicalMetadata: {
    categories: [
      {
        type: 'application/x-gmz',
        url: 'https://@@Atom@senstadt@@AD_onhold/AD_AdressenBerlin_onhold.zip'
      },
      {
        title: 'Daten im GML-Format gezippt (26.5 MB)',
        type: 'application/x-gmz',
        url: 'https://@@Atom@senstadt@@AD/AD_AdressenBerlin.zip'
      }
    ],
    deliveredCrs: 'EPSG:25833'
  }
} satisfies MetadataCollection;
