import type { ColumnInfo, FeatureType, Layer, Service } from '$lib/models/metadata';
import { getFieldConfig } from '$lib/context/FormContext.svelte';

/**
 * Validates a single column and returns whether it's valid
 */
export function validateColumn(column: ColumnInfo): boolean {
  const nameFieldConfig = getFieldConfig(64);
  const aliasFieldConfig = getFieldConfig(65);
  const typeFieldConfig = getFieldConfig(66);

  const nameValidation = nameFieldConfig?.validator(column.name);
  const aliasValidation = aliasFieldConfig?.validator(column.alias);
  const typeValidation = typeFieldConfig?.validator(column.type);

  return (
    nameValidation?.valid !== false &&
    aliasValidation?.valid !== false &&
    typeValidation?.valid !== false
  );
}

/**
 * Validates all columns and returns a Set of invalid column indices
 */
export function validateColumns(columns: ColumnInfo[]): Set<number> {
  const invalidIndices = new Set<number>();

  columns.forEach((column, index) => {
    if (!validateColumn(column)) {
      invalidIndices.add(index);
    }
  });

  return invalidIndices;
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
  const titleFieldConfig = getFieldConfig(61);
  const nameFieldConfig = getFieldConfig(62);
  const descriptionFieldConfig = getFieldConfig(69);
  const columnsFieldConfig = getFieldConfig(63);

  const titleValidation = titleFieldConfig?.validator(featureType.title);
  const nameValidation = nameFieldConfig?.validator(featureType.name);
  const descriptionValidation = descriptionFieldConfig?.validator(featureType.shortDescription);
  const columnsValidation = columnsFieldConfig?.validator(featureType.columns);

  const fieldsValid =
    titleValidation?.valid !== false &&
    nameValidation?.valid !== false &&
    descriptionValidation?.valid !== false &&
    columnsValidation?.valid !== false;

  // Also check if columns have invalid tabs
  const columnsValid = !hasInvalidColumns(featureType.columns || []);

  return fieldsValid && columnsValid;
}

/**
 * Validates all feature types and returns a Set of invalid feature type indices
 */
export function validateFeatureTypes(featureTypes: FeatureType[]): Set<number> {
  const invalidIndices = new Set<number>();

  featureTypes.forEach((featureType, index) => {
    if (!validateFeatureType(featureType)) {
      invalidIndices.add(index);
    }
  });

  return invalidIndices;
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
  const titleFieldConfig = getFieldConfig(49);
  const nameFieldConfig = getFieldConfig(50);
  const styleNameFieldConfig = getFieldConfig(51);
  const styleTitleFieldConfig = getFieldConfig(52);
  const legendImageFieldConfig = getFieldConfig(53);
  const descriptionFieldConfig = getFieldConfig(54);
  const datasourceFieldConfig = getFieldConfig(55);
  const secondaryDatasourceFieldConfig = getFieldConfig(68);

  const titleValidation = titleFieldConfig?.validator(layer.title);
  const nameValidation = nameFieldConfig?.validator(layer.name);
  const styleNameValidation = styleNameFieldConfig?.validator(layer.styleName);
  const styleTitleValidation = styleTitleFieldConfig?.validator(layer.styleTitle);
  const legendImageValidation = legendImageFieldConfig?.validator(layer.legendImage);
  const descriptionValidation = descriptionFieldConfig?.validator(layer.shortDescription);
  const datasourceValidation = datasourceFieldConfig?.validator(layer.datasource);
  const secondaryDatasourceValidation = secondaryDatasourceFieldConfig?.validator(
    layer.secondaryDatasource
  );

  return (
    titleValidation?.valid !== false &&
    nameValidation?.valid !== false &&
    styleNameValidation?.valid !== false &&
    styleTitleValidation?.valid !== false &&
    legendImageValidation?.valid !== false &&
    descriptionValidation?.valid !== false &&
    datasourceValidation?.valid !== false &&
    secondaryDatasourceValidation?.valid !== false
  );
}

/**
 * Validates all layers and returns a Set of invalid layer indices
 */
export function validateLayers(layers: Layer[]): Set<number> {
  const invalidIndices = new Set<number>();

  layers.forEach((layer, index) => {
    if (!validateLayer(layer)) {
      invalidIndices.add(index);
    }
  });

  return invalidIndices;
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
