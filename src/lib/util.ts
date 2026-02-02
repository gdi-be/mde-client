/* eslint-disable @typescript-eslint/no-explicit-any */

import proj4 from 'proj4';
import type { CRS, Extent, MetadataCollection } from '$lib/models/metadata';
import { logger } from 'loggisch';
import type { Role, Token } from '$lib/models/keycloak';
import type { CRSOption } from './models/api';

/**
 * Set a nested value in an object using a dot-separated path. This is similiar
 * to the implementation of lodash.set.
 *
 * @param obj The object to get the value from.
 * @param path The path to the value.
 * @param value The value to set at the path.
 *
 * @returns The value at the path, or undefined if it doesn't exist.
 *
 */
export function setNestedValue(obj: any, path: string | string[], value: any) {
  if (typeof path === 'string') {
    path = path.replace(/\[(\d+)\]/g, '.$1').split('.');
  }

  try {
    let current = JSON.parse(JSON.stringify(obj));

    path.forEach((key, index) => {
      if (index === path.length - 1) {
        current[key] = value;
      } else {
        if (!current[key] || typeof current[key] !== 'object') {
          current[key] = isNaN(Number(path[index + 1])) ? {} : [];
        }
        current = current[key];
      }
    });

    return current;
  } catch {
    logger.error('setNestedValue: Error setting value');
    return obj;
  }
}

/**
 * Get a nested value from an object using a dot-separated path. This is similiar
 * to the implementation of lodash.get.
 *
 * @param obj The object to get the value from.
 * @param path The path to the value.
 *
 * @returns The value at the path, or undefined if it doesn't exist.
 *
 */
export function getNestedValue(obj: any, path: string | string[]) {
  if (typeof path === 'string') {
    path = path.replace(/\[(\d+)\]/g, '.$1').split('.');
  }

  return path.reduce((acc, key) => {
    if (acc && acc[key] !== undefined) {
      return acc[key];
    }
    return undefined;
  }, obj);
}

export function registerCRSCodes(crsOptions: CRSOption[]) {
  crsOptions.forEach((crs) => {
    proj4.defs(crs.label, crs.definition);
  });
}

export function transformExtent(extent: Extent, fromEPSG: CRS, toEPSG: CRS = 'EPSG:4326') {
  if (!fromEPSG || !toEPSG) {
    logger.warning('transformExtent: fromEPSG or toEPSG is not defined');
    return extent;
  }

  const min: [number, number] = [extent.minx, extent.miny];
  const max: [number, number] = [extent.maxx, extent.maxy];
  const transformedMin = transformCoordinate(min, fromEPSG, toEPSG);
  const transformedMax = transformCoordinate(max, fromEPSG, toEPSG);

  // If the original extent had a 0 value, keep it as 0
  return {
    minx: extent.minx === 0 ? 0 : transformedMin[0],
    miny: extent.miny === 0 ? 0 : transformedMin[1],
    maxx: extent.maxx === 0 ? 0 : transformedMax[0],
    maxy: extent.maxy === 0 ? 0 : transformedMax[1]
  };
}

export function transformCoordinate(
  coordinate: [number, number],
  fromEPSG: CRS,
  toEPSG: CRS = 'EPSG:4326'
) {
  const transformedCoordinate = proj4(fromEPSG, toEPSG, [coordinate[0], coordinate[1]]);
  const decimalPlaces = proj4.defs(toEPSG).units === 'm' ? 0 : 5;
  return transformedCoordinate.map((value: number) => parseFloat(value.toFixed(decimalPlaces)));
}

export const getRoleName = (role: Role): string => {
  const roleMapLong: Record<Role, string> = {
    MdeDataOwner: 'Datenhaltende Stelle',
    MdeEditor: 'Redakteur',
    MdeQualityAssurance: 'Qualitätsmanagment',
    MdeAdministrator: 'Administrator'
  };
  return roleMapLong[role];
};

