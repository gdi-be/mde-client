export type JsonClientMetadata = Record<string, unknown>;
export type JsonIsoMetadata = Record<string, unknown>;
export type JsonTechnialMetadata = Record<string, unknown>;

export type MetadataProfile = 'ISO' | 'INSPIRE_HARMONISED' | 'INSPIRE_IDENTIFIED';

export type MetadataType = 'CLIENT' | 'ISO' | 'TECHNICAL';

export type MetadataId = `${string}-${string}-${string}-${string}-${string}`;

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
