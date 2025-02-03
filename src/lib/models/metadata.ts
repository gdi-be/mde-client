export type JsonClientMetadata = Record<string, unknown>;
export type JsonIsoMetadata = Record<string, unknown>;
export type JsonTechnialMetadata = Record<string, unknown>;

export type IsoTheme = {
  inspireID: string;
  isoName: string;
  inspireName: string;
}

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
  },
  note: string;
}

export type Comment = {
  id: string;
  text: string;
  date: string;
  userId: string;
  userName: string;
}

export type CRS = "EPSG:4326" | "EPSG:3857" | "EPSG:25833" | "EPSG:25832" | "EPSG:4258" | "EPSG:3035";

export type ServiceType = 'WFS' | 'WMS' | 'ATOM' | 'WMTS';

export type ColumnType = 'BigDecimal' | 'Date' | 'Double' | 'Float' | 'Geometry' | 'Integer' | 'Link' | 'Long' | 'Text' | 'Short' | 'Timestamp';

export type FilterType = 'SelectBox' | 'CatalogBox' | 'DoubleEditOrderField' | 'EditField' | 'EditOrderField';

export type ColumnInfo = {
  name?: string;
  title?: string;
  description?: string;
  type?: ColumnType;
  listView?: boolean;
  listViewEnabled?: boolean;
  elementView?: boolean;
  elementViewEnabled?: boolean;
  statisticsView?: boolean;
  filterType?: FilterType;
  minFilterValue?: string;
  maxFilterValue?: string;
  minOrderValue?: string;
  maxOrderValue?: string;
}

export type Source = {
  type?: string;
  content?: string;
}

export type LegendImage = {
  format?: string;
  url?: string;
  width?: number;
  height?: number;
}

export type ServiceDescription = {
  type?: string;
  url?: string;
}

export type Service = {
  title?: string;
  shortDescription?: string;
  contentDescription?: string;
  technicalDescription?: string;
  fileIdentifier?: string;
  serviceIdentification?: string;
  serviceType?: ServiceType;
  url?: string;
  serviceDescriptions?: ServiceDescription[];
  legendImage?: LegendImage;
  dataBases?: Source[];
  publications?: Source[];
  created?: string;
  updated?: string;
  published?: string;
  previews?: Source[];
  columns?: ColumnInfo[];
};

export type MetadataProfile = 'ISO' | 'INSPIRE_HARMONISED' | 'INSPIRE_IDENTIFIED';

export type MaintenanceFrequency = 'continual' | 'daily' | 'weekly' | 'fortnightly' | 'monthly' | 'quarterly' | 'biannually' | 'annually' | 'asNeeded' | 'irregular' | 'notPlanned' | 'unknown';

export type MetadataType = 'CLIENT' | 'ISO' | 'TECHNICAL';

export type MetadataId = `${string}-${string}-${string}-${string}-${string}`;

export type CI_OnLineFunctionCode = 'download' | 'information' | 'offlineAccess' | 'order' | 'search';

export type PreviewMap = {
  crs: string;
  minx: number;
  miny: number;
  maxx: number;
  maxy: number;
  url: string;
}

export type ContentDescription = {
  url: string;
  description: string;
  code: CI_OnLineFunctionCode;
}

export type Extent = {
  maxx: number;
  maxy: number;
  minx: number;
  miny: number;
}

export type Lineage = {
  title: string;
  source: string;
  publishDate: string
};

export type KeyWords = {
  "Spatial scope"?: {
    keyword: string;
    namespace: string;
  }[],
  default: {
    keyword: string;
  }[]
}

export type Previews = {
  content: string;
}[];

export type Contacts = {
  name?: string;
  code?: string;
  email?: string;
  organisation?: string;
  phone?: string;
  roleCode?: string;
  url?: string;
}[]

export type ClientMedata = {
  id: number;
  title: string;
  metadataId: string;
  data: JsonClientMetadata;
};

export type IsoMetadata = {
  id: number;
  title: string;
  metadataId: string;
  data: JsonIsoMetadata;
};

export type TechnicalMetadata = {
  id: number;
  title: string;
  metadataId: string;
  data: JsonTechnialMetadata;
};

export type Metadata = ClientMedata | IsoMetadata | TechnicalMetadata;

export type MetadataCollection = {
  clientMetadata: ClientMedata;
  isoMetadata: IsoMetadata;
  technicalMetadata: TechnicalMetadata;
}

export type MetadataJson = {
  clientMetadata: JsonClientMetadata;
  isoMetadata: JsonIsoMetadata;
  technicalMetadata: JsonTechnialMetadata;
}
