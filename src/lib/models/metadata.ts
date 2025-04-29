/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Role } from './keycloak';

// TODO: add typing for the metadata types
export type JsonClientMetadata = Record<string, any>;
export type JsonIsoMetadata = Record<string, any>;
export type JsonTechnialMetadata = Record<string, any>;

export type Layer = {
  name: string;
  title?: string;
  styleName?: string;
  styleTitle?: string;
  shortDescription?: string;
  legendImage?: string;
  datasource?: string;
  secondaryDatasource?: string;
};

export type IsoTheme = {
  inspireID: string;
  isoID: string;
  isoName: string;
};

export type TermsOfUse = {
  id: number;
  shortname: string;
  active: boolean;
  description: string;
  openData: boolean;
  json: {
    id: string;
    name: string;
    url: string;
    source: string;
  };
  note: string;
};

export type Comment = {
  id: string;
  text: string;
  date: string;
  userId: string;
  userName: string;
};

export type CRS = `EPSG:${number}`;

export type ServiceType = 'WFS' | 'WMS' | 'ATOM' | 'WMTS';

export type FeatureType = {
  name: string;
  title: string;
  columns: ColumnInfo[];
};

export type ColumnType =
  | 'BigDecimal'
  | 'Date'
  | 'Double'
  | 'Float'
  | 'Geometry'
  | 'Integer'
  | 'Link'
  | 'Long'
  | 'Text'
  | 'Short'
  | 'Timestamp';

export type FilterType =
  | 'SelectBox'
  | 'CatalogBox'
  | 'DoubleEditOrderField'
  | 'EditField'
  | 'EditOrderField';

export type ColumnInfo = {
  name: string;
  alias: string;
  type?: ColumnType;
  filterType?: FilterType;
};

// TODO: this should probably be an enum
export type DownloadType = string;

export type DownloadInfo = {
  title?: string;
  type?: DownloadType;
  href?: string;
  fileSize?: number;
};

export type Source = {
  type?: string;
  content?: string;
};

export type LegendImage = {
  format?: string;
  url?: string;
  width?: number;
  height?: number;
};

export type ServiceDescription = {
  type?: string;
  url?: string;
};

export type Service = {
  title?: string;
  shortDescription?: string;
  contentDescription?: string;
  technicalDescription?: string;
  fileIdentifier?: string;
  serviceIdentification: string;
  serviceType?: ServiceType;
  url?: string;
  serviceDescriptions?: ServiceDescription[];
  legendImage?: LegendImage;
  dataBases?: Source[];
  publications?: Source[];
  created?: string;
  updated?: string;
  published?: string;
  preview?: string;
  featureTypes?: FeatureType[];
  downloads?: DownloadInfo[];
};

export type MetadataProfile = 'ISO' | 'INSPIRE_HARMONISED' | 'INSPIRE_IDENTIFIED';

export type MaintenanceFrequency =
  | 'continual'
  | 'daily'
  | 'weekly'
  | 'fortnightly'
  | 'monthly'
  | 'quarterly'
  | 'biannually'
  | 'annually'
  | 'asNeeded'
  | 'irregular'
  | 'notPlanned'
  | 'unknown';

export type MetadataType = 'CLIENT' | 'ISO' | 'TECHNICAL';

export type MetadataId = `${string}-${string}-${string}-${string}-${string}`;

export type CI_OnLineFunctionCode =
  | 'download'
  | 'information'
  | 'offlineAccess'
  | 'order'
  | 'search';

export type PreviewMap = {
  crs: string;
  minx: number;
  miny: number;
  maxx: number;
  maxy: number;
  url: string;
};

export type ContentDescription = {
  url: string;
  description: string;
  code: CI_OnLineFunctionCode;
};

export type Extent = {
  maxx: number;
  maxy: number;
  minx: number;
  miny: number;
};

export type Lineage = {
  title: string;
  identifier: string;
  date: string;
};

export type Keywords = {
  [key: string]: {
    keyword: string;
    namespace?: string;
  }[];
  default: {
    keyword: string;
    namespace?: string;
  }[];
};

export type Previews = {
  content: string;
}[];

export type Contact = {
  name?: string;
  code?: string;
  email?: string;
  organisation?: string;
  phone?: string;
  roleCode?: string;
  url?: string;
};

export type Contacts = Contact[];

export type MetadataCollection = {
  id?: string;
  metadataId?: MetadataId;
  teamMemberIds?: string[];
  assignedUserId?: string;
  responsibleRole?: Role;
  approved?: boolean;
  title?: string;
  clientMetadata: JsonClientMetadata;
  isoMetadata: JsonIsoMetadata;
  technicalMetadata: JsonTechnialMetadata;
  status?: 'NEW' | 'IN_EDIT' | 'PUBLISHED';
};
