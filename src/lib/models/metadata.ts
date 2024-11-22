export type JsonClientMetadata = Record<string, unknown>;

export type Metadata = {
  id: number;
  title: string;
  metadataId: string;
  data: JsonClientMetadata;
};
