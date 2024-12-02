export type JsonClientMetadata = Record<string, unknown>;
export type JsonIsoMetadata = Record<string, unknown>;
export type JsonTechnialMetadata = Record<string, unknown>;

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
