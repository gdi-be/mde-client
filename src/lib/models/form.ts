/**
 * The key of the metadata category and the field name, separated by a dot.
 *
 * - The field name itself can contain dots to represent nested fields.
 * - Example: `isoMetadata.title` or `isoMetadata.specialData.specialField`.
 */
export type FieldKey = `${string}.${string}`;

/**
 * An option for Select fields. For this application it always has a key and a label.
 */
export type Option = {
  [key: string]: unknown;
  key: string;
  label: string;
};

/**
 * Represents a mapping of metadata fields to their help descriptions.
 *
 * - The key is a {@link FieldKey} is a dot-separated string consisting of a metadata category and field name.
 * - Example: `category.fieldName` or `category.nested.fieldName`.
 * - The value is the corresponding help description for the field. This can be a markdown string.
 */
export type FormHelp = Record<FieldKey, string>;
