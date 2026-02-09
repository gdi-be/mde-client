import type { ColumnInfo, FeatureType, Layer, Service } from '$lib/models/metadata';
import { ValidationService, type ValidationContext } from '$lib/services/ValidationService';
import { MetadataService } from '$lib/services/MetadataService';

/**
 * Generic validator helper that checks if all field validations are valid
 */
function validateFields(validations: Array<{ valid?: boolean } | undefined>): boolean {
  return validations.every((v) => v?.valid !== false);
}

/**
 * Validates a single column and returns whether it's valid
 */
export function validateColumn(column: ColumnInfo, context: ValidationContext): boolean {
  const field64 = MetadataService.getFieldConfig(64);
  const field65 = MetadataService.getFieldConfig(65);
  const field66 = MetadataService.getFieldConfig(66);
  const validations = [
    ValidationService.validateField(field64, column.name, context),
    ValidationService.validateField(field65, column.alias, context),
    ValidationService.validateField(field66, column.type, context)
  ];
  return validateFields(validations);
}

/**
 * Validates all columns and returns a Set of invalid column indices
 */
export function validateColumns(columns: ColumnInfo[], context: ValidationContext): Set<string> {
  const invalidIds = new Set<string>();

  columns.forEach((column) => {
    if (!validateColumn(column, context)) {
      invalidIds.add(column.id);
    }
  });

  return invalidIds;
}

/**
 * Checks if any column in the array is invalid
 */
export function hasInvalidColumns(columns: ColumnInfo[], context: ValidationContext): boolean {
  return columns.some((column) => !validateColumn(column, context));
}

/**
 * Validates a single feature type including its columns
 */
export function validateFeatureType(featureType: FeatureType, context: ValidationContext): boolean {
  const field61 = MetadataService.getFieldConfig(61);
  const field62 = MetadataService.getFieldConfig(62);
  const field69 = MetadataService.getFieldConfig(69);
  const field63 = MetadataService.getFieldConfig(63);

  const validations = [
    ValidationService.validateField(field61, featureType.title, context),
    ValidationService.validateField(field62, featureType.name, context),
    ValidationService.validateField(field69, featureType.shortDescription, context),
    ValidationService.validateField(field63, featureType.columns, context)
  ];

  const fieldsValid = validateFields(validations);
  const columnsValid = !hasInvalidColumns(featureType.columns || [], context);

  return fieldsValid && columnsValid;
}

/**
 * Validates all feature types and returns a Set of invalid feature type indices
 */
export function validateFeatureTypes(
  featureTypes: FeatureType[],
  context: ValidationContext
): Set<string> {
  const invalidIds = new Set<string>();

  featureTypes.forEach((featureType) => {
    if (!validateFeatureType(featureType, context)) {
      invalidIds.add(featureType.id);
    }
  });

  return invalidIds;
}

/**
 * Checks if any feature type in the array is invalid
 */
export function hasInvalidFeatureTypes(
  featureTypes: FeatureType[],
  context: ValidationContext
): boolean {
  return featureTypes.some((featureType) => !validateFeatureType(featureType, context));
}

/**
 * Validates a single layer
 */
export function validateLayer(layer: Layer, context: ValidationContext): boolean {
  const field49 = MetadataService.getFieldConfig(49);
  const field50 = MetadataService.getFieldConfig(50);
  const field51 = MetadataService.getFieldConfig(51);
  const field52 = MetadataService.getFieldConfig(52);
  const field53 = MetadataService.getFieldConfig(53);
  const field54 = MetadataService.getFieldConfig(54);
  const field55 = MetadataService.getFieldConfig(55);
  const field68 = MetadataService.getFieldConfig(68);

  const validations = [
    ValidationService.validateField(field49, layer.title, context),
    ValidationService.validateField(field50, layer.name, context),
    ValidationService.validateField(field51, layer.styleName, context),
    ValidationService.validateField(field52, layer.styleTitle, context),
    ValidationService.validateField(field53, layer.legendImage, context),
    ValidationService.validateField(field54, layer.shortDescription, context),
    ValidationService.validateField(field55, layer.datasource, context),
    ValidationService.validateField(field68, layer.secondaryDatasource, context)
  ];
  return validateFields(validations);
}

/**
 * Validates all layers and returns a Set of invalid layer indices
 */
export function validateLayers(layers: Layer[], context: ValidationContext): Set<string> {
  const invalidIds = new Set<string>();

  layers.forEach((layer) => {
    if (!validateLayer(layer, context)) {
      invalidIds.add(layer.id);
    }
  });

  return invalidIds;
}

/**
 * Checks if any layer in the array is invalid
 */
export function hasInvalidLayers(layers: Layer[], context: ValidationContext): boolean {
  return layers.some((layer) => !validateLayer(layer, context));
}

/**
 * Validates a service including its layers and feature types
 */
export function validateService(
  service: Service,
  layers: Layer[] = [],
  context: ValidationContext
): { hasInvalidFields: boolean; hasInvalidLayers: boolean; hasInvalidFeatureTypes: boolean } {
  const field45 = MetadataService.getFieldConfig(45);
  const field46 = MetadataService.getFieldConfig(46);
  const field47 = MetadataService.getFieldConfig(47);
  const field48 = MetadataService.getFieldConfig(48);
  const field56 = MetadataService.getFieldConfig(56);
  const field58 = MetadataService.getFieldConfig(58);
  const field59 = MetadataService.getFieldConfig(59);
  const field60 = MetadataService.getFieldConfig(60);

  const validations = [
    ValidationService.validateField(field45, service.workspace, context),
    ValidationService.validateField(field46, service.preview, context),
    ValidationService.validateField(field47, service.legendImage, context),
    ValidationService.validateField(field48, layers, context),
    ValidationService.validateField(field56, service.featureTypes, context),
    ValidationService.validateField(field58, service.serviceType, context),
    ValidationService.validateField(field59, service.title, context),
    ValidationService.validateField(field60, service.shortDescription, context)
  ];

  const fieldsValid = validateFields(validations);
  const hasInvalidLayersFlag = layers ? hasInvalidLayers(layers, context) : false;
  const hasInvalidFeatureTypesFlag = service.featureTypes
    ? hasInvalidFeatureTypes(service.featureTypes, context)
    : false;

  return {
    hasInvalidFields: !fieldsValid,
    hasInvalidLayers: hasInvalidLayersFlag,
    hasInvalidFeatureTypes: hasInvalidFeatureTypesFlag
  };
}
