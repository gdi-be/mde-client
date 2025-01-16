/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Get a nested value from an object using a dot-separated path. This is similiar
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
  if (typeof path === "string") {
    path = path.replace(/\[(\d+)\]/g, '.$1').split('.');
  }

  let current = obj;

  path.forEach((key, index) => {
    if (index === path.length - 1) {
      current[key] = value;
    } else {
      if (!current[key] || typeof current[key] !== "object") {
        current[key] = isNaN(Number(path[index + 1])) ? {} : [];
      }
      current = current[key];
    }
  });

  return obj;
}