export const getHighestRole = (token?: Token): Role => {
  if (!token || !token.realm_access || !token.realm_access.roles) {
    throw Error('Token is not valid or does not contain roles');
  }
  if (token.realm_access.roles.includes('MdeAdministrator')) return 'MdeAdministrator';
  if (token.realm_access.roles.includes('MdeEditor')) return 'MdeEditor';
  if (token.realm_access.roles.includes('MdeQualityAssurance')) return 'MdeQualityAssurance';
  if (token.realm_access.roles.includes('MdeDataOwner')) return 'MdeDataOwner';
  throw Error('User has no role');
};

/**
 * Utility function to determine if the user can assign themselves to a metadata item.
 * This function checks the user's role and the metadata's current state to determine if
 * the user can assign themselves.
 *
 * @param token The user's token containing their roles and user ID.
 * @param metadata The metadata collection containing information about the metadata item.
 *
 * @returns A boolean indicating whether the user can assign themselves to the metadata item.
 */
export const canAssignSelf = (token?: Token, metadata?: MetadataCollection): boolean => {
  const highestRole = getHighestRole(token);
  const userId = token?.sub;
  const assignedToMe = metadata?.assignedUserId === userId;
  const responsibleRole = metadata?.responsibleRole || '';
  const assignedToSomeoneElse =
    (metadata?.assignedUserId && metadata?.assignedUserId !== userId) || false;
  const isTeamMember = !!(userId && metadata?.teamMemberIds?.includes(userId));
  const isOwner = metadata?.ownerId === userId;

  if (assignedToMe) {
    return false;
  }

  // Admin
  if (highestRole === 'MdeAdministrator') {
    // … can always assign
    return true;
  }

  // Metadata is assigned to someone else
  if (assignedToSomeoneElse) {
    // … cannot assign
    return false;
  }

  // Dataowners
  if (highestRole === 'MdeDataOwner') {
    if (!responsibleRole) {
      // … can assign if no one is responsible and is a team member or owner
      return isOwner || isTeamMember;
    }
    if (responsibleRole === 'MdeDataOwner') {
      // … can assign if responsible and is a team member or owner
      return isOwner || isTeamMember;
    } else {
      // … cannot assign if someone else is responsible (e.g. Editor or QualityAssurance)
      return false;
    }
  }

  // Quality Assurance
  if (highestRole === 'MdeQualityAssurance') {
    if (responsibleRole === 'MdeQualityAssurance') {
      // … can assign if responsible
      return true;
    }
    // … cannot assign if not responsible
    return false;
  }

  // Editor
  if (highestRole === 'MdeEditor') {
    if (!responsibleRole) {
      // … can assign if no one is responsible
      return true;
    }
    if (responsibleRole === 'MdeEditor') {
      // … can assign if responsible
      return true;
    } else {
      // … cannot assign if someone else is responsible (e.g. DataOwner or QualityAssurance)
      return false;
    }
  }

  // Fallback, we should never reach this point
  logger.warning(`Unexpected role: ${highestRole}. Cannot determine assign action.`);
  return false;
};

/**
 * Utility function to determine if the user can unassign themselves from a metadata item.
 * This function checks the user's role and the metadata's current state to determine if
 * the user can unassign themselves.
 *
 * @param token The user's token containing their roles and user ID.
 * @param metadata The metadata collection containing information about the metadata item.
 *
 * @returns A boolean indicating whether the user can unassign themselves from the metadata item.
 */
export const canUnassignSelf = (token?: Token, metadata?: MetadataCollection): boolean => {
  const highestRole = getHighestRole(token);
  const userId = token?.sub;
  const responsibleRole = metadata?.responsibleRole || '';

  if (metadata?.assignedUserId !== userId) {
    return false;
  }

  if (highestRole === 'MdeAdministrator') {
    // Admin can always unassign
    return true;
  }

  if (responsibleRole !== 'MdeDataOwner' && highestRole === responsibleRole) {
    // If the user is responsible and not a DataOwner, they can unassign
    return true;
  }

  return false;
};
