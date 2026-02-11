/* eslint-disable @typescript-eslint/no-explicit-any */
import type { FieldKey } from '$lib/models/form';
import type { MetadataCollection, Layer, Service } from '$lib/models/metadata';
import type { Role } from '$lib/models/keycloak';
import {
  FieldConfigs,
  type FullFieldConfig,
  type ValidationResult
} from '$lib/components/Form/FieldsConfig';
import { logger } from 'loggisch';
import { MetadataService } from './MetadataService';

/**
 * Enhanced validation context that includes role information and metadata
 */
export interface ValidationContext {
  /** The highest role of the user */
  HIGHEST_ROLE?: Role;
  /** The metadata collection for context */
  metadata?: MetadataCollection;
  /** Parent value for collection items */
  PARENT_VALUE?: any;
  /** Any additional custom parameters */
  [key: string]: any;
}

/**
 * Invalid field information
 */
export type InvalidFieldInfo = {
  field: FieldKey;
  profileId: number;
  value: any;
  helpText?: string;
};

/**
 * Progress information with validation details
 */
export type ProgressInfo = {
  progress: number; // 0-1, percentage as decimal
  invalidFields?: InvalidFieldInfo[];
};

/**
 * ValidationService provides centralized validation logic
 *
 * Features:
 * - Unified validator interface with HIGHEST_ROLE support
 * - Role-based field validation
 * - Progress calculation with aggregation logic
 * - Collection field handling (services, layers, feature types, etc.)
 * - Extra parameter resolution (metadata values, parent values, roles)
 */
export class ValidationService {
  /**
   * Checks if a user with the given role can edit the specified field.
   *
   * @param highestRole - The highest role of the user
   * @param field - The field configuration
   * @returns true if the role can edit this field, false otherwise
   */
  static canEditField(highestRole: Role, field: FullFieldConfig<any>): boolean {
    if (!highestRole) return false;

    // MdeAdministrator can always edit
    if (highestRole === 'MdeAdministrator') return true;

    // If no specific editingRoles are defined, anyone can edit
    if (!field.editingRoles) return true;

    // Check if the role is in editingRoles
    return field.editingRoles.includes(highestRole);
  }

  /**
   * Determines if a field should be validated based on the user's role and field configuration.
   *
   * @param highestRole - The highest role of the user
   * @param field - The field configuration
   * @returns true if the field should be validated, false otherwise
   */
  static shouldValidateField(highestRole: Role, field: FullFieldConfig<any>): boolean {
    // If field is required and user can edit, validate it
    return field.required === true && ValidationService.canEditField(highestRole, field);
  }

  /**
   * Resolves extra parameters for a validator function.
   * Supports:
   * - HIGHEST_ROLE: The user's highest role
   * - PARENT_VALUE: The parent object in a collection
   * - Other keys: Values from metadata at the specified path
   *
   * @param field - The field configuration
   * @param context - The validation context
   * @returns The resolved extra parameters or undefined
   */
  static getExtraParams(
    field: FullFieldConfig<any>,
    context: ValidationContext
  ): Record<string, any> | undefined {
    if (!field.extraParams || field.extraParams.length === 0) return undefined;

    const extraParams: Record<string, any> = {};

    for (const param of field.extraParams) {
      if (param === 'PARENT_VALUE') {
        if (context.PARENT_VALUE === undefined) {
          logger.warning('PARENT_VALUE is undefined, but requested in extraParams');
          continue;
        }
        extraParams['PARENT_VALUE'] = context.PARENT_VALUE;
      } else if (param === 'HIGHEST_ROLE') {
        if (context.HIGHEST_ROLE) {
          extraParams['HIGHEST_ROLE'] = context.HIGHEST_ROLE;
        }
      } else {
        // Treat as metadata path
        if (context.metadata) {
          const paramValue = MetadataService.getValue(param, context.metadata);
          if (paramValue !== undefined) {
            extraParams[param] = paramValue;
          }
        }
      }
    }

    return Object.keys(extraParams).length > 0 ? extraParams : undefined;
  }

  /**
   * Validates a single field and returns the validation result with extra params.
   *
   * @param field - The field configuration
   * @param value - The value to validate
   * @param context - The validation context
   * @returns The validation result
   */
  static validateField(
    field: FullFieldConfig<any>,
    value: any,
    context: ValidationContext = {}
  ): ValidationResult {
    const extraParams = ValidationService.getExtraParams(field, context);
    return field.validator(value, extraParams);
  }

