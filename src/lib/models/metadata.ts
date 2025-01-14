export type JsonClientMetadata = Record<string, unknown>;
export type JsonIsoMetadata = Record<string, unknown>;
export type JsonTechnialMetadata = Record<string, unknown>;

export type MetadataProfile = 'ISO' | 'INSPIRE_HARMONISED' | 'INSPIRE_IDENTIFIED';

export type MaintenanceFrequency = 'continual' | 'daily' | 'weekly' | 'fortnightly' | 'monthly' | 'quarterly' | 'biannually' | 'annually' | 'asNeeded' | 'irregular' | 'notPlanned' | 'unknown';

export type MetadataType = 'CLIENT' | 'ISO' | 'TECHNICAL';

export type MetadataId = `${string}-${string}-${string}-${string}-${string}`;

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
