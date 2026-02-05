import type { ColumnInfo, FeatureType, Layer, Service } from '$lib/models/metadata';
import { getFieldConfig } from '$lib/context/FormContext.svelte';

/**
 * Generic validator helper that checks if all field validations are valid
 */
function validateFields(validations: Array<{ valid?: boolean } | undefined>): boolean {
  return validations.every((v) => v?.valid !== false);
}

/**
 * Validates a single column and returns whether it's valid
 */
export function validateColumn(column: ColumnInfo): boolean {
  const validations = [
    getFieldConfig(64)?.validator(column.name),
    getFieldConfig(65)?.validator(column.alias),
    getFieldConfig(66)?.validator(column.type)
  ];
  return validateFields(validations);
}

/**
 * Validates all columns and returns a Set of invalid column indices
 */
export function validateColumns(columns: ColumnInfo[]): Set<string> {
  const invalidIds = new Set<string>();

  columns.forEach((column, index) => {
    if (!validateColumn(column)) {
      invalidIds.add(column.id);
    }
  });

  return invalidIds;
}

/**
 * Checks if any column in the array is invalid
 */
export function hasInvalidColumns(columns: ColumnInfo[]): boolean {
  return columns.some((column) => !validateColumn(column));
}

/**
 * Validates a single feature type including its columns
 */
export function validateFeatureType(featureType: FeatureType): boolean {
  const validations = [
    getFieldConfig(61)?.validator(featureType.title),
    getFieldConfig(62)?.validator(featureType.name),
    getFieldConfig(69)?.validator(featureType.shortDescription),
    getFieldConfig(63)?.validator(featureType.columns)
  ];

  const fieldsValid = validateFields(validations);
  const columnsValid = !hasInvalidColumns(featureType.columns || []);

  return fieldsValid && columnsValid;
}

/**
 * Validates all feature types and returns a Set of invalid feature type indices
 */
export function validateFeatureTypes(featureTypes: FeatureType[]): Set<string> {
  const invalidIds = new Set<string>();

  featureTypes.forEach((featureType) => {
    if (!validateFeatureType(featureType)) {
      invalidIds.add(featureType.id);
    }
  });

  return invalidIds;
}

/**
 * Checks if any feature type in the array is invalid
 */
export function hasInvalidFeatureTypes(featureTypes: FeatureType[]): boolean {
  return featureTypes.some((featureType) => !validateFeatureType(featureType));
}

/**
 * Validates a single layer
 */
export function validateLayer(layer: Layer): boolean {
  const validations = [
    getFieldConfig(49)?.validator(layer.title),
    getFieldConfig(50)?.validator(layer.name),
    getFieldConfig(51)?.validator(layer.styleName),
    getFieldConfig(52)?.validator(layer.styleTitle),
    getFieldConfig(53)?.validator(layer.legendImage),
    getFieldConfig(54)?.validator(layer.shortDescription),
    getFieldConfig(55)?.validator(layer.datasource),
    getFieldConfig(68)?.validator(layer.secondaryDatasource)
  ];
  return validateFields(validations);
}

/**
 * Validates all layers and returns a Set of invalid layer indices
 */
export function validateLayers(layers: Layer[]): Set<string> {
  const invalidIds = new Set<string>();

  layers.forEach((layer) => {
    if (!validateLayer(layer)) {
      invalidIds.add(layer.id);
    }
  });

  return invalidIds;
}

/**
 * Checks if any layer in the array is invalid
 */
export function hasInvalidLayers(layers: Layer[]): boolean {
  return layers.some((layer) => !validateLayer(layer));
}

/**
 * Validates a service including its layers and feature types
 */
export function validateService(
  service: Service,
  layers?: Layer[]
): { hasInvalidLayers: boolean; hasInvalidFeatureTypes: boolean } {
  const hasInvalidLayersFlag = layers ? hasInvalidLayers(layers) : false;
  const hasInvalidFeatureTypesFlag = service.featureTypes
    ? hasInvalidFeatureTypes(service.featureTypes)
    : false;

  return {
    hasInvalidLayers: hasInvalidLayersFlag,
    hasInvalidFeatureTypes: hasInvalidFeatureTypesFlag
  };
}