  /**
   * Validates all fields in a collection (e.g., services, layers, feature types).
   * Returns information about all invalid fields.
   *
   * @param highestRole - The highest role of the user
   * @param section - Optional section to validate
   * @param metadata - The metadata collection
   * @returns Progress information with invalid fields
   */
  static getProgress(
    metadata: MetadataCollection,
    highestRole: Role,
    section?: string
  ): ProgressInfo {
    let totalCount = 0;
    let validCount = 0;
    const invalidFields: InvalidFieldInfo[] = [];

    // Get all required fields that should be validated based on role and section
    const fieldsToValidate = FieldConfigs.filter(({ section: s, required, editingRoles }) => {
      const isEditingRole =
        highestRole === 'MdeAdministrator' ||
        (editingRoles ? editingRoles?.includes(highestRole) : true);

      if (!section) {
        return required && isEditingRole;
      }

      const isSection = s === section;
      return required && isSection && isEditingRole;
    });

    if (!metadata || fieldsToValidate.length === 0) {
      return { progress: 1 };
    }

    // Helper function to validate a single value and track results
    const validateValue = (
      field: FullFieldConfig<any>,
      value: any,
      extraParams: Record<string, any> | undefined,
      fieldPath: FieldKey
    ) => {
      totalCount++;
      const validation = ValidationService.validateField(field, value, {
        ...extraParams,
        HIGHEST_ROLE: highestRole,
        metadata
      });

      if (validation.valid) {
        validCount++;
      } else {
        invalidFields.push({
          field: fieldPath,
          profileId: field.profileId,
          value,
          helpText: validation.helpText
        });
      }
    };

    const validateCollectionField = (
      field: FullFieldConfig<any>,
      parentCollection: any[],
      parentKey: string,
      subKey: string
    ) => {
      parentCollection
        .filter((v) => !!v)
        .forEach((v, i) => {
          const subValue = v[subKey];
          const contextWithParent: ValidationContext = {
            HIGHEST_ROLE: highestRole,
            PARENT_VALUE: v,
            metadata
          };
          const extraParams = ValidationService.getExtraParams(field, contextWithParent);

          // layers need special handling
          if (field.profileId === 48 || field.collectionKey === 'clientMetadata.layers') {
            const layersMap =
              MetadataService.getValue<Record<string, Layer>>('clientMetadata.layers', metadata!) ||
              {};

            for (const [serviceId, layers] of Object.entries(layersMap)) {
              const services = MetadataService.getValue<Service[]>(
                'isoMetadata.services',
                metadata!
              );
              const layerService = services?.find((s) => s.serviceIdentification === serviceId);
              if (!layerService) {
                // No service found for this layer, skip it
                continue;
              }

              const fieldPath = `clientMetadata.layers['${serviceId}']`;
              // handle the 'clientMetadata.layers' collection itself
              if (field.profileId === 48) {
                validateValue(field, layers, extraParams, fieldPath as FieldKey);
              } else if (Array.isArray(layers) && layers.length > 0) {
                // For each layer in the service, validate the subValue
                for (const layer of layers) {
                  validateValue(
                    field,
                    layer[subKey],
                    extraParams,
                    `${fieldPath}[${i}].${subKey}` as FieldKey
                  );
                }
              }
            }
            return;
          }

          // Only validate explicitly marked collections
          if (field.isCollection) {
            if (!Array.isArray(subValue) || subValue.length === 0) {
              validateValue(
                field,
                subValue,
                extraParams,
                `${parentKey}[${i}].${subKey}` as FieldKey
              );
            }
            return;
          }

          // For all other fields
          validateValue(field, subValue, extraParams, `${parentKey}[${i}].${subKey}` as FieldKey);
        });
    };

    const validateField_internal = (field: FullFieldConfig<any>) => {
      // Handle fields that are part of a collection
      if (field.collectionKey) {
        const parentConfig = FieldConfigs.find(({ key }) => key === field.collectionKey);
        if (!parentConfig) return;

        const parentCollection = MetadataService.getAllValues(parentConfig.key, metadata!) as any[];

        // If parent collection is empty or not an array, skip validation
        if (!Array.isArray(parentCollection) || parentCollection.length === 0) {
          return;
        }

        // If parent collection is not empty, validate its fields
        const subKey = field.key.replace(field.collectionKey + '.', '');
        validateCollectionField(field, parentCollection, parentConfig.key, subKey);
        return;
      }

      // For standalone collections, only validate if they don't exist or are empty
      if (field.isCollection) {
        const value = MetadataService.getValue(field.key, metadata!);
        const contextWithHighestRole: ValidationContext = {
          HIGHEST_ROLE: highestRole,
          metadata
        };
        const extraParams = ValidationService.getExtraParams(field, contextWithHighestRole);
        if (!Array.isArray(value) || value.length === 0) {
          validateValue(field, value, extraParams, field.key);
        }
        return;
      }

      // For regular fields (not in collections)
      const contextWithHighestRole: ValidationContext = {
        HIGHEST_ROLE: highestRole,
        metadata
      };
      const extraParams = ValidationService.getExtraParams(field, contextWithHighestRole);
      validateValue(field, MetadataService.getValue(field.key, metadata!), extraParams, field.key);
    };

    // Process all fields
    for (const field of fieldsToValidate) {
      validateField_internal(field);
    }

    // Calculate progress
    if (totalCount === 0) {
      return { progress: 1 };
    }

    return {
      progress: validCount / totalCount,
      invalidFields: invalidFields
    };
  }

  /**
   * Checks if all required fields are valid for the given role.
   *
   * @param highestRole - The highest role of the user
   * @param metadata - The metadata collection
   * @returns true if all required fields are valid, false otherwise
   */
  static allFieldsValid(metadata: MetadataCollection, highestRole: Role): boolean {
    if (!metadata) return false;
    // TODO: maybe we should throw instead
    if (!highestRole) return true;
    const progress = ValidationService.getProgress(metadata, highestRole);
    return progress.progress === 1;
  }
}
