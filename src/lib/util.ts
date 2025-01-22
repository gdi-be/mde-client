/* eslint-disable @typescript-eslint/no-explicit-any */

import proj4 from "proj4";
import type { CRS, Extent } from "./models/metadata";
import { log } from "loggisch";

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

proj4.defs("EPSG:4326","+proj=longlat +datum=WGS84 +no_defs +type=crs");
proj4.defs("EPSG:3857","+proj=merc +a=6378137 +b=6378137 +lat_ts=0 +lon_0=0 +x_0=0 +y_0=0 +k=1 +units=m +nadgrids=@null +wktext +no_defs +type=crs");
proj4.defs("EPSG:25832","+proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs");
proj4.defs("EPSG:25833","+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs");
proj4.defs("EPSG:4258","+proj=longlat +ellps=GRS80 +no_defs +type=crs");
proj4.defs("EPSG:3035","+proj=laea +lat_0=52 +lon_0=10 +x_0=4321000 +y_0=3210000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs");

export function transformExtent(extent: Extent, fromEPSG: CRS, toEPSG: CRS = "EPSG:4326") {
  if (!fromEPSG || !toEPSG) {
    log("warning", "transformExtent: fromEPSG or toEPSG is not defined");
    return extent;
  }

  const min: [number, number] = [extent.minx, extent.miny];
  const max: [number, number] = [extent.maxx, extent.maxy];
  const transformedMin = transformCoordinate(min, fromEPSG, toEPSG);
  const transformedMax = transformCoordinate(max, fromEPSG, toEPSG);
  return {
    minx: transformedMin[0],
    miny: transformedMin[1],
    maxx: transformedMax[0],
    maxy: transformedMax[1],
  };
}

export function transformCoordinate(coordinate: [number, number], fromEPSG: CRS, toEPSG: CRS = "EPSG:4326") {
  const transformedCoordinate = proj4(fromEPSG, toEPSG, [coordinate[0], coordinate[1]]);
  const decimalPlaces = proj4.defs(toEPSG).units === 'm' ? 0 : 5;
  return transformedCoordinate.map((value: number) => parseFloat(value.toFixed(decimalPlaces)));
};
